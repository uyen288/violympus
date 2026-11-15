import * as React from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Swords,
  BookOpen,
  Zap,
  ArrowRight,
  Hash,
  Mountain,
  Flame,
  Gift,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useGamificationStore } from '@/lib/gamification/gamificationStore';
import { getLevelProgress } from '@/lib/gamification/xpSystem';
import { GemsAndTasksModal } from '@/components/gamification/GemsAndTasksModal';
import { StreakAndStatsModal } from '@/components/gamification/StreakAndStatsModal';
import { toast } from 'sonner';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = React.useState('');
  const [isGemsModalOpen, setIsGemsModalOpen] = React.useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = React.useState(false);

  const {
    gems,
    xp,
    streak,
    studySecondsToday,
    tasks,
    claimTask,
  } = useGamificationStore();

  const levelInfo = getLevelProgress(xp);
  const studyMinutes = Math.floor(studySecondsToday / 60);

  const handleJoinByPin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = roomCode.trim().toUpperCase();
    if (!clean || clean.length < 4) {
      toast.error('Vui lòng nhập mã phòng hợp lệ (tối thiểu 4 ký tự)');
      return;
    }
    navigate(`/arena/room/${clean}`);
  };

  const handleClaimTask = async (taskId: string, title: string, gemReward: number, xpReward: number) => {
    const success = await claimTask(taskId);
    if (success) {
      toast.success(`Đã nhận thưởng nhiệm vụ "${title}": +${gemReward} 💎 và +${xpReward} XP!`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-accent-gold" />
              <span>Học tập & Đấu trường Trí tuệ</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
              Xin chào, {user?.displayName || 'Học viên'}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Chào mừng bạn trở lại! Hãy rèn luyện kiến thức, leo đỉnh Olympia nghẹt thở và tích lũy kim cương thăng hạng hôm nay.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild size="md" className="bg-white text-primary hover:bg-slate-100 font-bold gap-2 shadow-xs">
              <Link to="/practice">
                <BookOpen className="h-4 w-4" />
                <span>Luyện tập</span>
              </Link>
            </Button>
            <Button asChild size="md" className="bg-accent-gold text-slate-900 hover:bg-amber-400 font-bold gap-2 shadow-xs">
              <Link to="/climb">
                <Mountain className="h-4 w-4" />
                <span>Leo núi Olympia</span>
              </Link>
            </Button>
            <Button asChild size="md" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 font-bold gap-2">
              <Link to="/arena">
                <Swords className="h-4 w-4" />
                <span>Đấu trường</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Gamification Stats Grid (XP, Level, Gems, Streak) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Level & XP Progress Card */}
        <button
          type="button"
          onClick={() => setIsStreakModalOpen(true)}
          className="p-4 rounded-xl border border-border bg-surface hover:bg-surface-muted/30 transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground-muted">Cấp độ & XP</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-accent-gold border border-amber-200 group-hover:scale-105 transition-transform">
              <Zap className="h-4 w-4 fill-accent-gold" />
            </div>
          </div>
          <div>
            <div className="font-heading text-xl sm:text-2xl font-black text-foreground tabular-nums">
              Cấp {levelInfo.currentLevel}
            </div>
            <div className="text-[11px] text-foreground-muted mt-0.5 truncate font-medium">
              {levelInfo.title} ({levelInfo.currentXP} XP)
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent-gold"
              style={{ width: `${levelInfo.percentage}%` }}
            />
          </div>
        </button>

        {/* Gems Balance Card */}
        <button
          type="button"
          onClick={() => setIsGemsModalOpen(true)}
          className="p-4 rounded-xl border border-border bg-surface hover:bg-surface-muted/30 transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground-muted">Ví Kim Cương</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary group-hover:scale-105 transition-transform text-lg">
              💎
            </div>
          </div>
          <div>
            <div className="font-heading text-xl sm:text-2xl font-black text-primary tabular-nums">
              {gems}
            </div>
            <div className="text-[11px] text-foreground-muted mt-0.5">
              Dùng để tạo & vào phòng đấu
            </div>
          </div>
          <div className="text-[10px] text-primary font-bold">
            Bấm để điểm danh & nhận quà →
          </div>
        </button>

        {/* Streak Flame Card */}
        <button
          type="button"
          onClick={() => setIsStreakModalOpen(true)}
          className="p-4 rounded-xl border border-border bg-surface hover:bg-surface-muted/30 transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground-muted">Chuỗi Ngày Học</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 group-hover:scale-105 transition-transform">
              <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div>
            <div className="font-heading text-xl sm:text-2xl font-black text-amber-600 tabular-nums">
              {streak} ngày
            </div>
            <div className="text-[11px] text-foreground-muted mt-0.5">
              Học mỗi ngày giữ ngọn lửa
            </div>
          </div>
          <div className="text-[10px] text-amber-700 font-bold">
            Xem lịch tuần này →
          </div>
        </button>

        {/* Study Time Today Card */}
        <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground-muted">Thời Gian Học Hôm Nay</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="font-heading text-xl sm:text-2xl font-black text-foreground tabular-nums">
              {studyMinutes} phút
            </div>
            <div className="text-[11px] text-foreground-muted mt-0.5">
              Mục tiêu: 15 phút mỗi ngày
            </div>
          </div>
          <div className="text-[10px] text-success font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Tự động ghi nhận khi làm bài</span>
          </div>
        </div>
      </div>

      {/* Main Action Hub & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Daily Tasks and Olympia Teaser */}
        <div className="lg:col-span-2 space-y-6">
          {/* Olympia Climbing Teaser Banner */}
          <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-surface to-surface p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent-gold text-slate-900 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                🏔️
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                    Đường Lên Đỉnh Olympia
                  </h3>
                  <Badge variant="gold" className="text-[10px]">Gameshow Trí Tuệ</Badge>
                </div>
                <p className="text-xs text-foreground-muted leading-relaxed max-w-lg">
                  Vượt qua 4 phần thi: Khởi động 60s, Vượt chướng ngại vật ô chữ, Tăng tốc 40 điểm và Về đích với Ngôi sao hy vọng.
                </p>
              </div>
            </div>

            <Button asChild variant="gold" size="md" className="shrink-0 font-bold shadow-xs">
              <Link to="/climb">Tham gia ngay</Link>
            </Button>
          </div>

          {/* Daily Tasks List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Nhiệm Vụ Hằng Ngày</CardTitle>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  Hoàn thành các nhiệm vụ để nhận Kim cương và điểm kinh nghiệm (XP)
                </CardDescription>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsGemsModalOpen(true)}
                className="text-xs text-primary"
              >
                Xem tất cả
              </Button>
            </CardHeader>

            <CardContent className="space-y-2.5 pt-0">
              {tasks.slice(0, 3).map((task) => {
                const isDone = task.current >= task.target;
                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border border-border bg-surface-muted/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-semibold text-foreground truncate">{task.title}</div>
                      <div className="text-[11px] text-foreground-muted">{task.description}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-primary">+{task.gemReward} 💎</span>
                      {task.isClaimed ? (
                        <Badge variant="secondary" className="text-[10px] text-success">
                          Đã nhận ✓
                        </Badge>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant={isDone ? 'primary' : 'outline'}
                          disabled={!isDone}
                          onClick={() => handleClaimTask(task.id, task.title, task.gemReward, task.xpReward)}
                          className="h-7 text-xs font-bold"
                        >
                          {isDone ? 'Nhận' : `${task.current}/${task.target}`}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Quick Arena Join & Quick Links */}
        <div className="space-y-6">
          {/* Quick Join Arena by Room Code PIN */}
          <Card className="border-primary/30 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary-soft text-primary">
                  <Hash className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">Vào phòng đấu bằng mã</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Nhập mã PIN phòng để vào so tài đối kháng trực tiếp.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinByPin} className="space-y-3">
                <Input
                  placeholder="VD: 7X9K2P"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="font-mono text-center tracking-widest text-lg font-bold uppercase"
                  maxLength={8}
                />
                <Button type="submit" className="w-full gap-2 font-bold" size="md">
                  <Swords className="h-4 w-4" />
                  <span>Vào phòng đấu</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Practice & Exams Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Học tập & Đề thi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Link
                to="/practice"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-surface-muted transition-colors text-xs font-semibold"
              >
                <span>Các trò chơi rèn luyện phản xạ</span>
                <ArrowRight className="h-3.5 w-3.5 text-foreground-muted" />
              </Link>
              <Link
                to="/exams"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-surface-muted transition-colors text-xs font-semibold"
              >
                <span>Thi thử & Khảo sát kiến thức</span>
                <ArrowRight className="h-3.5 w-3.5 text-foreground-muted" />
              </Link>
              <Link
                to="/leaderboard"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-surface-muted transition-colors text-xs font-semibold"
              >
                <span>Bảng vàng xếp hạng danh dự</span>
                <ArrowRight className="h-3.5 w-3.5 text-foreground-muted" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gamification Modals */}
      <GemsAndTasksModal
        isOpen={isGemsModalOpen}
        onClose={() => setIsGemsModalOpen(false)}
      />

      <StreakAndStatsModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
      />
    </div>
  );
}
