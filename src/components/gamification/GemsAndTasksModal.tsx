import * as React from 'react';
import { Sparkles, Calendar, CheckCircle2, Gift } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGamificationStore } from '@/lib/gamification/gamificationStore';
import { toast } from 'sonner';

export interface GemsAndTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'checkin' | 'tasks' | 'shop';
}

export function GemsAndTasksModal({ isOpen, onClose, defaultTab = 'checkin' }: GemsAndTasksModalProps) {
  const [activeTab, setActiveTab] = React.useState<'checkin' | 'tasks' | 'shop'>(defaultTab);

  const {
    gems,
    streak,
    dailyCheckInClaimed,
    checkInDay,
    tasks,
    claimDailyCheckIn,
    claimTask,
  } = useGamificationStore();

  const dayRewards = [
    { day: 1, gems: 10, xp: 20 },
    { day: 2, gems: 15, xp: 25 },
    { day: 3, gems: 20, xp: 30 },
    { day: 4, gems: 25, xp: 35 },
    { day: 5, gems: 30, xp: 40 },
    { day: 6, gems: 40, xp: 50 },
    { day: 7, gems: 50, xp: 100, special: true },
  ];

  const handleClaimCheckIn = async () => {
    const earned = await claimDailyCheckIn();
    if (earned > 0) {
      toast.success(`Điểm danh thành công! Bạn nhận được +${earned} Kim cương 💎 và +30 XP ⚡!`);
    }
  };

  const handleClaimTask = async (taskId: string, title: string, gemReward: number, xpReward: number) => {
    const success = await claimTask(taskId);
    if (success) {
      toast.success(`Đã nhận thưởng nhiệm vụ "${title}": +${gemReward} 💎 và +${xpReward} XP!`);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Tiện ích Kim Cương & Nhiệm Vụ"
      description="Điểm danh mỗi ngày, làm nhiệm vụ nhận kim cương và sử dụng để tạo hoặc tham gia đấu trường tri thức."
      className="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Balance Header Banner */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary-soft/50 via-surface to-accent-gold-soft/40">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center text-2xl shadow-sm">
              💎
            </div>
            <div>
              <div className="text-xs text-foreground-muted font-medium">Số dư hiện tại</div>
              <div className="text-2xl font-black font-heading text-primary flex items-center gap-1.5">
                <span>{gems}</span>
                <span className="text-sm font-semibold text-foreground">Kim cương</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-foreground-muted">Chuỗi ngày học</div>
            <div className="text-lg font-bold text-amber-600 flex items-center justify-end gap-1">
              <span>🔥 {streak} ngày</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('checkin')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'checkin'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Điểm danh 7 ngày</span>
            {!dailyCheckInClaimed && (
              <span className="h-2 w-2 rounded-full bg-danger animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'tasks'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <Gift className="h-4 w-4" />
            <span>Nhiệm vụ ngày</span>
            {tasks.some((t) => t.current >= t.target && !t.isClaimed) && (
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shop')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'shop'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Sử dụng Kim cương</span>
          </button>
        </div>

        {/* Tab 1: Check-in */}
        {activeTab === 'checkin' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {dayRewards.map((item) => {
                const isPassed = item.day < checkInDay;
                const isCurrent = item.day === checkInDay;
                const isClaimedToday = isCurrent && dailyCheckInClaimed;

                return (
                  <div
                    key={item.day}
                    className={`rounded-xl border p-2 text-center transition-all flex flex-col items-center justify-between min-h-[96px] ${
                      isPassed || isClaimedToday
                        ? 'bg-surface-muted/60 border-border opacity-85'
                        : isCurrent
                          ? 'border-primary bg-primary-soft/40 shadow-xs ring-1 ring-primary'
                          : 'border-border/80 bg-surface'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-foreground-muted">
                      Ngày {item.day}
                    </div>

                    <div className="text-xl my-1">
                      {item.special ? '🎁' : '💎'}
                    </div>

                    <div className="text-xs font-black text-primary">
                      +{item.gems}
                    </div>

                    <div className="mt-1">
                      {isPassed || isClaimedToday ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      ) : isCurrent ? (
                        <span className="text-[10px] font-bold text-primary">Hôm nay</span>
                      ) : (
                        <span className="text-[10px] text-foreground-muted">Khóa</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={dailyCheckInClaimed}
                onClick={handleClaimCheckIn}
                className="w-full sm:w-auto font-bold gap-2"
              >
                <Gift className="h-5 w-5" />
                <span>
                  {dailyCheckInClaimed
                    ? 'Đã điểm danh hôm nay ✓'
                    : `Điểm danh ngay (+${dayRewards[checkInDay - 1]?.gems || 15} 💎)`}
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Daily Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isDone = task.current >= task.target;
              const percent = Math.min(100, Math.round((task.current / task.target) * 100));

              return (
                <div
                  key={task.id}
                  className="rounded-xl border border-border p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface hover:bg-surface-muted/20 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{task.title}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[11px] font-semibold text-primary gap-0.5">
                          +{task.gemReward} 💎
                        </Badge>
                        <Badge variant="secondary" className="text-[11px] font-semibold text-amber-700 gap-0.5">
                          +{task.xpReward} XP
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-foreground-muted">{task.description}</p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex-1 h-2 rounded-full bg-surface-muted overflow-hidden">
                        <div
                          className={`h-full transition-all ${isDone ? 'bg-success' : 'bg-primary'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-foreground-muted shrink-0 font-medium">
                        {task.current} / {task.target} {task.unit}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto text-right">
                    {task.isClaimed ? (
                      <span className="text-xs font-semibold text-foreground-muted flex items-center gap-1 justify-end">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        Đã nhận
                      </span>
                    ) : (
                      <Button
                        type="button"
                        variant={isDone ? 'primary' : 'outline'}
                        size="sm"
                        disabled={!isDone}
                        onClick={() => handleClaimTask(task.id, task.title, task.gemReward, task.xpReward)}
                        className="w-full sm:w-auto font-bold"
                      >
                        {isDone ? 'Nhận thưởng' : 'Chưa xong'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Gems Utilities / Shop */}
        {activeTab === 'shop' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-border p-4 bg-surface-muted/30 space-y-3">
              <div className="text-sm font-bold text-foreground">Bạn có thể dùng Kim Cương để:</div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-border bg-surface text-center space-y-1">
                  <div className="text-xl">⚔️</div>
                  <div className="text-xs font-bold text-foreground">Tạo phòng Đấu trường</div>
                  <div className="text-[11px] text-primary font-black">10 Kim cương</div>
                  <div className="text-[10px] text-foreground-muted">Là chủ phòng, tùy chỉnh câu hỏi</div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface text-center space-y-1">
                  <div className="text-xl">🛡️</div>
                  <div className="text-xs font-bold text-foreground">Tham gia Đấu trường</div>
                  <div className="text-[11px] text-primary font-black">5 Kim cương</div>
                  <div className="text-[10px] text-foreground-muted">Vào phòng thách đấu cùng bạn bè</div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface text-center space-y-1">
                  <div className="text-xl">🏔️</div>
                  <div className="text-xs font-bold text-foreground">Leo núi Olympia (4 người)</div>
                  <div className="text-[11px] text-primary font-black">10 Kim cương</div>
                  <div className="text-[10px] text-foreground-muted">Cơ hội nhận +50 💎 khi vô địch</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-foreground-muted p-2 leading-relaxed">
              💡 <strong>Mẹo:</strong> Hãy duy trì chuỗi học tập hàng ngày và hoàn thành các nhiệm vụ học tập trên để nhận thêm nhiều kim cương và điểm XP miễn phí!
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
