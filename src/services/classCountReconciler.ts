/**
 * Guitar Academy — Authoritative Class Enrolled Count Reconciler (FASE FINAL)
 *
 * Serviço idempotente e transacional para auditoria e reconciliação segura de:
 *  - `classes/{classId}.enrolledCount` a partir da subcoleção real `classes/{classId}/students`
 *  - backfill seguro de `expiresAtMs` quando `expiresAt` textual existir sem `expiresAtMs`
 *    (preservando convites legados sem expiração)
 *
 * Garantias invariantes:
 *  1. Nunca cria, exclui ou altera documentos de alunos (`classes/{classId}/students/*`, `enrollments/*`, `users/*`).
 *  2. Nunca altera UIDs, `system_roles`, permissões administrativas ou limites (`maxStudents`).
 *  3. Nunca sobrescreve contagens já consistentes (execução repetida gera 0 escritas).
 *  4. Distingue estritamente status que ocupam vaga (`active`, `pending`, `approved`, legado sem status)
 *     de status que não ocupam vaga (`cancelled`, `suspended`, `inactive`).
 */

import { FieldValue } from 'firebase-admin/firestore';

export type CanonicalStudentOccupancyStatus =
  | 'active'
  | 'pending'
  | 'approved'
  | 'cancelled'
  | 'suspended'
  | 'inactive'
  | 'legacy_active';

export const OCCUPYING_ENROLLMENT_STATUSES = new Set([
  'active',
  'pending',
  'approved',
  'legacy_active',
]);

export const NON_OCCUPYING_ENROLLMENT_STATUSES = new Set([
  'cancelled',
  'suspended',
  'inactive',
]);

const VALID_ID_REGEX = /^[a-zA-Z0-9_\-.:]{1,128}$/;

export function classifyClassStudentStatus(rawStatus: unknown): CanonicalStudentOccupancyStatus {
  if (rawStatus === undefined || rawStatus === null) return 'legacy_active';
  if (typeof rawStatus !== 'string') return 'legacy_active';
  const normalized = rawStatus.trim().toLowerCase();
  if (!normalized) return 'legacy_active';
  if (normalized === 'active') return 'active';
  if (normalized === 'pending') return 'pending';
  if (normalized === 'approved') return 'approved';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'cancelled';
  if (normalized === 'suspended') return 'suspended';
  if (normalized === 'inactive') return 'inactive';
  return 'inactive';
}

export function doesStatusOccupySeat(rawStatus: unknown): boolean {
  const classified = classifyClassStudentStatus(rawStatus);
  return OCCUPYING_ENROLLMENT_STATUSES.has(classified);
}

export function isValidatedEnrolledCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export interface StudentDocLike {
  id: string;
  data?: Record<string, any> | (() => Record<string, any> | undefined);
}

export interface ClassOccupancyReport {
  activeCount: number;
  activeStudentIds: string[];
  totalDocsScanned: number;
  countsByStatus: Record<CanonicalStudentOccupancyStatus, number>;
}

/**
 * Calcula a ocupação real da turma exclusivamente a partir dos documentos da subcoleção
 * `classes/{classId}/students`, deduplicando por `studentId || doc.id`.
 */
