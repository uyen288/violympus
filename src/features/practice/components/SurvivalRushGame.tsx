import { useState, useEffect } from 'react';
import {
  Flame,
  Trophy,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  AlertCircle,
  Hourglass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  getPracticeQuestionsForSubjects,
  SUBJECT_METAS,
  type PracticeQuestion,
} from '../data/practiceBank';

interface SurvivalRushGameProps {
  selectedSubjectSlugs: string[];
  onBack: () => void;
  onChangeSubjects?: () => void;
}

const INITIAL_TIME_SECONDS = 60;

export function SurvivalRushGame({
  selectedSubjectSlugs,
  onBack,
  onChangeSubjects,
}: SurvivalRushGameProps) {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeBonusMessage, setTimeBonusMessage] = useState<string | null>(null);

  const handleRestart = () => {
    // Generates a deep queue of questions
    const pool = getPracticeQuestionsForSubjects(selectedSubjectSlugs, 30);
    setQuestions(pool);
    setCurrentIdx(0);
    setTimeLeft(INITIAL_TIME_SECONDS);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setTimeBonusMessage(null);
  };

  // Master Countdown Timer
  useEffect(() => {
    if (isGameOver || questions.length === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver, questions]);

  const question = questions[currentIdx % (questions.length || 1)];

  const handleSelectOption = (key: string) => {
    if (isAnswered || isGameOver || !question) return;

    setSelectedOption(key);
    setIsAnswered(true);

    const isCorrect = key === question.correctKey;
    if (isCorrect) {
      setScore((s) => s + 100);
      setCorrectCount((c) => c + 1);
      setTimeLeft((t) => Math.min(120, t + 5)); // Cap at 120s
      setTimeBonusMessage('+5s Thưởng Tốc Độ!');
    } else {
      setWrongCount((w) => w + 1);
      setTimeLeft((t) => Math.max(0, t - 10)); // -10s penalty
      setTimeBonusMessage('-10s Phạt Sai!');
    }

    // Auto next after 1.2 seconds for rapid-fire adrenaline flow
    setTimeout(() => {
      setTimeBonusMessage(null);
      setSelectedOption(null);
      setIsAnswered(false);
      setCurrentIdx((i) => i + 1);
    }, 1200);
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
            <Badge variant="warning" className="text-xs font-bold gap-1 bg-amber-500 text-white">
              <Flame className="h-3 w-3" />
              Sinh Tồn Tốc Độ
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
              <BookOpen className="h-3 w-3 mr-1" />
              Lĩnh vực: {activeSubjectsLabel}
            </Badge>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-foreground">
              Cơn Lốc Sinh Tồn (Survival Rush)
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            Đúng được <strong className="text-success">+5 giây</strong> và +100đ. Sai bị <strong className="text-danger">-10 giây</strong>! Trả lời càng nhiều câu càng tốt trước khi hết giờ.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Master Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-base border transition-colors ${
              timeLeft <= 10
                ? 'bg-danger/15 text-danger border-danger/30 animate-pulse'
                : 'bg-primary-soft text-primary border-primary/30'
            }`}
          >
            <Hourglass className="h-4 w-4" />
            <span>{timeLeft}s</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 font-mono font-bold text-accent-gold text-base">
            <Trophy className="h-4 w-4" />
            <span>{score} đ</span>
          </div>

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
            Chưa có câu hỏi cho lĩnh vực đã chọn
          </h3>
          <p className="text-xs text-foreground-muted max-w-md mx-auto">
            Vui lòng chọn thêm các môn học khác để bắt đầu chế độ Cơn lốc sinh tồn.
          </p>
          {onChangeSubjects && (
            <Button variant="outline" size="sm" onClick={onChangeSubjects}>
              Chọn lại lĩnh vực
            </Button>
          )}
        </Card>
      )}

      {/* Game Over Summary Screen */}
      {isGameOver && (
        <Card className="p-8 text-center bg-gradient-to-b from-primary/10 via-surface to-accent-gold/10 border-primary/30 shadow-md space-y-4 animate-fade-in">
          <div className="inline-flex p-3 rounded-full bg-accent-gold/20 text-accent-gold">
            <Trophy className="h-10 w-10" />
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
            Hết Thời Gian Sinh Tồn!
          </h3>
          <p className="text-sm text-foreground-muted max-w-md mx-auto">
            Lĩnh vực: <strong>{activeSubjectsLabel}</strong> • Bạn đã trả lời đúng{' '}
            <strong className="text-success">{correctCount} câu</strong>, sai{' '}
            <strong className="text-danger">{wrongCount} câu</strong>.
          </p>
          <div className="text-3xl font-mono font-black text-accent-gold">
            {score} Điểm
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="primary" size="md" onClick={handleRestart} className="font-bold">
              Chinh phục kỷ lục mới
            </Button>
            <Button variant="outline" size="md" onClick={onBack}>
              Về trung tâm luyện tập
            </Button>
          </div>
        </Card>
      )}

      {/* Main Rush Question Screen */}
      {!isGameOver && question && (
        <Card className="border-border shadow-xs relative overflow-hidden">
          {/* Time bonus alert floating */}
          {timeBonusMessage && (
            <div
              className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-mono font-extrabold animate-bounce z-10 ${
                timeBonusMessage.includes('+')
                  ? 'bg-success text-white'
                  : 'bg-danger text-white'
              }`}
            >
              {timeBonusMessage}
            </div>
          )}

          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-semibold">
                  Môn: {question.subjectName}
                </Badge>
                <span className="text-xs text-foreground-muted font-semibold">
                  Chuỗi câu: {currentIdx + 1}
                </span>
              </div>
              <div className="text-xs text-foreground-muted font-medium">
                Đúng: <span className="text-success font-bold">{correctCount}</span> | Sai:{' '}
                <span className="text-danger font-bold">{wrongCount}</span>
              </div>
            </div>

            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground pt-3 leading-snug">
              {question.prompt}
            </h3>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = opt.key === question.correctKey;

                let btnStyle = 'border-border bg-surface hover:bg-slate-50 text-foreground';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'border-success bg-success/15 text-success font-bold ring-2 ring-success/30';
                  } else if (isSelected) {
                    btnStyle = 'border-danger bg-danger/15 text-danger font-bold ring-2 ring-danger/30';
                  } else {
                    btnStyle = 'border-border bg-surface opacity-50 text-foreground-muted';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${btnStyle} ${
                      !isAnswered ? 'cursor-pointer hover:border-primary/50' : 'cursor-default'
                    }`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold shrink-0">
                      {opt.key}
                    </span>
                    <span className="text-sm font-medium">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
