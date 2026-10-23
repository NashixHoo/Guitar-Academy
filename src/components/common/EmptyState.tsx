import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum resultado encontrado',
  description = 'Tente uma nova busca ou ajuste os termos para encontrar o que procura.',
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      role="region"
      aria-label="Conteúdo vazio"
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white/80 dark:bg-[#22141A]/80 border border-[#D9D9D9] dark:border-[#422933] backdrop-blur-sm ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F8F7F4] dark:bg-[#1A1216] border border-[#D9D9D9] dark:border-[#422933] flex items-center justify-center text-[#7B1E2B] dark:text-[#E05368] mb-4 shadow-xs">
        {icon || <Search className="w-6 h-6 stroke-[2]" aria-hidden="true" />}
      </div>

      <h4 className="text-base sm:text-lg font-bold font-display text-[#25252A] dark:text-[#F8F7F4]">
        {title}
      </h4>

      {description && (
        <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-1.5 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] dark:bg-[#1A1216] dark:hover:bg-[#2D1620] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#D9D9D9] dark:border-[#422933] transition-all active:scale-[0.98] shadow-xs"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