export function computeAuthoritativeClassOccupancy(
  studentDocs: ReadonlyArray<StudentDocLike>
): ClassOccupancyReport {
  if (!Array.isArray(studentDocs)) {
    throw new Error('Snapshot de classes/{classId}/students inválido: lista de documentos ausente.');
  }

  const countsByStatus: Record<CanonicalStudentOccupancyStatus, number> = {
    active: 0,
    pending: 0,
    approved: 0,
    cancelled: 0,
    suspended: 0,
    inactive: 0,
    legacy_active: 0,
  };

  // Deduplica por studentId real mantendo prioridade para o documento canônico (doc.id === studentId)
  const resolvedByStudent = new Map<
    string,
    { status: CanonicalStudentOccupancyStatus; occupies: boolean; canonicalDoc: boolean }
  >();

  for (const docItem of studentDocs) {
    if (!docItem || typeof docItem.id !== 'string' || !docItem.id.trim()) continue;
    const rawData =
      typeof docItem.data === 'function' ? docItem.data() || {} : docItem.data || {};
    const studentId =
      typeof rawData.studentId === 'string' && rawData.studentId.trim()
        ? rawData.studentId.trim()
        : docItem.id.trim();

    const classified = classifyClassStudentStatus(rawData.status);
    const occupies = OCCUPYING_ENROLLMENT_STATUSES.has(classified);
    const canonicalDoc = docItem.id.trim() === studentId;

    const existing = resolvedByStudent.get(studentId);
    if (!existing) {
      resolvedByStudent.set(studentId, {
        status: classified,
        occupies,
        canonicalDoc,
      });
    } else if (canonicalDoc && !existing.canonicalDoc) {
      resolvedByStudent.set(studentId, {
        status: classified,
        occupies,
        canonicalDoc,
      });
    } else if (canonicalDoc === existing.canonicalDoc && !existing.occupies && occupies) {
      resolvedByStudent.set(studentId, {
        status: classified,
        occupies,
        canonicalDoc,
      });
    }
  }

  const activeStudentIds: string[] = [];
  for (const [studentId, entry] of resolvedByStudent.entries()) {
    countsByStatus[entry.status] += 1;
    if (entry.occupies) {
      activeStudentIds.push(studentId);
    }
  }

  return {
    activeCount: activeStudentIds.length,
    activeStudentIds,
    totalDocsScanned: studentDocs.length,
    countsByStatus,
  };
}

export function resolveExpiresAtMsPatch(data: Record<string, any> | null | undefined): {
  needsUpdate: boolean;
  expiresAtMs?: number;
} {
  if (!data) return { needsUpdate: false };
  if (typeof data.expiresAtMs === 'number' && Number.isFinite(data.expiresAtMs)) {
    return { needsUpdate: false };
  }
  if (typeof data.expiresAt === 'string' && data.expiresAt.trim()) {
    const parsed = Date.parse(data.expiresAt.trim());
    if (Number.isFinite(parsed)) {
      return { needsUpdate: true, expiresAtMs: Math.round(parsed) };
    }
  }
  return { needsUpdate: false };
}

export type ClassReconcileAction =
  | 'updated'
  | 'dry_run_would_update'
  | 'unchanged'
  | 'skipped_missing'
  | 'error';

export interface ClassReconcileDetail {
  classId: string;
  className?: string;
  code?: string;
  beforeEnrolledCount: unknown;
  calculatedActiveCount: number;
  maxStudents: number | null;
  countsByStatus?: Record<CanonicalStudentOccupancyStatus, number>;
  classExpiresAtMsBackfilled: boolean;
  inviteExpiresAtMsBackfilled: boolean;
  writesPerformed: number;
  action: ClassReconcileAction;
  reason?: string;
  error?: string;
}

export interface ReconcileAuditReport {
  dryRun: boolean;
  executedAt: string;
  totalClasses: number;
  migratedCount: number;
  dryRunPendingCount: number;
  unchangedCount: number;
  skippedCount: number;
  errorCount: number;
  totalWrites: number;
  details: ClassReconcileDetail[];
}

export interface ReconcileOptions {
  dryRun?: boolean;
  classIds?: string[];
  updatedAtValue?: unknown;
}

/**
 * Reconcilia uma única turma dentro de `adminDb.runTransaction`, garantindo:
 *  - Todas as leituras antes de qualquer escrita;
 *  - Zero mutação se `enrolledCount` e `expiresAtMs` já estiverem consistentes (idempotência estrita);
 *  - Segurança contra matrículas simultâneas via transação serializável;
 *  - Nenhuma alteração em documentos de alunos ou `system_roles`.
 */
