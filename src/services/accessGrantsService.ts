// =========================================================================
// GUITAR ACADEMY — SERVIÇO DUAL-MODE DE CONCESSÕES E DIRECIONAMENTO ACADÊMICO
// src/services/accessGrantsService.ts
// Opera via Express Backend (/api/admin/* e /api/me/access) com fallback
// automático Zero-Trust diretamente para Firestore Rules (isAdmin() / isOwner()).
// =========================================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { getProfessorApiBaseUrl } from './professorService';
import {
  logAdminSecurityEvent,
  handleFirestoreError,
  OperationType,
} from './adminLogsService';
import {
  computeDeterministicGrantDocId,
  computeGrantIdempotencyKey,
  computePlacementDocId,
  getCatalogCourse,
  isValidCourseId,
  mapGrantTypeToSource,
  validateGrantTarget,
  validatePlacementTarget,
} from './academicCatalog';
import {
  evaluateGrantStatus,
  resolveStudentAccessSnapshot,
} from './accessAuthorizationEngine';
import type { UserProgress } from '../types';
import type { StudentEnrolledClassInfo } from '../types/teacher';
import type { OfficialCourseId } from '../academia/progress/unlockGate';
import type {
  AccessGrantScopeType,
  AccessGrantType,
  CourseAccessGrant,
  StudentAcademicPlacement,
  StudentEffectiveAccessSnapshot,
} from '../types/accessControl';

export interface AdminStudentAccessOverview {
  studentUid: string;
  grants: CourseAccessGrant[];
  placements: StudentAcademicPlacement[];
  enrollments: StudentEnrolledClassInfo[];
  progressSummary: {
    completedLessonsCount: number;
    primaryCourseId: string | null;
    currentLessonId: string | null;
    totalStudyTimeSeconds: number;
  };
  snapshot: StudentEffectiveAccessSnapshot;
  mode: 'backend_admin_sdk' | 'firestore_serverless';
}

export interface CreateAccessGrantInput {
  studentUid: string;
  scopeType: AccessGrantScopeType;
  grantType: AccessGrantType;
  courseId?: OfficialCourseId | null;
  instrumentId?: string | null;
  moduleId?: string | null;
  lessonId?: string | null;
  rangeStartLessonId?: string | null;
  rangeEndLessonId?: string | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  reason?: string | null;
}

export interface UpdatePlacementInput {
  studentUid: string;
  mode: 'custom_start' | 'default_path';
  courseId?: OfficialCourseId | null;
  moduleId?: string | null;
  lessonId?: string | null;
  reason?: string | null;
}

async function tryApiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ ok: true; data: T } | { ok: false; shouldFallback: boolean; error?: string }> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { ok: false, shouldFallback: false, error: 'Sessão não autenticada.' };
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

    if (resp.status === 401 || resp.status === 403 || resp.status === 400) {
      const body = isJson ? ((await resp.json()) as { error?: string }) : {};
      return {
        ok: false,
        shouldFallback: false,
        error: body.error || `Operação recusada pelo servidor (HTTP ${resp.status}).`,
      };
    }

    if (resp.status === 404) {
      if (!isJson) {
        return { ok: false, shouldFallback: true };
      }
      const body = (await resp.json()) as { error?: string };
      return { ok: false, shouldFallback: false, error: body.error || 'Registro não encontrado.' };
    }

    if (resp.status === 503 || !resp.ok || !isJson) {
      return { ok: false, shouldFallback: true };
    }

    const data = (await resp.json()) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, shouldFallback: true };
  }
}

