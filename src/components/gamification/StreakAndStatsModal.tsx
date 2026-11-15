import * as React from 'react';
import { Flame, BarChart3, Bell, Zap, Trophy, Clock, Target } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGamificationStore } from '@/lib/gamification/gamificationStore';
import { getLevelProgress } from '@/lib/gamification/xpSystem';
import { toast } from 'sonner';

export interface StreakAndStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'streak' | 'stats' | 'reminder';
}

export function StreakAndStatsModal({ isOpen, onClose, defaultTab = 'streak' }: StreakAndStatsModalProps) {
  const [activeTab, setActiveTab] = React.useState<'streak' | 'stats' | 'reminder'>(defaultTab);

  const {
    streak,
    xp,
    studySecondsToday,
    studyReminderEnabled,
    studyReminderTime,
    dailyGoalMinutes,
    setStudyReminder,
  } = useGamificationStore();

  const [reminderEnabled, setReminderEnabled] = React.useState(studyReminderEnabled);
  const [reminderTime, setReminderTime] = React.useState(studyReminderTime);
  const [goalMins, setGoalMins] = React.useState(dailyGoalMinutes);

  const levelInfo = getLevelProgress(xp);
  const studyMinutes = Math.floor(studySecondsToday / 60);

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  // Current day index (0 is Monday)
  const currentDayIndex = (new Date().getDay() + 6) % 7;

  const handleSaveReminder = () => {
    setStudyReminder(reminderEnabled, reminderTime, goalMins);
    toast.success('Đã lưu cấu hình mục tiêu và nhắc nhở học tập!');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Chuỗi Ngày Học & Thống Kê"
      description="Theo dõi ngọn lửa học tập, kiểm tra tiến độ thăng cấp và thiết lập mục tiêu hàng ngày."
      className="max-w-xl"
    >
      <div className="space-y-5">
        {/* Tab Navigation */}
        <div className="flex border-b border-border text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('streak')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'streak'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <Flame className="h-4 w-4 text-amber-500" />
            <span>Chuỗi Streak</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'stats'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Tiến độ & Cấp độ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reminder')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'reminder'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Mục tiêu & Nhắc nhở</span>
          </button>
        </div>

        {/* Tab 1: Streak */}
        {activeTab === 'streak' && (
          <div className="space-y-4 text-center">
            <div className="p-6 rounded-2xl border border-amber-300/40 bg-gradient-to-b from-amber-50/50 via-surface to-surface space-y-3">
              <div className="text-5xl animate-bounce">🔥</div>
              <div className="text-3xl font-black font-heading text-amber-600">
                {streak} ngày liên tiếp
              </div>
              <p className="text-xs text-foreground-muted max-w-sm mx-auto leading-relaxed">
                Tuyệt vời! Bạn đang duy trì phong độ rất tốt. Hãy vào học ít nhất 5 phút mỗi ngày để ngọn lửa không bị dập tắt nhé!
              </p>

              {/* Weekly Dots */}
              <div className="pt-3">
                <div className="flex items-center justify-center gap-2">
                  {daysOfWeek.map((day, idx) => {
                    const isToday = idx === currentDayIndex;
                    const isPast = idx < currentDayIndex;

                    return (
                      <div key={day} className="flex flex-col items-center gap-1">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isToday
                              ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                              : isPast
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-surface-muted text-foreground-muted'
                          }`}
                        >
                          {isToday || isPast ? '✓' : day}
                        </div>
                        <span className="text-[10px] text-foreground-muted font-medium">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Stats & Level */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Level Card */}
            <div className="p-4 rounded-xl border border-border bg-surface-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary-soft text-primary">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Cấp {levelInfo.currentLevel}: {levelInfo.title}
                    </div>
                    <div className="text-xs text-foreground-muted">
                      {levelInfo.currentXP} XP / {levelInfo.maxXP} XP để lên Cấp {levelInfo.nextLevel}
                    </div>
                  </div>
                </div>

                <Badge variant="gold" className="text-xs font-bold">
                  {levelInfo.percentage}%
                </Badge>
              </div>

              {/* Level Progress Bar */}
              <div className="h-2.5 w-full bg-surface-muted rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent-gold transition-all duration-300"
                  style={{ width: `${levelInfo.percentage}%` }}
                />
              </div>

              <div className="text-[11px] text-foreground-muted text-right">
                Còn cần thêm <strong>{levelInfo.xpNeeded} XP</strong> nữa để thăng cấp tiếp theo!
              </div>
            </div>

            {/* Today Activity stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-border bg-surface text-center space-y-1">
                <Clock className="h-5 w-5 text-primary mx-auto" />
                <div className="text-xs text-foreground-muted">Thời gian học hôm nay</div>
                <div className="text-xl font-black font-heading text-foreground">
                  {studyMinutes} phút
                </div>
                <div className="text-[10px] text-foreground-muted">
                  Mục tiêu: {dailyGoalMinutes} phút
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-surface text-center space-y-1">
                <Zap className="h-5 w-5 text-amber-500 mx-auto" />
                <div className="text-xs text-foreground-muted">Tổng điểm kinh nghiệm</div>
                <div className="text-xl font-black font-heading text-amber-600">
                  {xp} XP
                </div>
                <div className="text-[10px] text-foreground-muted">
                  Tích lũy từ mọi hoạt động
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reminder & Daily Goal */}
        {activeTab === 'reminder' && (
          <div className="space-y-4">
            <div className="space-y-3 rounded-xl border border-border p-4 bg-surface">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-foreground">Bật thông báo nhắc nhở</div>
                  <div className="text-xs text-foreground-muted">Nhắc bạn vào rèn luyện mỗi ngày</div>
                </div>
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="h-5 w-5 rounded border-border text-primary cursor-pointer"
                />
              </div>

              {reminderEnabled && (
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Giờ nhắc nhở mỗi ngày:</span>
                  <select
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold"
                  >
                    <option value="07:00">07:00 (Buổi sáng)</option>
                    <option value="12:00">12:00 (Buổi trưa)</option>
                    <option value="19:00">19:00 (Buổi tối)</option>
                    <option value="20:00">20:00 (Buổi tối)</option>
                    <option value="21:00">21:00 (Buổi tối)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Daily Goal Setting */}
            <div className="space-y-3 rounded-xl border border-border p-4 bg-surface">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Mục tiêu học mỗi ngày</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setGoalMins(mins)}
                    className={`py-2 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      goalMins === mins
                        ? 'border-primary bg-primary text-white shadow-xs'
                        : 'border-border bg-surface hover:bg-surface-muted text-foreground'
                    }`}
                  >
                    {mins} phút
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" onClick={handleSaveReminder} className="font-bold">
                Lưu cài đặt
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
