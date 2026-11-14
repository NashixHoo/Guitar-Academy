import {
  collection,
  doc,
  getDocFromServer,
  getDocsFromServer,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, FIRESTORE_DATABASE_ID, parseSystemRoleDoc } from './firebase';
import { getProfessorApiBaseUrl } from './professorService';
import { logAdminSecurityEvent } from './adminLogsService';
import type { AccountStatus, UserRole } from '../types';
import type { ClassGroup } from '../types/teacher';

export interface AdminDirectoryUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  provider: string;
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: string | null;
  lastLoginAt: string | null;
  lastSeenAt: string | null;
  enrolledCourses: string[];
  classNames: string[];
  completedLessonsCount: number | null;
  totalStudyMinutes: number | null;
  hasUserProfileDoc: boolean;
  sources: Array<'users' | 'system_roles' | 'enrollments' | 'class_students'>;
}

export interface AdminDirectoryLoadResult {
  users: AdminDirectoryUser[];
  classes: ClassGroup[];
  enrollmentsCount: number;
  warnings: string[];
}

export interface AccountStatusUpdateResult {
  uid: string;
  accountStatus: 'active' | 'suspended';
  firestorePersisted: boolean;
  authDisabledUpdated: boolean;
  mode: 'backend_admin_sdk' | 'firestore_serverless';
}

export interface RawUserRecordInput {
  id: string;
  data: Record<string, any>;
}

export interface RawEnrollmentRecordInput {
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  studentPhotoUrl?: string;
  classId?: string;
  courseId?: string;
  status?: string;
  joinedAt?: string;
  lastActivityAt?: string;
}

export interface RawProgressRecordInput {
  completedLessonsCount: number;
  totalStudyMinutes: number;
  primaryCourseId?: string;
}

const VALID_UID_REGEX = /^[a-zA-Z0-9_\-.:]{1,128}$/;

function normalizeAccountStatus(raw: unknown): AccountStatus {
  if (raw === 'suspended') return 'suspended';
  if (raw === 'inactive') return 'inactive';
  return 'active';
}

function normalizeIsoTimestamp(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || null;
  }
  if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return null;
    }
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  return null;
}

function normalizeStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === 'string') {
      const cleaned = item.trim();
      if (cleaned && !seen.has(cleaned)) {
        seen.add(cleaned);
        out.push(cleaned);
      }
    }
  }
  return out;
}

export function formatAccountProviderLabel(provider?: string | null): string {
  switch (provider) {
    case 'google.com':
      return 'Google';
    case 'facebook.com':
      return 'Facebook';
    case 'apple.com':
      return 'Apple';
    case 'password':
      return 'E-mail e Senha';
    default:
      return provider && provider.trim() ? provider.trim() : 'Não informado';
  }
}

export function formatRoleLabel(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'teacher':
      return 'Professor';
    default:
      return 'Aluno';
  }
}

export function formatCourseLabel(courseId: string): string {
  switch (courseId) {
    case 'violao':
      return 'Violão';
    case 'canonical':
      return 'Guitarra Canônica';
    case 'solo':
      return 'Guitarra Solo';
    case 'baixo':
      return 'Contrabaixo';
    case 'teclado':
      return 'Teclado & Piano';
    case 'bateria':
      return 'Bateria';
    default:
      return courseId;
  }
}

/**
 * Consolida exclusivamente registros reais do Firestore (sem nenhum dado fictício).
 * Função pura para permitir testes unitários determinísticos.
 */
