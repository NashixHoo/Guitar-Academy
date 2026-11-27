// =========================================================================
// GUITAR ACADEMY — MASTER CORE V1.0 (MASTER CURRICULUM 300)
// MOTOR DE MATRÍCULA, PROGRESSÃO E DESBLOQUEIO AUTOMÁTICO DE CURSOS (50%)
// =========================================================================

import { UserProgress } from '../../types';
import { 
  VIOLAO_CURRICULUM_MODULES, 
  getGuitarCurriculumModules, 
  BAIXO_CURRICULUM_MODULES, 
  TECLADO_CURRICULUM_MODULES, 
  BATERIA_CURRICULUM_MODULES 
} from '../curriculo/mestreCurriculumRegistry';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { SOLO_LESSONS } from '../../data/soloCourse';

export type OfficialCourseId = 
  | 'violao' 
  | 'guitarra'
  | 'canonical' 
  | 'solo' 
  | 'baixo' 
  | 'teclado' 
  | 'bateria';

export interface CourseMetadata {
  id: OfficialCourseId;
  name: string;
  instrumentName: string;
  iconName: string;
  totalLessons: number;
}

export const COURSE_METADATA_MAP: Record<OfficialCourseId, CourseMetadata> = {
  violao: {
    id: 'violao',
    name: 'Domínio Total do Violão',
    instrumentName: 'Violão Acústico',
    iconName: 'Guitar',
    totalLessons: 60
  },
  guitarra: {
    id: 'guitarra',
    name: 'Conservatório Completo de Guitarra Elétrica',
    instrumentName: 'Guitarra Elétrica',
    iconName: 'Zap',
    totalLessons: 60
  },
  canonical: {
    id: 'canonical',
    name: 'Conservatório de Guitarra — Grade Canônica (Legado)',
    instrumentName: 'Guitarra Elétrica',
    iconName: 'GraduationCap',
    totalLessons: 18
  },
  solo: {
    id: 'solo',
    name: 'Formação em Guitarra Solo (Legado)',
    instrumentName: 'Guitarra Elétrica',
    iconName: 'Zap',
    totalLessons: 20
  },
  baixo: {
    id: 'baixo',
    name: 'Formação em Contrabaixo Elétrico',
    instrumentName: 'Contrabaixo',
    iconName: 'Disc',
    totalLessons: 60
  },
  teclado: {
    id: 'teclado',
    name: 'Formação em Teclado e Piano',
    instrumentName: 'Teclado / Piano',
    iconName: 'Grid',
    totalLessons: 60
  },
  bateria: {
    id: 'bateria',
    name: 'Formação em Bateria e Prática Rítmica',
    instrumentName: 'Bateria',
    iconName: 'Activity',
    totalLessons: 60
  }
};

/**
 * Retorna todos os IDs obrigatórios das aulas de um curso (Master Curriculum 300)
 */
export function getMandatoryLessonIdsForCourse(courseId: OfficialCourseId): string[] {
  switch (courseId) {
    case 'violao':
      return VIOLAO_CURRICULUM_MODULES.flatMap((m) => m.aulas.map((l) => l.id));
    case 'guitarra':
      return getGuitarCurriculumModules().flatMap((m) => m.aulas.map((l) => l.id));
    case 'canonical':
      return CURRICULUM_LEVELS.flatMap((lvl) => lvl.lessons.map((l) => l.id));
    case 'solo':
      return SOLO_LESSONS.map((l) => l.id);
    case 'baixo':
      return BAIXO_CURRICULUM_MODULES.flatMap((m) => m.aulas.map((l) => l.id));
    case 'teclado':
      return TECLADO_CURRICULUM_MODULES.flatMap((m) => m.aulas.map((l) => l.id));
    case 'bateria':
      return BATERIA_CURRICULUM_MODULES.flatMap((m) => m.aulas.map((l) => l.id));
    default:
      return [];
  }
}

export interface CourseProgressDetail {
  courseId: OfficialCourseId;
  courseName: string;
  totalMandatoryActivities: number;
  completedMandatoryActivities: number;
  progressPercentage: number;
  isFiftyPercentReached: boolean;
  remainingPercentageToFifty: number;
  remainingActivitiesToFifty: number;
  canUnlockElectives: boolean;
}

