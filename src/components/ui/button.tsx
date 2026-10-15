import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {

    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer';

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover shadow-sm',
      secondary:
        'bg-surface-muted text-foreground hover:bg-border active:bg-border border border-border',
      outline:
        'border border-border bg-surface text-foreground hover:bg-surface-muted active:bg-border shadow-sm',
      ghost:
        'text-foreground hover:bg-surface-muted active:bg-border',
      danger:
        'bg-danger text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
      gold:
        'bg-accent-gold text-slate-900 font-semibold hover:bg-yellow-500 active:bg-yellow-600 shadow-sm',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-8 px-3 text-xs rounded-[var(--radius-sm)] gap-1.5',
      md: 'h-10 px-4 py-2 text-sm rounded-[var(--radius-md)] gap-2',
      lg: 'h-12 px-6 text-base rounded-[var(--radius-md)] gap-2.5',
      icon: 'h-10 w-10 p-0 rounded-[var(--radius-md)] justify-center',
    };

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
