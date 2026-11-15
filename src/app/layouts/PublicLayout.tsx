import * as React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Swords,
  LogIn,
  LayoutDashboard,
  BookOpen,
  Timer,
  Mountain,
  Trophy,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { useAuth } from '@/app/providers';
import { cn } from '@/lib/utils/cn';

export function PublicLayout() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const [prevPath, setPrevPath] = React.useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
  }

  const navTabs = [
    {
      to: '/practice',
      label: 'Học & Luyện tập',
      icon: BookOpen,
      isActive: location.pathname.startsWith('/practice'),
    },
    {
      to: '/exams',
      label: 'Thi & Khảo sát',
      icon: Timer,
      isActive: location.pathname.startsWith('/exams'),
    },
    {
      to: '/arena',
      label: 'Đấu trường',
      icon: Swords,
      badge: 'Live',
      isActive: location.pathname.startsWith('/arena'),
    },
    {
      to: '/climb',
      label: 'Leo núi',
      icon: Mountain,
      badge: 'Olympia',
      isActive: location.pathname.startsWith('/climb'),
    },
    {
      to: '/leaderboard',
      label: 'Bảng xếp hạng',
      icon: Trophy,
      isActive: location.pathname.startsWith('/leaderboard'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        Bỏ qua tới nội dung chính
      </a>

      {/* Top Horizontal Navigation Bar */}
      <header className="sticky top-0 z-40 h-16 w-full border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo (Home) */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-primary transition-opacity hover:opacity-90 shrink-0"
              aria-label="Violympus Trang chủ"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                <Swords className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tighter text-foreground">
                VI<span className="text-primary">OLYMPUS</span>
              </span>
            </Link>

            {/* Center: Horizontal Tabs (Desktop >= md/lg) */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Điều hướng chính">
              {navTabs.map((tab) => (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors relative',
                    tab.isActive
                      ? 'bg-primary-soft text-primary font-bold shadow-2xs'
                      : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground'
                  )}
                >
                  <tab.icon className={cn('h-4 w-4 shrink-0', tab.isActive ? 'text-primary' : 'text-foreground-muted')} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={cn(
                        'text-[9px] px-1.5 py-0.2 rounded-full font-bold',
                        tab.badge === 'Live' ? 'bg-amber-100 text-amber-800' : 'bg-primary text-white'
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Auth / Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <Button asChild variant="primary" size="sm" className="gap-2 font-bold">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{user?.displayName || 'Dashboard'}</span>
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="font-medium">
                  <Link to="/login" className="gap-1.5">
                    <LogIn className="h-4 w-4" />
                    <span>{t('auth.login', 'Đăng nhập')}</span>
                  </Link>
                </Button>
                <Button asChild variant="primary" size="sm" className="font-bold">
                  <Link to="/register">{t('auth.register', 'Đăng ký')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-muted cursor-pointer"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface p-4 space-y-2 animate-in slide-in-from-top-2">
          <nav className="space-y-1">
            {navTabs.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
                  tab.isActive
                    ? 'bg-primary-soft text-primary font-bold'
                    : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <Badge variant={tab.badge === 'Live' ? 'gold' : 'default'} className="text-[10px]">
                    {tab.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1 w-full">
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
              <Link to="/practice" className="hover:text-foreground transition-colors">
                Học & Luyện tập
              </Link>
              <Link to="/exams" className="hover:text-foreground transition-colors">
                Thi & Khảo sát
              </Link>
              <Link to="/climb" className="hover:text-foreground transition-colors font-semibold text-primary">
                Leo núi Olympia
              </Link>
              <Link to="/arena" className="hover:text-foreground transition-colors">
                Đấu trường
              </Link>
              <Link to="/leaderboard" className="hover:text-foreground transition-colors">
                Bảng xếp hạng
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Điều khoản
              </Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Quyền riêng tư
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6 text-center text-xs text-foreground-muted">
            {t('common.footer_copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  );
}