export function buildAdminDirectoryUsers(params: {
  userDocs: RawUserRecordInput[];
  roleDocs: RawUserRecordInput[];
  classes: ClassGroup[];
  enrollments: RawEnrollmentRecordInput[];
  progressByUid?: Record<string, RawProgressRecordInput>;
}): AdminDirectoryUser[] {
  const { userDocs, roleDocs, classes, enrollments, progressByUid = {} } = params;

  const classNameMap = new Map<string, string>();
  classes.forEach((cls) => {
    if (cls.id) {
      classNameMap.set(cls.id, cls.name || cls.code || cls.id);
    }
  });

  const roleMap = new Map<string, UserRole>();
  roleDocs.forEach((r) => {
    const uid = typeof r.data?.uid === 'string' && r.data.uid.trim() ? r.data.uid.trim() : r.id;
    if (uid) {
      roleMap.set(uid, parseSystemRoleDoc(r.data));
    }
  });

  const usersByUid = new Map<string, AdminDirectoryUser>();

  const ensureEntry = (uid: string): AdminDirectoryUser => {
    const existing = usersByUid.get(uid);
    if (existing) return existing;
    const created: AdminDirectoryUser = {
      uid,
      displayName: 'Usuário sem perfil completo',
      email: '',
      photoURL: null,
      provider: '',
      role: roleMap.get(uid) || 'student',
      accountStatus: 'active',
      createdAt: null,
      lastLoginAt: null,
      lastSeenAt: null,
      enrolledCourses: [],
      classNames: [],
      completedLessonsCount: null,
      totalStudyMinutes: null,
      hasUserProfileDoc: false,
      sources: [],
    };
    usersByUid.set(uid, created);
    return created;
  };

  // 1. Documentos reais em users/{uid}
  for (const docItem of userDocs) {
    const uid =
      typeof docItem.data?.uid === 'string' && docItem.data.uid.trim()
        ? docItem.data.uid.trim()
        : docItem.id;
    if (!uid) continue;

    const entry = ensureEntry(uid);
    const data = docItem.data || {};
    entry.hasUserProfileDoc = true;
    if (!entry.sources.includes('users')) entry.sources.push('users');
    entry.displayName =
      typeof data.displayName === 'string' && data.displayName.trim()
        ? data.displayName.trim()
        : typeof data.email === 'string' && data.email.trim()
        ? data.email.trim()
        : 'Usuário sem nome';
    entry.email = typeof data.email === 'string' ? data.email.trim() : '';
    entry.photoURL = typeof data.photoURL === 'string' && data.photoURL.trim() ? data.photoURL.trim() : null;
    entry.provider = typeof data.provider === 'string' ? data.provider.trim() : '';
    entry.accountStatus = normalizeAccountStatus(data.accountStatus);
    entry.createdAt = normalizeIsoTimestamp(data.createdAt);
    entry.lastLoginAt = normalizeIsoTimestamp(data.lastLoginAt);
    entry.lastSeenAt = normalizeIsoTimestamp(data.lastSeenAt);
    entry.role = roleMap.get(uid) || 'student';

    const courses = normalizeStringArray(data.enrolledCourses);
    courses.forEach((c) => {
      if (!entry.enrolledCourses.includes(c)) entry.enrolledCourses.push(c);
    });
  }

  // 2. Papéis autoritativos em system_roles/{uid} (garante visibilidade de admins/teachers mesmo antes de criarem perfil em users/)
  for (const roleDoc of roleDocs) {
    const uid =
      typeof roleDoc.data?.uid === 'string' && roleDoc.data.uid.trim()
        ? roleDoc.data.uid.trim()
        : roleDoc.id;
    if (!uid) continue;
    const entry = ensureEntry(uid);
    entry.role = parseSystemRoleDoc(roleDoc.data);
    if (!entry.sources.includes('system_roles')) entry.sources.push('system_roles');
  }

  // 3. Matrículas reais em enrollments/{id} e classes/{classId}/students/{studentId}
  for (const enr of enrollments) {
    const uid = typeof enr.studentId === 'string' ? enr.studentId.trim() : '';
    if (!uid) continue;
    const entry = ensureEntry(uid);
    if (!entry.sources.includes('enrollments')) entry.sources.push('enrollments');

    if (
      (!entry.displayName || entry.displayName === 'Usuário sem perfil completo') &&
      typeof enr.studentName === 'string' &&
      enr.studentName.trim()
    ) {
      entry.displayName = enr.studentName.trim();
    }
    if (!entry.email && typeof enr.studentEmail === 'string' && enr.studentEmail.trim()) {
      entry.email = enr.studentEmail.trim();
    }
    if (!entry.photoURL && typeof enr.studentPhotoUrl === 'string' && enr.studentPhotoUrl.trim()) {
      entry.photoURL = enr.studentPhotoUrl.trim();
    }
    if (enr.courseId && typeof enr.courseId === 'string' && enr.courseId.trim()) {
      const course = enr.courseId.trim();
      if (!entry.enrolledCourses.includes(course)) entry.enrolledCourses.push(course);
    }
    if (enr.classId && typeof enr.classId === 'string') {
      const clsLabel = classNameMap.get(enr.classId) || enr.classId;
      if (clsLabel && !entry.classNames.includes(clsLabel)) {
        entry.classNames.push(clsLabel);
      }
    }
    if (!entry.createdAt && enr.joinedAt) {
      entry.createdAt = normalizeIsoTimestamp(enr.joinedAt);
    }
    if (!entry.lastSeenAt && enr.lastActivityAt) {
      entry.lastSeenAt = normalizeIsoTimestamp(enr.lastActivityAt);
    }
  }

  // 4. Progresso real na nuvem em users/{uid}/data/progress quando disponível
  for (const [uid, prog] of Object.entries(progressByUid)) {
    const entry = usersByUid.get(uid);
    if (!entry) continue;
    entry.completedLessonsCount = prog.completedLessonsCount;
    entry.totalStudyMinutes = prog.totalStudyMinutes;
    if (prog.primaryCourseId && !entry.enrolledCourses.includes(prog.primaryCourseId)) {
      entry.enrolledCourses.push(prog.primaryCourseId);
    }
  }

  const rolePriority: Record<UserRole, number> = { admin: 0, teacher: 1, student: 2 };
  return Array.from(usersByUid.values()).sort((a, b) => {
    const roleDiff = rolePriority[a.role] - rolePriority[b.role];
    if (roleDiff !== 0) return roleDiff;
    return (a.displayName || a.email || a.uid).localeCompare(b.displayName || b.email || b.uid, 'pt-BR');
  });
}

