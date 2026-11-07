// =========================================================================
// GUITAR ACADEMY — INTELLIGENT LEARNING SYSTEM V1
// src/services/learningEngine.ts
// Motor Central de Aprendizagem, Continuidade, Recomendações e Mapa de Domínio
// Módulo 100% determinístico, testável e sem IA generativa fictícia.
// =========================================================================

import {
  UserProgress,
  Lesson,
  SoloLesson,
  ViolaoLesson,
  ManualPracticeLogEntry,
  PracticeSessionRecord,
  MasteryLevel,
  NavigationTab,
} from '../types';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { SOLO_LESSONS } from '../data/soloCourse';
import { VIOLAO_LESSONS } from '../data/violaoCourse';
import {
  CANONICAL_SKILLS,
  LESSON_TO_SKILL_MAP,
  createInitialPedagogicalProfile,
  getTodayIso,
} from '../pedagogy/adaptiveEngine';
import {
  PRACTICE_EXERCISE_CATALOG,
  ExecutablePracticeExercise,
} from '../pedagogy/practiceRoutineEngine';

export type CourseId = 'canonical' | 'violao' | 'solo';

export interface CourseMetadata {
  id: CourseId;
  title: string;
  badge: string;
  tagline: string;
  instrument: string;
  totalLessons: number;
}

export const COURSES_CATALOG: Record<CourseId, CourseMetadata> = {
  canonical: {
    id: 'canonical',
    title: 'Conservatório Geral de Guitarra',
    badge: '18 Aulas • 6 Níveis',
    tagline: 'Fundamentos inegociáveis, afinação, acordes abertos, pentatônicas e harmonia',
    instrument: 'Guitarra Elétrica',
    totalLessons: 18,
  },
  violao: {
    id: 'violao',
    title: 'Domínio Total do Violão',
    badge: '60 Aulas • 10 Módulos',
    tagline: 'Anatomia, mapa do braço, dedilhados, harmonia funcional e violão solo',
    instrument: 'Violão Acústico (Nylon & Aço)',
    totalLessons: 60,
  },
  solo: {
    id: 'solo',
    title: 'Formação em Guitarra Solo',
    badge: '20 Aulas • 5 Etapas',
    tagline: 'Palhetada alternada, 5 padrões CAGED, bends expressivos e improvisação',
    instrument: 'Guitarra Elétrica',
    totalLessons: 20,
  },
};

