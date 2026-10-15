import { useState } from 'react';
import { Link } from 'react-router';
import { Play, Sparkles, BookOpen, Layers, Mountain, Zap, ArrowRight, Brain, Languages, Atom, FlaskConical, Dna, Landmark, Globe2, Scale, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MatchingGame } from '../components/MatchingGame';
import { ClimbingObstacleGame } from '../components/ClimbingObstacleGame';
import { SpeedBlankGame } from '../components/SpeedBlankGame';

type ActiveGameMode = 'none' | 'matching' | 'obstacle' | 'speed_blank';

export function PracticePage() {
  const [activeGame, setActiveGame] = useState<ActiveGameMode>('none');

  if (activeGame === 'matching') {
    return <MatchingGame onBack={() => setActiveGame('none')} />;
  }

  if (activeGame === 'obstacle') {
    return <ClimbingObstacleGame onBack={() => setActiveGame('none')} />;
  }

  if (activeGame === 'speed_blank') {
    return <SpeedBlankGame onBack={() => setActiveGame('none')} />;
  }

  const classicModes = [
    {
      id: 'matching',
      title: 'Cặp Đôi Hoàn Hảo',
      badge: 'Violympic Classic',
      description: 'Lật và ghép 2 ô có kiến thức tương đương. Rèn luyện phản xạ và liên tưởng đa chiều.',
      icon: Layers,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
      action: () => setActiveGame('matching'),
    },
    {
      id: 'obstacle',
      title: 'Vượt Chướng Ngại Vật',
      badge: 'Khỉ Leo Núi',
      description: 'Chinh phục từng vách núi tri thức. Chuỗi trả lời đúng càng dài thì điểm combo càng cao.',
      icon: Mountain,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
      action: () => setActiveGame('obstacle'),
    },
    {
      id: 'speed_blank',
      title: 'Đừng Để Điểm Rơi',
      badge: 'Điền Số & Từ',
      description: 'Khởi điểm 1.000 điểm cho mỗi câu hỏi. Điểm rơi từng giây, gõ đáp án siêu tốc để giữ điểm.',
      icon: Zap,
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
      action: () => setActiveGame('speed_blank'),
    },
    {
      id: 'exams',
      title: 'Đề Thi Khảo Sát Chuẩn Hóa',
      badge: 'Thi Thử Toàn Diện',
      description: 'Bộ đề thi tổng hợp 15 - 30 phút có chấm điểm chính xác và lời giải chi tiết.',
      icon: BookOpen,
      color: 'bg-primary/10 text-primary border-primary/30',
      isLink: true,
      href: '/exams',
    },
  ];

  const subjects = [
    { name: 'Toán học', count: '120+ câu hỏi', icon: Brain, color: 'text-blue-500' },
    { name: 'Ngữ văn & Tiếng Việt', count: '90+ câu hỏi', icon: BookOpen, color: 'text-amber-500' },
    { name: 'Tiếng Anh', count: '150+ câu hỏi', icon: Languages, color: 'text-indigo-500' },
    { name: 'Vật lý', count: '85+ câu hỏi', icon: Atom, color: 'text-cyan-500' },
    { name: 'Hóa học', count: '75+ câu hỏi', icon: FlaskConical, color: 'text-emerald-500' },
    { name: 'Sinh học', count: '65+ câu hỏi', icon: Dna, color: 'text-green-500' },
    { name: 'Lịch sử', count: '80+ câu hỏi', icon: Landmark, color: 'text-orange-500' },
    { name: 'Địa lý', count: '70+ câu hỏi', icon: Globe2, color: 'text-sky-500' },
    { name: 'Kinh tế & Pháp luật', count: '55+ câu hỏi', icon: Scale, color: 'text-violet-500' },
    { name: 'Tin học & Thuật toán', count: '60+ câu hỏi', icon: Zap, color: 'text-yellow-500' },
    { name: 'Triết học & Logic', count: '50+ câu hỏi', icon: Lightbulb, color: 'text-rose-500' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-surface to-accent-gold/10 p-6 sm:p-8 border border-border">
        <div className="max-w-3xl space-y-3">
          <Badge variant="default" className="gap-1.5 py-1 px-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Mở & Miễn phí — Không cần đăng nhập</span>
          </Badge>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Trung Tâm Học & Luyện Tập Tự Do
          </h1>
          <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
            Học và ôn tập không giới hạn. Tái hiện trọn vẹn các thể thức kinh điển của Violympic xưa cùng 11 môn học liên ngành hiện đại. Chỉ khi tham gia <strong>Đấu trường Xếp hạng (Rank Arena)</strong> mới cần đăng nhập tài khoản!
          </p>
        </div>
      </div>

      {/* SECTION 1: VIOLYMPIC CLASSIC MODES */}
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            Chế độ chơi & Luyện tập kinh điển
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Chọn một thể thức để bắt đầu rèn luyện tư duy và phản xạ ngay lập tức.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classicModes.map((mode) => {
            const Icon = mode.icon;

            return (
              <Card
                key={mode.id}
                className="hover:border-primary/50 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl border ${mode.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {mode.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {mode.title}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-3">
                    {mode.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {mode.isLink && mode.href ? (
                    <Button asChild size="sm" variant="primary" className="w-full gap-1.5 font-bold">
                      <Link to={mode.href}>
                        <span>Vào phòng thi</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={mode.action}
                      className="w-full gap-1.5 font-bold shadow-xs"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Chơi ngay</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: 11 SUBJECTS BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              Kho tri thức 11 Môn học & Lĩnh vực
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted">
              Đầy đủ Toán, Ngữ văn, Tiếng Anh, Lý, Hóa, Sinh, Sử, Địa, Kinh tế - Pháp luật, Tin học và Logic.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/subjects">Xem chi tiết chủ đề</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.name}
                className="p-4 rounded-xl border border-border bg-surface hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all flex items-center gap-3 shadow-xs"
              >
                <div className="p-2 rounded-lg bg-surface-muted border border-border/60 shrink-0">
                  <Icon className={`h-5 w-5 ${sub.color}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-foreground truncate">
                    {sub.name}
                  </h4>
                  <p className="text-[11px] text-foreground-muted">{sub.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BATTLE RANK PROMO CARD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-accent-gold/20 via-surface to-primary/20 border border-accent-gold/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <Badge variant="warning" className="text-xs font-bold uppercase tracking-wider">
            Đấu Trường Xếp Hạng Realtime
          </Badge>
          <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground">
            Sẵn sàng tranh tài cùng hàng nghìn thí sinh khác?
          </h3>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-xl">
            Luyện tập đã sẵn sàng. Khi bạn muốn thi đấu tính điểm ELO, leo rank Thần Thoại và giành huy hiệu danh giá, hãy đăng nhập để bước vào <strong>Violympus Arena</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button asChild size="md" variant="primary" className="font-bold shadow-md">
            <Link to="/arena" className="gap-2">
              <Play className="h-4 w-4" />
              <span>Vào Đấu trường Rank</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
