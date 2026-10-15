import { useRouteError, Link } from 'react-router';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RouteErrorElement() {
  const error = useRouteError();
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'statusText' in error
      ? String((error as { statusText?: unknown }).statusText)
      : 'Đã có lỗi xảy ra trong quá trình tải trang.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full rounded-2xl border border-border bg-surface p-8 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-danger mb-4 shadow-xs">
          <AlertTriangle className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-foreground">
          Sự cố tải trang
        </h1>
        <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
          {errorMessage}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="gap-2 font-bold"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Tải lại trang</span>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              <span>Về trang chủ</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
