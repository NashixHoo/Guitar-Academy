export type UserRole = 'student' | 'teacher' | 'admin';

export interface ClassGroup {
  id: string;
  name: string;
  code: string; // Código de convite seguro (ex: GA-TURMA-101)
  description?: string;
  teacherId: string;
  teacherEmail: string;
  teacherName: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  maxStudents?: number;
}

export interface ClassEnrollment {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhotoUrl?: string;
  teacherId: string;
  joinedAt: string;
  status: 'active' | 'inactive';
  lastActivityAt?: string;
  notes?: string;
}

export type EducationalEventType =
  | 'course_opened'
  | 'lesson_opened'
  | 'lesson_completed'
  | 'exercise_started'
  | 'exercise_completed'
  | 'practice_session_recorded'
  | 'manual_practice_logged'
  | 'theory_content_opened'
  | 'metronome_practice'
  | 'tuner_used'
  | 'revision_completed'
  | 'learning_goal_updated';

export type ActivityCategory =
  | 'instrumental_practice'
  | 'guided_lessons'
  | 'music_theory'
  | 'technique_mechanics'
  | 'chords_harmony'
  | 'repertoire_ear';

export interface EducationalEvent {
  id: string;
  studentUid: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  courseId: 'violao' | 'canonical' | 'solo';
  moduleId?: string;
  lessonId?: string;
  exerciseId?: string;
  eventType: EducationalEventType;
  category: ActivityCategory;
  durationSeconds: number; // Tempo efetivo medido ou informado
  measurementType: 'verified_interactive' | 'manual_logged' | 'estimated';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TeacherFilterState {
  period: '7d' | '30d' | '90d' | 'custom';
  startDate?: string;
  endDate?: string;
  classId: string; // 'all' ou ID específico
  courseId: 'all' | 'violao' | 'canonical' | 'solo';
  category: 'all' | ActivityCategory;
  studentId?: string;
  searchQuery?: string;
}

export interface AnalyticsTableRow {
  categoryOrActivity: string;
  category?: ActivityCategory;
  course: string;
  module: string;
  lessonOrExercise: string;
  occurrenceCount: number;
  studentsInvolvedCount: number;
  percentage: number;
  denominatorDescription: string;
  denominatorTotal?: number;
  verifiedCount?: number;
  manualCount?: number;
  verifiedTimeSeconds?: number;
  manualTimeSeconds?: number;
  trend: 'up' | 'stable' | 'down';
}

export interface CourseFunnelRow {
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonNumber?: number;
  startedCount: number;
  completedCount: number;
  droppedCount: number;
  completionRate: number; // 0-100%
  dropRate: number; // 0-100%
  affectedStudentsCount: number;
}

export interface PedagogicalBottleneck {
  id: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  observedFact: string; // Problema mensurado diretamente nos dados
  pedagogicalHypothesis: string; // Hipótese didática explicável
  interventionSuggestion: string; // Sugestão prática para o professor intervir
  affectedCourseId: string;
  affectedLessonId?: string;
  affectedStudentsCount: number;
  metricValue: string;
}

export interface StudentAnalyticsSummary {
  studentUid: string;
  studentName: string;
  studentEmail: string;
  studentPhotoUrl?: string;
  classId: string;
  className: string;
  joinedAt: string;
  lastActivityAt: string;
  totalStudyTimeSeconds: number;
  verifiedInteractiveSeconds: number;
  manualLoggedSeconds: number;
  completedLessonsCount: number;
  activeCourses: string[];
  currentLessons: Record<string, string>;
  studyFrequencyDaysPerWeek: number;
  practicedBpmMax: number;
  pendingActivitiesCount: number;
  evaluatedSkillsCount: number;
  unevaluatedSkillsCount: number;
  skillsProficientCount: number;
}
