import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportError } from '@/lib/errors/reportError';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `ERR_${Date.now().toString(36).toUpperCase()}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    reportError(error, {
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorId: null });
    window.location.reload();
  };

  private handleGoHome = (): void => {
    this.setState({ hasError: false, error: null, errorId: null });
    window.location.href = '/';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full rounded-[var(--radius-lg)] border border-border bg-surface p-8 text-center shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger mb-4">
              <AlertOctagon className="h-8 w-8" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Đã xảy ra sự cố không mong muốn
            </h1>
            <p className="mt-2 text-sm text-foreground-muted">
              Hệ thống đã ghi nhận lỗi này. Bạn có thể tải lại trang hoặc quay về trang chủ.
            </p>
            {this.state.errorId && (
              <div className="mt-3 inline-block rounded bg-surface-muted px-2.5 py-1 text-xs font-mono text-foreground-muted">
                Mã tham chiếu: {this.state.errorId}
              </div>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={this.handleReset}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Tải lại trang
              </Button>
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
