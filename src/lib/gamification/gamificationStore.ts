import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';
import { calculateLevel } from './xpSystem';

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  gemReward: number;
  xpReward: number;
  current: number;
  target: number;
  unit: string;
  isClaimed: boolean;
}

const DEFAULT_TASKS: DailyTask[] = [
  {
    id: 'daily_login',
    title: 'Khởi động ngày mới',
    description: 'Đăng nhập vào hệ thống Violympus hôm nay',
    gemReward: 10,
    xpReward: 20,
    current: 1,
    target: 1,
    unit: 'lần',
    isClaimed: false,
  },
  {
    id: 'study_5_mins',
    title: 'Luyện tập chăm chỉ',
    description: 'Học tập hoặc làm bài trong ít nhất 5 phút',
    gemReward: 15,
    xpReward: 30,
    current: 0,
    target: 5,
    unit: 'phút',
    isClaimed: false,
  },
  {
    id: 'complete_quiz',
    title: 'Chinh phục tri thức',
    description: 'Hoàn thành 1 ván trò chơi học tập hoặc 1 đề thi',
    gemReward: 20,
    xpReward: 40,
    current: 0,
    target: 1,
    unit: 'bài',
    isClaimed: false,
  },
  {
    id: 'play_climb_or_arena',
    title: 'Đấu sĩ cừ khôi',
    description: 'Tham gia 1 trận đấu trường hoặc 1 vòng leo núi Olympia',
    gemReward: 25,
    xpReward: 50,
    current: 0,
    target: 1,
    unit: 'trận',
    isClaimed: false,
  },
];

export interface GamificationState {
  gems: number;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  studySecondsToday: number;
  dailyCheckInClaimed: boolean;
  checkInDay: number; // 1 to 7
  tasks: DailyTask[];
  studyReminderEnabled: boolean;
  studyReminderTime: string;
  dailyGoalMinutes: number;

  // Actions
  initToday: () => void;
  awardXP: (amount: number, reason: string) => Promise<void>;
  addGems: (amount: number, reason: string) => Promise<void>;
  spendGems: (amount: number, reason: string) => Promise<boolean>;
  claimDailyCheckIn: () => Promise<number>;
  claimTask: (taskId: string) => Promise<boolean>;
  addStudySeconds: (seconds: number) => void;
  incrementTaskProgress: (taskId: string, amount?: number) => void;
  setStudyReminder: (enabled: boolean, time: string, goalMinutes: number) => void;
  syncFromProfile: (profile: { xp?: number; level?: number; gems?: number; streakDays?: number }) => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      gems: 50,
      xp: 0,
      level: 1,
      streak: 1,
      lastActiveDate: getTodayString(),
      studySecondsToday: 0,
      dailyCheckInClaimed: false,
      checkInDay: 1,
      tasks: DEFAULT_TASKS,
      studyReminderEnabled: true,
      studyReminderTime: '20:00',
      dailyGoalMinutes: 15,

      initToday: () => {
        const today = getTodayString();
        const { lastActiveDate, streak, checkInDay } = get();

        if (lastActiveDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const isConsecutive = lastActiveDate === yesterday;
          const newStreak = isConsecutive ? streak + 1 : 1;
          const nextCheckInDay = isConsecutive ? ((checkInDay % 7) + 1) : 1;

          set({
            lastActiveDate: today,
            streak: newStreak,
            studySecondsToday: 0,
            dailyCheckInClaimed: false,
            checkInDay: nextCheckInDay,
            tasks: DEFAULT_TASKS.map((t) =>
              t.id === 'daily_login' ? { ...t, current: 1 } : { ...t, current: 0, isClaimed: false }
            ),
          });
        }
      },

