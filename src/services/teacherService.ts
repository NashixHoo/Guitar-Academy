import {
  ClassGroup,
  ClassEnrollment,
  EducationalEvent,
  EducationalEventType,
  ActivityCategory,
  TeacherFilterState,
  AnalyticsTableRow,
  CourseFunnelRow,
  PedagogicalBottleneck,
  StudentAnalyticsSummary,
  UserRole,
  InviteValidationResult,
  StudentEnrolledClassInfo,
} from '../types/teacher';
import { auth, db, fetchSystemRole } from './firebase';
import { getProfessorApiBaseUrl } from './professorService';
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getDocsFromServer,
  increment,
  setDoc,
  updateDoc,
  writeBatch,
  arrayUnion,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { SOLO_LESSONS } from '../data/soloCourse';
import { VIOLAO_LESSONS } from '../data/violaoCourse';
import { BASS_LESSONS } from '../data/bassCourse';
import { KEYBOARD_LESSONS } from '../data/keyboardCourse';
import { DRUMS_LESSONS } from '../data/drumsCourse';

export function getAllLessons() {
  return [
    ...CURRICULUM_LEVELS.flatMap((l) => l.lessons),
    ...SOLO_LESSONS,
    ...VIOLAO_LESSONS,
    ...BASS_LESSONS,
    ...KEYBOARD_LESSONS,
    ...DRUMS_LESSONS,
  ];
}
import { storageService } from './storageService';
import { UserProgress } from '../types';

// Chaves locais para resiliência offline
const LOCAL_CLASSES_KEY = 'guitar_academy:teacher_classes_v1';
const LOCAL_ENROLLMENTS_KEY = 'guitar_academy:teacher_enrollments_v1';
const LOCAL_EVENTS_KEY = 'guitar_academy:teacher_events_v1';
const LOCAL_STUDENT_CLASS_LINK_KEY = 'guitar_academy:student_class_link_v1';

const LEGACY_DEMO_STUDENT_IDS = new Set([
  'user_aluno_diego_01',
  'user_aluno_carolina_02',
  'user_aluno_lucas_03',
]);
const INACTIVE_ENROLLMENT_STATUSES = new Set(['cancelled', 'suspended', 'inactive']);
const VALID_OFFICIAL_COURSES = new Set(['violao', 'canonical', 'solo', 'baixo', 'teclado', 'bateria']);
const VALID_INVITE_CODE_REGEX = /^[A-Z0-9_\-.:]{1,128}$/;
const VALID_DOC_ID_REGEX = /^[a-zA-Z0-9_\-.:]{1,128}$/;

export function formatClassInstrumentLabel(courseId?: string, instrument?: string): string {
  if (typeof instrument === 'string' && instrument.trim()) return instrument.trim();
  switch (courseId) {
    case 'violao':
      return 'Violão';
    case 'canonical':
      return 'Guitarra Elétrica';
    case 'solo':
      return 'Guitarra Solo';
    case 'baixo':
      return 'Contrabaixo';
    case 'teclado':
      return 'Teclado & Piano';
    case 'bateria':
      return 'Bateria';
    case 'geral':
      return 'Formação Geral';
    default:
      return 'Formação Geral';
  }
}

function isRealClassRecord(cls: Partial<ClassGroup> | null | undefined): cls is ClassGroup {
  if (!cls || typeof cls.id !== 'string' || !cls.id.trim()) return false;
  if (cls.code === 'GA-TURMA-101' || cls.id.endsWith('-turma-1')) return false;
  return true;
}

function isRealEnrollmentRecord(
  enr: Partial<ClassEnrollment> | null | undefined
): enr is ClassEnrollment {
  if (!enr || typeof enr.studentId !== 'string' || !enr.studentId.trim()) return false;
  if (enr.studentId.startsWith('user_aluno_') || LEGACY_DEMO_STUDENT_IDS.has(enr.studentId)) {
    return false;
  }
  const status = typeof enr.status === 'string' ? enr.status.trim().toLowerCase() : 'active';
  if (INACTIVE_ENROLLMENT_STATUSES.has(status)) return false;
  return true;
}