function mapFirestoreLoadError(err: unknown, contextPath: string): string {
  const code = typeof (err as any)?.code === 'string' ? (err as any).code : '';
  const msg = err instanceof Error ? err.message : String(err || 'Erro desconhecido');
  if (code === 'permission-denied' || msg.toLowerCase().includes('missing or insufficient permissions')) {
    return `Permissão negada ao consultar "${contextPath}" no banco "${FIRESTORE_DATABASE_ID}". Confirme se sua conta possui role: "admin" em system_roles/{uid} e se as Firestore Security Rules estão publicadas.`;
  }
  if (code === 'unavailable' || msg.toLowerCase().includes('offline')) {
    return `Não foi possível alcançar o Cloud Firestore ("${FIRESTORE_DATABASE_ID}") para carregar "${contextPath}". Verifique sua conexão com a internet.`;
  }
  return `Falha ao carregar "${contextPath}" no Firestore: ${msg}`;
}

export async function fetchAdminGlobalDirectory(): Promise<AdminDirectoryLoadResult> {
  const warnings: string[] = [];

  // 1. Leitura obrigatória da coleção users (list permitida exclusivamente para isAdmin())
  let userDocs: RawUserRecordInput[] = [];
  try {
    const usersSnap = await getDocsFromServer(collection(db, 'users'));
    userDocs = usersSnap.docs.map((d) => ({ id: d.id, data: d.data() as Record<string, any> }));
  } catch (err) {
    throw new Error(mapFirestoreLoadError(err, 'users'));
  }

  // 2. Consultas complementares autorizadas para admin (system_roles, classes, enrollments)
  const [rolesRes, classesRes, enrollmentsRes] = await Promise.allSettled([
    getDocsFromServer(collection(db, 'system_roles')),
    getDocsFromServer(collection(db, 'classes')),
    getDocsFromServer(collection(db, 'enrollments')),
  ]);

  let roleDocs: RawUserRecordInput[] = [];
  if (rolesRes.status === 'fulfilled') {
    roleDocs = rolesRes.value.docs.map((d) => ({ id: d.id, data: d.data() as Record<string, any> }));
  } else {
    warnings.push(mapFirestoreLoadError(rolesRes.reason, 'system_roles'));
  }

  let classes: ClassGroup[] = [];
  if (classesRes.status === 'fulfilled') {
    classes = classesRes.value.docs.map((d) => ({ id: d.id, ...d.data() } as ClassGroup));
  } else {
    warnings.push(mapFirestoreLoadError(classesRes.reason, 'classes'));
  }

  const allEnrollments: RawEnrollmentRecordInput[] = [];
  if (enrollmentsRes.status === 'fulfilled') {
    enrollmentsRes.value.docs.forEach((d) => {
      allEnrollments.push(d.data() as RawEnrollmentRecordInput);
    });
  } else {
    warnings.push(mapFirestoreLoadError(enrollmentsRes.reason, 'enrollments'));
  }

  // 3. Alunos matriculados em subcoleções classes/{classId}/students
  if (classes.length > 0) {
    const classStudentsResults = await Promise.allSettled(
      classes.map((cls) => getDocsFromServer(collection(db, 'classes', cls.id, 'students')))
    );
    classStudentsResults.forEach((res) => {
      if (res.status === 'fulfilled') {
        res.value.docs.forEach((d) => {
          allEnrollments.push(d.data() as RawEnrollmentRecordInput);
        });
      }
    });
  }

  // 4. Progresso real na nuvem (users/{uid}/data/progress) para os usuários encontrados
  const progressByUid: Record<string, RawProgressRecordInput> = {};
  const uidsToInspect = userDocs
    .map((u) => (typeof u.data?.uid === 'string' && u.data.uid.trim() ? u.data.uid.trim() : u.id))
    .filter((uid) => Boolean(uid && VALID_UID_REGEX.test(uid)));

  const BATCH_SIZE = 10;
  for (let i = 0; i < uidsToInspect.length; i += BATCH_SIZE) {
    const batch = uidsToInspect.slice(i, i + BATCH_SIZE);
    const snaps = await Promise.allSettled(
      batch.map((uid) => getDocFromServer(doc(db, 'users', uid, 'data', 'progress')))
    );
    snaps.forEach((res, idx) => {
      if (res.status === 'fulfilled' && res.value.exists()) {
        const raw = res.value.data() as { progress?: Record<string, any> };
        const p = raw?.progress;
        if (p && typeof p === 'object') {
          const completedCount = Array.isArray(p.completedLessons) ? p.completedLessons.length : 0;
          const totalSec = typeof p.totalStudyTimeSeconds === 'number' ? p.totalStudyTimeSeconds : 0;
          progressByUid[batch[idx]] = {
            completedLessonsCount: completedCount,
            totalStudyMinutes: Math.floor(Math.max(0, totalSec) / 60),
            primaryCourseId: typeof p.primaryCourseId === 'string' ? p.primaryCourseId : undefined,
          };
        }
      }
    });
  }

  const users = buildAdminDirectoryUsers({
    userDocs,
    roleDocs,
    classes,
    enrollments: allEnrollments,
    progressByUid,
  });

  return {
    users,
    classes,
    enrollmentsCount: allEnrollments.length,
    warnings,
  };
}

