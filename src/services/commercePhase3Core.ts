// =========================================================================
// GUITAR ACADEMY — FASE 3: COMMERCE OPERATIONAL CORE (ISOMÓRFICO)
// src/services/commercePhase3Core.ts
// Lógica pura compartilhada entre Express (server.ts), Client Services e Testes.
// Zero dependências de Firebase Admin SDK, Client SDK ou módulos Node nativos.
// =========================================================================

import { ACADEMIC_CATALOG_COURSE_LIST, isValidCourseId } from './academicCatalog';
import {
  VALID_COMMERCE_ID_RE,
  VALID_CURRENCIES,
  VALID_ELIGIBLE_AUDIENCES,
} from './commerceCore';
import type { OfficialCourseId } from '../academia/progress/unlockGate';
import type {
  AdvertisementImageMimeType,
  AdvertisementPosition,
  AdvertisementStatus,
  ClassOfferStatus,
  ClassReservation,
  ClassWaitlistEntry,
  CommerceAdvertisement,
  CommerceClassOffer,
  CommerceCurrency,
  CommerceEligibleAudience,
  CommerceGlobalConfig,
  CommerceOrder,
  CommercePayment,
  CommercePromotion,
  CommerceSubscription,
  CreateAdvertisementInput,
  CreateClassOfferInput,
  FinancialAdjustmentRecord,
  FinancialSummaryReport,
  SubscriptionStatus,
  UpdateAdvertisementInput,
  UpdateClassOfferInput,
} from '../types/commerce';
import type { NormalizedPaymentWebhookEvent } from './paymentGateway';

export const MAX_AD_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_AD_MIME_TYPES: readonly AdvertisementImageMimeType[] = [
  'image/webp',
  'image/png',
  'image/jpeg',
] as const;

export const ALLOWED_AD_EXTENSIONS: readonly string[] = ['webp', 'png', 'jpg', 'jpeg'] as const;

export const VALID_AD_POSITIONS: readonly AdvertisementPosition[] = [
  'home',
  'courses',
  'instruments',
  'promotions',
  'enrollments',
] as const;

export const VALID_AD_STATUSES: readonly AdvertisementStatus[] = [
  'draft',
  'active',
  'paused',
  'archived',
] as const;

export const VALID_CLASS_OFFER_STATUSES: readonly ClassOfferStatus[] = [
  'draft',
  'scheduled',
  'open',
  'closed',
  'cancelled',
] as const;

export const VALID_SUBSCRIPTION_STATUSES: readonly SubscriptionStatus[] = [
  'trialing',
  'active',
  'past_due',
  'paused',
  'cancelled',
  'expired',
] as const;

export const DEFAULT_RESERVATION_TTL_MS = 30 * 60 * 1000; // 30 minutos
export const DEFAULT_WAITLIST_SUMMON_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

