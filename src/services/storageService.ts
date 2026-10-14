import { UserProgress, MetronomeConfig } from '../types';

const PROGRESS_KEY = 'guitar_academy_user_progress_v1';
const METRONOME_KEY = 'guitar_academy_metronome_v1';

export const INITIAL_PROGRESS: UserProgress = {
  currentLessonId: 'lesson-1',
  completedLessons: [],
  quizScores: {},
  frequentErrors: {},
  totalStudyTimeSeconds: 0,
  todayStudyTimeSeconds: 0,
  lastStudyDate: new Date().toISOString().split('T')[0],
  practicedBpm: 80,
  favoriteChords: ['c-major-open', 'g-major-open', 'e-minor-open', 'a-minor-open', 'd-major-open'],
  notationPreference: 'cipher',
  preferredTuning: 'standard',
  dailyGoalMinutes: 20,
  achievements: ['welcome-pioneer'],
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

export const storageService = {
  loadProgress(): UserProgress {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      if (!data) return INITIAL_PROGRESS;
      const parsed: UserProgress = JSON.parse(data);

      // Check if day changed to reset todayStudyTimeSeconds
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastStudyDate !== today) {
        parsed.todayStudyTimeSeconds = 0;
        parsed.lastStudyDate = today;
      }
      return { ...INITIAL_PROGRESS, ...parsed };
    } catch {
      return INITIAL_PROGRESS;
    }
  },

  saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (err) {
      console.warn('Failed to save progress to localStorage', err);
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

  saveMetronome(config: MetronomeConfig): void {
    try {
      localStorage.setItem(METRONOME_KEY, JSON.stringify(config));
    } catch (err) {
      console.warn('Failed to save metronome config to localStorage', err);
    }
  },

  exportBackup(): void {
    const progress = this.loadProgress();
    const metronome = this.loadMetronome();
    const payload = {
      exportDate: new Date().toISOString(),
      app: 'Guitar Academy V1.0',
      progress,
      metronome,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guitar-academy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.progress) {
        this.saveProgress(parsed.progress);
      }
      if (parsed.metronome) {
        this.saveMetronome(parsed.metronome);
      }
      return true;
    } catch (err) {
      console.error('Failed to parse backup JSON', err);
      return false;
    }
  },

  resetAll(): void {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(METRONOME_KEY);
  }
};
