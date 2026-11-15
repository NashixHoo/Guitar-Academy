// =========================================================================
// GUITAR ACADEMY — FASE 2: COMMERCE CORE SERVICES (DUAL-MODE)
// src/services/commerceService.ts
// Serviços modulares independentes:
//   - CommerceConfigService
//   - ProductService
//   - PricingService
//   - PromotionService
//   - CouponService
//   - AccessResolver (integração limpa com Fase 1)
// Opera prioritariamente via Express Backend (/api/admin/commerce/* e /api/commerce/*)
// com fallback Zero-Trust via Firestore Rules (isAdmin()) quando hospedado
// estaticamente (ex: GitHub Pages, onde server.ts não está em execução).
// =========================================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { getProfessorApiBaseUrl } from './professorService';
import {
  logAdminSecurityEvent,
  handleFirestoreError,
  OperationType,
} from './adminLogsService';
import {
  canStudentAccessCourse,
  canStudentAccessLesson,
  canStudentAccessModule,
  evaluateGrantStatus,
  resolveStudentAccessSnapshot,
  resolveStudentEntryPoint,
} from './accessAuthorizationEngine';
import {
  COMMERCE_CONFIRMATION_PHRASE,
  DEFAULT_COMMERCE_CONFIG,
  buildEntitlementsFromPurchase,
  buildEntitlementsFromSubscription,
  createAppliedPriceSnapshot,
  evaluateAndCalculateCoupon,
  generateCommerceId,
  isCommerceStorefrontVisible,
  isSamePriceSlot,
  normalizeCommerceConfig,
  normalizeCouponCode,
  resolveCommerceAndAcademicAccess,
  validateNewPriceVersionInput,
  validateProductCreateInput,
  validateProductUpdateInput,
  validatePromotionInput,
} from './commerceCore';
import type {
  CommerceCurrency,
  CommerceGlobalConfig,
  CommerceOverviewPayload,
  CommerceProduct,
  CommerceProductPrice,
  CommercePromotion,
  CommercePromotionStatus,
  CreateCommercePriceVersionInput,
  CreateCommerceProductInput,
  CreateCommercePromotionInput,
  EvaluateCouponResult,
  UpdateCommerceProductInput,
} from '../types/commerce';

async function tryCommerceApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ ok: true; data: T } | { ok: false; shouldFallback: boolean; status?: number; error?: string }> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { ok: false, shouldFallback: false, status: 401, error: 'Sessão não autenticada.' };
  }

  try {
    const idToken = await currentUser.getIdToken();
    const baseUrl = getProfessorApiBaseUrl();
    const resp = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        ...(options.headers || {}),
      },
    });

    const contentType = resp.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (resp.status === 401 || resp.status === 403 || resp.status === 400 || resp.status === 409) {
      const body = isJson ? ((await resp.json()) as { error?: string; message?: string }) : {};
      return {
        ok: false,
        shouldFallback: false,
        status: resp.status,
        error: body.error || body.message || `Operação recusada pelo servidor (HTTP ${resp.status}).`,
      };
    }

    if (resp.status === 404) {
      if (!isJson) {
        return { ok: false, shouldFallback: true, status: 404 };
      }
      const body = (await resp.json()) as { error?: string };
      return {
        ok: false,
        shouldFallback: false,
        status: 404,
        error: body.error || 'Registro comercial não encontrado.',
      };
    }

    if (resp.status === 503 || !resp.ok || !isJson) {
      return { ok: false, shouldFallback: true, status: resp.status };
    }

    const data = (await resp.json()) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, shouldFallback: true };
  }
}

function requireCurrentAdminActor(): { uid: string; email: string | null } {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Autenticação administrativa obrigatória para esta operação.');
  }
  return {
    uid: currentUser.uid,
    email: currentUser.email ?? null,
  };
}