export async function reconcileSingleClassTransactionally(
  adminDb: any,
  classId: string,
  options: ReconcileOptions = {}
): Promise<ClassReconcileDetail> {
  const dryRun = options.dryRun === true;
  const cleanClassId = String(classId || '').trim();
  if (!cleanClassId || !VALID_ID_REGEX.test(cleanClassId)) {
    return {
      classId: cleanClassId,
      beforeEnrolledCount: undefined,
      calculatedActiveCount: 0,
      maxStudents: null,
      classExpiresAtMsBackfilled: false,
      inviteExpiresAtMsBackfilled: false,
      writesPerformed: 0,
      action: 'error',
      error: 'Identificador de turma inválido.',
    };
  }

  return await adminDb.runTransaction(async (tx: any) => {
    // FASE 1: Todas as leituras antes de qualquer escrita
    const classRef = adminDb.collection('classes').doc(cleanClassId);
    const classSnap = await tx.get(classRef);

    if (!classSnap?.exists) {
      return {
        classId: cleanClassId,
        beforeEnrolledCount: undefined,
        calculatedActiveCount: 0,
        maxStudents: null,
        classExpiresAtMsBackfilled: false,
        inviteExpiresAtMsBackfilled: false,
        writesPerformed: 0,
        action: 'skipped_missing',
        reason: 'Documento de turma não encontrado.',
      } satisfies ClassReconcileDetail;
    }

    const classData: Record<string, any> = classSnap.data() || {};
    const studentsSnap = await tx.get(classRef.collection('students'));
    if (!studentsSnap || !Array.isArray(studentsSnap.docs)) {
      throw new Error(`Leitura inválida de classes/${cleanClassId}/students na transação.`);
    }

    const occupancy = computeAuthoritativeClassOccupancy(studentsSnap.docs);
    const rawCode = typeof classData.code === 'string' ? classData.code.trim().toUpperCase() : '';
    const inviteRef =
      rawCode && VALID_ID_REGEX.test(rawCode)
        ? adminDb.collection('class_invites').doc(rawCode)
        : null;
    const inviteSnap = inviteRef ? await tx.get(inviteRef) : null;
    const inviteData: Record<string, any> | null = inviteSnap?.exists ? inviteSnap.data() || {} : null;

    // FASE 2: Verificação estrita de necessidade de alteração
    const beforeCount = classData.enrolledCount;
    const countMatches =
      isValidatedEnrolledCount(beforeCount) && beforeCount === occupancy.activeCount;
    const classExpiresPatch = resolveExpiresAtMsPatch(classData);
    const inviteOwnedByClass = Boolean(inviteData && inviteData.classId === cleanClassId);
    const inviteExpiresPatch = inviteOwnedByClass
      ? resolveExpiresAtMsPatch(inviteData)
      : { needsUpdate: false };

    const needsClassUpdate = !countMatches || classExpiresPatch.needsUpdate;
    const needsInviteUpdate = Boolean(inviteRef && inviteOwnedByClass && inviteExpiresPatch.needsUpdate);

    if (!needsClassUpdate && !needsInviteUpdate) {
      return {
        classId: cleanClassId,
        className: typeof classData.name === 'string' ? classData.name : undefined,
        code: rawCode || undefined,
        beforeEnrolledCount: beforeCount,
        calculatedActiveCount: occupancy.activeCount,
        maxStudents:
          typeof classData.maxStudents === 'number' ? classData.maxStudents : null,
        countsByStatus: occupancy.countsByStatus,
        classExpiresAtMsBackfilled: false,
        inviteExpiresAtMsBackfilled: false,
        writesPerformed: 0,
        action: 'unchanged',
      } satisfies ClassReconcileDetail;
    }

    if (dryRun) {
      return {
        classId: cleanClassId,
        className: typeof classData.name === 'string' ? classData.name : undefined,
        code: rawCode || undefined,
        beforeEnrolledCount: beforeCount,
        calculatedActiveCount: occupancy.activeCount,
        maxStudents:
          typeof classData.maxStudents === 'number' ? classData.maxStudents : null,
        countsByStatus: occupancy.countsByStatus,
        classExpiresAtMsBackfilled: classExpiresPatch.needsUpdate,
        inviteExpiresAtMsBackfilled: needsInviteUpdate,
        writesPerformed: 0,
        action: 'dry_run_would_update',
      } satisfies ClassReconcileDetail;
    }

    // FASE 3: Escritas mínimas e autoritativas apenas nos campos necessários
    const timestampValue =
      options.updatedAtValue !== undefined
        ? options.updatedAtValue
        : FieldValue.serverTimestamp();
    let writesPerformed = 0;

    if (needsClassUpdate) {
      const classPatch: Record<string, any> = {
        updatedAt: timestampValue,
      };
      if (!countMatches) {
        classPatch.enrolledCount = occupancy.activeCount;
      }
      if (classExpiresPatch.needsUpdate && classExpiresPatch.expiresAtMs !== undefined) {
        classPatch.expiresAtMs = classExpiresPatch.expiresAtMs;
      }
      tx.update(classRef, classPatch);
      writesPerformed += 1;
    }

    if (needsInviteUpdate && inviteRef && inviteExpiresPatch.expiresAtMs !== undefined) {
      tx.update(inviteRef, {
        expiresAtMs: inviteExpiresPatch.expiresAtMs,
        updatedAt: timestampValue,
      });
      writesPerformed += 1;
    }

    return {
      classId: cleanClassId,
      className: typeof classData.name === 'string' ? classData.name : undefined,
      code: rawCode || undefined,
      beforeEnrolledCount: beforeCount,
      calculatedActiveCount: occupancy.activeCount,
      maxStudents:
        typeof classData.maxStudents === 'number' ? classData.maxStudents : null,
      countsByStatus: occupancy.countsByStatus,
      classExpiresAtMsBackfilled: classExpiresPatch.needsUpdate,
      inviteExpiresAtMsBackfilled: needsInviteUpdate,
      writesPerformed,
      action: 'updated',
    } satisfies ClassReconcileDetail;
  });
}

