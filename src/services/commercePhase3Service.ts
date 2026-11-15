// =========================================================================
// GUITAR ACADEMY — FASE 3: SERVIÇOS DE PUBLICIDADE, STORAGE, TURMAS PAGAS,
// RESERVAS, LISTA DE ESPERA, PEDIDOS, ASSINATURAS E FINANCEIRO (DUAL-MODE)
// src/services/commercePhase3Service.ts
// Opera prioritariamente via Express Backend (/api/admin/commerce/* e /api/commerce/*)
// com fallback Zero-Trust via Firestore Rules + Firebase Storage Rules quando
// hospedado estaticamente (ex: GitHub Pages, onde server.ts não está em execução).
// =========================================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from './firebase';
import { getProfessorApiBaseUrl } from './professorService';
import {
  logAdminSecurityEvent,
  handleFirestoreError,
  OperationType,
} from './adminLogsService';
import {
  applySubscriptionLifecycleTransition,
  computeFinancialSummaryReport,
  computeAvailableOfferSeats,
  DEFAULT_WAITLIST_SUMMON_TTL_MS,
  generatePhase3Id,
  isReservationExpired,
  isWaitlistSummonExpired,
  pickNextWaitlistCandidate,
  validateAdvertisementCreateInput,
  validateAdvertisementUpdateInput,
  validateBannerFileUpload,
  validateClassOfferCreateInput,
  validateClassOfferUpdateInput,
} from './commercePhase3Core';
import type {
  ClassReservation,
  ClassWaitlistEntry,
  CommerceAdvertisement,
  CommerceClassOffer,
  CommerceCurrency,
  CommerceEntitlementRecord,
  CommerceOrder,
  CommercePayment,
  CommercePaymentEvent,
  CommercePhase3OverviewPayload,
  CommerceSubscription,
  CreateAdvertisementInput,
  CreateClassOfferInput,
  FinancialAdjustmentRecord,
  FinancialSummaryReport,
  SubscriptionStatus,
  UpdateAdvertisementInput,
  UpdateClassOfferInput,
} from '../types/commerce';

async function tryPhase3Api<T>(
  path: string,
  options: RequestInit = {}
): Promise<
  { ok: true; data: T } | { ok: false; shouldFallback: boolean; status?: number; error?: string }
> {
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

    if (!isJson) {
      return { ok: false, shouldFallback: true, status: resp.status };
    }

    const payload = await resp.json().catch(() => ({}));

    if (
      resp.status === 503 &&
      (payload?.code === 'admin/credentials-unavailable' ||
        String(payload?.error || '').toLowerCase().includes('credenciais'))
    ) {
      return { ok: false, shouldFallback: true, status: 503, error: payload?.error };
    }

    if (!resp.ok) {
      return {
        ok: false,
        shouldFallback: false,
        status: resp.status,
        error: payload?.error || 'Falha na operação comercial.',
      };
    }

    return { ok: true, data: payload as T };
  } catch {
    return { ok: false, shouldFallback: true };
  }
}