      awardXP: async (amount: number, reason: string) => {
        const currentXP = get().xp;
        const newXP = Math.max(0, currentXP + amount);
        const newLevel = calculateLevel(newXP);

        set({ xp: newXP, level: newLevel });

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('profiles').update({
              xp: newXP,
              level: newLevel,
              updated_at: new Date().toISOString(),
            }).eq('id', user.id);

            // Also try RPC if available
            try {
              await supabase.rpc('add_user_xp', {
                p_amount: amount,
                p_reason: reason,
                p_source_type: 'app',
              });
            } catch {
              // Ignore RPC errors when table update succeeded
            }
          }
        } catch {
          // Fallback to local state if offline
        }
      },

      addGems: async (amount: number, reason: string) => {
        const currentGems = get().gems;
        const newGems = currentGems + amount;
        set({ gems: newGems });

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('profiles').update({
              gems: newGems,
              updated_at: new Date().toISOString(),
            }).eq('id', user.id);

            try {
              await supabase.rpc('modify_gems', {
                p_amount: amount,
                p_reason: reason,
              });
            } catch {
              // Ignore RPC errors
            }
          }
        } catch {
          // Fallback to local state if offline
        }
      },

      spendGems: async (amount: number, reason: string) => {
        const currentGems = get().gems;
        if (currentGems < amount) {
          return false;
        }

        const newGems = currentGems - amount;
        set({ gems: newGems });

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('profiles').update({
              gems: newGems,
              updated_at: new Date().toISOString(),
            }).eq('id', user.id);

            try {
              await supabase.rpc('modify_gems', {
                p_amount: -amount,
                p_reason: reason,
              });
            } catch {
              // Ignore RPC errors
            }
          }
        } catch {
          // Fallback to local state if offline
        }

        return true;
      },

      claimDailyCheckIn: async () => {
        const { dailyCheckInClaimed, checkInDay } = get();
        if (dailyCheckInClaimed) return 0;

        // Reward tiers for 7 days
        const dayRewards = [10, 15, 20, 25, 30, 40, 50];
        const earnedGems = dayRewards[(checkInDay - 1) % 7] || 15;
        const earnedXP = 30;

        set({ dailyCheckInClaimed: true });
        await get().addGems(earnedGems, `Điểm danh ngày ${checkInDay}`);
        await get().awardXP(earnedXP, `Điểm danh ngày ${checkInDay}`);

        return earnedGems;
      },

      claimTask: async (taskId: string) => {
        const tasks = get().tasks;
        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.isClaimed || task.current < task.target) {
          return false;
        }

        set({
          tasks: tasks.map((t) => (t.id === taskId ? { ...t, isClaimed: true } : t)),
        });

        await get().addGems(task.gemReward, `Nhiệm vụ: ${task.title}`);
        await get().awardXP(task.xpReward, `Nhiệm vụ: ${task.title}`);

        return true;
      },

      addStudySeconds: (seconds: number) => {
        const currentSecs = get().studySecondsToday + seconds;
        const currentMins = Math.floor(currentSecs / 60);

        set({ studySecondsToday: currentSecs });

        // Update task progress for study_5_mins
        get().incrementTaskProgress('study_5_mins', currentMins);
      },

      incrementTaskProgress: (taskId: string, amount = 1) => {
        const tasks = get().tasks;
        set({
          tasks: tasks.map((t) => {
            if (t.id !== taskId) return t;
            const newCur = taskId === 'study_5_mins' ? Math.max(t.current, amount) : t.current + amount;
            return { ...t, current: Math.min(t.target, newCur) };
          }),
        });
      },

      setStudyReminder: (enabled: boolean, time: string, goalMinutes: number) => {
        set({
          studyReminderEnabled: enabled,
          studyReminderTime: time,
          dailyGoalMinutes: goalMinutes,
        });
      },

      syncFromProfile: (profile) => {
        if (!profile) return;
        set((state) => ({
          xp: profile.xp ?? state.xp,
          level: profile.level ?? state.level,
          gems: profile.gems ?? state.gems,
          streak: profile.streakDays ?? state.streak,
        }));
      },
    }),
    {
      name: 'violympus-gamification-storage',
    }
  )
);
