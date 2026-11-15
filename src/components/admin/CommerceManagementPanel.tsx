import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BadgePercent,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  GraduationCap,
  History,
  Layers,
  Lock,
  Megaphone,
  Package,
  Plus,
  Receipt,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Tag,
  Ticket,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ACADEMIC_CATALOG_COURSE_LIST } from '../../services/academicCatalog';
import {
  COMMERCE_CONFIRMATION_PHRASE,
  DEFAULT_COMMERCE_CONFIG,
  formatCurrencyCents,
} from '../../services/commerceCore';
import {
  CommerceConfigService,
  CouponService,
  PricingService,
  ProductService,
  PromotionService,
  fetchAdminCommerceOverview,
} from '../../services/commerceService';
import {
  AdminLogEntry,
  subscribeToAdminLogs,
} from '../../services/adminLogsService';
import { fetchPhase3OverviewAdmin } from '../../services/commercePhase3Service';
import { CommercePhase3SubPanels } from './CommercePhase3SubPanels';
import type {
  CommerceBillingInterval,
  CommerceCurrency,
  CommerceDiscountType,
  CommerceEligibleAudience,
  CommerceGlobalConfig,
  CommercePhase3OverviewPayload,
  CommerceProduct,
  CommerceProductPrice,
  CommerceProductStatus,
  CommerceProductType,
  CommercePromotion,
  CommercePromotionScopeType,
  CommercePromotionStatus,
  EvaluateCouponResult,
} from '../../types/commerce';
import type { OfficialCourseId } from '../../academia/progress/unlockGate';

type CommerceSubTab =
  | 'products'
  | 'prices'
  | 'plans'
  | 'coupons'
  | 'promotions'
  | 'campaigns'
  | 'class_offers'
  | 'orders_subs'
  | 'config'
  | 'audit';

export interface CommerceManagementPanelProps {
  onNotify: (msg: string) => void;
}

const PRODUCT_TYPE_LABELS: Record<CommerceProductType, string> = {
  individual_course: 'Curso Individual',
  instrument_bundle: 'Pacote de Instrumentos',
  subscription_plan: 'Plano de Assinatura',
  lifetime_access: 'Acesso Vitalício',
  experimental_course: 'Curso Experimental',
  paid_class_offer: 'Oferta Comercial de Turma',
};

const INTERVAL_LABELS: Record<CommerceBillingInterval, string> = {
  one_time: 'Pagamento Único',
  monthly: 'Mensal',
  semiannual: 'Semestral',
  annual: 'Anual',
  lifetime: 'Vitalício',
};

const AUDIENCE_LABELS: Record<CommerceEligibleAudience, string> = {
  all: 'Todos os alunos',
  new_students: 'Apenas novos alunos',
  enrolled_students: 'Alunos matriculados em turmas',
  specific_uids: 'UIDs específicos (Individual)',
};

const PROMO_STATUS_LABELS: Record<CommercePromotionStatus, string> = {
  draft: 'Rascunho',
  active: 'Ativa',
  paused: 'Pausada',
  ended: 'Encerrada',
};

