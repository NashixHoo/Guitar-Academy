// =========================================================================
// GUITAR ACADEMY — MASTER CORE V1.0 (FASE 4)
// MOTOR DE MATRÍCULA, PROGRESSÃO E DESBLOQUEIO AUTOMÁTICO DE CURSOS (50%)
// =========================================================================

import { UserProgress } from '../../types';
import { VIOLAO_LESSONS } from '../../data/violaoCourse';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { SOLO_LESSONS } from '../../data/soloCourse';
import { BASS_LESSONS } from '../../data/bassCourse';
import { KEYBOARD_LESSONS } from '../../data/keyboardCourse';
import { DRUMS_LESSONS } from '../../data/drumsCourse';

export type OfficialCourseId = 
  | 'violao' 
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
  canonical: {
    id: 'canonical',
    name: 'Conservatório de Guitarra — Grade Canônica',
    instrumentName: 'Guitarra Elétrica',
    iconName: 'GraduationCap',
    totalLessons: 18
  },
  solo: {
    id: 'solo',
    name: 'Formação em Guitarra Solo',
    instrumentName: 'Guitarra Elétrica',
    iconName: 'Zap',
    totalLessons: 20
  },
  baixo: {
    id: 'baixo',
    name: 'Formação em Contrabaixo Elétrico',
    instrumentName: 'Contrabaixo',
    iconName: 'Disc',
    totalLessons: 18
  },
  teclado: {
    id: 'teclado',
    name: 'Formação em Teclado e Piano',
    instrumentName: 'Teclado / Piano',
    iconName: 'Grid',
    totalLessons: 18
  },
  bateria: {
    id: 'bateria',
    name: 'Formação em Bateria e Prática Rítmica',
    instrumentName: 'Bateria',
    iconName: 'Activity',
    totalLessons: 18
  }
};

/**
 * Retorna todos os IDs canônicos das aulas obrigatórias de um curso
 */
