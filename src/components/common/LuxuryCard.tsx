import React from 'react';

interface LuxuryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'wine' | 'porcelain';
  interactive?: boolean;
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-white/95 dark:bg-[#22141A]/95 border border-[#D9D9D9] dark:border-[#422933] text-[#25252A] dark:text-[#F8F7F4] shadow-sm',
    elevated:
      'bg-white dark:bg-[#22141A] border border-[#D9D9D9] dark:border-[#422933] text-[#25252A] dark:text-[#F8F7F4] shadow-md',
    wine:
      'bg-gradient-to-br from-[#7B1E2B] to-[#4A0E17] text-white border border-[#B52A3A]/40 shadow-md',
    porcelain:
      'bg-[#F8F7F4] dark:bg-[#1A1216] border border-[#D9D9D9] dark:border-[#422933] text-[#25252A] dark:text-[#F8F7F4]',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99]'
    : '';

  return (
    <div
      className={`rounded-2xl p-4 sm:p-6 backdrop-blur-sm ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
