import { Link } from 'react-router';
import { Trophy, CheckCircle, XCircle, ArrowRight, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/providers';
import type { ExamGradingResult, ExamQuestion } from '../services/examService';

interface ExamResultViewProps {
  result: ExamGradingResult;
  questions: ExamQuestion[];
  onRetake: () => void;
}

export function ExamResultView({ result, questions, onRetake }: ExamResultViewProps) {
  const { isAuthenticated } = useAuth();
  const percentage = Math.round((result.score / (result.totalPoints || 100)) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* 1. HERO RESULT CARD */}
      <Card className="border-border shadow-sm overflow-hidden bg-gradient-to-b from-surface to-surface-muted/30">
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
            <Trophy className="h-10 w-10" />
          </div>

          <div className="space-y-1">
            <Badge variant={result.isPassed ? 'success' : 'danger'} className="text-xs font-bold uppercase tracking-wider">
              {result.isPassed ? 'ĐẠT TIÊU CHUẨN' : 'CHƯA ĐẠT MỤC TIÊU'}
            </Badge>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {result.title}
            </h1>
            <p className="text-xs sm:text-sm text-foreground-muted">
              Điểm đạt yêu cầu: {result.passingScore} / {result.totalPoints} điểm
            </p>
          </div>

          <div className="py-4 flex items-center justify-center gap-6 sm:gap-12">
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold font-heading text-primary">
                {result.score}
                <span className="text-lg sm:text-xl font-normal text-foreground-muted">/{result.totalPoints}</span>
              </div>
              <div className="text-xs font-semibold text-foreground-muted mt-1 uppercase">Tổng điểm</div>
            </div>

            <div className="h-12 w-px bg-border" />

            <div>
              <div className="text-4xl sm:text-5xl font-extrabold font-heading text-foreground">
                {percentage}%
              </div>
              <div className="text-xs font-semibold text-foreground-muted mt-1 uppercase">Tỉ lệ chính xác</div>
            </div>

            <div className="h-12 w-px bg-border" />

            <div>
              <div className="text-4xl sm:text-5xl font-extrabold font-heading text-success">
                {result.correctCount}
                <span className="text-lg sm:text-xl font-normal text-foreground-muted">/{result.totalQuestions}</span>
              </div>
              <div className="text-xs font-semibold text-foreground-muted mt-1 uppercase">Số câu đúng</div>
            </div>
          </div>

          {/* Guest Account Callout */}
          {!isAuthenticated && (
            <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="text-foreground font-semibold">
                    Bạn vừa hoàn thành bài thi ở chế độ Khách (Guest)!
                  </strong>
                  <p className="text-foreground-muted">
                    Đăng nhập hoặc tạo tài khoản miễn phí để tích lũy +{result.score} XP vào tài khoản và ghi danh trên Bảng Xếp Hạng.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button asChild size="sm" variant="primary" className="font-bold">
                  <Link to="/register">Đăng ký lưu XP</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/login">Đăng nhập</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={onRetake} className="gap-1.5 font-bold">
              <RotateCcw className="h-4 w-4" />
              <span>Thi lại đề này</span>
            </Button>
            <Button asChild size="sm" variant="primary" className="gap-1.5 font-bold">
              <Link to="/exams">
                <span>Chọn đề thi khác</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="gap-1.5 font-bold">
              <Link to="/practice">
                <BookOpen className="h-4 w-4" />
                <span>Trung tâm luyện tập</span>
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. QUESTION-BY-QUESTION REVIEW */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
          <span>Phân tích chi tiết câu hỏi & Lời giải</span>
          <Badge variant="outline" className="text-xs">
            {result.totalQuestions} câu
          </Badge>
        </h2>

        <div className="space-y-4">
          {result.results.map((r, index) => {
            const questionData = questions.find((q) => q.id === r.questionId);
            return (
              <Card
                key={r.questionId}
                className={`border transition-all ${
                  r.isCorrect
                    ? 'border-success/30 bg-success/5'
                    : 'border-danger/30 bg-danger/5'
                }`}
              >
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {r.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-success shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-danger shrink-0" />
                    )}
                    <CardTitle className="text-sm sm:text-base font-bold">
                      Câu {index + 1}: {questionData?.prompt || 'Nội dung câu hỏi'}
                    </CardTitle>
                  </div>
                  <Badge variant={r.isCorrect ? 'success' : 'danger'} className="text-[10px] shrink-0 font-mono">
                    +{r.pointsAwarded} / {r.maxPoints} đ
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-surface rounded-xl border border-border/60">
                    <div>
                      <span className="text-foreground-muted block mb-0.5">Câu trả lời của bạn:</span>
                      <span className={`font-semibold ${r.isCorrect ? 'text-success' : 'text-danger'}`}>
                        {formatAnswer(r.userAnswer)}
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground-muted block mb-0.5">Đáp án chính xác:</span>
                      <span className="font-semibold text-foreground">
                        {formatAnswer(r.officialAnswer)}
                      </span>
                    </div>
                  </div>

                  {/* Explanation */}
                  {r.explanation && (
                    <div className="p-3 rounded-xl bg-surface-muted/60 border border-border/40 text-foreground-muted text-xs">
                      <strong className="text-foreground font-semibold block mb-1">
                        💡 Giải thích chi tiết:
                      </strong>
                      <p className="leading-relaxed">{r.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatAnswer(val: unknown): string {
  if (val === null || val === undefined || val === '') {
    return '(Chưa trả lời)';
  }
  if (typeof val === 'object') {
    return JSON.stringify(val);
  }
  return String(val);
}
