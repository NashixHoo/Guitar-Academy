import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  kicker,
  badge,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 sm:mb-6 ${className}`}>
      <div>
        {(kicker || badge) && (
          <div className="flex items-center gap-2 mb-1">
            {kicker && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B1E2B] dark:text-[#E05368]">
                {kicker}
              </span>
            )}
            {badge && (
              <span className="px-2 py-0.5 text-[10px] font-mono-code font-bold rounded-md bg-[#FAF4E6] dark:bg-[#382810] text-[#8C5F18] dark:text-[#F5D38A] border border-[#C5A059]/40">
                {badge}
              </span>
            )}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#25252A] dark:text-[#F8F7F4]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 pt-1 sm:pt-0">{action}</div>}
    </div>
  );
};
