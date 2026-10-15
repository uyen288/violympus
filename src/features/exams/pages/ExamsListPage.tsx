import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Clock, HelpCircle, Trophy, ArrowRight, BookOpen, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { examService } from '../services/examService';

export function ExamsListPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['public-exams', selectedSubject],
    queryFn: () => examService.getPublishedExams(),
    staleTime: 60 * 1000,
  });

  const subjects = [
    { key: 'all', name: 'Tất cả lĩnh vực' },
    { key: 'toan-hoc', name: 'Toán học' },
    { key: 'ngu-van', name: 'Ngữ văn' },
    { key: 'tieng-anh', name: 'Tiếng Anh' },
    { key: 'lich-su', name: 'Lịch sử & Địa lý' },
  ];

  const filteredExams = exams?.filter((e) => {
    if (selectedSubject === 'all') return true;
    return e.subjectSlug === selectedSubject;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-surface to-accent-gold/10 p-6 sm:p-8 border border-border">
        <div className="max-w-2xl space-y-3">
          <Badge variant="default" className="gap-1.5 py-1 px-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tự do & Miễn phí — Không cần đăng nhập</span>
          </Badge>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Khảo sát Năng lực & Thi thử Violympus
          </h1>
          <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
            Hệ thống đề thi chuẩn hóa đa dạng thể loại câu hỏi: trắc nghiệm, điền số tự luận ngắn và ghép cặp. Thử sức và nhận phân tích lời giải chi tiết ngay sau khi nộp bài.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="h-4 w-4 text-foreground-muted shrink-0 mr-1" />
        {subjects.map((sub) => (
          <button
            key={sub.key}
            type="button"
            onClick={() => setSelectedSubject(sub.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSubject === sub.key
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface border border-border text-foreground-muted hover:text-foreground'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner text="Đang tải danh sách đề thi..." />
        </div>
      ) : error ? (
        <div className="text-center py-12 space-y-3">
          <p className="text-sm text-danger">Có lỗi khi tải danh mục đề thi.</p>
        </div>
      ) : filteredExams && filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam) => (
            <Card
              key={exam.id}
              className="group hover:border-primary/50 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[11px] font-semibold">
                    {exam.subjectName}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs font-semibold text-accent-gold">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>{exam.totalPoints} điểm</span>
                  </span>
                </div>
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {exam.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm line-clamp-2">
                  {exam.description || 'Bài thi khảo sát kiến thức toàn diện có bấm giờ và giải thích sau bài thi.'}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2 space-y-4">
                <div className="flex items-center gap-4 text-xs text-foreground-muted border-t border-border/60 pt-3">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{Math.round(exam.timeLimitSeconds / 60)} phút</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" />
                    <span>{exam.questionCount || 5} câu hỏi</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-success" />
                    <span>Đạt: {exam.passingScore}đ</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-foreground-muted italic">
                    Chế độ tự do · Khách vào làm ngay
                  </span>
                  <Button asChild size="sm" className="gap-1.5 font-bold">
                    <Link to={`/exams/${exam.id}`}>
                      <span>Làm bài thi</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface rounded-2xl border border-dashed border-border p-8 space-y-3">
          <BookOpen className="h-10 w-10 mx-auto text-foreground-muted" />
          <h3 className="font-heading font-bold text-base text-foreground">Chưa có đề thi trong mục này</h3>
          <p className="text-xs text-foreground-muted">Vui lòng chọn lĩnh vực khác để tiếp tục ôn luyện.</p>
        </div>
      )}
    </div>
  );
}
