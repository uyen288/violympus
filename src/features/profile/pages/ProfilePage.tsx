import { useAuth } from '@/app/providers';
import { Mail, Shield, Zap, Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Hồ sơ cá nhân
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted mt-1">
          Thông tin chi tiết về tài khoản và hành trình học tập tại Violympus.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-border">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white text-2xl font-bold shadow-md">
            {user?.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-xl">{user?.displayName}</CardTitle>
              <Badge variant={user?.role === 'admin' ? 'gold' : 'secondary'} className="capitalize">
                {user?.role}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2 text-xs">
              <Mail className="h-3.5 w-3.5" />
              <span>{user?.email}</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-surface-muted/30 p-4 text-center">
              <div className="flex justify-center mb-1 text-accent-gold">
                <Zap className="h-5 w-5" />
              </div>
              <div className="font-heading text-2xl font-black tabular-nums">{user?.xp || 0}</div>
              <div className="text-xs text-foreground-muted">Tổng điểm XP</div>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/30 p-4 text-center">
              <div className="flex justify-center mb-1 text-primary">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="font-heading text-2xl font-black tabular-nums">Cấp {user?.level || 1}</div>
              <div className="text-xs text-foreground-muted">Cấp độ danh dự</div>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/30 p-4 text-center">
              <div className="flex justify-center mb-1 text-emerald-600">
                <Shield className="h-5 w-5" />
              </div>
              <div className="font-heading text-base font-bold capitalize mt-1">{user?.role || 'Learner'}</div>
              <div className="text-xs text-foreground-muted">Phân quyền hệ thống</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
