import { Outlet, Link, useNavigate } from 'react-router';
import { Swords, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/providers';

export function ExamLayout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleExit = () => {
    if (window.confirm('Bạn có chắc chắn muốn rời khỏi bài làm? Tiến độ chưa nộp có thể bị mất.')) {
      navigate(isAuthenticated ? '/dashboard' : '/exams');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground select-none">
      <header className="sticky top-0 z-40 h-14 w-full border-b border-border bg-surface px-4 sm:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2 font-bold text-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Swords className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="font-heading font-bold text-lg hidden sm:inline">Violympus Arena</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExit}
            className="text-foreground-muted hover:text-danger hover:border-danger/30 gap-1.5"
            aria-label="Rời khỏi phòng thi"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs font-semibold">Rời bài thi</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