async function loadStudentAccessServerless(
  studentUid: string,
  localProgress?: UserProgress | null,
  localEnrollments?: StudentEnrolledClassInfo[]
): Promise<AdminStudentAccessOverview> {
  const grantsPath = 'course_access_grants';
  const placementsPath = 'student_academic_placements';

  let grants: CourseAccessGrant[] = [];
  let placements: StudentAcademicPlacement[] = [];
  let enrollments: StudentEnrolledClassInfo[] = localEnrollments || [];
  let progressData: UserProgress | null = localProgress ?? null;

  try {
    const grantsSnap = await getDocs(
      query(collection(db, grantsPath), where('studentUid', '==', studentUid))
    );
    grants = grantsSnap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Record<string, any>) }) as CourseAccessGrant)
      .sort((a, b) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || ''));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, grantsPath);
    grants = [];
  }

  try {
    const placementsSnap = await getDocs(
      query(collection(db, placementsPath), where('studentUid', '==', studentUid))
    );
    placements = placementsSnap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Record<string, any>) }) as StudentAcademicPlacement)
      .sort((a, b) => Date.parse(b.updatedAt || '') - Date.parse(a.updatedAt || ''));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, placementsPath);
  }

  // Enriquecimento opcional para painel administrativo
  if (!localEnrollments) {
    try {
      const enrollSnap = await getDocs(
        query(collection(db, 'enrollments'), where('studentId', '==', studentUid))
      );
      enrollments = enrollSnap.docs.map((d) => {
        const data = d.data() || {};
        return {
          enrollmentId: d.id,
          classId: data.classId || '',
          className: data.className || data.classId || 'Turma',
          teacherId: data.teacherId || '',
          teacherName: data.teacherName || '',
          courseId: data.courseId || undefined,
          instrument: data.instrument || '',
          joinedAt: data.joinedAt || data.createdAt || '',
          status: data.status || 'active',
        };
      });
    } catch {
      enrollments = [];
    }
  }

  if (!localProgress) {
    try {
      const progressSnap = await getDoc(doc(db, 'users', studentUid, 'data', 'progress'));
      if (progressSnap.exists()) {
        progressData = progressSnap.data() as UserProgress;
      }
    } catch {
      progressData = null;
    }
  }

  const snapshot = resolveStudentAccessSnapshot({
    studentUid,
    isAdminUser: false,
    progress: progressData,
    grants,
    enrollments,
    placements,
  });

  return {
    studentUid,
    grants,
    placements,
    enrollments,
    progressSummary: {
      completedLessonsCount: Array.isArray(progressData?.completedLessons)
        ? progressData!.completedLessons.length
        : 0,
      primaryCourseId: progressData?.primaryCourseId || null,
      currentLessonId: progressData?.currentLessonId || null,
      totalStudyTimeSeconds: Number(progressData?.totalStudyTimeSeconds || 0),
    },
    snapshot,
    mode: 'firestore_serverless',
  };
}

/**
 * Consulta o acesso próprio do aluno autenticado (/api/me/access com fallback Firestore)
 */
export async function fetchMyAccessContext(
  studentUid: string,
  progress: UserProgress | null,
  enrollments: StudentEnrolledClassInfo[] = []
): Promise<{
  grants: CourseAccessGrant[];
  placements: StudentAcademicPlacement[];
  snapshot: StudentEffectiveAccessSnapshot;
}> {
  if (!studentUid || !auth.currentUser) {
    return {
      grants: [],
      placements: [],
      snapshot: resolveStudentAccessSnapshot({
        studentUid: studentUid || 'guest',
        isAdminUser: false,
        progress,
        enrollments,
      }),
    };
  }

  const apiRes = await tryApiFetch<{
    status: string;
    grants: CourseAccessGrant[];
    placements: StudentAcademicPlacement[];
    snapshot?: StudentEffectiveAccessSnapshot;
  }>('/api/me/access', { method: 'GET' });

  if (apiRes.ok) {
    // Recomputa snapshot com progresso/matrículas locais caso haja estado ainda não sincronizado,
    // mantendo estritamente todas as concessões e direcionamentos vindos do servidor.
    const snapshot = resolveStudentAccessSnapshot({
      studentUid,
      isAdminUser: false,
      progress,
      grants: apiRes.data.grants || [],
      enrollments,
      placements: apiRes.data.placements || [],
    });
    return {
      grants: apiRes.data.grants || [],
      placements: apiRes.data.placements || [],
      snapshot,
    };
  }

  try {
    const serverlessRes = await loadStudentAccessServerless(studentUid, progress, enrollments);
    return {
      grants: serverlessRes.grants,
      placements: serverlessRes.placements,
      snapshot: serverlessRes.snapshot,
    };
  } catch {
    return {
      grants: [],
      placements: [],
      snapshot: resolveStudentAccessSnapshot({
        studentUid,
        isAdminUser: false,
        progress,
        enrollments,
      }),
    };
  }
}

