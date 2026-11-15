import * as React from 'react';
import { Link } from 'react-router';
import {
  Mountain,
  Zap,
  Timer,
  Play,
  RotateCcw,
  Star,
  Trophy,
  Volume2,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/app/providers';
import { useGamificationStore } from '@/lib/gamification/gamificationStore';
import { useStudyTracker } from '@/hooks/useStudyTracker';
import { supabase } from '@/lib/supabase/client';
import {
  OLYMPIA_KHOI_DONG,
  OLYMPIA_OBSTACLE,
  OLYMPIA_TANG_TOC,
  OLYMPIA_VE_DICH,
} from '../data/olympiaBank';
import { toast } from 'sonner';

type GameStage = 'lobby' | 'khoi_dong' | 'chuong_ngai_vat' | 'tang_toc' | 've_dich' | 'podium';

export function ClimbPage() {
  const { user } = useAuth();
  const { spendGems, addGems, awardXP, incrementTaskProgress } = useGamificationStore();

  // Active study tracking while on climb page
  useStudyTracker(true);

  const [stage, setStage] = React.useState<GameStage>('lobby');

  // Real user score & personal stats
  const [userScore, setUserScore] = React.useState(0);
  const [personalBest, setPersonalBest] = React.useState(0);
  const [isNewRecord, setIsNewRecord] = React.useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = React.useState(0);

  // Fetch real user's high score from Supabase on load
  React.useEffect(() => {
    async function loadPersonalBest() {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('climb_high_score')
          .eq('id', user.id)
          .single();
        if (data && data.climb_high_score) {
          setPersonalBest(data.climb_high_score);
        }
      }
    }
    void loadPersonalBest();
  }, [user]);

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

  // Update user score helper
  const addScore = React.useCallback((points: number) => {
    setUserScore((prev) => Math.max(0, prev + points));
  }, []);

  // START GAME
  const handleStartGame = async () => {
    const ok = await spendGems(10, 'Vé tham gia Leo Núi Olympia');
    if (!ok) {
      toast.error('Bạn cần có ít nhất 10 Kim cương để tham gia thử thách Leo Núi Olympia!');
      return;
    }

    setUserScore(0);
    setIsNewRecord(false);
    setCorrectAnswersCount(0);
    setKdIndex(0);
    setKdTimeLeft(60);
    setKdAnswered(false);
    setOpenedRows([]);
    setObstacleRowIndex(null);
    setTtIndex(0);
    setTtTimer(30);
    setVdIndex(0);
    setHasStarOfHope(false);
    setStarUsedOnCurrent(false);
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
          setStage('chuong_ngai_vat');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage]);

  // Round 1: Submit Answer
  const handleAnswerKhoiDong = (optionIndex: number) => {
    if (kdAnswered) return;
    setKdAnswered(true);

    const q = OLYMPIA_KHOI_DONG[kdIndex];
    const isCorrect = optionIndex === q.correctIndex;

    if (isCorrect) {
      addScore(q.points);
      setCorrectAnswersCount((prev) => prev + 1);
      setFeedback({ isCorrect: true, text: `Chính xác! +${q.points} điểm.` });
    } else {
      setFeedback({ isCorrect: false, text: `Chưa chính xác! Đáp án đúng: ${q.options[q.correctIndex]}` });
    }

    setTimeout(() => {
      setFeedback(null);
      setKdAnswered(false);
      if (kdIndex + 1 < OLYMPIA_KHOI_DONG.length) {
        setKdIndex((prev) => prev + 1);
      } else {
        toast.success('Đã hoàn thành phần thi Khởi Động!');
        setStage('chuong_ngai_vat');
      }
    }, 1200);
  };

  // Round 2: Answer Obstacle Row Clue
  const handleAnswerObstacleRow = (optionIndex: number) => {
    if (obstacleRowIndex === null) return;
    const row = OLYMPIA_OBSTACLE.rows[obstacleRowIndex];
    const isCorrect = optionIndex === row.correctIndex;

    if (isCorrect) {
      addScore(10);
      setCorrectAnswersCount((prev) => prev + 1);
      setOpenedRows((prev) => [...prev, obstacleRowIndex]);
      setFeedback({ isCorrect: true, text: `Chính xác! Bạn mở được hàng ngang số ${obstacleRowIndex + 1} (+10 điểm).` });
    } else {
      setFeedback({ isCorrect: false, text: 'Chưa chính xác câu hỏi hàng ngang này!' });
    }

    setTimeout(() => {
      setFeedback(null);
      setObstacleRowIndex(null);
    }, 1500);
  };

  // Round 2: Guess Secret Keyword Buzzer
  const handleGuessObstacle = () => {
    const cleanGuess = obstacleGuess.trim().toUpperCase();
    const cleanSecret = OLYMPIA_OBSTACLE.keyword.toUpperCase();

    if (cleanGuess === cleanSecret) {
      const bonus = Math.max(20, 60 - openedRows.length * 10);
      addScore(bonus);
      setCorrectAnswersCount((prev) => prev + 1);
      setIsBuzzerOpen(false);
      toast.success(`XUẤT SẮC! Bạn đã giải mã thành công từ khóa "${OLYMPIA_OBSTACLE.keyword}" (+${bonus} điểm)!`);
      setTimeout(() => setStage('tang_toc'), 1500);
    } else {
      toast.error('Rất tiếc! Từ khóa chướng ngại vật chưa chính xác. Chuyển sang vòng thi tiếp theo.');
      setIsBuzzerOpen(false);
      setTimeout(() => setStage('tang_toc'), 1500);
    }
  };

  // Next Tăng Tốc Question Callback
  const nextTangTocQuestion = React.useCallback(() => {
    setTtAnswered(false);
    setTtTimer(30);
    setTtIndex((prev) => {
      if (prev + 1 < OLYMPIA_TANG_TOC.length) {
        return prev + 1;
      } else {
        setStage('ve_dich');
        return prev;
      }
    });
  }, []);

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

  // Round 3: Answer Tăng tốc
  const handleAnswerTangToc = (optionIndex: number) => {
    if (ttAnswered) return;
    setTtAnswered(true);

    const q = OLYMPIA_TANG_TOC[ttIndex];
    const isCorrect = optionIndex === q.correctIndex;

    if (isCorrect) {
      let points = 10;
      if (ttTimer >= 22) points = 40;
      else if (ttTimer >= 15) points = 30;
      else if (ttTimer >= 8) points = 20;

      addScore(points);
      setCorrectAnswersCount((prev) => prev + 1);
      setFeedback({ isCorrect: true, text: `Chính xác! Tốc độ ${30 - ttTimer}s: +${points} điểm!` });
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

    if (isCorrect) {
      const points = starUsedOnCurrent ? q.points * 2 : q.points;
      addScore(points);
      setCorrectAnswersCount((prev) => prev + 1);
      setFeedback({
        isCorrect: true,
        text: starUsedOnCurrent
          ? `TUYỆT VỜI! Ngôi Sao Hy Vọng nhân đôi: +${points} điểm!`
          : `Chính xác! +${points} điểm.`,
      });
    } else {
      const penalty = starUsedOnCurrent ? Math.floor(q.points / 2) : 0;
      if (penalty > 0) addScore(-penalty);
      setFeedback({
        isCorrect: false,
        text: starUsedOnCurrent
          ? `Rất tiếc! Ngôi Sao Hy Vọng trả lời sai bị trừ -${penalty} điểm.`
          : 'Chưa chính xác câu hỏi này!',
      });
    }

    setTimeout(() => {
      setFeedback(null);
      setVdAnswered(false);
      setStarUsedOnCurrent(false);

      if (vdIndex + 1 < OLYMPIA_VE_DICH.length) {
        setVdIndex((prev) => prev + 1);
      } else {
        void finishOlympiaGame();
      }
    }, 2000);
  };

  // FINISH GAME & CELEBRATION (Real score update to Supabase)
  const finishOlympiaGame = async () => {
    setStage('podium');
    incrementTaskProgress('play_climb_or_arena', 1);

    const finalScore = userScore;
    const isRecord = finalScore > personalBest;

    if (isRecord) {
      setIsNewRecord(true);
      setPersonalBest(finalScore);
      if (user) {
        try {
          await supabase
            .from('profiles')
            .update({
              climb_high_score: finalScore,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
        } catch {
          // ignore
        }
      }
    }

    if (finalScore >= 200) {
      await addGems(50, 'Chinh phục Đỉnh Olympus xuất sắc');
      await awardXP(250, 'Hoàn thành Leo Núi điểm cao');
      toast.success('CHÚC MỪNG QUÁN QUÂN! Bạn nhận được +50 💎 và +250 XP!');
    } else {
      await addGems(20, 'Hoàn thành chặng thi Leo Núi');
      await awardXP(120, 'Tham gia chặng thi Leo Núi');
      toast.info('Bạn đã hoàn thành chặng leo núi kiên cường! Nhận +20 💎 và +120 XP.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
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
            Thử thách trí tuệ cá nhân qua 4 vòng thi nghẹt thở: Khởi Động, Vượt Chướng Ngại Vật, Tăng Tốc và Về Đích.
          </p>
        </div>

        {/* Live Score Counter Widget */}
        {stage !== 'lobby' && (
          <div className="flex items-center gap-4 bg-surface-muted/60 border border-border rounded-xl px-4 py-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent-gold" />
              <div>
                <div className="text-[11px] text-foreground-muted font-medium">Điểm hiện tại</div>
                <div className="text-xl font-black font-heading text-primary">{userScore} đ</div>
              </div>
            </div>

            {personalBest > 0 && (
              <div className="border-l border-border pl-3">
                <div className="text-[11px] text-foreground-muted font-medium">Kỷ lục cá nhân</div>
                <div className="text-sm font-bold text-amber-600">{personalBest} đ</div>
              </div>
            )}
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
              Sẵn Sàng Chinh Phục Đỉnh Cao Tri Thức?
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted max-w-xl mx-auto leading-relaxed">
              Bạn sẽ bước vào 4 chặng thi chuẩn gameshow học thuật: trả lời chớp nhoáng 60s, giải mã ô chữ bí mật, tăng tốc nhận 40 điểm và đặt Ngôi Sao Hy Vọng ở vòng về đích!
            </p>

            {personalBest > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-sm">
                <Award className="h-4 w-4 text-amber-600" />
                <span>Kỷ lục cao nhất của bạn: {personalBest} điểm</span>
              </div>
            )}
          </div>

          <Card className="border-amber-300 shadow-sm bg-gradient-to-br from-surface to-amber-50/20 max-w-2xl mx-auto">
            <CardHeader className="text-center pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gold text-slate-900 mx-auto mb-2 shadow-xs">
                <Trophy className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl">Bắt Đầu Chặng Thi Olympia</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Chi phí vé tham gia: <strong>10 💎 Kim cương</strong>. Trả lời đúng nhận điểm thưởng, phá vỡ kỷ lục cá nhân và ghi danh trực tiếp trên Bảng Vàng Toàn Hệ Thống!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl border border-border bg-surface">
                  <span className="font-bold block text-primary">Vòng 1</span>
                  <span className="text-foreground-muted">Khởi động 60s</span>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface">
                  <span className="font-bold block text-primary">Vòng 2</span>
                  <span className="text-foreground-muted">Chướng ngại vật</span>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface">
                  <span className="font-bold block text-primary">Vòng 3</span>
                  <span className="text-foreground-muted">Tăng tốc 30s</span>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface">
                  <span className="font-bold block text-primary">Vòng 4</span>
                  <span className="text-foreground-muted">Về đích (⭐)</span>
                </div>
              </div>

              <Button
                onClick={handleStartGame}
                variant="gold"
                className="w-full gap-2 font-bold text-base h-12 shadow-sm"
              >
                <Play className="h-5 w-5" />
                <span>Chinh phục đỉnh núi ngay (10 💎)</span>
              </Button>
            </CardContent>
          </Card>
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
                  onClick={() => handleAnswerKhoiDong(idx)}
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
              className="gap-2 font-bold animate-bounce shadow-md"
            >
              <Volume2 className="h-5 w-5" />
              <span>BẤM CHUÔNG ĐOÁN TỪ KHÓA</span>
            </Button>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Buzzer Input Box */}
            {isBuzzerOpen && (
              <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/50 space-y-3 animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-900">
                    Nhập câu trả lời từ khóa chướng ngại vật:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsBuzzerOpen(false)}
                    className="text-xs text-foreground-muted hover:text-foreground"
                  >
                    Đóng
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    value={obstacleGuess}
                    onChange={(e) => setObstacleGuess(e.target.value)}
                    placeholder="Nhập từ khóa bí mật..."
                    className="font-bold uppercase tracking-wider"
                  />
                  <Button onClick={handleGuessObstacle} variant="gold" className="font-bold shrink-0">
                    Xác nhận
                  </Button>
                </div>
              </div>
            )}

            {/* 4 Rows */}
            <div className="space-y-3">
              {OLYMPIA_OBSTACLE.rows.map((row, idx) => {
                const isOpened = openedRows.includes(idx);
                return (
                  <div key={row.number} className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold text-xs">
                          {row.number}
                        </span>
                        <span className="text-sm font-semibold">
                          Hàng ngang số {row.number} ({row.answer.length} chữ cái)
                        </span>
                      </div>

                      {isOpened ? (
                        <Badge variant="success" className="font-mono font-bold tracking-widest text-xs px-3 py-1">
                          {row.answer}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setObstacleRowIndex(idx)}
                          disabled={obstacleRowIndex !== null}
                          className="font-bold text-xs"
                        >
                          Chọn hàng ngang
                        </Button>
                      )}
                    </div>

                    {/* Active Row Question */}
                    {obstacleRowIndex === idx && !isOpened && (
                      <div className="p-4 rounded-xl border border-primary/40 bg-primary-soft/20 space-y-3 animate-in fade-in">
                        <p className="text-sm font-bold text-foreground">
                          {row.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {row.options.map((opt, optIdx) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleAnswerObstacleRow(optIdx)}
                              className="p-2.5 rounded-lg border border-border bg-surface hover:bg-primary-soft text-left text-xs font-medium cursor-pointer"
                            >
                              <span className="font-bold text-primary mr-1">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-right">
              <Button onClick={() => setStage('tang_toc')} variant="ghost" className="gap-2 font-bold text-xs">
                <span>Bỏ qua & Sang vòng Tăng Tốc</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
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
              <span className="font-mono text-xl font-black text-amber-500">{ttTimer}s</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span>Lĩnh vực: <strong>{OLYMPIA_TANG_TOC[ttIndex]?.category}</strong></span>
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
                <Badge variant="gold">Vòng Về Đích</Badge>
                <CardTitle className="text-xl">Chặng Quyết Định</CardTitle>
              </div>
              <CardDescription className="text-xs mt-1">
                Gói câu hỏi thử thách. Bạn có duy nhất <strong>1 Ngôi Sao Hy Vọng ⭐</strong> để nhân đôi số điểm!
              </CardDescription>
            </div>

            {!hasStarOfHope && !starUsedOnCurrent && (
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={() => {
                  setHasStarOfHope(true);
                  setStarUsedOnCurrent(true);
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
              Tổng Kết Chặng Thi
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-foreground mt-1">
              Vòng Nguyệt Quế Tri Thức
            </h2>
            {isNewRecord && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs animate-bounce">
                <Trophy size={14} /> KỶ LỤC MỚI CỦA BẠN!
              </div>
            )}
          </div>

          {/* User Achievement Summary */}
          <div className="max-w-md mx-auto rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-sm">
            <div className="text-3xl font-black font-heading text-primary">
              {userScore} <span className="text-lg font-medium text-foreground-muted">điểm</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border">
              <div className="p-2.5 rounded-xl bg-surface-muted">
                <span className="text-foreground-muted block">Số câu đúng</span>
                <span className="font-bold text-foreground text-sm">{correctAnswersCount} câu</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-muted">
                <span className="text-foreground-muted block">Kỷ lục cá nhân</span>
                <span className="font-bold text-amber-600 text-sm">{personalBest} điểm</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="button"
              onClick={handleStartGame}
              size="lg"
              className="gap-2 font-bold w-full sm:w-auto"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Chinh phục lại ván mới</span>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-medium">
              <Link to="/leaderboard">Xem Bảng Xếp Hạng Người Dùng Thật</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
