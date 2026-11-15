import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGamificationStore } from './gamificationStore';

// Mock Supabase calls to avoid network requests during store tests
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
    from: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

describe('gamificationStore', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useGamificationStore.setState({
      gems: 50,
      xp: 0,
      level: 1,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      dailyCheckInClaimed: false,
      checkInDay: 1,
      studySecondsToday: 0,
      studyReminderEnabled: true,
      studyReminderTime: '20:00',
      dailyGoalMinutes: 15,
    });
  });

  it('starts with default 50 gems and level 1', () => {
    const state = useGamificationStore.getState();
    expect(state.gems).toBe(50);
    expect(state.level).toBe(1);
    expect(state.xp).toBe(0);
    expect(state.streak).toBe(1);
  });

  it('addGems increases gem balance', async () => {
    await useGamificationStore.getState().addGems(30, 'Test reward');
    expect(useGamificationStore.getState().gems).toBe(80);
  });

  it('spendGems deducts gems when sufficient funds exist', async () => {
    const success = await useGamificationStore.getState().spendGems(20, 'Room creation');
    expect(success).toBe(true);
    expect(useGamificationStore.getState().gems).toBe(30);
  });

  it('spendGems returns false and does not deduct if balance is too low', async () => {
    const success = await useGamificationStore.getState().spendGems(100, 'Expensive item');
    expect(success).toBe(false);
    expect(useGamificationStore.getState().gems).toBe(50);
  });

  it('awardXP updates XP and level', async () => {
    await useGamificationStore.getState().awardXP(200, 'Quiz completed');
    const state = useGamificationStore.getState();
    expect(state.xp).toBe(200);
    expect(state.level).toBe(2);
  });

  it('claimDailyCheckIn awards gems and marks today as claimed', async () => {
    const earned = await useGamificationStore.getState().claimDailyCheckIn();
    expect(earned).toBeGreaterThan(0);

    const state = useGamificationStore.getState();
    expect(state.dailyCheckInClaimed).toBe(true);
    expect(state.gems).toBe(50 + earned);

    // Double claim should return 0
    const secondClaim = await useGamificationStore.getState().claimDailyCheckIn();
    expect(secondClaim).toBe(0);
  });

  it('records study time correctly and updates minutes', () => {
    useGamificationStore.getState().addStudySeconds(120); // 2 minutes
    expect(useGamificationStore.getState().studySecondsToday).toBe(120);
  });

  it('increments task progress and enables claim', async () => {
    useGamificationStore.getState().incrementTaskProgress('study_5_mins', 5);
    const task = useGamificationStore.getState().tasks.find((t) => t.id === 'study_5_mins');
    expect(task?.current).toBe(5);

    const claimSuccess = await useGamificationStore.getState().claimTask('study_5_mins');
    expect(claimSuccess).toBe(true);

    const updatedTask = useGamificationStore.getState().tasks.find((t) => t.id === 'study_5_mins');
    expect(updatedTask?.isClaimed).toBe(true);
  });
});
