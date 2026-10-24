import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'gradient';
  hoverEffect?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    glass: 'bg-[#182238]/70 backdrop-blur-md border border-[#233252]/80',
    solid: 'bg-[#182238] border border-[#233252]',
    gradient: 'bg-gradient-to-br from-[#182238] to-[#121A2D] border border-[#2D3E66]',
  };

  const hoverStyle = hoverEffect
    ? 'transition-all duration-300 hover:border-[#7C5CFC]/40 hover:shadow-xl hover:shadow-[#7C5CFC]/10 hover:-translate-y-0.5'
    : '';

  return (
    <div
      className={`rounded-2xl p-5 ${variantStyles[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 pb-4 border-b border-[#233252]/60 mb-4 ${className}`}>
    <div>
      <h3 className="font-display font-semibold text-base text-[#F5F7FF] tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-[#98A5BF] mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);
