// =========================================================================
// GUITAR ACADEMY — MOTOR CENTRAL DE AUTORIZAÇÃO ACADÊMICA (ISOMÓRFICO)
// src/services/accessAuthorizationEngine.ts
// Resolve o acesso efetivo por curso, módulo e aula unificando todas as
// origens legítimas sem sobrescrita destrutiva e preservando progresso.
// =========================================================================

import type { UserProgress } from '../types';
import type { StudentEnrolledClassInfo } from '../types/teacher';
import {
  OfficialCourseId,
  COURSE_METADATA_MAP,
  calculateCourseProgress,
  getPrimaryCourseId,
  isCourseUnlocked as isProgressCourseUnlocked,
} from '../academia/progress/unlockGate';
import {
  ACADEMIC_CATALOG_COURSES,
  VALID_COURSE_IDS,
  getCatalogCourse,
  getCatalogLesson,
  getCatalogModule,
} from './academicCatalog';
import type {
  AccessGrantStatus,
  AccessResolutionSource,
  CourseAccessGrant,
  EffectiveCourseAccess,
  EffectiveGrantOrigin,
  EffectiveLessonAccess,
  EffectiveModuleAccess,
  ExternalCourseEntitlement,
  ResolvedInitialPlacement,
  StudentAcademicPlacement,
  StudentEffectiveAccessSnapshot,
} from '../types/accessControl';

export const ACCESS_SOURCE_PRIORITY: readonly AccessResolutionSource[] = [
  'admin_role',
  'admin_special',
  'admin_temporary',
  'admin_trial',
  'admin_permanent',
  'purchase',
  'subscription',
  'enrollment',
  'progress_primary',
  'progress_merit_50',
] as const;

export const ACCESS_SOURCE_LABELS: Record<AccessResolutionSource, string> = {
  admin_role: 'Perfil Administrador',
  admin_special: 'Liberação Administrativa Especial',
  admin_temporary: 'Acesso Gratuito Temporário',
  admin_trial: 'Acesso Experimental',
  admin_permanent: 'Gratuito Permanente (Admin)',
  purchase: 'Compra Individual',
  subscription: 'Assinatura Ativa',
  enrollment: 'Matrícula em Turma',
  progress_primary: 'Curso Principal do Aluno',
  progress_merit_50: 'Mérito Acadêmico (50% Concluído)',
};

function getSourceRank(source: AccessResolutionSource): number {
  const idx = ACCESS_SOURCE_PRIORITY.indexOf(source);
  return idx === -1 ? 999 : idx;
}

export function pickPrimarySource(origins: EffectiveGrantOrigin[]): AccessResolutionSource | null {
  if (origins.length === 0) return null;
  let best = origins[0].source;
  let bestRank = getSourceRank(best);
  for (let i = 1; i < origins.length; i++) {
    const rank = getSourceRank(origins[i].source);
    if (rank < bestRank) {
      best = origins[i].source;
      bestRank = rank;
    }
  }
  return best;
}

