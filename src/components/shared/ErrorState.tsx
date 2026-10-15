import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Đã có lỗi xảy ra',
  message = 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={`flex min-h-[220px] flex-col items-center justify-center rounded-[var(--radius-lg)] border border-danger/20 bg-danger-soft p-6 text-center ${className ?? ''}`}
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger mb-3">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-danger">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-foreground-muted">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          size="sm"
          className="mt-4 gap-2 border-danger/30 hover:bg-danger/10 text-danger"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Thử lại</span>
        </Button>
      )}
    </div>
  );
}
