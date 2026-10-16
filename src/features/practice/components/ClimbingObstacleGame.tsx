import { useState } from 'react';
import { Mountain, Heart, Trophy, ArrowRight, ArrowLeft, CheckCircle2, XCircle, Sparkles, RotateCcw, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getPracticeQuestionsForSubjects, SUBJECT_METAS, type PracticeQuestion } from '../data/practiceBank';

interface ClimbingObstacleGameProps {
  selectedSubjectSlugs: string[];
  onBack: () => void;
  onChangeSubjects?: () => void;
}

export function ClimbingObstacleGame({ selectedSubjectSlugs, onBack, onChangeSubjects }: ClimbingObstacleGameProps) {
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() =>
    getPracticeQuestionsForSubjects(selectedSubjectSlugs, 7)
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const handleRestart = () => {
    const fresh = getPracticeQuestionsForSubjects(selectedSubjectSlugs, 7);
    setQuestions(fresh);
    setCurrentStep(0);
    setLives(3);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setIsWon(false);
  };

  const question = questions[currentStep];

  const handleSelectOption = (key: string) => {
    if (isAnswered || isGameOver || isWon || !question) return;

    setSelectedOption(key);
    setIsAnswered(true);

    const isCorrect = key === question.correctKey;
    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      const points = 10 + nextStreak * 5;
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

  const handleNextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((s) => s + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsWon(true);
    }
  };

  const activeSubjectsLabel = selectedSubjectSlugs.length === 0
    ? 'Tất cả 11 lĩnh vực'
    : selectedSubjectSlugs
        .map((s) => SUBJECT_METAS.find((m) => m.slug === s)?.shortName || s)
        .join(', ');

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="warning" className="text-xs">
              Violympic Classic
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
              <BookOpen className="h-3 w-3 mr-1" />
              Lĩnh vực: {activeSubjectsLabel}
            </Badge>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-foreground">
              Vượt Chướng Ngại Vật (Khỉ Leo Núi)
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            Leo lên đỉnh núi tri thức! Trả lời đúng các câu hỏi trắc nghiệm của lĩnh vực đã chọn để nhận thưởng Combo.
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
            Chưa có câu hỏi cho lĩnh vực đã chọn
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

      {/* Mountain Progress Visualizer */}
      {questions.length > 0 && !isWon && !isGameOver && (
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground-muted">
            <span className="flex items-center gap-1">
              <Mountain className="h-4 w-4 text-primary" />
              <span>Bậc đèo: {currentStep + 1} / {questions.length}</span>
            </span>
            <span className="font-mono text-accent-gold">
              Đỉnh núi: {Math.round(((currentStep) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-surface-muted overflow-hidden border border-border/50">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent-gold transition-all duration-500 rounded-full"
              style={{ width: `${((currentStep) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Victory / Game Over Overlay */}
      {isWon && (
        <Card className="p-8 text-center bg-gradient-to-b from-success/10 to-surface border-success/30 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-success/20 text-success">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Chúc mừng! Bạn đã chạm đỉnh núi thành công!
          </h3>
          <p className="text-sm text-foreground-muted">
            Lĩnh vực: <strong>{activeSubjectsLabel}</strong> • Tổng điểm:{' '}
            <strong className="text-accent-gold font-mono">{score} điểm</strong> ({lives} mạng còn lại).
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={handleRestart} className="font-bold">
              Chinh phục vách núi mới
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Về trung tâm luyện tập
            </Button>
          </div>
        </Card>
      )}

      {isGameOver && (
        <Card className="p-8 text-center bg-gradient-to-b from-danger/10 to-surface border-danger/30 space-y-4">
          <h3 className="font-heading text-2xl font-bold text-danger">Bạn đã trượt chân!</h3>
          <p className="text-sm text-foreground-muted">
            Bạn đã dùng hết cả 3 mạng ở chặng thứ {currentStep + 1} ({activeSubjectsLabel}). Đừng bỏ cuộc, hãy leo lại nhé!
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={handleRestart} className="font-bold">
              Leo lại từ đầu
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Về trung tâm luyện tập
            </Button>
          </div>
        </Card>
      )}

      {/* Current Question Card */}
      {!isWon && !isGameOver && question && (
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className="text-xs font-semibold">
                Môn: {question.subjectName}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Chặng {currentStep + 1}
              </Badge>
            </div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground pt-2 leading-snug">
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

            {/* Answer Result & Explanation Banner */}
            {isAnswered && (
              <div className="space-y-4 pt-2 animate-fade-in">
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    selectedOption === question.correctKey
                      ? 'bg-success/10 border-success/30 text-success'
                      : 'bg-danger/10 border-danger/30 text-danger'
                  }`}
                >
                  {selectedOption === question.correctKey ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs sm:text-sm text-foreground">
                    <strong className="block font-semibold">
                      {selectedOption === question.correctKey
                        ? 'Chính xác! Bạn vừa tiến lên 1 bậc núi.'
                        : `Chưa chính xác! Bạn bị trừ 1 mạng.`}
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
                    onClick={handleNextStep}
                    className="gap-1.5 font-bold shadow-xs"
                  >
                    <span>{currentStep < questions.length - 1 ? 'Chặng tiếp theo' : 'Xem kết quả'}</span>
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
