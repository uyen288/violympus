import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, hint, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : hint ? hintId : undefined
          }
          className={cn(
            'flex h-10 w-full rounded-[var(--radius-md)] border bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
            'placeholder:text-foreground-muted/60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-danger focus-visible:ring-danger' : 'border-border',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs font-medium text-danger">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-xs text-foreground-muted">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
