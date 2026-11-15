import type { OfficialCourseId } from '../academia/progress/unlockGate';

// =========================================================================
// GUITAR ACADEMY — FASE 2: COMMERCE CORE TYPES
// Catálogo comercial, preços versionados, planos, promoções, cupons e
// configuração global fail-closed (sem gateway ativo / modo pago desligado).
// =========================================================================

export type CommerceProductType =
  | 'individual_course'
  | 'instrument_bundle'
  | 'subscription_plan'
  | 'lifetime_access'
  | 'experimental_course'
  | 'paid_class_offer';

export type CommerceProductStatus = 'draft' | 'active' | 'archived';

export type CommerceProductVisibility = 'hidden' | 'public';

export interface CommerceProduct {
  productId: string;
  name: string;
  description: string;
  productType: CommerceProductType;
  courseIds: OfficialCourseId[];
  status: CommerceProductStatus;
  visibility: CommerceProductVisibility;
  linkedClassId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByEmail?: string | null;
}

export type CommerceBillingInterval =
  | 'one_time'
  | 'monthly'
  | 'semiannual'
  | 'annual'
  | 'lifetime';

export type CommerceCurrency = 'BRL' | 'USD' | 'EUR';

export type CommercePriceStatus = 'active' | 'superseded' | 'archived';

export interface CommerceProductPrice {
  priceId: string;
  productId: string;
  currency: CommerceCurrency;
  amount: number;
  amountCents: number;
  billingInterval: CommerceBillingInterval;
  isPromotional: boolean;
  promotionalLabel?: string | null;
  version: number;
  previousPriceId?: string | null;
  status: CommercePriceStatus;
  validFrom?: string | null;
  validFromMs?: number | null;
  validUntil?: string | null;
  validUntilMs?: number | null;
  notes?: string | null;
  createdAt: string;
  createdBy: string;
  createdByEmail?: string | null;
  supersededAt?: string | null;
  supersededBy?: string | null;
}

export interface AppliedPriceSnapshot {
  snapshotId: string;
  productId: string;
  productName: string;
  priceId: string;
  priceVersion: number;
  currency: CommerceCurrency;
  billingInterval: CommerceBillingInterval;
  baseAmount: number;
  baseAmountCents: number;
  discountAmount: number;
  discountAmountCents: number;
  finalAmount: number;
  finalAmountCents: number;
  promotionId?: string | null;
  couponCode?: string | null;
  capturedAt: string;
}

export type CommerceDiscountType = 'percentage' | 'fixed_amount';

export type CommercePromotionScopeType =
  | 'all_products'
  | 'product'
  | 'course'
  | 'bundle';

export type CommerceEligibleAudience =
  | 'all'
  | 'new_students'
  | 'enrolled_students'
  | 'specific_uids';

export type CommercePromotionStatus = 'draft' | 'active' | 'paused' | 'ended';

export interface CommercePromotion {
  promotionId: string;
  name: string;
  description?: string | null;
  code?: string | null;
  discountType: CommerceDiscountType;
  discountValue: number;
  scopeType: CommercePromotionScopeType;
  targetProductIds: string[];
  targetCourseIds: OfficialCourseId[];
  startsAt?: string | null;
  startsAtMs?: number | null;
  endsAt?: string | null;
  endsAtMs?: number | null;
  maxRedemptions?: number | null;
  maxPerStudent?: number | null;
  redeemedCount: number;
  eligibleAudience: CommerceEligibleAudience;
  eligibleStudentUids: string[];
  status: CommercePromotionStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByEmail?: string | null;
}

export interface CommerceGlobalConfig {
  configId: 'commerce';
  commerceEnabled: boolean;
  catalogVisible: boolean;
  checkoutEnabled: boolean;
  promotionsEnabled: boolean;
  advertisementsEnabled: boolean;
  paidClassesEnabled: boolean;
  subscriptionsEnabled: boolean;
  defaultCurrency: CommerceCurrency;
  updatedAt: string | null;
  updatedBy: string | null;
  updatedByEmail?: string | null;
  lastActivationReason?: string | null;
  failClosedVerified: true;
}

export interface CreateCommerceProductInput {
  name: string;
  description: string;
  productType: CommerceProductType;
  courseIds: string[];
  status?: CommerceProductStatus;
  linkedClassId?: string | null;
  notes?: string | null;
}

