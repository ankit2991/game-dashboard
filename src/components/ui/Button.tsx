import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cyan' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B1020] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-[#7C5CFC] hover:bg-[#6947eb] text-white shadow-lg shadow-[#7C5CFC]/25 focus:ring-[#7C5CFC] border border-[#9176FF]/30',
    cyan: 'bg-[#00D4FF] hover:bg-[#00b8de] text-[#0B1020] font-semibold shadow-lg shadow-[#00D4FF]/25 focus:ring-[#00D4FF]',
    secondary: 'bg-[#182238] hover:bg-[#233252] text-[#F5F7FF] border border-[#2D3E66] focus:ring-[#7C5CFC]',
    outline: 'bg-transparent hover:bg-[#182238] text-[#F5F7FF] border border-[#2D3E66] hover:border-[#7C5CFC] focus:ring-[#7C5CFC]',
    ghost: 'bg-transparent hover:bg-[#182238]/60 text-[#98A5BF] hover:text-[#F5F7FF]',
    danger: 'bg-[#FF5D73]/15 hover:bg-[#FF5D73]/25 text-[#FF5D73] border border-[#FF5D73]/40 focus:ring-[#FF5D73]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      
      {children}

      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
