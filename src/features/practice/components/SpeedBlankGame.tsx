import { useState, useEffect } from 'react';
import { Zap, Trophy, ArrowRight, ArrowLeft, CheckCircle2, XCircle, RotateCcw, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getBlankQuestionsForSubjects, SUBJECT_METAS, type BlankQuestion } from '../data/practiceBank';

interface SpeedBlankGameProps {
  selectedSubjectSlugs: string[];
  onBack: () => void;
  onChangeSubjects?: () => void;
}

export function SpeedBlankGame({ selectedSubjectSlugs, onBack, onChangeSubjects }: SpeedBlankGameProps) {
  const [questions, setQuestions] = useState<BlankQuestion[]>(() =>
    getBlankQuestionsForSubjects(selectedSubjectSlugs, 6)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [currentPoints, setCurrentPoints] = useState(1000);
  const [totalScore, setTotalScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleRestart = () => {
    const fresh = getBlankQuestionsForSubjects(selectedSubjectSlugs, 6);
    setQuestions(fresh);
    setCurrentIdx(0);
    setUserInput('');
    setCurrentPoints(1000);
    setTotalScore(0);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsFinished(false);
  };

  const question = questions[currentIdx];

  // Point decay ticker
  useEffect(() => {
    if (isAnswered || isFinished || !question) return;

    const interval = setInterval(() => {
      setCurrentPoints((p) => Math.max(100, p - 20));
    }, 500);

    return () => clearInterval(interval);
  }, [isAnswered, isFinished, question]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswered || !userInput.trim() || !question) return;

    setIsAnswered(true);
    const correct =
      userInput.trim().toLowerCase() === question.expectedAnswer.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setTotalScore((s) => s + currentPoints);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setUserInput('');
      setCurrentPoints(1000);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
    }
  };

  const activeSubjectsLabel = selectedSubjectSlugs.length === 0
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
            <Badge variant="danger" className="text-xs">
              Violympic Classic
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
              <BookOpen className="h-3 w-3 mr-1" />
              Lĩnh vực: {activeSubjectsLabel}
            </Badge>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-foreground">
              Đừng Để Điểm Rơi (Speed Fill-in)
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            Khởi điểm 1.000 điểm mỗi câu. Điểm rơi từng giây, gõ đáp án siêu tốc từ lĩnh vực bạn đã chọn!
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Total Score */}
          <div className="flex items-center gap-1.5 font-mono font-bold text-accent-gold text-base">
            <Trophy className="h-4 w-4" />
            <span>{totalScore} đ</span>
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
            Chưa có câu hỏi điền từ cho lĩnh vực đã chọn
          </h3>
          <p className="text-xs text-foreground-muted max-w-md mx-auto">
            Vui lòng chọn thêm các môn học khác để trải nghiệm chế độ Đừng để điểm rơi.
          </p>
          {onChangeSubjects && (
            <Button variant="outline" size="sm" onClick={onChangeSubjects}>
              Chọn lại lĩnh vực
            </Button>
          )}
        </Card>
      )}

      {/* Finished Summary Card */}
      {isFinished && (
        <Card className="p-8 text-center bg-gradient-to-b from-primary/10 to-surface border-primary/30 space-y-4">
          <h3 className="font-heading text-2xl font-bold text-foreground">Hoàn Thành Xuất Sắc!</h3>
          <p className="text-sm text-foreground-muted">
            Lĩnh vực: <strong>{activeSubjectsLabel}</strong> • Tổng điểm giữ lại được:{' '}
            <strong className="text-accent-gold font-mono text-xl">{totalScore} điểm</strong>.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={handleRestart} className="font-bold">
              Chơi lại thử thách mới
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Về trung tâm luyện tập
            </Button>
          </div>
        </Card>
      )}

      {/* Question Card */}
      {!isFinished && question && (
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-semibold">
                  Môn: {question.subjectName}
                </Badge>
                <span className="text-xs text-foreground-muted font-semibold">
                  Câu hỏi {currentIdx + 1} / {questions.length}
                </span>
              </div>

              {/* Falling points counter */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-danger/10 border border-danger/30 text-danger font-mono font-bold text-sm animate-pulse">
                <Zap className="h-4 w-4" />
                <span>{currentPoints} đ</span>
              </div>
            </div>

            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground pt-3 leading-snug">
              {question.prompt}
            </h3>
            {question.hint && (
              <p className="text-xs text-foreground-muted italic pt-1">
                Gợi ý: {question.hint}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  disabled={isAnswered}
                  autoFocus
                  placeholder="Nhập đáp án của bạn..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="font-mono text-base"
                />
                <Button
                  type="submit"
                  disabled={isAnswered || !userInput.trim()}
                  variant="primary"
                  className="shrink-0 font-bold"
                >
                  Xác nhận
                </Button>
              </div>
            </form>

            {/* Answer Result Banner */}
            {isAnswered && (
              <div className="space-y-4 pt-2 animate-fade-in">
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    isCorrect
                      ? 'bg-success/10 border-success/30 text-success'
                      : 'bg-danger/10 border-danger/30 text-danger'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs sm:text-sm text-foreground">
                    <strong className="block font-semibold">
                      {isCorrect
                        ? `Chính xác! Bạn giữ lại được +${currentPoints} điểm.`
                        : `Chưa chính xác! Đáp án đúng là: "${question.expectedAnswer}".`}
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
                    onClick={handleNext}
                    className="gap-1.5 font-bold shadow-xs"
                  >
                    <span>{currentIdx < questions.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết'}</span>
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
