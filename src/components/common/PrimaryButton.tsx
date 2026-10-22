import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'wine' | 'cherry' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  variant = 'wine',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    wine:
      'bg-gradient-to-r from-[#7B1E2B] via-[#962232] to-[#B52A3A] text-white hover:from-[#8E2332] hover:to-[#C43142] shadow-sm hover:shadow-md focus:ring-[#7B1E2B]/40',
    cherry:
      'bg-gradient-to-r from-[#B52A3A] to-[#D4384B] text-white hover:from-[#C43142] hover:to-[#E54B5E] shadow-sm hover:shadow-md focus:ring-[#B52A3A]/40',
    gold:
      'bg-gradient-to-r from-[#F5C542] to-[#E5B532] text-[#25252A] font-bold hover:from-[#FAD058] hover:to-[#E5B532] shadow-sm hover:shadow-md focus:ring-[#F5C542]/40',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl min-h-[36px]',
    md: 'px-4 py-2 text-sm rounded-xl min-h-[44px]',
    lg: 'px-6 py-3 text-base rounded-2xl min-h-[48px]',
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-2 whitespace-nowrap ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
