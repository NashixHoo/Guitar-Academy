import { UserProgress, MetronomeConfig, PracticeSessionRecord } from '../types';
import {
  createInitialPedagogicalProfile,
  migrateLegacyProgressToPedagogical,
  recordSkillEvidence,
  LESSON_TO_SKILL_MAP,
} from '../pedagogy/adaptiveEngine';

const PROGRESS_KEY = 'guitar_academy_user_progress_v1';
const METRONOME_KEY = 'guitar_academy_metronome_v1';
const SEARCH_HISTORY_KEY = 'guitar_academy_search_history_v1';

/**
 * Retorna a data local (calendário do dispositivo do usuário) no formato YYYY-MM-DD.
 * 
 * MOTIVAÇÃO & PROBLEMA RESOLVIDO:
 * O uso de `new Date().toISOString().split('T')[0]` obtém a data no fuso UTC (00:00Z).
 * Em fusos com horário atrasado em relação a Greenwich (ex: Brasil UTC-3), a partir das
 * 21:00 o UTC já virou o dia seguinte. Isso provocava reset prematuro de todayStudyTimeSeconds
 * e gravava registros em datas futuras incorretas.
 * 
 * Esta função extrai ano, mês e dia no fuso horário local do estudante,
 * garantindo alinhamento perfeito com o relógio físico e a vivência do aluno.
 * 
 * @param date Data opcional para conversão (padrão: new Date())
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface StorageSaveResult {
  success: boolean;
  error?: string;
  isQuotaExceeded?: boolean;
}

export interface BackupValidationResult {
  isValid: boolean;
  error?: string;
  progress?: UserProgress;
  metronome?: MetronomeConfig;
  exportDate?: string;
  app?: string;
}

export interface ImportBackupResult {
  success: boolean;
  error?: string;
  message?: string;
}

export const INITIAL_PROGRESS: UserProgress = {
  currentLessonId: 'lesson-1',
  completedLessons: [],
  practiceLogs: {},
  exerciseRepetitions: {},
  studyPlan: {
    selectedLevel: 0,
    primaryGoal: 'fundamentals',
    dailyRoutineMinutes: 20,
    startDate: getLocalDateString(),
  },
  quizScores: {},
  frequentErrors: {},
  totalStudyTimeSeconds: 0,
  todayStudyTimeSeconds: 0,
  lastStudyDate: getLocalDateString(),
  practicedBpm: 80,
  favoriteChords: ['c-major-open', 'g-major-open', 'e-minor-open', 'a-minor-open', 'd-major-open'],
  notationPreference: 'cipher',
  preferredTuning: 'standard',
  dailyGoalMinutes: 20,
  themePreference: 'light',
  achievements: ['welcome-pioneer'],
  pedagogicalProfile: createInitialPedagogicalProfile(),
};

export const INITIAL_METRONOME: MetronomeConfig = {
  bpm: 100,
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: 'quarter',
  accentFirstBeat: true,
  volume: 0.8,
  timerMinutes: 10,
  speedTrainer: {
    enabled: false,
    bpmIncrement: 5,
    everyMeasures: 4,
    targetBpm: 160,
  },
};

export function validateBackupData(data: unknown): BackupValidationResult {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {
      isValid: false,
      error: 'O arquivo fornecido não é um objeto JSON válido.',
    };
  }

  const rawObj = data as Record<string, any>;

  // Detecta se é o envelope completo { app, exportDate, progress, metronome } ou exportação direta de progress
  let progressCandidate: any;
  let metronomeCandidate: any;
  let exportDate: string | undefined;
  let app: string | undefined;

  if ('progress' in rawObj && typeof rawObj.progress === 'object' && rawObj.progress !== null) {
    // Envelope completo
    progressCandidate = rawObj.progress;
    metronomeCandidate = rawObj.metronome;
    exportDate = typeof rawObj.exportDate === 'string' ? rawObj.exportDate : undefined;
    app = typeof rawObj.app === 'string' ? rawObj.app : undefined;
  } else if ('completedLessons' in rawObj || 'currentLessonId' in rawObj) {
    // Objeto UserProgress direto
    progressCandidate = rawObj;
  } else {
    return {
      isValid: false,
      error: 'Estrutura de dados não reconhecida. Nem envelope de backup nem dados de progresso encontrados.',
    };
  }

  // Validação estrita de campos do progresso
  if (typeof progressCandidate !== 'object' || progressCandidate === null || Array.isArray(progressCandidate)) {
    return {
      isValid: false,
      error: 'Objeto de progresso corrompido ou ausente.',
    };
  }

  if (progressCandidate.completedLessons !== undefined && !Array.isArray(progressCandidate.completedLessons)) {
    return {
      isValid: false,
      error: 'O campo "completedLessons" deve ser uma lista de identificadores de aulas.',
    };
  }

  if (progressCandidate.practiceLogs !== undefined && (typeof progressCandidate.practiceLogs !== 'object' || progressCandidate.practiceLogs === null || Array.isArray(progressCandidate.practiceLogs))) {
    return {
      isValid: false,
      error: 'O campo "practiceLogs" deve ser um mapa de registros por aula.',
    };
  }

  if (progressCandidate.exerciseRepetitions !== undefined && (typeof progressCandidate.exerciseRepetitions !== 'object' || progressCandidate.exerciseRepetitions === null || Array.isArray(progressCandidate.exerciseRepetitions))) {
    return {
      isValid: false,
      error: 'O campo "exerciseRepetitions" deve ser um mapa de contagens por exercício.',
    };
  }

  // Sanitização e migração segura preservando a integridade pedagógica
  const sanitizedProgress: UserProgress = {
    ...INITIAL_PROGRESS,
    ...progressCandidate,
    currentLessonId: typeof progressCandidate.currentLessonId === 'string' && progressCandidate.currentLessonId
      ? progressCandidate.currentLessonId
      : INITIAL_PROGRESS.currentLessonId,
    completedLessons: Array.isArray(progressCandidate.completedLessons)
      ? progressCandidate.completedLessons.filter((id: any): id is string => typeof id === 'string')
      : [],
    practiceLogs: typeof progressCandidate.practiceLogs === 'object' && progressCandidate.practiceLogs !== null && !Array.isArray(progressCandidate.practiceLogs)
      ? progressCandidate.practiceLogs
      : {},
    exerciseRepetitions: typeof progressCandidate.exerciseRepetitions === 'object' && progressCandidate.exerciseRepetitions !== null && !Array.isArray(progressCandidate.exerciseRepetitions)
      ? progressCandidate.exerciseRepetitions
      : {},
    studyPlan: {
      ...INITIAL_PROGRESS.studyPlan,
      ...(typeof progressCandidate.studyPlan === 'object' && progressCandidate.studyPlan !== null ? progressCandidate.studyPlan : {}),
      startDate: progressCandidate.studyPlan?.startDate || getLocalDateString(),
    },
    quizScores: typeof progressCandidate.quizScores === 'object' && progressCandidate.quizScores !== null && !Array.isArray(progressCandidate.quizScores)
      ? progressCandidate.quizScores
      : {},
    frequentErrors: typeof progressCandidate.frequentErrors === 'object' && progressCandidate.frequentErrors !== null && !Array.isArray(progressCandidate.frequentErrors)
      ? progressCandidate.frequentErrors
      : {},
    totalStudyTimeSeconds: typeof progressCandidate.totalStudyTimeSeconds === 'number' && !isNaN(progressCandidate.totalStudyTimeSeconds)
      ? Math.max(0, progressCandidate.totalStudyTimeSeconds)
      : 0,
    todayStudyTimeSeconds: typeof progressCandidate.todayStudyTimeSeconds === 'number' && !isNaN(progressCandidate.todayStudyTimeSeconds)
      ? Math.max(0, progressCandidate.todayStudyTimeSeconds)
      : 0,
    lastStudyDate: typeof progressCandidate.lastStudyDate === 'string' && progressCandidate.lastStudyDate
      ? progressCandidate.lastStudyDate
      : getLocalDateString(),
    practicedBpm: typeof progressCandidate.practicedBpm === 'number' && !isNaN(progressCandidate.practicedBpm)
      ? Math.max(30, Math.min(260, progressCandidate.practicedBpm))
      : 80,
    favoriteChords: Array.isArray(progressCandidate.favoriteChords)
      ? progressCandidate.favoriteChords.filter((c: any): c is string => typeof c === 'string')
      : INITIAL_PROGRESS.favoriteChords,
    notationPreference: progressCandidate.notationPreference === 'solfege' ? 'solfege' : 'cipher',
    preferredTuning: progressCandidate.preferredTuning || 'standard',
    dailyGoalMinutes: typeof progressCandidate.dailyGoalMinutes === 'number' && !isNaN(progressCandidate.dailyGoalMinutes)
      ? Math.max(5, Math.min(240, progressCandidate.dailyGoalMinutes))
      : 20,
    themePreference: progressCandidate.themePreference === 'dark' ? 'dark' : progressCandidate.themePreference === 'system' ? 'system' : 'light',
    achievements: Array.isArray(progressCandidate.achievements)
      ? progressCandidate.achievements.filter((a: any): a is string => typeof a === 'string')
      : INITIAL_PROGRESS.achievements,
    practiceSessions: Array.isArray(progressCandidate.practiceSessions)
      ? progressCandidate.practiceSessions
      : [],
  };

  // Garante integridade do Perfil Pedagógico Adaptativo
  sanitizedProgress.pedagogicalProfile = migrateLegacyProgressToPedagogical(sanitizedProgress);

  // Sanitização do Metrônomo se fornecido
  let sanitizedMetronome: MetronomeConfig | undefined;
  if (metronomeCandidate && typeof metronomeCandidate === 'object' && !Array.isArray(metronomeCandidate)) {
    sanitizedMetronome = {
      ...INITIAL_METRONOME,
      ...metronomeCandidate,
      bpm: typeof metronomeCandidate.bpm === 'number' && !isNaN(metronomeCandidate.bpm)
        ? Math.max(30, Math.min(300, metronomeCandidate.bpm))
        : INITIAL_METRONOME.bpm,
      volume: typeof metronomeCandidate.volume === 'number' && !isNaN(metronomeCandidate.volume)
        ? Math.max(0, Math.min(1, metronomeCandidate.volume))
        : INITIAL_METRONOME.volume,
      timerMinutes: typeof metronomeCandidate.timerMinutes === 'number' && !isNaN(metronomeCandidate.timerMinutes)
        ? Math.max(1, Math.min(120, metronomeCandidate.timerMinutes))
        : INITIAL_METRONOME.timerMinutes,
    };
  }

  return {
    isValid: true,
    progress: sanitizedProgress,
    metronome: sanitizedMetronome,
    exportDate,
    app,
  };
}

export const storageService = {
  getLocalDateString,
  validateBackupData,

  loadProgress(): UserProgress {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      if (!data) return INITIAL_PROGRESS;
      const parsed: UserProgress = JSON.parse(data);

      // Reset diário sincronizado estritamente com o calendário LOCAL do usuário (YYYY-MM-DD)
      const todayLocal = getLocalDateString();
      if (parsed.lastStudyDate !== todayLocal) {
        parsed.todayStudyTimeSeconds = 0;
        parsed.lastStudyDate = todayLocal;
      }

      // Safe migration: ensure practiceLogs, exerciseRepetitions and studyPlan exist
      const migrated: UserProgress = {
        ...INITIAL_PROGRESS,
        ...parsed,
        practiceLogs: parsed.practiceLogs || {},
        exerciseRepetitions: parsed.exerciseRepetitions || {},
        studyPlan: {
          ...INITIAL_PROGRESS.studyPlan,
          ...(parsed.studyPlan || {}),
          startDate: parsed.studyPlan?.startDate || INITIAL_PROGRESS.studyPlan.startDate,
        },
      };

      // Migração automática e compatível do Perfil Pedagógico Adaptativo
      migrated.pedagogicalProfile = migrateLegacyProgressToPedagogical(migrated);

      return migrated;
    } catch {
      return INITIAL_PROGRESS;
    }
  },

  saveLessonPractice(
    lessonId: string,
    practiceData: {
      status?: 'viewed' | 'practicing' | 'mastered';
      practicedBpm?: number;
      confidence?: 'needs_review' | 'playable_slow' | 'mastered_with_metronome';
      notes?: string;
      needsReview?: boolean;
      exerciseRepetitions?: number;
      targetRepetitionsMet?: boolean;
    }
  ): UserProgress {
    const current = this.loadProgress();
    const todayLocal = getLocalDateString();
    const existingLog = current.practiceLogs[lessonId] || {
      lessonId,
      status: 'viewed',
      practicedBpm: 60,
      confidence: 'playable_slow',
      lastPracticedDate: todayLocal,
      timesPracticed: 0,
      needsReview: false,
    };

    const updatedLog = {
      ...existingLog,
      ...practiceData,
      lastPracticedDate: todayLocal,
      timesPracticed: existingLog.timesPracticed + 1,
    };

    let updatedProfile = current.pedagogicalProfile || createInitialPedagogicalProfile();

    // Somente se houver domínio comprovado (ex.: status 'mastered' com metronomo ou repetições)
    if (practiceData.status === 'mastered') {
      const skillId = LESSON_TO_SKILL_MAP[lessonId];
      if (skillId) {
        updatedProfile = recordSkillEvidence(updatedProfile, skillId, {
          source: 'lesson_quiz',
          score: 85,
          details: `Prática da aula ${lessonId} concluída no andamento ${practiceData.practicedBpm || 60} BPM.`,
        });
      }
    }

    const updated: UserProgress = {
      ...current,
      practiceLogs: {
        ...current.practiceLogs,
        [lessonId]: updatedLog,
      },
      currentLessonId: lessonId,
      practicedBpm: practiceData.practicedBpm || current.practicedBpm,
      pedagogicalProfile: updatedProfile,
    };

    if (practiceData.status === 'mastered' && !updated.completedLessons.includes(lessonId)) {
      updated.completedLessons = [...updated.completedLessons, lessonId];
    }

    this.saveProgress(updated);
    return updated;
  },

  recordExerciseRepetition(
    lessonId: string,
    exerciseId: string,
    totalCount: number,
    targetRepetitions: number,
    bpm: number
  ): UserProgress {
    const current = this.loadProgress();
    const todayLocal = getLocalDateString();
    const existingLog = current.practiceLogs[lessonId] || {
      lessonId,
      status: 'practicing',
      practicedBpm: bpm,
      confidence: 'playable_slow',
      lastPracticedDate: todayLocal,
      timesPracticed: 0,
      needsReview: false,
    };

    const targetMet = totalCount >= targetRepetitions;

    const updatedLog = {
      ...existingLog,
      exerciseRepetitions: totalCount,
      targetRepetitionsMet: targetMet || existingLog.targetRepetitionsMet,
      practicedBpm: bpm,
      lastPracticedDate: todayLocal,
      confidence: targetMet ? ('mastered_with_metronome' as const) : existingLog.confidence,
    };

    const updatedAchievements = [...current.achievements];
    if (targetMet && !updatedAchievements.includes('master-open-strings-60bpm')) {
      updatedAchievements.push('master-open-strings-60bpm');
    }

    let updatedProfile = current.pedagogicalProfile || createInitialPedagogicalProfile();
    if (targetMet) {
      const skillId = LESSON_TO_SKILL_MAP[lessonId] || 'skill-alternate-picking';
      updatedProfile = recordSkillEvidence(updatedProfile, skillId, {
        source: 'exercise_repetitions',
        score: 90,
        details: `Exercício prático ${exerciseId}: meta de ${targetRepetitions} repetições atingida a ${bpm} BPM.`,
      });
    }

    const updated: UserProgress = {
      ...current,
      exerciseRepetitions: {
        ...(current.exerciseRepetitions || {}),
        [exerciseId]: totalCount,
      },
      practiceLogs: {
        ...current.practiceLogs,
        [lessonId]: updatedLog,
      },
      achievements: updatedAchievements,
      practicedBpm: bpm,
      pedagogicalProfile: updatedProfile,
    };

    this.saveProgress(updated);
    return updated;
  },

  recordQuizScore(
    lessonId: string,
    scorePct: number,
    totalQuestions: number,
    errors: Record<string, number> = {}
  ): UserProgress {
    const current = this.loadProgress();
    const updatedCompleted = current.completedLessons.includes(lessonId)
      ? current.completedLessons
      : [...current.completedLessons, lessonId];

    const updatedScores = {
      ...current.quizScores,
      [lessonId]: {
        score: scorePct,
        total: totalQuestions,
        date: new Date().toISOString(),
      },
    };

    const skillId = LESSON_TO_SKILL_MAP[lessonId];
    let updatedProfile = current.pedagogicalProfile || createInitialPedagogicalProfile();
    if (skillId) {
      updatedProfile = recordSkillEvidence(updatedProfile, skillId, {
        source: 'lesson_quiz',
        score: scorePct,
        details: `Quiz da aula ${lessonId}: ${scorePct}% de acertos em ${totalQuestions} questões.`,
      });
    }

    const updated: UserProgress = {
      ...current,
      completedLessons: updatedCompleted,
      quizScores: updatedScores,
      frequentErrors: {
        ...current.frequentErrors,
        ...errors,
      },
      pedagogicalProfile: updatedProfile,
    };

    this.saveProgress(updated);
    return updated;
  },

  recordSkillEvidence(
    skillId: string,
    evidence: {
      source: 'lesson_quiz' | 'exercise_repetitions' | 'guitar_coach_audio' | 'professor_exercise' | 'practice_session' | 'self_evaluation';
      score?: number;
      accuracyPercent?: number;
      details: string;
      errorTag?: string;
    }
  ): UserProgress {
    const current = this.loadProgress();
    const updatedProfile = recordSkillEvidence(
      current.pedagogicalProfile || createInitialPedagogicalProfile(),
      skillId,
      evidence
    );
    const updated: UserProgress = {
      ...current,
      pedagogicalProfile: updatedProfile,
    };
    this.saveProgress(updated);
    return updated;
  },

  recordPracticeSession(session: PracticeSessionRecord): UserProgress {
    const current = this.loadProgress();

    // 1. Prevenção de duplicação por ID
    const existingSessions = current.practiceSessions || [];
    if (existingSessions.some((s) => s.id === session.id)) {
      return current;
    }

    // 2. Atualiza tempo de estudo efetivo (contar apenas tempo ativo em execução)
    const effectiveSeconds = Math.max(0, session.effectiveStudyTimeSeconds || 0);
    const todaySeconds = (current.todayStudyTimeSeconds || 0) + effectiveSeconds;
    const totalSeconds = (current.totalStudyTimeSeconds || 0) + effectiveSeconds;

    // 3. Atualiza BPM praticado se for superior
    let updatedBpm = current.practicedBpm;
    if (session.highestBpm && session.highestBpm > updatedBpm) {
      updatedBpm = session.highestBpm;
    }

    // 4. Alimenta perfil pedagógico deterministicamente para cada habilidade praticada
    let updatedProfile = current.pedagogicalProfile || createInitialPedagogicalProfile();

    session.steps.forEach((step) => {
      if (step.skillId && step.completed) {
        const score = step.selfRating === 'mastered' ? 95 : step.selfRating === 'consistent' ? 85 : 60;
        
        updatedProfile = recordSkillEvidence(updatedProfile, step.skillId, {
          source: 'practice_session',
          score,
          details: `Central de Prática (${session.durationPlannedMinutes} min): ${step.stepTitle} a ${step.finalBpm || step.initialBpm || 60} BPM. Autoavaliação: ${step.selfRating || 'praticado'}.`,
        });
      }
    });

    // 5. Histórico recente de sessões (limite de 50)
    const updatedSessions = [session, ...existingSessions].slice(0, 50);

    // 6. Conquistas
    const updatedAchievements = [...current.achievements];
    if (!updatedAchievements.includes('first-practice-session')) {
      updatedAchievements.push('first-practice-session');
    }
    if (updatedSessions.length >= 5 && !updatedAchievements.includes('consistent-practitioner')) {
      updatedAchievements.push('consistent-practitioner');
    }

    const updated: UserProgress = {
      ...current,
      todayStudyTimeSeconds: todaySeconds,
      totalStudyTimeSeconds: totalSeconds,
      practicedBpm: updatedBpm,
      lastStudyDate: getLocalDateString(),
      practiceSessions: updatedSessions,
      achievements: updatedAchievements,
      pedagogicalProfile: updatedProfile,
    };

    this.saveProgress(updated);
    return updated;
  },

  saveProgress(progress: UserProgress): StorageSaveResult {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      return { success: true };
    } catch (err: any) {
      console.warn('Failed to save progress to localStorage', err);
      const isQuota =
        err?.name === 'QuotaExceededError' ||
        err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err?.code === 22 ||
        err?.code === 1014;
      return {
        success: false,
        isQuotaExceeded: isQuota,
        error: isQuota
          ? 'O limite de armazenamento local (quota) do navegador foi atingido. Libere espaço ou faça um backup.'
          : (err?.message || 'Erro ao gravar dados no armazenamento local.'),
      };
    }
  },

  loadMetronome(): MetronomeConfig {
    try {
      const data = localStorage.getItem(METRONOME_KEY);
      if (!data) return INITIAL_METRONOME;
      return { ...INITIAL_METRONOME, ...JSON.parse(data) };
    } catch {
      return INITIAL_METRONOME;
    }
  },

  saveMetronome(config: MetronomeConfig): StorageSaveResult {
    try {
      localStorage.setItem(METRONOME_KEY, JSON.stringify(config));
      return { success: true };
    } catch (err: any) {
      console.warn('Failed to save metronome config to localStorage', err);
      const isQuota =
        err?.name === 'QuotaExceededError' ||
        err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err?.code === 22;
      return {
        success: false,
        isQuotaExceeded: isQuota,
        error: isQuota
          ? 'Limite de armazenamento atingido ao salvar configurações do metrônomo.'
          : (err?.message || 'Erro ao gravar configurações do metrônomo.'),
      };
    }
  },

  exportBackup(): { success: boolean; filename: string; payload: unknown; error?: string } {
    try {
      const progress = this.loadProgress();
      const metronome = this.loadMetronome();
      const localDate = getLocalDateString();
      const filename = `guitar-academy-backup-${localDate}.json`;
      const payload = {
        exportDate: new Date().toISOString(), // Timestamp real exato em UTC
        localDate, // Data de calendário local
        app: 'Guitar Academy V1.0',
        progress,
        metronome,
      };

      if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof Blob !== 'undefined') {
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      return {
        success: true,
        filename,
        payload,
      };
    } catch (err: any) {
      console.error('Falha ao exportar backup', err);
      return {
        success: false,
        filename: '',
        payload: null,
        error: err?.message || 'Falha ao gerar arquivo de backup.',
      };
    }
  },

  importBackup(jsonString: string): ImportBackupResult {
    try {
      if (!jsonString || typeof jsonString !== 'string' || !jsonString.trim()) {
        return {
          success: false,
          error: 'O arquivo de backup está vazio ou é inválido.',
        };
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonString);
      } catch (jsonErr: any) {
        return {
          success: false,
          error: `Formato JSON inválido: ${jsonErr?.message || 'erro de sintaxe no arquivo'}.`,
        };
      }

      const validation = validateBackupData(parsed);
      if (!validation.isValid || !validation.progress) {
        return {
          success: false,
          error: validation.error || 'A estrutura do arquivo não é compatível com o Guitar Academy.',
        };
      }

      // Salva apenas após validação 100% aprovada
      const saveResult = this.saveProgress(validation.progress);
      if (!saveResult.success) {
        return {
          success: false,
          error: saveResult.error || 'Falha ao gravar o progresso importado no armazenamento local.',
        };
      }

      if (validation.metronome) {
        const metronomeResult = this.saveMetronome(validation.metronome);
        if (!metronomeResult.success) {
          console.warn('Configuração de metrônomo não pôde ser salva:', metronomeResult.error);
        }
      }

      const lessonCount = validation.progress.completedLessons?.length || 0;
      return {
        success: true,
        message: `Backup restaurado com sucesso! (${lessonCount} aulas concluídas recuperadas).`,
      };
    } catch (err: any) {
      console.error('Failed to import backup', err);
      return {
        success: false,
        error: `Falha crítica na importação: ${err?.message || 'erro desconhecido'}.`,
      };
    }
  },

  getRecentSearches(): string[] {
    try {
      const data = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  addRecentSearch(term: string): string[] {
    const cleanTerm = term.trim();
    if (!cleanTerm) return this.getRecentSearches();
    try {
      const current = this.getRecentSearches();
      const updated = [cleanTerm, ...current.filter((t) => t.toLowerCase() !== cleanTerm.toLowerCase())].slice(0, 8);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [cleanTerm];
    }
  },

  removeRecentSearch(term: string): string[] {
    try {
      const current = this.getRecentSearches();
      const updated = current.filter((t) => t.toLowerCase() !== term.toLowerCase());
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch {
      // ignore
    }
  },

  resetAll(): void {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(METRONOME_KEY);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }
};
