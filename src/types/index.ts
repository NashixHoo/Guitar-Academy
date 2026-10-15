export type NoteCipher = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
export type NotePortuguese = 'Dó' | 'Dó#' | 'Ré' | 'Ré#' | 'Mi' | 'Fá' | 'Fá#' | 'Sol' | 'Sol#' | 'Lá' | 'Lá#' | 'Si';

export type ChordType = 
  | 'major' 
  | 'minor' 
  | '7' 
  | 'maj7' 
  | 'm7' 
  | 'sus2' 
  | 'sus4' 
  | 'dim' 
  | 'aug' 
  | '6' 
  | 'm6' 
  | '9' 
  | 'add9' 
  | '5' 
  | 'm7b5';

export interface ChordShape {
  id: string;
  root: NoteCipher;
  rootPt: NotePortuguese;
  type: ChordType;
  symbol: string;
  namePt: string;
  formula: string;
  intervals: string[];
  notes: NoteCipher[];
  notesPt: NotePortuguese[];
  frets: (number | -1)[]; // 6 values from 6th (low E) to 1st (high E). -1 means muted (X), 0 means open (O)
  fingers: (number | 0)[]; // 0 means open/none, 1 index, 2 middle, 3 ring, 4 pinky
  baseFret?: number; // Starting fret if higher than 1
  barre?: { fret: number; fromString: number; toString: number };
  description: string;
  category: 'Iniciante' | 'Intermediário' | 'Avançado';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonPart {
  id: string;
  title: string;
  contentMarkdown: string;
  audioExampleId?: string;
  fretboardHighlight?: {
    frets: { stringIndex: number; fret: number; label?: string }[];
  };
}

export interface PracticalExercise {
  id: string;
  title: string;
  subtitle: string;
  targetBpm: number;
  targetRepetitions: number;
  timeSignature: { beats: number; noteValue: number };
  pickingPattern: string; // e.g. '↓ ↑ ↓ ↑ ↓ ↑ (Down-Up estrito)'
  notesSequence: {
    stringNumber: number; // 6, 5, 4, 3, 2, 1
    noteCipher: NoteCipher;
    notePt: NotePortuguese;
    pickDirection: 'down' | 'up';
    fret: number;
  }[];
  tablatureText: string;
  instructions: string[];
  biomechanicTips: string[];
  validationCriteria: string;
}

export interface Lesson {
  id: string;
  level: number; // 0 to 5
  moduleTitle: string;
  lessonNumber: number;
  title: string;
  subtitle: string;
  objective: string;
  estimatedMinutes: number;
  parts: LessonPart[];
  quiz?: {
    questions: QuizQuestion[];
    passingScore: number;
  };
  practicalExercise?: PracticalExercise;
}

export interface LevelInfo {
  level: number;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  lessons: Lesson[];
}

export interface LessonPracticeLog {
  lessonId: string;
  status: 'viewed' | 'practicing' | 'mastered';
  practicedBpm: number;
  confidence: 'needs_review' | 'playable_slow' | 'mastered_with_metronome';
  notes?: string;
  lastPracticedDate: string;
  timesPracticed: number;
  needsReview: boolean;
  exerciseRepetitions?: number;
  targetRepetitionsMet?: boolean;
}

export interface StudyPlanProfile {
  selectedLevel: number; // 0 to 5
  primaryGoal: 'fundamentals' | 'worship_open_chords' | 'pentatonics_solos' | 'technique_speed' | 'harmony_improvisation';
  dailyRoutineMinutes: 10 | 20 | 30;
  startDate: string;
}

export interface TabNote {
  stringNumber: number; // 1 (high E) to 6 (low E)
  fret: number;
  finger?: number;
  technique?: 'h' | 'p' | 'b' | 'r' | 's' | '~' | 'pm' | 'none';
  duration?: string;
}

export interface TabMeasure {
  id: string;
  timeSignature?: string;
  beats: TabNote[][]; // array of vertical beats/chords
  chordSymbol?: string;
  lyricsOrCount?: string;
}

export interface TabSnippet {
  id: string;
  title: string;
  bpm: number;
  measures: TabMeasure[];
  audioExampleNotes?: { freq: number; duration: number }[];
  instruction?: string;
}

export interface UserProgress {
  currentLessonId: string;
  completedLessons: string[];
  practiceLogs: Record<string, LessonPracticeLog>;
  exerciseRepetitions: Record<string, number>; // exerciseId -> count
  studyPlan: StudyPlanProfile;
  quizScores: Record<string, { score: number; total: number; date: string }>;
  frequentErrors: Record<string, number>;
  totalStudyTimeSeconds: number;
  todayStudyTimeSeconds: number;
  lastStudyDate: string;
  practicedBpm: number;
  favoriteChords: string[];
  notationPreference: 'cipher' | 'portuguese' | 'both';
  preferredTuning: 'standard' | 'dropD' | 'halfStepDown';
  dailyGoalMinutes: number;
  achievements: string[];
}

export interface MetronomeConfig {
  bpm: number;
  timeSignature: { beats: number; noteValue: number };
  subdivision: 'quarter' | 'eighth' | 'triplet' | 'sixteenth';
  accentFirstBeat: boolean;
  volume: number;
  timerMinutes: number;
  speedTrainer: {
    enabled: boolean;
    bpmIncrement: number;
    everyMeasures: number;
    targetBpm: number;
  };
}

export type NavigationTab = 
  | 'home'
  | 'curriculum'
  | 'practice-routine'
  | 'fretboard'
  | 'chords'
  | 'metronome'
  | 'theory'
  | 'reading'
  | 'ear-training'
  | 'technique'
  | 'library'
  | 'progress'
  | 'settings';

