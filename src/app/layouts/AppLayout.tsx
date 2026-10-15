import * as React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Swords,
  LayoutDashboard,
  BookOpen,
  Trophy,
  Award,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/app/providers';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export function AppLayout() {
  const { t } = useTranslation();
  const { user, isEditor, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);


  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: t('navigation.dashboard', 'Tổng quan'),
      exact: true,
    },
    {
      to: '/practice',
      icon: BookOpen,
      label: t('navigation.practice', 'Luyện tập'),
    },
    {
      to: '/arena',
      icon: Swords,
      label: t('navigation.arena', 'Đấu trường'),
    },
    {
      to: '/leaderboard',
      icon: Trophy,
      label: t('navigation.leaderboard', 'Bảng xếp hạng'),
    },
    {
      to: '/tournaments',
      icon: Award,
      label: t('navigation.tournaments', 'Giải đấu'),
      badge: 'Sắp có',
      disabled: true,
    },
    {
      to: '/profile',
      icon: User,
      label: t('navigation.profile', 'Hồ sơ cá nhân'),
    },
    {
      to: '/settings',
      icon: Settings,
      label: t('navigation.settings', 'Cài đặt'),
    },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <a href="#app-content" className="skip-link">
        Bỏ qua tới nội dung chính
      </a>

      {/* Desktop Sidebar (>= lg) */}
      <aside
        className="hidden lg:flex w-64 flex-col border-r border-border bg-surface shrink-0 fixed inset-y-0 left-0 z-30"
        aria-label="Thanh điều hướng ứng dụng"
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 font-bold text-lg text-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
              <Swords className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-foreground">
              VI<span className="text-primary">OLYMPUS</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            if (item.disabled) {
              return (
                <div
                  key={item.to}
                  className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-foreground-muted/60 opacity-60 cursor-not-allowed select-none"
                  aria-disabled="true"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold bg-surface-muted px-2 py-0.5 rounded-full text-foreground-muted">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-soft text-primary font-semibold'
                    : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-foreground-muted')}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}

          {/* Admin Studio Link (Editor/Admin only) */}
          {isEditor && (
            <div className="pt-4 mt-4 border-t border-border">
              <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-foreground-muted/80">
                Quản trị viên
              </div>
              <Link
                to="/admin"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
                  location.pathname.startsWith('/admin')
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-amber-800 hover:bg-amber-50',
                )}
              >
                <ShieldAlert className="h-5 w-5 text-amber-700" aria-hidden="true" />
                <span>Admin Studio</span>
              </Link>
            </div>
          )}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-border bg-surface-muted/40">
          <div className="flex items-center justify-between">
            <Link to="/profile" className="flex items-center gap-3 overflow-hidden group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-sm">
                {user?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden text-left">
                <p className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {user?.displayName || 'Người dùng'}
                </p>
                <p className="text-[11px] text-foreground-muted flex items-center gap-1.5">
                  <span className="font-mono tabular-nums font-bold text-accent-gold">
                    {user?.xp || 0} XP
                  </span>
                  <span>• Lv.{user?.level || 1}</span>
                </p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-[var(--radius-sm)] text-foreground-muted hover:text-danger hover:bg-danger-soft transition-colors"
              title="Đăng xuất"
              aria-label="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Mobile Header (< lg) */}
        <header className="lg:hidden sticky top-0 z-30 h-14 w-full border-b border-border bg-surface px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Mở menu điều hướng"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="font-heading font-bold text-lg text-primary">
              VIOLYMPUS
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              to="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-xs"
              aria-label="Xem hồ sơ"
            >
              {user?.displayName?.[0]?.toUpperCase() || 'U'}
            </Link>
          </div>
        </header>

        {/* Mobile Slide-Out Drawer */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 flex"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di động"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <div className="relative flex-1 w-full max-w-xs bg-surface p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2 font-bold text-primary">
                    <Swords className="h-5 w-5" />
                    <span className="font-heading text-lg">VIOLYMPUS</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Đóng menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.to
                      : location.pathname.startsWith(item.to);

                    if (item.disabled) {
                      return (
                        <div
                          key={item.to}
                          className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] text-sm text-foreground-muted/60"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {item.badge}
                          </Badge>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary-soft text-primary font-semibold'
                            : 'text-foreground-muted hover:bg-surface-muted',
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  {isEditor && (
                    <div className="pt-3 mt-3 border-t border-border">
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-amber-900 bg-amber-50"
                      >
                        <ShieldAlert className="h-5 w-5 text-amber-700" />
                        <span>Admin Studio</span>
                      </Link>
                    </div>
                  )}
                </nav>
              </div>

              <div className="pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-center gap-2 text-danger hover:bg-danger-soft"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main id="app-content" className="flex-1 pb-16 lg:pb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation (< lg) */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 border-t border-border bg-surface flex items-center justify-around px-2 shadow-sm"
          aria-label="Điều hướng nhanh di động"
        >
          {[
            { to: '/dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
            { to: '/practice', icon: BookOpen, label: 'Luyện tập' },
            { to: '/arena', icon: Swords, label: 'Đấu trường' },
            { to: '/profile', icon: User, label: 'Hồ sơ' },
          ].map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-foreground-muted hover:text-foreground',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5 mb-0.5" aria-hidden="true" />
                <span className="text-[11px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