async function assertCurrentUserIsVerifiedAdmin(): Promise<{ uid: string; email: string | null }> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Autenticação necessária para executar esta operação.');
  }
  try {
    const roleSnap = await getDoc(doc(db, 'system_roles', currentUser.uid));
    if (!roleSnap.exists() || roleSnap.data()?.role !== 'admin') {
      throw new Error('Acesso negado: privilégio administrativo obrigatório.');
    }
    return { uid: currentUser.uid, email: currentUser.email || null };
  } catch (err: any) {
    if (err?.message?.includes('privilégio')) throw err;
    throw new Error('Não foi possível verificar as permissões administrativas.');
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

/**
 * Carrega todos os dados operacionais da Fase 3 para o Portal Administrativo.
 */
export async function fetchPhase3OverviewAdmin(): Promise<CommercePhase3OverviewPayload> {
  const apiRes = await tryPhase3Api<CommercePhase3OverviewPayload & { status: string }>(
    '/api/admin/commerce/phase3/overview'
  );
  if (apiRes.ok) {
    return {
      advertisements: apiRes.data.advertisements || [],
      classOffers: apiRes.data.classOffers || [],
      reservations: apiRes.data.reservations || [],
      waitlist: apiRes.data.waitlist || [],
      orders: apiRes.data.orders || [],
      payments: apiRes.data.payments || [],
      paymentEvents: apiRes.data.paymentEvents || [],
      subscriptions: apiRes.data.subscriptions || [],
      entitlements: apiRes.data.entitlements || [],
      adjustments: apiRes.data.adjustments || [],
      availableClasses: apiRes.data.availableClasses || [],
      mode: 'backend_admin_sdk',
    };
  }
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Erro ao carregar módulo comercial (Fase 3).');
  }

  await assertCurrentUserIsVerifiedAdmin();

  try {
    const [
      adsSnap,
      offersSnap,
      resSnap,
      wlSnap,
      ordersSnap,
      paymentsSnap,
      eventsSnap,
      subsSnap,
      entSnap,
      adjSnap,
      classesSnap,
    ] = await Promise.all([
      getDocs(collection(db, 'advertisements')),
      getDocs(collection(db, 'class_offers')),
      getDocs(collection(db, 'class_reservations')),
      getDocs(collection(db, 'class_waitlist')),
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'payments')),
      getDocs(collection(db, 'payment_events')),
      getDocs(collection(db, 'subscriptions')),
      getDocs(collection(db, 'commerce_entitlements')),
      getDocs(collection(db, 'financial_adjustments')),
      getDocs(collection(db, 'classes')),
    ]);

    return {
      advertisements: adsSnap.docs.map(
        (d) => ({ advertisementId: d.id, ...(d.data() || {}) }) as CommerceAdvertisement
      ),
      classOffers: offersSnap.docs.map(
        (d) => ({ offerId: d.id, ...(d.data() || {}) }) as CommerceClassOffer
      ),
      reservations: resSnap.docs.map(
        (d) => ({ reservationId: d.id, ...(d.data() || {}) }) as ClassReservation
      ),
      waitlist: wlSnap.docs.map(
        (d) => ({ waitlistId: d.id, ...(d.data() || {}) }) as ClassWaitlistEntry
      ),
      orders: ordersSnap.docs.map(
        (d) => ({ orderId: d.id, ...(d.data() || {}) }) as CommerceOrder
      ),
      payments: paymentsSnap.docs.map(
        (d) => ({ paymentId: d.id, ...(d.data() || {}) }) as CommercePayment
      ),
      paymentEvents: eventsSnap.docs.map(
        (d) => ({ eventId: d.id, ...(d.data() || {}) }) as CommercePaymentEvent
      ),
      subscriptions: subsSnap.docs.map(
        (d) => ({ subscriptionId: d.id, ...(d.data() || {}) }) as CommerceSubscription
      ),
      entitlements: entSnap.docs.map(
        (d) => ({ entitlementId: d.id, ...(d.data() || {}) }) as CommerceEntitlementRecord
      ),
      adjustments: adjSnap.docs.map(
        (d) => ({ adjustmentId: d.id, ...(d.data() || {}) }) as FinancialAdjustmentRecord
      ),
      availableClasses: classesSnap.docs.map((d) => {
        const data = d.data() || {};
        return {
          id: d.id,
          name: String(data.name || 'Turma sem nome'),
          courseId: data.courseId,
          teacherName: data.teacherName,
          maxStudents: typeof data.maxStudents === 'number' ? data.maxStudents : undefined,
          enrolledCount: typeof data.enrolledCount === 'number' ? data.enrolledCount : undefined,
          active: data.active !== false,
        };
      }),
      mode: 'firestore_serverless',
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'advertisements/orders');
  }
}

/**
 * Cria campanha / anúncio administrativo.
 */
