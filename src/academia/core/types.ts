// =========================================================================
// GUITAR ACADEMY — MASTER CORE V1.0
// NÚCLEO DA MATRIZ CENTRAL: TIPOS E CONTRATOS DE DADOS ACADÊMICOS
// =========================================================================

// -------------------------------------------------------------------------
// 1. INSTRUMENTOS OFICIAIS DO CONSERVATÓRIO
// -------------------------------------------------------------------------
export type AcademicInstrumentId = 
  | 'violao' 
  | 'guitarra' 
  | 'baixo' 
  | 'teclado' 
  | 'bateria';

export type InstrumentFamily = 
  | 'cordas_acusticas' 
  | 'cordas_eletricas' 
  | 'teclas' 
  | 'percussao';

export interface AcademicInstrument {
  id: AcademicInstrumentId;
  name: string;
  namePlural: string;
  family: InstrumentFamily;
  description: string;
  tuningStandard?: string;
  stringsCount?: number;
  keysCount?: number;
  status: 'active' | 'in_development';
  icon: string;
}

// -------------------------------------------------------------------------
// 2. NÍVEIS ACADÊMICOS PADRONIZADOS (0 A 5)
// -------------------------------------------------------------------------
export type AcademicLevelNumber = 0 | 1 | 2 | 3 | 4 | 5;

export interface AcademicLevelDefinition {
  level: AcademicLevelNumber;
  code: string;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  prerequisitesDescription: string;
  graduationRequirement: string;
}

// -------------------------------------------------------------------------
// 3. COMPETÊNCIAS E HABILIDADES ACADÊMICAS
// -------------------------------------------------------------------------
export type CompetencyCategory = 
  | 'postura_ergonomia'
  | 'afinação_ouvido'
  | 'ritmo_tempo'
  | 'harmonia_acordes'
  | 'leitura_notacao'
  | 'tecnica_mecanica'
  | 'escalas_solos'
  | 'repertorio_performance'
  | 'independencia_coordenacao';

export interface AcademicCompetency {
  id: string;
  code: string;
  instrumentId: AcademicInstrumentId;
  level: AcademicLevelNumber;
  category: CompetencyCategory;
  title: string;
  description: string;
  rubricCriteria: string[];
}

// -------------------------------------------------------------------------
// 4. CURSOS E ESTRUTURA CURRICULAR
// -------------------------------------------------------------------------
export type CourseCategory = 
  | 'iniciacao' 
  | 'formacao_completa' 
  | 'especializacao';

export interface AcademicCourse {
  id: string;
  instrumentId: AcademicInstrumentId;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  category: CourseCategory;
  isCanonical: boolean;
  totalLessons: number;
  totalModules: number;
  levelsCovered: AcademicLevelNumber[];
  estimatedHours: number;
}

export interface AcademicModuleContract {
  id: string;
  courseId: string;
  moduleNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  level: AcademicLevelNumber;
  lessonIds: string[];
}

export interface AcademicLessonSummary {
  id: string;
  courseId: string;
  instrumentId: AcademicInstrumentId;
  moduleNumber: number;
  lessonNumber: number;
  level: AcademicLevelNumber;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  hasAudioDemonstration: boolean;
  hasQuiz: boolean;
  hasPracticalExercise: boolean;
  competencyCodes?: string[];
}

// -------------------------------------------------------------------------
// 5. MATRÍCULAS E PROGRESSO ACADÊMICO
// -------------------------------------------------------------------------
export type EnrollmentStatus = 'active' | 'completed' | 'paused';

export interface AcademicEnrollment {
  id: string;
  studentUid: string;
  instrumentId: AcademicInstrumentId;
  courseId: string;
  enrolledAt: string;
  status: EnrollmentStatus;
  isPrimaryInstrument: boolean;
  currentLessonId: string;
  currentLevel: AcademicLevelNumber;
  unlockedElectives: boolean; // Verdadeiro após 50% de conclusão do curso primário
}

export interface LevelProgressBreakdown {
  level: AcademicLevelNumber;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  isMastered: boolean;
}

export interface AcademicProgressSnapshot {
  studentUid: string;
  instrumentId: AcademicInstrumentId;
  courseId: string;
  completedLessonsCount: number;
  totalCourseLessons: number;
  overallPercentage: number;
  canUnlockElectives: boolean; // >= 50%
  levelBreakdown: Record<AcademicLevelNumber, LevelProgressBreakdown>;
  lastStudiedLessonId: string;
  lastStudiedDate: string;
  verifiedInteractiveSeconds: number;
  manualLoggedSeconds: number;
}

// -------------------------------------------------------------------------
// 6. AVALIAÇÕES PRÁTICAS E BANCAS EXAMINADORAS
// -------------------------------------------------------------------------
export interface EvaluationRubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // Ex: 1 a 5
  maxScore: number; // Ex: 10 ou 100
}

export interface AcademicAssessmentRubric {
  id: string;
  instrumentId: AcademicInstrumentId;
  level: AcademicLevelNumber;
  title: string;
  description: string;
  criteria: EvaluationRubricCriterion[];
  passingScorePercent: number; // Ex: 70%
}

export interface AcademicPracticalAssessment {
  id: string;
  studentUid: string;
  studentName: string;
  teacherUid?: string;
  teacherName?: string;
  instrumentId: AcademicInstrumentId;
  level: AcademicLevelNumber;
  rubricId: string;
  scores: Record<string, number>; // criterionId -> score
  finalPercentageScore: number;
  approved: boolean;
  teacherFeedback: string;
  evaluatedAt: string;
}

// -------------------------------------------------------------------------
// 7. CERTIFICAÇÃO DIGITAL DE CONSERVATÓRIO
// -------------------------------------------------------------------------
export interface AcademicCertificate {
  id: string;
  certificateCode: string; // Ex: GA-CERT-VIOLAO-LVL1-A9F42B
  studentUid: string;
  studentName: string;
  studentEmail?: string;
  instrumentId: AcademicInstrumentId;
  instrumentName: string;
  courseId: string;
  courseTitle: string;
  level: AcademicLevelNumber;
  levelName: string;
  workloadHours: number;
  issuedAt: string;
  verificationHash: string; // Hash SHA-256 de autenticidade
  teacherName: string;
  teacherRole: string;
  isValid: boolean;
}

export interface AcademicExerciseDefinition {
  titulo: string;
  bpmAlvo: number;
  instrucoes: string;
  repeticoesAlvo?: number;
}

export interface AcademicLessonContract {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  objetivo: string;
  duracaoMinutos: number;
}

export interface CurriculumModuleDefinition {
  id: string;
  nome: string;
  instrumentId: AcademicInstrumentId;
  nivel: AcademicLevelNumber;
  moduloNumero: number;
  objetivoAcademico: string;
  competenciasDesenvolvidas: string[];
  preRequisitos: string[];
  conteudos: string[];
  exerciciosPraticos: AcademicExerciseDefinition[];
  criteriosDominio: string[];
  formaAvaliacao: string;
  aulas: AcademicLessonContract[];
}