export interface UpdateCommerceProductInput {
  name?: string;
  description?: string;
  productType?: CommerceProductType;
  courseIds?: string[];
  status?: CommerceProductStatus;
  visibility?: CommerceProductVisibility;
  linkedClassId?: string | null;
  notes?: string | null;
}

export interface CreateCommercePriceVersionInput {
  productId: string;
  currency?: CommerceCurrency;
  amount: number;
  billingInterval: CommerceBillingInterval;
  isPromotional?: boolean;
  promotionalLabel?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  notes?: string | null;
}

export interface CreateCommercePromotionInput {
  name: string;
  description?: string | null;
  code?: string | null;
  discountType: CommerceDiscountType;
  discountValue: number;
  scopeType: CommercePromotionScopeType;
  targetProductIds?: string[];
  targetCourseIds?: string[];
  startsAt?: string | null;
  endsAt?: string | null;
  maxRedemptions?: number | null;
  maxPerStudent?: number | null;
  eligibleAudience?: CommerceEligibleAudience;
  eligibleStudentUids?: string[];
  status?: CommercePromotionStatus;
}

export interface EvaluateCouponInput {
  code: string;
  product: CommerceProduct;
  price: CommerceProductPrice;
  promotion: CommercePromotion | null;
  config: CommerceGlobalConfig;
  studentUid?: string | null;
  isNewStudent?: boolean;
  hasActiveClassEnrollment?: boolean;
  studentRedemptionCount?: number;
  nowMs?: number;
  allowAdminPreviewWhenDisabled?: boolean;
}

export type CouponRejectionReason =
  | 'promotions_disabled'
  | 'invalid_code'
  | 'not_found'
  | 'inactive'
  | 'not_started'
  | 'expired'
  | 'max_redemptions_reached'
  | 'student_limit_reached'
  | 'audience_not_eligible'
  | 'scope_mismatch'
  | 'invalid_price'
  | 'invalid_discount';

export interface EvaluateCouponResult {
  valid: boolean;
  previewOnly: boolean;
  reason?: CouponRejectionReason;
  message: string;
  normalizedCode: string;
  promotionId?: string | null;
  currency: CommerceCurrency;
  baseAmount: number;
  baseAmountCents: number;
  discountAmount: number;
  discountAmountCents: number;
  finalAmount: number;
  finalAmountCents: number;
  snapshot?: AppliedPriceSnapshot;
}

export interface CommerceOverviewPayload {
  config: CommerceGlobalConfig;
  products: CommerceProduct[];
  prices: CommerceProductPrice[];
  promotions: CommercePromotion[];
  mode: 'backend_admin_sdk' | 'firestore_serverless';
}

// =========================================================================
// GUITAR ACADEMY — FASE 3: CAMPANHAS, TURMAS PAGAS, RESERVAS, PEDIDOS,
// PAGAMENTOS, ASSINATURAS E FINANCEIRO (MODO COMERCIAL PERMANECE DESLIGADO)
// =========================================================================

export type AdvertisementPosition =
  | 'home'
  | 'courses'
  | 'instruments'
  | 'promotions'
  | 'enrollments';

export type AdvertisementStatus = 'draft' | 'active' | 'paused' | 'archived';

export type AdvertisementImageMimeType = 'image/webp' | 'image/png' | 'image/jpeg';

