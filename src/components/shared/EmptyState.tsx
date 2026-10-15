import { Inbox, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[240px] flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-8 text-center ${className ?? ''}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-foreground-muted mb-4">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-foreground-muted">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
