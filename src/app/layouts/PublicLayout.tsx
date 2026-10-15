import { Outlet, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Swords, LogIn, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { useAuth } from '@/app/providers';

export function PublicLayout() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        Bỏ qua tới nội dung chính
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 h-16 w-full border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-primary transition-opacity hover:opacity-90"
              aria-label="Violympus Trang chủ"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                <Swords className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tighter text-foreground">
                VI<span className="text-primary">OLYMPUS</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground-muted" aria-label="Điều hướng chính">
              <Link to="/subjects" className="transition-colors hover:text-foreground">
                {t('navigation.subjects', 'Lĩnh vực')}
              </Link>
              <Link to="/practice" className="transition-colors hover:text-foreground font-semibold text-primary">
                {t('navigation.practice', 'Học & Luyện tập')}
              </Link>
              <Link to="/exams" className="transition-colors hover:text-foreground">
                {t('navigation.exams', 'Thi thử & Khảo sát')}
              </Link>
              <Link to="/arena" className="transition-colors hover:text-foreground flex items-center gap-1.5">
                <span className="flex h-2 w-2 rounded-full bg-accent-gold" />
                <span>{t('navigation.arena', 'Đấu trường (Rank)')}</span>
              </Link>
              <Link to="/leaderboard" className="transition-colors hover:text-foreground">
                {t('navigation.leaderboard', 'Bảng xếp hạng')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <Button asChild variant="primary" size="sm" className="gap-2">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{user?.displayName || 'Dashboard'}</span>
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login" className="gap-1.5">
                    <LogIn className="h-4 w-4" />
                    <span>{t('auth.login', 'Đăng nhập')}</span>
                  </Link>
                </Button>
                <Button asChild variant="primary" size="sm">
                  <Link to="/register">{t('auth.register', 'Bắt đầu')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 text-sm text-foreground-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-foreground font-bold text-lg mb-1">
                <Swords className="h-5 w-5 text-primary" />
                <span>VIOLYMPUS</span>
              </div>
              <p className="text-xs text-foreground-muted max-w-md">
                Nền tảng học tập và đấu trường tri thức đa lĩnh vực. Học hỏi. Thi đấu. Vươn tầm.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
              <Link to="/terms" className="hover:text-foreground underline-offset-4 hover:underline">
                Điều khoản dịch vụ <span className="text-[10px] text-amber-600">(Dự thảo)</span>
              </Link>
              <Link to="/privacy" className="hover:text-foreground underline-offset-4 hover:underline">
                Chính sách bảo mật <span className="text-[10px] text-amber-600">(Dự thảo)</span>
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-foreground-muted gap-4">
            <p>© {new Date().getFullYear()} Violympus. Mọi quyền được bảo lưu.</p>
            <p className="text-[11px] text-slate-400">
              Kiến trúc bảo mật xác thực server-side · Realtime WebSockets
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