export async function createAdvertisementAdmin(
  input: CreateAdvertisementInput
): Promise<CommerceAdvertisement> {
  const apiRes = await tryPhase3Api<{ status: string; advertisement: CommerceAdvertisement }>(
    '/api/admin/commerce/advertisements',
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );
  if (apiRes.ok) return apiRes.data.advertisement;
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível criar a campanha.');
  }

  const adminUser = await assertCurrentUserIsVerifiedAdmin();
  const validation = validateAdvertisementCreateInput(input);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const nowIso = new Date().toISOString();
  const advertisementId = generatePhase3Id('ad');
  const ad: CommerceAdvertisement = {
    advertisementId,
    title: validation.data.title,
    subtitle: validation.data.subtitle,
    description: validation.data.description,
    ctaText: validation.data.ctaText,
    ctaDestination: validation.data.ctaDestination,
    productId: validation.data.productId,
    targetAudience: validation.data.targetAudience,
    eligibleStudentUids: validation.data.eligibleStudentUids,
    position: validation.data.position,
    imageUrl: null,
    storagePath: null,
    imageMimeType: null,
    imageSizeBytes: null,
    imageVersion: 0,
    previousStoragePaths: [],
    startsAt: validation.data.startsAt,
    startsAtMs: validation.data.startsAtMs,
    endsAt: validation.data.endsAt,
    endsAtMs: validation.data.endsAtMs,
    status: validation.data.status,
    createdBy: adminUser.uid,
    createdByEmail: adminUser.email,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  try {
    await setDoc(doc(db, 'advertisements', advertisementId), ad);
    await logAdminSecurityEvent({
      eventType: 'commerce_advertisement_created',
      severity: 'info',
      actorUid: adminUser.uid,
      actorEmail: adminUser.email,
      actorRole: 'admin',
      action: `Campanha publicitária criada: ${ad.title}`,
      details: `advertisementId=${advertisementId}, position=${ad.position}`,
      source: 'admin_portal',
    });
    return ad;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `advertisements/${advertisementId}`);
  }
}

/**
 * Atualiza campanha publicitária existente (ativar, pausar, arquivar, textos, datas).
 */
