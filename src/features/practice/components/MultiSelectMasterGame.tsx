import { useState } from 'react';
import {
  CheckSquare,
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BookOpen,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  getMultiSelectQuestionsForSubjects,
  SUBJECT_METAS,
  type MultiSelectQuestion,
} from '../data/practiceBank';

interface MultiSelectMasterGameProps {
  selectedSubjectSlugs: string[];
  onBack: () => void;
  onChangeSubjects?: () => void;
}

export function MultiSelectMasterGame({
  selectedSubjectSlugs,
  onBack,
  onChangeSubjects,
}: MultiSelectMasterGameProps) {
  const [questions, setQuestions] = useState<MultiSelectQuestion[]>(() =>
    getMultiSelectQuestionsForSubjects(selectedSubjectSlugs, 6)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFullyCorrect, setIsFullyCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleRestart = () => {
    const fresh = getMultiSelectQuestionsForSubjects(selectedSubjectSlugs, 6);
    setQuestions(fresh);
    setCurrentIndex(0);
    setSelectedKeys([]);
    setIsAnswered(false);
    setIsFullyCorrect(false);
    setScore(0);
    setIsFinished(false);
  };

  const question = questions[currentIndex];

  const handleToggleOption = (key: string) => {
    if (isAnswered) return;
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmitAnswer = () => {
    if (isAnswered || selectedKeys.length === 0 || !question) return;

    setIsAnswered(true);

    // Check if sorted arrays are identical
    const sortedSelected = [...selectedKeys].sort();
    const sortedCorrect = [...question.correctKeys].sort();
    const isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((val, idx) => val === sortedCorrect[idx]);

    setIsFullyCorrect(isCorrect);
    if (isCorrect) {
      setScore((s) => s + 150);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedKeys([]);
      setIsAnswered(false);
      setIsFullyCorrect(false);
    } else {
      setIsFinished(true);
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
            <Badge variant="default" className="text-xs font-bold gap-1 bg-indigo-600 text-white">
              <CheckSquare className="h-3 w-3" />
              Nhiều Đáp Án Đúng
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
              <BookOpen className="h-3 w-3 mr-1" />
              Lĩnh vực: {activeSubjectsLabel}
            </Badge>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-foreground">
              Đấu Trí Đa Lựa Chọn (Multi-Answer Master)
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            Câu hỏi có thể có từ 1 đến nhiều đáp án đúng. Chọn tất cả các phương án chính xác để nhận trọn điểm!
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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
            Chưa có câu hỏi chọn nhiều đáp án cho lĩnh vực đã chọn
          </h3>
          <p className="text-xs text-foreground-muted max-w-md mx-auto">
            Vui lòng chọn thêm các môn học khác để trải nghiệm chế độ Đấu trí đa lựa chọn.
          </p>
          {onChangeSubjects && (
            <Button variant="outline" size="sm" onClick={onChangeSubjects}>
              Chọn lại lĩnh vực
            </Button>
          )}
        </Card>
      )}

      {/* Victory / Summary Overlays */}
      {isFinished && (
        <Card className="p-8 text-center bg-gradient-to-b from-primary/10 via-surface to-accent-gold/10 border-primary/30 shadow-md space-y-4 animate-fade-in">
          <div className="inline-flex p-3 rounded-full bg-accent-gold/20 text-accent-gold">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Hoàn Thành Thử Thách Đa Lựa Chọn!
          </h3>
          <p className="text-sm text-foreground-muted">
            Lĩnh vực: <strong>{activeSubjectsLabel}</strong> • Tổng điểm xuất sắc:{' '}
            <strong className="text-accent-gold font-mono text-xl">{score} điểm</strong>.
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
                  Câu hỏi {currentIndex + 1} / {questions.length}
                </span>
              </div>
              <Badge variant="secondary" className="text-[11px] font-semibold text-primary">
                Được chọn nhiều đáp án
              </Badge>
            </div>

            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground pt-3 leading-snug">
              {question.prompt}
            </h3>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const isChecked = selectedKeys.includes(opt.key);
                const isTargetCorrect = question.correctKeys.includes(opt.key);

                let btnStyle = 'border-border bg-surface hover:bg-slate-50 text-foreground';
                if (isAnswered) {
                  if (isTargetCorrect) {
                    btnStyle =
                      'border-success bg-success/15 text-success font-bold ring-2 ring-success/30';
                  } else if (isChecked && !isTargetCorrect) {
                    btnStyle =
                      'border-danger bg-danger/15 text-danger font-bold ring-2 ring-danger/30';
                  } else {
                    btnStyle = 'border-border bg-surface opacity-50 text-foreground-muted';
                  }
                } else if (isChecked) {
                  btnStyle =
                    'border-primary bg-primary/10 text-foreground font-semibold ring-2 ring-primary/20';
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleToggleOption(opt.key)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${btnStyle} ${
                      !isAnswered ? 'cursor-pointer hover:border-primary/50' : 'cursor-default'
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-md border font-mono text-xs font-bold shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-primary border-primary text-white'
                          : 'border-border bg-slate-100 dark:bg-slate-800 text-foreground-muted'
                      }`}
                    >
                      {isChecked ? <Check className="h-3.5 w-3.5" /> : opt.key}
                    </div>
                    <span className="text-sm font-medium">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit Action when not yet answered */}
            {!isAnswered && (
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-foreground-muted">
                  Đã chọn: <strong>{selectedKeys.length}</strong> đáp án
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={selectedKeys.length === 0}
                  onClick={handleSubmitAnswer}
                  className="font-bold shadow-xs px-5"
                >
                  Xác nhận nộp câu này
                </Button>
              </div>
            )}

            {/* Answer Result & Explanation */}
            {isAnswered && (
              <div className="space-y-4 pt-2 animate-fade-in">
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    isFullyCorrect
                      ? 'bg-success/10 border-success/30 text-success'
                      : 'bg-danger/10 border-danger/30 text-danger'
                  }`}
                >
                  {isFullyCorrect ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs sm:text-sm text-foreground">
                    <strong className="block font-semibold">
                      {isFullyCorrect
                        ? 'Hoàn toàn chính xác! (+150 điểm)'
                        : `Chưa chính xác! Các đáp án đúng là: [${question.correctKeys.join(', ')}].`}
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