function deduplicateRealEnrollments(enrollments: ClassEnrollment[]): ClassEnrollment[] {
  const map = new Map<string, ClassEnrollment>();
  for (const enr of enrollments) {
    if (!isRealEnrollmentRecord(enr)) continue;
    const key = `${enr.classId || 'no-class'}::${enr.studentId}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, enr);
    } else {
      map.set(key, {
        ...existing,
        ...enr,
        studentName: enr.studentName || existing.studentName,
        studentEmail: enr.studentEmail || existing.studentEmail,
        studentPhotoUrl: enr.studentPhotoUrl || existing.studentPhotoUrl,
      });
    }
  }
  return Array.from(map.values());
}

export class TeacherService {
  /**
   * Determina o papel do usuário (STUDENT, TEACHER ou ADMIN).
   * Consulta a fonte autoritativa única protegida em system_roles/{uid}.
   * NUNCA utiliza e-mails fixos ou endereços de e-mail como mecanismo de autorização.
   */
  static async resolveUserRole(uid: string, testDocProvider?: (uid: string) => Promise<any>): Promise<UserRole> {
    if (!uid) return 'student';
    return await fetchSystemRole(uid, testDocProvider);
  }

  /**
   * Retorna exclusivamente as turmas reais de responsabilidade do professor no Firestore.
   * Nunca fabrica turmas padrão ou registros demonstrativos.
   */
  static async getTeacherClasses(teacherId: string, _teacherEmail?: string): Promise<ClassGroup[]> {
    if (!teacherId) return [];

    // 1. Quando autenticado, consulta exclusivamente o Cloud Firestore
    if (auth.currentUser) {
      try {
        const classesRef = collection(db, 'classes');
        const q = query(classesRef, where('teacherId', '==', teacherId));
        let snap;
        try {
          snap = await getDocsFromServer(q);
        } catch {
          snap = await getDocs(q);
        }
        const firestoreClasses = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as ClassGroup))
          .filter(isRealClassRecord);

        // Atualiza cache local removendo qualquer turma antiga daquele professor que não exista no servidor
        const otherLocalClasses = this.loadLocalClasses().filter(
          (c) => c.teacherId !== teacherId && isRealClassRecord(c)
        );
        this.saveLocalClasses([...otherLocalClasses, ...firestoreClasses]);
        return firestoreClasses;
      } catch {
        // Fallback offline apenas se a consulta ao servidor falhar por conectividade
      }
    }

    // 2. Cache local sanitizado (ambiente offline ou suíte de testes Node sem auth.currentUser)
    return this.loadLocalClasses().filter(
      (c) => c.teacherId === teacherId && isRealClassRecord(c)
    );
  }

  /**
   * Cria uma nova turma com código de convite exclusivo
   */
  static async createClass(
    teacherId: string,
    teacherEmail: string,
    teacherName: string,
    name: string,
    description?: string,
    customCode?: string,
    options?: {
      courseId?: ClassGroup['courseId'];
      instrument?: string;
      expiresAt?: string | null;
      maxStudents?: number;
    }
  ): Promise<ClassGroup> {
    const classId = `class-${crypto.randomUUID()}`;
    const rawCode =
      customCode?.toUpperCase().trim() ||
      `GA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const code = rawCode.replace(/[^A-Z0-9_\-.:]/g, '-').slice(0, 64) || `GA-${Date.now()}`;
    const courseId = options?.courseId || 'geral';
    const instrument = formatClassInstrumentLabel(courseId, options?.instrument);
    const expiresAt =
      typeof options?.expiresAt === 'string' && options.expiresAt.trim()
        ? options.expiresAt.trim()
        : null;
    const parsedExpiresMs = expiresAt ? Date.parse(expiresAt) : NaN;
    const expiresAtMs = !Number.isNaN(parsedExpiresMs) ? parsedExpiresMs : null;
    const maxStudents =
      typeof options?.maxStudents === 'number' && options.maxStudents > 0
        ? Math.min(500, Math.round(options.maxStudents))
        : 60;
    const nowIso = new Date().toISOString();

    const newClass: ClassGroup = {
      id: classId,
      name: name.trim(),
      code,
      description: description?.trim() || '',
      courseId,
      instrument,
      teacherId,
      teacherEmail,
      teacherName,
      createdAt: nowIso,
      updatedAt: nowIso,
      expiresAt,
      expiresAtMs,
      active: true,
      maxStudents,
      enrolledCount: 0,
    };

    const currentClasses = this.loadLocalClasses();
    this.saveLocalClasses([...currentClasses, newClass]);

    if (auth.currentUser) {
      try {
        const batch = writeBatch(db);
        batch.set(doc(db, 'classes', classId), {
          ...newClass,
          updatedAt: serverTimestamp(),
        });
        batch.set(doc(db, 'class_invites', code), {
          classId,
          code,
          name: newClass.name,
          description: newClass.description,
          courseId,
          instrument,
          teacherId,
          teacherName,
          createdAt: nowIso,
          expiresAt,
          expiresAtMs,
          maxStudents,
          active: true,
          updatedAt: serverTimestamp(),
        });
        await batch.commit();
      } catch {
        // offline
      }
    }

    return newClass;
  }

  /**
   * Valida um código de convite antes da confirmação de matrícula do aluno.
   * Prioriza o backend Express autenticado quando disponível (com fallback seguro no Cloud Firestore).
   */
  static async validateInviteCode(
    inviteCode: string,
    studentUid?: string
  ): Promise<InviteValidationResult> {
    const cleanCode = (inviteCode || '').trim().toUpperCase();
    if (!cleanCode) {
      return {
        valid: false,
        reason: 'empty',
        message: 'Por favor, digite ou cole o código de convite fornecido pelo seu professor.',
      };
    }

    if (!VALID_INVITE_CODE_REGEX.test(cleanCode)) {
      return {
        valid: false,
        reason: 'invalid_format',
        message: 'Código de convite inválido. Utilize apenas letras, números, hífen (-) ou ponto (.).',
      };
    }

    const currentUser = auth.currentUser;
    const effectiveUid = (studentUid || currentUser?.uid || '').trim();

    if (currentUser && studentUid && studentUid.trim() !== currentUser.uid) {
      return {
        valid: false,
        reason: 'unauthenticated',
        message: 'Operação negada: o aluno só pode validar turmas para o próprio UID autenticado.',
      };
    }

    // 1. Quando autenticado, tenta validação autoritativa no backend Express (quando disponível com Admin SDK)
    if (currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        const baseUrl = getProfessorApiBaseUrl();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        try {
          const resp = await fetch(`${baseUrl}/api/classes/validate-invite`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ code: cleanCode }),
            signal: controller.signal,
          });
          const contentType = resp.headers.get('content-type') || '';
          if (resp.status !== 503 && contentType.includes('application/json')) {
            const payload = (await resp.json()) as InviteValidationResult & { code?: string };
            if (payload && payload.code !== 'admin/credentials-unavailable') {
              return {
                ...payload,
                source: 'backend',
              };
            }
          }
        } finally {
          clearTimeout(timeoutId);
        }
      } catch {
        // Fallback automático para Cloud Firestore em ambientes serverless/GitHub Pages
      }

      // 2. Fallback seguro direto no Cloud Firestore (/class_invites/{code})
      try {
        let inviteSnap;
        try {
          inviteSnap = await getDocFromServer(doc(db, 'class_invites', cleanCode));
        } catch {
          inviteSnap = await getDoc(doc(db, 'class_invites', cleanCode));
        }

        let candidateClass: ClassGroup | undefined;
        let isInviteClosed = false;
        let expiresAt: string | null = null;
        let expiresAtMs: number | null = null;

        if (inviteSnap.exists()) {
          const inv = inviteSnap.data() || {};
          if (inv.active === false) {
            isInviteClosed = true;
          }
          if (typeof inv.expiresAt === 'string' && inv.expiresAt.trim()) {
            expiresAt = inv.expiresAt.trim();
          }
          if (typeof inv.expiresAtMs === 'number' && Number.isFinite(inv.expiresAtMs)) {
            expiresAtMs = inv.expiresAtMs;
          } else if (expiresAt) {
            const parsed = Date.parse(expiresAt);
            if (!Number.isNaN(parsed)) expiresAtMs = parsed;
          }
          if (inv.classId && inv.teacherId) {
            candidateClass = {
              id: String(inv.classId),
              name: String(inv.name || 'Turma Guitar Academy'),
              code: String(inv.code || cleanCode),
              description: String(inv.description || ''),
              courseId: inv.courseId || 'geral',
              instrument: formatClassInstrumentLabel(inv.courseId, inv.instrument),
              teacherId: String(inv.teacherId),
              teacherEmail: '',
              teacherName: String(inv.teacherName || 'Professor Guitar Academy'),
              createdAt: String(inv.createdAt || new Date().toISOString()),
              updatedAt: new Date().toISOString(),
              expiresAt,
              expiresAtMs,
              active: inv.active !== false,
              maxStudents: Number(inv.maxStudents || 60),
            };
          }
        } else {
          // Tentativa secundária caso professor/admin esteja testando em classes/{classId}
          try {
            const q = query(collection(db, 'classes'), where('code', '==', cleanCode));
            const snap = await getDocs(q);
            if (!snap.empty) {
              const raw = { id: snap.docs[0].id, ...snap.docs[0].data() } as ClassGroup;
              if (isRealClassRecord(raw)) {
                candidateClass = {
                  ...raw,
                  instrument: formatClassInstrumentLabel(raw.courseId, raw.instrument),
                };
                if (raw.active === false) isInviteClosed = true;
                if (typeof raw.expiresAt === 'string' && raw.expiresAt.trim()) {
                  expiresAt = raw.expiresAt.trim();
                }
                if (typeof raw.expiresAtMs === 'number' && Number.isFinite(raw.expiresAtMs)) {
                  expiresAtMs = raw.expiresAtMs;
                } else if (expiresAt) {
                  const parsed = Date.parse(expiresAt);
                  if (!Number.isNaN(parsed)) expiresAtMs = parsed;
                }
              }
            }
          } catch {
            // Alunos não podem listar /classes pelas regras de segurança — esperado
          }
        }

        if (!candidateClass) {
          return {
            valid: false,
            reason: 'not_found',
            message: 'Código de turma não encontrado. Verifique com seu professor o código exato da turma.',
            source: 'firestore',
          };
        }

        if (isInviteClosed || !candidateClass.active) {
          return {
            valid: false,
            reason: 'closed',
            message: 'Esta turma ou código de convite foi encerrado pelo professor.',
            classGroup: candidateClass,
            source: 'firestore',
          };
        }

        if (expiresAtMs !== null && expiresAtMs < Date.now()) {
          return {
            valid: false,
            reason: 'expired',
            message: 'Este código de convite expirou. Solicite um novo código ao seu professor.',
            classGroup: candidateClass,
            source: 'firestore',
          };
        }

        // Verifica matrícula duplicada ou suspensão do usuário autenticado na turma
        if (effectiveUid) {
          let alreadyActive = false;
          let isSuspended = false;
          try {
            const subSnap = await getDocFromServer(
              doc(db, 'classes', candidateClass.id, 'students', effectiveUid)
            ).catch(() => getDoc(doc(db, 'classes', candidateClass.id, 'students', effectiveUid)));
            if (subSnap.exists()) {
              const st = String(subSnap.data()?.status || 'active').toLowerCase();
              if (st === 'suspended') {
                isSuspended = true;
              } else if (!INACTIVE_ENROLLMENT_STATUSES.has(st)) {
                alreadyActive = true;
              }
            }
          } catch {
            // Ignora falha pontual
          }

          if (!alreadyActive && !isSuspended) {
            try {
              const deterministicId = `enroll-${candidateClass.id}-${effectiveUid}`;
              if (VALID_DOC_ID_REGEX.test(deterministicId)) {
                const detSnap = await getDocFromServer(
                  doc(db, 'enrollments', deterministicId)
                ).catch(() => getDoc(doc(db, 'enrollments', deterministicId)));
                if (detSnap.exists()) {
                  const st = String(detSnap.data()?.status || 'active').toLowerCase();
                  if (st === 'suspended') {
                    isSuspended = true;
                  } else if (!INACTIVE_ENROLLMENT_STATUSES.has(st)) {
                    alreadyActive = true;
                  }
                }
              }
            } catch {
              // Ignora
            }
          }

          if (isSuspended) {
            return {
              valid: false,
              reason: 'closed',
              message: 'Sua matrícula nesta turma está suspensa. Entre em contato com seu professor.',
              classGroup: candidateClass,
              source: 'firestore',
            };
          }

          if (alreadyActive) {
            return {
              valid: false,
              reason: 'already_enrolled',
              alreadyEnrolled: true,
              message: `Você já está matriculado na turma "${candidateClass.name}".`,
              classGroup: candidateClass,
              source: 'firestore',
            };
          }
        }

        if (
          typeof candidateClass.enrolledCount === 'number' &&
          typeof candidateClass.maxStudents === 'number' &&
          candidateClass.maxStudents > 0 &&
          candidateClass.enrolledCount >= candidateClass.maxStudents
        ) {
          return {
            valid: false,
            reason: 'full',
            message: 'Esta turma já atingiu o limite máximo de alunos matriculados.',
            classGroup: candidateClass,
            currentStudentCount: candidateClass.enrolledCount,
            source: 'firestore',
          };
        }

        return {
          valid: true,
          message: 'Turma localizada e disponível para matrícula.',
          classGroup: candidateClass,
          source: 'firestore',
        };
      } catch (err: any) {
        return {
          valid: false,
          reason: 'error',
          message:
            err?.code === 'unavailable'
              ? 'Não foi possível alcançar o Firebase. Verifique sua conexão e tente novamente.'
              : 'Erro ao validar o código de convite no Firebase.',
          source: 'firestore',
        };
      }
    }

    // 3. Ambiente offline / suíte de testes em Node sem auth.currentUser
    const localClasses = this.loadLocalClasses().filter(isRealClassRecord);
    const localMatch = localClasses.find(
      (c) => c.code === cleanCode || (c as any).inviteCode === cleanCode
    );
    if (!localMatch) {
      return {
        valid: false,
        reason: 'not_found',
        message: 'Código de turma não encontrado. Verifique com seu professor o código exato da sua turma.',
        source: 'local',
      };
    }

    const enrichedLocal: ClassGroup = {
      ...localMatch,
      instrument: formatClassInstrumentLabel(localMatch.courseId, localMatch.instrument),
    };

    if (!localMatch.active) {
      return {
        valid: false,
        reason: 'closed',
        message: 'Esta turma ou código de convite foi encerrado pelo professor.',
        classGroup: enrichedLocal,
        source: 'local',
      };
    }

    if (localMatch.expiresAt) {
      const expMs = Date.parse(localMatch.expiresAt);
      if (!Number.isNaN(expMs) && expMs < Date.now()) {
        return {
          valid: false,
          reason: 'expired',
          message: 'Este código de convite expirou. Solicite um novo código ao seu professor.',
          classGroup: enrichedLocal,
          source: 'local',
        };
      }
    }

    const localEnrollments = this.loadLocalEnrollments().filter(isRealEnrollmentRecord);
    if (
      effectiveUid &&
      localEnrollments.some((e) => e.classId === localMatch.id && e.studentId === effectiveUid)
    ) {
      return {
        valid: false,
        reason: 'already_enrolled',
        alreadyEnrolled: true,
        message: `Você já está matriculado na turma "${localMatch.name}".`,
        classGroup: enrichedLocal,
        source: 'local',
      };
    }

    const activeCount = localEnrollments.filter((e) => e.classId === localMatch.id).length;
    if (typeof localMatch.maxStudents === 'number' && localMatch.maxStudents > 0 && activeCount >= localMatch.maxStudents) {
      return {
        valid: false,
        reason: 'full',
        message: 'Esta turma já atingiu o limite máximo de alunos matriculados.',
        classGroup: enrichedLocal,
        currentStudentCount: activeCount,
        source: 'local',
      };
    }

    return {
      valid: true,
      message: 'Turma localizada e disponível para matrícula.',
      classGroup: enrichedLocal,
      currentStudentCount: activeCount,
      source: 'local',
    };
  }

  /**
   * Vincula um aluno a uma turma através do código de convite seguro
   */
  static async joinClassWithInviteCode(
    studentUidOrCode: string,
    studentNameOrUid: string,
    studentEmailOrName: string,
    inviteCodeOrEmail?: string,
    studentPhotoUrl?: string
  ): Promise<{ success: boolean; message: string; error?: string; classGroup?: ClassGroup }> {
    let studentUid = studentUidOrCode;
    let studentName = studentNameOrUid;
    let studentEmail = studentEmailOrName;
    let inviteCode = inviteCodeOrEmail || '';

    // Detecção flexível: se o primeiro parâmetro for o código de convite (começa com GA- ou quarto parâmetro indefinido)
    if (studentUidOrCode.toUpperCase().startsWith('GA-') || !inviteCodeOrEmail) {
      inviteCode = studentUidOrCode;
      studentUid = studentNameOrUid;
      studentName = studentEmailOrName;
      studentEmail = inviteCodeOrEmail || '';
    }

    const cleanStudentUid = (studentUid || '').trim();
    if (!cleanStudentUid) {
      return { success: false, message: 'Sessão do estudante inválida para matrícula.', error: 'UID ausente.' };
    }

    // Impede que o cliente tente matricular outro UID diferente do usuário autenticado
    if (auth.currentUser && auth.currentUser.uid !== cleanStudentUid) {
      return {
        success: false,
        message: 'Operação negada: o aluno só pode realizar matrícula em seu próprio UID autenticado.',
        error: 'UID divergente do usuário autenticado.',
      };
    }

    const cleanCode = inviteCode.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Código de convite inválido ou vazio.', error: 'Código de convite inválido ou vazio.' };
    }

    const safeStudentName = (studentName || 'Estudante').trim().slice(0, 120);
    const safeStudentEmail = (studentEmail || '').trim().slice(0, 254);
    const safePhotoUrl =
      typeof studentPhotoUrl === 'string' && studentPhotoUrl.trim()
        ? studentPhotoUrl.trim().slice(0, 1024)
        : null;

    let matchedClass: ClassGroup | undefined;
    let persistedEnrollment: ClassEnrollment | undefined;

    if (auth.currentUser) {
      // 1. Tenta execução autoritativa via backend Express (quando disponível com Admin SDK)
      let handledByBackend = false;
      try {
        const idToken = await auth.currentUser.getIdToken();
        const baseUrl = getProfessorApiBaseUrl();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);
        try {
          const resp = await fetch(`${baseUrl}/api/classes/join`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              code: cleanCode,
              studentName: safeStudentName,
              studentEmail: safeStudentEmail,
              studentPhotoUrl: safePhotoUrl,
            }),
            signal: controller.signal,
          });
          const contentType = resp.headers.get('content-type') || '';
          if (resp.status !== 503 && contentType.includes('application/json')) {
            const payload = (await resp.json()) as {
              success?: boolean;
              message?: string;
              code?: string;
              classGroup?: ClassGroup;
              enrollment?: ClassEnrollment;
            };
            if (payload && payload.code !== 'admin/credentials-unavailable') {
              handledByBackend = true;
              if (!resp.ok || !payload.success || !payload.classGroup) {
                return {
                  success: false,
                  message: payload.message || 'Não foi possível concluir a matrícula na turma.',
                  error: payload.message || 'Falha na matrícula.',
                  classGroup: payload.classGroup,
                };
              }
              matchedClass = payload.classGroup;
              persistedEnrollment = payload.enrollment;
            }
          }
        } finally {
          clearTimeout(timeoutId);
        }
      } catch {
        // Fallback automático para Cloud Firestore
      }

      // 2. Fallback direto no Cloud Firestore respeitando estritamente firestore.rules
      if (!handledByBackend) {
        const validation = await this.validateInviteCode(cleanCode, cleanStudentUid);
        if (!validation.valid || !validation.classGroup) {
          return {
            success: false,
            message: validation.message,
            error: validation.message,
            classGroup: validation.classGroup,
          };
        }

        matchedClass = validation.classGroup;
        const enrollmentId = `enroll-${matchedClass.id}-${cleanStudentUid}`;
        if (!VALID_DOC_ID_REGEX.test(enrollmentId)) {
          return {
            success: false,
            message: 'Identificador de matrícula inválido para esta turma.',
            error: 'ID de matrícula inválido.',
            classGroup: matchedClass,
          };
        }

        const detEnrollRef = doc(db, 'enrollments', enrollmentId);
        let detEnrollExists = false;
        try {
          const existingDetSnap = await getDocFromServer(detEnrollRef).catch(() =>
            getDoc(detEnrollRef)
          );
          if (existingDetSnap.exists()) {
            detEnrollExists = true;
            const existingStatus = String(existingDetSnap.data()?.status || 'active').toLowerCase();
            if (existingStatus === 'suspended') {
              return {
                success: false,
                message: 'Sua matrícula nesta turma está suspensa. Entre em contato com seu professor.',
                error: 'Matrícula suspensa.',
                classGroup: matchedClass,
              };
            }
            if (!INACTIVE_ENROLLMENT_STATUSES.has(existingStatus)) {
              return {
                success: false,
                message: `Você já está matriculado na turma "${matchedClass.name}".`,
                error: 'Matrícula duplicada.',
                classGroup: matchedClass,
              };
            }
          }
        } catch {
          // Prossegue com verificação na subcoleção
        }

        const nowIso = new Date().toISOString();
        const courseIdField =
          matchedClass.courseId && VALID_OFFICIAL_COURSES.has(matchedClass.courseId)
            ? { courseId: matchedClass.courseId }
            : {};

        const firestorePayload: Record<string, any> = {
          id: enrollmentId,
          classId: matchedClass.id,
          ...courseIdField,
          studentId: cleanStudentUid,
          studentName: safeStudentName,
          studentEmail: safeStudentEmail,
          studentPhotoUrl: safePhotoUrl,
          teacherId: matchedClass.teacherId,
          joinedAt: nowIso,
          status: 'active',
          lastActivityAt: nowIso,
          updatedAt: serverTimestamp(),
        };

        const subDocRef = doc(db, 'classes', matchedClass.id, 'students', cleanStudentUid);
        let subDocExists = false;
        try {
          const subSnap = await getDocFromServer(subDocRef).catch(() => getDoc(subDocRef));
          if (subSnap.exists()) {
            subDocExists = true;
            const subStatus = String(subSnap.data()?.status || 'active').toLowerCase();
            if (subStatus === 'suspended') {
              return {
                success: false,
                message: 'Sua matrícula nesta turma está suspensa. Entre em contato com seu professor.',
                error: 'Matrícula suspensa.',
                classGroup: matchedClass,
              };
            }
            if (!INACTIVE_ENROLLMENT_STATUSES.has(subStatus)) {
              return {
                success: false,
                message: `Você já está matriculado na turma "${matchedClass.name}".`,
                error: 'Matrícula duplicada.',
                classGroup: matchedClass,
              };
            }
          }
        } catch {
          // Ignora
        }

        try {
          // WriteBatch atômico: garante integridade 1-para-1 entre classes/{classId}/students/{uid},
          // enrollments/enroll-{classId}-{uid} e incremento atômico de classes/{classId}.enrolledCount
          const batch = writeBatch(db);
          batch.update(doc(db, 'classes', matchedClass.id), {
            enrolledCount: increment(1),
            updatedAt: serverTimestamp(),
          });
          if (subDocExists) {
            batch.update(subDocRef, firestorePayload);
          } else {
            batch.set(subDocRef, firestorePayload);
          }
          if (detEnrollExists) {
            batch.update(detEnrollRef, firestorePayload);
          } else {
            batch.set(detEnrollRef, firestorePayload);
          }
          await batch.commit();
        } catch (writeErr: any) {
          const msg =
            writeErr?.code === 'permission-denied'
              ? 'Não foi possível concluir a matrícula: a turma atingiu o limite máximo de vagas, aguarda validação de vagas, foi encerrada ou o código expirou.'
              : 'Erro ao gravar matrícula no Firebase. Verifique sua conexão e tente novamente.';
          return {
            success: false,
            message: msg,
            error: writeErr?.message || msg,
            classGroup: matchedClass,
          };
        }

        // Após entrar na subcoleção, o aluno já possui permissão de leitura em /classes/{classId}
        try {
          const classDocRef = doc(db, 'classes', matchedClass.id);
          const classDocSnap = await getDocFromServer(classDocRef).catch(() =>
            getDoc(classDocRef)
          );
          if (classDocSnap.exists()) {
            const cData = classDocSnap.data() || {};
            matchedClass = {
              ...matchedClass,
              name: String(cData.name || matchedClass.name),
              description: String(cData.description || matchedClass.description || ''),
              courseId: cData.courseId || matchedClass.courseId,
              instrument: formatClassInstrumentLabel(cData.courseId || matchedClass.courseId, cData.instrument || matchedClass.instrument),
              teacherName: String(cData.teacherName || matchedClass.teacherName),
            };
          }
        } catch {
          // Dados de class_invites já garantem exibição completa
        }

        // Sincroniza enrolledCourses no perfil users/{uid} quando aplicável (sem tocar em role ou campos protegidos)
        if (courseIdField.courseId) {
          try {
            await updateDoc(doc(db, 'users', cleanStudentUid), {
              enrolledCourses: arrayUnion(courseIdField.courseId),
              updatedAt: serverTimestamp(),
            });
          } catch {
            // Não bloqueia matrícula caso o documento de perfil ainda esteja sincronizando
          }
        }

        persistedEnrollment = {
          id: enrollmentId,
          classId: matchedClass.id,
          ...(courseIdField.courseId ? { courseId: courseIdField.courseId } : {}),
          studentId: cleanStudentUid,
          studentName: safeStudentName,
          studentEmail: safeStudentEmail,
          ...(safePhotoUrl ? { studentPhotoUrl: safePhotoUrl } : {}),
          teacherId: matchedClass.teacherId,
          joinedAt: nowIso,
          status: 'active',
          lastActivityAt: nowIso,
        };
      }
    } else {
      // Ambiente offline / testes Node
      const validation = await this.validateInviteCode(cleanCode, cleanStudentUid);
      if (!validation.valid || !validation.classGroup) {
        return {
          success: false,
          message: validation.message,
          error: validation.message,
          classGroup: validation.classGroup,
        };
      }
      matchedClass = validation.classGroup;
    }

    if (!matchedClass) {
      return {
        success: false,
        message: 'Não foi possível localizar os dados da turma.',
        error: 'Turma não encontrada.',
      };
    }

    const nowIso = new Date().toISOString();
    const enrollment: ClassEnrollment = persistedEnrollment || {
      id: `enroll-${matchedClass.id}-${cleanStudentUid}`.slice(0, 128),
      classId: matchedClass.id,
      ...(matchedClass.courseId && VALID_OFFICIAL_COURSES.has(matchedClass.courseId)
        ? { courseId: matchedClass.courseId }
        : {}),
      studentId: cleanStudentUid,
      studentName: safeStudentName,
      studentEmail: safeStudentEmail,
      ...(safePhotoUrl ? { studentPhotoUrl: safePhotoUrl } : {}),
      teacherId: matchedClass.teacherId,
      joinedAt: nowIso,
      status: 'active',
      lastActivityAt: nowIso,
    };

    // Atualiza cache local somente após validação e persistência reais
    const localEnrollments = this.loadLocalEnrollments().filter(isRealEnrollmentRecord);
    const existingIndex = localEnrollments.findIndex(
      (e) => e.studentId === cleanStudentUid && e.classId === matchedClass!.id
    );
    if (existingIndex >= 0) {
      localEnrollments[existingIndex] = enrollment;
    } else {
      localEnrollments.push(enrollment);
    }
    this.saveLocalEnrollments(localEnrollments);

    // Garante que os metadados da turma fiquem em cache local para exibição offline do aluno
    const localClasses = this.loadLocalClasses().filter(isRealClassRecord);
    if (!localClasses.some((c) => c.id === matchedClass!.id)) {
      this.saveLocalClasses([...localClasses, matchedClass]);
    }

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STUDENT_CLASS_LINK_KEY, JSON.stringify(enrollment));
      } catch {}
    }

    return {
      success: true,
      message: `Você ingressou com sucesso na turma "${matchedClass.name}" do Professor ${matchedClass.teacherName}!`,
      classGroup: matchedClass,
    };
  }

  /**
   * Retorna exclusivamente as turmas reais em que o aluno autenticado está matriculado.
   */
  static async getStudentEnrollments(studentUid: string): Promise<StudentEnrolledClassInfo[]> {
    const cleanUid = (studentUid || '').trim();
    if (!cleanUid) return [];

    if (auth.currentUser && auth.currentUser.uid === cleanUid) {
      try {
        const enrQ = query(collection(db, 'enrollments'), where('studentId', '==', cleanUid));
        const snap = await getDocsFromServer(enrQ).catch(() => getDocs(enrQ));
        const realEnrollments = deduplicateRealEnrollments(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClassEnrollment))
        );

        const classDetailsList = await Promise.all(
          realEnrollments.map(async (enr) => {
            try {
              const clsSnap = await getDocFromServer(doc(db, 'classes', enr.classId)).catch(() =>
                getDoc(doc(db, 'classes', enr.classId))
              );
              const clsData = clsSnap.exists() ? clsSnap.data() : null;
              return {
                enrollmentId: enr.id,
                classId: enr.classId,
                className: String(clsData?.name || 'Turma Guitar Academy'),
                classCode: typeof clsData?.code === 'string' ? clsData.code : undefined,
                instrument: formatClassInstrumentLabel(
                  clsData?.courseId || enr.courseId,
                  clsData?.instrument
                ),
                courseId: String(clsData?.courseId || enr.courseId || 'geral'),
                description: typeof clsData?.description === 'string' ? clsData.description : '',
                teacherId: enr.teacherId,
                teacherName:
                  typeof clsData?.teacherName === 'string'
                    ? clsData.teacherName
                    : 'Professor Guitar Academy',
                joinedAt: enr.joinedAt,
                status: enr.status,
                active: clsData ? clsData.active !== false : true,
              } satisfies StudentEnrolledClassInfo;
            } catch {
              return {
                enrollmentId: enr.id,
                classId: enr.classId,
                className: 'Turma Guitar Academy',
                instrument: formatClassInstrumentLabel(enr.courseId),
                courseId: String(enr.courseId || 'geral'),
                teacherId: enr.teacherId,
                joinedAt: enr.joinedAt,
                status: enr.status,
                active: true,
              } satisfies StudentEnrolledClassInfo;
            }
          })
        );

        // Sincroniza matrículas reais do aluno no cache local
        const otherLocal = this.loadLocalEnrollments().filter(
          (e) => e.studentId !== cleanUid && isRealEnrollmentRecord(e)
        );
        this.saveLocalEnrollments([...otherLocal, ...realEnrollments]);

        return classDetailsList;
      } catch {
        // Fallback offline abaixo
      }
    }

    const localClassesMap = new Map(
      this.loadLocalClasses()
        .filter(isRealClassRecord)
        .map((c) => [c.id, c])
    );

    const localEnrollments = deduplicateRealEnrollments(
      this.loadLocalEnrollments().filter((e) => e.studentId === cleanUid)
    );

    return localEnrollments.map((enr) => {
      const cls = localClassesMap.get(enr.classId);
      return {
        enrollmentId: enr.id,
        classId: enr.classId,
        className: cls?.name || 'Turma Guitar Academy',
        classCode: cls?.code,
        instrument: formatClassInstrumentLabel(cls?.courseId || enr.courseId, cls?.instrument),
        courseId: String(cls?.courseId || enr.courseId || 'geral'),
        description: cls?.description || '',
        teacherId: enr.teacherId,
        teacherName: cls?.teacherName || 'Professor Guitar Academy',
        joinedAt: enr.joinedAt,
        status: enr.status,
        active: cls ? cls.active !== false : true,
      };
    });
  }

  /**
   * Retorna exclusivamente os alunos reais matriculados nas turmas do professor.
   * Consulta classes/{classId}/students e enrollments no Firestore, deduplica e filtra inativos/cancelados.
   */
  static async getEnrolledStudents(teacherId: string, classId?: string): Promise<ClassEnrollment[]> {
    if (!teacherId) return [];

    const classes = await this.getTeacherClasses(teacherId);
    const ownedClassIds = new Set(classes.map((c) => c.id));

    if (classId && classId !== 'all' && !ownedClassIds.has(classId)) {
      return [];
    }

    const targetClassIds =
      classId && classId !== 'all' ? [classId] : Array.from(ownedClassIds);

    if (targetClassIds.length === 0) {
      return [];
    }

    if (auth.currentUser) {
      try {
        const gathered: ClassEnrollment[] = [];

        const classSnaps = await Promise.all(
          targetClassIds.map(async (cId) => {
            const colRef = collection(db, 'classes', cId, 'students');
            try {
              return await getDocsFromServer(colRef);
            } catch {
              return await getDocs(colRef);
            }
          })
        );

        const classesById = new Map(classes.map((c) => [c.id, c]));
        const serverSubSnapOk = new Set<string>();
        const subcolActiveUidsByClass = new Map<string, Set<string>>();

        classSnaps.forEach((snap, idx) => {
          const currentClassId = targetClassIds[idx];
          const fromServer = !snap.metadata?.fromCache;
          if (fromServer) {
            serverSubSnapOk.add(currentClassId);
          }
          const activeSet = new Set<string>();
          snap.docs.forEach((d) => {
            const rawData = d.data() || {};
            const raw = { id: d.id, ...rawData } as ClassEnrollment;
            if (!raw.classId) raw.classId = currentClassId;
            if (!raw.studentId) raw.studentId = d.id;
            const statusNorm =
              typeof raw.status === 'string' ? raw.status.trim().toLowerCase() : 'active';
            if (!INACTIVE_ENROLLMENT_STATUSES.has(statusNorm)) {
              activeSet.add(raw.studentId);
            }
            if ((!raw.teacherId || raw.teacherId === teacherId) && raw.classId === currentClassId) {
              gathered.push(raw);
            }
          });
          subcolActiveUidsByClass.set(currentClassId, activeSet);
        });

        try {
          const enrQ = query(collection(db, 'enrollments'), where('teacherId', '==', teacherId));
          const enrSnap = await getDocsFromServer(enrQ).catch(() => getDocs(enrQ));
          enrSnap.docs.forEach((d) => {
            const raw = { id: d.id, ...d.data() } as ClassEnrollment;
            if (ownedClassIds.has(raw.classId) && (!classId || classId === 'all' || raw.classId === classId)) {
              gathered.push(raw);
            }
          });
        } catch {
          // Opcional caso alguma regra restrinja query
        }

        const deduped = deduplicateRealEnrollments(gathered);

        // Reconciliação secundária apenas a partir de snapshot vindo estritamente do servidor (!fromCache)
        targetClassIds.forEach((cId) => {
          if (!serverSubSnapOk.has(cId)) return;
          const clsObj = classesById.get(cId);
          if (!clsObj) return;
          const realSubcolCount = subcolActiveUidsByClass.get(cId)?.size ?? 0;
          const currentValid =
            typeof clsObj.enrolledCount === 'number' &&
            Number.isInteger(clsObj.enrolledCount) &&
            clsObj.enrolledCount >= 0;
          if (!currentValid || clsObj.enrolledCount !== realSubcolCount) {
            updateDoc(doc(db, 'classes', cId), {
              enrolledCount: realSubcolCount,
              updatedAt: serverTimestamp(),
            }).catch(() => {});
          }
        });

        const preservedOther = this.loadLocalEnrollments().filter(
          (e) => e.teacherId !== teacherId && isRealEnrollmentRecord(e)
        );
        this.saveLocalEnrollments([...preservedOther, ...deduped]);
        return deduped;
      } catch {
        // Fallback offline se Firestore estiver inacessível
      }
    }

    const local = this.loadLocalEnrollments().filter((e) => {
      if (!isRealEnrollmentRecord(e)) return false;
      if (e.teacherId !== teacherId) return false;
      if (!ownedClassIds.has(e.classId)) return false;
      if (classId && classId !== 'all' && e.classId !== classId) return false;
      return true;
    });

    return deduplicateRealEnrollments(local);
  }

  /**
   * Registra um evento educacional consistente para fins analíticos
   */
  static logEducationalEvent(
    eventData: Omit<EducationalEvent, 'id' | 'timestamp'>
  ): EducationalEvent {
    const event: EducationalEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
    };

    const events = this.loadLocalEvents();
    // Limite de 500 eventos locais para não sobrecarregar localStorage
    const updated = [event, ...events].slice(0, 500);
    this.saveLocalEvents(updated);

    // Se houver turma associada e usuário autenticado online, envia ao Firestore
    if (event.classId && auth.currentUser) {
      try {
        setDoc(doc(db, 'classes', event.classId, 'events', event.id), {
          ...event,
          createdAt: serverTimestamp(),
        }).catch(() => {});
      } catch {}
    }

    return event;
  }

  /**
   * Obtém lista de eventos educacionais aplicando filtros estritos
   */
  static getFilteredEvents(
    filters: TeacherFilterState,
    enrolledStudents: ClassEnrollment[]
  ): EducationalEvent[] {
    const studentUids = new Set(enrolledStudents.map((s) => s.studentId));
    let allEvents = this.loadLocalEvents().filter((e) => studentUids.has(e.studentUid));

    // Se houver poucos eventos nos logs, enriquece com os eventos derivados dos progressos reais dos alunos
    if (allEvents.length < 10) {
      const derived = this.generateDerivedEventsFromStudents(enrolledStudents);
      allEvents = [...allEvents, ...derived];
    }

    // Filtro por Turma
    if (filters.classId && filters.classId !== 'all') {
      allEvents = allEvents.filter((e) => e.classId === filters.classId);
    }

    // Filtro por Curso
    if (filters.courseId && filters.courseId !== 'all') {
      allEvents = allEvents.filter((e) => e.courseId === filters.courseId);
    }

    // Filtro por Categoria
    if (filters.category && filters.category !== 'all') {
      allEvents = allEvents.filter((e) => e.category === filters.category);
    }

    // Filtro por Aluno
    if (filters.studentId) {
      allEvents = allEvents.filter((e) => e.studentUid === filters.studentId);
    }

    // Filtro por Período
    const now = Date.now();
    let minTimestamp = 0;
    if (filters.period === '7d') {
      minTimestamp = now - 7 * 24 * 60 * 60 * 1000;
    } else if (filters.period === '30d') {
      minTimestamp = now - 30 * 24 * 60 * 60 * 1000;
    } else if (filters.period === '90d') {
      minTimestamp = now - 90 * 24 * 60 * 60 * 1000;
    } else if (filters.period === 'custom' && filters.startDate) {
      minTimestamp = new Date(filters.startDate).getTime();
    }

    if (minTimestamp > 0) {
      allEvents = allEvents.filter((e) => new Date(e.timestamp).getTime() >= minTimestamp);
    }

    if (filters.period === 'custom' && filters.endDate) {
      const maxTimestamp = new Date(filters.endDate).getTime() + 24 * 60 * 60 * 1000;
      allEvents = allEvents.filter((e) => new Date(e.timestamp).getTime() <= maxTimestamp);
    }

    return allEvents;
  }

  /**
   * Constrói tabela analítica com denominadores matemáticos explícitos
   */
  static buildAnalyticsTable(
    events: EducationalEvent[],
    totalEligibleStudents: number
  ): AnalyticsTableRow[] {
    const totalEventsCount = events.length;
    if (totalEventsCount === 0) return [];

    // Agrupa por categoria
    const categoryMap = new Map<string, { events: EducationalEvent[]; students: Set<string> }>();

    events.forEach((evt) => {
      const key = evt.category;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, { events: [], students: new Set() });
      }
      const item = categoryMap.get(key)!;
      item.events.push(evt);
      item.students.add(evt.studentUid);
    });

    const categoryLabels: Record<ActivityCategory, string> = {
      instrumental_practice: 'Prática Instrumental (Violão/Guitarra)',
      guided_lessons: 'Aulas Teórico-Práticas Guiadas',
      music_theory: 'Teoria Musical & Intervalos',
      technique_mechanics: 'Técnica & Mecânica dos Dedos',
      chords_harmony: 'Harmonia & Dicionário de Acordes',
      repertoire_ear: 'Treino Auditivo & Leitura',
    };

    const rows: AnalyticsTableRow[] = [];

    categoryMap.forEach((val, catKey) => {
      const occurrences = val.events.length;
      const studentsCount = val.students.size;
      const percentage = (occurrences / totalEventsCount) * 100;

      const verifiedCount = val.events.filter((e) => e.measurementType === 'verified_interactive').length;
      const manualCount = val.events.filter((e) => e.measurementType === 'manual_logged').length;
      const verifiedTimeSeconds = val.events
        .filter((e) => e.measurementType === 'verified_interactive')
        .reduce((acc, e) => acc + (e.durationSeconds || 0), 0);
      const manualTimeSeconds = val.events
        .filter((e) => e.measurementType === 'manual_logged')
        .reduce((acc, e) => acc + (e.durationSeconds || 0), 0);

      rows.push({
        categoryOrActivity: categoryLabels[catKey as ActivityCategory] || catKey,
        category: catKey as ActivityCategory,
        course: val.events[0]?.courseId ? (val.events[0].courseId === 'violao' ? 'Violão' : val.events[0].courseId === 'solo' ? 'Guitarra Solo' : 'Conservatório Geral') : 'Geral',
        module: 'Módulos Integrados',
        lessonOrExercise: `${val.events.length} ações registradas`,
        occurrenceCount: occurrences,
        studentsInvolvedCount: studentsCount,
        percentage: Number(percentage.toFixed(1)),
        denominatorDescription: `Total de ${totalEventsCount} eventos válidos no período`,
        denominatorTotal: totalEventsCount,
        verifiedCount,
        manualCount,
        verifiedTimeSeconds,
        manualTimeSeconds,
        trend: occurrences >= 5 ? 'up' : 'stable',
      });
    });

    return rows.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  }

  /**
   * Calcula funil e métricas de etapas dos cursos
   */
  static buildCourseFunnel(
    enrolledOrCourseId: ClassEnrollment[] | 'violao' | 'canonical' | 'solo' | 'baixo' | 'teclado' | 'bateria' | string,
    courseIdOrEnrollments?: 'violao' | 'canonical' | 'solo' | 'baixo' | 'teclado' | 'bateria' | string | any,
    _optionalEvents?: EducationalEvent[]
  ): CourseFunnelRow[] {
    let courseId: 'violao' | 'canonical' | 'solo' | 'baixo' | 'teclado' | 'bateria' | string = 'violao';
    let enrolledStudents: ClassEnrollment[] = [];

    if (typeof enrolledOrCourseId === 'string') {
      courseId = enrolledOrCourseId as any;
      if (Array.isArray(courseIdOrEnrollments)) {
        enrolledStudents = courseIdOrEnrollments;
      } else {
        enrolledStudents = this.loadLocalEnrollments().filter(isRealEnrollmentRecord);
      }
    } else {
      enrolledStudents = Array.isArray(enrolledOrCourseId) ? enrolledOrCourseId : [];
      courseId = (typeof courseIdOrEnrollments === 'string' ? courseIdOrEnrollments : 'violao') as any;
    }

    const allCourseLessons = getAllLessons().filter((l) => {
      if (courseId === 'violao') return l.id.startsWith('violao-');
      if (courseId === 'solo') return l.id.startsWith('solo-');
      if (courseId === 'baixo') return l.id.startsWith('baixo-');
      if (courseId === 'teclado') return l.id.startsWith('teclado-');
      if (courseId === 'bateria') return l.id.startsWith('bateria-');
      return !l.id.startsWith('violao-') && !l.id.startsWith('solo-') && !l.id.startsWith('baixo-') && !l.id.startsWith('teclado-') && !l.id.startsWith('bateria-');
    });

    // Mapeia o progresso de cada aluno
    const studentProgresses = enrolledStudents.map((s) => storageService.loadProgress((s as any).studentId || (s as any).studentUid || ''));

    const rows: CourseFunnelRow[] = allCourseLessons.map((lesson) => {
      const completedStudents = studentProgresses.filter((p) => p.completedLessons.includes(lesson.id)).length;
      const startedStudents = studentProgresses.filter(
        (p) => p.completedLessons.includes(lesson.id) || (p.practiceLogs && p.practiceLogs[lesson.id])
      ).length;

      // Abandonou: iniciou a aula mas não concluiu
      const droppedStudents = Math.max(0, startedStudents - completedStudents);

      const completionRate = startedStudents > 0 ? (completedStudents / startedStudents) * 100 : 0;
      const dropRate = startedStudents > 0 ? (droppedStudents / startedStudents) * 100 : 0;

      return {
        courseId,
        courseTitle:
          courseId === 'violao' ? 'Domínio Total do Violão' :
          courseId === 'solo' ? 'Guitarra Solo' :
          courseId === 'baixo' ? 'Contrabaixo Elétrico' :
          courseId === 'teclado' ? 'Teclado / Piano' :
          courseId === 'bateria' ? 'Bateria e Prática Rítmica' :
          'Conservatório Geral',
        moduleId: lesson.moduleTitle || 'Módulo Geral',
        moduleTitle: lesson.moduleTitle || 'Fundamentos',
        lessonId: lesson.id,
        lessonTitle: `${lesson.lessonNumber ? `Aula ${lesson.lessonNumber}: ` : ''}${lesson.title}`,
        lessonNumber: lesson.lessonNumber || (parseInt(lesson.id.replace(/\D/g, ''), 10) || 1),
        startedCount: startedStudents,
        completedCount: completedStudents,
        droppedCount: droppedStudents,
        completionRate: Number(completionRate.toFixed(1)),
        dropRate: Number(dropRate.toFixed(1)),
        affectedStudentsCount: droppedStudents,
      };
    });

    return rows;
  }

  /**
   * Gera diagnósticos de gargalos pedagógicos explicáveis (Fase 7)
   */
  static detectPedagogicalBottlenecks(
    funnelRows: any[],
    enrolledOrEvents?: number | any
  ): PedagogicalBottleneck[] {
    const bottlenecks: PedagogicalBottleneck[] = [];
    const count =
      typeof enrolledOrEvents === 'number'
        ? enrolledOrEvents
        : Array.isArray(enrolledOrEvents)
        ? enrolledOrEvents.length
        : 0;

    // 1. Gargalos por alta taxa de abandono na aula (>= 30% dos que iniciaram)
    const highDropLessons = funnelRows.filter((r) => {
      const dropRate = r.dropRatePct !== undefined ? r.dropRatePct : r.dropRate !== undefined ? r.dropRate : 0;
      const started = r.startedStudents !== undefined ? r.startedStudents : r.startedCount !== undefined ? r.startedCount : 0;
      return started >= 2 && dropRate >= 30;
    });

    highDropLessons.slice(0, 3).forEach((row) => {
      const dropRateVal = row.dropRatePct !== undefined ? row.dropRatePct : row.dropRate;
      const started = row.startedStudents !== undefined ? row.startedStudents : row.startedCount || 1;
      const completed = row.masteredStudents !== undefined ? row.masteredStudents : row.completedCount || 0;
      const dropped = row.droppedCount !== undefined ? row.droppedCount : Math.max(0, started - completed);

      bottlenecks.push({
        id: `btn-drop-${row.lessonId}`,
        severity: dropRateVal >= 50 ? 'high' : 'medium',
        title: `Alta retenção na etapa: ${row.lessonTitle}`,
        observedFact: `${dropped} de ${started} alunos (${dropRateVal}%) iniciaram esta aula mas ainda não alcançaram o critério de conclusão.`,
        pedagogicalHypothesis:
          'A mudança de digitação de acordes com pestana ou o salto de andamento no metrônomo exigem mais tempo de adaptação mecânica da mão esquerda.',
        interventionSuggestion:
          'Dedicar 10 minutos na próxima aula coletiva para treino de micro-movimentos e redução de tensão no polegar esquerdo a 60 BPM.',
        affectedCourseId: row.courseId || 'violao',
        affectedLessonId: row.lessonId,
        affectedStudentsCount: dropped,
        metricValue: `${dropRateVal}% de abandono`,
      });
    });

    // 2. Gargalo de equilíbrio teoria vs prática
    const localEvents = this.loadLocalEvents();
    const theoryCount = localEvents.filter((e) => e.category === 'music_theory').length;
    const practiceCount = localEvents.filter((e) => e.category === 'instrumental_practice').length;

    if (practiceCount > 0 && theoryCount > practiceCount * 2) {
      bottlenecks.push({
        id: 'btn-imbalance-theory',
        severity: 'medium',
        title: 'Desequilíbrio entre Estudo Teórico e Execução Instrumental',
        observedFact: `A turma registrou ${theoryCount} consultas de teoria contra apenas ${practiceCount} sessões ativas com metrônomo no período.`,
        pedagogicalHypothesis:
          'Os alunos estão compreendendo os conceitos analiticamente, mas não estão aplicando fisicamente no braço com rotinas guiadas.',
        interventionSuggestion:
          'Recomendar a Central de Prática diária com o plano estruturado de 15 minutos com foco em arpejos e digitação.',
        affectedCourseId: 'all',
        affectedStudentsCount: count,
        metricValue: `${Math.round((practiceCount / (theoryCount + practiceCount || 1)) * 100)}% de prática`,
      });
    }

    // 3. Gargalo de revisão espaçada
    const revisionEvents = localEvents.filter((e) => e.eventType === 'revision_completed');
    if (revisionEvents.length === 0 && count > 0) {
      bottlenecks.push({
        id: 'btn-low-revision',
        severity: 'low',
        title: 'Baixa Frequência de Revisão Espaçada',
        observedFact: 'Nenhum ciclo de revisão de conteúdos de módulos anteriores foi concluído nos últimos 14 dias.',
        pedagogicalHypothesis:
          'Sem revisões cíclicas a cada 7 e 14 dias, a curva de esquecimento reduz a retenção de intervalos e formas do sistema CAGED.',
        interventionSuggestion:
          'Ativar o gatilho de revisão rápida de 5 minutos no início de cada sessão na Central de Prática.',
        affectedCourseId: 'all',
        affectedStudentsCount: count,
        metricValue: '0 revisões',
      });
    }

    return bottlenecks;
  }

  /**
   * Constrói resumo individual de cada aluno vinculado
   */
  static getStudentSummaries(
    enrolledStudents?: ClassEnrollment[] | string,
    classes?: ClassGroup[]
  ): StudentAnalyticsSummary[] {
    let studentList: ClassEnrollment[] = [];
    if (typeof enrolledStudents === 'string') {
      studentList = this.loadLocalEnrollments()
        .filter(isRealEnrollmentRecord)
        .filter((e) => enrolledStudents === 'all' || e.classId === enrolledStudents);
    } else if (Array.isArray(enrolledStudents)) {
      studentList = enrolledStudents.filter(isRealEnrollmentRecord);
    } else {
      studentList = this.loadLocalEnrollments().filter(isRealEnrollmentRecord);
    }
    const classList = classes || this.loadLocalClasses().filter(isRealClassRecord);
    const classMap = new Map(classList.map((c) => [c.id, c.name]));
    const totalCatalogLessons = getAllLessons().length;
    const sevenDaysAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return studentList.map((student) => {
      const progress: UserProgress = storageService.loadProgress(student.studentId);
      const className = classMap.get(student.classId) || student.classId || 'Turma não informada';

      const totalSec = progress.totalStudyTimeSeconds || 0;
      const manualSec = (progress.manualPracticeLogs || []).reduce(
        (acc, l) => acc + (l.durationMinutes || 0) * 60,
        0
      );
      const verifiedSec = Math.max(0, totalSec - manualSec);

      const profile = progress.pedagogicalProfile;
      let evaluatedCount = 0;
      let proficientCount = 0;
      if (profile && profile.skills) {
        Object.values(profile.skills).forEach((s) => {
          if (s.evidences && s.evidences.length > 0) {
            evaluatedCount++;
            if (s.masteryScore && s.masteryScore >= 75) {
              proficientCount++;
            }
          }
        });
      }

      const activeCoursesList: string[] = [];
      const completed = progress.completedLessons || [];
      if (completed.some((id) => id.startsWith('violao-'))) activeCoursesList.push('Violão');
      if (completed.some((id) => id.startsWith('solo-'))) activeCoursesList.push('Guitarra Solo');
      if (completed.some((id) => id.startsWith('baixo-'))) activeCoursesList.push('Contrabaixo');
      if (completed.some((id) => id.startsWith('teclado-'))) activeCoursesList.push('Teclado & Piano');
      if (completed.some((id) => id.startsWith('bateria-'))) activeCoursesList.push('Bateria');
      if (completed.some((id) => id.startsWith('lesson-'))) activeCoursesList.push('Conservatório');

      // Frequência semanal real calculada por datas distintas de estudo nos últimos 7 dias
      const recentStudyDates = new Set<string>();
      (progress.practiceSessions || []).forEach((sess) => {
        if (sess?.date && new Date(sess.date).getTime() >= sevenDaysAgoMs) {
          recentStudyDates.add(sess.date.slice(0, 10));
        }
      });
      (progress.manualPracticeLogs || []).forEach((log) => {
        if (log?.date && new Date(log.date).getTime() >= sevenDaysAgoMs) {
          recentStudyDates.add(log.date.slice(0, 10));
        }
      });
      if (progress.lastStudyDate && new Date(progress.lastStudyDate).getTime() >= sevenDaysAgoMs) {
        recentStudyDates.add(progress.lastStudyDate.slice(0, 10));
      }

      return {
        studentUid: student.studentId,
        studentName: student.studentName,
        studentEmail: student.studentEmail,
        studentPhotoUrl: student.studentPhotoUrl,
        classId: student.classId,
        className,
        joinedAt: student.joinedAt,
        lastActivityAt: student.lastActivityAt || progress.lastStudyDate || student.joinedAt,
        totalStudyTimeSeconds: totalSec,
        verifiedInteractiveSeconds: verifiedSec,
        manualLoggedSeconds: manualSec,
        completedLessonsCount: completed.length,
        activeCourses: activeCoursesList,
        currentLessons: progress.courseLastLesson || {},
        studyFrequencyDaysPerWeek: recentStudyDates.size,
        practicedBpmMax: progress.practicedBpm || 0,
        pendingActivitiesCount: Math.max(0, totalCatalogLessons - completed.length),
        evaluatedSkillsCount: evaluatedCount,
        unevaluatedSkillsCount: Math.max(0, 21 - evaluatedCount),
        skillsProficientCount: proficientCount,
      };
    });
  }

  /**
   * Exporta relatórios analíticos em formato CSV (Fase 10)
   */
  static exportReportToCsv(
    reportType: 'class_overview' | 'students' | 'activities' | 'bottlenecks',
    data: any[],
    className: string = 'Guitar_Academy'
  ): { success: boolean; filename: string; csvContent: string } {
    let csvContent = '';
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `relatorio_${reportType}_${className}_${dateStr}.csv`;

    if (reportType === 'students') {
      csvContent += 'Nome,Email,Turma,Data Ingresso,Ultima Atividade,Tempo Total (min),Tempo Verificado (min),Tempo Manual (min),Aulas Concluidas,BPM Maximo,Habilidades Avaliadas\n';
      data.forEach((s: StudentAnalyticsSummary) => {
        csvContent += `"${s.studentName}","${s.studentEmail}","${s.className}","${s.joinedAt.split('T')[0]}","${s.lastActivityAt.split('T')[0]}",${Math.round(s.totalStudyTimeSeconds / 60)},${Math.round(s.verifiedInteractiveSeconds / 60)},${Math.round(s.manualLoggedSeconds / 60)},${s.completedLessonsCount},${s.practicedBpmMax},${s.evaluatedSkillsCount}\n`;
      });
    } else if (reportType === 'activities') {
      csvContent += 'Categoria,Curso,Modulo,Qtd Eventos,Alunos Envolvidos,Percentual,Denominador\n';
      data.forEach((r: AnalyticsTableRow) => {
        csvContent += `"${r.categoryOrActivity}","${r.course}","${r.module}",${r.occurrenceCount},${r.studentsInvolvedCount},${r.percentage}%,"${r.denominatorDescription}"\n`;
      });
    } else if (reportType === 'bottlenecks') {
      csvContent += 'Gravidade,Titulo,Fato Observado,Hipotese Pedagogica,Sugestao Intervencao,Alunos Afetados,Metrica\n';
      data.forEach((b: PedagogicalBottleneck) => {
        csvContent += `"${b.severity.toUpperCase()}","${b.title}","${b.observedFact}","${b.pedagogicalHypothesis}","${b.interventionSuggestion}",${b.affectedStudentsCount},"${b.metricValue}"\n`;
      });
    } else {
      // Class overview
      csvContent += 'Metrica,Valor,Observacao\n';
      csvContent += `"Total de Alunos Vinculados",${data.length},"Registrados na turma"\n`;
      csvContent += `"Data do Relatorio","${dateStr}","Exportacao autorizada pelo Professor"\n`;
    }

    if (typeof window !== 'undefined' && typeof Blob !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    return { success: true, filename, csvContent };
  }

  // --- MÉTODOS AUXILIARES DE PERSISTÊNCIA LOCAL ---

  private static loadLocalClasses(): ClassGroup[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(LOCAL_CLASSES_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.filter(isRealClassRecord) : [];
    } catch {
      return [];
    }
  }

  private static saveLocalClasses(classes: ClassGroup[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_CLASSES_KEY, JSON.stringify(classes.filter(isRealClassRecord)));
    } catch {}
  }

  private static loadLocalEnrollments(): ClassEnrollment[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.filter(isRealEnrollmentRecord) : [];
    } catch {
      return [];
    }
  }

  private static saveLocalEnrollments(enrollments: ClassEnrollment[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(
        LOCAL_ENROLLMENTS_KEY,
        JSON.stringify(enrollments.filter(isRealEnrollmentRecord))
      );
    } catch {}
  }

  private static loadLocalEvents(): EducationalEvent[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(LOCAL_EVENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static saveLocalEvents(events: EducationalEvent[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
    } catch {}
  }

  /**
   * Deriva eventos analíticos exclusivamente dos registros de estudo reais dos alunos
   */
  private static generateDerivedEventsFromStudents(students: ClassEnrollment[]): EducationalEvent[] {
    const events: EducationalEvent[] = [];
    const now = Date.now();

    students.forEach((s, idx) => {
      const progress = storageService.loadProgress(s.studentId);
      const studentClass = s.classId;

      progress.completedLessons.forEach((lessonId, lIdx) => {
        const courseId = lessonId.startsWith('violao-')
          ? 'violao'
          : lessonId.startsWith('solo-')
          ? 'solo'
          : lessonId.startsWith('baixo-')
          ? 'baixo'
          : lessonId.startsWith('teclado-')
          ? 'teclado'
          : lessonId.startsWith('bateria-')
          ? 'bateria'
          : 'canonical';
        events.push({
          id: `evt-derived-${s.studentId}-${lessonId}`,
          studentUid: s.studentId,
          studentName: s.studentName,
          studentEmail: s.studentEmail,
          classId: studentClass,
          courseId,
          lessonId,
          eventType: 'lesson_completed',
          category: 'guided_lessons',
          durationSeconds: 1200,
          measurementType: 'verified_interactive',
          timestamp: new Date(now - (lIdx + 1) * 24 * 60 * 60 * 1000).toISOString(),
        });
      });

      if (progress.totalStudyTimeSeconds > 0) {
        events.push({
          id: `evt-derived-practice-${s.studentId}`,
          studentUid: s.studentId,
          studentName: s.studentName,
          studentEmail: s.studentEmail,
          classId: studentClass,
          courseId: progress.primaryCourseId || 'violao',
          eventType: 'practice_session_recorded',
          category: 'instrumental_practice',
          durationSeconds: progress.totalStudyTimeSeconds,
          measurementType: 'verified_interactive',
          timestamp: new Date(now - (idx + 1) * 36 * 60 * 60 * 1000).toISOString(),
        });
      }
    });

    return events;
  }
}
