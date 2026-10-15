import { Link } from 'react-router';
import { Compass, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4 shadow-xs">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        404 — Không tìm thấy trang
      </h1>
      <p className="mt-2 max-w-md text-sm text-foreground-muted">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang địa chỉ mới.
      </p>
      <div className="mt-6">
        <Button asChild variant="primary" className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            <span>Về trang chủ</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