export interface CourseProgressSummary {
  courseId: CourseId;
  id: CourseId;
  title: string;
  badge: string;
  tagline: string;
  instrument: string;
  totalLessons: number;
  completedCount: number;
  percent: number;
  progressPercent: number;
  lastAccessedLessonId: string;
  lastAccessedLessonTitle: string;
  lastAccessedModuleTitle: string;
  nextLesson?: Lesson | SoloLesson | ViolaoLesson;
  nextLessonId: string;
  nextLessonTitle: string;
  nextLessonModuleTitle: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface LearningContinuityState {
  activeCourse: CourseProgressSummary;
  otherCourses: CourseProgressSummary[];
  currentLesson: Lesson | SoloLesson | ViolaoLesson;
  actionType: 'continue_in_progress' | 'start_next' | 'review_mastered' | 'start_journey';
  actionLabel: string;
  rationale: string;
}

export type DomainArea =
  | 'technique_left_hand'
  | 'technique_right_hand'
  | 'rhythm_precision'
  | 'chord_shapes'
  | 'chord_transitions'
  | 'harmonic_field'
  | 'scales'
  | 'intervals'
  | 'harmony'
  | 'reading'
  | 'improvisation'
  | 'musical_application';

export interface DomainAreaInfo {
  id: DomainArea;
  title: string;
  description: string;
  skillsCount: number;
  evaluatedSkillsCount: number;
  masteredSkillsCount: number;
}

export interface SkillDomainItem {
  id: string;
  name: string;
  description: string;
  area: DomainArea;
  level: number;
  isEvaluated: boolean;
  masteryLevel: MasteryLevel;
  statusLabel: 'Ainda não avaliado' | 'Iniciante' | 'Em Treinamento' | 'Proficiente' | 'Dominado';
  masteryScore: number | null; // null se ainda não avaliado (sem porcentagens falsas)
  attemptsCount: number;
  correctCount: number;
  recurringErrorsCount: number;
  evidencesCount: number;
  accuracyPercent?: number;
  targetTab?: NavigationTab;
  lastPracticedDate: string | null;
  nextReviewDate: string | null;
  relatedLessons: string[];
  nextStepRecommendation: string;
}

export interface SkillEvolutionSummary {
  domains: {
    area: DomainArea;
    title: string;
    description: string;
    skills: SkillDomainItem[];
    evaluatedCount: number;
    averageScore: number | null;
  }[];
  evaluatedSkillsCount: number;
  totalSkillsCount: number;
  overallEvaluatedScore: number;
  areas: DomainAreaInfo[];
  skillsByArea: Record<DomainArea, SkillDomainItem[]>;
  totalEvaluated: number;
  totalMastered: number;
  overallMasteryPercent: number;
}

export type ContextualRecommendation = ContextualRecommendationItem;

export interface ContextualRecommendationItem {
  id: string;
  type: 'continuity' | 'review' | 'spaced_review' | 'prerequisite' | 'drill' | 'foundation';
  title: string;
  subtitle: string;
  rationale: string;
  targetLessonId?: string;
  targetTab: 'curriculum' | 'practice-routine' | 'guitar-coach' | 'metronome' | 'fretboard' | 'chords';
  suggestedMinutes: number;
  priority: number;
}

export interface PracticeMetricsSummary {
  totalStudyTimeSeconds: number;
  todayStudyTimeSeconds: number;
  dailyGoalMinutes: number;
  goalPercentage: number;
  isGoalReached: boolean;
  manualOfflineSeconds: number;
  verifiedInteractiveSeconds: number;
  manualLogsCount: number;
  interactiveSessionsCount: number;
}

export interface DailyPracticePlanStep {
  stepNumber: number;
  phase: 'Aquecimento Técnico' | 'Exercício de Habilidade' | 'Aplicação Musical' | 'Revisão de Conteúdo' | 'Encerramento & Registro';
  title: string;
  description: string;
  durationMinutes: number;
  bpm?: number;
  tablatureSnippet?: string;
  instructions: string[];
  exerciseId?: string;
}

export interface DailyPracticePlan {
  durationMinutes: 10 | 15 | 20 | 30 | 45 | 60;
  focusTitle: string;
  rationale: string;
  steps: DailyPracticePlanStep[];
  totalMinutes: number;
  totalEstimatedMinutes: number;
}

// -------------------------------------------------------------------------
// MAPEAMENTO DAS 21 HABILIDADES PARA AS 12 ÁREAS DO MAPA DE DOMÍNIO
// -------------------------------------------------------------------------
export const SKILL_DOMAIN_AREA_MAP: Record<string, { area: DomainArea; description: string }> = {
  'skill-tuning-strings': {
    area: 'technique_left_hand',
    description: 'Afinação padrão E-A-D-G-B-E e anatomia física das 6 cordas.',
  },
  'skill-cipher-notes': {
    area: 'reading',
    description: 'Memorização imediata do alfabeto das cifras (A a G) e notas naturais.',
  },
  'skill-semitones-fretboard': {
    area: 'intervals',
    description: 'Localização de tons, semitons e casas cromáticas no braço do instrumento.',
  },
  'skill-alternate-picking': {
    area: 'technique_right_hand',
    description: 'Palhetada alternada estrita ↓ ↑, ângulo da palheta e coordenação 1-2-3-4.',
  },
  'skill-metronome-44': {
    area: 'rhythm_precision',
    description: 'Pulsação interna constante, compasso 4/4 e estabilidade com metrônomo.',
  },
  'skill-open-chords-e-a': {
    area: 'chord_shapes',
    description: 'Postura, digitação e sustentação limpa dos acordes abertos E, Em, A e Am.',
  },
  'skill-open-chords-c-g-d': {
    area: 'chord_shapes',
    description: 'Digitação limpa do triângulo fundamental Pop/Rock C, G e D.',
  },
  'skill-chord-transitions': {
    area: 'chord_transitions',
    description: 'Transições rápidas no ar sem interrupção do pulso rítmico (Guitar Coach).',
  },
  'skill-worship-chords': {
    area: 'chord_shapes',
    description: 'Acordes modernos com âncora fixa nas casas 3 das cordas 1 e 2 (Cadd9, Em7, Dsus4).',
  },
  'skill-strumming-grooves': {
    area: 'technique_right_hand',
    description: 'Levadas rítmicas com dinâmica de subida/descida, acentos e palm mute.',
  },
  'skill-pentatonic-pos1': {
    area: 'scales',
    description: 'Desenho biomecânico do Padrão 1 da escala pentatônica menor.',
  },
  'skill-caged-pentatonic': {
    area: 'scales',
    description: 'Conexão horizontal dos 5 padrões da pentatônica no braço (Sistema CAGED).',
  },
  'skill-expressive-solo': {
    area: 'improvisation',
    description: 'Articulações expressivas: Bends com 3 dedos, vibrato circular e ligados.',
  },
  'skill-solo-improvisation': {
    area: 'improvisation',
    description: 'Construção de frases melódicas, notas-alvo e dinâmica solística.',
  },
  'skill-triads-tetrads': {
    area: 'chord_shapes',
    description: 'Estruturação de tríades maiores/menores e tétrades com 7ª Maior e menor.',
  },
  'skill-harmonic-field': {
    area: 'harmonic_field',
    description: 'Compreensão dos 7 graus harmônicos maiores e progressões funcionais I-V-vi-IV.',
  },
  'skill-ear-intervals': {
    area: 'intervals',
    description: 'Identificação auditiva de intervalos melódicos e harmônicos (3ªs, 5ªs, 7ªs).',
  },
  'skill-major-pentatonic': {
    area: 'scales',
    description: 'Aplicação da pentatônica maior e relação com a relativa menor.',
  },
  'skill-greek-modes': {
    area: 'harmony',
    description: 'Sonoridades modais (Dórico, Frígio, Lídio, Mixolídio, Eólio, Lócrio).',
  },
  'skill-voice-leading': {
    area: 'harmony',
    description: 'Condução suave de vozes, notas guia e inversões de acordes no braço.',
  },
  'skill-band-performance': {
    area: 'musical_application',
    description: 'Acompanhamento interativo, dinâmica de palco e arranjo instrumental completo.',
  },
};

export const DOMAIN_AREAS_METADATA: Record<DomainArea, { title: string; description: string }> = {
  technique_left_hand: {
    title: 'Técnica de Mão Esquerda',
    description: 'Postura biomecânica, posicionamento do polegar, polpas dos dedos e pestanas.',
  },
  technique_right_hand: {
    title: 'Técnica de Mão Direita',
    description: 'Palhetada alternada estrita, ângulo de ataque, dedilhados e controle dinâmico.',
  },
  rhythm_precision: {
    title: 'Ritmo e Precisão',
    description: 'Metrônomo, tempo, subdivisões (semínimas, colcheias, tercinas) e pulsação.',
  },
  chord_shapes: {
    title: 'Formação de Acordes',
    description: 'Acordes abertos, tétrades, pestanas, extensões worship e voicings no braço.',
  },
  chord_transitions: {
    title: 'Troca de Acordes',
    description: 'Transições no tempo sem interrupção rítmica e antecipação motora no ar.',
  },
  harmonic_field: {
    title: 'Campo Harmônico',
    description: 'Estrutura dos graus I a VII, funções tonais e progressões harmônicas reais.',
  },
  scales: {
    title: 'Escalas Musicais',
    description: 'Pentatônicas menor e maior, Sistema CAGED horizontal e conexões no braço.',
  },
  intervals: {
    title: 'Intervalos e Notas',
    description: 'Semitons, tons, localização imediata das 12 notas e intervalos relativos.',
  },
  harmony: {
    title: 'Harmonia Avançada',
    description: 'Condução de vozes, resolução de trítonos, notas guia e modos gregos.',
  },
  reading: {
    title: 'Leitura Musical',
    description: 'Cifras universais, tablaturas, símbolos de técnica (bends, slides, palm-mute).',
  },
  improvisation: {
    title: 'Improvisação e Solos',
    description: 'Expressividade (vibrato, bends afinados), notas-alvo e criação melódica.',
  },
  musical_application: {
    title: 'Aplicação Musical',
    description: 'Prática de repertório real, levadas de louvor/pop, violão solo e arranjos.',
  },
};

/**
 * Retorna todas as lições do catálogo unificado
 */
export function getAllLessons(): (Lesson | SoloLesson | ViolaoLesson)[] {
  const canonicalLessons = CURRICULUM_LEVELS.flatMap((l) => l.lessons);
  return [...canonicalLessons, ...SOLO_LESSONS, ...VIOLAO_LESSONS];
}

/**
 * Identifica o curso de uma aula
 */
export function getCourseId(lessonId: string): CourseId {
  if (lessonId.startsWith('violao-')) return 'violao';
  if (lessonId.startsWith('solo-')) return 'solo';
  return 'canonical';
}

/**
 * Retorna as lições de um curso específico
 */
export function getCourseLessons(courseId: CourseId): (Lesson | SoloLesson | ViolaoLesson)[] {
  if (courseId === 'violao') return VIOLAO_LESSONS;
  if (courseId === 'solo') return SOLO_LESSONS;
  return CURRICULUM_LEVELS.flatMap((l) => l.lessons);
}

/**
 * Obtém a lição por ID
 */
export function getLessonById(lessonId: string): Lesson | SoloLesson | ViolaoLesson | undefined {
  return getAllLessons().find((l) => l.id === lessonId);
}

/**
 * FASE 1: Consolida o progresso de um curso específico
 */
export function getCourseProgressSummary(
  progress: UserProgress,
  courseId: CourseId
): CourseProgressSummary {
  const meta = COURSES_CATALOG[courseId];
  const lessons = getCourseLessons(courseId);
  const completedIds = new Set(progress.completedLessons || []);
  const completedCount = lessons.filter((l) => completedIds.has(l.id)).length;
  const percent = Math.round((completedCount / lessons.length) * 100);

  // Determina a última aula acessada neste curso
  const savedLast = progress.courseLastLesson?.[courseId];
  const lastLesson = lessons.find((l) => l.id === savedLast) ||
    lessons.find((l) => !completedIds.has(l.id)) ||
    lessons[0];

  // Determina a próxima aula recomendada para avançar
  let nextLesson = lastLesson;
  if (completedIds.has(lastLesson.id)) {
    const nextUnfinished = lessons.find((l) => !completedIds.has(l.id));
    if (nextUnfinished) {
      nextLesson = nextUnfinished;
    }
  }

  let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
  if (completedCount === lessons.length && lessons.length > 0) {
    status = 'completed';
  } else if (completedCount > 0 || (savedLast && savedLast !== lessons[0].id)) {
    status = 'in_progress';
  }

  return {
    courseId,
    id: courseId,
    title: meta.title,
    badge: meta.badge,
    tagline: meta.tagline,
    instrument: meta.instrument,
    totalLessons: lessons.length,
    completedCount,
    percent,
    progressPercent: percent,
    lastAccessedLessonId: lastLesson.id,
    lastAccessedLessonTitle: lastLesson.title,
    lastAccessedModuleTitle: lastLesson.moduleTitle,
    nextLesson,
    nextLessonId: nextLesson.id,
    nextLessonTitle: nextLesson.title,
    nextLessonModuleTitle: nextLesson.moduleTitle,
    status,
  };
}

/**
 * FASE 2: Experiência de Continuidade de Estudos ("CONTINUE SUA FORMAÇÃO")
 */
export function getLearningContinuity(progress: UserProgress): LearningContinuityState {
  const allCourses: CourseId[] = ['canonical', 'violao', 'solo'];

  // Determina o curso ativo mais recente
  let activeCourseId: CourseId = 'canonical';
  if (progress.lastAccessedCourseId && allCourses.includes(progress.lastAccessedCourseId)) {
    activeCourseId = progress.lastAccessedCourseId;
  } else if (progress.currentLessonId) {
    activeCourseId = getCourseId(progress.currentLessonId);
  }

  const activeSummary = getCourseProgressSummary(progress, activeCourseId);
  const otherSummaries = allCourses
    .filter((c) => c !== activeCourseId)
    .map((c) => getCourseProgressSummary(progress, c));

  const currentLesson = (progress.currentLessonId && getCourseId(progress.currentLessonId) === activeCourseId ? getLessonById(progress.currentLessonId) : null) ||
    getLessonById(activeSummary.lastAccessedLessonId) ||
    getLessonById(activeSummary.nextLessonId) ||
    getCourseLessons(activeCourseId)[0];

  const isLastLessonCompleted = progress.completedLessons.includes(activeSummary.lastAccessedLessonId);
  const isAllCompleted = activeSummary.completedCount === activeSummary.totalLessons;

  let actionType: 'continue_in_progress' | 'start_next' | 'review_mastered' | 'start_journey';
  let actionLabel: string;
  let rationale: string;

  if (activeSummary.completedCount === 0 && !isLastLessonCompleted) {
    actionType = 'start_journey';
    actionLabel = 'Iniciar Minha Formação';
    rationale = `Comece pelo ${currentLesson.moduleTitle}: ${currentLesson.title}. Dedique 15 a 20 minutos com violão/guitarra física.`;
  } else if (isAllCompleted) {
    actionType = 'review_mastered';
    actionLabel = 'Revisar Fundamentos';
    rationale = `Você concluiu todas as ${activeSummary.totalLessons} aulas desta formação! Continue praticando para manter a velocidade e a memória muscular.`;
  } else if (isLastLessonCompleted && activeSummary.nextLessonId !== activeSummary.lastAccessedLessonId) {
    actionType = 'start_next';
    actionLabel = `Avançar para Aula ${currentLesson.lessonNumber}`;
    rationale = `Você já concluiu "${activeSummary.lastAccessedLessonTitle}". O próximo passo natural é iniciar "${currentLesson.title}".`;
  } else {
    actionType = 'continue_in_progress';
    actionLabel = `Continuar Aula ${currentLesson.lessonNumber}`;
    rationale = `Você iniciou "${currentLesson.title}" recentemente. Retome os exercícios práticos e complete os critérios de domínio.`;
  }

  return {
    activeCourse: activeSummary,
    otherCourses: otherSummaries,
    currentLesson,
    actionType,
    actionLabel,
    rationale,
  };
}

/**
 * FASE 4: Mapa de Domínio Musical (Organização Técnica em 12 Áreas)
 * REGRA RIGOROSA: Quando não houver evidências reais, exibe "Ainda não avaliado".
 * Não inventa porcentagens fictícias.
 */
export function getSkillEvolutionMap(progress: UserProgress): SkillEvolutionSummary {
  const profile = progress.pedagogicalProfile || createInitialPedagogicalProfile();

  const skillsByArea: Record<DomainArea, SkillDomainItem[]> = {
    technique_left_hand: [],
    technique_right_hand: [],
    rhythm_precision: [],
    chord_shapes: [],
    chord_transitions: [],
    harmonic_field: [],
    scales: [],
    intervals: [],
    harmony: [],
    reading: [],
    improvisation: [],
    musical_application: [],
  };

  let totalEvaluated = 0;
  let totalMastered = 0;

  for (const s of CANONICAL_SKILLS) {
    const liveProfile = profile.skills[s.id];
    const mapping = SKILL_DOMAIN_AREA_MAP[s.id] || {
      area: 'technique_left_hand' as DomainArea,
      description: s.name,
    };

    const hasEvidence = !!liveProfile && (liveProfile.attemptsCount > 0 || (!!liveProfile.evidences && liveProfile.evidences.length > 0));
    const isMastered = !!liveProfile && liveProfile.masteryLevel === 'mastered';

    if (hasEvidence) totalEvaluated++;
    if (isMastered) totalMastered++;

    let statusLabel: 'Ainda não avaliado' | 'Iniciante' | 'Em Treinamento' | 'Proficiente' | 'Dominado' = 'Ainda não avaliado';
    let masteryScore: number | null = null;

    if (hasEvidence && liveProfile) {
      masteryScore = liveProfile.masteryScore;
      if (liveProfile.masteryLevel === 'mastered') {
        statusLabel = 'Dominado';
      } else if (liveProfile.masteryLevel === 'proficient') {
        statusLabel = 'Proficiente';
      } else if (liveProfile.masteryLevel === 'practicing') {
        statusLabel = 'Em Treinamento';
      } else {
        statusLabel = 'Iniciante';
      }
    }

    // Aulas relacionadas
    const relatedLessons: string[] = [];
    for (const [lId, mappedSkillId] of Object.entries(LESSON_TO_SKILL_MAP)) {
      if (mappedSkillId === s.id) {
        relatedLessons.push(lId);
      }
    }

    // Próximo passo recomendado determinístico
    let nextStep = 'Pratique com metrônomo a 60 BPM para registrar sua primeira avaliação técnica.';
    if (statusLabel === 'Ainda não avaliado') {
      nextStep = 'Abra o exercício prático correspondente para realizar sua primeira medição de domínio.';
    } else if (statusLabel === 'Iniciante') {
      nextStep = 'Concentre-se em executar o padrão sem pressa em andamento confortável antes de subir o BPM.';
    } else if (statusLabel === 'Em Treinamento') {
      nextStep = 'Aumente +5 BPM no metrônomo para consolidar a memória muscular sem tensionar os ombros.';
    } else if (statusLabel === 'Proficiente') {
      nextStep = 'Realize 3 passagens perfeitas consecutivas para alcançar o nível Dominado.';
    } else {
      nextStep = 'Habilidade dominada! Mantenha a revisão espaçada ativa no seu plano de prática.';
    }

    const item: SkillDomainItem = {
      id: s.id,
      name: s.name,
      description: mapping.description,
      area: mapping.area,
      level: s.level,
      isEvaluated: hasEvidence,
      masteryLevel: liveProfile?.masteryLevel || 'not_started',
      statusLabel,
      masteryScore,
      attemptsCount: liveProfile?.attemptsCount || 0,
      correctCount: liveProfile?.correctCount || 0,
      accuracyPercent: liveProfile && liveProfile.attemptsCount > 0 ? Math.round((liveProfile.correctCount / liveProfile.attemptsCount) * 100) : 0,
      targetTab: mapping.area === 'rhythm_precision' ? 'metronome' : mapping.area === 'chord_shapes' || mapping.area === 'chord_transitions' ? 'chords' : mapping.area === 'scales' || mapping.area === 'intervals' ? 'fretboard' : 'practice-routine',
      recurringErrorsCount: liveProfile && liveProfile.recurringErrors ? Object.values(liveProfile.recurringErrors).reduce((a, b) => a + b, 0) : 0,
      evidencesCount: liveProfile?.evidences?.length || 0,
      lastPracticedDate: liveProfile?.lastPracticedDate || null,
      nextReviewDate: liveProfile?.nextReviewDate || null,
      relatedLessons,
      nextStepRecommendation: nextStep,
    };

    skillsByArea[mapping.area].push(item);
  }

  // Prepara resumo de áreas
  const areas: DomainAreaInfo[] = (Object.keys(DOMAIN_AREAS_METADATA) as DomainArea[]).map((areaKey) => {
    const list = skillsByArea[areaKey];
    return {
      id: areaKey,
      title: DOMAIN_AREAS_METADATA[areaKey].title,
      description: DOMAIN_AREAS_METADATA[areaKey].description,
      skillsCount: list.length,
      evaluatedSkillsCount: list.filter((s) => s.isEvaluated).length,
      masteredSkillsCount: list.filter((s) => s.masteryLevel === 'mastered').length,
    };
  });

  // Prepara domínios estruturados
  const domains = (Object.keys(DOMAIN_AREAS_METADATA) as DomainArea[]).map((areaKey) => {
    const list = skillsByArea[areaKey];
    const evaluated = list.filter((s) => s.isEvaluated && s.masteryScore !== null);
    const avgScore = evaluated.length > 0
      ? Math.round(evaluated.reduce((acc, s) => acc + (s.masteryScore || 0), 0) / evaluated.length)
      : null;

    return {
      area: areaKey,
      title: DOMAIN_AREAS_METADATA[areaKey].title,
      description: DOMAIN_AREAS_METADATA[areaKey].description,
      skills: list,
      evaluatedCount: evaluated.length,
      averageScore: avgScore,
    };
  });

  const allEvaluatedItems = Object.values(skillsByArea).flatMap((list) => list.filter((s) => s.isEvaluated && s.masteryScore !== null));
  const overallEvaluatedScore = allEvaluatedItems.length > 0
    ? Math.round(allEvaluatedItems.reduce((acc, s) => acc + (s.masteryScore || 0), 0) / allEvaluatedItems.length)
    : 0;

  return {
    domains,
    evaluatedSkillsCount: allEvaluatedItems.length,
    totalSkillsCount: CANONICAL_SKILLS.length,
    overallEvaluatedScore,
    areas,
    skillsByArea,
    totalEvaluated: allEvaluatedItems.length,
    totalMastered,
    overallMasteryPercent: profile.overallMasteryPercent || 0,
  };
}

/**
 * FASE 5: Recomendações Contextuais Determinísticas
 * Regras claras, explicáveis e ancoradas nos dados reais do estudante.
 */
export function getContextualRecommendations(progress: UserProgress): ContextualRecommendationItem[] {
  const recommendations: ContextualRecommendationItem[] = [];
  const today = getTodayIso();
  const profile = progress.pedagogicalProfile || createInitialPedagogicalProfile();

  // 1. Continuidade Imediata da Aula em Aberto ou Início da Formação
  const continuity = getLearningContinuity(progress);
  if (continuity.actionType === 'continue_in_progress' || continuity.actionType === 'start_journey' || continuity.actionType === 'start_next') {
    recommendations.push({
      id: `rec-cont-${continuity.currentLesson.id}`,
      type: 'continuity',
      title: continuity.actionType === 'start_journey' ? `Iniciar Aula: ${continuity.currentLesson.title}` : `Continuar Aula: ${continuity.currentLesson.title}`,
      subtitle: `${continuity.activeCourse.title} • ${continuity.currentLesson.moduleTitle}`,
      rationale: continuity.rationale,
      targetLessonId: continuity.currentLesson.id,
      targetTab: 'curriculum',
      suggestedMinutes: 15,
      priority: 1,
    });
  }

  // 2. Revisão Espaçada Pendente (Leitner)
  const pendingReviewSkill = Object.values(profile.skills).find(
    (s) => s.nextReviewDate && s.nextReviewDate <= today && s.attemptsCount > 0
  );
  if (pendingReviewSkill) {
    recommendations.push({
      id: `rec-review-${pendingReviewSkill.id}`,
      type: 'spaced_review',
      title: `Revisão Agendada: ${pendingReviewSkill.name}`,
      subtitle: `Memória Muscular • Intervalo de ${pendingReviewSkill.reviewIntervalDays || 1} dia(s)`,
      rationale: `O algoritmo de repetição espaçada agendou esta revisão para hoje. 10 minutos bastam para reforçar o aprendizado.`,
      targetTab: pendingReviewSkill.category === 'chord_shapes' ? 'chords' : 'metronome',
      suggestedMinutes: 10,
      priority: 2,
    });
  }

  // 3. Exercício Físico Não Concluído
  const completedLessonsSet = new Set(progress.completedLessons || []);
  const allLessons = getAllLessons();
  const uncompletedWithExercise = allLessons.find(
    (l) => !completedLessonsSet.has(l.id) && l.practicalExercise && (progress.exerciseRepetitions?.[l.practicalExercise.id || ''] || 0) < 5
  );

  if (uncompletedWithExercise && uncompletedWithExercise.practicalExercise) {
    recommendations.push({
      id: `rec-drill-${uncompletedWithExercise.id}`,
      type: 'drill',
      title: `Treino Instrumental: ${uncompletedWithExercise.practicalExercise.title}`,
      subtitle: `Andamento Alvo: ${uncompletedWithExercise.practicalExercise.targetBpm} BPM`,
      rationale: 'Exercício motor fundamental com tablatura para consolidar a precisão no instrumento.',
      targetLessonId: uncompletedWithExercise.id,
      targetTab: 'curriculum',
      suggestedMinutes: 12,
      priority: 3,
    });
  }

  // 4. Habilidades Ainda Não Avaliadas
  const unevaluated = Object.values(profile.skills).find((s) => s.attemptsCount === 0);
  if (unevaluated) {
    recommendations.push({
      id: `rec-found-${unevaluated.id}`,
      type: 'foundation',
      title: `Habilidade Fundamental: ${unevaluated.name}`,
      subtitle: 'Ainda não avaliada no seu perfil de domínio',
      rationale: 'Dedique alguns minutos com o metrônomo para testar sua execução e calibrar seu mapa de habilidades.',
      targetTab: unevaluated.category === 'rhythm' ? 'metronome' : 'fretboard',
      suggestedMinutes: 10,
      priority: 4,
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 4);
}

/**
 * FASE 6: Métricas de Prática Real (Diferenciando Tempo Manual x Interativo)
 */
export function getPracticeMetrics(progress: UserProgress): PracticeMetricsSummary {
  const manualLogs = progress.manualPracticeLogs || [];
  const interactiveSessions = progress.practiceSessions || [];

  const manualOfflineSeconds = manualLogs.reduce((acc, log) => acc + (log.durationMinutes * 60), 0);
  const verifiedInteractiveSeconds = interactiveSessions.reduce(
    (acc, s) => acc + (s.effectiveStudyTimeSeconds || 0),
    0
  );

  const dailyGoalMinutes = Math.max(5, progress.dailyGoalMinutes || 20);
  const dailyGoalSeconds = dailyGoalMinutes * 60;
  const todayStudyTimeSeconds = progress.todayStudyTimeSeconds || 0;
  const goalPercentage = Math.round((todayStudyTimeSeconds / dailyGoalSeconds) * 100);

  return {
    totalStudyTimeSeconds: progress.totalStudyTimeSeconds || 0,
    todayStudyTimeSeconds,
    dailyGoalMinutes,
    goalPercentage,
    isGoalReached: todayStudyTimeSeconds >= dailyGoalSeconds,
    manualOfflineSeconds,
    verifiedInteractiveSeconds,
    manualLogsCount: manualLogs.length,
    interactiveSessionsCount: interactiveSessions.length,
  };
}

/**
 * FASE 3: Gerador do Plano Inteligente de Prática Diária
 * Estrutura de 5 etapas progressivas nas durações: 10, 15, 20, 30, 45, 60 min.
 */
export function generateDailyPracticePlan(
  durationMinutes: 10 | 15 | 20 | 30 | 45 | 60,
  progress: UserProgress
): DailyPracticePlan {
  const level = progress.studyPlan?.selectedLevel ?? 0;
  const continuity = getLearningContinuity(progress);

  // Seleciona exercícios reais do catálogo
  const warmupDrill = PRACTICE_EXERCISE_CATALOG['drill-warmup-spider'] || PRACTICE_EXERCISE_CATALOG['drill-alt-picking-1234'];
  const skillDrill = level >= 2
    ? PRACTICE_EXERCISE_CATALOG['drill-penta-pos1-flow']
    : PRACTICE_EXERCISE_CATALOG['drill-alt-picking-1234'];
  const applicationDrill = level >= 2
    ? PRACTICE_EXERCISE_CATALOG['drill-solo-bend-3fingers-target']
    : PRACTICE_EXERCISE_CATALOG['drill-worship-anchor-chords'];

  // Distribuição de minutos por etapa garantindo 5 etapas em todas as durações
  let wM = 2; // Aquecimento
  let sM = 2; // Habilidade
  let aM = 3; // Aplicação
  let rM = 2; // Revisão
  let eM = 1; // Encerramento

  if (durationMinutes === 10) {
    wM = 2; sM = 2; aM = 3; rM = 2; eM = 1;
  } else if (durationMinutes === 15) {
    wM = 3; sM = 4; aM = 4; rM = 3; eM = 1;
  } else if (durationMinutes === 20) {
    wM = 4; sM = 5; aM = 6; rM = 3; eM = 2;
  } else if (durationMinutes === 30) {
    wM = 5; sM = 8; aM = 9; rM = 5; eM = 3;
  } else if (durationMinutes === 45) {
    wM = 7; sM = 12; aM = 14; rM = 8; eM = 4;
  } else if (durationMinutes === 60) {
    wM = 10; sM = 15; aM = 18; rM = 12; eM = 5;
  }

  const steps: DailyPracticePlanStep[] = [
    {
      stepNumber: 1,
      phase: 'Aquecimento Técnico',
      title: warmupDrill.title,
      description: warmupDrill.subtitle,
      durationMinutes: wM,
      bpm: warmupDrill.initialBpm,
      tablatureSnippet: warmupDrill.tablatureText,
      instructions: warmupDrill.biomechanicsInstructions.slice(0, 2),
      exerciseId: warmupDrill.id,
    },
    {
      stepNumber: 2,
      phase: 'Exercício de Habilidade',
      title: skillDrill.title,
      description: skillDrill.subtitle,
      durationMinutes: sM,
      bpm: skillDrill.initialBpm,
      tablatureSnippet: skillDrill.tablatureText,
      instructions: skillDrill.biomechanicsInstructions.slice(0, 2),
      exerciseId: skillDrill.id,
    },
    {
      stepNumber: 3,
      phase: 'Aplicação Musical',
      title: applicationDrill.title,
      description: applicationDrill.subtitle,
      durationMinutes: aM,
      bpm: applicationDrill.initialBpm,
      tablatureSnippet: applicationDrill.tablatureText,
      instructions: applicationDrill.biomechanicsInstructions.slice(0, 2),
      exerciseId: applicationDrill.id,
    },
    {
      stepNumber: 4,
      phase: 'Revisão de Conteúdo',
      title: `Revisão: ${continuity.currentLesson.title}`,
      description: `Fixação do ${continuity.currentLesson.moduleTitle}`,
      durationMinutes: rM,
      instructions: [
        'Toque a sequência da aula sem interrupções por 3 ciclos completos.',
        'Preste atenção no relaxamento dos tendões da mão esquerda.',
      ],
      exerciseId: continuity.currentLesson.id,
    },
    {
      stepNumber: 5,
      phase: 'Encerramento & Registro',
      title: 'Encerramento & Autoavaliação Instrumental',
      description: 'Análise da postura, percepção de esforço e registro da sessão diária.',
      durationMinutes: eM,
      instructions: [
        'Avalie se houve fadiga ou tensão excessiva nos dedos.',
        'Confirme a gravação do tempo efetivo no seu histórico de evolução.',
      ],
    },
  ];

  return {
    durationMinutes,
    focusTitle: `Sessão de ${durationMinutes} min • Foco em ${skillDrill.category}`,
    rationale: `Plano estruturado para o ${continuity.activeCourse.title}, integrando técnica mecânica, ritmo e aplicação no instrumento real.`,
    steps,
    totalMinutes: durationMinutes,
    totalEstimatedMinutes: durationMinutes,
  };
}

export const learningEngine = {
  COURSES_CATALOG,
  getAllLessons,
  getLessonById,
  getCourseId,
  getCourseLessons,
  getCourseProgressSummary,
  getLearningContinuity,
  getSkillEvolutionMap,
  getContextualRecommendations,
  getPracticeMetrics,
  generateDailyPracticePlan,
};
