import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'danger' | 'warning' | 'gold' | 'outline';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-primary text-white border-transparent',
    secondary: 'bg-primary-soft text-primary border-transparent',
    success: 'bg-success-soft text-success border-transparent',
    danger: 'bg-danger-soft text-danger border-transparent',
    warning: 'bg-warning-soft text-warning border-transparent',
    gold: 'bg-accent-gold-soft text-amber-900 border-amber-300 font-semibold',
    outline: 'border-border text-foreground bg-transparent',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
