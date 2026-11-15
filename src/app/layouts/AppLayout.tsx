import * as React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  Swords,
  BookOpen,
  Trophy,
  Mountain,
  Timer,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Flame,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/app/providers';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGamificationStore } from '@/lib/gamification/gamificationStore';
import { getLevelProgress } from '@/lib/gamification/xpSystem';
import { GemsAndTasksModal } from '@/components/gamification/GemsAndTasksModal';
import { StreakAndStatsModal } from '@/components/gamification/StreakAndStatsModal';
import { cn } from '@/lib/utils/cn';

export function AppLayout() {
  const { user, isEditor, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [isGemsModalOpen, setIsGemsModalOpen] = React.useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = React.useState(false);
  const [streakModalTab, setStreakModalTab] = React.useState<'streak' | 'stats' | 'reminder'>('streak');

  const {
    gems,
    xp,
    streak,
    initToday,
    syncFromProfile,
  } = useGamificationStore();

  React.useEffect(() => {
    initToday();
  }, [initToday]);

  React.useEffect(() => {
    if (user) {
      syncFromProfile(user);
    }
  }, [user, syncFromProfile]);

  const levelInfo = getLevelProgress(xp);

  // Close menus on route change during render
  const [prevPath, setPrevPath] = React.useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
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

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <a href="#app-content" className="skip-link">
        Bỏ qua tới nội dung chính
      </a>

      {/* Top Horizontal Navigation Bar */}
      <header className="sticky top-0 z-40 h-16 w-full border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo (Home) */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              to="/dashboard"
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

          {/* Right: Gamification Widgets & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Widget Button */}
            <button
              type="button"
              onClick={() => {
                setStreakModalTab('streak');
                setIsStreakModalOpen(true);
              }}
              title="Chuỗi ngày học liên tiếp"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-300/60 bg-amber-50/70 hover:bg-amber-100/70 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
              <span>{streak}</span>
            </button>

            {/* Gems Balance Button */}
            <button
              type="button"
              onClick={() => setIsGemsModalOpen(true)}
              title="Kho kim cương & Nhiệm vụ"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary-soft/60 hover:bg-primary-soft text-primary text-xs font-bold transition-colors cursor-pointer"
            >
              <span className="text-sm">💎</span>
              <span className="font-mono">{gems}</span>
            </button>

            {/* Level & XP Badge Button */}
            <button
              type="button"
              onClick={() => {
                setStreakModalTab('stats');
                setIsStreakModalOpen(true);
              }}
              title={`Cấp ${levelInfo.currentLevel} • ${xp} XP`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-surface hover:bg-surface-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-accent-gold fill-accent-gold" />
              <span>Lv.{levelInfo.currentLevel}</span>
            </button>

            <LanguageSwitcher />

            {/* Admin Studio direct button for editors and admins */}
            {isEditor && (
              <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex gap-1.5 h-8 text-xs font-bold shadow-sm">
                <Link to="/admin">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Admin Studio</span>
                </Link>
              </Button>
            )}

            {/* User Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-surface-muted transition-colors cursor-pointer"
                aria-expanded={userMenuOpen}
                aria-label="Menu tài khoản"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-xs overflow-hidden border border-border">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    user?.displayName?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-foreground-muted hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface p-1.5 shadow-lg space-y-1 animate-in fade-in zoom-in-95 z-50 text-foreground"
                  role="menu"
                >
                  <div className="px-3 py-2 border-b border-border/80">
                    <p className="text-xs font-bold text-foreground truncate">{user?.displayName}</p>
                    <p className="text-[11px] text-foreground-muted truncate font-mono">{user?.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-amber-700 font-bold">
                      <span>Cấp {levelInfo.currentLevel} ({levelInfo.title})</span>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-surface-muted transition-colors"
                  >
                    <User className="h-4 w-4 text-foreground-muted" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-surface-muted transition-colors"
                  >
                    <Settings className="h-4 w-4 text-foreground-muted" />
                    <span>Cài đặt</span>
                  </Link>

                  {isEditor && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-amber-800 hover:bg-amber-50 transition-colors"
                    >
                      <ShieldAlert className="h-4 w-4 text-amber-600" />
                      <span>Admin Studio</span>
                    </Link>
                  )}

                  <div className="border-t border-border pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-semibold text-danger hover:bg-danger-soft transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="h-4 w-4 text-danger" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

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
        <div className="md:hidden border-b border-border bg-surface p-4 space-y-3 animate-in slide-in-from-top-2">
          {/* Mobile Streak & Gems bar */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-surface-muted/40">
            <button
              type="button"
              onClick={() => {
                setStreakModalTab('streak');
                setIsStreakModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-800"
            >
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>Chuỗi {streak} ngày</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsGemsModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-primary"
            >
              <span>💎 {gems} Kim cương</span>
            </button>
          </div>

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

            {isEditor && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold bg-amber-50 text-amber-900 border border-amber-200 transition-colors mt-2"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-4 w-4 text-amber-700" />
                  <span>Admin Studio</span>
                </div>
                <Badge variant="gold" className="text-[10px]">
                  QUẢN TRỊ
                </Badge>
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Main Content (Horizontal, full-width with clean max-w-7xl) */}
      <main id="app-content" className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Gamification Modals */}
      <GemsAndTasksModal
        isOpen={isGemsModalOpen}
        onClose={() => setIsGemsModalOpen(false)}
      />

      <StreakAndStatsModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        defaultTab={streakModalTab}
      />
    </div>
  );
}
