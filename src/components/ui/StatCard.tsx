import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  accentColor?: 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  accentColor = 'purple',
  subtitle,
}) => {
  const accentGradients = {
    purple: 'from-[#7C5CFC]/20 to-transparent border-[#7C5CFC]/30 text-[#A885FF]',
    cyan: 'from-[#00D4FF]/20 to-transparent border-[#00D4FF]/30 text-[#00D4FF]',
    emerald: 'from-[#20C997]/20 to-transparent border-[#20C997]/30 text-[#20C997]',
    amber: 'from-[#FFB547]/20 to-transparent border-[#FFB547]/30 text-[#FFB547]',
    rose: 'from-[#FF5D73]/20 to-transparent border-[#FF5D73]/30 text-[#FF5D73]',
  };

  const iconBgStyles = {
    purple: 'bg-[#7C5CFC]/15 text-[#A885FF] border-[#7C5CFC]/30',
    cyan: 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/30',
    emerald: 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30',
    amber: 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30',
    rose: 'bg-[#FF5D73]/15 text-[#FF5D73] border-[#FF5D73]/30',
  };

  return (
    <Card hoverEffect className="relative overflow-hidden group">
      {/* Subtle top ambient glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${accentGradients[accentColor]} opacity-20 blur-xl pointer-events-none group-hover:opacity-40 transition-opacity`} />
      
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#98A5BF]">{title}</span>
        <div className={`p-2.5 rounded-xl border ${iconBgStyles[accentColor]} flex-shrink-0`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-display text-[#F5F7FF] tracking-tight">{value}</span>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs">
        {change && (
          <Badge
            size="sm"
            variant={trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'neutral'}
          >
            {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : '• '}{change}
          </Badge>
        )}
        {subtitle && (
          <span className="text-[#98A5BF] text-[11px] truncate max-w-[160px]">{subtitle}</span>
        )}
      </div>
    </Card>
  );
};