export interface CommerceAdvertisement {
  advertisementId: string;
  title: string;
  subtitle?: string | null;
  description: string;
  ctaText: string;
  ctaDestination: string;
  productId?: string | null;
  targetAudience: CommerceEligibleAudience;
  eligibleStudentUids: string[];
  position: AdvertisementPosition;
  imageUrl?: string | null;
  storagePath?: string | null;
  imageMimeType?: AdvertisementImageMimeType | null;
  imageSizeBytes?: number | null;
  imageVersion: number;
  previousStoragePaths: string[];
  startsAt?: string | null;
  startsAtMs?: number | null;
  endsAt?: string | null;
  endsAtMs?: number | null;
  status: AdvertisementStatus;
  isHomologation?: boolean;
  createdBy: string;
  createdByEmail?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdvertisementInput {
  title: string;
  subtitle?: string | null;
  description: string;
  ctaText: string;
  ctaDestination: string;
  productId?: string | null;
  targetAudience?: CommerceEligibleAudience;
  eligibleStudentUids?: string[];
  position: AdvertisementPosition;
  startsAt?: string | null;
  endsAt?: string | null;
  status?: AdvertisementStatus;
}

export interface UpdateAdvertisementInput {
  title?: string;
  subtitle?: string | null;
  description?: string;
  ctaText?: string;
  ctaDestination?: string;
  productId?: string | null;
  targetAudience?: CommerceEligibleAudience;
  eligibleStudentUids?: string[];
  position?: AdvertisementPosition;
  startsAt?: string | null;
  endsAt?: string | null;
  status?: AdvertisementStatus;
}

export type ClassOfferStatus = 'draft' | 'scheduled' | 'open' | 'closed' | 'cancelled';

export interface CommerceClassOffer {
  offerId: string;
  classId: string;
  className?: string | null;
  productId: string;
  priceId: string;
  capacity: number;
  reservedSeats: number;
  confirmedSeats: number;
  registrationStartsAt?: string | null;
  registrationStartsAtMs?: number | null;
  registrationEndsAt?: string | null;
  registrationEndsAtMs?: number | null;
  status: ClassOfferStatus;
  waitlistEnabled: boolean;
  createdBy: string;
  createdByEmail?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassOfferInput {
  classId: string;
  productId: string;
  priceId: string;
  capacity: number;
  registrationStartsAt?: string | null;
  registrationEndsAt?: string | null;
  status?: ClassOfferStatus;
  waitlistEnabled?: boolean;
}

export interface UpdateClassOfferInput {
  priceId?: string;
  capacity?: number;
  registrationStartsAt?: string | null;
  registrationEndsAt?: string | null;
  status?: ClassOfferStatus;
  waitlistEnabled?: boolean;
}

export type ClassReservationStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'expired'
  | 'cancelled'
  | 'refunded';

export interface ClassReservation {
  reservationId: string;
  offerId: string;
  classId: string;
  studentUid: string;
  studentEmail?: string | null;
  orderId?: string | null;
  priceId: string;
  status: ClassReservationStatus;
  expiresAt: string;
  expiresAtMs: number;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  refundedAt?: string | null;
  waitlistEntryId?: string | null;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export type ClassWaitlistStatus =
  | 'waiting'
  | 'summoned'
  | 'converted'
  | 'expired'
  | 'cancelled';

export interface ClassWaitlistHistoryItem {
  status: ClassWaitlistStatus;
  at: string;
  reason: string;
  actorUid: string;
}

export interface ClassWaitlistEntry {
  waitlistId: string;
  offerId: string;
  classId: string;
  studentUid: string;
  studentEmail?: string | null;
  joinedAt: string;
  joinedAtMs: number;
  priorityOrder: number;
  status: ClassWaitlistStatus;
  summonedAt?: string | null;
  summonedAtMs?: number | null;
  responseDeadlineAt?: string | null;
  responseDeadlineAtMs?: number | null;
  convertedReservationId?: string | null;
  history: ClassWaitlistHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export interface OrderLineItem {
  productId: string;
  productName: string;
  productType: CommerceProductType;
  courseIds: OfficialCourseId[];
  priceId: string;
  priceVersion: number;
  billingInterval: CommerceBillingInterval;
  quantity: number;
  unitAmountCents: number;
  totalAmountCents: number;
  classOfferId?: string | null;
}

export interface OrderPromotionSnapshot {
  promotionId: string;
  code?: string | null;
  discountType: CommerceDiscountType;
  discountValue: number;
  discountAmountCents: number;
  evaluatedAt: string;
}

export interface CommerceOrder {
  orderId: string;
  studentUid: string;
  studentEmail?: string | null;
  items: OrderLineItem[];
  subtotal: number;
  subtotalCents: number;
  discount: number;
  discountCents: number;
  total: number;
  totalCents: number;
  currency: CommerceCurrency;
  status: OrderStatus;
  priceSnapshot: AppliedPriceSnapshot;
  promotionSnapshot: OrderPromotionSnapshot | null;
  createdAt: string;
  updatedAt: string;
  providerReference: string | null;
  providerName?: string | null;
  idempotencyKey: string;
  paidAt?: string | null;
  refundedAt?: string | null;
  refundedAmountCents: number;
  reservationId?: string | null;
  subscriptionId?: string | null;
  isHomologation?: boolean;
}

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export interface CommercePayment {
  paymentId: string;
  orderId: string;
  studentUid: string;
  provider: string;
  providerReference: string;
  method: string;
  amount: number;
  amountCents: number;
  currency: CommerceCurrency;
  status: PaymentStatus;
  idempotencyKey: string;
  paidAt?: string | null;
  refundedAmountCents: number;
  failureReason?: string | null;
  isHomologation?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PaymentEventProcessingStatus = 'processed' | 'ignored_duplicate' | 'rejected';

export interface CommercePaymentEvent {
  eventId: string;
  provider: string;
  providerEventId: string;
  eventType: string;
  orderId?: string | null;
  paymentId?: string | null;
  providerReference?: string | null;
  amountCents?: number | null;
  currency?: CommerceCurrency | null;
  signatureVerified: boolean;
  processingStatus: PaymentEventProcessingStatus;
  rejectionReason?: string | null;
  payloadDigest: string;
  processedAt: string;
  createdAt: string;
}

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'paused'
  | 'cancelled'
  | 'expired';

export interface SubscriptionBillingHistoryEntry {
  entryId: string;
  orderId?: string | null;
  paymentId?: string | null;
  amountCents: number;
  currency: CommerceCurrency;
  status: string;
  date: string;
  note?: string | null;
}

export interface CommerceSubscription {
  subscriptionId: string;
  studentUid: string;
  studentEmail?: string | null;
  productId: string;
  priceId: string;
  courseIds: OfficialCourseId[];
  billingInterval: CommerceBillingInterval;
  amountCents: number;
  currency: CommerceCurrency;
  status: SubscriptionStatus;
  startedAt: string;
  currentPeriodStartAt: string;
  currentPeriodEndAt: string;
  nextRenewalAt?: string | null;
  expiresAt?: string | null;
  expiresAtMs?: number | null;
  pausedAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  billingHistory: SubscriptionBillingHistoryEntry[];
  entitlementId: string;
  isHomologation?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommerceEntitlementRecord {
  entitlementId: string;
  studentUid: string;
  type: 'purchase' | 'subscription';
  sourceId: string;
  orderId?: string | null;
  productId: string;
  courseIds: OfficialCourseId[];
  status: 'active' | 'expired' | 'revoked' | 'cancelled';
  expiresAt?: string | null;
  expiresAtMs?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialAdjustmentRecord {
  adjustmentId: string;
  type: 'reconciliation_note' | 'manual_credit_note' | 'refund_adjustment' | 'chargeback_record';
  orderId?: string | null;
  amountCents: number;
  currency: CommerceCurrency;
  justification: string;
  actorUid: string;
  actorEmail?: string | null;
  createdAt: string;
}

export interface FinancialSummaryReport {
  currency: CommerceCurrency;
  hasRealTransactions: boolean;
  hasHomologationTransactions: boolean;
  totalSoldCount: number;
  grossRevenueCents: number;
  netRevenueCents: number;
  totalDiscountCents: number;
  pendingOrdersCount: number;
  approvedOrdersCount: number;
  refusedOrdersCount: number;
  refundsCount: number;
  refundedAmountCents: number;
  activeSubscriptionsCount: number;
  overdueOrExpiredSubscriptionsCount: number;
  salesByCourse: Array<{
    courseId: OfficialCourseId;
    courseTitle: string;
    ordersCount: number;
    grossCents: number;
    netCents: number;
  }>;
  salesByPeriod: Array<{
    periodKey: string;
    ordersCount: number;
    grossCents: number;
    netCents: number;
  }>;
  couponUsage: Array<{
    promotionId: string;
    code: string;
    usesCount: number;
    discountGrantedCents: number;
  }>;
  adjustmentsCount: number;
  netAdjustmentsCents: number;
}

export interface CommercePhase3OverviewPayload {
  advertisements: CommerceAdvertisement[];
  classOffers: CommerceClassOffer[];
  reservations: ClassReservation[];
  waitlist: ClassWaitlistEntry[];
  orders: CommerceOrder[];
  payments: CommercePayment[];
  paymentEvents: CommercePaymentEvent[];
  subscriptions: CommerceSubscription[];
  entitlements: CommerceEntitlementRecord[];
  adjustments: FinancialAdjustmentRecord[];
  availableClasses: Array<{
    id: string;
    name: string;
    courseId?: string;
    teacherName?: string;
    maxStudents?: number;
    enrolledCount?: number;
    active?: boolean;
  }>;
  mode: 'backend_admin_sdk' | 'firestore_serverless';
}