function formatDatePtBr(iso?: string | null): string {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const CommerceManagementPanel: React.FC<CommerceManagementPanelProps> = ({
  onNotify,
}) => {
  const { user, isAdmin } = useAuth();
  const [subTab, setSubTab] = useState<CommerceSubTab>('products');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [overviewMode, setOverviewMode] = useState<'backend_admin_sdk' | 'firestore_serverless'>('firestore_serverless');

  const [config, setConfig] = useState<CommerceGlobalConfig>(DEFAULT_COMMERCE_CONFIG);
  const [products, setProducts] = useState<CommerceProduct[]>([]);
  const [prices, setPrices] = useState<CommerceProductPrice[]>([]);
  const [promotions, setPromotions] = useState<CommercePromotion[]>([]);
  const [commerceLogs, setCommerceLogs] = useState<AdminLogEntry[]>([]);
  const [phase3Overview, setPhase3Overview] = useState<CommercePhase3OverviewPayload>({
    advertisements: [],
    classOffers: [],
    reservations: [],
    waitlist: [],
    orders: [],
    payments: [],
    paymentEvents: [],
    subscriptions: [],
    entitlements: [],
    adjustments: [],
    availableClasses: [],
    mode: 'firestore_serverless',
  });

  // Filtros
  const [productSearch, setProductSearch] = useState('');
  const [selectedPriceProductId, setSelectedPriceProductId] = useState<string>('');

  // Formulário de Produto
  const [prodName, setProdName] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodType, setProdType] = useState<CommerceProductType>('individual_course');
  const [prodCourseIds, setProdCourseIds] = useState<OfficialCourseId[]>(['violao']);
  const [prodStatus, setProdStatus] = useState<CommerceProductStatus>('draft');

  // Formulário de Versão de Preço
  const [priceAmount, setPriceAmount] = useState('');
  const [priceCurrency, setPriceCurrency] = useState<CommerceCurrency>('BRL');
  const [priceInterval, setPriceInterval] = useState<CommerceBillingInterval>('one_time');
  const [priceIsPromo, setPriceIsPromo] = useState(false);
  const [pricePromoLabel, setPricePromoLabel] = useState('');
  const [priceValidFrom, setPriceValidFrom] = useState('');
  const [priceValidUntil, setPriceValidUntil] = useState('');
  const [priceNotes, setPriceNotes] = useState('');

  // Formulário de Promoção / Cupom
  const [promoName, setPromoName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountType, setPromoDiscountType] = useState<CommerceDiscountType>('percentage');
  const [promoDiscountValue, setPromoDiscountValue] = useState('');
  const [promoScopeType, setPromoScopeType] = useState<CommercePromotionScopeType>('all_products');
  const [promoTargetProductIds, setPromoTargetProductIds] = useState<string[]>([]);
  const [promoTargetCourseIds, setPromoTargetCourseIds] = useState<OfficialCourseId[]>([]);
  const [promoAudience, setPromoAudience] = useState<CommerceEligibleAudience>('all');
  const [promoSpecificUids, setPromoSpecificUids] = useState('');
  const [promoMaxRedemptions, setPromoMaxRedemptions] = useState('');
  const [promoMaxPerStudent, setPromoMaxPerStudent] = useState('');
  const [promoStartsAt, setPromoStartsAt] = useState('');
  const [promoEndsAt, setPromoEndsAt] = useState('');
  const [promoInitialStatus, setPromoInitialStatus] = useState<CommercePromotionStatus>('active');

  // Simulador de Cupom
  const [simCode, setSimCode] = useState('');
  const [simProductId, setSimProductId] = useState('');
  const [simPriceId, setSimPriceId] = useState('');
  const [simStudentUid, setSimStudentUid] = useState('');
  const [simResult, setSimResult] = useState<{
    evaluation: EvaluateCouponResult;
    source: string;
  } | null>(null);

  // Formulário de Configuração Global
  const [draftConfig, setDraftConfig] = useState<CommerceGlobalConfig>(DEFAULT_COMMERCE_CONFIG);
  const [activationConfirmationInput, setActivationConfirmationInput] = useState('');
  const [activationReason, setActivationReason] = useState('');

  const loadCommerceData = useCallback(async () => {
    if (!user || !isAdmin) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [data, phase3Data] = await Promise.all([
        fetchAdminCommerceOverview(),
        fetchPhase3OverviewAdmin().catch(() => null),
      ]);
      setConfig(data.config);
      setDraftConfig(data.config);
      setProducts(data.products);
      setPrices(data.prices);
      setPromotions(data.promotions);
      setOverviewMode(data.mode);
      if (phase3Data) {
        setPhase3Overview(phase3Data);
      }

      if (!selectedPriceProductId && data.products.length > 0) {
        setSelectedPriceProductId(data.products[0].productId);
      }
      if (!simProductId && data.products.length > 0) {
        setSimProductId(data.products[0].productId);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar dados comerciais do Firestore/Backend.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, isAdmin, selectedPriceProductId, simProductId]);

  useEffect(() => {
    void loadCommerceData();
  }, [loadCommerceData]);

  // Assina histórico administrativo filtrado para eventos commerce_*
  useEffect(() => {
    if (!user || !isAdmin) return;
    const unsub = subscribeToAdminLogs(
      (logs) => {
        setCommerceLogs(logs.filter((l) => l.eventType.startsWith('commerce_')));
      },
      () => {
        // Silencioso caso regra ainda não esteja implantada no ambiente remoto
      },
      { maxItems: 100 }
    );
    return () => unsub();
  }, [user, isAdmin]);

  const activePricesByProduct = useMemo(() => {
    const map = new Map<string, CommerceProductPrice[]>();
    for (const p of prices) {
      if (p.status !== 'active') continue;
      const list = map.get(p.productId) || [];
      list.push(p);
      map.set(p.productId, list);
    }
    return map;
  }, [prices]);

  const selectedProductPriceHistory = useMemo(() => {
    if (!selectedPriceProductId) return [];
    return prices
      .filter((p) => p.productId === selectedPriceProductId)
      .sort((a, b) => (b.version || 0) - (a.version || 0));
  }, [prices, selectedPriceProductId]);

  const planPrices = useMemo(() => {
    return prices.filter(
      (p) =>
        p.billingInterval === 'monthly' ||
        p.billingInterval === 'semiannual' ||
        p.billingInterval === 'annual' ||
        p.billingInterval === 'lifetime'
    );
  }, [prices]);

  const couponsList = useMemo(
    () => promotions.filter((p) => Boolean(p.code)),
    [promotions]
  );

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.productId.toLowerCase().includes(q) ||
        p.courseIds.some((c) => c.toLowerCase().includes(q))
    );
  }, [products, productSearch]);

  const simAvailablePrices = useMemo(() => {
    if (!simProductId) return [];
    return prices.filter((p) => p.productId === simProductId && p.status === 'active');
  }, [prices, simProductId]);

  useEffect(() => {
    if (simAvailablePrices.length > 0 && !simAvailablePrices.some((p) => p.priceId === simPriceId)) {
      setSimPriceId(simAvailablePrices[0].priceId);
    }
  }, [simAvailablePrices, simPriceId]);

  const handleToggleCourseSelection = (courseId: OfficialCourseId) => {
    setProdCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((c) => c !== courseId) : [...prev, courseId]
    );
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSaving(true);
    try {
      const created = await ProductService.createProduct({
        name: prodName,
        description: prodDescription,
        productType: prodType,
        courseIds: prodCourseIds,
        status: prodStatus,
      });
      setProducts((prev) => [created, ...prev]);
      setSelectedPriceProductId(created.productId);
      setSimProductId(created.productId);
      setProdName('');
      setProdDescription('');
      onNotify(`Produto "${created.name}" criado com visibilidade OCULTA.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao criar produto.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleProductVisibility = async (product: CommerceProduct) => {
    setErrorMsg(null);
    setIsSaving(true);
    try {
      const nextVis = product.visibility === 'hidden' ? 'public' : 'hidden';
      const updated = await ProductService.updateProduct(product.productId, {
        visibility: nextVis,
      });
      setProducts((prev) =>
        prev.map((p) => (p.productId === updated.productId ? updated : p))
      );
      onNotify(
        `Visibilidade de "${updated.name}" atualizada para "${
          nextVis === 'hidden' ? 'Oculto' : 'Público (sujeito ao modo global)'
        }".`
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao atualizar visibilidade.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleProductStatus = async (
    product: CommerceProduct,
    nextStatus: CommerceProductStatus
  ) => {
    setErrorMsg(null);
    setIsSaving(true);
    try {
      const updated = await ProductService.updateProduct(product.productId, {
        status: nextStatus,
      });
      setProducts((prev) =>
        prev.map((p) => (p.productId === updated.productId ? updated : p))
      );
      onNotify(`Status de "${updated.name}" alterado para "${nextStatus}".`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao atualizar status do produto.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePriceVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPriceProductId) {
      setErrorMsg('Selecione um produto antes de cadastrar uma versão de preço.');
      return;
    }
    setErrorMsg(null);
    setIsSaving(true);
    try {
      const parsedAmount = Number(priceAmount.replace(',', '.'));
      const res = await PricingService.createPriceVersion({
        productId: selectedPriceProductId,
        currency: priceCurrency,
        amount: parsedAmount,
        billingInterval: priceInterval,
        isPromotional: priceIsPromo,
        promotionalLabel: pricePromoLabel || null,
        validFrom: priceValidFrom ? new Date(priceValidFrom).toISOString() : null,
        validUntil: priceValidUntil ? new Date(priceValidUntil).toISOString() : null,
        notes: priceNotes || null,
      });
      setPrices((prev) => {
        const supersededSet = new Set(res.supersededPriceIds);
        const nowIso = new Date().toISOString();
        const updated = prev.map((p) =>
          supersededSet.has(p.priceId)
            ? {
                ...p,
                status: 'superseded' as const,
                supersededAt: nowIso,
                supersededBy: res.price.priceId,
              }
            : p
        );
        return [res.price, ...updated];
      });
      setPriceAmount('');
      setPricePromoLabel('');
      setPriceNotes('');
      onNotify(
        `Versão v${res.price.version} registrada (${formatCurrencyCents(
          res.price.amountCents,
          res.price.currency
        )}). Preços anteriores preservados no histórico.`
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao criar versão de preço.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePromotion = async (e: React.FormEvent, requireCouponCode: boolean) => {
    e.preventDefault();
    setErrorMsg(null);
    if (requireCouponCode && !promoCode.trim()) {
      setErrorMsg('Informe o código do cupom promocional (ex: BOASVINDAS20).');
      return;
    }
    setIsSaving(true);
    try {
      const uids = promoSpecificUids
        .split(/[\s,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const created = await PromotionService.createPromotion({
        name: promoName,
        code: promoCode.trim() ? promoCode.trim().toUpperCase() : null,
        discountType: promoDiscountType,
        discountValue: Number(promoDiscountValue.replace(',', '.')),
        scopeType: promoScopeType,
        targetProductIds: promoTargetProductIds,
        targetCourseIds: promoTargetCourseIds,
        startsAt: promoStartsAt ? new Date(promoStartsAt).toISOString() : null,
        endsAt: promoEndsAt ? new Date(promoEndsAt).toISOString() : null,
        maxRedemptions: promoMaxRedemptions ? parseInt(promoMaxRedemptions, 10) : null,
        maxPerStudent: promoMaxPerStudent ? parseInt(promoMaxPerStudent, 10) : null,
        eligibleAudience: promoAudience,
        eligibleStudentUids: uids,
        status: promoInitialStatus,
      });
      setPromotions((prev) => [created, ...prev]);
      setPromoName('');
      setPromoCode('');
      setPromoDiscountValue('');
      onNotify(
        `${created.code ? `Cupom "${created.code}"` : `Promoção "${created.name}"`} criado com sucesso.`
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao criar promoção/cupom.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePromotionStatus = async (
    promo: CommercePromotion,
    nextStatus: CommercePromotionStatus
  ) => {
    setErrorMsg(null);
    setIsSaving(true);
    try {
      const updated = await PromotionService.updatePromotionStatus(promo.promotionId, nextStatus);
      setPromotions((prev) =>
        prev.map((p) => (p.promotionId === updated.promotionId ? updated : p))
      );
      onNotify(`Promoção "${updated.name}" atualizada para "${PROMO_STATUS_LABELS[nextStatus]}".`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao atualizar promoção.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimulateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSimResult(null);
    const product = products.find((p) => p.productId === simProductId);
    const price = prices.find((pr) => pr.priceId === simPriceId);
    if (!product || !price) {
      setErrorMsg('Selecione um produto e uma versão de preço ativa para simular.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await CouponService.simulateCouponForAdmin({
        code: simCode,
        productId: product.productId,
        priceId: price.priceId,
        studentUid: simStudentUid.trim() || null,
        product,
        price,
        promotions,
        config,
      });
      setSimResult({ evaluation: res.result, source: res.source });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro na simulação do cupom.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGlobalConfig = async (forceDisableAll = false) => {
    setErrorMsg(null);
    setIsSaving(true);
    try {
      const payload = forceDisableAll
        ? {
            commerceEnabled: false,
            catalogVisible: false,
            checkoutEnabled: false,
            promotionsEnabled: false,
            advertisementsEnabled: false,
            paidClassesEnabled: false,
            subscriptionsEnabled: false,
            defaultCurrency: draftConfig.defaultCurrency,
            reason: 'Desativação imediata do modo comercial pelo administrador.',
          }
        : {
            commerceEnabled: draftConfig.commerceEnabled,
            catalogVisible: draftConfig.catalogVisible,
            checkoutEnabled: draftConfig.checkoutEnabled,
            promotionsEnabled: draftConfig.promotionsEnabled,
            advertisementsEnabled: draftConfig.advertisementsEnabled,
            paidClassesEnabled: draftConfig.paidClassesEnabled,
            subscriptionsEnabled: draftConfig.subscriptionsEnabled,
            defaultCurrency: draftConfig.defaultCurrency,
            confirmationText: activationConfirmationInput,
            reason: activationReason || undefined,
          };

      const res = await CommerceConfigService.updateGlobalConfig(payload);
      setConfig(res.config);
      setDraftConfig(res.config);
      setActivationConfirmationInput('');
      onNotify(
        res.config.commerceEnabled
          ? 'Configuração comercial salva (MODO COMERCIAL HABILITADO POR ADMIN).'
          : 'Configuração comercial salva com MODO PAGO DESATIVADO (Fail-Closed).'
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao atualizar configuração global.');
    } finally {
      setIsSaving(false);
    }
  };

  const wantsEnableSensitiveDraft =
    draftConfig.commerceEnabled || draftConfig.catalogVisible || draftConfig.checkoutEnabled;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Cabeçalho Comercial & Banner Fail-Closed Permanente */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              Comercial e Monetização
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase border ${
                config.commerceEnabled
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                  : 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
              }`}
            >
              {config.commerceEnabled
                ? 'Modo Comercial: ATIVO'
                : 'Modo Pago: DESATIVADO (Fail-Closed)'}
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Infraestrutura isolada de catálogo, versionamento de preços, planos, cupons e controle global. Nenhum gateway conectado e nenhuma cobrança exposta ao aluno.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadCommerceData()}
          disabled={isLoading || isSaving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-xs font-semibold border border-[#3F3F46] transition cursor-pointer disabled:opacity-50 self-start shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Atualizar Infraestrutura</span>
        </button>
      </div>

      {/* Resumo Técnico Compacto (Grid Plano 1px Border) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">Produtos no Catálogo</span>
          <span className="text-xl font-black font-mono-code text-white mt-1 block tabular-nums">
            {products.length}
          </span>
          <span className="text-[10px] text-[#71717A]">
            {products.filter((p) => p.visibility === 'hidden').length} ocultos • {products.filter((p) => p.status === 'active').length} ativos
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">Versões de Preços</span>
          <span className="text-xl font-black font-mono-code text-white mt-1 block tabular-nums">
            {prices.length}
          </span>
          <span className="text-[10px] text-[#71717A]">
            {prices.filter((p) => p.status === 'active').length} vigentes • {prices.filter((p) => p.status === 'superseded').length} substituídos
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">Cupons & Promoções</span>
          <span className="text-xl font-black font-mono-code text-white mt-1 block tabular-nums">
            {promotions.length}
          </span>
          <span className="text-[10px] text-[#71717A]">
            {couponsList.length} com código • {promotions.filter((p) => p.status === 'active').length} ativos
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">Execução & Segurança</span>
          <span className="text-sm font-bold font-mono-code text-[#C5A059] mt-1.5 block truncate">
            {overviewMode === 'backend_admin_sdk' ? 'Express Auth API' : 'Firestore Rules (isAdmin)'}
          </span>
          <span className="text-[10px] text-[#71717A]">
            Checkout: {config.checkoutEnabled ? 'Habilitado' : 'Bloqueado'}
          </span>
        </div>
      </div>

      {/* Sub-navegação do Módulo Comercial */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[#0F0F12] border border-[#27272A]">
        {(
          [
            { id: 'products', label: 'Produtos', icon: Package },
            { id: 'prices', label: 'Preços', icon: Tag },
            { id: 'plans', label: 'Planos', icon: Layers },
            { id: 'coupons', label: 'Cupons', icon: Ticket },
            { id: 'promotions', label: 'Promoções', icon: BadgePercent },
            { id: 'campaigns', label: 'Campanhas & Publicidade', icon: Megaphone },
            { id: 'class_offers', label: 'Turmas Pagas & Vagas', icon: GraduationCap },
            { id: 'orders_subs', label: 'Pedidos & Assinaturas', icon: Receipt },
            { id: 'config', label: 'Configuração Global', icon: Sliders },
            { id: 'audit', label: 'Histórico Administrativo', icon: History },
          ] as Array<{ id: CommerceSubTab; label: string; icon: React.ComponentType<{ className?: string }> }>
        ).map((tab) => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-[#7B1E2B] text-white'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#1C1C21]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ===============================================================
          SUB-ABA 1: PRODUTOS (SEMPRE INICIAM OCULTOS)
         =============================================================== */}
      {subTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleCreateProduct}
            className="lg:col-span-5 p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4 self-start"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C5A059]" />
                <span>Cadastrar Produto Comercial</span>
              </h3>
              <span className="text-[10px] font-mono-code text-[#A1A1AA]">
                Inicia oculto
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={120}
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="Ex: Formação Completa Guitarra Canônica"
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white focus:outline-none focus:border-[#7B1E2B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                Descrição Comercial Interna
              </label>
              <textarea
                rows={2}
                maxLength={800}
                value={prodDescription}
                onChange={(e) => setProdDescription(e.target.value)}
                placeholder="Escopo comercial, público-alvo e regras internas..."
                className="w-full p-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white focus:outline-none focus:border-[#7B1E2B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Tipo de Produto
                </label>
                <select
                  value={prodType}
                  onChange={(e) => setProdType(e.target.value as CommerceProductType)}
                  className="w-full h-9 px-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                >
                  {(Object.keys(PRODUCT_TYPE_LABELS) as CommerceProductType[]).map((t) => (
                    <option key={t} value={t}>
                      {PRODUCT_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Status Inicial
                </label>
                <select
                  value={prodStatus}
                  onChange={(e) => setProdStatus(e.target.value as CommerceProductStatus)}
                  className="w-full h-9 px-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                >
                  <option value="draft">Rascunho (draft)</option>
                  <option value="active">Ativo (oculto na loja)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1.5">
                Cursos Oficiais Vinculados (Catálogo Real)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {ACADEMIC_CATALOG_COURSE_LIST.map((course) => {
                  const checked = prodCourseIds.includes(course.id);
                  return (
                    <label
                      key={course.id}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer transition ${
                        checked
                          ? 'bg-[#7B1E2B]/30 border-[#7B1E2B] text-white'
                          : 'bg-[#09090B] border-[#27272A] text-[#A1A1AA]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleCourseSelection(course.id)}
                        className="accent-[#7B1E2B]"
                      />
                      <span className="truncate">{course.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving || prodCourseIds.length === 0}
              className="w-full h-9 rounded-lg bg-[#7B1E2B] hover:bg-[#962535] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Cadastrar Produto (Oculto por Padrão)'}
            </button>
          </form>

          <div className="lg:col-span-7 p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white">Catálogo Estruturado ({filteredProducts.length})</h3>
              <input
                type="search"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Filtrar produto ou curso..."
                className="h-8 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white sm:w-56"
              />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#09090B] border border-[#27272A] space-y-2">
                <Package className="w-6 h-6 text-[#52525B] mx-auto" />
                <p className="text-xs font-semibold text-white">Nenhum produto comercial cadastrado.</p>
                <p className="text-[11px] text-[#71717A]">
                  Crie itens ao lado para preparar cursos individuais, pacotes ou planos sem expô-los aos alunos.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#27272A] text-[#A1A1AA] text-[11px]">
                      <th className="py-2 pr-3">Produto / Tipo</th>
                      <th className="py-2 px-3">Cursos</th>
                      <th className="py-2 px-3">Preços Ativos</th>
                      <th className="py-2 px-3">Visibilidade</th>
                      <th className="py-2 pl-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272A]">
                    {filteredProducts.map((prod) => {
                      const activeProductPrices = activePricesByProduct.get(prod.productId) || [];
                      return (
                        <tr key={prod.productId} className="hover:bg-[#0F0F12]/60">
                          <td className="py-2.5 pr-3">
                            <div className="font-semibold text-white">{prod.name}</div>
                            <div className="text-[10px] text-[#A1A1AA]">
                              {PRODUCT_TYPE_LABELS[prod.productType]} •{' '}
                              <span className="font-mono-code">{prod.status}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono-code text-[11px] text-[#E4E4E7]">
                            {prod.courseIds.join(', ')}
                          </td>
                          <td className="py-2.5 px-3 font-mono-code tabular-nums text-[11px]">
                            {activeProductPrices.length === 0 ? (
                              <span className="text-[#71717A]">Sem preço</span>
                            ) : (
                              activeProductPrices.map((pr) => (
                                <div key={pr.priceId} className="text-[#C5A059]">
                                  v{pr.version}: {formatCurrencyCents(pr.amountCents, pr.currency)} ({INTERVAL_LABELS[pr.billingInterval]})
                                </div>
                              ))
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code border ${
                                prod.visibility === 'hidden'
                                  ? 'bg-zinc-900 text-zinc-300 border-zinc-700'
                                  : 'bg-amber-950/60 text-amber-300 border-amber-800'
                              }`}
                            >
                              {prod.visibility === 'hidden' ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                              <span>{prod.visibility === 'hidden' ? 'Oculto' : 'Público'}</span>
                            </span>
                          </td>
                          <td className="py-2.5 pl-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPriceProductId(prod.productId);
                                setSubTab('prices');
                              }}
                              className="px-2 py-1 rounded bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-[10px] font-semibold cursor-pointer"
                            >
                              Preços
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleToggleProductVisibility(prod)}
                              disabled={isSaving}
                              className="px-2 py-1 rounded bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-[10px] font-semibold cursor-pointer"
                            >
                              {prod.visibility === 'hidden' ? 'Marcar Público' : 'Ocultar'}
                            </button>
                            {prod.status !== 'archived' && (
                              <button
                                type="button"
                                onClick={() =>
                                  void handleToggleProductStatus(
                                    prod,
                                    prod.status === 'active' ? 'archived' : 'active'
                                  )
                                }
                                disabled={isSaving}
                                className="px-2 py-1 rounded bg-[#27272A] hover:bg-[#7B1E2B] text-[#E4E4E7] text-[10px] font-semibold cursor-pointer"
                              >
                                {prod.status === 'active' ? 'Arquivar' : 'Ativar'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===============================================================
          SUB-ABA 2 & 3: PREÇOS VERSIONADOS IMUTÁVEIS & PLANOS
         =============================================================== */}
      {(subTab === 'prices' || subTab === 'plans') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleCreatePriceVersion}
            className="lg:col-span-5 p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4 self-start"
          >
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#C5A059]" />
                <span>Registrar Nova Versão de Preço / Plano</span>
              </h3>
              <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                Versões antigas nunca são sobrescritas; ao registrar um novo preço para o mesmo ciclo, o anterior recebe status <code className="text-amber-300">superseded</code>.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                Produto Vinculado
              </label>
              <select
                value={selectedPriceProductId}
                onChange={(e) => setSelectedPriceProductId(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
              >
                <option value="">Selecione um produto...</option>
                {products.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.name} ({PRODUCT_TYPE_LABELS[p.productType]})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Moeda
                </label>
                <select
                  value={priceCurrency}
                  onChange={(e) => setPriceCurrency(e.target.value as CommerceCurrency)}
                  className="w-full h-9 px-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white font-mono-code"
                >
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Valor (ex: 197.00)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(e.target.value)}
                  placeholder="Definido pelo administrador"
                  className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white font-mono-code tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                Ciclo / Modalidade de Cobrança
              </label>
              <select
                value={priceInterval}
                onChange={(e) => setPriceInterval(e.target.value as CommerceBillingInterval)}
                className="w-full h-9 px-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
              >
                <option value="one_time">Pagamento Único (Curso/Pacote)</option>
                <option value="monthly">Plano Mensal</option>
                <option value="semiannual">Plano Semestral</option>
                <option value="annual">Plano Anual</option>
                <option value="lifetime">Acesso Vitalício</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs text-[#E4E4E7] cursor-pointer">
              <input
                type="checkbox"
                checked={priceIsPromo}
                onChange={(e) => setPriceIsPromo(e.target.checked)}
                className="accent-[#7B1E2B]"
              />
              <span>Marcar como faixa de preço promocional</span>
            </label>

            {priceIsPromo && (
              <div>
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Rótulo Promocional
                </label>
                <input
                  type="text"
                  maxLength={80}
                  value={pricePromoLabel}
                  onChange={(e) => setPricePromoLabel(e.target.value)}
                  placeholder="Ex: Condição de Lançamento"
                  className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Vigência Inicial (opcional)
                </label>
                <input
                  type="datetime-local"
                  value={priceValidFrom}
                  onChange={(e) => setPriceValidFrom(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg bg-[#09090B] border border-[#27272A] text-[11px] text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Vigência Final (opcional)
                </label>
                <input
                  type="datetime-local"
                  value={priceValidUntil}
                  onChange={(e) => setPriceValidUntil(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg bg-[#09090B] border border-[#27272A] text-[11px] text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving || !selectedPriceProductId}
              className="w-full h-9 rounded-lg bg-[#7B1E2B] hover:bg-[#962535] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Registrando versão...' : 'Registrar Nova Versão Imutável'}
            </button>
          </form>

          <div className="lg:col-span-7 p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4">
            <h3 className="text-sm font-bold text-white">
              {subTab === 'plans'
                ? `Planos de Assinatura e Acesso Vitalício (${planPrices.length})`
                : `Histórico Imutável de Versões de Preço (${selectedProductPriceHistory.length})`}
            </h3>

            {(subTab === 'plans' ? planPrices : selectedProductPriceHistory).length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#09090B] border border-[#27272A] space-y-2">
                <CreditCard className="w-6 h-6 text-[#52525B] mx-auto" />
                <p className="text-xs font-semibold text-white">
                  Nenhuma versão de preço registrada para esta seleção.
                </p>
                <p className="text-[11px] text-[#71717A]">
                  Nenhum valor fixo vem pré-configurado por padrão. Defina os valores administrativos no formulário ao lado.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#27272A] text-[#A1A1AA] text-[11px]">
                      <th className="py-2 pr-3">Versão</th>
                      <th className="py-2 px-3">Produto / Ciclo</th>
                      <th className="py-2 px-3 text-right">Valor</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 pl-3">Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272A]">
                    {(subTab === 'plans' ? planPrices : selectedProductPriceHistory).map((pr) => {
                      const prod = products.find((p) => p.productId === pr.productId);
                      return (
                        <tr key={pr.priceId} className="hover:bg-[#0F0F12]/60">
                          <td className="py-2.5 pr-3 font-mono-code font-bold text-white">
                            v{pr.version}
                            {pr.isPromotional && (
                              <span className="ml-1.5 text-[10px] text-amber-300">PROMO</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="text-white font-semibold">
                              {prod?.name || pr.productId}
                            </div>
                            <div className="text-[10px] text-[#A1A1AA]">
                              {INTERVAL_LABELS[pr.billingInterval]}
                              {pr.previousPriceId ? ` • substituiu ${pr.previousPriceId}` : ''}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono-code font-bold tabular-nums text-[#C5A059]">
                            {formatCurrencyCents(pr.amountCents, pr.currency)}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code border ${
                                pr.status === 'active'
                                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                                  : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                              }`}
                            >
                              {pr.status}
                            </span>
                          </td>
                          <td className="py-2.5 pl-3 text-[10px] font-mono-code text-[#A1A1AA] tabular-nums">
                            {formatDatePtBr(pr.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===============================================================
          SUB-ABA 4 & 5: CUPONS E PROMOÇÕES + SIMULADOR SERVIDOR
         =============================================================== */}
      {(subTab === 'coupons' || subTab === 'promotions') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={(e) => void handleCreatePromotion(e, subTab === 'coupons')}
              className="lg:col-span-5 p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3.5 self-start"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {subTab === 'coupons' ? (
                  <Ticket className="w-4 h-4 text-[#C5A059]" />
                ) : (
                  <BadgePercent className="w-4 h-4 text-[#C5A059]" />
                )}
                <span>
                  {subTab === 'coupons'
                    ? 'Criar Cupom de Desconto'
                    : 'Criar Campanha Promocional'}
                </span>
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Nome Interno da Campanha/Cupom
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={promoName}
                  onChange={(e) => setPromoName(e.target.value)}
                  placeholder="Ex: Bolsa Parcial Violão"
                  className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Código do Cupom {subTab === 'promotions' ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="text"
                    required={subTab === 'coupons'}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="EX: GUITAR20"
                    className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs font-mono-code text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Status Inicial
                  </label>
                  <select
                    value={promoInitialStatus}
                    onChange={(e) => setPromoInitialStatus(e.target.value as CommercePromotionStatus)}
                    className="w-full h-9 px-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                  >
                    <option value="active">Ativo (pronto p/ uso futuro)</option>
                    <option value="draft">Rascunho</option>
                    <option value="paused">Pausado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Tipo de Desconto
                  </label>
                  <select
                    value={promoDiscountType}
                    onChange={(e) => setPromoDiscountType(e.target.value as CommerceDiscountType)}
                    className="w-full h-9 px-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                  >
                    <option value="percentage">Percentual (%)</option>
                    <option value="fixed_amount">Valor Fixo (R$ / Moeda)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Valor do Desconto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={promoDiscountValue}
                    onChange={(e) => setPromoDiscountValue(e.target.value)}
                    placeholder={promoDiscountType === 'percentage' ? 'Ex: 25' : 'Ex: 50.00'}
                    className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs font-mono-code text-white tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Escopo de Aplicação
                </label>
                <select
                  value={promoScopeType}
                  onChange={(e) => setPromoScopeType(e.target.value as CommercePromotionScopeType)}
                  className="w-full h-9 px-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                >
                  <option value="all_products">Todos os Produtos</option>
                  <option value="course">Cupom por Curso Específico</option>
                  <option value="product">Cupom por Produto Específico</option>
                  <option value="bundle">Cupom para Pacote de Instrumentos</option>
                </select>
              </div>

              {promoScopeType === 'course' && (
                <div className="flex flex-wrap gap-1.5">
                  {ACADEMIC_CATALOG_COURSE_LIST.map((c) => {
                    const selected = promoTargetCourseIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          setPromoTargetCourseIds((prev) =>
                            prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]
                          )
                        }
                        className={`px-2 py-1 rounded text-[11px] border cursor-pointer ${
                          selected
                            ? 'bg-[#7B1E2B]/40 border-[#7B1E2B] text-white'
                            : 'bg-[#09090B] border-[#27272A] text-[#A1A1AA]'
                        }`}
                      >
                        {c.title}
                      </button>
                    );
                  })}
                </div>
              )}

              {(promoScopeType === 'product' || promoScopeType === 'bundle') && (
                <div className="space-y-1">
                  <span className="block text-[10px] text-[#A1A1AA]">Produtos Alvo:</span>
                  <div className="max-h-28 overflow-y-auto space-y-1 p-2 rounded-lg bg-[#09090B] border border-[#27272A]">
                    {products.map((p) => {
                      const selected = promoTargetProductIds.includes(p.productId);
                      return (
                        <label
                          key={p.productId}
                          className="flex items-center gap-2 text-[11px] text-[#E4E4E7] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              setPromoTargetProductIds((prev) =>
                                prev.includes(p.productId)
                                  ? prev.filter((id) => id !== p.productId)
                                  : [...prev, p.productId]
                              )
                            }
                            className="accent-[#7B1E2B]"
                          />
                          <span className="truncate">{p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                  Elegibilidade de Público
                </label>
                <select
                  value={promoAudience}
                  onChange={(e) => setPromoAudience(e.target.value as CommerceEligibleAudience)}
                  className="w-full h-9 px-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                >
                  {(Object.keys(AUDIENCE_LABELS) as CommerceEligibleAudience[]).map((aud) => (
                    <option key={aud} value={aud}>
                      {AUDIENCE_LABELS[aud]}
                    </option>
                  ))}
                </select>
              </div>

              {promoAudience === 'specific_uids' && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    UIDs Autorizados (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    required
                    value={promoSpecificUids}
                    onChange={(e) => setPromoSpecificUids(e.target.value)}
                    placeholder="uid_aluno_1, uid_aluno_2"
                    className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs font-mono-code text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Limite Global de Usos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={promoMaxRedemptions}
                    onChange={(e) => setPromoMaxRedemptions(e.target.value)}
                    placeholder="Ilimitado"
                    className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs font-mono-code text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Máx. por Aluno
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={promoMaxPerStudent}
                    onChange={(e) => setPromoMaxPerStudent(e.target.value)}
                    placeholder="Ilimitado"
                    className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs font-mono-code text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Início (opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={promoStartsAt}
                    onChange={(e) => setPromoStartsAt(e.target.value)}
                    className="w-full h-9 px-2 rounded-lg bg-[#09090B] border border-[#27272A] text-[11px] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#A1A1AA] mb-1">
                    Expiração (opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={promoEndsAt}
                    onChange={(e) => setPromoEndsAt(e.target.value)}
                    className="w-full h-9 px-2 rounded-lg bg-[#09090B] border border-[#27272A] text-[11px] text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full h-9 rounded-lg bg-[#7B1E2B] hover:bg-[#962535] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                {isSaving
                  ? 'Salvando...'
                  : subTab === 'coupons'
                  ? 'Cadastrar Cupom no Servidor'
                  : 'Cadastrar Promoção'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-6">
              {/* Lista de Promoções/Cupons */}
              <div className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4">
                <h3 className="text-sm font-bold text-white">
                  {subTab === 'coupons'
                    ? `Cupons Cadastrados (${couponsList.length})`
                    : `Campanhas & Promoções (${promotions.length})`}
                </h3>

                {(subTab === 'coupons' ? couponsList : promotions).length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-[#09090B] border border-[#27272A] text-xs text-[#71717A]">
                    Nenhum registro cadastrado ainda.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#27272A] text-[#A1A1AA] text-[11px]">
                          <th className="py-2 pr-3">Campanha / Código</th>
                          <th className="py-2 px-3">Desconto</th>
                          <th className="py-2 px-3">Usos</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 pl-3 text-right">Controle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#27272A]">
                        {(subTab === 'coupons' ? couponsList : promotions).map((promo) => (
                          <tr key={promo.promotionId} className="hover:bg-[#0F0F12]/60">
                            <td className="py-2.5 pr-3">
                              <div className="font-semibold text-white">{promo.name}</div>
                              <div className="text-[10px] font-mono-code text-[#C5A059]">
                                {promo.code ? `Código: ${promo.code}` : 'Campanha sem código'} • {promo.scopeType}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-mono-code tabular-nums text-white">
                              {promo.discountType === 'percentage'
                                ? `${promo.discountValue}%`
                                : `R$ ${promo.discountValue.toFixed(2)}`}
                            </td>
                            <td className="py-2.5 px-3 font-mono-code tabular-nums text-[#A1A1AA]">
                              {promo.redeemedCount}
                              {promo.maxRedemptions ? ` / ${promo.maxRedemptions}` : ''}
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code border ${
                                  promo.status === 'active'
                                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                                    : promo.status === 'ended'
                                    ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                                    : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                                }`}
                              >
                                {PROMO_STATUS_LABELS[promo.status]}
                              </span>
                            </td>
                            <td className="py-2.5 pl-3 text-right space-x-1 whitespace-nowrap">
                              {promo.status !== 'active' && (
                                <button
                                  type="button"
                                  onClick={() => void handleUpdatePromotionStatus(promo, 'active')}
                                  className="px-2 py-1 rounded bg-[#27272A] hover:bg-emerald-900 text-[10px] text-white cursor-pointer"
                                >
                                  Ativar
                                </button>
                              )}
                              {promo.status === 'active' && (
                                <button
                                  type="button"
                                  onClick={() => void handleUpdatePromotionStatus(promo, 'paused')}
                                  className="px-2 py-1 rounded bg-[#27272A] hover:bg-amber-900 text-[10px] text-white cursor-pointer"
                                >
                                  Pausar
                                </button>
                              )}
                              {promo.status !== 'ended' && (
                                <button
                                  type="button"
                                  onClick={() => void handleUpdatePromotionStatus(promo, 'ended')}
                                  className="px-2 py-1 rounded bg-[#27272A] hover:bg-rose-900 text-[10px] text-white cursor-pointer"
                                >
                                  Encerrar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Simulador Autoritativo de Cupom */}
              <form
                onSubmit={handleSimulateCoupon}
                className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    Simulador Autoritativo de Cupom (Cálculo no Servidor)
                  </h4>
                  <span className="text-[10px] font-mono-code text-[#A1A1AA]">
                    Apenas preview administrativo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <select
                    value={simProductId}
                    onChange={(e) => setSimProductId(e.target.value)}
                    className="h-9 px-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                  >
                    <option value="">Produto...</option>
                    {products.map((p) => (
                      <option key={p.productId} value={p.productId}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={simPriceId}
                    onChange={(e) => setSimPriceId(e.target.value)}
                    className="h-9 px-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                  >
                    <option value="">Versão de preço ativa...</option>
                    {simAvailablePrices.map((pr) => (
                      <option key={pr.priceId} value={pr.priceId}>
                        v{pr.version} — {formatCurrencyCents(pr.amountCents, pr.currency)} ({INTERVAL_LABELS[pr.billingInterval]})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    value={simCode}
                    onChange={(e) => setSimCode(e.target.value.toUpperCase())}
                    placeholder="Código do cupom"
                    className="h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs font-mono-code text-white uppercase"
                  />
                  <input
                    type="text"
                    value={simStudentUid}
                    onChange={(e) => setSimStudentUid(e.target.value)}
                    placeholder="UID do aluno (opcional)"
                    className="h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs font-mono-code text-white"
                  />
                  <button
                    type="submit"
                    disabled={isSaving || !simProductId || !simPriceId}
                    className="h-9 rounded-lg bg-[#27272A] hover:bg-[#7B1E2B] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                  >
                    Simular Desconto
                  </button>
                </div>

                {simResult && (
                  <div
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      simResult.evaluation.valid
                        ? 'bg-emerald-950/30 border-emerald-800/70 text-emerald-200'
                        : 'bg-rose-950/30 border-rose-800/70 text-rose-200'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{simResult.evaluation.message}</span>
                      <span className="text-[10px] font-mono-code uppercase">
                        {simResult.source === 'backend_authoritative' ? 'Express Server' : 'Simulação Local'}
                      </span>
                    </div>
                    <div className="font-mono-code tabular-nums text-[11px] flex flex-wrap gap-4 pt-1">
                      <span>
                        Base: {formatCurrencyCents(simResult.evaluation.baseAmountCents, simResult.evaluation.currency)}
                      </span>
                      <span>
                        Desconto: -{formatCurrencyCents(simResult.evaluation.discountAmountCents, simResult.evaluation.currency)}
                      </span>
                      <span className="font-bold text-white">
                        Final: {formatCurrencyCents(simResult.evaluation.finalAmountCents, simResult.evaluation.currency)}
                      </span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===============================================================
          SUB-ABA 6: CONFIGURAÇÃO GLOBAL (FAIL-CLOSED / CONFIRMAÇÃO EXPLÍCITA)
         =============================================================== */}
      {subTab === 'config' && (
        <div className="space-y-5">
          <div
            className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              config.commerceEnabled
                ? 'bg-amber-950/30 border-amber-800/70'
                : 'bg-emerald-950/20 border-emerald-900/60'
            }`}
          >
            <div className="flex items-start gap-3">
              {config.commerceEnabled ? (
                <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Lock className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="text-sm font-bold text-white">
                  {config.commerceEnabled
                    ? 'Atenção: Interruptor Comercial Global ATIVADO no Banco'
                    : 'Proteção Ativa: Modo Pago Global Permanecendo DESATIVADO (false)'}
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Documento canônico <code className="text-zinc-300">platform_config/commerce</code>. Na ausência do documento ou em qualquer erro/corrupção, o sistema força automaticamente todas as 7 flags para <code className="text-emerald-300">false</code> (Fail-Closed).
                </p>
              </div>
            </div>

            {config.commerceEnabled && (
              <button
                type="button"
                onClick={() => void handleSaveGlobalConfig(true)}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                Desativar Tudo Imediatamente
              </button>
            )}
          </div>

          <div className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4">
            <h4 className="text-sm font-bold text-white">Chaves de Controle Comercial Global</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(
                [
                  {
                    key: 'commerceEnabled',
                    title: 'commerceEnabled (Chave Mestra)',
                    desc: 'Habilita a infraestrutura comercial na plataforma. Enquanto false, todas as demais flags operam bloqueadas.',
                  },
                  {
                    key: 'catalogVisible',
                    title: 'catalogVisible (Vitrine de Produtos)',
                    desc: 'Permite exibir produtos públicos/ativos fora do painel administrativo.',
                  },
                  {
                    key: 'checkoutEnabled',
                    title: 'checkoutEnabled (Fluxo de Checkout)',
                    desc: 'Reservado para Fase 3/4. Gateway de pagamento ainda não conectado.',
                  },
                  {
                    key: 'promotionsEnabled',
                    title: 'promotionsEnabled (Cupons & Promoções)',
                    desc: 'Autoriza validação e aplicação real de cupons para alunos.',
                  },
                  {
                    key: 'advertisementsEnabled',
                    title: 'advertisementsEnabled (Banners/Ofertas)',
                    desc: 'Controla exibição de anúncios comerciais internos para alunos.',
                  },
                  {
                    key: 'paidClassesEnabled',
                    title: 'paidClassesEnabled (Turmas Pagas)',
                    desc: 'Habilita ofertas comerciais vinculadas a turmas pedagógicas.',
                  },
                  {
                    key: 'subscriptionsEnabled',
                    title: 'subscriptionsEnabled (Assinaturas Recorrentes)',
                    desc: 'Habilita planos mensais, semestrais e anuais.',
                  },
                ] as Array<{ key: keyof CommerceGlobalConfig; title: string; desc: string }>
              ).map((item) => {
                const checked = Boolean(draftConfig[item.key]);
                return (
                  <label
                    key={item.key}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      checked
                        ? 'bg-[#7B1E2B]/20 border-[#7B1E2B]/70'
                        : 'bg-[#09090B] border-[#27272A]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const nextVal = e.target.checked;
                        setDraftConfig((prev) => {
                          if (item.key === 'commerceEnabled' && !nextVal) {
                            return {
                              ...prev,
                              commerceEnabled: false,
                              catalogVisible: false,
                              checkoutEnabled: false,
                              promotionsEnabled: false,
                              advertisementsEnabled: false,
                              paidClassesEnabled: false,
                              subscriptionsEnabled: false,
                            };
                          }
                          return {
                            ...prev,
                            [item.key]: nextVal,
                          };
                        });
                      }}
                      className="mt-0.5 accent-[#7B1E2B]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white font-mono-code">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#A1A1AA] mt-0.5">{item.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            {wantsEnableSensitiveDraft && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/70 space-y-3">
                <p className="text-xs font-bold text-amber-300">
                  Confirmação Administrativa Obrigatória para Habilitar Comercialização:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#A1A1AA] mb-1">
                      Digite <code className="text-white">{COMMERCE_CONFIRMATION_PHRASE}</code>
                    </label>
                    <input
                      type="text"
                      value={activationConfirmationInput}
                      onChange={(e) => setActivationConfirmationInput(e.target.value)}
                      placeholder={COMMERCE_CONFIRMATION_PHRASE}
                      className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-amber-700 text-xs font-mono-code text-white uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#A1A1AA] mb-1">
                      Justificativa Registrada em Auditoria
                    </label>
                    <input
                      type="text"
                      value={activationReason}
                      onChange={(e) => setActivationReason(e.target.value)}
                      placeholder="Ex: Liberação autorizada em reunião..."
                      className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#27272A]">
              <div className="text-[11px] text-[#A1A1AA] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#71717A]" />
                <span>
                  Última gravação: {formatDatePtBr(config.updatedAt)}
                  {config.updatedByEmail ? ` por ${config.updatedByEmail}` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => void handleSaveGlobalConfig(false)}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7B1E2B] hover:bg-[#962535] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Configuração Global'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0F12] border border-[#27272A] text-[11px] text-[#A1A1AA] space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Nota Arquitetural de Hospedagem (GitHub Pages vs Backend Express)</span>
            </div>
            <p>
              O deploy do GitHub Pages publica apenas arquivos estáticos (<code className="text-zinc-300">npm run build:gh-pages</code>) e não executa o servidor <code className="text-zinc-300">server.ts</code>. As rotas administrativas e validações autoritativas de cupom/checkout exigem o backend Express hospedado em runtime Node/Cloud Run para execução em produção com Firebase Admin SDK.
            </p>
          </div>
        </div>
      )}

      {/* ===============================================================
          SUB-ABA 7: HISTÓRICO ADMINISTRATIVO COMERCIAL (admin_logs)
         =============================================================== */}
      {subTab === 'audit' && (
        <div className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              Trilha Imutável de Auditoria Comercial ({commerceLogs.length})
            </h3>
            <p className="text-[11px] text-[#A1A1AA] mt-0.5">
              Registros gravados em <code className="text-zinc-300">admin_logs</code> para criação de produtos, versionamento de preços, promoções, configuração global e tentativas não autorizadas.
            </p>
          </div>

          {commerceLogs.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-[#09090B] border border-[#27272A] text-xs text-[#71717A]">
              Nenhum evento comercial registrado nesta consulta recente.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#27272A] text-[#A1A1AA] text-[11px]">
                    <th className="py-2 pr-3">Data/Hora</th>
                    <th className="py-2 px-3">Evento</th>
                    <th className="py-2 px-3">Ator</th>
                    <th className="py-2 pl-3">Ação / Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {commerceLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#0F0F12]/60">
                      <td className="py-2.5 pr-3 font-mono-code text-[11px] text-[#A1A1AA] tabular-nums whitespace-nowrap">
                        {formatDatePtBr(log.timestamp)}
                      </td>
                      <td className="py-2.5 px-3 font-mono-code text-[11px] text-[#C5A059] whitespace-nowrap">
                        {log.eventType}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-white">
                        {log.actorEmail || log.actorUid}
                      </td>
                      <td className="py-2.5 pl-3">
                        <div className="text-white">{log.action}</div>
                        {log.details && (
                          <div className="text-[10px] font-mono-code text-[#71717A]">
                            {log.details}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {(subTab === 'campaigns' || subTab === 'class_offers' || subTab === 'orders_subs') && (
        <CommercePhase3SubPanels
          mode={subTab}
          config={config}
          products={products}
          prices={prices}
          phase3={phase3Overview}
          onRefresh={loadCommerceData}
          onNotify={onNotify}
          onError={setErrorMsg}
        />
      )}
    </div>
  );
};