// =========================================================================
// 1. CommerceConfigService — Controle Global Fail-Closed
// =========================================================================
export const CommerceConfigService = {
  /**
   * Consulta segura para o ambiente do aluno:
   * Sem servidor Express ativo ou se config não existir/estiver desligada,
   * retorna sempre todas as flags como false (Fail-Closed).
   */
  async getSafePublicConfig(): Promise<CommerceGlobalConfig> {
    const apiRes = await tryCommerceApi<{
      status: string;
      commerceEnabled: boolean;
      catalogVisible: boolean;
      config?: Partial<CommerceGlobalConfig>;
    }>('/api/commerce/catalog');

    if (apiRes.ok) {
      return normalizeCommerceConfig({
        ...(apiRes.data.config || {}),
        commerceEnabled: apiRes.data.commerceEnabled,
        catalogVisible: apiRes.data.catalogVisible,
      });
    }
    return { ...DEFAULT_COMMERCE_CONFIG };
  },

  async getAdminConfig(): Promise<{
    config: CommerceGlobalConfig;
    mode: 'backend_admin_sdk' | 'firestore_serverless';
  }> {
    const apiRes = await tryCommerceApi<{
      status: string;
      config: CommerceGlobalConfig;
    }>('/api/admin/commerce/overview');

    if (apiRes.ok && apiRes.data.config) {
      return {
        config: normalizeCommerceConfig(apiRes.data.config),
        mode: 'backend_admin_sdk',
      };
    }
    if (!apiRes.ok && !apiRes.shouldFallback) {
      throw new Error(apiRes.error || 'Falha de permissão ao ler configuração comercial.');
    }

    try {
      const snap = await getDoc(doc(db, 'platform_config', 'commerce'));
      if (!snap.exists()) {
        return { config: { ...DEFAULT_COMMERCE_CONFIG }, mode: 'firestore_serverless' };
      }
      return {
        config: normalizeCommerceConfig(snap.data()),
        mode: 'firestore_serverless',
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'platform_config/commerce');
    }
  },

  async updateGlobalConfig(params: {
    commerceEnabled: boolean;
    catalogVisible: boolean;
    checkoutEnabled: boolean;
    promotionsEnabled: boolean;
    advertisementsEnabled: boolean;
    paidClassesEnabled: boolean;
    subscriptionsEnabled: boolean;
    defaultCurrency?: CommerceCurrency;
    confirmationText?: string;
    reason?: string;
  }): Promise<{ config: CommerceGlobalConfig; mode: 'backend_admin_sdk' | 'firestore_serverless' }> {
    const actor = requireCurrentAdminActor();
    const isEnablingSensitive =
      params.commerceEnabled === true ||
      params.checkoutEnabled === true ||
      params.catalogVisible === true;

    if (
      isEnablingSensitive &&
      String(params.confirmationText || '').trim().toUpperCase() !== COMMERCE_CONFIRMATION_PHRASE
    ) {
      throw new Error(
        `Ativação comercial bloqueada por segurança. Digite exatamente "${COMMERCE_CONFIRMATION_PHRASE}".`
      );
    }

    const apiRes = await tryCommerceApi<{
      status: string;
      config: CommerceGlobalConfig;
    }>('/api/admin/commerce/config', {
      method: 'PUT',
      body: JSON.stringify(params),
    });

    if (apiRes.ok && apiRes.data.config) {
      return {
        config: normalizeCommerceConfig(apiRes.data.config),
        mode: 'backend_admin_sdk',
      };
    }
    if (!apiRes.ok && !apiRes.shouldFallback) {
      throw new Error(apiRes.error || 'Não foi possível atualizar a configuração comercial.');
    }

    // Fallback serverless protegido por Firestore Rules (isAdmin())
    const nowIso = new Date().toISOString();
    const nextConfig: CommerceGlobalConfig = normalizeCommerceConfig({
      configId: 'commerce',
      commerceEnabled: Boolean(params.commerceEnabled),
      catalogVisible: Boolean(params.commerceEnabled && params.catalogVisible),
      checkoutEnabled: Boolean(params.commerceEnabled && params.checkoutEnabled),
      promotionsEnabled: Boolean(params.commerceEnabled && params.promotionsEnabled),
      advertisementsEnabled: Boolean(params.commerceEnabled && params.advertisementsEnabled),
      paidClassesEnabled: Boolean(params.commerceEnabled && params.paidClassesEnabled),
      subscriptionsEnabled: Boolean(params.commerceEnabled && params.subscriptionsEnabled),
      defaultCurrency: params.defaultCurrency || 'BRL',
      updatedAt: nowIso,
      updatedBy: actor.uid,
      updatedByEmail: actor.email,
      lastActivationReason: params.reason ? params.reason.trim().slice(0, 500) : null,
      failClosedVerified: true,
    });

    try {
      await setDoc(doc(db, 'platform_config', 'commerce'), nextConfig);
      await logAdminSecurityEvent({
        eventType: 'commerce_config_updated',
        severity: nextConfig.commerceEnabled ? 'warning' : 'info',
        actorUid: actor.uid,
        actorEmail: actor.email,
        actorRole: 'admin',
        action: `Configuração global comercial atualizada (commerceEnabled=${String(nextConfig.commerceEnabled)})`,
        details: `catalog=${nextConfig.catalogVisible}, checkout=${nextConfig.checkoutEnabled}, promos=${nextConfig.promotionsEnabled}`,
        source: 'admin_portal',
      });
      return { config: nextConfig, mode: 'firestore_serverless' };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'platform_config/commerce');
    }
  },
};

