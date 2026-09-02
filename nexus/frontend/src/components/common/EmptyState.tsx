import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button, ButtonVariant } from './Button';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  actionVariant?: ButtonVariant;
  onAction?: () => void;
  className?: string;
  badge?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionIcon,
  actionVariant = 'primary',
  onAction,
  className,
  badge,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-[#0E1424]/50 px-6 py-16 text-center backdrop-blur-sm',
        className
      )}
    >
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.08] to-transparent shadow-panel">
        <Icon className="h-7 w-7 text-cyan-400" />
        <div className="absolute -inset-1 rounded-2xl bg-cyan-500/10 blur-sm -z-10" />
      </div>

      {badge && (
        <span className="mb-2 inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
          {badge}
        </span>
      )}

      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-400">
        {description}
      </p>

      {actionLabel && (
        <div className="mt-6">
          <Button
            variant={actionVariant}
            size="sm"
            icon={actionIcon}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
