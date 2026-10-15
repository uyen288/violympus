import { Outlet, Link, useLocation } from 'react-router';
import {
  ShieldAlert,
  LayoutDashboard,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  Users,
  History,
  FileCheck2,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/app/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export function AdminLayout() {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const adminNav = [
    { to: '/admin', icon: LayoutDashboard, label: 'Tổng quan', exact: true },
    { to: '/admin/subjects', icon: Layers, label: 'Lĩnh vực & Chủ đề' },
    { to: '/admin/questions', icon: HelpCircle, label: 'Ngân hàng câu hỏi' },
    { to: '/admin/exams', icon: FileCheck2, label: 'Quản lý đề thi' },
    { to: '/admin/import', icon: FileSpreadsheet, label: 'Nhập liệu CSV/XLSX' },
    ...(isAdmin
      ? [
          { to: '/admin/users', icon: Users, label: 'Người dùng & Quyền' },
          { to: '/admin/audit', icon: History, label: 'Nhật ký kiểm toán' },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col border-r border-border bg-surface shrink-0 fixed inset-y-0 left-0 z-30"
        aria-label="Thanh quản trị Admin Studio"
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            <span className="font-heading font-bold text-base text-foreground tracking-tight">
              Admin Studio
            </span>
          </div>
          <Badge variant="gold" className="text-[10px] uppercase">
            {user?.role || 'editor'}
          </Badge>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {adminNav.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon
                  className={cn('h-5 w-5', isActive ? 'text-amber-800' : 'text-foreground-muted')}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-2">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span>Về Violympus App</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-start gap-2 text-danger hover:bg-danger-soft"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <header className="h-16 border-b border-border bg-surface px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <Link to="/admin" className="hover:text-foreground font-medium">
              Admin Studio
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">
              {adminNav.find((item) =>
                item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to),
              )?.label || 'Bảng điều khiển'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-foreground">{user?.displayName}</div>
              <div className="text-[11px] text-foreground-muted">{user?.email}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-xs">
              {user?.displayName?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
