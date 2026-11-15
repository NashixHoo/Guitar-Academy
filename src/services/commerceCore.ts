// =========================================================================
// GUITAR ACADEMY — FASE 2: COMMERCE CORE ENGINE (ISOMÓRFICO)
// src/services/commerceCore.ts
// Lógica pura compartilhada entre Express (server.ts), Client Services e Testes.
// Zero dependências de Firebase Admin SDK ou Client SDK.
// =========================================================================

import { isValidCourseId } from './academicCatalog';
import { resolveStudentAccessSnapshot, type ResolveStudentAccessInput } from './accessAuthorizationEngine';
import type { OfficialCourseId } from '../academia/progress/unlockGate';
import type {
  ExternalCourseEntitlement,
  StudentEffectiveAccessSnapshot,
} from '../types/accessControl';
import type {
  AppliedPriceSnapshot,
  CommerceBillingInterval,
  CommerceCurrency,
  CommerceDiscountType,
  CommerceEligibleAudience,
  CommerceGlobalConfig,
  CommerceProduct,
  CommerceProductPrice,
  CommerceProductStatus,
  CommerceProductType,
  CommerceProductVisibility,
  CommercePromotion,
  CommercePromotionScopeType,
  CommercePromotionStatus,
  CreateCommercePriceVersionInput,
  CreateCommerceProductInput,
  CreateCommercePromotionInput,
  EvaluateCouponInput,
  EvaluateCouponResult,
  UpdateCommerceProductInput,
} from '../types/commerce';

export const COMMERCE_CONFIRMATION_PHRASE = 'CONFIRMAR ATIVACAO COMERCIAL';

export const VALID_COMMERCE_PRODUCT_TYPES: readonly CommerceProductType[] = [
  'individual_course',
  'instrument_bundle',
  'subscription_plan',
  'lifetime_access',
  'experimental_course',
  'paid_class_offer',
] as const;

export const VALID_COMMERCE_PRODUCT_STATUSES: readonly CommerceProductStatus[] = [
  'draft',
  'active',
  'archived',
] as const;

export const VALID_COMMERCE_VISIBILITIES: readonly CommerceProductVisibility[] = [
  'hidden',
  'public',
] as const;

export const VALID_BILLING_INTERVALS: readonly CommerceBillingInterval[] = [
  'one_time',
  'monthly',
  'semiannual',
  'annual',
  'lifetime',
] as const;

export const VALID_CURRENCIES: readonly CommerceCurrency[] = ['BRL', 'USD', 'EUR'] as const;

export const VALID_DISCOUNT_TYPES: readonly CommerceDiscountType[] = [
  'percentage',
  'fixed_amount',
] as const;

export const VALID_PROMOTION_SCOPES: readonly CommercePromotionScopeType[] = [
  'all_products',
  'product',
  'course',
  'bundle',
] as const;

export const VALID_ELIGIBLE_AUDIENCES: readonly CommerceEligibleAudience[] = [
  'all',
  'new_students',
  'enrolled_students',
  'specific_uids',
] as const;

export const VALID_PROMOTION_STATUSES: readonly CommercePromotionStatus[] = [
  'draft',
  'active',
  'paused',
  'ended',
] as const;

export const COMMERCE_CONFIG_FLAG_KEYS = [
  'commerceEnabled',
  'catalogVisible',
  'checkoutEnabled',
  'promotionsEnabled',
  'advertisementsEnabled',
  'paidClassesEnabled',
  'subscriptionsEnabled',
] as const;

export const VALID_COMMERCE_ID_RE = /^[a-zA-Z0-9_\-.:]{1,128}$/;
export const VALID_COUPON_CODE_RE = /^[A-Z0-9_-]{3,40}$/;

export const DEFAULT_COMMERCE_CONFIG: CommerceGlobalConfig = {
  configId: 'commerce',
  commerceEnabled: false,
  catalogVisible: false,
  checkoutEnabled: false,
  promotionsEnabled: false,
  advertisementsEnabled: false,
  paidClassesEnabled: false,
  subscriptionsEnabled: false,
  defaultCurrency: 'BRL',
  updatedAt: null,
  updatedBy: null,
  updatedByEmail: null,
  lastActivationReason: null,
  failClosedVerified: true,
};

