import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Clock, Send, ChevronLeft, ChevronRight, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { examService, type ExamGradingResult } from '../services/examService';
import { QuestionCard } from '../components/QuestionCard';
import { ExamResultView } from '../components/ExamResultView';

export function ExamTakePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ExamGradingResult | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data: exam, isLoading, error } = useQuery({
    queryKey: ['exam-take', id],
    queryFn: () => examService.getExamDetails(id || ''),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

  // Handle final submission
  const handleSubmitExam = useCallback(async () => {
    if (!id || isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const gradingResult = await examService.gradeGuestExam(id, answers);
      setResult(gradingResult);
    } catch {
      // Local fallback in case of network issue
      const fallback = await examService.gradeGuestExam(id, answers);
      setResult(fallback);
    } finally {
      setIsSubmitting(false);
    }
  }, [id, answers, isSubmitting]);

  // Countdown timer based on target deadline
  useEffect(() => {
    if (!exam || result !== null) return;

    const endTime = Date.now() + exam.timeLimitSeconds * 1000;

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        void handleSubmitExam();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, result, handleSubmitExam]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Đang chuẩn bị đề thi & phòng thi an toàn..." />
      </div>
    );
  }

  if (error || !exam || !exam.questions || exam.questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-6 bg-surface rounded-2xl border border-border">
        <AlertCircle className="h-10 w-10 text-danger mx-auto" />
        <h2 className="font-heading font-bold text-lg text-foreground">Không tìm thấy đề thi</h2>
        <p className="text-xs text-foreground-muted">Đề thi có thể đã bị gỡ hoặc đường dẫn không hợp lệ.</p>
        <Button variant="primary" size="sm" onClick={() => navigate('/exams')}>
          Quay lại danh sách đề thi
        </Button>
      </div>
    );
  }

  // If already graded, display results screen
  if (result) {
    return (
      <ExamResultView
        result={result}
        questions={exam.questions}
        onRetake={() => {
          setAnswers({});
          setCurrentIndex(0);
          setTimeLeft(exam.timeLimitSeconds);
          setResult(null);
        }}
      />
    );
  }

  const currentQuestion = exam.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = timeLeft !== null && timeLeft <= 120; // less than 2 minutes

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (val: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Session Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        <div>
          <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground">
            {exam.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-foreground-muted mt-1">
            <span>Tiến độ: <strong>{answeredCount}</strong> / {exam.questions.length} câu đã trả lời</span>
            <span>·</span>
            <span>Chế độ tự do (Khách)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Timer Badge */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
              isTimeCritical
                ? 'bg-danger/10 border-danger text-danger animate-pulse'
                : 'bg-surface-muted border-border text-foreground'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{timeLeft !== null ? formatTimer(timeLeft) : '--:--'}</span>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowConfirmModal(true)}
            className="gap-1.5 font-bold shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Nộp bài</span>
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Question Area (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-border shadow-xs">
            <CardContent className="p-6">
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={exam.questions.length}
                value={answers[currentQuestion.id]}
                onChange={handleAnswerChange}
              />
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="gap-1 font-semibold"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Câu trước</span>
            </Button>

            {currentIndex < exam.questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="gap-1 font-semibold"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowConfirmModal(true)}
                className="gap-1 font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <span>Hoàn tất & Nộp bài</span>
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Palette Sidebar (1 Col) */}
        <div className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-primary" />
                  <span>Mục lục câu hỏi</span>
                </span>
                <span className="font-mono text-foreground-muted">{answeredCount}/{exam.questions.length}</span>
              </div>

              {/* Grid of numbers */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {exam.questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg font-mono text-xs font-bold transition-all ${
                        isCurrent
                          ? 'border-2 border-primary bg-primary/10 text-primary shadow-xs'
                          : isAnswered
                          ? 'bg-success/15 border border-success/40 text-success'
                          : 'bg-surface border border-border text-foreground-muted hover:border-foreground-muted'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-border/60 text-[11px] text-foreground-muted space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-success/20 border border-success/40" />
                  <span>Đã trả lời</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border-2 border-primary bg-primary/10" />
                  <span>Đang xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border border-border bg-surface" />
                  <span>Chưa trả lời</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 border border-border shadow-xl space-y-4">
            <h3 className="font-heading font-bold text-lg text-foreground">
              Xác nhận nộp bài thi
            </h3>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              Bạn đã hoàn thành <strong>{answeredCount}</strong> / {exam.questions.length} câu hỏi.
              {answeredCount < exam.questions.length && (
                <span className="block text-amber-600 dark:text-amber-400 font-semibold mt-1">
                  ⚠️ Còn {exam.questions.length - answeredCount} câu bạn chưa trả lời!
                </span>
              )}
              Bạn có chắc chắn muốn nộp bài để xem điểm và phân tích đáp án chi tiết?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                Tiếp tục làm bài
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitExam}
                isLoading={isSubmitting}
                className="font-bold gap-1.5"
              >
                <span>Nộp bài ngay</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
