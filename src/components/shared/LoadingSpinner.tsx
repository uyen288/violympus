import { Loader2 } from 'lucide-react';

export function LoadingSpinner({
  className = 'h-8 w-8 text-primary',
  text,
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />
      {text && <p className="text-sm text-foreground-muted">{text}</p>}
      <span className="sr-only">Đang tải...</span>
    </div>
  );
}
