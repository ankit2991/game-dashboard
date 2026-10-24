import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'purple' | 'cyan' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  const variantStyles = {
    success: 'bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30',
    warning: 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30',
    danger: 'bg-[#FF5D73]/15 text-[#FF5D73] border border-[#FF5D73]/30',
    purple: 'bg-[#7C5CFC]/15 text-[#A885FF] border border-[#7C5CFC]/30',
    cyan: 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30',
    neutral: 'bg-[#233252]/50 text-[#98A5BF] border border-[#2D3E66]',
  };

  const dotColors = {
    success: 'bg-[#20C997]',
    warning: 'bg-[#FFB547]',
    danger: 'bg-[#FF5D73]',
    purple: 'bg-[#7C5CFC]',
    cyan: 'bg-[#00D4FF]',
    neutral: 'bg-[#98A5BF]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};