/**
 * Normaliza a configuração global comercial aplicando política strict Fail-Closed:
 * Qualquer documento ausente, nulo, não-objeto ou corrompido (chaves com tipo inválido
 * ou `corrupted === true`) força TODAS as flags para `false`.
 */
export function normalizeCommerceConfig(raw: unknown): CommerceGlobalConfig {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_COMMERCE_CONFIG };
  }

  const record = raw as Record<string, unknown>;
  if (record.corrupted === true) {
    return { ...DEFAULT_COMMERCE_CONFIG };
  }
  if ('configId' in record && record.configId !== undefined && record.configId !== 'commerce') {
    return { ...DEFAULT_COMMERCE_CONFIG };
  }

  for (const key of COMMERCE_CONFIG_FLAG_KEYS) {
    if (key in record && record[key] !== undefined && typeof record[key] !== 'boolean') {
      return { ...DEFAULT_COMMERCE_CONFIG };
    }
  }

  const commerceEnabled = record.commerceEnabled === true;
  const currency: CommerceCurrency =
    typeof record.defaultCurrency === 'string' &&
    VALID_CURRENCIES.includes(record.defaultCurrency as CommerceCurrency)
      ? (record.defaultCurrency as CommerceCurrency)
      : 'BRL';

  return {
    configId: 'commerce',
    commerceEnabled,
    catalogVisible: commerceEnabled && record.catalogVisible === true,
    checkoutEnabled: commerceEnabled && record.checkoutEnabled === true,
    promotionsEnabled: commerceEnabled && record.promotionsEnabled === true,
    advertisementsEnabled: commerceEnabled && record.advertisementsEnabled === true,
    paidClassesEnabled: commerceEnabled && record.paidClassesEnabled === true,
    subscriptionsEnabled: commerceEnabled && record.subscriptionsEnabled === true,
    defaultCurrency: currency,
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : null,
    updatedBy: typeof record.updatedBy === 'string' ? record.updatedBy : null,
    updatedByEmail: typeof record.updatedByEmail === 'string' ? record.updatedByEmail : null,
    lastActivationReason:
      typeof record.lastActivationReason === 'string' ? record.lastActivationReason : null,
    failClosedVerified: true,
  };
}

export function isCommerceStorefrontVisible(config: CommerceGlobalConfig): boolean {
  return config.commerceEnabled === true && config.catalogVisible === true;
}

export function isCommerceCheckoutReady(config: CommerceGlobalConfig): boolean {
  return config.commerceEnabled === true && config.checkoutEnabled === true;
}

