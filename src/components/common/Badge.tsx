import React from 'react';
import { Star, CheckCircle, Clock } from 'lucide-react';

interface BadgeProps {
  type: 'level' | 'completed' | 'in_progress' | 'gold' | 'custom';
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type,
  label,
  icon,
  className = '',
}) => {
  const styles = {
    level:
      'bg-[#FAF4E6] dark:bg-[#382810] text-[#8C5F18] dark:text-[#F5D38A] border border-[#C5A059]/50 font-mono-code',
    completed:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800',
    in_progress:
      'bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#7B1E2B]/20 dark:border-[#FF6B81]/30',
    gold:
      'bg-gradient-to-r from-[#FAF4E6] to-[#F3E5C8] dark:from-[#382810] dark:to-[#4A3515] text-[#8C5F18] dark:text-[#F5D38A] border border-[#F5C542] shadow-xs font-bold',
    custom:
      'bg-white dark:bg-[#22141A] text-[#25252A] dark:text-[#F8F7F4] border border-[#D9D9D9] dark:border-[#422933]',
  };

  const defaultIcons = {
    level: <Star className="w-3 h-3 text-[#F5C542] fill-[#F5C542]" aria-hidden="true" />,
    completed: <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />,
    in_progress: <Clock className="w-3 h-3 text-[#7B1E2B] dark:text-[#FF6B81]" aria-hidden="true" />,
    gold: <Star className="w-3 h-3 text-[#F5C542] fill-[#F5C542]" aria-hidden="true" />,
    custom: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${styles[type]} ${className}`}
    >
      {icon || defaultIcons[type]}
      <span>{label}</span>
    </span>
  );
};
