import { Trophy, Flame } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function LeaderboardPage() {
  const topPlayers = [
    { rank: 1, name: 'Nguyễn Hải Đăng', xp: 4850, level: 14, matches: 52, winRate: '78%' },
    { rank: 2, name: 'Trần Minh Quang', xp: 4210, level: 12, matches: 46, winRate: '72%' },
    { rank: 3, name: 'Lê Thuỳ Dung', xp: 3980, level: 11, matches: 40, winRate: '68%' },
    { rank: 4, name: 'Hoàng Quốc Bảo', xp: 3450, level: 10, matches: 38, winRate: '63%' },
    { rank: 5, name: 'Phạm Thanh Thảo', xp: 3120, level: 9, matches: 32, winRate: '59%' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-gold uppercase tracking-wider mb-1">
            <Trophy className="h-4 w-4" />
            <span>Đấu trường danh vọng</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Bảng Xếp Hạng Toàn Hệ Thống
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Vinh danh những người học có điểm tích lũy kinh nghiệm (XP) cao nhất từ các bài thi và trận đấu đối kháng.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base">Top cao thủ mùa giải hiện tại</CardTitle>
          <CardDescription className="text-xs">
            Bảng điểm được cập nhật sau khi các trận đấu và bài nộp được xác nhận
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border overflow-x-auto">
            {topPlayers.map((player) => (
              <div
                key={player.rank}
                className={`flex items-center justify-between p-4 transition-colors ${
                  player.rank === 1
                    ? 'bg-amber-50/60'
                    : player.rank === 2
                    ? 'bg-slate-100/60'
                    : player.rank === 3
                    ? 'bg-amber-100/30'
                    : 'hover:bg-surface-muted/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center font-bold text-base tabular-nums">
                    {player.rank === 1 ? (
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                        🥇
                      </span>
                    ) : player.rank === 2 ? (
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-300 text-slate-900 shadow-xs">
                        🥈
                      </span>
                    ) : player.rank === 3 ? (
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-600 text-white shadow-xs">
                        🥉
                      </span>
                    ) : (
                      <span className="text-foreground-muted text-sm font-mono">#{player.rank}</span>
                    )}
                  </div>

                  <div>
                    <div className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span>{player.name}</span>
                      {player.rank <= 3 && (
                        <Badge variant="gold" className="text-[10px] px-1.5 py-0">
                          Top {player.rank}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-foreground-muted flex items-center gap-3 mt-0.5">
                      <span>Cấp {player.level}</span>
                      <span>•</span>
                      <span>{player.matches} trận đấu</span>
                      <span>•</span>
                      <span>Tỉ lệ thắng: {player.winRate}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-base font-extrabold text-foreground tabular-nums flex items-center justify-end gap-1">
                    <Flame className="h-4 w-4 text-accent-gold" />
                    <span>{player.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