export function getMandatoryLessonIdsForCourse(courseId: OfficialCourseId): string[] {
  switch (courseId) {
    case 'violao':
      return VIOLAO_LESSONS.map((l) => l.id);
    case 'canonical':
      return CURRICULUM_LEVELS.flatMap((lvl) => lvl.lessons.map((l) => l.id));
    case 'solo':
      return SOLO_LESSONS.map((l) => l.id);
    case 'baixo':
      return BASS_LESSONS.map((l) => l.id);
    case 'teclado':
      return KEYBOARD_LESSONS.map((l) => l.id);
    case 'bateria':
      return DRUMS_LESSONS.map((l) => l.id);
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
 * CÁLCULO OFICIAL DE PROGRESSO VÁLIDO (Regra da Matriz Central)
 * progresso = atividades obrigatórias concluídas / total de atividades obrigatórias aplicáveis * 100
 *
 * REGRAS INEGOCIÁVEIS:
 * - Apenas aulas na lista de completedLessons do aluno SÃO contabilizadas.
 * - Aulas meramente visualizadas (status 'viewed' em practiceLogs) NÃO são contabilizadas.
 * - Tempo de estudo ou permanência no app NÃO é contabilizado no percentual de conclusão.
 * - Cursos sem atividades obrigatórias válidas (total = 0) retornam 0% e canUnlockElectives = false.
 * - O desbloqueio ocorre ao atingir exatamente 50.0% (inclusive).
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

  // Cálculo matemático exato com precisão de 2 casas decimais
  const rawPercentage = (completedMandatory / totalMandatory) * 100;
  // Arredonda para 2 casas decimais para comparações numéricas confiáveis
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

/**
 * Resolve o curso principal oficial do aluno com isolamento e preservação de dados
 */
export function getPrimaryCourseId(progress: UserProgress | null | undefined): OfficialCourseId {
  if (!progress) return 'violao';

  // Se o aluno já tem o curso principal explicitamente gravado, preserva
  if (progress.primaryCourseId && COURSE_METADATA_MAP[progress.primaryCourseId as OfficialCourseId]) {
    return progress.primaryCourseId as OfficialCourseId;
  }

  // Fallback inteligente para dados legados:
  // Se o aluno já tem progresso registrado em aulas de violão, seu curso principal é 'violao'
  const completed = progress.completedLessons || [];
  if (completed.some((id) => id.startsWith('violao-'))) {
    return 'violao';
  }
  if (completed.some((id) => id.startsWith('solo-'))) {
    return 'solo';
  }
  if (completed.some((id) => id.startsWith('lesson-'))) {
    return 'canonical';
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

  // Se o aluno acessou um curso anteriormente e ele é válido
  if (progress.lastAccessedCourseId && COURSE_METADATA_MAP[progress.lastAccessedCourseId as OfficialCourseId]) {
    return progress.lastAccessedCourseId as OfficialCourseId;
  }

  return 'violao';
}

/**
 * Matrícula no curso principal com proteção contra duplicidade e contorno
 */
export function enrollPrimaryCourse(
  progress: UserProgress,
  targetCourseId: OfficialCourseId
): { success: boolean; progress: UserProgress; message: string } {
  const currentPrimary = getPrimaryCourseId(progress);

  // Se já está matriculado neste mesmo curso principal
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

  // REGRA DE PROTEÇÃO CONTRA CONTORNO DE DESBLOQUEIO:
  // Se o aluno já possui um curso principal e tenta trocar para um curso secundário que ainda está bloqueado (< 50% no principal atual),
  // a troca só é permitida se o novo curso for legítimo, mas NÃO desbloqueará os demais instrumentos magicamente!
  const currentPrimaryProgress = calculateCourseProgress(currentPrimary, progress);

  const updated: UserProgress = {
    ...progress,
    primaryCourseId: targetCourseId,
    // Se ainda não tiver inicializado as últimas aulas acessadas
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

/**
 * VERIFICAÇÃO CONFIÁVEL DE DESBLOQUEIO (Backend / Service Layer)
 * Não confia exclusivamente em estados de frontend.
 *
 * REGRA:
 * 1. O curso principal do aluno está SEMPRE liberado para estudo.
 * 2. Cursos secundários só estão liberados se o aluno tiver alcançado pelo menos 50% de conclusão válida em seu curso principal oficial.
 * 3. Proteção contra troca de curso: o desbloqueio só é verdadeiro se o curso principal do aluno tiver >= 50% de conclusão.
 */
export function isCourseUnlocked(
  courseId: OfficialCourseId,
  progress: UserProgress | null | undefined
): boolean {
  if (!progress) return courseId === 'violao';

  const primaryCourseId = getPrimaryCourseId(progress);

  // O curso principal sempre está acessível ao aluno
  if (courseId === primaryCourseId) {
    return true;
  }

  // Verifica se o curso principal do aluno atingiu pelo menos 50%
  const primaryProgress = calculateCourseProgress(primaryCourseId, progress);
  if (primaryProgress.isFiftyPercentReached) {
    return true;
  }

  // Também verifica se o aluno porventura concluiu >= 50% em algum outro curso em que tenha estudado legitimamente
  // (caso já tenha sido graduado ou avançado em outro curso)
  const allCourses: OfficialCourseId[] = ['violao', 'canonical', 'solo', 'baixo', 'teclado', 'bateria'];
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

/**
 * Validação rigorosa de autorização de acesso ao curso
 */
export function canAccessCourse(
  courseId: OfficialCourseId,
  progress: UserProgress | null | undefined
): { allowed: boolean; reason?: string; progressDetail: CourseProgressDetail } {
  const primaryCourseId = getPrimaryCourseId(progress);
  const primaryProgress = calculateCourseProgress(primaryCourseId, progress);
  const targetMeta = COURSE_METADATA_MAP[courseId];
  const primaryMeta = COURSE_METADATA_MAP[primaryCourseId];

  // Curso principal é livre
  if (courseId === primaryCourseId) {
    return {
      allowed: true,
      progressDetail: calculateCourseProgress(courseId, progress)
    };
  }

  // Curso secundário: verifica a regra dos 50%
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

/**
 * Retorna o status de todo o catálogo para a interface
 */
export function getCatalogCoursesStatus(
  progress: UserProgress | null | undefined
): Record<OfficialCourseId, CatalogCourseStatus> {
  const primaryId = getPrimaryCourseId(progress);
  const primaryProg = calculateCourseProgress(primaryId, progress);
  const courseIds: OfficialCourseId[] = ['violao', 'canonical', 'solo', 'baixo', 'teclado', 'bateria'];

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
