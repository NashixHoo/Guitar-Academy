import React from 'react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando conteúdo musical...',
  subMessage = 'Afinando as cordas e preparando a aula',
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white/80 dark:bg-[#22141A]/80 border border-[#D9D9D9] dark:border-[#422933] backdrop-blur-sm ${className}`}
    >
      {/* Pick spinner */}
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-3 border-[#F5E8EA] dark:border-[#381A25] border-t-[#7B1E2B] dark:border-t-[#E05368] animate-spin" />
        <div className="absolute inset-2 flex items-center justify-center">
          <img
            src="./icon.svg"
            alt=""
            aria-hidden="true"
            className="w-5 h-5 object-contain"
          />
        </div>
      </div>

      <h4 className="text-base font-bold font-display text-[#25252A] dark:text-[#F8F7F4]">
        {message}
      </h4>

      {subMessage && (
        <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-1 max-w-sm leading-relaxed">
          {subMessage}
        </p>
      )}
    </div>
  );
};
