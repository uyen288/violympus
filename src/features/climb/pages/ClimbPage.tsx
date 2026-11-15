import * as React from 'react';
import { Link } from 'react-router';
import {
  Mountain,
  Flame,
  Zap,
  Timer,
  Play,
  RotateCcw,
  Star,
  Users,
  Trophy,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/app/providers';
import { useGamificationStore } from '@/lib/gamification/gamificationStore';
import { useStudyTracker } from '@/hooks/useStudyTracker';
import {
  OLYMPIA_KHOI_DONG,
  OLYMPIA_OBSTACLE,
  OLYMPIA_TANG_TOC,
  OLYMPIA_VE_DICH,
} from '../data/olympiaBank';
import { toast } from 'sonner';

type GameStage = 'lobby' | 'khoi_dong' | 'chuong_ngai_vat' | 'tang_toc' | 've_dich' | 'podium';
type GameMode = 'solo' | 'multiplayer';

interface Contestant {
  id: string;
  name: string;
  score: number;
  isUser: boolean;
  avatar: string;
}

export function ClimbPage() {
  const { user } = useAuth();
  const { spendGems, addGems, awardXP, incrementTaskProgress } = useGamificationStore();

  // Active study tracking while on climb page
  useStudyTracker(true);

  const [mode, setMode] = React.useState<GameMode>('multiplayer');
  const [stage, setStage] = React.useState<GameStage>('lobby');

  // Contestants scores
  const [contestants, setContestants] = React.useState<Contestant[]>([
    { id: 'user', name: user?.displayName || 'Bạn', score: 0, isUser: true, avatar: user?.avatarUrl || '🧑‍🎓' },
    { id: 'bot-1', name: 'Lê Minh Trí', score: 0, isUser: false, avatar: '👨‍🎓' },
    { id: 'bot-2', name: 'Nguyễn Hồng Hạnh', score: 0, isUser: false, avatar: '👩‍🎓' },
    { id: 'bot-3', name: 'Trần Tuấn Kiệt', score: 0, isUser: false, avatar: '🏆' },
  ]);

  // Round 1: Khởi động state
  const [kdIndex, setKdIndex] = React.useState(0);
  const [kdTimeLeft, setKdTimeLeft] = React.useState(60);
  const [kdAnswered, setKdAnswered] = React.useState(false);

  // Round 2: Vượt chướng ngại vật state
  const [obstacleRowIndex, setObstacleRowIndex] = React.useState<number | null>(null);
  const [openedRows, setOpenedRows] = React.useState<number[]>([]);
  const [isBuzzerOpen, setIsBuzzerOpen] = React.useState(false);
  const [obstacleGuess, setObstacleGuess] = React.useState('');

  // Round 3: Tăng tốc state
  const [ttIndex, setTtIndex] = React.useState(0);
  const [ttTimer, setTtTimer] = React.useState(30);
  const [ttAnswered, setTtAnswered] = React.useState(false);

  // Round 4: Về đích state
  const [vdIndex, setVdIndex] = React.useState(0);
  const [hasStarOfHope, setHasStarOfHope] = React.useState(false);
  const [starUsedOnCurrent, setStarUsedOnCurrent] = React.useState(false);
  const [vdAnswered, setVdAnswered] = React.useState(false);

  // Sound / Feedback state
  const [feedback, setFeedback] = React.useState<{ isCorrect: boolean; text: string } | null>(null);

  // Update user score
  const updateScore = React.useCallback((points: number) => {
    setContestants((prev) =>
      prev.map((c) => (c.isUser ? { ...c, score: Math.max(0, c.score + points) } : c))
    );
  }, []);

  // Simulate bots answering in multiplayer mode
  const simulateBotScores = React.useCallback((minAdd: number, maxAdd: number) => {
    setContestants((prev) =>
      prev.map((c) => {
        if (c.isUser) return c;
        const add = Math.random() > 0.3 ? Math.floor(Math.random() * (maxAdd - minAdd + 1)) + minAdd : 0;
        return { ...c, score: c.score + add };
      })
    );
  }, []);

  // START GAME
  const handleStartGame = async (selectedMode: GameMode) => {
    if (selectedMode === 'multiplayer') {
      const ok = await spendGems(10, 'Vé tham gia Leo Núi Olympia');
      if (!ok) {
        toast.error('Bạn cần có ít nhất 10 Kim cương để tham gia trận đấu 4 người!');
        return;
      }
    }

    setMode(selectedMode);
    setContestants([
      { id: 'user', name: user?.displayName || 'Bạn', score: 0, isUser: true, avatar: user?.avatarUrl || '🧑‍🎓' },
      { id: 'bot-1', name: 'Lê Minh Trí', score: 0, isUser: false, avatar: '👨‍🎓' },
      { id: 'bot-2', name: 'Nguyễn Hồng Hạnh', score: 0, isUser: false, avatar: '👩‍🎓' },
      { id: 'bot-3', name: 'Trần Tuấn Kiệt', score: 0, isUser: false, avatar: '🏆' },
    ]);

    setKdIndex(0);
    setKdTimeLeft(60);
    setKdAnswered(false);
    setFeedback(null);
    setStage('khoi_dong');
  };

  // Timer for Khởi động (Round 1)
  React.useEffect(() => {
    if (stage !== 'khoi_dong') return;

    const timer = setInterval(() => {
      setKdTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.info('Hết 60 giây phần thi Khởi Động!');
          simulateBotScores(20, 60);
          setStage('chuong_ngai_vat');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, simulateBotScores]);

  // Round 1: Submit Answer
  const handleAnswerKD = (optionIndex: number) => {
    if (kdAnswered) return;
    setKdAnswered(true);

    const q = OLYMPIA_KHOI_DONG[kdIndex];
    const isCorrect = optionIndex === q.correctIndex;

    if (isCorrect) {
      updateScore(10);
      setFeedback({ isCorrect: true, text: '+10 điểm! Chính xác!' });
    } else {
      setFeedback({ isCorrect: false, text: 'Chưa chính xác!' });
    }

    setTimeout(() => {
      setFeedback(null);
      setKdAnswered(false);
      if (kdIndex + 1 < OLYMPIA_KHOI_DONG.length) {
        setKdIndex((prev) => prev + 1);
      } else {
        simulateBotScores(20, 50);
        setStage('chuong_ngai_vat');
      }
    }, 900);
  };

  // Round 2: Vượt chướng ngại vật - Submit Row
  const handleAnswerObstacleRow = (optionIndex: number) => {
    if (obstacleRowIndex === null) return;
    const row = OLYMPIA_OBSTACLE.rows[obstacleRowIndex];
    const isCorrect = optionIndex === row.correctIndex;

    if (isCorrect) {
      updateScore(10);
      setOpenedRows((prev) => [...prev, row.number]);
      setFeedback({ isCorrect: true, text: `+10 điểm! Mở gợi ý hàng số ${row.number}: "${row.answer}"` });
    } else {
      setFeedback({ isCorrect: false, text: 'Chưa chính xác ở hàng ngang này!' });
    }

    setTimeout(() => {
      setFeedback(null);
      setObstacleRowIndex(null);
    }, 1200);
  };

  // Round 2: Guess Keyword
  const handleGuessObstacle = () => {
    const cleanGuess = obstacleGuess.trim().toUpperCase();
    const target = OLYMPIA_OBSTACLE.keyword.toUpperCase();

    if (cleanGuess === target || cleanGuess === 'VIET NAM') {
      const bonus = Math.max(20, 60 - openedRows.length * 10);
      updateScore(bonus);
      setIsBuzzerOpen(false);
      toast.success(`XUẤT SẮC! Bạn đã giải mã thành công từ khóa "${OLYMPIA_OBSTACLE.keyword}" (+${bonus} điểm)!`);
      simulateBotScores(10, 40);
      setTimeout(() => setStage('tang_toc'), 1500);
    } else {
      toast.error('Rất tiếc! Từ khóa chướng ngại vật chưa chính xác. Mất quyền trả lời vòng này.');
      setIsBuzzerOpen(false);
      setTimeout(() => setStage('tang_toc'), 1500);
    }
  };

  const nextTangTocQuestion = React.useCallback(() => {
    setTtAnswered(false);
    setTtTimer(30);
    setTtIndex((prev) => {
      if (prev + 1 < OLYMPIA_TANG_TOC.length) {
        simulateBotScores(10, 30);
        return prev + 1;
      } else {
        simulateBotScores(20, 50);
        setStage('ve_dich');
        return prev;
      }
    });
  }, [simulateBotScores]);

  // Timer for Tăng tốc (Round 3)
  React.useEffect(() => {
    if (stage !== 'tang_toc') return;

    const timer = setInterval(() => {
      setTtTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTtAnswered(true);
          toast.info('Hết 30 giây câu hỏi tăng tốc!');
          setTimeout(() => nextTangTocQuestion(), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, nextTangTocQuestion]);

  const handleAnswerTangToc = (optionIndex: number) => {
    if (ttAnswered) return;
    setTtAnswered(true);

    const q = OLYMPIA_TANG_TOC[ttIndex];
    const isCorrect = optionIndex === q.correctIndex;

    if (isCorrect) {
      // Faster answer = higher points: 40, 30, 20, 10
      let points = 10;
      if (ttTimer >= 22) points = 40;
      else if (ttTimer >= 15) points = 30;
      else if (ttTimer >= 8) points = 20;

      updateScore(points);
      setFeedback({ isCorrect: true, text: `Chính xác! Bạn trả lời trong ${30 - ttTimer}s: +${points} điểm!` });
    } else {
      setFeedback({ isCorrect: false, text: 'Chưa chính xác câu hỏi này!' });
    }

    setTimeout(() => {
      setFeedback(null);
      nextTangTocQuestion();
    }, 1500);
  };

  // Round 4: Về đích
  const handleAnswerVeDich = (optionIndex: number) => {
    if (vdAnswered) return;
    setVdAnswered(true);

    const q = OLYMPIA_VE_DICH[vdIndex];
    const isCorrect = optionIndex === q.correctIndex;
    const basePoints = q.points;

    if (isCorrect) {
      const earned = starUsedOnCurrent ? basePoints * 2 : basePoints;
      updateScore(earned);
      setFeedback({
        isCorrect: true,
        text: starUsedOnCurrent
          ? `⭐ TUYỆT VỜI! Ngôi sao hy vọng tỏa sáng: +${earned} điểm!`
          : `Chính xác! +${earned} điểm!`,
      });
    } else {
      const penalty = starUsedOnCurrent ? Math.floor(basePoints / 2) : 0;
      if (penalty > 0) updateScore(-penalty);
      setFeedback({
        isCorrect: false,
        text: starUsedOnCurrent
          ? `Rất tiếc! Ngôi sao hy vọng bị trừ -${penalty} điểm!`
          : 'Chưa chính xác!',
      });
    }

    setTimeout(() => {
      setFeedback(null);
      setVdAnswered(false);
      setStarUsedOnCurrent(false);

      if (vdIndex + 1 < OLYMPIA_VE_DICH.length) {
        setVdIndex((prev) => prev + 1);
        simulateBotScores(10, 30);
      } else {
        finishOlympiaGame();
      }
    }, 2000);
  };

  // FINISH GAME & CELEBRATION
  const finishOlympiaGame = async () => {
    setStage('podium');
    incrementTaskProgress('play_climb_or_arena', 1);

    const userFinal = contestants.find((c) => c.isUser)?.score || 0;
    const isChampion = contestants.every((c) => c.isUser || userFinal >= c.score);

    if (isChampion) {
      await addGems(mode === 'multiplayer' ? 50 : 25, 'Vô địch Leo Núi Olympia');
      await awardXP(200, 'Vô địch Đường lên đỉnh Olympia');
      toast.success('CHÚC MỪNG QUÁN QUÂN! Bạn đã chinh phục thành công đỉnh núi Olympia!');
    } else {
      await addGems(15, 'Hoàn thành cuộc thi Leo Núi Olympia');
      await awardXP(100, 'Tham gia Đường lên đỉnh Olympia');
      toast.info('Bạn đã hoàn thành chặng leo núi với tinh thần tuyệt vời!');
    }
  };

  // Sorted contestants for leaderboard/podium
  const rankedContestants = [...contestants].sort((a, b) => b.score - a.score);
  const userScore = contestants.find((c) => c.isUser)?.score || 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800 mb-1.5">
            <Mountain className="h-3.5 w-3.5 text-amber-600" />
            <span>Gameshow Trí Tuệ • Đường Lên Đỉnh Violympus</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Đấu Trường Leo Núi
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-0.5">
            Trải nghiệm 4 vòng thi nghẹt thở: Khởi Động, Vượt Chướng Ngại Vật, Tăng Tốc và Về Đích.
          </p>
        </div>

        {/* Live Score Counter Widget */}
        {stage !== 'lobby' && (
          <div className="flex items-center gap-3 bg-surface-muted/60 border border-border rounded-xl px-4 py-2">
            <Trophy className="h-5 w-5 text-accent-gold" />
            <div>
              <div className="text-[11px] text-foreground-muted font-medium">Điểm của bạn</div>
              <div className="text-xl font-black font-heading text-primary">{userScore} điểm</div>
            </div>
          </div>
        )}
      </div>

      {/* STAGE 0: LOBBY */}
      {stage === 'lobby' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary-soft/40 via-surface to-accent-gold-soft/30 p-6 sm:p-8 text-center space-y-4">
            <div className="inline-block p-4 rounded-2xl bg-primary text-white text-4xl shadow-md">
              🏔️
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
              Sẵn Sàng Chinh Phục Đỉnh Cao?
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted max-w-xl mx-auto leading-relaxed">
              Bạn sẽ bước vào 4 chặng thi chuẩn gameshow học thuật: trả lời chớp nhoáng 60s, mở khóa ô chữ bí mật, tăng tốc nhận 40 điểm và đặt Ngôi Sao Hy Vọng ở vòng về đích!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Solo Mode */}
            <Card className="flex flex-col justify-between border-border hover:border-primary/40 transition-colors shadow-sm">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary mb-3">
                  <Flame className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Thử thách Đơn (Solo)</CardTitle>
                  <Badge variant="secondary">Miễn phí</Badge>
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  Tự mình vượt qua 4 chặng thi để rèn luyện tư duy và thiết lập kỷ lục cá nhân cao nhất trên bảng vàng.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button onClick={() => handleStartGame('solo')} className="w-full gap-2 font-bold" size="lg">
                  <Play className="h-5 w-5" />
                  <span>Bắt đầu thử thách đơn</span>
                </Button>
              </CardContent>
            </Card>

            {/* 4-Player Battle Arena */}
            <Card className="flex flex-col justify-between border-amber-300 shadow-sm bg-gradient-to-br from-surface to-amber-50/20">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gold text-slate-900 mb-3 shadow-xs">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Đấu trường 4 Người</CardTitle>
                  <Badge variant="gold">Vé: 10 💎</Badge>
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  Tranh tài trực tiếp cùng 3 đối thủ đáng gờm. Giành quyền trả lời chướng ngại vật và ẵm vòng nguyệt quế cùng +50 💎!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={() => handleStartGame('multiplayer')}
                  variant="gold"
                  className="w-full gap-2 font-bold"
                  size="lg"
                >
                  <Trophy className="h-5 w-5" />
                  <span>Tham gia đấu 4 người (10 💎)</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* FEEDBACK TOAST BANNER */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all animate-in zoom-in-95 ${
            feedback.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* STAGE 1: KHỞI ĐỘNG (60s SPEED ROUND) */}
      {stage === 'khoi_dong' && (
        <Card className="space-y-4">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Vòng 1 / 4</Badge>
                <CardTitle className="text-xl">Phần Thi Khởi Động</CardTitle>
              </div>
              <CardDescription className="text-xs mt-1">
                Trả lời nhanh các câu hỏi tổng hợp kiến thức trong 60 giây. Mỗi câu đúng: +10 điểm.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 bg-surface-muted px-4 py-2 rounded-xl border border-border">
              <Timer className="h-5 w-5 text-danger animate-pulse" />
              <span className="font-mono text-xl font-black text-danger">{kdTimeLeft}s</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span>Lĩnh vực: <strong>{OLYMPIA_KHOI_DONG[kdIndex]?.category}</strong></span>
              <span>Câu hỏi {kdIndex + 1} / {OLYMPIA_KHOI_DONG.length}</span>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-surface-muted/30 text-center font-heading text-lg sm:text-xl font-bold leading-snug">
              {OLYMPIA_KHOI_DONG[kdIndex]?.question}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OLYMPIA_KHOI_DONG[kdIndex]?.options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  disabled={kdAnswered}
                  onClick={() => handleAnswerKD(idx)}
                  className="p-4 rounded-xl border border-border bg-surface hover:bg-primary-soft hover:border-primary text-left font-medium text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="font-bold text-primary mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* STAGE 2: VƯỢT CHƯỚNG NGẠI VẬT */}
      {stage === 'chuong_ngai_vat' && (
        <Card className="space-y-4">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Vòng 2 / 4</Badge>
                <CardTitle className="text-xl">Vượt Chướng Ngại Vật</CardTitle>
              </div>
              <CardDescription className="text-xs mt-1">
                Từ khóa bí mật gồm <strong>{OLYMPIA_OBSTACLE.totalLetters} chữ cái</strong>. Mở các hàng ngang để tìm gợi ý hoặc bấm chuông trả lời trực tiếp để nhận tới +60 điểm!
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="gold"
              size="lg"
              onClick={() => setIsBuzzerOpen(true)}
              className="gap-2 font-black shadow-md animate-bounce"
            >
              <Volume2 className="h-5 w-5" />
              <span>Bấm chuông trả lời CNV</span>
            </Button>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Clue rows */}
            <div className="space-y-3">
              {OLYMPIA_OBSTACLE.rows.map((row, idx) => {
                const isOpen = openedRows.includes(row.number);
                return (
                  <div
                    key={row.number}
                    className="p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-bold text-sm">
                        {row.number}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">
                          Hàng ngang số {row.number}
                        </div>
                        {isOpen ? (
                          <div className="text-sm font-bold text-success font-mono">
                            Đáp án: {row.answer}
                          </div>
                        ) : (
                          <div className="text-xs text-foreground-muted">
                            {row.question}
                          </div>
                        )}
                      </div>
                    </div>

                    {!isOpen && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setObstacleRowIndex(idx)}
                        className="font-bold shrink-0"
                      >
                        Trả lời hàng ngang
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Answering a specific row */}
            {obstacleRowIndex !== null && (
              <div className="p-5 rounded-2xl border-2 border-primary bg-primary-soft/20 space-y-4">
                <div className="text-sm font-bold text-foreground">
                  Hàng {OLYMPIA_OBSTACLE.rows[obstacleRowIndex].number}: {OLYMPIA_OBSTACLE.rows[obstacleRowIndex].question}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {OLYMPIA_OBSTACLE.rows[obstacleRowIndex].options.map((opt, i) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleAnswerObstacleRow(i)}
                      className="p-3 rounded-lg border border-border bg-surface hover:bg-primary hover:text-white font-medium text-xs text-left cursor-pointer transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modal to guess keyword */}
            {isBuzzerOpen && (
              <div className="p-5 rounded-2xl border-2 border-accent-gold bg-accent-gold-soft/30 space-y-3">
                <div className="text-sm font-bold text-amber-900">
                  Nhập từ khóa Chướng ngại vật (Gợi ý: {OLYMPIA_OBSTACLE.hint}):
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="VD: VIỆT NAM"
                    value={obstacleGuess}
                    onChange={(e) => setObstacleGuess(e.target.value.toUpperCase())}
                    className="font-mono font-bold tracking-widest text-center"
                    autoFocus
                  />
                  <Button type="button" onClick={handleGuessObstacle} variant="gold" className="font-bold shrink-0">
                    Xác nhận
                  </Button>
                  <Button type="button" onClick={() => setIsBuzzerOpen(false)} variant="ghost" className="shrink-0">
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-border pt-4">
            <span className="text-xs text-foreground-muted">Đã mở: {openedRows.length} / 4 hàng</span>
            <Button type="button" onClick={() => setStage('tang_toc')} variant="secondary" size="sm">
              Chuyển sang phần Tăng Tốc
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STAGE 3: TĂNG TỐC */}
      {stage === 'tang_toc' && (
        <Card className="space-y-4">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Vòng 3 / 4</Badge>
                <CardTitle className="text-xl">Phần Thi Tăng Tốc</CardTitle>
              </div>
              <CardDescription className="text-xs mt-1">
                4 câu hỏi tư duy và tính toán nhanh. Trả lời càng nhanh nhận điểm càng cao (40, 30, 20, 10 điểm)!
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 bg-surface-muted px-4 py-2 rounded-xl border border-border">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="font-mono text-xl font-black text-amber-600">{ttTimer}s</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span>Chủ đề: <strong>{OLYMPIA_TANG_TOC[ttIndex]?.category}</strong></span>
              <span>Câu hỏi {ttIndex + 1} / {OLYMPIA_TANG_TOC.length}</span>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-surface-muted/30 text-center font-heading text-lg sm:text-xl font-bold leading-snug">
              {OLYMPIA_TANG_TOC[ttIndex]?.question}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OLYMPIA_TANG_TOC[ttIndex]?.options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  disabled={ttAnswered}
                  onClick={() => handleAnswerTangToc(idx)}
                  className="p-4 rounded-xl border border-border bg-surface hover:bg-primary-soft hover:border-primary text-left font-medium text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="font-bold text-primary mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* STAGE 4: VỀ ĐÍCH */}
      {stage === 've_dich' && (
        <Card className="space-y-4">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="gold">Vòng Chung Cuộc</Badge>
                <CardTitle className="text-xl">Phần Thi Về Đích</CardTitle>
              </div>
              <CardDescription className="text-xs mt-1">
                Lựa chọn Ngôi Sao Hy Vọng ⭐ để nhân đôi số điểm của câu hỏi (trả lời sai bị trừ nửa số điểm).
              </CardDescription>
            </div>

            {/* Star of Hope toggle */}
            {!hasStarOfHope && !starUsedOnCurrent && (
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={() => {
                  setStarUsedOnCurrent(true);
                  setHasStarOfHope(true);
                  toast.success('Bạn đã đặt NGÔI SAO HY VỌNG ⭐ cho câu hỏi này!');
                }}
                className="gap-1.5 font-bold shadow-xs"
              >
                <Star className="h-4 w-4 fill-amber-500" />
                <span>Đặt Ngôi Sao Hy Vọng</span>
              </Button>
            )}
            {starUsedOnCurrent && (
              <Badge variant="gold" className="text-xs px-3 py-1 gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                Đã đặt Ngôi Sao Hy Vọng (X2 Điểm)
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span>Gói câu hỏi: <strong>{OLYMPIA_VE_DICH[vdIndex]?.category}</strong></span>
              <span>Câu hỏi {vdIndex + 1} / {OLYMPIA_VE_DICH.length}</span>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-surface-muted/30 text-center font-heading text-lg sm:text-xl font-bold leading-snug">
              {OLYMPIA_VE_DICH[vdIndex]?.question}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OLYMPIA_VE_DICH[vdIndex]?.options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  disabled={vdAnswered}
                  onClick={() => handleAnswerVeDich(idx)}
                  className="p-4 rounded-xl border border-border bg-surface hover:bg-primary-soft hover:border-primary text-left font-medium text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="font-bold text-primary mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* STAGE 5: PODIUM & CELEBRATION */}
      {stage === 'podium' && (
        <Card className="text-center p-6 sm:p-10 space-y-6 border-amber-300 bg-gradient-to-b from-amber-50/40 via-surface to-surface">
          <div className="inline-block p-4 rounded-full bg-accent-gold text-slate-900 text-5xl shadow-lg">
            👑
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Chung Kết Cuộc Thi
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-foreground mt-1">
              Vòng Nguyệt Quế Danh Dự
            </h2>
          </div>

          {/* Podium Contestant Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
            {rankedContestants.map((c, index) => {
              const isWinner = index === 0;
              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border transition-all text-center space-y-2 ${
                    isWinner
                      ? 'border-amber-400 bg-amber-100/70 shadow-md ring-2 ring-amber-400'
                      : 'border-border bg-surface'
                  }`}
                >
                  <div className="text-2xl">{c.avatar}</div>
                  <div className="text-xs font-bold text-foreground truncate">{c.name}</div>
                  <div className="text-xl font-black font-heading text-primary">{c.score} đ</div>
                  <Badge variant={isWinner ? 'gold' : 'secondary'} className="text-[10px]">
                    Hạng {index + 1}
                  </Badge>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => handleStartGame(mode)}
              size="lg"
              className="gap-2 font-bold w-full sm:w-auto"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Chơi lại ván mới</span>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-medium">
              <Link to="/leaderboard">Xem Bảng xếp hạng</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
