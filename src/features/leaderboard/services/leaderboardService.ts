import { supabase } from '@/lib/supabase/client';
import { AppError } from '@/lib/errors';

export interface RealLeaderboardPlayer {
  id: string;
  rank: number;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  xp: number;
  level: number;
  gems: number;
  streakDays: number;
  climbHighScore: number;
  createdAt: string;
}

export type LeaderboardTab = 'xp' | 'streak' | 'climb';

export async function fetchRealLeaderboard(tab: LeaderboardTab): Promise<RealLeaderboardPlayer[]> {
  try {
    let query = supabase
      .from('profiles')
      .select('id, display_name, username, avatar_url, role, xp, level, gems, streak_days, climb_high_score, created_at')
      .eq('is_banned', false);

    if (tab === 'streak') {
      query = query.order('streak_days', { ascending: false }).order('xp', { ascending: false });
    } else if (tab === 'climb') {
      query = query.order('climb_high_score', { ascending: false }).order('xp', { ascending: false });
    } else {
      query = query.order('xp', { ascending: false }).order('level', { ascending: false });
    }

    const { data, error } = await query.limit(50);

    if (error) {
      throw AppError.fromSupabaseError(error);
    }

    return (data || []).map((row, index) => ({
      id: row.id,
      rank: index + 1,
      displayName: row.display_name || row.username || 'Người học',
      username: row.username,
      avatarUrl: row.avatar_url,
      role: row.role || 'learner',
      xp: row.xp ?? 0,
      level: row.level ?? 1,
      gems: row.gems ?? 50,
      streakDays: row.streak_days ?? 1,
      climbHighScore: row.climb_high_score ?? 0,
      createdAt: row.created_at,
    }));
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError({
      code: 'NETWORK',
      messageKey: 'errors.leaderboard_fetch_failed',
      message: 'Không thể tải bảng xếp hạng người dùng thật',
      cause: err,
    });
  }
}