/**
 * CÁLCULO OFICIAL DE PROGRESSO VÁLIDO (Regra da Matriz Central 300)
 */
export function calculateCourseProgress(
  courseId: OfficialCourseId,
  progress: UserProgress | null | undefined
): CourseProgressDetail {
  const meta = COURSE_METADATA_MAP[courseId];
  const courseName = meta ? meta.name : courseId;
  const mandatoryLessonIds = getMandatoryLessonIdsForCourse(courseId);
  const totalMandatory = mandatoryLessonIds.length;

  if (!progress || totalMandatory === 0) {
    return {
      courseId,
      courseName,
      totalMandatoryActivities: totalMandatory,
      completedMandatoryActivities: 0,
      progressPercentage: 0,
      isFiftyPercentReached: false,
      remainingPercentageToFifty: 50.0,
      remainingActivitiesToFifty: Math.ceil(totalMandatory * 0.5),
      canUnlockElectives: false
    };
  }

  const completedSet = new Set(progress.completedLessons || []);
  const completedIds = mandatoryLessonIds.filter((id) => completedSet.has(id));
  const completedMandatory = completedIds.length;

  const rawPercentage = (completedMandatory / totalMandatory) * 100;
  const progressPercentage = Math.round(rawPercentage * 100) / 100;

  const isFiftyPercentReached = progressPercentage >= 50.0;
  const remainingPercentageToFifty = isFiftyPercentReached
    ? 0
    : Math.round(Math.max(0, 50.0 - progressPercentage) * 100) / 100;

  const targetFiftyActivities = Math.ceil(totalMandatory * 0.5);
  const remainingActivitiesToFifty = isFiftyPercentReached
    ? 0
    : Math.max(0, targetFiftyActivities - completedMandatory);

  return {
    courseId,
    courseName,
    totalMandatoryActivities: totalMandatory,
    completedMandatoryActivities: completedMandatory,
    progressPercentage,
    isFiftyPercentReached,
    remainingPercentageToFifty,
    remainingActivitiesToFifty,
    canUnlockElectives: isFiftyPercentReached
  };
}

export function getPrimaryCourseId(progress: UserProgress | null | undefined): OfficialCourseId {
  if (!progress) return 'violao';

  if (progress.primaryCourseId && COURSE_METADATA_MAP[progress.primaryCourseId as OfficialCourseId]) {
    return progress.primaryCourseId as OfficialCourseId;
  }

  const completed = progress.completedLessons || [];
  if (completed.some((id) => id.startsWith('violao-'))) {
    return 'violao';
  }
  if (completed.some((id) => id.startsWith('solo-') || id.startsWith('lesson-') || id.startsWith('guitar-'))) {
    return 'guitarra';
  }
  if (completed.some((id) => id.startsWith('baixo-'))) {
    return 'baixo';
  }
  if (completed.some((id) => id.startsWith('teclado-'))) {
    return 'teclado';
  }
  if (completed.some((id) => id.startsWith('bateria-'))) {
    return 'bateria';
  }

  if (progress.lastAccessedCourseId && COURSE_METADATA_MAP[progress.lastAccessedCourseId as OfficialCourseId]) {
    return progress.lastAccessedCourseId as OfficialCourseId;
  }

  return 'violao';
}

export function enrollPrimaryCourse(
  progress: UserProgress,
  targetCourseId: OfficialCourseId
): { success: boolean; progress: UserProgress; message: string } {
  const currentPrimary = getPrimaryCourseId(progress);

  if (currentPrimary === targetCourseId) {
    return {
      success: true,
      progress: {
        ...progress,
        primaryCourseId: targetCourseId
      },
      message: `Você já está matriculado no curso ${COURSE_METADATA_MAP[targetCourseId].name}.`
    };
  }

  const updated: UserProgress = {
    ...progress,
    primaryCourseId: targetCourseId,
    courseLastLesson: {
      ...(progress.courseLastLesson || {}),
      [targetCourseId]: progress.courseLastLesson?.[targetCourseId] || getMandatoryLessonIdsForCourse(targetCourseId)[0]
    }
  };

  return {
    success: true,
    progress: updated,
    message: `Matrícula no curso principal ${COURSE_METADATA_MAP[targetCourseId].name} confirmada com sucesso!`
  };
}

