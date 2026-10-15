import * as React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/app/providers';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { UserRole } from '@/types/auth';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Đang kiểm tra phiên đăng nhập..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  return <>{children}</>;
}

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    return <Navigate to={redirect ? decodeURIComponent(redirect) : '/dashboard'} replace />;
  }

  return <>{children}</>;
}

export function RequireRole({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Đang xác thực quyền truy cập..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }

  if (role === 'editor' && user.role !== 'editor' && user.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