export function formatCurrencyCents(amountCents: number, currency: CommerceCurrency = 'BRL'): string {
  const value = (Number.isFinite(amountCents) ? amountCents : 0) / 100;
  const locale = currency === 'BRL' ? 'pt-BR' : currency === 'EUR' ? 'de-DE' : 'en-US';
  return value.toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function normalizeCouponCode(raw: string): string {
  return String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

export function generateCommerceId(prefix: 'prod' | 'price' | 'promo' | 'snap'): string {
  const rand = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${Date.now()}_${rand}`;
}

export function validateProductCreateInput(
  input: CreateCommerceProductInput
):
  | {
      valid: true;
      data: {
        name: string;
        description: string;
        productType: CommerceProductType;
        courseIds: OfficialCourseId[];
        status: CommerceProductStatus;
        visibility: 'hidden';
        linkedClassId: string | null;
        notes: string | null;
      };
    }
  | { valid: false; error: string } {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (name.length < 3 || name.length > 120) {
    return { valid: false, error: 'O nome do produto deve ter entre 3 e 120 caracteres.' };
  }

  const description = typeof input.description === 'string' ? input.description.trim() : '';
  if (description.length > 800) {
    return { valid: false, error: 'A descrição do produto deve ter no máximo 800 caracteres.' };
  }

  if (!VALID_COMMERCE_PRODUCT_TYPES.includes(input.productType)) {
    return { valid: false, error: 'Tipo de produto comercial inválido.' };
  }

  const rawCourses = Array.isArray(input.courseIds) ? input.courseIds : [];
  const uniqueCourses: OfficialCourseId[] = [];
  for (const cid of rawCourses) {
    if (!isValidCourseId(cid)) {
      return {
        valid: false,
        error: `Curso inválido no catálogo oficial: "${String(cid)}".`,
      };
    }
    if (!uniqueCourses.includes(cid)) {
      uniqueCourses.push(cid);
    }
  }
  if (uniqueCourses.length === 0) {
    return {
      valid: false,
      error: 'Selecione ao menos um curso oficial válido do catálogo do Guitar Academy.',
    };
  }

  const status: CommerceProductStatus =
    input.status && VALID_COMMERCE_PRODUCT_STATUSES.includes(input.status)
      ? input.status
      : 'draft';

  const linkedClassId =
    typeof input.linkedClassId === 'string' && input.linkedClassId.trim()
      ? input.linkedClassId.trim()
      : null;
  if (linkedClassId && !VALID_COMMERCE_ID_RE.test(linkedClassId)) {
    return { valid: false, error: 'Identificador da turma associada é inválido.' };
  }

  const notes =
    typeof input.notes === 'string' && input.notes.trim()
      ? input.notes.trim().slice(0, 500)
      : null;

  // INVARIANTE OBRIGATÓRIO: Produtos novos SEMPRE iniciam com visibility = 'hidden'.
  return {
    valid: true,
    data: {
      name,
      description,
      productType: input.productType,
      courseIds: uniqueCourses,
      status,
      visibility: 'hidden',
      linkedClassId,
      notes,
    },
  };
}

export function validateProductUpdateInput(
  existing: CommerceProduct,
  patch: UpdateCommerceProductInput
):
  | { valid: true; nextProduct: Omit<CommerceProduct, 'updatedAt'> }
  | { valid: false; error: string } {
  const nextName = patch.name !== undefined ? String(patch.name).trim() : existing.name;
  if (nextName.length < 3 || nextName.length > 120) {
    return { valid: false, error: 'O nome do produto deve ter entre 3 e 120 caracteres.' };
  }

  const nextDescription =
    patch.description !== undefined ? String(patch.description).trim() : existing.description;
  if (nextDescription.length > 800) {
    return { valid: false, error: 'A descrição do produto deve ter no máximo 800 caracteres.' };
  }

  const nextType = patch.productType ?? existing.productType;
  if (!VALID_COMMERCE_PRODUCT_TYPES.includes(nextType)) {
    return { valid: false, error: 'Tipo de produto comercial inválido.' };
  }

  let nextCourseIds = existing.courseIds;
  if (patch.courseIds !== undefined) {
    const raw = Array.isArray(patch.courseIds) ? patch.courseIds : [];
    const deduped: OfficialCourseId[] = [];
    for (const cid of raw) {
      if (!isValidCourseId(cid)) {
        return { valid: false, error: `Curso inválido no catálogo oficial: "${String(cid)}".` };
      }
      if (!deduped.includes(cid)) deduped.push(cid);
    }
    if (deduped.length === 0) {
      return { valid: false, error: 'O produto deve permanecer associado a pelo menos um curso válido.' };
    }
    nextCourseIds = deduped;
  }

  const nextStatus = patch.status ?? existing.status;
  if (!VALID_COMMERCE_PRODUCT_STATUSES.includes(nextStatus)) {
    return { valid: false, error: 'Status do produto inválido.' };
  }

  const nextVisibility = patch.visibility ?? existing.visibility;
  if (!VALID_COMMERCE_VISIBILITIES.includes(nextVisibility)) {
    return { valid: false, error: 'Visibilidade do produto inválida.' };
  }

  const nextLinkedClassId =
    patch.linkedClassId !== undefined
      ? patch.linkedClassId && patch.linkedClassId.trim()
        ? patch.linkedClassId.trim()
        : null
      : existing.linkedClassId ?? null;
  if (nextLinkedClassId && !VALID_COMMERCE_ID_RE.test(nextLinkedClassId)) {
    return { valid: false, error: 'Identificador da turma vinculada é inválido.' };
  }

  const nextNotes =
    patch.notes !== undefined
      ? patch.notes && patch.notes.trim()
        ? patch.notes.trim().slice(0, 500)
        : null
      : existing.notes ?? null;

  return {
    valid: true,
    nextProduct: {
      ...existing,
      name: nextName,
      description: nextDescription,
      productType: nextType,
      courseIds: nextCourseIds,
      status: nextStatus,
      visibility: nextVisibility,
      linkedClassId: nextLinkedClassId,
      notes: nextNotes,
    },
  };
}

export function validateNewPriceVersionInput(
  input: CreateCommercePriceVersionInput
):
  | {
      valid: true;
      data: {
        productId: string;
        currency: CommerceCurrency;
        amount: number;
        amountCents: number;
        billingInterval: CommerceBillingInterval;
        isPromotional: boolean;
        promotionalLabel: string | null;
        validFrom: string | null;
        validFromMs: number | null;
        validUntil: string | null;
        validUntilMs: number | null;
        notes: string | null;
      };
    }
  | { valid: false; error: string } {
  const productId = typeof input.productId === 'string' ? input.productId.trim() : '';
  if (!VALID_COMMERCE_ID_RE.test(productId)) {
    return { valid: false, error: 'Identificador de produto inválido.' };
  }

  const currency: CommerceCurrency = input.currency || 'BRL';
  if (!VALID_CURRENCIES.includes(currency)) {
    return { valid: false, error: 'Moeda não suportada. Utilize BRL, USD ou EUR.' };
  }

  const numericAmount = Number(input.amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 1_000_000) {
    return {
      valid: false,
      error: 'Informe um valor monetário válido maior que zero.',
    };
  }
  const amountCents = Math.round(numericAmount * 100);
  if (amountCents < 100) {
    return {
      valid: false,
      error: 'O valor mínimo para registro de versão de preço é de 1,00 na moeda selecionada.',
    };
  }
  const normalizedAmount = Number((amountCents / 100).toFixed(2));

  if (!VALID_BILLING_INTERVALS.includes(input.billingInterval)) {
    return { valid: false, error: 'Recorrência/intervalo de cobrança inválido.' };
  }

  let validFrom: string | null = null;
  let validFromMs: number | null = null;
  if (input.validFrom) {
    const parsed = Date.parse(String(input.validFrom));
    if (Number.isNaN(parsed)) {
      return { valid: false, error: 'Data de início de vigência do preço inválida.' };
    }
    validFrom = new Date(parsed).toISOString();
    validFromMs = parsed;
  }

  let validUntil: string | null = null;
  let validUntilMs: number | null = null;
  if (input.validUntil) {
    const parsed = Date.parse(String(input.validUntil));
    if (Number.isNaN(parsed)) {
      return { valid: false, error: 'Data de término de vigência do preço inválida.' };
    }
    validUntil = new Date(parsed).toISOString();
    validUntilMs = parsed;
  }

  if (validFromMs !== null && validUntilMs !== null && validUntilMs <= validFromMs) {
    return {
      valid: false,
      error: 'A data final de vigência deve ser posterior à data inicial.',
    };
  }

  const isPromotional = Boolean(input.isPromotional);
  const promotionalLabel =
    isPromotional && typeof input.promotionalLabel === 'string' && input.promotionalLabel.trim()
      ? input.promotionalLabel.trim().slice(0, 80)
      : null;

  const notes =
    typeof input.notes === 'string' && input.notes.trim()
      ? input.notes.trim().slice(0, 500)
      : null;

  return {
    valid: true,
    data: {
      productId,
      currency,
      amount: normalizedAmount,
      amountCents,
      billingInterval: input.billingInterval,
      isPromotional,
      promotionalLabel,
      validFrom,
      validFromMs,
      validUntil,
      validUntilMs,
      notes,
    },
  };
}

export function isSamePriceSlot(
  existing: CommerceProductPrice,
  nextSlot: {
    productId: string;
    currency: CommerceCurrency;
    billingInterval: CommerceBillingInterval;
    isPromotional: boolean;
  }
): boolean {
  return (
    existing.status === 'active' &&
    existing.productId === nextSlot.productId &&
    existing.currency === nextSlot.currency &&
    existing.billingInterval === nextSlot.billingInterval &&
    Boolean(existing.isPromotional) === Boolean(nextSlot.isPromotional)
  );
}

export function createAppliedPriceSnapshot(params: {
  product: Pick<CommerceProduct, 'productId' | 'name'>;
  price: Pick<
    CommerceProductPrice,
    'priceId' | 'version' | 'currency' | 'billingInterval' | 'amountCents' | 'amount'
  >;
  discountAmountCents?: number;
  promotionId?: string | null;
  couponCode?: string | null;
  capturedAt?: string;
}): AppliedPriceSnapshot {
  const baseAmountCents = Math.max(0, Math.round(params.price.amountCents));
  const rawDiscount = Math.max(0, Math.round(params.discountAmountCents ?? 0));
  const discountAmountCents = Math.min(baseAmountCents, rawDiscount);
  const finalAmountCents = Math.max(0, baseAmountCents - discountAmountCents);

  return {
    snapshotId: generateCommerceId('snap'),
    productId: params.product.productId,
    productName: params.product.name,
    priceId: params.price.priceId,
    priceVersion: params.price.version,
    currency: params.price.currency,
    billingInterval: params.price.billingInterval,
    baseAmount: Number((baseAmountCents / 100).toFixed(2)),
    baseAmountCents,
    discountAmount: Number((discountAmountCents / 100).toFixed(2)),
    discountAmountCents,
    finalAmount: Number((finalAmountCents / 100).toFixed(2)),
    finalAmountCents,
    promotionId: params.promotionId ?? null,
    couponCode: params.couponCode ?? null,
    capturedAt: params.capturedAt || new Date().toISOString(),
  };
}

export function validatePromotionInput(
  input: CreateCommercePromotionInput
):
  | {
      valid: true;
      data: {
        name: string;
        description: string | null;
        code: string | null;
        discountType: CommerceDiscountType;
        discountValue: number;
        scopeType: CommercePromotionScopeType;
        targetProductIds: string[];
        targetCourseIds: OfficialCourseId[];
        startsAt: string | null;
        startsAtMs: number | null;
        endsAt: string | null;
        endsAtMs: number | null;
        maxRedemptions: number | null;
        maxPerStudent: number | null;
        eligibleAudience: CommerceEligibleAudience;
        eligibleStudentUids: string[];
        status: CommercePromotionStatus;
      };
    }
  | { valid: false; error: string } {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (name.length < 3 || name.length > 120) {
    return { valid: false, error: 'O nome da promoção/cupom deve ter entre 3 e 120 caracteres.' };
  }

  const description =
    typeof input.description === 'string' && input.description.trim()
      ? input.description.trim().slice(0, 500)
      : null;

  let code: string | null = null;
  if (input.code !== undefined && input.code !== null && String(input.code).trim() !== '') {
    const normalized = normalizeCouponCode(input.code);
    if (!VALID_COUPON_CODE_RE.test(normalized)) {
      return {
        valid: false,
        error: 'O código do cupom deve conter entre 3 e 40 caracteres (A-Z, 0-9, _ ou -).',
      };
    }
    code = normalized;
  }

  if (!VALID_DISCOUNT_TYPES.includes(input.discountType)) {
    return { valid: false, error: 'Tipo de desconto inválido.' };
  }

  const discountValue = Number(input.discountValue);
  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    return { valid: false, error: 'O valor do desconto deve ser maior que zero.' };
  }
  if (input.discountType === 'percentage' && discountValue > 100) {
    return { valid: false, error: 'O desconto percentual não pode ultrapassar 100%.' };
  }
  if (input.discountType === 'fixed_amount' && discountValue > 1_000_000) {
    return { valid: false, error: 'Valor de desconto fixo acima do limite permitido.' };
  }

  if (!VALID_PROMOTION_SCOPES.includes(input.scopeType)) {
    return { valid: false, error: 'Escopo da promoção inválido.' };
  }

  const targetProductIds: string[] = [];
  for (const pid of Array.isArray(input.targetProductIds) ? input.targetProductIds : []) {
    const cleaned = String(pid || '').trim();
    if (!VALID_COMMERCE_ID_RE.test(cleaned)) {
      return { valid: false, error: `ID de produto alvo inválido: "${cleaned}".` };
    }
    if (!targetProductIds.includes(cleaned)) targetProductIds.push(cleaned);
  }

  const targetCourseIds: OfficialCourseId[] = [];
  for (const cid of Array.isArray(input.targetCourseIds) ? input.targetCourseIds : []) {
    if (!isValidCourseId(cid)) {
      return { valid: false, error: `Curso alvo inválido: "${String(cid)}".` };
    }
    if (!targetCourseIds.includes(cid)) targetCourseIds.push(cid);
  }

  if ((input.scopeType === 'product' || input.scopeType === 'bundle') && targetProductIds.length === 0) {
    return {
      valid: false,
      error: 'Informe ao menos um produto alvo para promoções por produto ou pacote.',
    };
  }
  if (input.scopeType === 'course' && targetCourseIds.length === 0) {
    return {
      valid: false,
      error: 'Informe ao menos um curso oficial alvo para cupons por curso.',
    };
  }

  let startsAt: string | null = null;
  let startsAtMs: number | null = null;
  if (input.startsAt) {
    const parsed = Date.parse(String(input.startsAt));
    if (Number.isNaN(parsed)) {
      return { valid: false, error: 'Data de início da promoção inválida.' };
    }
    startsAt = new Date(parsed).toISOString();
    startsAtMs = parsed;
  }

  let endsAt: string | null = null;
  let endsAtMs: number | null = null;
  if (input.endsAt) {
    const parsed = Date.parse(String(input.endsAt));
    if (Number.isNaN(parsed)) {
      return { valid: false, error: 'Data de encerramento da promoção inválida.' };
    }
    endsAt = new Date(parsed).toISOString();
    endsAtMs = parsed;
  }

  if (startsAtMs !== null && endsAtMs !== null && endsAtMs <= startsAtMs) {
    return {
      valid: false,
      error: 'A data de encerramento deve ser posterior à data de início.',
    };
  }

  let maxRedemptions: number | null = null;
  if (input.maxRedemptions !== undefined && input.maxRedemptions !== null) {
    const parsedMax = Number(input.maxRedemptions);
    if (!Number.isInteger(parsedMax) || parsedMax < 1 || parsedMax > 1_000_000) {
      return { valid: false, error: 'Limite global de usos inválido.' };
    }
    maxRedemptions = parsedMax;
  }

  let maxPerStudent: number | null = null;
  if (input.maxPerStudent !== undefined && input.maxPerStudent !== null) {
    const parsedPerStudent = Number(input.maxPerStudent);
    if (!Number.isInteger(parsedPerStudent) || parsedPerStudent < 1 || parsedPerStudent > 1000) {
      return { valid: false, error: 'Limite de usos por aluno inválido.' };
    }
    maxPerStudent = parsedPerStudent;
  }

  const eligibleAudience: CommerceEligibleAudience =
    input.eligibleAudience && VALID_ELIGIBLE_AUDIENCES.includes(input.eligibleAudience)
      ? input.eligibleAudience
      : 'all';

  const eligibleStudentUids: string[] = [];
  for (const uid of Array.isArray(input.eligibleStudentUids) ? input.eligibleStudentUids : []) {
    const cleaned = String(uid || '').trim();
    if (!VALID_COMMERCE_ID_RE.test(cleaned)) {
      return { valid: false, error: `UID elegível inválido: "${cleaned}".` };
    }
    if (!eligibleStudentUids.includes(cleaned)) eligibleStudentUids.push(cleaned);
  }
  if (eligibleAudience === 'specific_uids' && eligibleStudentUids.length === 0) {
    return {
      valid: false,
      error: 'Informe ao menos um UID de aluno elegível para cupons individuais.',
    };
  }

  const status: CommercePromotionStatus =
    input.status && VALID_PROMOTION_STATUSES.includes(input.status) ? input.status : 'draft';

  return {
    valid: true,
    data: {
      name,
      description,
      code,
      discountType: input.discountType,
      discountValue:
        input.discountType === 'percentage'
          ? Number(discountValue.toFixed(2))
          : Number((Math.round(discountValue * 100) / 100).toFixed(2)),
      scopeType: input.scopeType,
      targetProductIds,
      targetCourseIds,
      startsAt,
      startsAtMs,
      endsAt,
      endsAtMs,
      maxRedemptions,
      maxPerStudent,
      eligibleAudience,
      eligibleStudentUids,
      status,
    },
  };
}

/**
 * Avaliação e cálculo autoritativo de cupons e descontos.
 * Nunca confia em totais ou descontos enviados pelo cliente.
 */
export function evaluateAndCalculateCoupon(input: EvaluateCouponInput): EvaluateCouponResult {
  const nowMs = input.nowMs ?? Date.now();
  const normalizedCode = normalizeCouponCode(input.code);
  const baseAmountCents = Math.max(0, Math.round(input.price?.amountCents ?? 0));
  const currency = input.price?.currency || 'BRL';

  const fail = (
    reason: EvaluateCouponResult['reason'],
    message: string,
    promotionId: string | null = null
  ): EvaluateCouponResult => ({
    valid: false,
    previewOnly: Boolean(input.allowAdminPreviewWhenDisabled),
    reason,
    message,
    normalizedCode,
    promotionId,
    currency,
    baseAmount: Number((baseAmountCents / 100).toFixed(2)),
    baseAmountCents,
    discountAmount: 0,
    discountAmountCents: 0,
    finalAmount: Number((baseAmountCents / 100).toFixed(2)),
    finalAmountCents: baseAmountCents,
  });

  if (!input.price || input.price.status !== 'active' || baseAmountCents <= 0) {
    return fail('invalid_price', 'O preço informado não está ativo ou é inválido.');
  }

  const promoEnabled = input.config.commerceEnabled && input.config.promotionsEnabled;
  if (!promoEnabled && !input.allowAdminPreviewWhenDisabled) {
    return fail(
      'promotions_disabled',
      'As promoções e cupons comerciais estão desativados na configuração global.'
    );
  }

  if (!VALID_COUPON_CODE_RE.test(normalizedCode)) {
    return fail('invalid_code', 'Formato de código de cupom inválido.');
  }

  const promo = input.promotion;
  if (!promo || normalizeCouponCode(promo.code || '') !== normalizedCode) {
    return fail('not_found', 'Cupom não encontrado no catálogo de promoções.');
  }

  if (promo.status !== 'active') {
    return fail('inactive', 'Este cupom não está ativo no momento.', promo.promotionId);
  }

  if (typeof promo.startsAtMs === 'number' && nowMs < promo.startsAtMs) {
    return fail('not_started', 'Este cupom ainda não entrou em vigência.', promo.promotionId);
  }

  if (typeof promo.endsAtMs === 'number' && nowMs > promo.endsAtMs) {
    return fail('expired', 'Este cupom expirou.', promo.promotionId);
  }

  if (
    typeof promo.maxRedemptions === 'number' &&
    promo.redeemedCount >= promo.maxRedemptions
  ) {
    return fail(
      'max_redemptions_reached',
      'Este cupom atingiu o limite máximo de resgates.',
      promo.promotionId
    );
  }

  if (
    typeof promo.maxPerStudent === 'number' &&
    (input.studentRedemptionCount ?? 0) >= promo.maxPerStudent
  ) {
    return fail(
      'student_limit_reached',
      'Limite de utilizações por aluno atingido para este cupom.',
      promo.promotionId
    );
  }

  // Elegibilidade de público
  if (promo.eligibleAudience === 'specific_uids') {
    if (!input.studentUid || !promo.eligibleStudentUids.includes(input.studentUid)) {
      return fail(
        'audience_not_eligible',
        'Este cupom é individual e não está autorizado para este aluno.',
        promo.promotionId
      );
    }
  } else if (promo.eligibleAudience === 'new_students' && input.isNewStudent === false) {
    return fail(
      'audience_not_eligible',
      'Este cupom é exclusivo para novos alunos.',
      promo.promotionId
    );
  } else if (
    promo.eligibleAudience === 'enrolled_students' &&
    input.hasActiveClassEnrollment === false
  ) {
    return fail(
      'audience_not_eligible',
      'Este cupom é exclusivo para alunos com matrícula ativa em turma.',
      promo.promotionId
    );
  }

  // Escopo do produto/curso/pacote
  if (promo.scopeType === 'product') {
    if (!promo.targetProductIds.includes(input.product.productId)) {
      return fail(
        'scope_mismatch',
        'Este cupom não se aplica ao produto selecionado.',
        promo.promotionId
      );
    }
  } else if (promo.scopeType === 'bundle') {
    if (
      input.product.productType !== 'instrument_bundle' ||
      (promo.targetProductIds.length > 0 &&
        !promo.targetProductIds.includes(input.product.productId))
    ) {
      return fail(
        'scope_mismatch',
        'Este cupom é exclusivo para o pacote de instrumentos especificado.',
        promo.promotionId
      );
    }
  } else if (promo.scopeType === 'course') {
    const hasMatchingCourse = input.product.courseIds.some((cid) =>
      promo.targetCourseIds.includes(cid)
    );
    if (!hasMatchingCourse) {
      return fail(
        'scope_mismatch',
        'Este cupom não é válido para os cursos incluídos neste produto.',
        promo.promotionId
      );
    }
  }

  let discountAmountCents = 0;
  if (promo.discountType === 'percentage') {
    if (!Number.isFinite(promo.discountValue) || promo.discountValue <= 0 || promo.discountValue > 100) {
      return fail('invalid_discount', 'Percentual de desconto inválido.', promo.promotionId);
    }
    discountAmountCents = Math.round((baseAmountCents * promo.discountValue) / 100);
  } else if (promo.discountType === 'fixed_amount') {
    if (!Number.isFinite(promo.discountValue) || promo.discountValue <= 0) {
      return fail('invalid_discount', 'Valor fixo de desconto inválido.', promo.promotionId);
    }
    discountAmountCents = Math.round(promo.discountValue * 100);
  }

  discountAmountCents = Math.max(0, Math.min(baseAmountCents, discountAmountCents));
  const finalAmountCents = Math.max(0, baseAmountCents - discountAmountCents);

  const snapshot = createAppliedPriceSnapshot({
    product: input.product,
    price: input.price,
    discountAmountCents,
    promotionId: promo.promotionId,
    couponCode: normalizedCode,
    capturedAt: new Date(nowMs).toISOString(),
  });

  return {
    valid: true,
    previewOnly: !promoEnabled,
    message: promoEnabled
      ? `Cupom ${normalizedCode} aplicado com sucesso.`
      : `Simulação administrativa válida (${normalizedCode}) — modo comercial global permanece DESATIVADO.`,
    normalizedCode,
    promotionId: promo.promotionId,
    currency,
    baseAmount: snapshot.baseAmount,
    baseAmountCents,
    discountAmount: snapshot.discountAmount,
    discountAmountCents,
    finalAmount: snapshot.finalAmount,
    finalAmountCents,
    snapshot,
  };
}

// =========================================================================
// ACCESS RESOLVER — COEXISTÊNCIA INDEPENDENTE COM A FASE 1
// =========================================================================

export function buildEntitlementsFromPurchase(params: {
  entitlementId: string;
  product: CommerceProduct;
  status: ExternalCourseEntitlement['status'];
  expiresAt?: string | null;
  referenceId?: string | null;
}): ExternalCourseEntitlement[] {
  const expiresAtMs =
    params.expiresAt && !Number.isNaN(Date.parse(params.expiresAt))
      ? Date.parse(params.expiresAt)
      : null;

  return params.product.courseIds.map((courseId) => ({
    id: `${params.entitlementId}_${courseId}`,
    type: 'purchase',
    courseId,
    status: params.status,
    expiresAt: params.expiresAt ?? null,
    expiresAtMs,
    referenceId: params.referenceId ?? params.product.productId,
  }));
}

export function buildEntitlementsFromSubscription(params: {
  subscriptionId: string;
  courseIds: OfficialCourseId[];
  status: ExternalCourseEntitlement['status'];
  expiresAt?: string | null;
  referenceId?: string | null;
}): ExternalCourseEntitlement[] {
  const expiresAtMs =
    params.expiresAt && !Number.isNaN(Date.parse(params.expiresAt))
      ? Date.parse(params.expiresAt)
      : null;

  return params.courseIds
    .filter((cid) => isValidCourseId(cid))
    .map((courseId) => ({
      id: `${params.subscriptionId}_${courseId}`,
      type: 'subscription',
      courseId,
      status: params.status,
      expiresAt: params.expiresAt ?? null,
      expiresAtMs,
      referenceId: params.referenceId ?? params.subscriptionId,
    }));
}

/**
 * Unifica o AccessResolver da Fase 1 (grants administrativos, curso principal,
 * regra dos 50%, matrículas e placements) com direitos comerciais futuros
 * (compras e assinaturas), garantindo que reembolsos/cancelamentos comerciais
 * NUNCA removam liberações gratuitas do administrador ou progresso acadêmico.
 */
export function resolveCommerceAndAcademicAccess(
  input: ResolveStudentAccessInput
): StudentEffectiveAccessSnapshot {
  return resolveStudentAccessSnapshot(input);
}