export function isCourseUnlocked(
  courseId: OfficialCourseId,
  progress: UserProgress | null | undefined
): boolean {
  if (!progress) return courseId === 'violao';

  const primaryCourseId = getPrimaryCourseId(progress);

  if (courseId === primaryCourseId) {
    return true;
  }

  const primaryProgress = calculateCourseProgress(primaryCourseId, progress);
  if (primaryProgress.isFiftyPercentReached) {
    return true;
  }

  const allCourses: OfficialCourseId[] = ['violao', 'guitarra', 'baixo', 'teclado', 'bateria'];
  for (const cId of allCourses) {
    if (cId !== courseId) {
      const p = calculateCourseProgress(cId, progress);
      if (p.isFiftyPercentReached) {
        return true;
      }
    }
  }

  return false;
}

export function canAccessCourse(
  courseId: OfficialCourseId,
  progress: UserProgress | null | undefined
): { allowed: boolean; reason?: string; progressDetail: CourseProgressDetail } {
  const primaryCourseId = getPrimaryCourseId(progress);
  const primaryProgress = calculateCourseProgress(primaryCourseId, progress);
  const targetMeta = COURSE_METADATA_MAP[courseId];
  const primaryMeta = COURSE_METADATA_MAP[primaryCourseId];

  if (courseId === primaryCourseId) {
    return {
      allowed: true,
      progressDetail: calculateCourseProgress(courseId, progress)
    };
  }

  const unlocked = isCourseUnlocked(courseId, progress);
  if (unlocked) {
    return {
      allowed: true,
      progressDetail: calculateCourseProgress(courseId, progress)
    };
  }

  return {
    allowed: false,
    reason: `O curso completo de ${targetMeta.name} será desbloqueado automaticamente assim que você atingir 50% de conclusão no seu curso principal (${primaryMeta.name}). Progresso atual: ${primaryProgress.progressPercentage}% (${primaryProgress.remainingPercentageToFifty}% restantes).`,
    progressDetail: calculateCourseProgress(courseId, progress)
  };
}

export interface CatalogCourseStatus {
  courseId: OfficialCourseId;
  name: string;
  instrumentName: string;
  isPrimary: boolean;
  isUnlocked: boolean;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  remainingPercentageToFifty: number;
  remainingLessonsToFifty: number;
  lockReason?: string;
}

export function getCatalogCoursesStatus(
  progress: UserProgress | null | undefined
): Record<OfficialCourseId, CatalogCourseStatus> {
  const primaryId = getPrimaryCourseId(progress);
  const primaryProg = calculateCourseProgress(primaryId, progress);
  // Exibimos no catálogo principal os 5 instrumentos unificados: violao, guitarra, baixo, teclado, bateria
  const courseIds: OfficialCourseId[] = ['violao', 'guitarra', 'baixo', 'teclado', 'bateria'];

  const result = {} as Record<OfficialCourseId, CatalogCourseStatus>;

  for (const cId of courseIds) {
    const meta = COURSE_METADATA_MAP[cId];
    const isPrimary = cId === primaryId;
    const progDetail = calculateCourseProgress(cId, progress);
    const unlocked = isCourseUnlocked(cId, progress);

    let lockReason: string | undefined;
    if (!unlocked) {
      lockReason = `Requer 50% de conclusão no curso principal (${COURSE_METADATA_MAP[primaryId].name}). Progresso atual: ${primaryProg.progressPercentage}% (${primaryProg.remainingPercentageToFifty}% restantes).`;
    }

    result[cId] = {
      courseId: cId,
      name: meta.name,
      instrumentName: meta.instrumentName,
      isPrimary,
      isUnlocked: unlocked,
      completedLessons: progDetail.completedMandatoryActivities,
      totalLessons: progDetail.totalMandatoryActivities,
      progressPercentage: progDetail.progressPercentage,
      remainingPercentageToFifty: progDetail.remainingPercentageToFifty,
      remainingLessonsToFifty: progDetail.remainingActivitiesToFifty,
      lockReason
    };
  }

  return result;
}