/**
 * Consulta completa do acesso de um aluno específico pelo Administrador
 */
export async function fetchAdminStudentAccessOverview(
  studentUid: string
): Promise<AdminStudentAccessOverview> {
  const apiRes = await tryApiFetch<Omit<AdminStudentAccessOverview, 'mode'>>(
    `/api/admin/students/${encodeURIComponent(studentUid)}/access`,
    { method: 'GET' }
  );

  if (apiRes.ok) {
    return {
      ...apiRes.data,
      mode: 'backend_admin_sdk',
    };
  }

  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Acesso negado ao consultar permissões do aluno.');
  }

  return loadStudentAccessServerless(studentUid);
}

/**
 * Cria uma concessão administrativa gratuita para o aluno (com idempotência garantida)
 */
export async function createAdminAccessGrant(
  input: CreateAccessGrantInput
): Promise<{
  grant: CourseAccessGrant;
  idempotent: boolean;
  created: boolean;
  snapshot: StudentEffectiveAccessSnapshot;
  mode: 'backend_admin_sdk' | 'firestore_serverless';
}> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Administrador não autenticado.');
  }

  const validatedTarget = validateGrantTarget({
    scopeType: input.scopeType,
    courseId: input.courseId ?? null,
    instrumentId: input.instrumentId ?? null,
    moduleId: input.moduleId ?? null,
    lessonId: input.lessonId ?? null,
    rangeStartLessonId: input.rangeStartLessonId ?? null,
    rangeEndLessonId: input.rangeEndLessonId ?? null,
  });
  if (!validatedTarget.valid) {
    throw new Error(validatedTarget.error || 'Alvo curricular inválido.');
  }

  let startsAt: string | null = null;
  let startsAtMs: number | null = null;
  if (input.startsAt) {
    const ms = Date.parse(input.startsAt);
    if (Number.isNaN(ms)) throw new Error('Data de início inválida.');
    startsAt = new Date(ms).toISOString();
    startsAtMs = ms;
  }

  let expiresAt: string | null = null;
  let expiresAtMs: number | null = null;
  if (input.expiresAt) {
    const ms = Date.parse(input.expiresAt);
    if (Number.isNaN(ms)) throw new Error('Data de expiração inválida.');
    expiresAt = new Date(ms).toISOString();
    expiresAtMs = ms;
  }

  if (input.grantType === 'temporary' && expiresAtMs === null) {
    throw new Error('Liberações por período determinado exigem uma data de expiração.');
  }
  if (startsAtMs !== null && expiresAtMs !== null && expiresAtMs <= startsAtMs) {
    throw new Error('A data de expiração deve ser posterior à data de início.');
  }

  const apiRes = await tryApiFetch<{
    status: string;
    idempotent: boolean;
    created: boolean;
    grant: CourseAccessGrant;
    snapshot: StudentEffectiveAccessSnapshot;
  }>('/api/admin/access-grants', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      startsAt,
      expiresAt,
    }),
  });

  if (apiRes.ok) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('guitar-academy:access-updated', { detail: { studentUid: input.studentUid } })
      );
    }
    return {
      grant: apiRes.data.grant,
      idempotent: apiRes.data.idempotent,
      created: apiRes.data.created,
      snapshot: apiRes.data.snapshot,
      mode: 'backend_admin_sdk',
    };
  }

  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível criar a concessão.');
  }

  const reason = input.reason?.trim() ? input.reason.trim().slice(0, 500) : null;
  const idempotencyKey = computeGrantIdempotencyKey({
    studentUid: input.studentUid,
    scopeType: input.scopeType,
    grantType: input.grantType,
    courseId: validatedTarget.courseId,
    instrumentId: validatedTarget.instrumentId,
    moduleId: validatedTarget.moduleId,
    lessonId: validatedTarget.lessonId,
    rangeStartLessonId: validatedTarget.rangeStartLessonId,
    rangeEndLessonId: validatedTarget.rangeEndLessonId,
    startsAtMs,
    expiresAtMs,
  });
  const grantId = computeDeterministicGrantDocId(idempotencyKey);
  const source = mapGrantTypeToSource(input.grantType);
  const grantRef = doc(db, 'course_access_grants', grantId);

  let txOutcome: { created: boolean; idempotent: boolean; grant: CourseAccessGrant } | null = null;
  try {
    txOutcome = await runTransaction(db, async (tx) => {
      const existingSnap = await tx.get(grantRef);
      const nowMs = Date.now();
      const nowIso = new Date(nowMs).toISOString();

      if (existingSnap.exists()) {
        const existing = { id: grantId, ...(existingSnap.data() as Record<string, any>) } as CourseAccessGrant;
        const evalRes = evaluateGrantStatus(existing, nowMs);
        if (evalRes.active) {
          return { created: false, idempotent: true, grant: existing };
        }
        const reactivated: CourseAccessGrant = {
          ...existing,
          status: 'active',
          source,
          grantType: input.grantType,
          reason: reason ?? existing.reason ?? null,
          grantedBy: currentUser.uid,
          grantedByEmail: currentUser.email || null,
          revokedBy: null,
          revokedAt: null,
          statusReason: null,
          updatedAt: nowIso,
        };
        tx.set(grantRef, reactivated);
        return { created: true, idempotent: false, grant: reactivated };
      }

      const createdGrant: CourseAccessGrant = {
        id: grantId,
        studentUid: input.studentUid,
        scopeType: input.scopeType,
        grantType: input.grantType,
        source,
        status: 'active',
        courseId: validatedTarget.courseId ?? null,
        instrumentId: validatedTarget.instrumentId ?? null,
        moduleId: validatedTarget.moduleId ?? null,
        lessonId: validatedTarget.lessonId ?? null,
        rangeStartLessonId: validatedTarget.rangeStartLessonId ?? null,
        rangeEndLessonId: validatedTarget.rangeEndLessonId ?? null,
        lessonIds: validatedTarget.lessonIds ?? null,
        startsAt,
        startsAtMs,
        expiresAt,
        expiresAtMs,
        reason,
        idempotencyKey,
        grantedBy: currentUser.uid,
        grantedByEmail: currentUser.email || null,
        revokedBy: null,
        revokedAt: null,
        statusReason: null,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      tx.set(grantRef, createdGrant);
      return { created: true, idempotent: false, grant: createdGrant };
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `course_access_grants/${grantId}`);
  }

  if (txOutcome?.created) {
    await logAdminSecurityEvent({
      eventType: 'course_access_granted',
      severity: 'info',
      actorUid: currentUser.uid,
      actorEmail: currentUser.email,
      actorRole: 'admin',
      targetUid: input.studentUid,
      action: `Liberação acadêmica (${input.scopeType}/${input.grantType}) aplicada ao aluno`,
      details: `grantId=${grantId} course=${validatedTarget.courseId || validatedTarget.instrumentId || ''}`,
      source: 'admin_portal',
    });
  }

  const overview = await loadStudentAccessServerless(input.studentUid);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('guitar-academy:access-updated', { detail: { studentUid: input.studentUid } })
    );
  }

  return {
    grant: txOutcome!.grant,
    idempotent: txOutcome!.idempotent,
    created: txOutcome!.created,
    snapshot: overview.snapshot,
    mode: 'firestore_serverless',
  };
}