/**
 * Atualiza a situação da conta (users/{uid}.accountStatus) com confirmação real de persistência.
 * - Quando o backend Express com Firebase Admin SDK estiver disponível, executa por POST /api/admin/users/:uid/status
 *   (validando ID Token e system_roles no servidor).
 * - Em modo serverless (GitHub Pages / sem credenciais Admin SDK no backend), persiste diretamente em users/{uid}
 *   autorizado exclusivamente pela regra isAdmin() no Cloud Firestore Security Rules e confirma leitura no servidor.
 */
export async function updateAdminUserAccountStatus(
  targetUser: Pick<AdminDirectoryUser, 'uid' | 'displayName' | 'email' | 'hasUserProfileDoc'>,
  nextStatus: 'active' | 'suspended'
): Promise<AccountStatusUpdateResult> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Sessão administrativa não autenticada. Faça login novamente.');
  }
  const targetUid = (targetUser.uid || '').trim();
  if (!targetUid || !VALID_UID_REGEX.test(targetUid)) {
    throw new Error('UID do usuário alvo inválido.');
  }
  if (targetUid === currentUser.uid) {
    throw new Error('Por segurança, o administrador não pode suspender ou alterar o status da própria conta em uso.');
  }
  if (!targetUser.hasUserProfileDoc) {
    throw new Error(
      `O UID "${targetUid}" não possui documento de perfil em users/${targetUid}. Não é possível persistir accountStatus sem o registro do usuário no Firestore.`
    );
  }

  const idToken = await currentUser.getIdToken();
  const baseUrl = getProfessorApiBaseUrl();

  // 1. Tenta rota protegida no backend Express (quando disponível com Firebase Admin SDK)
  let shouldFallbackToFirestoreServerless = false;
  try {
    const resp = await fetch(
      `${baseUrl}/api/admin/users/${encodeURIComponent(targetUid)}/status`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ accountStatus: nextStatus }),
      }
    );

    const contentType = resp.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (resp.status === 401 || resp.status === 403 || resp.status === 400 || resp.status === 404) {
      if (resp.status === 404 && !isJson) {
        // Hospedagem estática (ex.: GitHub Pages) retornando index.html 404 para /api/*
        shouldFallbackToFirestoreServerless = true;
      } else {
        const body = isJson ? ((await resp.json()) as { error?: string }) : {};
        throw new Error(
          body.error || `Operação recusada pelo servidor (HTTP ${resp.status}).`
        );
      }
    } else if (resp.status === 503) {
      // Backend Express sem credenciais Admin SDK (ex.: dev local sem service account) -> usa Firestore Rules isAdmin()
      shouldFallbackToFirestoreServerless = true;
    } else if (resp.ok && isJson) {
      const payload = (await resp.json()) as {
        status?: string;
        accountStatus?: 'active' | 'suspended';
        firestorePersisted?: boolean;
        authDisabledUpdated?: boolean;
      };
      if (payload?.status === 'ok' && payload.firestorePersisted) {
        return {
          uid: targetUid,
          accountStatus: payload.accountStatus || nextStatus,
          firestorePersisted: true,
          authDisabledUpdated: Boolean(payload.authDisabledUpdated),
          mode: 'backend_admin_sdk',
        };
      }
      shouldFallbackToFirestoreServerless = true;
    } else {
      shouldFallbackToFirestoreServerless = true;
    }
  } catch (err) {
    if (err instanceof Error && !err.message.toLowerCase().includes('fetch')) {
      // Erros explícitos de autorização (401/403/400) não fazem fallback
      if (
        err.message.includes('HTTP 401') ||
        err.message.includes('HTTP 403') ||
        err.message.includes('Operação recusada')
      ) {
        throw err;
      }
    }
    shouldFallbackToFirestoreServerless = true;
  }

  if (!shouldFallbackToFirestoreServerless) {
    throw new Error('Não foi possível confirmar a persistência do status da conta.');
  }

  // 2. Persistência Serverless Zero-Trust diretamente no Firestore (autorizada exclusivamente por isAdmin() em firestore.rules)
  const userRef = doc(db, 'users', targetUid);
  try {
    await updateDoc(userRef, {
      accountStatus: nextStatus,
      updatedAt: serverTimestamp(),
    });
    const verifiedSnap = await getDocFromServer(userRef);
    const verifiedStatus = verifiedSnap.exists() ? verifiedSnap.data()?.accountStatus : null;
    if (verifiedStatus !== nextStatus) {
      throw new Error(
        `A atualização foi enviada ao Firestore, mas o valor confirmado no servidor (${String(verifiedStatus)}) divergiu do esperado (${nextStatus}).`
      );
    }
  } catch (err) {
    throw new Error(mapFirestoreLoadError(err, `users/${targetUid}`));
  }

  await logAdminSecurityEvent({
    eventType: 'student_status_updated',
    severity: nextStatus === 'suspended' ? 'warning' : 'info',
    actorUid: currentUser.uid,
    actorEmail: currentUser.email,
    actorRole: 'admin',
    targetUid,
    action: `Situação da conta alterada para "${nextStatus === 'active' ? 'Ativa' : 'Suspensa'}"`,
    details: `Persistido em users/${targetUid}.accountStatus=${nextStatus} (${targetUser.email || targetUid}) por ${currentUser.email || currentUser.uid}`,
    source: 'admin_portal',
  });

  return {
    uid: targetUid,
    accountStatus: nextStatus,
    firestorePersisted: true,
    authDisabledUpdated: false,
    mode: 'firestore_serverless',
  };
}
