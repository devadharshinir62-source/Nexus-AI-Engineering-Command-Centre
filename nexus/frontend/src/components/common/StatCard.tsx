import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  timeframe?: string;
  description?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'elevated' | 'glow';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  change,
  trend = 'neutral',
  timeframe,
  description,
  icon: Icon,
  variant = 'default',
  className,
  onClick,
}) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <Card
      variant={variant}
      padding="md"
      className={cn(
        'group relative overflow-hidden transition-all duration-200 hover:border-white/20 h-full flex flex-col justify-between',
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
      onClick={onClick}
    >
      {/* Subtle top highlight gradient on hover */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
            {title}
          </span>

          {Icon && (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-cyan-400 shadow-inner-glow transition-colors group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10">
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {value}
          </span>
          {unit && <span className="text-xs font-mono font-medium text-slate-400">{unit}</span>}
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3 text-xs">
        {change !== undefined && (
          <Badge
            variant={isPositive ? 'success' : isNegative ? 'primary' : 'neutral'}
            size="sm"
            className="gap-1 font-mono text-[10px] py-0.5 px-1.5 flex-shrink-0"
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {trend === 'neutral' && <Minus className="h-3 w-3" />}
            <span>{change > 0 ? `+${change}` : change}%</span>
          </Badge>
        )}
        {timeframe && (
          <span className="text-[11px] text-slate-400 truncate font-mono text-right" title={description || timeframe}>
            {timeframe}
          </span>
        )}
      </div>
    </Card>
  );
};
