import * as React from 'react';
import { useParams, Link } from 'react-router';
import type { RealtimeChannel } from '@supabase/supabase-js';
import {
  Timer,
  Copy,
  Check,
  Play,
  RotateCcw,
  ArrowLeft,
  Users,
  Radio,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/providers';
import { useGamificationStore } from '@/lib/gamification/gamificationStore';
import { useStudyTracker } from '@/hooks/useStudyTracker';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
  isReady: boolean;
  isUser: boolean;
  joinedAt?: number;
}

const ARENA_QUESTIONS = [
  {
    q: 'Đại lượng nào đặc trưng cho mức độ biến thiên của vận tốc theo thời gian?',
    options: ['Gia tốc', 'Động lượng', 'Công suất', 'Lực hấp dẫn'],
    correct: 0,
  },
  {
    q: 'Quốc gia nào có diện tích lãnh thổ lớn nhất thế giới?',
    options: ['Canada', 'Liên bang Nga', 'Hoa Kỳ', 'Trung Quốc'],
    correct: 1,
  },
  {
    q: 'Hợp chất nào chiếm tỉ lệ lớn nhất trong cấu tạo cơ thể con người?',
    options: ['Protein', 'Chất béo (Lipid)', 'Nước (H2O)', 'Canxi'],
    correct: 2,
  },
  {
    q: 'Ai là tác giả của bản giao hưởng "Định mệnh" (Số 5)?',
    options: ['Mozart', 'Beethoven', 'Chopin', 'Bach'],
    correct: 1,
  },
  {
    q: 'Số nguyên tố liền sau số 23 là số nào?',
    options: ['25', '27', '29', '31'],
    correct: 2,
  },
  {
    q: 'Chất khí nào có công thức hóa học là N2O và thường được gọi là "khí cười"?',
    options: ['Đinitơ monoxit', 'Khí Mêtan', 'Khí Ozon', 'Cacbon monoxit'],
    correct: 0,
  },
  {
    q: 'Bài thơ "Nam quốc sơn hà" gắn liền với vị anh hùng dân tộc nào trong lịch sử Đại Việt?',
    options: ['Trần Hưng Đạo', 'Lý Thường Kiệt', 'Quang Trung', 'Lê Lợi'],
    correct: 1,
  },
  {
    q: 'Cấu trúc dữ liệu nào hoạt động theo nguyên lý LIFO (Last In First Out)?',
    options: ['Queue (Hàng đợi)', 'Stack (Ngăn xếp)', 'Linked List', 'Binary Tree'],
    correct: 1,
  },
  {
    q: 'Hình tam giác đều có mỗi góc trong bằng bao nhiêu độ?',
    options: ['45°', '90°', '60°', '120°'],
    correct: 2,
  },
  {
    q: 'Thủ đô chính thức của nước Úc (Australia) là thành phố nào?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    correct: 2,
  },
];

function getGuestArenaId(): string {
  if (typeof window === 'undefined') return 'guest_default';
  let guestId = sessionStorage.getItem('violympus_guest_arena_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('violympus_guest_arena_id', guestId);
  }
  return guestId;
}

