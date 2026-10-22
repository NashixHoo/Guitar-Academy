import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  height?: 'sm' | 'md' | 'lg';
  variant?: 'wine' | 'gold' | 'cherry';
  showLabel?: boolean;
  className?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 'md',
  variant = 'wine',
  showLabel = false,
  className = '',
  label,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const fillGradients = {
    wine: 'bg-gradient-to-r from-[#7B1E2B] via-[#962232] to-[#B52A3A]',
    gold: 'bg-gradient-to-r from-[#F5C542] via-[#E5B532] to-[#C4931A]',
    cherry: 'bg-gradient-to-r from-[#B52A3A] to-[#E0485C]',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1 font-medium text-[#666672] dark:text-[#B8B3C0]">
          <span>{label || 'Progresso'}</span>
          <span className="font-mono-code tabular-nums font-semibold text-[#25252A] dark:text-[#F8F7F4]">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(clampedValue)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full bg-[#E5E0DC] dark:bg-[#382029] rounded-full overflow-hidden ${heightClasses[height]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            clampedValue === 100 && variant === 'wine' ? fillGradients.gold : fillGradients[variant]
          }`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