// =========================================================================
// 2. ProductService — Catálogo Comercial Estruturado
// =========================================================================
export const ProductService = {
  async listAdminProducts(): Promise<CommerceProduct[]> {
    const apiRes = await tryCommerceApi<CommerceOverviewPayload>('/api/admin/commerce/overview');
    if (apiRes.ok) {
      return apiRes.data.products || [];
    }
    if (!apiRes.ok && !apiRes.shouldFallback) {
      throw new Error(apiRes.error || 'Sem permissão para listar produtos comerciais.');
    }

    try {
      const snap = await getDocs(collection(db, 'products'));
      return snap.docs
        .map((d) => ({ productId: d.id, ...(d.data() as Record<string, any>) }) as CommerceProduct)
        .sort((a, b) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || ''));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products');
    }
  },

  /**
   * Lista pública para o aluno — SEMPRE retorna [] se commerceEnabled ou
   * catalogVisible estiverem false (Fail-Closed).
   */
  async listPublicVisibleProducts(): Promise<CommerceProduct[]> {
    const apiRes = await tryCommerceApi<{
      commerceEnabled: boolean;
      catalogVisible: boolean;
      products: CommerceProduct[];
    }>('/api/commerce/catalog');

    if (apiRes.ok) {
      if (!apiRes.data.commerceEnabled || !apiRes.data.catalogVisible) {
        return [];
      }
      return (apiRes.data.products || []).filter(
        (p) => p.status === 'active' && p.visibility === 'public'
      );
    }

    const safeCfg = await CommerceConfigService.getSafePublicConfig();
    if (!isCommerceStorefrontVisible(safeCfg)) {
      return [];
    }
    return [];
  },

  async createProduct(input: CreateCommerceProductInput): Promise<CommerceProduct> {
    const actor = requireCurrentAdminActor();
    const validation = validateProductCreateInput(input);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const apiRes = await tryCommerceApi<{ status: string; product: CommerceProduct }>(
      '/api/admin/commerce/products',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );
    if (apiRes.ok) {
      return apiRes.data.product;
    }
    if (!apiRes.ok && !apiRes.shouldFallback) {
      throw new Error(apiRes.error || 'Não foi possível criar o produto comercial.');
    }

    const nowIso = new Date().toISOString();
    const productId = generateCommerceId('prod');
    const product: CommerceProduct = {
      productId,
      name: validation.data.name,
      description: validation.data.description,
      productType: validation.data.productType,
      courseIds: validation.data.courseIds,
      status: validation.data.status,
      visibility: 'hidden', // Sempre inicia oculto
      linkedClassId: validation.data.linkedClassId,
      notes: validation.data.notes,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: actor.uid,
      createdByEmail: actor.email,
    };

    try {
      await setDoc(doc(db, 'products', productId), product);
      await logAdminSecurityEvent({
        eventType: 'commerce_product_created',
        severity: 'info',
        actorUid: actor.uid,
        actorEmail: actor.email,
        actorRole: 'admin',
        action: `Produto comercial criado (oculto): ${product.name}`,
        details: `productId=${productId}, type=${product.productType}, courses=${product.courseIds.join(',')}`,
        source: 'admin_portal',
      });
      return product;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${productId}`);
    }
  },

  async updateProduct(
    productId: string,
    patch: UpdateCommerceProductInput
  ): Promise<CommerceProduct> {
    const actor = requireCurrentAdminActor();
    const apiRes = await tryCommerceApi<{ status: string; product: CommerceProduct }>(
      `/api/admin/commerce/products/${encodeURIComponent(productId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }
    );
    if (apiRes.ok) {
      return apiRes.data.product;
    }
    if (!apiRes.ok && !apiRes.shouldFallback) {
      throw new Error(apiRes.error || 'Não foi possível atualizar o produto comercial.');
    }

    try {
      const ref = doc(db, 'products', productId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        throw new Error('Produto comercial não encontrado.');
      }
      const existing = { productId: snap.id, ...(snap.data() as Record<string, any>) } as CommerceProduct;
      const validated = validateProductUpdateInput(existing, patch);
      if (!validated.valid) {
        throw new Error(validated.error);
      }
      const nextProduct: CommerceProduct = {
        ...validated.nextProduct,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(ref, nextProduct);
      await logAdminSecurityEvent({
        eventType: 'commerce_product_updated',
        severity: 'info',
        actorUid: actor.uid,
        actorEmail: actor.email,
        actorRole: 'admin',
        action: `Produto comercial atualizado: ${nextProduct.name}`,
        details: `productId=${productId}, status=${nextProduct.status}, visibility=${nextProduct.visibility}`,
        source: 'admin_portal',
      });
      return nextProduct;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Produto comercial')) throw error;
      handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
    }
  },
};

// =========================================================================
// 3. PricingService — Versões Imutáveis de Preço e Planos
// =========================================================================
export const PricingService = {
  async listPricesForProduct(productId: string): Promise<CommerceProductPrice[]> {
    const pricesSnap = await getDocs(collection(db, 'product_prices'));
    return pricesSnap.docs
      .map((d) => ({ priceId: d.id, ...(d.data() as Record<string, any>) }) as CommerceProductPrice)
      .filter((p) => p.productId === productId)
      .sort((a, b) => (b.version || 0) - (a.version || 0));
  },

  async createPriceVersion(input: CreateCommercePriceVersionInput): Promise<{
    price: CommerceProductPrice;
    supersededPriceIds: string[];
  }> {
    const actor = requireCurrentAdminActor();
    const validation = validateNewPriceVersionInput(input);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const apiRes = await tryCommerceApi<{
      status: string;
      price: CommerceProductPrice;
      supersededPriceIds: string[];
    }>(`/api/admin/commerce/products/${encodeURIComponent(validation.data.productId)}/prices`, {
      method: 'POST',
      body: JSON.stringify(input),
    });

    if (apiRes.ok) {
      return {
        price: apiRes.data.price,
        supersededPriceIds: apiRes.data.supersededPriceIds || [],
      };
    }
    if (!apiRes.ok && !apiRes.shouldFallback) {
      throw new Error(apiRes.error || 'Não foi possível criar a nova versão de preço.');
    }

    // Fallback transacional protegido por Firestore Rules (nunca sobrescreve valor histórico)
    try {
      const existingPricesSnap = await getDocs(collection(db, 'product_prices'));
      const productPrices = existingPricesSnap.docs
        .map((d) => ({ priceId: d.id, ...(d.data() as Record<string, any>) }) as CommerceProductPrice)
        .filter((p) => p.productId === validation.data.productId);

      const newPriceId = generateCommerceId('price');
      const nowIso = new Date().toISOString();

      const txResult = await runTransaction(db, async (tx) => {
        const productRef = doc(db, 'products', validation.data.productId);
        const productSnap = await tx.get(productRef);
        if (!productSnap.exists()) {
          throw new Error('Produto comercial não encontrado para vincular preço.');
        }

        let maxVersion = 0;
        let previousSameSlot: CommerceProductPrice | null = null;
        const toSupersede: Array<{ ref: ReturnType<typeof doc>; data: CommerceProductPrice }> = [];

        for (const p of productPrices) {
          const priceRef = doc(db, 'product_prices', p.priceId);
          const freshSnap = await tx.get(priceRef);
          if (!freshSnap.exists()) continue;
          const fresh = { priceId: freshSnap.id, ...(freshSnap.data() as Record<string, any>) } as CommerceProductPrice;
          if ((fresh.version || 0) > maxVersion) {
            maxVersion = fresh.version || 0;
          }
          if (
            isSamePriceSlot(fresh, {
              productId: validation.data.productId,
              currency: validation.data.currency,
              billingInterval: validation.data.billingInterval,
              isPromotional: validation.data.isPromotional,
            })
          ) {
            previousSameSlot = fresh;
            toSupersede.push({ ref: priceRef, data: fresh });
          }
        }

        const newPrice: CommerceProductPrice = {
          priceId: newPriceId,
          productId: validation.data.productId,
          currency: validation.data.currency,
          amount: validation.data.amount,
          amountCents: validation.data.amountCents,
          billingInterval: validation.data.billingInterval,
          isPromotional: validation.data.isPromotional,
          promotionalLabel: validation.data.promotionalLabel,
          version: maxVersion + 1,
          previousPriceId: previousSameSlot?.priceId ?? null,
          status: 'active',
          validFrom: validation.data.validFrom,
          validFromMs: validation.data.validFromMs,
          validUntil: validation.data.validUntil,
          validUntilMs: validation.data.validUntilMs,
          notes: validation.data.notes,
          createdAt: nowIso,
          createdBy: actor.uid,
          createdByEmail: actor.email,
          supersededAt: null,
          supersededBy: null,
        };

        for (const oldItem of toSupersede) {
          tx.set(oldItem.ref, {
            ...oldItem.data,
            status: 'superseded',
            supersededAt: nowIso,
            supersededBy: newPriceId,
          });
        }

        tx.set(doc(db, 'product_prices', newPriceId), newPrice);

        return {
          price: newPrice,
          supersededPriceIds: toSupersede.map((i) => i.data.priceId),
        };
      });

      await logAdminSecurityEvent({
        eventType: 'commerce_price_version_created',
        severity: 'info',
        actorUid: actor.uid,
        actorEmail: actor.email,
        actorRole: 'admin',
        action: `Nova versão de preço v${txResult.price.version} registrada (${txResult.price.currency} ${txResult.price.amount.toFixed(2)})`,
        details: `productId=${txResult.price.productId}, interval=${txResult.price.billingInterval}, superseded=${txResult.supersededPriceIds.join(',') || 'none'}`,
        source: 'admin_portal',
      });

      return txResult;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Produto comercial')) throw error;
      handleFirestoreError(error, OperationType.WRITE, 'product_prices');
    }
  },
};

// =========================================================================
// 4. PromotionService & CouponService
// =========================================================================
export const PromotionService = {
  async createPromotion(input: CreateCommercePromotionInput): Promise<CommercePromotion> {
    const actor = requireCurrentAdminActor();
    const validation = validatePromotionInput(input);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const apiRes = await tryCommerceApi<{ status: string; promotion: CommercePromotion }>(
      '/api/admin/commerce/promotions',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );
    if (apiRes.ok) {
      return apiRes.data.promotion;
    }
    if (!apiRes.ok && !apiRes.shouldFallback) {
      throw new Error(apiRes.error || 'Não foi possível criar a promoção/cupom.');
    }

    const nowIso = new Date().toISOString();
    const promotionId = generateCommerceId('promo');
    const promotion: CommercePromotion = {
      promotionId,
      name: validation.data.name,
      description: validation.data.description,
      code: validation.data.code,
      discountType: validation.data.discountType,
      discountValue: validation.data.discountValue,
      scopeType: validation.data.scopeType,
      targetProductIds: validation.data.targetProductIds,
      targetCourseIds: validation.data.targetCourseIds,
      startsAt: validation.data.startsAt,
      startsAtMs: validation.data.startsAtMs,
      endsAt: validation.data.endsAt,
      endsAtMs: validation.data.endsAtMs,
      maxRedemptions: validation.data.maxRedemptions,
      maxPerStudent: validation.data.maxPerStudent,
      redeemedCount: 0,
      eligibleAudience: validation.data.eligibleAudience,
      eligibleStudentUids: validation.data.eligibleStudentUids,
      status: validation.data.status,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: actor.uid,
      createdByEmail: actor.email,
    };

    try {
      await setDoc(doc(db, 'promotions', promotionId), promotion);
      await logAdminSecurityEvent({
        eventType: 'commerce_promotion_created',
        severity: 'info',
        actorUid: actor.uid,
        actorEmail: actor.email,
        actorRole: 'admin',
        action: `Promoção/Cupom criado: ${promotion.name}${promotion.code ? ` [${promotion.code}]` : ''}`,
        details: `promotionId=${promotionId}, scope=${promotion.scopeType}, discount=${promotion.discountValue}`,
        source: 'admin_portal',
      });
      return promotion;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `promotions/${promotionId}`);
    }
  },

  async updatePromotionStatus(
    promotionId: string,
    status: CommercePromotionStatus
  ): Promise<CommercePromotion> {
    const actor = requireCurrentAdminActor();
    const apiRes = await tryCommerceApi<{ status: string; promotion: CommercePromotion }>(
      `/api/admin/commerce/promotions/${encodeURIComponent(promotionId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
    if (apiRes.ok) {
      return apiRes.data.promotion;
    }
    if (!apiRes.ok && !apiRes.shouldFallback) {
      throw new Error(apiRes.error || 'Não foi possível atualizar a promoção.');
    }

    try {
      const ref = doc(db, 'promotions', promotionId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        throw new Error('Promoção/cupom não encontrado.');
      }
      const existing = { promotionId: snap.id, ...(snap.data() as Record<string, any>) } as CommercePromotion;
      const updated: CommercePromotion = {
        ...existing,
        status,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(ref, updated);
      await logAdminSecurityEvent({
        eventType: existing.code ? 'commerce_coupon_updated' : 'commerce_promotion_updated',
        severity: 'info',
        actorUid: actor.uid,
        actorEmail: actor.email,
        actorRole: 'admin',
        action: `Status da promoção "${existing.name}" alterado para "${status}"`,
        details: `promotionId=${promotionId}`,
        source: 'admin_portal',
      });
      return updated;
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) throw error;
      handleFirestoreError(error, OperationType.UPDATE, `promotions/${promotionId}`);
    }
  },
};

export const CouponService = {
  /**
   * Simulação/validação administrativa no servidor (/api/admin/commerce/coupons/validate),
   * com fallback explícito de simulação local somente para preview administrativo
   * (sem permitir checkout real).
   */
  async simulateCouponForAdmin(params: {
    code: string;
    productId: string;
    priceId: string;
    studentUid?: string | null;
    product?: CommerceProduct;
    price?: CommerceProductPrice;
    promotions?: CommercePromotion[];
    config?: CommerceGlobalConfig;
  }): Promise<{ result: EvaluateCouponResult; source: 'backend_authoritative' | 'admin_local_simulation' }> {
    const apiRes = await tryCommerceApi<{ status: string; evaluation: EvaluateCouponResult }>(
      '/api/admin/commerce/coupons/validate',
      {
        method: 'POST',
        body: JSON.stringify({
          code: normalizeCouponCode(params.code),
          productId: params.productId,
          priceId: params.priceId,
          studentUid: params.studentUid || null,
          allowAdminPreview: true,
        }),
      }
    );

    if (apiRes.ok && apiRes.data.evaluation) {
      return { result: apiRes.data.evaluation, source: 'backend_authoritative' };
    }
    if (!apiRes.ok && !apiRes.shouldFallback && apiRes.status !== 400) {
      throw new Error(apiRes.error || 'Erro ao validar cupom no servidor.');
    }

    if (!params.product || !params.price || !params.config) {
      throw new Error(
        'Backend Express indisponível no modo estático e dados locais incompletos para simulação.'
      );
    }

    const normalized = normalizeCouponCode(params.code);
    const matchedPromo =
      (params.promotions || []).find((p) => normalizeCouponCode(p.code || '') === normalized) ||
      null;

    const result = evaluateAndCalculateCoupon({
      code: normalized,
      product: params.product,
      price: params.price,
      promotion: matchedPromo,
      config: params.config,
      studentUid: params.studentUid ?? null,
      allowAdminPreviewWhenDisabled: true,
    });

    return { result, source: 'admin_local_simulation' };
  },
};

export async function fetchAdminCommerceOverview(): Promise<CommerceOverviewPayload> {
  const apiRes = await tryCommerceApi<CommerceOverviewPayload & { status: string }>(
    '/api/admin/commerce/overview'
  );
  if (apiRes.ok) {
    return {
      config: normalizeCommerceConfig(apiRes.data.config),
      products: apiRes.data.products || [],
      prices: apiRes.data.prices || [],
      promotions: apiRes.data.promotions || [],
      mode: 'backend_admin_sdk',
    };
  }
  if (!apiRes.ok && !apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Acesso administrativo comercial negado pelo servidor.');
  }

  try {
    const [configSnap, productsSnap, pricesSnap, promotionsSnap] = await Promise.all([
      getDoc(doc(db, 'platform_config', 'commerce')),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'product_prices')),
      getDocs(collection(db, 'promotions')),
    ]);

    const config = configSnap.exists()
      ? normalizeCommerceConfig(configSnap.data())
      : { ...DEFAULT_COMMERCE_CONFIG };

    const products = productsSnap.docs
      .map((d) => ({ productId: d.id, ...(d.data() as Record<string, any>) }) as CommerceProduct)
      .sort((a, b) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || ''));

    const prices = pricesSnap.docs
      .map((d) => ({ priceId: d.id, ...(d.data() as Record<string, any>) }) as CommerceProductPrice)
      .sort((a, b) => (b.version || 0) - (a.version || 0));

    const promotions = promotionsSnap.docs
      .map((d) => ({ promotionId: d.id, ...(d.data() as Record<string, any>) }) as CommercePromotion)
      .sort((a, b) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || ''));

    return {
      config,
      products,
      prices,
      promotions,
      mode: 'firestore_serverless',
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'platform_config/commerce');
  }
}

// =========================================================================
// 5. AccessResolver — Unificação limpa entre Fase 1 (Gratuito) e Fase 2 (Comercial)
// =========================================================================
export const AccessResolver = {
  resolveStudentAccessSnapshot,
  resolveCommerceAndAcademicAccess,
  canStudentAccessCourse,
  canStudentAccessModule,
  canStudentAccessLesson,
  resolveStudentEntryPoint,
  evaluateGrantStatus,
  buildEntitlementsFromPurchase,
  buildEntitlementsFromSubscription,
  createAppliedPriceSnapshot,
};
