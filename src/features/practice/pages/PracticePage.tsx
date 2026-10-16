import { useState } from 'react';
import { Link } from 'react-router';
import {
  Play,
  Sparkles,
  BookOpen,
  Layers,
  Mountain,
  Zap,
  ArrowRight,
  Flame,
  Crown,
  CheckSquare,
  Swords,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MatchingGame } from '../components/MatchingGame';
import { ClimbingObstacleGame } from '../components/ClimbingObstacleGame';
import { SpeedBlankGame } from '../components/SpeedBlankGame';
import { ZodiacGame } from '../components/ZodiacGame';
import { LightningTrueFalseGame } from '../components/LightningTrueFalseGame';
import { SurvivalRushGame } from '../components/SurvivalRushGame';
import { MultiSelectMasterGame } from '../components/MultiSelectMasterGame';
import { SubjectFilterSelector } from '../components/SubjectFilterSelector';
import { SUBJECT_METAS } from '../data/practiceBank';

type ActiveGameMode =
  | 'none'
  | 'matching'
  | 'obstacle'
  | 'speed_blank'
  | 'zodiac'
  | 'lightning'
  | 'survival'
  | 'multi_select';

export function PracticePage() {
  const [activeGame, setActiveGame] = useState<ActiveGameMode>('none');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(() =>
    SUBJECT_METAS.map((s) => s.slug)
  );

  // If a game is active, render its screen
  if (activeGame === 'matching') {
    return (
      <MatchingGame
        key={selectedSubjects.join(',')}
        selectedSubjectSlugs={selectedSubjects}
        onBack={() => setActiveGame('none')}
        onChangeSubjects={() => setActiveGame('none')}
      />
    );
  }

  if (activeGame === 'obstacle') {
    return (
      <ClimbingObstacleGame
        key={selectedSubjects.join(',')}
        selectedSubjectSlugs={selectedSubjects}
        onBack={() => setActiveGame('none')}
        onChangeSubjects={() => setActiveGame('none')}
      />
    );
  }

  if (activeGame === 'speed_blank') {
    return (
      <SpeedBlankGame
        key={selectedSubjects.join(',')}
        selectedSubjectSlugs={selectedSubjects}
        onBack={() => setActiveGame('none')}
        onChangeSubjects={() => setActiveGame('none')}
      />
    );
  }

  if (activeGame === 'zodiac') {
    return (
      <ZodiacGame
        key={selectedSubjects.join(',')}
        selectedSubjectSlugs={selectedSubjects}
        onBack={() => setActiveGame('none')}
        onChangeSubjects={() => setActiveGame('none')}
      />
    );
  }

  if (activeGame === 'lightning') {
    return (
      <LightningTrueFalseGame
        key={selectedSubjects.join(',')}
        selectedSubjectSlugs={selectedSubjects}
        onBack={() => setActiveGame('none')}
        onChangeSubjects={() => setActiveGame('none')}
      />
    );
  }

  if (activeGame === 'survival') {
    return (
      <SurvivalRushGame
        key={selectedSubjects.join(',')}
        selectedSubjectSlugs={selectedSubjects}
        onBack={() => setActiveGame('none')}
        onChangeSubjects={() => setActiveGame('none')}
      />
    );
  }

  if (activeGame === 'multi_select') {
    return (
      <MultiSelectMasterGame
        key={selectedSubjects.join(',')}
        selectedSubjectSlugs={selectedSubjects}
        onBack={() => setActiveGame('none')}
        onChangeSubjects={() => setActiveGame('none')}
      />
    );
  }

  // Expanded Game Modes List (Classic Violympic + New Academic Arenas)
  const gameModes = [
    {
      id: 'zodiac',
      title: 'Đấu Trường 12 Con Giáp',
      badge: 'Violympic Huyền Thoại',
      badgeVariant: 'gold' as const,
      description: 'Linh thú 12 con giáp canh giữ 12 câu hỏi bí mật. Thu phục trọn vẹn 12 linh thú để giành vương miện.',
      icon: Crown,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
      action: () => setActiveGame('zodiac'),
    },
    {
      id: 'matching',
      title: 'Cặp Đôi Hoàn Hảo',
      badge: 'Lật Ô Ghép Cặp',
      badgeVariant: 'default' as const,
      description: 'Lật và ghép 2 ô có kiến thức tương đương. Rèn luyện phản xạ và liên tưởng đa chiều.',
      icon: Layers,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
      action: () => setActiveGame('matching'),
    },
    {
      id: 'obstacle',
      title: 'Vượt Chướng Ngại Vật',
      badge: 'Khỉ Leo Núi',
      badgeVariant: 'warning' as const,
      description: 'Chinh phục từng vách núi tri thức. Chuỗi trả lời đúng càng dài thì điểm combo nhân cấp càng cao.',
      icon: Mountain,
      color: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
      action: () => setActiveGame('obstacle'),
    },
    {
      id: 'speed_blank',
      title: 'Đừng Để Điểm Rơi',
      badge: 'Điền Số & Từ',
      badgeVariant: 'danger' as const,
      description: 'Khởi điểm 1.000 điểm cho mỗi câu hỏi. Điểm rơi từng giây, gõ đáp án siêu tốc để giữ điểm.',
      icon: Zap,
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
      action: () => setActiveGame('speed_blank'),
    },
    {
      id: 'lightning',
      title: 'Tia Chớp Đúng / Sai',
      badge: 'Phản Xạ 7 Giây',
      badgeVariant: 'danger' as const,
      description: 'Đồng hồ đếm ngược gấp rút! Nhận định chớp nhoáng khẳng định kiến thức Đúng hay Sai.',
      icon: Timer,
      color: 'bg-red-500/10 text-red-600 border-red-500/30',
      action: () => setActiveGame('lightning'),
    },
    {
      id: 'survival',
      title: 'Cơn Lốc Sinh Tồn',
      badge: 'Đua Thời Gian',
      badgeVariant: 'warning' as const,
      description: 'Bắt đầu với 60s. Mỗi câu đúng +5s, câu sai bị phạt -10s. Thử thách sinh tồn lâu nhất có thể!',
      icon: Flame,
      color: 'bg-amber-600/10 text-amber-600 border-amber-600/30',
      action: () => setActiveGame('survival'),
    },
    {
      id: 'multi_select',
      title: 'Đấu Trí Đa Lựa Chọn',
      badge: 'Nhiều Đáp Án Đúng',
      badgeVariant: 'default' as const,
      description: 'Câu hỏi phức hợp có thể có từ 1 đến nhiều đáp án đúng. Chọn đầy đủ phương án chính xác.',
      icon: CheckSquare,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
      action: () => setActiveGame('multi_select'),
    },
    {
      id: 'exams',
      title: 'Đề Thi Khảo Sát Chuẩn Hóa',
      badge: 'Thi Thử Toàn Diện',
      badgeVariant: 'secondary' as const,
      description: 'Bộ đề thi tổng hợp 15 - 30 phút có chấm điểm chuẩn xác server và phân tích lời giải chi tiết.',
      icon: BookOpen,
      color: 'bg-primary/10 text-primary border-primary/30',
      isLink: true,
      href: '/exams',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-surface to-accent-gold/10 p-6 sm:p-8 border border-border">
        <div className="max-w-3xl space-y-3">
          <Badge variant="default" className="gap-1.5 py-1 px-3">
            <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
            <span>Mở & Miễn phí — Không cần đăng nhập</span>
          </Badge>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Trung Tâm Học & Luyện Tập Tự Do
          </h1>
          <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
            Học và ôn tập không giới hạn. Tái hiện trọn vẹn các thể thức kinh điển của Violympic (12 Con Giáp, Cặp Đôi Hoàn Hảo, Khỉ Leo Núi, Đừng Để Điểm Rơi) cùng các chế độ phản xạ hiện đại.
          </p>
        </div>
      </div>

      {/* SECTION 1: TOPIC / SUBJECT MULTI-SELECT SELECTOR */}
      <SubjectFilterSelector
        selectedSlugs={selectedSubjects}
        onChange={(slugs) => setSelectedSubjects(slugs)}
      />

      {/* SECTION 2: GAME MODES SHOWCASE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              Các chế độ chơi & Đấu trường rèn luyện
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted">
              {selectedSubjects.length === 0
                ? 'Đang lấy câu hỏi ngẫu nhiên. Vui lòng chọn lĩnh vực ở trên để lọc chính xác!'
                : `Các câu hỏi trong game sẽ CHỈ lấy từ ${selectedSubjects.length} môn bạn đã chọn ở trên.`}
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex text-xs font-semibold">
            {gameModes.length} Thể thức thi đấu
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gameModes.map((mode) => {
            const Icon = mode.icon;

            return (
              <Card
                key={mode.id}
                className="hover:border-primary/50 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${mode.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={mode.badgeVariant} className="text-[10px] font-semibold">
                      {mode.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {mode.title}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-3 leading-relaxed">
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

      {/* SECTION 3: 11 SUBJECTS BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              Kho tri thức 11 Môn học & Lĩnh vực
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted">
              Nhấp vào một môn để nhanh chóng chỉ luyện tập duy nhất môn đó!
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/subjects">Xem chi tiết chủ đề</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {SUBJECT_METAS.map((sub) => {
            const Icon = sub.icon;
            const isCurrentlyChosen = selectedSubjects.includes(sub.slug);

            return (
              <div
                key={sub.slug}
                onClick={() => setSelectedSubjects([sub.slug])}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer shadow-xs ${
                  isCurrentlyChosen && selectedSubjects.length === 1
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                    : 'border-border bg-surface hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-surface-muted border border-border/60 shrink-0">
                    <Icon className={`h-5 w-5 ${sub.color}`} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-foreground truncate">
                      {sub.name}
                    </h4>
                    <p className="text-[11px] text-foreground-muted">
                      {isCurrentlyChosen && selectedSubjects.length === 1
                        ? '★ Đang chọn duy nhất'
                        : 'Bấm để chỉ luyện môn này'}
                    </p>
                  </div>
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
          <p className="text-xs text-sm text-foreground-muted max-w-xl">
            Luyện tập đã sẵn sàng. Khi bạn muốn thi đấu tính điểm ELO, leo rank Thần Thoại và giành huy hiệu danh giá, hãy đăng nhập để bước vào <strong>Violympus Arena</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button asChild size="md" variant="primary" className="font-bold shadow-md">
            <Link to="/arena" className="gap-2">
              <Swords className="h-4 w-4" />
              <span>Vào Đấu trường Rank</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