export async function updateAdvertisementAdmin(
  advertisementId: string,
  updates: UpdateAdvertisementInput
): Promise<CommerceAdvertisement> {
  const apiRes = await tryPhase3Api<{ status: string; advertisement: CommerceAdvertisement }>(
    `/api/admin/commerce/advertisements/${encodeURIComponent(advertisementId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }
  );
  if (apiRes.ok) return apiRes.data.advertisement;
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível atualizar a campanha.');
  }

  const adminUser = await assertCurrentUserIsVerifiedAdmin();
  try {
    const ref = doc(db, 'advertisements', advertisementId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new Error('Campanha não encontrada.');
    }
    const existing = {
      advertisementId: snap.id,
      ...(snap.data() || {}),
    } as CommerceAdvertisement;
    const validated = validateAdvertisementUpdateInput(existing, updates);
    if (!validated.valid) {
      throw new Error(validated.error);
    }
    const updated: CommerceAdvertisement = {
      ...validated.nextAdvertisement,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(ref, updated);
    await logAdminSecurityEvent({
      eventType: 'commerce_advertisement_updated',
      severity: 'info',
      actorUid: adminUser.uid,
      actorEmail: adminUser.email,
      actorRole: 'admin',
      action: `Campanha atualizada (${updated.title}) para "${updated.status}"`,
      details: `advertisementId=${advertisementId}`,
      source: 'admin_portal',
    });
    return updated;
  } catch (error: any) {
    if (error?.message && !String(error.message).includes('Missing or insufficient permissions')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.UPDATE, `advertisements/${advertisementId}`);
  }
}

/**
 * Realiza upload validado do banner para o Firebase Storage, preservando versões anteriores.
 */
export async function uploadAdvertisementBannerAdmin(
  advertisementId: string,
  file: File
): Promise<CommerceAdvertisement> {
  const headerSlice = await file.slice(0, 16).arrayBuffer();
  const magicBytes = new Uint8Array(headerSlice);

  // Validação prévia no cliente (MIME + extensão + assinatura binária + limite 5 MB)
  const preCheck = validateBannerFileUpload({
    advertisementId,
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    bytes: magicBytes,
    nextVersion: 1,
  });
  if (!preCheck.valid) {
    throw new Error(preCheck.error);
  }

  const fullBuffer = await file.arrayBuffer();
  const base64Payload = arrayBufferToBase64(fullBuffer);

  const apiRes = await tryPhase3Api<{ status: string; advertisement: CommerceAdvertisement }>(
    `/api/admin/commerce/advertisements/${encodeURIComponent(advertisementId)}/upload`,
    {
      method: 'POST',
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        fileDataBase64: base64Payload,
      }),
    }
  );
  if (apiRes.ok) return apiRes.data.advertisement;
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível enviar a imagem da campanha.');
  }

  // Fallback estático direto para Firebase Storage + Firestore (protegido por storage.rules e firestore.rules)
  const adminUser = await assertCurrentUserIsVerifiedAdmin();
  try {
    const adRef = doc(db, 'advertisements', advertisementId);
    const snap = await getDoc(adRef);
    if (!snap.exists()) {
      throw new Error('Campanha não encontrada.');
    }
    const existing = {
      advertisementId: snap.id,
      ...(snap.data() || {}),
    } as CommerceAdvertisement;
    const nextVersion = (existing.imageVersion || 0) + 1;

    const uploadValidation = validateBannerFileUpload({
      advertisementId,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      bytes: magicBytes,
      nextVersion,
    });
    if (!uploadValidation.valid) {
      throw new Error(uploadValidation.error);
    }

    const { storagePath: validatedStoragePath, mimeType: validatedMimeType } =
      uploadValidation.data;
    const canonicalFileName = validatedStoragePath.split('/').pop() || 'banner.webp';

    const fileStorageRef = storageRef(storage, validatedStoragePath);
    await uploadBytes(fileStorageRef, new Uint8Array(fullBuffer), {
      contentType: validatedMimeType,
      customMetadata: {
        advertisementId,
        uploadedBy: adminUser.uid,
        version: String(nextVersion),
      },
    });
    const downloadUrl = await getDownloadURL(fileStorageRef);

    const previousPaths = Array.isArray(existing.previousStoragePaths)
      ? [...existing.previousStoragePaths]
      : [];
    if (existing.storagePath && !previousPaths.includes(existing.storagePath)) {
      previousPaths.push(existing.storagePath);
    }

    const updated: CommerceAdvertisement = {
      ...existing,
      imageUrl: downloadUrl,
      storagePath: validatedStoragePath,
      imageMimeType: validatedMimeType,
      imageSizeBytes: file.size,
      imageVersion: nextVersion,
      previousStoragePaths: previousPaths,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(adRef, updated);
    await logAdminSecurityEvent({
      eventType: 'commerce_advertisement_image_uploaded',
      severity: 'info',
      actorUid: adminUser.uid,
      actorEmail: adminUser.email,
      actorRole: 'admin',
      action: `Banner v${nextVersion} enviado para Storage (${canonicalFileName})`,
      details: `advertisementId=${advertisementId}, path=${validatedStoragePath}`,
      source: 'admin_portal',
    });
    return updated;
  } catch (error: any) {
    if (error?.message && !String(error.message).includes('Missing or insufficient permissions')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.UPDATE, `advertisements/${advertisementId}`);
  }
}

/**
 * Cria oferta comercial de turma vinculada a uma turma existente (sem duplicar classes).
 */
export async function createClassOfferAdmin(
  input: CreateClassOfferInput
): Promise<CommerceClassOffer> {
  const apiRes = await tryPhase3Api<{ status: string; offer: CommerceClassOffer }>(
    '/api/admin/commerce/class-offers',
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );
  if (apiRes.ok) return apiRes.data.offer;
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível criar a oferta de turma.');
  }

  const adminUser = await assertCurrentUserIsVerifiedAdmin();
  const validation = validateClassOfferCreateInput(input);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    const classSnap = await getDoc(doc(db, 'classes', validation.data.classId));
    if (!classSnap.exists()) {
      throw new Error('Turma acadêmica não encontrada.');
    }
    const nowIso = new Date().toISOString();
    const offerId = generatePhase3Id('offer');
    const offer: CommerceClassOffer = {
      offerId,
      classId: validation.data.classId,
      className: String(classSnap.data()?.name || 'Turma Guitar Academy'),
      productId: validation.data.productId,
      priceId: validation.data.priceId,
      capacity: validation.data.capacity,
      reservedSeats: 0,
      confirmedSeats: 0,
      registrationStartsAt: validation.data.registrationStartsAt,
      registrationStartsAtMs: validation.data.registrationStartsAtMs,
      registrationEndsAt: validation.data.registrationEndsAt,
      registrationEndsAtMs: validation.data.registrationEndsAtMs,
      status: validation.data.status,
      waitlistEnabled: validation.data.waitlistEnabled,
      createdBy: adminUser.uid,
      createdByEmail: adminUser.email,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await setDoc(doc(db, 'class_offers', offerId), offer);
    await logAdminSecurityEvent({
      eventType: 'commerce_class_offer_created',
      severity: 'info',
      actorUid: adminUser.uid,
      actorEmail: adminUser.email,
      actorRole: 'admin',
      action: `Oferta comercial criada para turma "${offer.className}"`,
      details: `offerId=${offerId}, classId=${offer.classId}`,
      source: 'admin_portal',
    });
    return offer;
  } catch (error: any) {
    if (error?.message && !String(error.message).includes('Missing or insufficient permissions')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.CREATE, 'class_offers');
  }
}

/**
 * Atualiza oferta comercial de turma existente.
 */
export async function updateClassOfferAdmin(
  offerId: string,
  updates: UpdateClassOfferInput
): Promise<CommerceClassOffer> {
  const apiRes = await tryPhase3Api<{ status: string; offer: CommerceClassOffer }>(
    `/api/admin/commerce/class-offers/${encodeURIComponent(offerId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }
  );
  if (apiRes.ok) return apiRes.data.offer;
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível atualizar a oferta de turma.');
  }

  const adminUser = await assertCurrentUserIsVerifiedAdmin();
  try {
    const ref = doc(db, 'class_offers', offerId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new Error('Oferta de turma não encontrada.');
    }
    const existing = { offerId: snap.id, ...(snap.data() || {}) } as CommerceClassOffer;
    const validated = validateClassOfferUpdateInput(existing, updates);
    if (!validated.valid) {
      throw new Error(validated.error);
    }
    const updated: CommerceClassOffer = {
      ...validated.nextOffer,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(ref, updated);
    await logAdminSecurityEvent({
      eventType: 'commerce_class_offer_updated',
      severity: 'info',
      actorUid: adminUser.uid,
      actorEmail: adminUser.email,
      actorRole: 'admin',
      action: `Oferta de turma ${offerId} atualizada`,
      details: `status=${updated.status}, waitlist=${updated.waitlistEnabled}`,
      source: 'admin_portal',
    });
    return updated;
  } catch (error: any) {
    if (error?.message && !String(error.message).includes('Missing or insufficient permissions')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.UPDATE, `class_offers/${offerId}`);
  }
}

/**
 * Reconcilia e expira reservas pendentes cujo TTL expirou.
 */
export async function expireClassOfferReservationsAdmin(
  offerId: string
): Promise<{ expiredCount: number; offer: CommerceClassOffer }> {
  const apiRes = await tryPhase3Api<{
    status: string;
    expiredCount: number;
    offer: CommerceClassOffer;
  }>(`/api/admin/commerce/class-offers/${encodeURIComponent(offerId)}/expire-reservations`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  if (apiRes.ok) {
    return { expiredCount: apiRes.data.expiredCount, offer: apiRes.data.offer };
  }
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível reconciliar reservas expiradas.');
  }
  throw new Error('Expiração transacional de reservas exige conexão ativa com o servidor backend.');
}

/**
 * Convoca próximo candidato na fila de espera de uma oferta de turma.
 */
export async function summonNextWaitlistCandidateAdmin(
  offerId: string
): Promise<{ summoned: ClassWaitlistEntry; expiredSummons: number }> {
  const apiRes = await tryPhase3Api<{
    status: string;
    summoned: ClassWaitlistEntry;
    expiredSummons: number;
  }>(`/api/admin/commerce/class-offers/${encodeURIComponent(offerId)}/summon-waitlist`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  if (apiRes.ok) {
    return { summoned: apiRes.data.summoned, expiredSummons: apiRes.data.expiredSummons };
  }
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível convocar candidato da lista de espera.');
  }
  throw new Error('Convocação transacional da lista de espera exige conexão ativa com o servidor backend.');
}

/**
 * Transiciona status de assinatura (pausar, reativar, cancelar, expirar).
 */
export async function transitionSubscriptionAdmin(
  subscriptionId: string,
  status: SubscriptionStatus,
  reason?: string
): Promise<CommerceSubscription> {
  const apiRes = await tryPhase3Api<{ status: string; subscription: CommerceSubscription }>(
    `/api/admin/commerce/subscriptions/${encodeURIComponent(subscriptionId)}/transition`,
    {
      method: 'POST',
      body: JSON.stringify({ status, reason }),
    }
  );
  if (apiRes.ok) return apiRes.data.subscription;
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível atualizar a assinatura.');
  }
  throw new Error('Alteração transacional de ciclo de assinatura exige conexão ativa com o servidor backend.');
}

