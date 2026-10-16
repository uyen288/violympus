import { useState, useEffect, useCallback } from 'react';
import {
  Zap,
  Trophy,
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BookOpen,
  AlertCircle,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  getTrueFalseQuestionsForSubjects,
  SUBJECT_METAS,
  type TrueFalseQuestion,
} from '../data/practiceBank';

interface LightningTrueFalseGameProps {
  selectedSubjectSlugs: string[];
  onBack: () => void;
  onChangeSubjects?: () => void;
}

const QUESTION_TIME_SECONDS = 7;

export function LightningTrueFalseGame({
  selectedSubjectSlugs,
  onBack,
  onChangeSubjects,
}: LightningTrueFalseGameProps) {
  const [questions, setQuestions] = useState<TrueFalseQuestion[]>(() =>
    getTrueFalseQuestionsForSubjects(selectedSubjectSlugs, 10)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const handleRestart = () => {
    const fresh = getTrueFalseQuestionsForSubjects(selectedSubjectSlugs, 10);
    setQuestions(fresh);
    setCurrentIndex(0);
    setTimeLeft(QUESTION_TIME_SECONDS);
    setUserChoice(null);
    setIsAnswered(false);
    setLives(3);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setIsWon(false);
  };

  const question = questions[currentIndex];

  const handleTimeout = useCallback(() => {
    setIsAnswered(true);
    setUserChoice(null); // Timeout = wrong
    setStreak(0);
    setLives((l) => {
      const next = l - 1;
      if (next <= 0) {
        setIsGameOver(true);
      }
      return next;
    });
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isAnswered || isGameOver || isWon || !question) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, isGameOver, isWon, question, handleTimeout]);

  const handleAnswer = (choice: boolean) => {
    if (isAnswered || isGameOver || isWon || !question) return;

    setUserChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === question.isTrue;
    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      const comboMultiplier = nextStreak >= 3 ? 2 : nextStreak >= 2 ? 1.5 : 1;
      const points = Math.round((50 + timeLeft * 10) * comboMultiplier);
      setScore((s) => s + points);
    } else {
      setStreak(0);
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setIsGameOver(true);
        }
        return next;
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(QUESTION_TIME_SECONDS);
      setUserChoice(null);
      setIsAnswered(false);
    } else {
      setIsWon(true);
    }
  };

  const activeSubjectsLabel =
    selectedSubjectSlugs.length === 0
      ? 'Tất cả 11 lĩnh vực'
      : selectedSubjectSlugs
          .map((s) => SUBJECT_METAS.find((m) => m.slug === s)?.shortName || s)
          .join(', ');

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="danger" className="text-xs font-bold gap-1 bg-rose-600 text-white">
              <Zap className="h-3 w-3" />
              Tốc Độ Chớp Nhoáng
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
              <BookOpen className="h-3 w-3 mr-1" />
              Lĩnh vực: {activeSubjectsLabel}
            </Badge>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-foreground">
              Tia Chớp Đúng / Sai (Lightning Reflex)
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            Khẳng định kiến thức hiện ra với 7 giây đếm ngược. Phản xạ chớp nhoáng ĐÚNG hoặc SAI!
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Lives */}
          <div className="flex items-center gap-1 bg-surface-muted px-3 py-1.5 rounded-xl border border-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`h-4 w-4 transition-colors ${
                  i < lives ? 'text-danger fill-danger' : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Score & Streak */}
          <div className="flex items-center gap-1.5 font-mono font-bold text-accent-gold text-base">
            <Trophy className="h-4 w-4" />
            <span>{score} đ</span>
          </div>

          {streak > 1 && (
            <Badge variant="gold" className="text-[10px] animate-pulse">
              Combo x{streak}
            </Badge>
          )}

          <Button variant="outline" size="sm" onClick={handleRestart} className="gap-1 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Chơi lại</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Trở về</span>
          </Button>
        </div>
      </div>

      {/* Empty questions warning */}
      {questions.length === 0 && (
        <Card className="p-8 text-center border-warning/30 bg-warning/5 space-y-3">
          <AlertCircle className="h-8 w-8 text-warning mx-auto" />
          <h3 className="font-heading font-bold text-base text-foreground">
            Chưa có câu hỏi đúng/sai cho lĩnh vực đã chọn
          </h3>
          <p className="text-xs text-foreground-muted max-w-md mx-auto">
            Vui lòng chọn thêm các lĩnh vực khác để nạp câu hỏi cho trò chơi.
          </p>
          {onChangeSubjects && (
            <Button variant="outline" size="sm" onClick={onChangeSubjects}>
              Chọn lại lĩnh vực
            </Button>
          )}
        </Card>
      )}

      {/* Victory / Game Over Overlays */}
      {isWon && (
        <Card className="p-8 text-center bg-gradient-to-b from-success/15 via-surface to-accent-gold/10 border-success/30 shadow-md space-y-4 animate-fade-in">
          <div className="inline-flex p-3 rounded-full bg-success/20 text-success">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Phản Xạ Thần Tốc — Hoàn Thành Thử Thách!
          </h3>
          <p className="text-sm text-foreground-muted">
            Lĩnh vực: <strong>{activeSubjectsLabel}</strong> • Điểm số xuất sắc:{' '}
            <strong className="text-accent-gold font-mono text-xl">{score} điểm</strong> ({lives} mạng còn lại).
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={handleRestart} className="font-bold">
              Chơi ván tiếp theo
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Về trung tâm luyện tập
            </Button>
          </div>
        </Card>
      )}

      {isGameOver && (
        <Card className="p-8 text-center bg-gradient-to-b from-danger/10 to-surface border-danger/30 space-y-4">
          <h3 className="font-heading text-2xl font-bold text-danger">Hết mạng rồi!</h3>
          <p className="text-sm text-foreground-muted">
            Tia chớp tốc độ đã tạm dừng tại câu thứ {currentIndex + 1} ({activeSubjectsLabel}). Thử lại ngay để bứt phá kỷ lục!
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={handleRestart} className="font-bold">
              Thử lại ngay
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Về trung tâm luyện tập
            </Button>
          </div>
        </Card>
      )}

      {/* Main Game Screen */}
      {!isWon && !isGameOver && question && (
        <Card className="border-border shadow-xs overflow-hidden">
          {/* Progress & Countdown Bar */}
          <div className="h-2 w-full bg-surface-muted overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 2 ? 'bg-danger animate-pulse' : 'bg-primary'
              }`}
              style={{ width: `${(timeLeft / QUESTION_TIME_SECONDS) * 100}%` }}
            />
          </div>

          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-semibold">
                  Môn: {question.subjectName}
                </Badge>
                <span className="text-xs text-foreground-muted font-semibold">
                  Câu hỏi {currentIndex + 1} / {questions.length}
                </span>
              </div>

              {/* Countdown badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-bold text-sm border ${
                  timeLeft <= 2
                    ? 'bg-danger/15 text-danger border-danger/30 animate-pulse'
                    : 'bg-surface-muted text-foreground border-border'
                }`}
              >
                <Timer className="h-4 w-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            <div className="py-6 text-center space-y-2">
              <span className="text-xs font-mono uppercase text-foreground-muted tracking-wider">
                Khẳng định kiến thức:
              </span>
              <h3 className="font-heading text-lg sm:text-2xl font-extrabold text-foreground max-w-xl mx-auto leading-relaxed">
                "{question.prompt}"
              </h3>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* BIG TRUE / FALSE ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                type="button"
                disabled={isAnswered}
                onClick={() => handleAnswer(true)}
                className={`p-6 rounded-2xl border-2 font-heading font-black text-lg sm:text-xl flex flex-col items-center justify-center gap-2 transition-all transform active:scale-95 ${
                  isAnswered
                    ? question.isTrue
                      ? 'border-success bg-success/15 text-success ring-4 ring-success/30'
                      : userChoice === true
                      ? 'border-danger bg-danger/15 text-danger'
                      : 'border-border opacity-40 text-foreground-muted'
                    : 'border-success/40 bg-success/5 text-success hover:bg-success/15 hover:border-success hover:scale-102 shadow-xs cursor-pointer'
                }`}
              >
                <CheckCircle2 className="h-8 w-8 text-success" />
                <span>ĐÚNG</span>
              </button>

              <button
                type="button"
                disabled={isAnswered}
                onClick={() => handleAnswer(false)}
                className={`p-6 rounded-2xl border-2 font-heading font-black text-lg sm:text-xl flex flex-col items-center justify-center gap-2 transition-all transform active:scale-95 ${
                  isAnswered
                    ? !question.isTrue
                      ? 'border-success bg-success/15 text-success ring-4 ring-success/30'
                      : userChoice === false
                      ? 'border-danger bg-danger/15 text-danger'
                      : 'border-border opacity-40 text-foreground-muted'
                    : 'border-danger/40 bg-danger/5 text-danger hover:bg-danger/15 hover:border-danger hover:scale-102 shadow-xs cursor-pointer'
                }`}
              >
                <XCircle className="h-8 w-8 text-danger" />
                <span>SAI</span>
              </button>
            </div>

            {/* Answer Result Banner & Explanation */}
            {isAnswered && (
              <div className="space-y-4 pt-2 max-w-lg mx-auto animate-fade-in">
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    userChoice === question.isTrue
                      ? 'bg-success/10 border-success/30 text-success'
                      : 'bg-danger/10 border-danger/30 text-danger'
                  }`}
                >
                  {userChoice === question.isTrue ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs sm:text-sm text-foreground">
                    <strong className="block font-semibold">
                      {userChoice === question.isTrue
                        ? 'Chính xác! Phản xạ xuất sắc.'
                        : userChoice === null
                        ? 'Hết giờ rồi! Bạn bị trừ 1 mạng.'
                        : 'Chưa chính xác! Bạn bị trừ 1 mạng.'}
                    </strong>
                    <p className="text-foreground-muted text-xs leading-relaxed">
                      💡 <strong>Giải thích:</strong> {question.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNextQuestion}
                    className="gap-1.5 font-bold shadow-xs"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
