import React from 'react';
import { Play, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { Badge } from './Badge';

interface LessonCardProps {
  id: string;
  title: string;
  subtitle?: string;
  moduleTitle?: string;
  estimatedMinutes?: number;
  isCompleted?: boolean;
  isActive?: boolean;
  levelNumber?: number;
  onSelect: (lessonId: string) => void;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  id,
  title,
  subtitle,
  moduleTitle,
  estimatedMinutes,
  isCompleted = false,
  isActive = false,
  levelNumber,
  onSelect,
  className = '',
}) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border backdrop-blur-sm select-none ${
        isActive
          ? 'bg-gradient-to-r from-white via-white to-[#FDF4F5] dark:from-[#22141A] dark:to-[#2D1620] border-[#7B1E2B] shadow-md ring-2 ring-[#7B1E2B]/20'
          : isCompleted
          ? 'bg-white/90 dark:bg-[#22141A]/90 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400 shadow-xs'
          : 'bg-white/95 dark:bg-[#22141A]/95 border-[#D9D9D9] dark:border-[#422933] hover:border-[#7B1E2B]/40 hover:shadow-md'
      } ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(id);
        }
      }}
      aria-label={`Aula: ${title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {levelNumber !== undefined && (
              <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-md bg-[#FAF4E6] dark:bg-[#382810] text-[#8C5F18] dark:text-[#F5D38A] border border-[#C5A059]/40">
                Nível {levelNumber}
              </span>
            )}
            {moduleTitle && (
              <span className="text-[11px] font-bold text-[#666672] dark:text-[#B8B3C0] truncate max-w-[200px]">
                {moduleTitle}
              </span>
            )}
            {isCompleted && (
              <Badge type="completed" label="Concluída" className="text-[10px] py-0" />
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold font-display text-[#25252A] dark:text-[#F8F7F4] leading-snug group-hover:text-[#7B1E2B] dark:group-hover:text-[#FF6B81] transition-colors">
            {title}
          </h3>

          {subtitle && (
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] line-clamp-2 leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="flex items-center gap-4 pt-1 text-xs text-[#666672] dark:text-[#B8B3C0] font-medium">
            {estimatedMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#7B1E2B] dark:text-[#FF6B81]" />
                <span>{estimatedMinutes} min</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#666672]" />
              <span>Teoria + Prática</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 shadow-sm ${
            isCompleted
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
              : isActive
              ? 'bg-gradient-to-r from-[#7B1E2B] to-[#B52A3A] text-white shadow-[#7B1E2B]/30'
              : 'bg-[#F8F7F4] dark:bg-[#1A1216] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#D9D9D9] dark:border-[#422933]'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