/**
 * Gera resumo financeiro consolidado a partir dos registros reais do Firestore.
 */
export async function fetchFinancialSummaryAdmin(options?: {
  currency?: CommerceCurrency;
  startDate?: string;
  endDate?: string;
  includeHomologation?: boolean;
}): Promise<FinancialSummaryReport> {
  const params = new URLSearchParams();
  if (options?.currency) params.set('currency', options.currency);
  if (options?.startDate) params.set('startDate', options.startDate);
  if (options?.endDate) params.set('endDate', options.endDate);
  if (options?.includeHomologation) params.set('includeHomologation', 'true');

  const apiRes = await tryPhase3Api<{ status: string; report: FinancialSummaryReport }>(
    `/api/admin/commerce/financial?${params.toString()}`
  );
  if (apiRes.ok) return apiRes.data.report;
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível carregar os indicadores financeiros.');
  }

  await assertCurrentUserIsVerifiedAdmin();
  try {
    const [ordersSnap, paymentsSnap, subsSnap, adjSnap] = await Promise.all([
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'payments')),
      getDocs(collection(db, 'subscriptions')),
      getDocs(collection(db, 'financial_adjustments')),
    ]);

    return computeFinancialSummaryReport({
      orders: ordersSnap.docs.map((d) => ({ orderId: d.id, ...(d.data() || {}) }) as CommerceOrder),
      payments: paymentsSnap.docs.map(
        (d) => ({ paymentId: d.id, ...(d.data() || {}) }) as CommercePayment
      ),
      subscriptions: subsSnap.docs.map(
        (d) => ({ subscriptionId: d.id, ...(d.data() || {}) }) as CommerceSubscription
      ),
      adjustments: adjSnap.docs.map(
        (d) => ({ adjustmentId: d.id, ...(d.data() || {}) }) as FinancialAdjustmentRecord
      ),
      currency: options?.currency || 'BRL',
      startDateIso: options?.startDate,
      endDateIso: options?.endDate,
      includeHomologation: options?.includeHomologation,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'orders/payments/financial_adjustments');
  }
}

