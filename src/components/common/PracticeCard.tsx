import React from 'react';
import { Play, Flame, Activity, Clock } from 'lucide-react';

interface PracticeCardProps {
  title: string;
  category: string;
  durationMinutes: number;
  initialBpm?: number;
  targetBpm?: number;
  repetitions?: number;
  onStart: () => void;
  className?: string;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({
  title,
  category,
  durationMinutes,
  initialBpm,
  targetBpm,
  repetitions,
  onStart,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#22141A] border border-[#D9D9D9] dark:border-[#422933] shadow-sm hover:shadow-md hover:border-[#7B1E2B]/40 transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#7B1E2B]/20">
            <Flame className="w-3 h-3 text-[#B52A3A]" />
            {category}
          </span>
          <span className="flex items-center gap-1 text-[#666672] dark:text-[#B8B3C0] font-medium font-mono-code text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            {durationMinutes} min
          </span>
        </div>

        <h4 className="text-base font-bold font-display text-[#25252A] dark:text-[#F8F7F4] leading-snug">
          {title}
        </h4>

        {(initialBpm || targetBpm || repetitions) && (
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#666672] dark:text-[#B8B3C0]">
            {initialBpm && (
              <span className="flex items-center gap-1 font-mono-code">
                <Activity className="w-3.5 h-3.5 text-[#7B1E2B]" />
                <span>{initialBpm} {targetBpm ? `→ ${targetBpm}` : ''} BPM</span>
              </span>
            )}
            {repetitions && (
              <span className="font-mono-code">
                {repetitions}x repetições
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 mt-2 border-t border-[#F0EBE9] dark:border-[#382029]">
        <button
          onClick={onStart}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-[#7B1E2B] via-[#962232] to-[#B52A3A] text-white shadow-xs hover:shadow-md active:scale-[0.98] transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Iniciar Treino</span>
        </button>
      </div>
    </div>
  );
};