/**
 * Suspende, reativa ou revoga uma concessão existente
 */
export async function updateAdminAccessGrantStatus(params: {
  grantId: string;
  studentUid: string;
  status: 'active' | 'suspended' | 'revoked';
  reason?: string | null;
}): Promise<{
  grant: CourseAccessGrant;
  snapshot: StudentEffectiveAccessSnapshot;
  mode: 'backend_admin_sdk' | 'firestore_serverless';
}> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Administrador não autenticado.');
  }

  const apiRes = await tryApiFetch<{
    status: string;
    grant: CourseAccessGrant;
    snapshot: StudentEffectiveAccessSnapshot;
  }>(`/api/admin/access-grants/${encodeURIComponent(params.grantId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: params.status,
      reason: params.reason ?? null,
    }),
  });

  if (apiRes.ok) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('guitar-academy:access-updated', { detail: { studentUid: params.studentUid } })
      );
    }
    return {
      grant: apiRes.data.grant,
      snapshot: apiRes.data.snapshot,
      mode: 'backend_admin_sdk',
    };
  }

  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível alterar o status da concessão.');
  }

  const grantRef = doc(db, 'course_access_grants', params.grantId);
  const statusReason = params.reason?.trim() ? params.reason.trim().slice(0, 500) : null;
  let updatedGrant: CourseAccessGrant | null = null;

  try {
    updatedGrant = await runTransaction(db, async (tx) => {
      const snap = await tx.get(grantRef);
      if (!snap.exists()) {
        throw new Error('Concessão não encontrada.');
      }
      const existing = { id: params.grantId, ...(snap.data() as Record<string, any>) } as CourseAccessGrant;
      const nowIso = new Date().toISOString();
      const isRevoking = params.status === 'revoked' || params.status === 'suspended';

      const nextDoc: CourseAccessGrant = {
        ...existing,
        status: params.status,
        statusReason,
        revokedBy: isRevoking ? currentUser.uid : null,
        revokedAt: isRevoking ? nowIso : null,
        updatedAt: nowIso,
      };
      tx.set(grantRef, nextDoc);
      return nextDoc;
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `course_access_grants/${params.grantId}`);
  }

  await logAdminSecurityEvent({
    eventType: params.status === 'active' ? 'course_access_reactivated' : 'course_access_revoked',
    severity: params.status === 'revoked' ? 'warning' : 'info',
    actorUid: currentUser.uid,
    actorEmail: currentUser.email,
    actorRole: 'admin',
    targetUid: updatedGrant!.studentUid,
    action: `Concessão ${params.grantId} atualizada para "${params.status}"`,
    details: statusReason || undefined,
    source: 'admin_portal',
  });

  const overview = await loadStudentAccessServerless(updatedGrant!.studentUid);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('guitar-academy:access-updated', { detail: { studentUid: updatedGrant!.studentUid } })
    );
  }

  return {
    grant: updatedGrant!,
    snapshot: overview.snapshot,
    mode: 'firestore_serverless',
  };
}

/**
 * Configura ou remove o Direcionamento Inicial no currículo do aluno sem alterar progresso anterior
 */
export async function updateAdminStudentPlacement(
  input: UpdatePlacementInput
): Promise<{
  placements: StudentAcademicPlacement[];
  snapshot: StudentEffectiveAccessSnapshot;
  mode: 'backend_admin_sdk' | 'firestore_serverless';
}> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Administrador não autenticado.');
  }

  if (input.mode === 'custom_start') {
    const check = validatePlacementTarget({
      courseId: String(input.courseId || ''),
      moduleId: input.moduleId ?? null,
      lessonId: input.lessonId ?? null,
    });
    if (!check.valid) {
      throw new Error(check.error || 'Ponto inicial inválido.');
    }
  } else if (input.courseId && !isValidCourseId(input.courseId)) {
    throw new Error('Curso inválido ao remover direcionamento.');
  }

  const apiRes = await tryApiFetch<{
    status: string;
    placements: StudentAcademicPlacement[];
    snapshot: StudentEffectiveAccessSnapshot;
  }>(`/api/admin/students/${encodeURIComponent(input.studentUid)}/placement`, {
    method: 'PUT',
    body: JSON.stringify({
      mode: input.mode,
      courseId: input.courseId ?? null,
      moduleId: input.moduleId ?? null,
      lessonId: input.lessonId ?? null,
      reason: input.reason ?? null,
    }),
  });

  if (apiRes.ok) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('guitar-academy:access-updated', { detail: { studentUid: input.studentUid } })
      );
    }
    return {
      placements: apiRes.data.placements || [],
      snapshot: apiRes.data.snapshot,
      mode: 'backend_admin_sdk',
    };
  }

  if (!apiRes.shouldFallback) {
    throw new Error(apiRes.error || 'Não foi possível atualizar o direcionamento inicial.');
  }

  const nowIso = new Date().toISOString();
  const reason = input.reason?.trim() ? input.reason.trim().slice(0, 500) : null;

  if (input.mode === 'default_path') {
    try {
      const existingSnap = await getDocs(
        query(collection(db, 'student_academic_placements'), where('studentUid', '==', input.studentUid))
      );
      for (const docItem of existingSnap.docs) {
        const data = docItem.data() as StudentAcademicPlacement;
        if (input.courseId && data.courseId !== input.courseId) continue;
        const nextDoc: StudentAcademicPlacement = {
          ...data,
          id: docItem.id,
          studentUid: input.studentUid,
          mode: 'default_path',
          status: 'cleared',
          reason: reason ?? data.reason ?? 'Retornado ao percurso padrão pelo administrador.',
          assignedBy: currentUser.uid,
          assignedByEmail: currentUser.email || null,
          updatedAt: nowIso,
        };
        await setDoc(doc(db, 'student_academic_placements', docItem.id), nextDoc);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'student_academic_placements');
    }

    await logAdminSecurityEvent({
      eventType: 'student_placement_updated',
      severity: 'info',
      actorUid: currentUser.uid,
      actorEmail: currentUser.email,
      actorRole: 'admin',
      targetUid: input.studentUid,
      action: 'Direcionamento inicial removido (retorno ao percurso padrão)',
      details: input.courseId ? `courseId=${input.courseId}` : 'all_courses',
      source: 'admin_portal',
    });
  } else {
    const validated = validatePlacementTarget({
      courseId: String(input.courseId || ''),
      moduleId: input.moduleId ?? null,
      lessonId: input.lessonId ?? null,
    });
    const placementId = computePlacementDocId(input.studentUid, validated.courseId!);
    const placementRef = doc(db, 'student_academic_placements', placementId);

    try {
      await runTransaction(db, async (tx) => {
        const existingSnap = await tx.get(placementRef);
        const createdAt = existingSnap.exists()
          ? (existingSnap.data() as StudentAcademicPlacement)?.createdAt || nowIso
          : nowIso;
        const payload: StudentAcademicPlacement = {
          id: placementId,
          studentUid: input.studentUid,
          courseId: validated.courseId!,
          moduleId: validated.moduleId ?? null,
          moduleNumber: validated.moduleNumber ?? null,
          lessonId: validated.lessonId!,
          mode: 'custom_start',
          status: 'active',
          reason,
          assignedBy: currentUser.uid,
          assignedByEmail: currentUser.email || null,
          createdAt,
          updatedAt: nowIso,
        };
        tx.set(placementRef, payload);
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `student_academic_placements/${placementId}`);
    }

    const courseMeta = getCatalogCourse(validated.courseId!);
    await logAdminSecurityEvent({
      eventType: 'student_placement_updated',
      severity: 'info',
      actorUid: currentUser.uid,
      actorEmail: currentUser.email,
      actorRole: 'admin',
      targetUid: input.studentUid,
      action: `Direcionamento inicial definido em ${courseMeta?.title || validated.courseId}`,
      details: `module=${validated.moduleId || ''} lesson=${validated.lessonId}`,
      source: 'admin_portal',
    });
  }

  const overview = await loadStudentAccessServerless(input.studentUid);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('guitar-academy:access-updated', { detail: { studentUid: input.studentUid } })
    );
  }

  return {
    placements: overview.placements,
    snapshot: overview.snapshot,
    mode: 'firestore_serverless',
  };
}