/**
 * Audita e reconcilia todas as turmas existentes no Firestore (ou um subconjunto via `classIds`),
 * sem depender de o professor abrir o painel pedagógico.
 */
export async function reconcileAllLegacyClasses(
  adminDb: any,
  options: ReconcileOptions = {}
): Promise<ReconcileAuditReport> {
  const dryRun = options.dryRun === true;
  let targetClassIds: string[] = [];

  if (Array.isArray(options.classIds) && options.classIds.length > 0) {
    targetClassIds = Array.from(
      new Set(options.classIds.map((id) => String(id || '').trim()).filter(Boolean))
    );
  } else {
    const classesSnap = await adminDb.collection('classes').get();
    const docs = Array.isArray(classesSnap?.docs) ? classesSnap.docs : [];
    targetClassIds = docs.map((d: any) => String(d.id));
  }

  const details: ClassReconcileDetail[] = [];
  let migratedCount = 0;
  let dryRunPendingCount = 0;
  let unchangedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  let totalWrites = 0;

  for (const classId of targetClassIds) {
    try {
      const detail = await reconcileSingleClassTransactionally(adminDb, classId, {
        ...options,
        dryRun,
      });
      details.push(detail);
      totalWrites += detail.writesPerformed;
      if (detail.action === 'updated') migratedCount += 1;
      else if (detail.action === 'dry_run_would_update') dryRunPendingCount += 1;
      else if (detail.action === 'unchanged') unchangedCount += 1;
      else if (detail.action === 'skipped_missing') skippedCount += 1;
      else errorCount += 1;
    } catch (err: any) {
      errorCount += 1;
      details.push({
        classId,
        beforeEnrolledCount: undefined,
        calculatedActiveCount: 0,
        maxStudents: null,
        classExpiresAtMsBackfilled: false,
        inviteExpiresAtMsBackfilled: false,
        writesPerformed: 0,
        action: 'error',
        error: err?.message || 'Erro ao reconciliar turma.',
      });
    }
  }

  return {
    dryRun,
    executedAt: new Date().toISOString(),
    totalClasses: targetClassIds.length,
    migratedCount,
    dryRunPendingCount,
    unchangedCount,
    skippedCount,
    errorCount,
    totalWrites,
    details,
  };
}
