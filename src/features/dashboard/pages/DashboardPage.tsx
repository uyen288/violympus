import * as React from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Swords,
  BookOpen,
  Trophy,
  Zap,
  ArrowRight,
  TrendingUp,
  Hash,
} from 'lucide-react';
import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = React.useState('');

  const handleJoinByPin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = roomCode.trim().toUpperCase();
    if (!clean || clean.length < 4) {
      toast.error('Vui lòng nhập mã phòng hợp lệ (tối thiểu 4 ký tự)');
      return;
    }
    navigate(`/arena/room/${clean}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-indigo-900 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-accent-gold" />
              <span>Học tập & Đấu trường</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
              Xin chào, {user?.displayName || 'Học viên'}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Hôm nay bạn muốn củng cố kiến thức với bài luyện tập mới, hay bước vào đấu trường thời gian thực để nâng cao thứ hạng?
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="md" className="bg-white text-primary hover:bg-slate-100 font-bold gap-2 shadow-xs">
              <Link to="/practice">
                <BookOpen className="h-4 w-4" />
                <span>Luyện tập ngay</span>
              </Link>
            </Button>
            <Button asChild size="md" className="bg-accent-gold text-slate-900 hover:bg-amber-400 font-bold gap-2 shadow-xs">
              <Link to="/arena">
                <Swords className="h-4 w-4" />
                <span>Đấu trường Realtime</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground-muted">Điểm kinh nghiệm (XP)</p>
            <p className="font-heading text-2xl font-black text-foreground mt-1 tabular-nums">
              {user?.xp || 0}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-accent-gold border border-amber-200">
            <Zap className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground-muted">Cấp độ hiện tại</p>
            <p className="font-heading text-2xl font-black text-foreground mt-1 tabular-nums">
              Cấp {user?.level || 1}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground-muted">Vai trò tài khoản</p>
            <div className="mt-1">
              <Badge variant={user?.role === 'admin' ? 'gold' : 'secondary'} className="capitalize text-xs font-bold">
                {user?.role || 'Learner'}
              </Badge>
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            <Trophy className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground-muted">Trạng thái bảo mật</p>
            <p className="font-heading text-sm font-bold text-success mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              Đã xác thực
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-soft text-success">
            <Swords className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Join Arena by Room Code PIN */}
        <Card className="lg:col-span-1 border-primary/30 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-soft text-primary">
                <Hash className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Vào phòng đấu bằng mã</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Nhập mã PIN phòng do bạn bè hoặc trọng tài cung cấp để tham gia ngay.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinByPin} className="space-y-3">
              <Input
                placeholder="VD: OLY888"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="font-mono text-center tracking-widest text-lg font-bold uppercase"
                maxLength={8}
              />
              <Button type="submit" className="w-full gap-2 font-bold" size="md">
                <Swords className="h-4 w-4" />
                <span>Tham gia phòng</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Activity / Recommendations */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Lịch sử hoạt động gần đây</CardTitle>
              <CardDescription className="text-xs">
                Các bài luyện tập và trận đấu đối kháng bạn đã tham gia
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
              <Link to="/practice">
                <span>Xem tất cả</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="Chưa có lịch sử làm bài"
              description="Hãy bắt đầu luyện tập một chủ đề hoặc tham gia đấu trường để tích lũy XP đầu tiên!"
              actionLabel="Bắt đầu luyện tập"
              onAction={() => navigate('/practice')}
              className="py-6"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
