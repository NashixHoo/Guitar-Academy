import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon,
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl min-h-[36px]',
    md: 'px-4 py-2 text-sm rounded-xl min-h-[44px]',
    lg: 'px-6 py-3 text-base rounded-2xl min-h-[48px]',
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium bg-white dark:bg-[#22141A] text-[#25252A] dark:text-[#F8F7F4] border border-[#D9D9D9] dark:border-[#422933] hover:bg-[#F8F7F4] dark:hover:bg-[#2C1A22] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/20 whitespace-nowrap shadow-xs ${
        sizeStyles[size]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