export function ArenaBattlePage() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const { addGems, awardXP, incrementTaskProgress } = useGamificationStore();

  useStudyTracker(true);

  const roomCode = (code || 'GLOBAL').toUpperCase();

  // Stable client identifier for realtime presence
  const currentUserId = user?.id || getGuestArenaId();

  const currentUserName = user?.displayName || `Đấu thủ ${currentUserId.slice(-4)}`;
  const currentUserAvatar = user?.avatarUrl || '🧑‍🎓';

  const [matchState, setMatchState] = React.useState<'lobby' | 'countdown' | 'playing' | 'ended'>('lobby');
  const [countdown, setCountdown] = React.useState(3);
  const [qIndex, setQIndex] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(15);
  const [copied, setCopied] = React.useState(false);
  const [hasAnswered, setHasAnswered] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ isCorrect: boolean; text: string } | null>(null);

  // Real connected players only (no fake bots)
  const [players, setPlayers] = React.useState<Player[]>([
    {
      id: currentUserId,
      name: currentUserName,
      score: 0,
      avatar: currentUserAvatar,
      isReady: true,
      isUser: true,
      joinedAt: 0,
    },
  ]);

  const channelRef = React.useRef<RealtimeChannel | null>(null);
  const myScoreRef = React.useRef(0);

  // Sync Supabase Realtime channel for true multiplayer
  React.useEffect(() => {
    const channel = supabase.channel(`arena_room_${roomCode}`, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<{
          id: string;
          name: string;
          avatar: string;
          score: number;
          isReady: boolean;
          joinedAt?: number;
        }>();

        const activePlayers: Player[] = [];
        const seen = new Set<string>();

        Object.values(state).forEach((presences) => {
          presences.forEach((p) => {
            if (p.id && !seen.has(p.id)) {
              seen.add(p.id);
              activePlayers.push({
                id: p.id,
                name: p.name || 'Người chơi',
                score: p.score ?? 0,
                avatar: p.avatar || '🧑‍🎓',
                isReady: p.isReady ?? true,
                isUser: p.id === currentUserId,
                joinedAt: p.joinedAt,
              });
            }
          });
        });

        // Ensure current user is always present in local state
        if (!seen.has(currentUserId)) {
          activePlayers.unshift({
            id: currentUserId,
            name: currentUserName,
            score: myScoreRef.current,
            avatar: currentUserAvatar,
            isReady: true,
            isUser: true,
            joinedAt: Date.now(),
          });
        }

        // Sort by joinedAt or ID for consistent lobby order
        activePlayers.sort((a, b) => (a.joinedAt ?? 0) - (b.joinedAt ?? 0));
        setPlayers(activePlayers);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        const joined = newPresences[0] as { name?: string };
        if (joined?.name && joined.name !== currentUserName) {
          toast.info(`${joined.name} vừa tham gia phòng đấu!`);
        }
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const left = leftPresences[0] as { name?: string };
        if (left?.name && left.name !== currentUserName) {
          toast.info(`${left.name} đã rời phòng đấu.`);
        }
      })
      .on('broadcast', { event: 'start_match' }, () => {
        setMatchState('countdown');
        setCountdown(3);
      })
      .on('broadcast', { event: 'update_score' }, ({ payload }) => {
        if (payload && payload.userId && typeof payload.score === 'number') {
          setPlayers((prev) =>
            prev.map((p) => (p.id === payload.userId ? { ...p, score: payload.score } : p))
          );
        }
      })
      .on('broadcast', { event: 'restart_match' }, () => {
        myScoreRef.current = 0;
        setMatchState('lobby');
        setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: currentUserId,
            name: currentUserName,
            avatar: currentUserAvatar,
            score: 0,
            isReady: true,
            joinedAt: Date.now(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      void channel.untrack();
      void supabase.removeChannel(channel);
    };
  }, [roomCode, currentUserId, currentUserName, currentUserAvatar]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Đã sao chép liên kết phòng thi đấu!');
    setTimeout(() => setCopied(false), 2000);
  };

  const finishMatch = React.useCallback(async () => {
    setMatchState('ended');
    incrementTaskProgress('play_climb_or_arena', 1);

    const userP = players.find((p) => p.isUser);
    const userScore = userP ? userP.score : 0;
    const isMultiplayer = players.length > 1;
    const isWinner = isMultiplayer
      ? players.every((p) => p.isUser || userScore >= p.score)
      : true;

    if (isMultiplayer) {
      if (isWinner) {
        await addGems(30, 'Thắng trận Đấu Trường đối kháng');
        await awardXP(80, 'Vô địch Đấu Trường đối kháng');
        toast.success('CHIẾN THẮNG TUYỆT ĐỐI! Bạn nhận được +30 💎 và +80 XP!');
      } else {
        await addGems(10, 'Tham gia trận Đấu Trường đối kháng');
        await awardXP(40, 'Tham gia Đấu Trường');
        toast.info('Trận đấu kết thúc! Bạn nhận được +10 💎 và +40 XP.');
      }
    } else {
      await addGems(5, 'Hoàn thành đấu trường đơn');
      await awardXP(30, 'Thử thách đấu trường đơn');
      toast.info('Hoàn thành thử thách phòng đấu! Bạn nhận được +5 💎 và +30 XP.');
    }
  }, [players, addGems, awardXP, incrementTaskProgress]);

  const handleNextQuestion = React.useCallback(() => {
    setHasAnswered(false);
    setTimeLeft(15);

    setQIndex((prev) => {
      if (prev + 1 < ARENA_QUESTIONS.length) {
        return prev + 1;
      } else {
        finishMatch();
        return prev;
      }
    });
  }, [finishMatch]);

  const handleAnswer = (optionIdx: number) => {
    if (hasAnswered) return;
    setHasAnswered(true);

    const cur = ARENA_QUESTIONS[qIndex];
    const isCorrect = optionIdx === cur.correct;
    let newScore = myScoreRef.current;

    if (isCorrect) {
      const points = 10 + Math.max(0, timeLeft);
      newScore += points;
      myScoreRef.current = newScore;
      setPlayers((prev) =>
        prev.map((p) => (p.isUser ? { ...p, score: newScore } : p))
      );
      setFeedback({ isCorrect: true, text: `Chính xác! Tốc độ ${15 - timeLeft}s: +${points} điểm!` });
    } else {
      setFeedback({ isCorrect: false, text: 'Chưa chính xác!' });
    }

    // Broadcast real updated score to other connected human players
    if (channelRef.current) {
      void channelRef.current.send({
        type: 'broadcast',
        event: 'update_score',
        payload: { userId: currentUserId, score: newScore },
      });
    }

    setTimeout(() => {
      setFeedback(null);
      handleNextQuestion();
    }, 1500);
  };

  const handleStartMatch = () => {
    setMatchState('countdown');
    setCountdown(3);

    // Broadcast start match to all real players in the room
    if (channelRef.current) {
      void channelRef.current.send({
        type: 'broadcast',
        event: 'start_match',
        payload: { startedAt: Date.now() },
      });
    }
  };

  const handleRestartMatch = () => {
    myScoreRef.current = 0;
    setMatchState('lobby');
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));

    if (channelRef.current) {
      void channelRef.current.send({
        type: 'broadcast',
        event: 'restart_match',
        payload: {},
      });
    }
  };

  // Countdown 3, 2, 1
  React.useEffect(() => {
    if (matchState !== 'countdown') return;

    const t = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setMatchState('playing');
          setQIndex(0);
          setTimeLeft(15);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [matchState]);

  // Question timer
  React.useEffect(() => {
    if (matchState !== 'playing') return;

    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [matchState, handleNextQuestion]);

  const ranked = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/arena" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Rời phòng</span>
            </Link>
          </Button>
          <div>
            <div className="text-xs text-foreground-muted font-medium">Mã phòng đấu</div>
            <div className="text-lg font-black font-mono tracking-widest text-primary uppercase">
              {roomCode}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
            <span>{players.length} người dùng thật</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-1.5 font-medium"
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Đã chép link' : 'Mời bạn bè'}</span>
          </Button>
        </div>
      </div>

      {/* STATE 1: LOBBY */}
      {matchState === 'lobby' && (
        <Card className="p-6 space-y-6 text-center">
          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-block p-3 rounded-2xl bg-primary-soft text-primary text-3xl">
              ⚔️
            </div>
            <CardTitle className="text-2xl font-black">Phòng Chờ Đấu Trường</CardTitle>
            <CardDescription className="text-xs">
              Mã PIN: <span className="font-mono font-bold text-foreground">{roomCode}</span>. Kết nối thời gian thực qua Supabase Realtime.
            </CardDescription>
          </div>

          {/* Real Players in Room */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-between text-xs font-bold text-foreground-muted px-1">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                <span>Danh sách đấu thủ thật ({players.length}):</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                Realtime Connected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    p.isUser
                      ? 'border-primary bg-primary-soft/30 shadow-xs'
                      : 'border-border bg-surface'
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-lg shrink-0">
                    {p.avatar}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-xs font-bold text-foreground truncate flex items-center gap-1">
                      <span>{p.name}</span>
                      {p.isUser && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0">Bạn</Badge>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      Sẵn sàng ✓
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Solo Room Guidance */}
            {players.length === 1 && (
              <div className="p-4 rounded-xl border border-dashed border-primary/40 bg-surface-muted/40 text-left space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <Share2 className="h-4 w-4" />
                  <span>Mẹo thi đấu đối kháng trực tiếp:</span>
                </div>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Phòng đang có <span className="font-bold text-foreground">1 người chơi (Bạn)</span>. Hãy bấm <strong>"Mời bạn bè"</strong> ở góc phải hoặc mở một <strong>cửa sổ ẩn danh mới</strong> và truy cập vào đường dẫn này để trải nghiệm đối kháng trực tiếp giữa 2 người dùng thật!
                </p>
                <div className="pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCopyLink}
                    className="gap-1.5 text-xs font-semibold"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Sao chép mã PIN ({roomCode}) & liên kết</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 max-w-md mx-auto space-y-2">
            <Button
              type="button"
              onClick={handleStartMatch}
              variant="primary"
              size="lg"
              className="w-full gap-2 font-bold shadow-md"
            >
              <Play className="h-5 w-5" />
              <span>{players.length > 1 ? 'Bắt đầu trận đấu ngay' : 'Bắt đầu luyện tập đơn trong phòng'}</span>
            </Button>
            {players.length > 1 && (
              <p className="text-[11px] text-foreground-muted text-center">
                Bấm bắt đầu sẽ kích hoạt đồng hồ đếm ngược trên tất cả thiết bị của các đấu thủ!
              </p>
            )}
          </div>
        </Card>
      )}

      {/* STATE 2: COUNTDOWN */}
      {matchState === 'countdown' && (
        <Card className="p-16 text-center space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            Trận đấu chuẩn bị bắt đầu
          </div>
          <div className="font-heading font-black text-7xl text-primary animate-ping">
            {countdown}
          </div>
          <p className="text-xs text-foreground-muted">Tập trung cao độ và trả lời thật nhanh!</p>
        </Card>
      )}

      {/* STATE 3: PLAYING */}
      {matchState === 'playing' && (
        <Card className="space-y-4">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <Badge variant="default">Câu {qIndex + 1} / {ARENA_QUESTIONS.length}</Badge>
              <CardTitle className="text-xl mt-1">Đấu Trường Trực Tiếp</CardTitle>
            </div>

            <div className="flex items-center gap-2 bg-surface-muted px-4 py-2 rounded-xl border border-border">
              <Timer className="h-5 w-5 text-danger animate-pulse" />
              <span className="font-mono text-xl font-black text-danger">{timeLeft}s</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {feedback && (
              <div
                className={`p-3 rounded-xl border text-center font-bold text-sm ${
                  feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <div className="p-5 rounded-2xl border border-border bg-surface-muted/30 text-center font-heading text-lg sm:text-xl font-bold">
              {ARENA_QUESTIONS[qIndex]?.q}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ARENA_QUESTIONS[qIndex]?.options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleAnswer(idx)}
                  className="p-4 rounded-xl border border-border bg-surface hover:bg-primary-soft hover:border-primary text-left font-medium text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="font-bold text-primary mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {/* Live Leaderboard in Room */}
            <div className="p-4 rounded-xl border border-border bg-surface-muted/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-foreground-muted">
                <span>Bảng điểm trực tiếp ({players.length} người dùng thật):</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">● Trực tiếp</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border ${
                      p.isUser ? 'border-primary/40 bg-primary/10' : 'border-border bg-surface'
                    }`}
                  >
                    <span>{p.avatar}</span>
                    <span className="font-semibold">{p.name} {p.isUser && '(Bạn)'}:</span>
                    <span className="font-mono font-bold text-primary">{p.score} đ</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATE 4: ENDED */}
      {matchState === 'ended' && (
        <Card className="text-center p-8 space-y-6 border-amber-300 bg-gradient-to-b from-amber-50/40 via-surface to-surface">
          <div className="inline-block p-4 rounded-full bg-accent-gold text-slate-900 text-5xl shadow-md">
            🏆
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Kết Quả Trận Đấu
            </div>
            <h2 className="text-3xl font-heading font-black text-foreground mt-1">
              Bảng Tổng Sắp Đấu Trường
            </h2>
            <p className="text-xs text-foreground-muted mt-1">
              Điểm số được tính toán và xác thực cho {players.length} đấu thủ thực tế
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {ranked.map((p, idx) => (
              <div
                key={p.id}
                className={`p-4 rounded-xl border text-center space-y-1.5 ${
                  idx === 0
                    ? 'border-amber-400 bg-amber-100/70 shadow-sm ring-2 ring-amber-400'
                    : 'border-border bg-surface'
                }`}
              >
                <div className="text-2xl">{p.avatar}</div>
                <div className="text-xs font-bold truncate">
                  {p.name} {p.isUser && '(Bạn)'}
                </div>
                <div className="text-xl font-black font-heading text-primary">{p.score} đ</div>
                <Badge variant={idx === 0 ? 'gold' : 'secondary'} className="text-[10px]">
                  Hạng {idx + 1}
                </Badge>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Button
              type="button"
              onClick={handleRestartMatch}
              size="lg"
              className="gap-2 font-bold"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Chơi ván tiếp theo</span>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link to="/arena">Rời phòng</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