/**
 * Registra ajuste financeiro imutável com justificativa obrigatória.
 */
export async function createFinancialAdjustmentAdmin(input: {
  type: FinancialAdjustmentRecord['type'];
  orderId?: string | null;
  amountCents: number;
  currency: CommerceCurrency;
  justification: string;
}): Promise<FinancialAdjustmentRecord> {
  const apiRes = await tryPhase3Api<{ status: string; adjustment: FinancialAdjustmentRecord }>(
    '/api/admin/commerce/financial/adjustments',
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );
  if (apiRes.ok) return apiRes.data.adjustment;
  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível registrar o ajuste financeiro.');
  }

  const adminUser = await assertCurrentUserIsVerifiedAdmin();
  const justification = String(input.justification || '').trim();
  if (justification.length < 10) {
    throw new Error('Justificativa obrigatória com no mínimo 10 caracteres.');
  }

  const adjustmentId = generatePhase3Id('adj');
  const record: FinancialAdjustmentRecord = {
    adjustmentId,
    type: input.type,
    orderId: input.orderId || null,
    amountCents: Math.round(input.amountCents),
    currency: input.currency,
    justification,
    actorUid: adminUser.uid,
    actorEmail: adminUser.email,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'financial_adjustments', adjustmentId), record);
    await logAdminSecurityEvent({
      eventType: 'commerce_financial_adjustment',
      severity: 'warning',
      actorUid: adminUser.uid,
      actorEmail: adminUser.email,
      actorRole: 'admin',
      action: `Ajuste financeiro registrado (${record.type}: ${record.amountCents} ${record.currency})`,
      details: `adjustmentId=${adjustmentId} | ${justification.slice(0, 180)}`,
      source: 'admin_portal',
    });
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `financial_adjustments/${adjustmentId}`);
  }
}

// Re-export helpers para UI
export {
  computeAvailableOfferSeats,
  applySubscriptionLifecycleTransition,
  DEFAULT_WAITLIST_SUMMON_TTL_MS,
  isReservationExpired,
  isWaitlistSummonExpired,
  pickNextWaitlistCandidate,
};