function parseOptionalTimeMs(isoValue?: string | null, msValue?: number | null): number | null {
  if (typeof msValue === 'number' && Number.isFinite(msValue)) {
    return msValue;
  }
  if (typeof isoValue === 'string' && isoValue.trim()) {
    const parsed = Date.parse(isoValue);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
}

export function evaluateGrantStatus(
  grant: CourseAccessGrant,
  nowMs: number = Date.now()
): { active: boolean; effectiveStatus: AccessGrantStatus; reason?: string } {
  if (grant.status === 'revoked') {
    return { active: false, effectiveStatus: 'revoked', reason: 'Concessão revogada pelo administrador.' };
  }
  if (grant.status === 'suspended') {
    return { active: false, effectiveStatus: 'suspended', reason: 'Concessão temporariamente suspensa.' };
  }
  if (grant.status === 'expired') {
    return { active: false, effectiveStatus: 'expired', reason: 'Prazo da concessão encerrado.' };
  }

  const startsAtMs = parseOptionalTimeMs(grant.startsAt, grant.startsAtMs);
  if (startsAtMs !== null && nowMs < startsAtMs) {
    return { active: false, effectiveStatus: 'active', reason: 'A concessão ainda não atingiu a data de início.' };
  }

  const expiresAtMs = parseOptionalTimeMs(grant.expiresAt, grant.expiresAtMs);
  if (expiresAtMs !== null && nowMs > expiresAtMs) {
    return { active: false, effectiveStatus: 'expired', reason: 'O período de acesso gratuito expirou.' };
  }

  return { active: true, effectiveStatus: 'active' };
}

function isEntitlementActive(ent: ExternalCourseEntitlement, nowMs: number): boolean {
  if (ent.status !== 'active') return false;
  const expiresAtMs = parseOptionalTimeMs(ent.expiresAt, ent.expiresAtMs);
  if (expiresAtMs !== null && nowMs > expiresAtMs) return false;
  return true;
}

function doesGrantApplyToCourse(grant: CourseAccessGrant, courseId: OfficialCourseId): boolean {
  const course = ACADEMIC_CATALOG_COURSES[courseId];
  if (!course) return false;
  if (grant.scopeType === 'instrument') {
    return grant.instrumentId === course.instrumentId;
  }
  return grant.courseId === courseId;
}

function mapGrantSourceToResolution(grant: CourseAccessGrant): AccessResolutionSource {
  switch (grant.grantType) {
    case 'special':
      return 'admin_special';
    case 'temporary':
      return 'admin_temporary';
    case 'trial':
      return 'admin_trial';
    case 'permanent':
    default:
      return 'admin_permanent';
  }
}

function deduplicateOrigins(origins: EffectiveGrantOrigin[]): EffectiveGrantOrigin[] {
  const seen = new Set<string>();
  const out: EffectiveGrantOrigin[] = [];
  for (const origin of origins) {
    const key = `${origin.source}::${origin.grantId || ''}::${origin.scopeType || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(origin);
    }
  }
  return out.sort((a, b) => getSourceRank(a.source) - getSourceRank(b.source));
}

export interface ResolveStudentAccessInput {
  studentUid: string;
  isAdminUser?: boolean;
  nowMs?: number;
  progress?: UserProgress | null;
  grants?: CourseAccessGrant[];
  enrollments?: Array<Pick<StudentEnrolledClassInfo, 'courseId' | 'status' | 'classId' | 'className'>>;
  entitlements?: ExternalCourseEntitlement[];
  placements?: StudentAcademicPlacement[];
}

export function resolveStudentAccessSnapshot(
  input: ResolveStudentAccessInput
): StudentEffectiveAccessSnapshot {
  const nowMs = input.nowMs ?? Date.now();
  const progress = input.progress || null;
  const studentGrants = (input.grants || []).filter(
    (g) => !g.studentUid || g.studentUid === input.studentUid
  );
  const enrollments = input.enrollments || [];
  const entitlements = input.entitlements || [];
  const placements = (input.placements || []).filter(
    (p) => !p.studentUid || p.studentUid === input.studentUid
  );

  const primaryCourseId = getPrimaryCourseId(progress);
  const primaryProg = calculateCourseProgress(primaryCourseId, progress);
  const merit50Unlocked = isProgressCourseUnlocked('canonical', progress) && primaryProg.isFiftyPercentReached
    ? true
    : VALID_COURSE_IDS.some((cId) => calculateCourseProgress(cId, progress).isFiftyPercentReached);

  const activeGrants: CourseAccessGrant[] = [];
  const inactiveGrants: Array<CourseAccessGrant & { effectiveStatus: AccessGrantStatus }> = [];

  for (const grant of studentGrants) {
    const evalRes = evaluateGrantStatus(grant, nowMs);
    if (evalRes.active) {
      activeGrants.push(grant);
    } else {
      inactiveGrants.push({
        ...grant,
        effectiveStatus: evalRes.effectiveStatus,
      });
    }
  }

  const courses = {} as Record<OfficialCourseId, EffectiveCourseAccess>;

  for (const courseId of VALID_COURSE_IDS) {
    const courseCatalog = ACADEMIC_CATALOG_COURSES[courseId];
    const courseLevelOrigins: EffectiveGrantOrigin[] = [];

    // 1. Perfil Admin (apenas quando flag explícita de admin for passada)
    if (input.isAdminUser) {
      courseLevelOrigins.push({
        source: 'admin_role',
        label: ACCESS_SOURCE_LABELS.admin_role,
      });
    }

    // 2. Origens de progresso & regra dos 50% (preservada integralmente)
    if (courseId === primaryCourseId) {
      courseLevelOrigins.push({
        source: 'progress_primary',
        label: ACCESS_SOURCE_LABELS.progress_primary,
      });
    } else if (merit50Unlocked) {
      courseLevelOrigins.push({
        source: 'progress_merit_50',
        label: ACCESS_SOURCE_LABELS.progress_merit_50,
      });
    }

    // 3. Matrículas em turmas com courseId correspondente
    for (const enr of enrollments) {
      const enrStatus = String(enr.status || 'active').toLowerCase();
      const isValidEnrollment = enrStatus === 'active' || enrStatus === 'approved';
      if (isValidEnrollment && enr.courseId === courseId) {
        courseLevelOrigins.push({
          source: 'enrollment',
          label: `${ACCESS_SOURCE_LABELS.enrollment}${enr.className ? ` (${enr.className})` : ''}`,
          grantId: enr.classId,
        });
      }
    }

    // 4. Compras / Assinaturas independentes (nunca sobrescrevem concessões gratuitas e vice-versa)
    for (const ent of entitlements) {
      if (ent.courseId === courseId && isEntitlementActive(ent, nowMs)) {
        const src: AccessResolutionSource = ent.type === 'subscription' ? 'subscription' : 'purchase';
        courseLevelOrigins.push({
          source: src,
          label: ACCESS_SOURCE_LABELS[src],
          grantId: ent.id || ent.referenceId || undefined,
          expiresAt: ent.expiresAt ?? null,
          expiresAtMs: parseOptionalTimeMs(ent.expiresAt, ent.expiresAtMs),
        });
      }
    }

    // 5. Concessões administrativas ativas para curso ou instrumento
    const courseActiveGrants = activeGrants.filter((g) => doesGrantApplyToCourse(g, courseId));
    const partialModuleOrigins = new Map<string, EffectiveGrantOrigin[]>();
    const partialLessonOrigins = new Map<string, EffectiveGrantOrigin[]>();

    for (const grant of courseActiveGrants) {
      const origin: EffectiveGrantOrigin = {
        source: mapGrantSourceToResolution(grant),
        label: ACCESS_SOURCE_LABELS[mapGrantSourceToResolution(grant)],
        grantId: grant.id,
        scopeType: grant.scopeType,
        expiresAt: grant.expiresAt ?? null,
        expiresAtMs: parseOptionalTimeMs(grant.expiresAt, grant.expiresAtMs),
        reason: grant.reason ?? null,
      };

      if (grant.scopeType === 'course' || grant.scopeType === 'instrument') {
        courseLevelOrigins.push(origin);
      } else if (grant.scopeType === 'module' && grant.moduleId) {
        const existing = partialModuleOrigins.get(grant.moduleId) || [];
        existing.push(origin);
        partialModuleOrigins.set(grant.moduleId, existing);
      } else if (grant.scopeType === 'lesson' && grant.lessonId) {
        const existing = partialLessonOrigins.get(grant.lessonId) || [];
        existing.push(origin);
        partialLessonOrigins.set(grant.lessonId, existing);
      } else if (grant.scopeType === 'lesson_range') {
        const lessonIds = Array.isArray(grant.lessonIds) ? grant.lessonIds : [];
        for (const lid of lessonIds) {
          const existing = partialLessonOrigins.get(lid) || [];
          existing.push(origin);
          partialLessonOrigins.set(lid, existing);
        }
      }
    }

    const dedupedCourseOrigins = deduplicateOrigins(courseLevelOrigins);
    const fullCourseUnlocked = dedupedCourseOrigins.length > 0;

    const modulesRecord: Record<string, EffectiveModuleAccess> = {};
    const lessonsRecord: Record<string, EffectiveLessonAccess> = {};
    const unlockedModuleIds: string[] = [];
    const unlockedLessonIds: string[] = [];
    const allContributingOrigins: EffectiveGrantOrigin[] = [...dedupedCourseOrigins];

    for (const mod of courseCatalog.modules) {
      const modOrigins = deduplicateOrigins([
        ...dedupedCourseOrigins,
        ...(partialModuleOrigins.get(mod.id) || []),
      ]);
      const fullModuleUnlocked = modOrigins.length > 0;
      const modUnlockedLessons: string[] = [];

      for (const lesson of mod.lessons) {
        const lessonOrigins = deduplicateOrigins([
          ...modOrigins,
          ...(partialLessonOrigins.get(lesson.id) || []),
        ]);
        const allowed = lessonOrigins.length > 0;
        if (allowed) {
          modUnlockedLessons.push(lesson.id);
          unlockedLessonIds.push(lesson.id);
          allContributingOrigins.push(...lessonOrigins);
        }

        lessonsRecord[lesson.id] = {
          lessonId: lesson.id,
          courseId,
          moduleId: mod.id,
          allowed,
          primarySource: pickPrimarySource(lessonOrigins),
          origins: lessonOrigins,
          blockedReason: allowed
            ? undefined
            : `Aula bloqueada: requer liberação administrativa ou 50% de conclusão em ${COURSE_METADATA_MAP[primaryCourseId].name}.`,
        };
      }

      const hasAnyLessonUnlocked = modUnlockedLessons.length > 0;
      if (fullModuleUnlocked || hasAnyLessonUnlocked) {
        unlockedModuleIds.push(mod.id);
      }

      modulesRecord[mod.id] = {
        moduleId: mod.id,
        courseId,
        moduleNumber: mod.moduleNumber,
        fullModuleUnlocked,
        hasAnyLessonUnlocked,
        unlockedLessonIds: modUnlockedLessons,
        primarySource: pickPrimarySource(modOrigins),
        origins: modOrigins,
      };
    }

    const mergedCourseOrigins = deduplicateOrigins(allContributingOrigins);
    const hasAnyAccess = fullCourseUnlocked || unlockedLessonIds.length > 0;

    let lockReason: string | undefined;
    if (!fullCourseUnlocked) {
      // Verifica se havia alguma concessão inativa específica para fornecer mensagem fiel
      const expiredCourseGrant = inactiveGrants.find(
        (g) => doesGrantApplyToCourse(g, courseId) && g.effectiveStatus === 'expired'
      );
      const revokedOrSuspendedGrant = inactiveGrants.find(
        (g) =>
          doesGrantApplyToCourse(g, courseId) &&
          (g.effectiveStatus === 'revoked' || g.effectiveStatus === 'suspended')
      );

      if (hasAnyAccess) {
        lockReason = `Acesso parcial liberado (${unlockedLessonIds.length} de ${courseCatalog.totalLessons} aulas disponíveis).`;
      } else if (expiredCourseGrant) {
        lockReason = `O período de acesso gratuito a ${courseCatalog.title} expirou. Progresso necessário no curso principal: ${primaryProg.progressPercentage}% / 50.0%.`;
      } else if (revokedOrSuspendedGrant) {
        lockReason = `Acesso especial a ${courseCatalog.title} ${revokedOrSuspendedGrant.effectiveStatus === 'suspended' ? 'suspenso' : 'revogado'}. Requer 50% de conclusão em ${COURSE_METADATA_MAP[primaryCourseId].name} (${primaryProg.progressPercentage}% atual).`;
      } else {
        lockReason = `O curso completo de ${courseCatalog.title} será desbloqueado automaticamente ao atingir 50% em ${COURSE_METADATA_MAP[primaryCourseId].name} (${primaryProg.progressPercentage}% atual) ou por liberação administrativa.`;
      }
    }

    courses[courseId] = {
      courseId,
      fullCourseUnlocked,
      hasAnyAccess,
      unlockedModuleIds,
      unlockedLessonIds,
      primarySource: pickPrimarySource(mergedCourseOrigins),
      origins: mergedCourseOrigins,
      lockReason,
      lessons: lessonsRecord,
      modules: modulesRecord,
    };
  }

  // Resolver Direcionamentos Iniciais ativos e válidos no catálogo real
  const activePlacementsByCourse: Partial<Record<OfficialCourseId, ResolvedInitialPlacement>> = {};
  const sortedActivePlacements = placements
    .filter((p) => p.status === 'active' && p.mode === 'custom_start')
    .sort((a, b) => Date.parse(b.updatedAt || '') - Date.parse(a.updatedAt || ''));

  let primaryPlacement: ResolvedInitialPlacement | null = null;

  for (const placement of sortedActivePlacements) {
    const course = getCatalogCourse(placement.courseId);
    const lesson = course ? getCatalogLesson(placement.lessonId, course.id) : null;
    if (!course || !lesson) continue;
    const mod = placement.moduleId
      ? getCatalogModule(course.id, placement.moduleId) || getCatalogModule(course.id, lesson.moduleId)
      : getCatalogModule(course.id, lesson.moduleId);
    if (!mod) continue;

    const resolved: ResolvedInitialPlacement = {
      placementId: placement.id,
      courseId: course.id,
      moduleId: mod.id,
      moduleNumber: mod.moduleNumber,
      lessonId: lesson.id,
      reason: placement.reason ?? null,
      assignedBy: placement.assignedBy,
      assignedByEmail: placement.assignedByEmail ?? null,
      updatedAt: placement.updatedAt,
      isAccessible: Boolean(courses[course.id]?.lessons[lesson.id]?.allowed),
    };

    if (!activePlacementsByCourse[course.id]) {
      activePlacementsByCourse[course.id] = resolved;
    }
    if (!primaryPlacement) {
      primaryPlacement = resolved;
    }
  }

  return {
    studentUid: input.studentUid,
    evaluatedAtMs: nowMs,
    courses,
    activeGrants,
    inactiveGrants,
    activePlacementsByCourse,
    primaryPlacement,
  };
}

export function canStudentAccessCourse(
  snapshot: StudentEffectiveAccessSnapshot,
  courseId: OfficialCourseId
): { allowed: boolean; fullCourseUnlocked: boolean; partialAccess: boolean; reason?: string } {
  const courseAccess = snapshot.courses[courseId];
  if (!courseAccess) {
    return { allowed: false, fullCourseUnlocked: false, partialAccess: false, reason: 'Curso inválido.' };
  }
  return {
    allowed: courseAccess.hasAnyAccess,
    fullCourseUnlocked: courseAccess.fullCourseUnlocked,
    partialAccess: !courseAccess.fullCourseUnlocked && courseAccess.hasAnyAccess,
    reason: courseAccess.lockReason,
  };
}

export function canStudentAccessModule(
  snapshot: StudentEffectiveAccessSnapshot,
  courseId: OfficialCourseId,
  moduleId: string
): boolean {
  const mod = snapshot.courses[courseId]?.modules[moduleId];
  return Boolean(mod && (mod.fullModuleUnlocked || mod.hasAnyLessonUnlocked));
}

export function canStudentAccessLesson(
  snapshot: StudentEffectiveAccessSnapshot,
  lessonId: string,
  courseIdHint?: OfficialCourseId
): EffectiveLessonAccess | null {
  if (courseIdHint && snapshot.courses[courseIdHint]?.lessons[lessonId]) {
    return snapshot.courses[courseIdHint].lessons[lessonId];
  }
  for (const cId of VALID_COURSE_IDS) {
    const found = snapshot.courses[cId]?.lessons[lessonId];
    if (found) return found;
  }
  return null;
}

/**
 * Resolve o ponto de início recomendado para o aluno considerando:
 * 1. Direcionamento Inicial ativo e acessível (preservando todo progresso anterior)
 * 2. Última aula em estudo no curso ou primeira aula acessível
 */
export function resolveStudentEntryPoint(
  snapshot: StudentEffectiveAccessSnapshot,
  progress: UserProgress,
  preferredCourseId?: OfficialCourseId
): {
  courseId: OfficialCourseId;
  moduleId: string;
  moduleNumber: number;
  lessonId: string;
  fromAdminPlacement: boolean;
  placementReason?: string | null;
} {
  if (preferredCourseId) {
    const coursePlacement = snapshot.activePlacementsByCourse[preferredCourseId];
    if (coursePlacement && coursePlacement.isAccessible) {
      return {
        courseId: coursePlacement.courseId,
        moduleId: coursePlacement.moduleId,
        moduleNumber: coursePlacement.moduleNumber,
        lessonId: coursePlacement.lessonId,
        fromAdminPlacement: true,
        placementReason: coursePlacement.reason,
      };
    }
  } else if (snapshot.primaryPlacement && snapshot.primaryPlacement.isAccessible) {
    return {
      courseId: snapshot.primaryPlacement.courseId,
      moduleId: snapshot.primaryPlacement.moduleId,
      moduleNumber: snapshot.primaryPlacement.moduleNumber,
      lessonId: snapshot.primaryPlacement.lessonId,
      fromAdminPlacement: true,
      placementReason: snapshot.primaryPlacement.reason,
    };
  }

  const targetCourseId = preferredCourseId || getPrimaryCourseId(progress);
  const course = ACADEMIC_CATALOG_COURSES[targetCourseId];
  const lastLessonId = progress.courseLastLesson?.[targetCourseId];

  if (lastLessonId) {
    const lastAccess = snapshot.courses[targetCourseId]?.lessons[lastLessonId];
    const lastEntry = getCatalogLesson(lastLessonId, targetCourseId);
    if (lastAccess?.allowed && lastEntry) {
      return {
        courseId: targetCourseId,
        moduleId: lastEntry.moduleId,
        moduleNumber: lastEntry.moduleNumber,
        lessonId: lastEntry.id,
        fromAdminPlacement: false,
      };
    }
  }

  const firstUnlockedId = snapshot.courses[targetCourseId]?.unlockedLessonIds[0];
  const firstLesson =
    (firstUnlockedId ? getCatalogLesson(firstUnlockedId, targetCourseId) : null) ||
    course.lessons[0];

  return {
    courseId: targetCourseId,
    moduleId: firstLesson.moduleId,
    moduleNumber: firstLesson.moduleNumber,
    lessonId: firstLesson.id,
    fromAdminPlacement: false,
  };
}