export function generatePhase3Id(
  prefix: 'ad' | 'offer' | 'res' | 'wait' | 'wl' | 'ord' | 'pay' | 'evt' | 'sub' | 'ent' | 'adj' | 'tok'
): string {
  const rand = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${Date.now()}_${rand}`;
}

export function isSafeDestinationUrl(raw: string): boolean {
  const trimmed = String(raw || '').trim();
  if (!trimmed || trimmed.length > 300) return false;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return false;
  }
  if (trimmed.startsWith('/')) return true;
  if (lower.startsWith('https://') || lower.startsWith('http://')) return true;
  return false;
}

export function getCanonicalExtensionForMime(mimeType: AdvertisementImageMimeType): 'webp' | 'png' | 'jpg' {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/jpeg') return 'jpg';
  return 'webp';
}

export function matchesMagicBytesForMime(
  bytes: Uint8Array,
  mimeType: AdvertisementImageMimeType
): boolean {
  if (!bytes || bytes.length < 12) return false;
  if (mimeType === 'image/webp') {
    // RIFF....WEBP
    return (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    );
  }
  if (mimeType === 'image/png') {
    // 89 50 4E 47 0D 0A 1A 0A
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }
  if (mimeType === 'image/jpeg') {
    // FF D8 FF
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  return false;
}

export function buildAdvertisementStoragePath(
  advertisementId: string,
  mimeType: AdvertisementImageMimeType,
  nextVersion: number
): string {
  const ext = getCanonicalExtensionForMime(mimeType);
  if (nextVersion <= 1 && ext === 'webp') {
    return `commerce/advertisements/${advertisementId}/banner.webp`;
  }
  if (nextVersion <= 1) {
    return `commerce/advertisements/${advertisementId}/banner.${ext}`;
  }
  return `commerce/advertisements/${advertisementId}/banner_v${nextVersion}.${ext}`;
}

export function validateBannerFileUpload(params: {
  advertisementId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  bytes?: Uint8Array | null;
  nextVersion?: number;
}):
  | {
      valid: true;
      data: {
        mimeType: AdvertisementImageMimeType;
        extension: string;
        sizeBytes: number;
        storagePath: string;
      };
    }
  | { valid: false; error: string } {
  const adId = String(params.advertisementId || '').trim();
  if (!VALID_COMMERCE_ID_RE.test(adId)) {
    return { valid: false, error: 'Identificador de campanha inválido para upload.' };
  }

  const fileName = String(params.fileName || '').trim();
  const extMatch = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  const ext = extMatch ? extMatch[1] : '';
  if (!ext || !ALLOWED_AD_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: 'Extensão de arquivo não permitida. Envie apenas .webp, .png ou .jpg/.jpeg.',
    };
  }

  const normalizedMime = String(params.mimeType || '').trim().toLowerCase();
  if (!ALLOWED_AD_MIME_TYPES.includes(normalizedMime as AdvertisementImageMimeType)) {
    return {
      valid: false,
      error: 'Tipo MIME não permitido. Utilize image/webp, image/png ou image/jpeg.',
    };
  }

  const mime = normalizedMime as AdvertisementImageMimeType;
  const mimeMatchesExt =
    (mime === 'image/webp' && ext === 'webp') ||
    (mime === 'image/png' && ext === 'png') ||
    (mime === 'image/jpeg' && (ext === 'jpg' || ext === 'jpeg'));

  if (!mimeMatchesExt) {
    return {
      valid: false,
      error: 'A extensão do arquivo não corresponde ao tipo MIME declarado.',
    };
  }

  const sizeBytes = Number(params.sizeBytes);
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    return { valid: false, error: 'O arquivo de imagem está vazio ou inválido.' };
  }
  if (sizeBytes > MAX_AD_IMAGE_BYTES) {
    return {
      valid: false,
      error: `A imagem excede o limite máximo de ${Math.round(MAX_AD_IMAGE_BYTES / (1024 * 1024))} MB.`,
    };
  }

  if (params.bytes && !matchesMagicBytesForMime(params.bytes, mime)) {
    return {
      valid: false,
      error: 'Assinatura binária da imagem inválida ou inconsistente com o formato declarado.',
    };
  }

  const storagePath = buildAdvertisementStoragePath(adId, mime, params.nextVersion ?? 1);

  return {
    valid: true,
    data: {
      mimeType: mime,
      extension: ext,
      sizeBytes: Math.round(sizeBytes),
      storagePath,
    },
  };
}

export function validateAdvertisementCreateInput(
  input: CreateAdvertisementInput
):
  | {
      valid: true;
      data: {
        title: string;
        subtitle: string | null;
        description: string;
        ctaText: string;
        ctaDestination: string;
        productId: string | null;
        targetAudience: CommerceEligibleAudience;
        eligibleStudentUids: string[];
        position: AdvertisementPosition;
        startsAt: string | null;
        startsAtMs: number | null;
        endsAt: string | null;
        endsAtMs: number | null;
        status: AdvertisementStatus;
      };
    }
  | { valid: false; error: string } {
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  if (title.length < 3 || title.length > 120) {
    return { valid: false, error: 'O título da campanha deve ter entre 3 e 120 caracteres.' };
  }

  const subtitle =
    typeof input.subtitle === 'string' && input.subtitle.trim()
      ? input.subtitle.trim().slice(0, 200)
      : null;

  const description = typeof input.description === 'string' ? input.description.trim() : '';
  if (description.length > 1000) {
    return { valid: false, error: 'A descrição da campanha deve ter no máximo 1000 caracteres.' };
  }

  const ctaText = typeof input.ctaText === 'string' ? input.ctaText.trim() : '';
  if (ctaText.length < 2 || ctaText.length > 60) {
    return { valid: false, error: 'O texto do botão (CTA) deve ter entre 2 e 60 caracteres.' };
  }

  const ctaDestination = typeof input.ctaDestination === 'string' ? input.ctaDestination.trim() : '';
  if (!isSafeDestinationUrl(ctaDestination)) {
    return {
      valid: false,
      error: 'Destino do botão inválido. Utilize uma rota interna (/...) ou URL https:// segura.',
    };
  }

  const productId =
    typeof input.productId === 'string' && input.productId.trim() ? input.productId.trim() : null;
  if (productId && !VALID_COMMERCE_ID_RE.test(productId)) {
    return { valid: false, error: 'Identificador de produto anunciado inválido.' };
  }

  if (!VALID_AD_POSITIONS.includes(input.position)) {
    return { valid: false, error: 'Posição de exibição da campanha inválida.' };
  }

  const targetAudience: CommerceEligibleAudience =
    input.targetAudience && VALID_ELIGIBLE_AUDIENCES.includes(input.targetAudience)
      ? input.targetAudience
      : 'all';

  const eligibleStudentUids: string[] = [];
  for (const uid of Array.isArray(input.eligibleStudentUids) ? input.eligibleStudentUids : []) {
    const cleaned = String(uid || '').trim();
    if (!VALID_COMMERCE_ID_RE.test(cleaned)) {
      return { valid: false, error: `UID de público-alvo inválido: "${cleaned}".` };
    }
    if (!eligibleStudentUids.includes(cleaned)) eligibleStudentUids.push(cleaned);
  }
  if (targetAudience === 'specific_uids' && eligibleStudentUids.length === 0) {
    return { valid: false, error: 'Informe ao menos um UID para segmentação individual.' };
  }

  let startsAt: string | null = null;
  let startsAtMs: number | null = null;
  if (input.startsAt) {
    const parsed = Date.parse(String(input.startsAt));
    if (Number.isNaN(parsed)) {
      return { valid: false, error: 'Data de início da campanha inválida.' };
    }
    startsAt = new Date(parsed).toISOString();
    startsAtMs = parsed;
  }

  let endsAt: string | null = null;
  let endsAtMs: number | null = null;
  if (input.endsAt) {
    const parsed = Date.parse(String(input.endsAt));
    if (Number.isNaN(parsed)) {
      return { valid: false, error: 'Data de término da campanha inválida.' };
    }
    endsAt = new Date(parsed).toISOString();
    endsAtMs = parsed;
  }

  if (startsAtMs !== null && endsAtMs !== null && endsAtMs <= startsAtMs) {
    return { valid: false, error: 'A data de término deve ser posterior à data de início.' };
  }

  const status: AdvertisementStatus =
    input.status && VALID_AD_STATUSES.includes(input.status) ? input.status : 'draft';

  return {
    valid: true,
    data: {
      title,
      subtitle,
      description,
      ctaText,
      ctaDestination,
      productId,
      targetAudience,
      eligibleStudentUids,
      position: input.position,
      startsAt,
      startsAtMs,
      endsAt,
      endsAtMs,
      status,
    },
  };
}

export function validateAdvertisementUpdateInput(
  existing: CommerceAdvertisement,
  patch: UpdateAdvertisementInput
):
  | { valid: true; nextAdvertisement: Omit<CommerceAdvertisement, 'updatedAt'> }
  | { valid: false; error: string } {
  const checked = validateAdvertisementCreateInput({
    title: patch.title !== undefined ? patch.title : existing.title,
    subtitle: patch.subtitle !== undefined ? patch.subtitle : existing.subtitle,
    description: patch.description !== undefined ? patch.description : existing.description,
    ctaText: patch.ctaText !== undefined ? patch.ctaText : existing.ctaText,
    ctaDestination: patch.ctaDestination !== undefined ? patch.ctaDestination : existing.ctaDestination,
    productId: patch.productId !== undefined ? patch.productId : existing.productId,
    targetAudience: patch.targetAudience !== undefined ? patch.targetAudience : existing.targetAudience,
    eligibleStudentUids:
      patch.eligibleStudentUids !== undefined
        ? patch.eligibleStudentUids
        : existing.eligibleStudentUids,
    position: patch.position !== undefined ? patch.position : existing.position,
    startsAt: patch.startsAt !== undefined ? patch.startsAt : existing.startsAt,
    endsAt: patch.endsAt !== undefined ? patch.endsAt : existing.endsAt,
    status: patch.status !== undefined ? patch.status : existing.status,
  });

  if (!checked.valid) {
    return checked;
  }

  return {
    valid: true,
    nextAdvertisement: {
      ...existing,
      ...checked.data,
    },
  };
}

export function isAdvertisementVisibleToStudent(params: {
  advertisement: CommerceAdvertisement;
  config: CommerceGlobalConfig;
  studentUid?: string | null;
  hasActiveClassEnrollment?: boolean;
  position?: AdvertisementPosition;
  nowMs?: number;
}): boolean {
  const { advertisement, config } = params;
  // Fail-closed: nenhum banner público é exposto enquanto modo pago ou advertisementsEnabled estiverem false
  if (!config.commerceEnabled || !config.advertisementsEnabled) {
    return false;
  }
  if (advertisement.status !== 'active') return false;
  if (params.position && advertisement.position !== params.position) return false;

  const nowMs = params.nowMs ?? Date.now();
  if (typeof advertisement.startsAtMs === 'number' && nowMs < advertisement.startsAtMs) {
    return false;
  }
  if (typeof advertisement.endsAtMs === 'number' && nowMs > advertisement.endsAtMs) {
    return false;
  }

  if (advertisement.targetAudience === 'specific_uids') {
    if (!params.studentUid || !advertisement.eligibleStudentUids.includes(params.studentUid)) {
      return false;
    }
  } else if (advertisement.targetAudience === 'new_students' && params.hasActiveClassEnrollment === true) {
    return false;
  } else if (
    advertisement.targetAudience === 'enrolled_students' &&
    params.hasActiveClassEnrollment === false
  ) {
    return false;
  }

  return true;
}

// =========================================================================
// OFERTAS DE TURMAS PAGAS, RESERVAS E LISTA DE ESPERA
// =========================================================================

export function validateClassOfferCreateInput(
  input: CreateClassOfferInput
):
  | {
      valid: true;
      data: {
        classId: string;
        productId: string;
        priceId: string;
        capacity: number;
        registrationStartsAt: string | null;
        registrationStartsAtMs: number | null;
        registrationEndsAt: string | null;
        registrationEndsAtMs: number | null;
        status: ClassOfferStatus;
        waitlistEnabled: boolean;
      };
    }
  | { valid: false; error: string } {
  const classId = typeof input.classId === 'string' ? input.classId.trim() : '';
  const productId = typeof input.productId === 'string' ? input.productId.trim() : '';
  const priceId = typeof input.priceId === 'string' ? input.priceId.trim() : '';

  if (!VALID_COMMERCE_ID_RE.test(classId)) {
    return { valid: false, error: 'Identificador da turma existente inválido.' };
  }
  if (!VALID_COMMERCE_ID_RE.test(productId)) {
    return { valid: false, error: 'Identificador do produto comercial inválido.' };
  }
  if (!VALID_COMMERCE_ID_RE.test(priceId)) {
    return { valid: false, error: 'Identificador do preço vinculado inválido.' };
  }

  const capacity = Number(input.capacity);
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 500) {
    return { valid: false, error: 'A quantidade de vagas da oferta deve ser um inteiro entre 1 e 500.' };
  }

  let registrationStartsAt: string | null = null;
  let registrationStartsAtMs: number | null = null;
  if (input.registrationStartsAt) {
    const parsed = Date.parse(String(input.registrationStartsAt));
    if (Number.isNaN(parsed)) {
      return { valid: false, error: 'Data de abertura das inscrições inválida.' };
    }
    registrationStartsAt = new Date(parsed).toISOString();
    registrationStartsAtMs = parsed;
  }

  let registrationEndsAt: string | null = null;
  let registrationEndsAtMs: number | null = null;
  if (input.registrationEndsAt) {
    const parsed = Date.parse(String(input.registrationEndsAt));
    if (Number.isNaN(parsed)) {
      return { valid: false, error: 'Data de encerramento das inscrições inválida.' };
    }
    registrationEndsAt = new Date(parsed).toISOString();
    registrationEndsAtMs = parsed;
  }

  if (
    registrationStartsAtMs !== null &&
    registrationEndsAtMs !== null &&
    registrationEndsAtMs <= registrationStartsAtMs
  ) {
    return { valid: false, error: 'O encerramento deve ser posterior à abertura das inscrições.' };
  }

  const status: ClassOfferStatus =
    input.status && VALID_CLASS_OFFER_STATUSES.includes(input.status) ? input.status : 'draft';

  return {
    valid: true,
    data: {
      classId,
      productId,
      priceId,
      capacity,
      registrationStartsAt,
      registrationStartsAtMs,
      registrationEndsAt,
      registrationEndsAtMs,
      status,
      waitlistEnabled: input.waitlistEnabled !== false,
    },
  };
}

export function validateClassOfferUpdateInput(
  existing: CommerceClassOffer,
  patch: UpdateClassOfferInput
):
  | { valid: true; nextOffer: Omit<CommerceClassOffer, 'updatedAt'> }
  | { valid: false; error: string } {
  const checked = validateClassOfferCreateInput({
    classId: existing.classId,
    productId: existing.productId,
    priceId: patch.priceId !== undefined ? patch.priceId : existing.priceId,
    capacity: patch.capacity !== undefined ? patch.capacity : existing.capacity,
    registrationStartsAt:
      patch.registrationStartsAt !== undefined
        ? patch.registrationStartsAt
        : existing.registrationStartsAt,
    registrationEndsAt:
      patch.registrationEndsAt !== undefined
        ? patch.registrationEndsAt
        : existing.registrationEndsAt,
    status: patch.status !== undefined ? patch.status : existing.status,
    waitlistEnabled:
      patch.waitlistEnabled !== undefined ? patch.waitlistEnabled : existing.waitlistEnabled,
  });

  if (!checked.valid) {
    return checked;
  }

  const occupied = (existing.reservedSeats || 0) + (existing.confirmedSeats || 0);
  if (checked.data.capacity < occupied) {
    return {
      valid: false,
      error: `A capacidade não pode ser menor que o total já reservado/confirmado (${occupied}).`,
    };
  }

  return {
    valid: true,
    nextOffer: {
      ...existing,
      ...checked.data,
    },
  };
}

export function computeAvailableOfferSeats(offer: CommerceClassOffer): number {
  return Math.max(0, (offer.capacity || 0) - (offer.reservedSeats || 0) - (offer.confirmedSeats || 0));
}

export function canOfferAcceptReservation(
  offer: CommerceClassOffer,
  nowMs: number = Date.now()
): { allowed: boolean; reason?: string } {
  if (offer.status === 'cancelled' || offer.status === 'closed' || offer.status === 'draft') {
    return { allowed: false, reason: 'Esta oferta de turma não está aberta para reservas.' };
  }
  if (typeof offer.registrationStartsAtMs === 'number' && nowMs < offer.registrationStartsAtMs) {
    return { allowed: false, reason: 'O período de inscrições desta oferta ainda não iniciou.' };
  }
  if (typeof offer.registrationEndsAtMs === 'number' && nowMs > offer.registrationEndsAtMs) {
    return { allowed: false, reason: 'O período de inscrições desta oferta foi encerrado.' };
  }
  if (computeAvailableOfferSeats(offer) <= 0) {
    return { allowed: false, reason: 'Não há vagas disponíveis nesta oferta.' };
  }
  return { allowed: true };
}

export function isReservationExpired(
  reservation: Pick<ClassReservation, 'status' | 'expiresAtMs'>,
  nowMs: number = Date.now()
): boolean {
  return (
    reservation.status === 'pending_payment' &&
    typeof reservation.expiresAtMs === 'number' &&
    nowMs > reservation.expiresAtMs
  );
}

export function isWaitlistSummonExpired(
  entry: Pick<ClassWaitlistEntry, 'status' | 'responseDeadlineAtMs'>,
  nowMs: number = Date.now()
): boolean {
  return (
    entry.status === 'summoned' &&
    typeof entry.responseDeadlineAtMs === 'number' &&
    nowMs > entry.responseDeadlineAtMs
  );
}

export function pickNextWaitlistCandidate(
  entries: ReadonlyArray<ClassWaitlistEntry>
): ClassWaitlistEntry | null {
  const waiting = entries.filter((e) => e.status === 'waiting');
  if (waiting.length === 0) return null;
  return [...waiting].sort((a, b) => {
    if (a.priorityOrder !== b.priorityOrder) {
      return a.priorityOrder - b.priorityOrder;
    }
    return a.joinedAtMs - b.joinedAtMs;
  })[0];
}

// =========================================================================
// SEGURANÇA DE PAGAMENTOS, WEBHOOKS E ASSINATURAS
// =========================================================================

const SENSITIVE_CARD_KEYS = new Set([
  'cardnumber',
  'card_number',
  'pan',
  'cvv',
  'cvc',
  'cardcvv',
  'card_cvv',
  'cardcvc',
  'card_cvc',
  'securitycode',
  'security_code',
  'pin',
  'track1',
  'track2',
  'rawcard',
]);

export function assertNoSensitiveCardData(payload: unknown): { ok: true } | { ok: false; field: string } {
  const visit = (node: unknown): string | null => {
    if (!node || typeof node !== 'object') return null;
    if (Array.isArray(node)) {
      for (const item of node) {
        const hit = visit(item);
        if (hit) return hit;
      }
      return null;
    }
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      const normalizedKey = k.toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (SENSITIVE_CARD_KEYS.has(normalizedKey)) {
        return k;
      }
      const nestedHit = visit(v);
      if (nestedHit) return nestedHit;
    }
    return null;
  };

  const found = visit(payload);
  if (found) {
    return { ok: false, field: found };
  }
  return { ok: true };
}

export function validateWebhookPaymentConsistency(params: {
  order: CommerceOrder;
  event: NormalizedPaymentWebhookEvent;
}): { valid: true } | { valid: false; reason: string } {
  const { order, event } = params;

  if (!VALID_CURRENCIES.includes(event.currency) || event.currency !== order.currency) {
    return {
      valid: false,
      reason: `Moeda divergente no evento de pagamento (esperado ${order.currency}, recebido ${String(event.currency)}).`,
    };
  }

  if (
    order.providerReference &&
    event.providerReference &&
    order.providerReference !== event.providerReference
  ) {
    return {
      valid: false,
      reason: 'Referência do provedor no webhook não corresponde ao pedido.',
    };
  }

  if (event.eventType === 'payment.paid') {
    if (!Number.isInteger(event.amountCents) || event.amountCents !== order.totalCents) {
      return {
        valid: false,
        reason: `Valor pago divergente do total autorizado no pedido (esperado ${order.totalCents}c, recebido ${String(event.amountCents)}c).`,
      };
    }
  }

  if (
    event.eventType === 'payment.refunded' ||
    event.eventType === 'payment.partially_refunded'
  ) {
    const refundedCents = event.refundedAmountCents ?? event.amountCents;
    if (!Number.isInteger(refundedCents) || refundedCents <= 0 || refundedCents > order.totalCents) {
      return {
        valid: false,
        reason: 'Valor de reembolso inválido ou superior ao total do pedido.',
      };
    }
  }

  return { valid: true };
}

export function applySubscriptionLifecycleTransition(params: {
  subscription: CommerceSubscription;
  nextStatus: SubscriptionStatus;
  reason?: string | null;
  nowIso?: string;
}):
  | {
      valid: true;
      subscription: CommerceSubscription;
      entitlementStatus: 'active' | 'expired' | 'revoked' | 'cancelled';
    }
  | { valid: false; error: string } {
  const { subscription, nextStatus } = params;
  if (!VALID_SUBSCRIPTION_STATUSES.includes(nextStatus)) {
    return { valid: false, error: 'Status de assinatura inválido.' };
  }

  const nowIso = params.nowIso || new Date().toISOString();
  const reason = params.reason ? params.reason.trim().slice(0, 300) : null;

  const updated: CommerceSubscription = {
    ...subscription,
    status: nextStatus,
    pausedAt: nextStatus === 'paused' ? nowIso : nextStatus === 'active' ? null : subscription.pausedAt ?? null,
    cancelledAt:
      nextStatus === 'cancelled' ? nowIso : nextStatus === 'active' ? null : subscription.cancelledAt ?? null,
    cancelReason: nextStatus === 'cancelled' ? reason || subscription.cancelReason || null : subscription.cancelReason ?? null,
    billingHistory: [
      ...(subscription.billingHistory || []).slice(-49),
      {
        entryId: `hist_${Date.now()}`,
        amountCents: 0,
        currency: subscription.currency,
        status: nextStatus,
        date: nowIso,
        note: reason || `Status alterado para ${nextStatus}`,
      },
    ],
    updatedAt: nowIso,
  };

  let entitlementStatus: 'active' | 'expired' | 'revoked' | 'cancelled' = 'cancelled';
  if (nextStatus === 'active' || nextStatus === 'trialing') {
    entitlementStatus = 'active';
  } else if (nextStatus === 'expired' || nextStatus === 'past_due') {
    entitlementStatus = 'expired';
  } else if (nextStatus === 'paused' || nextStatus === 'cancelled') {
    entitlementStatus = 'cancelled';
  }

  return { valid: true, subscription: updated, entitlementStatus };
}

// =========================================================================
// MOTOR FINANCEIRO PURO (NUNCA INVENTA VALORES; SEPARA HOMOLOGAÇÃO VS REAL)
// =========================================================================

export function computeFinancialSummaryReport(params: {
  orders: ReadonlyArray<CommerceOrder>;
  payments: ReadonlyArray<CommercePayment>;
  subscriptions: ReadonlyArray<CommerceSubscription>;
  promotions?: ReadonlyArray<CommercePromotion>;
  adjustments?: ReadonlyArray<FinancialAdjustmentRecord>;
  currency?: CommerceCurrency;
  includeHomologation?: boolean;
  startDateIso?: string;
  endDateIso?: string;
}): FinancialSummaryReport {
  const currency = params.currency || 'BRL';
  const includeHomologation = params.includeHomologation === true;

  const startMs =
    params.startDateIso && !Number.isNaN(Date.parse(params.startDateIso))
      ? Date.parse(params.startDateIso)
      : null;
  const endMs =
    params.endDateIso && !Number.isNaN(Date.parse(params.endDateIso))
      ? Date.parse(params.endDateIso)
      : null;

  const hasRealTransactions =
    params.orders.some((o) => !o.isHomologation) ||
    params.payments.some((p) => !p.isHomologation);
  const hasHomologationTransactions =
    params.orders.some((o) => Boolean(o.isHomologation)) ||
    params.payments.some((p) => Boolean(p.isHomologation));

  const filteredOrders = params.orders.filter((o) => {
    if (o.currency !== currency) return false;
    if (!includeHomologation && o.isHomologation) return false;
    const ms = Date.parse(o.createdAt);
    if (startMs !== null && !Number.isNaN(ms) && ms < startMs) return false;
    if (endMs !== null && !Number.isNaN(ms) && ms > endMs) return false;
    return true;
  });

  const filteredSubs = params.subscriptions.filter((s) => {
    if (s.currency !== currency) return false;
    if (!includeHomologation && s.isHomologation) return false;
    return true;
  });

  const filteredAdjustments = (params.adjustments || []).filter((a) => a.currency === currency);

  let grossRevenueCents = 0;
  let totalDiscountCents = 0;
  let refundedAmountCents = 0;
  let pendingOrdersCount = 0;
  let approvedOrdersCount = 0;
  let refusedOrdersCount = 0;
  let refundsCount = 0;

  const courseTotalsMap = new Map<
    OfficialCourseId,
    { ordersCount: number; grossCents: number; netCents: number }
  >();
  for (const c of ACADEMIC_CATALOG_COURSE_LIST) {
    courseTotalsMap.set(c.id, { ordersCount: 0, grossCents: 0, netCents: 0 });
  }

  const periodMap = new Map<string, { ordersCount: number; grossCents: number; netCents: number }>();
  const couponMap = new Map<string, { promotionId: string; code: string; usesCount: number; discountGrantedCents: number }>();

  for (const order of filteredOrders) {
    if (order.status === 'pending') {
      pendingOrdersCount += 1;
    } else if (order.status === 'failed' || order.status === 'cancelled') {
      refusedOrdersCount += 1;
    } else if (order.status === 'paid' || order.status === 'partially_refunded' || order.status === 'refunded') {
      if (order.status === 'paid') {
        approvedOrdersCount += 1;
      } else {
        refundsCount += 1;
      }

      const orderGross = Math.max(0, order.subtotalCents || 0);
      const orderDiscount = Math.max(0, order.discountCents || 0);
      const orderRefunded = Math.max(0, order.refundedAmountCents || (order.status === 'refunded' ? order.totalCents : 0));
      const orderNetContribution = Math.max(0, (order.totalCents || 0) - orderRefunded);

      grossRevenueCents += orderGross;
      totalDiscountCents += orderDiscount;
      refundedAmountCents += orderRefunded;

      const periodKey = String(order.createdAt || '').slice(0, 7) || 'sem-data';
      const pEntry = periodMap.get(periodKey) || { ordersCount: 0, grossCents: 0, netCents: 0 };
      pEntry.ordersCount += 1;
      pEntry.grossCents += orderGross;
      pEntry.netCents += orderNetContribution;
      periodMap.set(periodKey, pEntry);

      if (order.promotionSnapshot?.promotionId) {
        const promoId = order.promotionSnapshot.promotionId;
        const cEntry = couponMap.get(promoId) || {
          promotionId: promoId,
          code: order.promotionSnapshot.code || promoId,
          usesCount: 0,
          discountGrantedCents: 0,
        };
        cEntry.usesCount += 1;
        cEntry.discountGrantedCents += order.promotionSnapshot.discountAmountCents || orderDiscount;
        couponMap.set(promoId, cEntry);
      }

      // Distribui receita entre os cursos dos itens do pedido sem inflar soma
      const distinctCourses = new Set<OfficialCourseId>();
      for (const item of order.items || []) {
        for (const cid of item.courseIds || []) {
          if (isValidCourseId(cid)) distinctCourses.add(cid);
        }
      }
      const countCourses = distinctCourses.size;
      if (countCourses > 0) {
        const splitGross = Math.round(orderGross / countCourses);
        const splitNet = Math.round(orderNetContribution / countCourses);
        for (const cid of distinctCourses) {
          const cur = courseTotalsMap.get(cid);
          if (cur) {
            cur.ordersCount += 1;
            cur.grossCents += splitGross;
            cur.netCents += splitNet;
          }
        }
      }
    }
  }

  const netAdjustmentsCents = filteredAdjustments.reduce((acc, a) => acc + (a.amountCents || 0), 0);
  const netRevenueCents = Math.max(
    0,
    grossRevenueCents - totalDiscountCents - refundedAmountCents + netAdjustmentsCents
  );

  const activeSubscriptionsCount = filteredSubs.filter(
    (s) => s.status === 'active' || s.status === 'trialing'
  ).length;
  const overdueOrExpiredSubscriptionsCount = filteredSubs.filter(
    (s) => s.status === 'past_due' || s.status === 'expired'
  ).length;

  return {
    currency,
    hasRealTransactions,
    hasHomologationTransactions,
    totalSoldCount: approvedOrdersCount + refundsCount,
    grossRevenueCents,
    netRevenueCents,
    totalDiscountCents,
    pendingOrdersCount,
    approvedOrdersCount,
    refusedOrdersCount,
    refundsCount,
    refundedAmountCents,
    activeSubscriptionsCount,
    overdueOrExpiredSubscriptionsCount,
    salesByCourse: ACADEMIC_CATALOG_COURSE_LIST.map((c) => {
      const entry = courseTotalsMap.get(c.id) || { ordersCount: 0, grossCents: 0, netCents: 0 };
      return {
        courseId: c.id,
        courseTitle: c.title,
        ...entry,
      };
    }),
    salesByPeriod: Array.from(periodMap.entries())
      .map(([periodKey, v]) => ({ periodKey, ...v }))
      .sort((a, b) => b.periodKey.localeCompare(a.periodKey)),
    couponUsage: Array.from(couponMap.values()).sort((a, b) => b.usesCount - a.usesCount),
    adjustmentsCount: filteredAdjustments.length,
    netAdjustmentsCents,
  };
}
