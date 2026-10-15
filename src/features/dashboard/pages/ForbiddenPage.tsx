import { Link } from 'react-router';
import { ShieldX, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-soft text-danger mb-4 shadow-xs">
        <ShieldX className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        403 — Không có quyền truy cập
      </h1>
      <p className="mt-2 max-w-md text-sm text-foreground-muted">
        Bạn không có quyền hạn cần thiết để truy cập khu vực này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một sự nhầm lẫn.
      </p>
      <div className="mt-6">
        <Button asChild variant="primary" className="gap-2">
          <Link to="/dashboard">
            <Home className="h-4 w-4" />
            <span>Về Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
