import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Flame, Mountain, Zap, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorState } from '@/components/shared/ErrorState';
import { useAuth } from '@/app/providers';
import {
  fetchRealLeaderboard,
  type LeaderboardTab,
  type RealLeaderboardPlayer,
} from '@/features/leaderboard/services/leaderboardService';
import { Link } from 'react-router';

export function LeaderboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('xp');

  const { data: players = [], isLoading, isError, refetch } = useQuery<RealLeaderboardPlayer[]>({
    queryKey: ['leaderboard', activeTab],
    queryFn: () => fetchRealLeaderboard(activeTab),
    staleTime: 1000 * 30, // 30s
  });

  const currentUserRank = user ? players.find((p) => p.id === user.id) : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-gold uppercase tracking-wider mb-1">
            <Trophy className="h-4 w-4" />
            <span>Đấu trường danh vọng</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Bảng Xếp Hạng Người Học Thật
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Vinh danh người dùng thật có thành tích cao nhất toàn hệ thống Violympus. Dữ liệu được xác thực trực tiếp từ cơ sở dữ liệu.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          <Button asChild variant="gold" size="sm" className="gap-1.5">
            <Link to="/climb">
              <Mountain className="h-4 w-4" />
              <span>Thi Leo Núi</span>
            </Link>
          </Button>
          <Button asChild variant="primary" size="sm" className="gap-1.5">
            <Link to="/practice">
              <Zap className="h-4 w-4" />
              <span>Luyện tập kiếm XP</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <Button
          size="sm"
          variant={activeTab === 'xp' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('xp')}
          className="gap-2 shrink-0 font-bold"
        >
          <Zap className="h-4 w-4" />
          <span>Top Điểm Kinh Nghiệm (XP)</span>
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'streak' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('streak')}
          className="gap-2 shrink-0 font-bold"
        >
          <Flame className="h-4 w-4 text-orange-500" />
          <span>Chuỗi Ngày Học (Streak)</span>
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'climb' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('climb')}
          className="gap-2 shrink-0 font-bold"
        >
          <Mountain className="h-4 w-4 text-amber-500" />
          <span>Kỷ Lục Leo Núi Olympia</span>
        </Button>
      </div>

      {/* Current User Rank Card (if logged in and in ranking) */}
      {user && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm border border-primary/30">
              {currentUserRank ? `#${currentUserRank.rank}` : '—'}
            </div>
            <div>
              <div className="text-xs text-foreground-muted font-medium">Vị trí của bạn</div>
              <div className="text-sm font-bold text-foreground flex items-center gap-2">
                <span>{user.displayName}</span>
                <Badge variant="outline" className="text-[10px]">Bạn</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-xs text-foreground-muted block">Cấp độ</span>
              <span className="font-bold text-foreground">Lv.{user.level}</span>
            </div>
            <div>
              <span className="text-xs text-foreground-muted block">Tổng XP</span>
              <span className="font-mono font-bold text-primary">{user.xp.toLocaleString()} XP</span>
            </div>
            <div>
              <span className="text-xs text-foreground-muted block">Kim Cương</span>
              <span className="font-bold text-accent-gold">💎 {user.gems ?? 50}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Leaderboard Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base flex items-center justify-between">
            <span>
              {activeTab === 'xp' && 'Bảng xếp hạng Tích lũy Kinh nghiệm'}
              {activeTab === 'streak' && 'Bảng xếp hạng Chăm chỉ học tập (Streak)'}
              {activeTab === 'climb' && 'Bảng vàng Cao thủ Đường lên đỉnh Olympia'}
            </span>
            <span className="text-xs font-normal text-foreground-muted">
              {players.length} người dùng thật
            </span>
          </CardTitle>
          <CardDescription className="text-xs">
            Dữ liệu người dùng thật được đồng bộ và cập nhật theo thời gian thực từ cơ sở dữ liệu Supabase
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <LoadingSpinner text="Đang tải dữ liệu bảng xếp hạng..." />
            </div>
          ) : isError ? (
            <div className="p-8">
              <ErrorState
                message="Không thể kết nối đến máy chủ bảng xếp hạng."
                onRetry={() => refetch()}
              />
            </div>
          ) : players.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-muted mx-auto flex items-center justify-center text-foreground-muted">
                <Trophy className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">Chưa có người dùng nào trên bảng xếp hạng</p>
              <p className="text-xs text-foreground-muted max-w-sm mx-auto">
                Hãy là người đầu tiên làm bài kiểm tra hoặc tham gia đấu trường để ghi danh lên đỉnh bảng xếp hạng!
              </p>
              <Button asChild size="sm" variant="primary" className="mt-2">
                <Link to="/practice">Bắt đầu học ngay</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border overflow-x-auto">
              {players.map((player) => {
                const isCurrentUser = user?.id === player.id;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 transition-colors ${
                      isCurrentUser
                        ? 'bg-primary-soft/60 border-l-4 border-l-primary'
                        : player.rank === 1
                        ? 'bg-amber-50/70 dark:bg-amber-950/20'
                        : player.rank === 2
                        ? 'bg-slate-100/60 dark:bg-slate-900/20'
                        : player.rank === 3
                        ? 'bg-amber-100/30 dark:bg-amber-950/10'
                        : 'hover:bg-surface-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Rank Icon / Number */}
                      <div className="flex h-9 w-9 items-center justify-center font-bold text-base tabular-nums shrink-0">
                        {player.rank === 1 ? (
                          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-400 text-slate-900 shadow-xs font-black">
                            🥇
                          </span>
                        ) : player.rank === 2 ? (
                          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-300 text-slate-900 shadow-xs font-black">
                            🥈
                          </span>
                        ) : player.rank === 3 ? (
                          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-600 text-white shadow-xs font-black">
                            🥉
                          </span>
                        ) : (
                          <span className="text-foreground-muted text-sm font-mono font-bold">
                            #{player.rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="h-9 w-9 rounded-full bg-surface-muted border border-border overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-primary">
                        {player.avatarUrl ? (
                          <img
                            src={player.avatarUrl}
                            alt={player.displayName}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <User size={16} />
                        )}
                      </div>

                      {/* Player info */}
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-foreground flex items-center gap-2">
                          <span className="truncate">{player.displayName}</span>
                          {isCurrentUser && (
                            <Badge variant="gold" className="text-[10px] px-1.5 py-0 shrink-0">
                              Bạn
                            </Badge>
                          )}
                          {player.role === 'admin' && (
                            <Badge variant="secondary" className="text-[9px] px-1 py-0 shrink-0">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-foreground-muted flex items-center gap-2 mt-0.5">
                          <span>@{player.username}</span>
                          <span>•</span>
                          <span>Cấp {player.level}</span>
                          {player.streakDays > 1 && (
                            <>
                              <span>•</span>
                              <span className="text-orange-500 font-semibold flex items-center gap-0.5">
                                <Flame size={12} /> {player.streakDays} ngày liên tiếp
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metric Display based on active tab */}
                    <div className="text-right shrink-0">
                      {activeTab === 'xp' && (
                        <div className="font-mono text-sm sm:text-base font-extrabold text-foreground tabular-nums flex items-center justify-end gap-1">
                          <Zap className="h-4 w-4 text-primary fill-primary" />
                          <span>{player.xp.toLocaleString()} XP</span>
                        </div>
                      )}

                      {activeTab === 'streak' && (
                        <div className="font-mono text-sm sm:text-base font-extrabold text-orange-600 tabular-nums flex items-center justify-end gap-1">
                          <Flame className="h-4 w-4 fill-orange-500" />
                          <span>{player.streakDays} ngày</span>
                        </div>
                      )}

                      {activeTab === 'climb' && (
                        <div className="font-mono text-sm sm:text-base font-extrabold text-amber-600 tabular-nums flex items-center justify-end gap-1">
                          <Mountain className="h-4 w-4" />
                          <span>{player.climbHighScore} điểm</span>
                        </div>
                      )}

                      <div className="text-[11px] text-foreground-muted mt-0.5">
                        💎 {player.gems}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
