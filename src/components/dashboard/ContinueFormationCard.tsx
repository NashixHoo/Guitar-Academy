import React from 'react';
import { UserProgress, NavigationTab } from '../../types';
import {
  getLearningContinuity,
  getCourseProgressSummary,
  COURSES_CATALOG,
  CourseId,
} from '../../services/learningEngine';
import { Play, Sparkles, BookOpen, ArrowRight, Award, Compass, CheckCircle2 } from 'lucide-react';
import { IniciarIcon, AulasIcon } from '../common/GuitarIcons';

interface ContinueFormationCardProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onSwitchCourse?: (courseId: CourseId) => void;
}

export const ContinueFormationCard: React.FC<ContinueFormationCardProps> = ({
  progress,
  onSelectLesson,
  onNavigateTab,
  onSwitchCourse,
}) => {
  const continuity = getLearningContinuity(progress);
  const activeCourse = continuity.activeCourse;
  const currentLesson = continuity.currentLesson;
  const otherCourses = continuity.otherCourses;

  const getCourseBadgeColor = (courseId: CourseId) => {
    switch (courseId) {
      case 'violao':
        return 'bg-[#7B1E2B] text-white border-[#B52A3A]/40';
      case 'solo':
        return 'bg-[#2E1620] text-amber-300 border-amber-400/30';
      case 'canonical':
      default:
        return 'bg-[#25252A] text-white border-white/20';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] p-5 sm:p-7 lg:p-8 shadow-xs">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Main Content Area */}
        <div className="space-y-4 max-w-3xl">
          {/* Header Row: Badge & Subtitle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81]">
              <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
              <span>Continue sua Formação</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getCourseBadgeColor(
                activeCourse.id
              )}`}
            >
              <span>{activeCourse.badge}</span>
              <span className="text-[10px] opacity-80">({activeCourse.totalLessons} aulas)</span>
            </span>

            <span className="text-xs text-[#666672] dark:text-[#B8B3C0] font-medium hidden sm:inline">
              • {activeCourse.completedCount} de {activeCourse.totalLessons} concluídas ({activeCourse.progressPercent}%)
            </span>
          </div>

          {/* Module & Lesson Title */}
          <div>
            <span className="text-xs text-[#7B1E2B] dark:text-[#FF6B81] font-bold uppercase tracking-wider block font-mono-code">
              {currentLesson.moduleTitle}
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-display font-black text-[#25252A] dark:text-[#F8F7F4] mt-1 tracking-tight leading-snug">
              {currentLesson.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#4D4D54] dark:text-[#B8B3C0] mt-1.5 leading-relaxed font-medium">
              {currentLesson.subtitle}
            </p>
          </div>

          {/* Contextual Rationale */}
          <div className="p-3.5 rounded-2xl bg-[#F8F7F4] dark:bg-[#22141A] border border-[#E8E6E1] dark:border-[#422933]">
            <p className="text-xs text-[#4D4D54] dark:text-[#B8B3C0] leading-relaxed">
              <strong className="text-[#25252A] dark:text-[#F8F7F4]">Por que continuar aqui? </strong>
              {continuity.rationale}
            </p>
          </div>

          {/* Course Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#666672] dark:text-[#B8B3C0] flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#7B1E2B] dark:text-[#FF6B81]" />
                <span>Progresso em {activeCourse.title}</span>
              </span>
              <span className="text-[#7B1E2B] dark:text-[#FF6B81] font-mono-code">
                {activeCourse.completedCount}/{activeCourse.totalLessons} aulas ({activeCourse.progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-[#EAE8E3] dark:bg-[#2E1B23] rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7B1E2B] to-[#B52A3A] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(3, activeCourse.progressPercent))}%` }}
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => onSelectLesson(currentLesson.id)}
              className="luxury-btn-primary flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-2xl active:scale-95 font-bold text-sm sm:text-base transition shadow-xs w-full sm:w-auto"
            >
              <IniciarIcon className="w-5 h-5 ml-0.5" />
              <span>{continuity.actionLabel}</span>
            </button>

            <button
              onClick={() => onNavigateTab('curriculum')}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#F8F7F4] hover:bg-[#F2F2F2] dark:bg-[#22141A] dark:hover:bg-[#381A25] text-[#25252A] dark:text-[#F8F7F4] font-bold text-xs sm:text-sm border border-[#E8E6E1] dark:border-[#422933] transition w-full sm:w-auto"
            >
              <AulasIcon className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />
              <span>Ver Grade Completa do Curso</span>
            </button>
          </div>
        </div>

        {/* Right Side: Other Available Courses Cards */}
        <div className="lg:w-72 xl:w-80 shrink-0 space-y-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#E8E6E1] dark:border-[#422933] lg:pl-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#666672] dark:text-[#B8B3C0] uppercase tracking-wider">
              Outras Formações
            </span>
            <span className="text-[10px] text-[#8C8C9A]">3 Cursos Ativos</span>
          </div>

          {otherCourses.map((course) => {
            return (
              <div
                key={course.id}
                onClick={() => {
                  if (onSwitchCourse) {
                    onSwitchCourse(course.id);
                  }
                  if (course.nextLesson) {
                    onSelectLesson(course.nextLesson.id);
                  } else {
                    onNavigateTab('curriculum');
                  }
                }}
                className="p-3.5 rounded-2xl bg-[#F8F7F4] hover:bg-[#F5E8EA] dark:bg-[#22141A] dark:hover:bg-[#381A25] border border-[#E8E6E1] dark:border-[#422933] cursor-pointer transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#25252A] dark:text-[#F8F7F4] group-hover:text-[#7B1E2B] dark:group-hover:text-[#FF6B81] transition-colors">
                    {course.title}
                  </span>
                  <span className="text-[10px] font-mono-code font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
                    {course.progressPercent}%
                  </span>
                </div>

                <p className="text-[11px] text-[#666672] dark:text-[#B8B3C0] mt-1 line-clamp-1">
                  {course.nextLesson ? `Próxima: ${course.nextLesson.title}` : 'Curso concluído!'}
                </p>

                <div className="w-full bg-[#EAE8E3] dark:bg-[#2E1B23] rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#7B1E2B] dark:bg-[#FF6B81]"
                    style={{ width: `${Math.min(100, Math.max(3, course.progressPercent))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-black/5 dark:border-white/5 text-[10px]">
                  <span className="text-[#8C8C9A]">
                    {course.completedCount}/{course.totalLessons} aulas
                  </span>
                  <span className="text-[#7B1E2B] dark:text-[#FF6B81] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Acessar</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
