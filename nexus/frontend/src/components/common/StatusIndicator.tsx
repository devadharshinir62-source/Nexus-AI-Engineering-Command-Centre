import React from 'react';
import { cn } from '../../utils/cn';

export type StatusType = 'online' | 'busy' | 'warning' | 'offline' | 'idle';

interface StatusIndicatorProps {
  status: StatusType;
  pulse?: boolean;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<StatusType, { bg: string; dot: string; ping: string; text: string }> = {
  online: {
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-400',
    ping: 'bg-emerald-400',
    text: 'text-emerald-400',
  },
  busy: {
    bg: 'bg-cyan-500/10',
    dot: 'bg-cyan-400',
    ping: 'bg-cyan-400',
    text: 'text-cyan-400',
  },
  warning: {
    bg: 'bg-amber-500/10',
    dot: 'bg-amber-400',
    ping: 'bg-amber-400',
    text: 'text-amber-400',
  },
  offline: {
    bg: 'bg-rose-500/10',
    dot: 'bg-rose-400',
    ping: 'bg-rose-400',
    text: 'text-rose-400',
  },
  idle: {
    bg: 'bg-slate-500/10',
    dot: 'bg-slate-400',
    ping: 'bg-slate-400',
    text: 'text-slate-400',
  },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  pulse = true,
  label,
  className,
  size = 'md',
}) => {
  const colors = statusColors[status];
  const sizeMap = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex items-center justify-center">
        {pulse && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              colors.ping,
              sizeMap[size]
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full', colors.dot, sizeMap[size])} />
      </span>
      {label && <span className={cn('text-xs font-medium', colors.text)}>{label}</span>}
    </div>
  );
};
