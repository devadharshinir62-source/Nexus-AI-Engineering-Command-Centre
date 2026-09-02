import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'outline' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles = {
  default: 'bg-[#111726]/80 backdrop-blur-md border border-white/[0.08] shadow-panel',
  elevated: 'bg-[#171F33]/90 backdrop-blur-md border border-white/[0.12] shadow-2xl',
  interactive:
    'bg-[#111726]/75 hover:bg-[#171F33]/90 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.16] transition-all duration-200 cursor-pointer shadow-panel hover:shadow-xl',
  outline: 'bg-transparent border border-white/[0.08]',
  glow: 'bg-[#111726]/85 backdrop-blur-md border border-cyan-500/25 shadow-sm',
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3.5',
  md: 'p-5',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('rounded-xl transition-all', variantStyles[variant], paddingStyles[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3 className={cn('text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-2', className)} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p className={cn('text-xs text-slate-400 mt-0.5', className)} {...props}>
      {children}
    </p>
  );
};
