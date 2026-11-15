import * as React from 'react';
import { useParams, Link } from 'react-router';
import {
  Timer,
  Copy,
  Check,
  Play,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/providers';
import { useGamificationStore } from '@/lib/gamification/gamificationStore';
import { useStudyTracker } from '@/hooks/useStudyTracker';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
  isReady: boolean;
  isUser: boolean;
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
];

export function ArenaBattlePage() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const { addGems, awardXP, incrementTaskProgress } = useGamificationStore();

  useStudyTracker(true);

  const [matchState, setMatchState] = React.useState<'lobby' | 'countdown' | 'playing' | 'ended'>('lobby');
  const [countdown, setCountdown] = React.useState(3);
  const [qIndex, setQIndex] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(15);
  const [copied, setCopied] = React.useState(false);
  const [hasAnswered, setHasAnswered] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ isCorrect: boolean; text: string } | null>(null);

  const [players, setPlayers] = React.useState<Player[]>([
    { id: 'user', name: user?.displayName || 'Bạn', score: 0, avatar: user?.avatarUrl || '🧑‍🎓', isReady: true, isUser: true },
    { id: 'p2', name: 'Hoàng Long', score: 0, avatar: '👨‍🎓', isReady: true, isUser: false },
    { id: 'p3', name: 'Kim Ngân', score: 0, avatar: '👩‍🎓', isReady: true, isUser: false },
  ]);

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
    const isWinner = players.every((p) => p.isUser || (userP && userP.score >= p.score));

    if (isWinner) {
      await addGems(30, 'Thắng trận Đấu Trường');
      await awardXP(80, 'Vô địch Đấu Trường đối kháng');
      toast.success('CHIẾN THẮNG TUYỆT ĐỐI! Bạn nhận được +30 💎 và +80 XP!');
    } else {
      await addGems(10, 'Tham gia trận Đấu Trường');
      await awardXP(40, 'Tham gia Đấu Trường');
      toast.info('Trận đấu kết thúc! Bạn nhận được +10 💎 và +40 XP.');
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

    if (isCorrect) {
      const points = 10 + Math.max(0, timeLeft);
      setPlayers((prev) =>
        prev.map((p) => (p.isUser ? { ...p, score: p.score + points } : p))
      );
      setFeedback({ isCorrect: true, text: `Chính xác! Tốc độ ${15 - timeLeft}s: +${points} điểm!` });
    } else {
      setFeedback({ isCorrect: false, text: 'Chưa chính xác!' });
    }

    // Bot scores
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.isUser) return p;
        const add = Math.random() > 0.4 ? Math.floor(Math.random() * 15) + 5 : 0;
        return { ...p, score: p.score + add };
      })
    );

    setTimeout(() => {
      setFeedback(null);
      handleNextQuestion();
    }, 1500);
  };

  const handleStartMatch = () => {
    setMatchState('countdown');
    setCountdown(3);
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
              {code}
            </div>
          </div>
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

      {/* STATE 1: LOBBY */}
      {matchState === 'lobby' && (
        <Card className="p-6 space-y-6 text-center">
          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-block p-3 rounded-2xl bg-primary-soft text-primary text-3xl">
              ⚔️
            </div>
            <CardTitle className="text-2xl font-black">Phòng Chờ Đấu Trường</CardTitle>
            <CardDescription className="text-xs">
              Mã PIN: <span className="font-mono font-bold text-foreground">{code}</span>. Khi các đấu thủ đã sẵn sàng, hãy bấm Bắt đầu để tiến vào trận chiến!
            </CardDescription>
          </div>

          {/* Player Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {players.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-border bg-surface flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-lg">
                  {p.avatar}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">
                    {p.name} {p.isUser && '(Bạn)'}
                  </div>
                  <Badge variant="secondary" className="text-[10px] text-success font-semibold">
                    Sẵn sàng ✓
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 max-w-md mx-auto">
            <Button
              type="button"
              onClick={handleStartMatch}
              variant="primary"
              size="lg"
              className="w-full gap-2 font-bold shadow-md"
            >
              <Play className="h-5 w-5" />
              <span>Bắt đầu trận đấu ngay</span>
            </Button>
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
              <div className="text-xs font-bold text-foreground-muted">Bảng điểm trực tiếp:</div>
              <div className="flex flex-wrap items-center gap-4">
                {players.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-xs">
                    <span>{p.avatar}</span>
                    <span className="font-semibold">{p.name}:</span>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
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
                <div className="text-xs font-bold">{p.name}</div>
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
              onClick={() => {
                setMatchState('lobby');
                setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
              }}
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
