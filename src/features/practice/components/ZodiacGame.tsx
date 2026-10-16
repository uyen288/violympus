import { useState } from 'react';
import {
  Trophy,
  Heart,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BookOpen,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  ZODIAC_ANIMALS,
  getPracticeQuestionsForSubjects,
  SUBJECT_METAS,
  type ZodiacAnimal,
  type PracticeQuestion,
} from '../data/practiceBank';

interface ZodiacGameProps {
  selectedSubjectSlugs: string[];
  onBack: () => void;
  onChangeSubjects?: () => void;
}

interface ZodiacChallengeState {
  animal: ZodiacAnimal;
  question: PracticeQuestion;
  isConquered: boolean;
  attempts: number;
}

export function ZodiacGame({ selectedSubjectSlugs, onBack, onChangeSubjects }: ZodiacGameProps) {
  const [challenges, setChallenges] = useState<ZodiacChallengeState[]>([]);
  const [activeAnimalId, setActiveAnimalId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const initZodiacGame = () => {
    const questions = getPracticeQuestionsForSubjects(selectedSubjectSlugs, 12);
    // If fewer than 12 questions in selected subjects, cycle through them
    const mapped: ZodiacChallengeState[] = ZODIAC_ANIMALS.map((animal, idx) => {
      const q = questions.length > 0 ? questions[idx % questions.length] : null;
      return {
        animal,
        question: q || {
          id: `fallback-${animal.id}`,
          subjectSlug: 'toan-hoc',
          subjectName: 'Toán học',
          prompt: `Thử thách trí tuệ linh thú ${animal.vietnameseName}: 15 × 12 bằng bao nhiêu?`,
          options: [
            { key: 'A', text: '160' },
            { key: 'B', text: '180' },
            { key: 'C', text: '190' },
            { key: 'D', text: '200' },
          ],
          correctKey: 'B',
          explanation: '15 × 12 = 180.',
        },
        isConquered: false,
        attempts: 0,
      };
    });

    setChallenges(mapped);
    setActiveAnimalId(null);
    setSelectedOption(null);
    setIsAnswered(false);
    setLives(3);
    setScore(0);
    setIsGameOver(false);
  };

  const activeChallenge = challenges.find((c) => c.animal.id === activeAnimalId);
  const conqueredCount = challenges.filter((c) => c.isConquered).length;
  const isWon = conqueredCount === 12;

  const handleSelectAnimal = (animalId: string) => {
    if (isGameOver || isWon) return;
    const ch = challenges.find((c) => c.animal.id === animalId);
    if (!ch || ch.isConquered) return;

    setActiveAnimalId(animalId);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleSelectOption = (key: string) => {
    if (isAnswered || !activeChallenge) return;

    setSelectedOption(key);
    setIsAnswered(true);

    const isCorrect = key === activeChallenge.question.correctKey;
    if (isCorrect) {
      setScore((s) => s + 100);
      setChallenges((prev) =>
        prev.map((c) =>
          c.animal.id === activeAnimalId
            ? { ...c, isConquered: true, attempts: c.attempts + 1 }
            : c
        )
      );
    } else {
      setChallenges((prev) =>
        prev.map((c) =>
          c.animal.id === activeAnimalId ? { ...c, attempts: c.attempts + 1 } : c
        )
      );
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setIsGameOver(true);
        }
        return next;
      });
    }
  };

  const handleCloseChallengeModal = () => {
    setActiveAnimalId(null);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const activeSubjectsLabel =
    selectedSubjectSlugs.length === 0
      ? 'Tất cả 11 lĩnh vực'
      : selectedSubjectSlugs
          .map((s) => SUBJECT_METAS.find((m) => m.slug === s)?.shortName || s)
          .join(', ');

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="gold" className="text-xs font-bold gap-1">
              <Crown className="h-3 w-3" />
              Violympic Huyền Thoại
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
              <BookOpen className="h-3 w-3 mr-1" />
              Lĩnh vực: {activeSubjectsLabel}
            </Badge>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-foreground">
              Đấu Trường 12 Con Giáp (Zodiac Arena)
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            12 Linh thú huyền thoại ẩn chứa các câu hỏi tri thức thuộc môn bạn đã chọn. Thu phục trọn vẹn 12 con giáp!
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Conquered Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-gold/10 border border-accent-gold/30 text-accent-gold font-bold text-xs">
            <Crown className="h-4 w-4" />
            <span>{conqueredCount} / 12 Con giáp</span>
          </div>

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

          {/* Score */}
          <div className="flex items-center gap-1.5 font-mono font-bold text-accent-gold text-base">
            <Trophy className="h-4 w-4" />
            <span>{score} đ</span>
          </div>

          {onChangeSubjects && (
            <Button variant="outline" size="sm" onClick={onChangeSubjects} className="gap-1 text-xs">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Đổi lĩnh vực</span>
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={initZodiacGame} className="gap-1 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Chơi lại</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Trở về</span>
          </Button>
        </div>
      </div>

      {/* Victory / Game Over Overlays */}
      {isWon && (
        <Card className="p-8 text-center bg-gradient-to-b from-accent-gold/20 via-surface to-success/10 border-accent-gold/40 shadow-lg space-y-4 animate-fade-in">
          <div className="inline-flex p-4 rounded-full bg-accent-gold/20 text-accent-gold ring-4 ring-accent-gold/30">
            <Crown className="h-10 w-10" />
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
            Bậc Thầy 12 Con Giáp Xuất Chúng!
          </h3>
          <p className="text-sm text-foreground-muted max-w-lg mx-auto">
            Bạn đã xuất sắc thu phục trọn vẹn 12 linh thú trong các lĩnh vực: <strong>{activeSubjectsLabel}</strong>.
            Đạt tổng cộng <strong className="text-accent-gold font-mono text-lg">{score} điểm</strong>!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="primary" size="md" onClick={initZodiacGame} className="font-bold">
              Chơi lại từ đầu
            </Button>
            <Button variant="outline" size="md" onClick={onBack}>
              Về trung tâm luyện tập
            </Button>
          </div>
        </Card>
      )}

      {isGameOver && (
        <Card className="p-8 text-center bg-gradient-to-b from-danger/10 to-surface border-danger/30 space-y-4">
          <h3 className="font-heading text-2xl font-bold text-danger">Hết lượt thử thách!</h3>
          <p className="text-sm text-foreground-muted">
            Bạn đã dùng hết 3 mạng khi đang thu phục được {conqueredCount}/12 con giáp ({activeSubjectsLabel}). Đừng bỏ cuộc, hãy thử sức lại nhé!
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={initZodiacGame} className="font-bold">
              Thử lại ngay
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Về trung tâm luyện tập
            </Button>
          </div>
        </Card>
      )}

      {/* 12 Zodiac Animals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {challenges.map((c) => {
          const isSelected = activeAnimalId === c.animal.id;

          let cardStyle = 'border-border bg-surface hover:border-primary/50 hover:bg-slate-50 cursor-pointer shadow-xs';
          if (c.isConquered) {
            cardStyle = 'border-success/60 bg-success/10 text-success ring-2 ring-success/20 cursor-default';
          } else if (isSelected) {
            cardStyle = 'border-primary bg-primary/10 ring-4 ring-primary/20 shadow-md';
          }

          return (
            <div
              key={c.animal.id}
              onClick={() => handleSelectAnimal(c.animal.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none relative overflow-hidden group ${cardStyle}`}
            >
              {/* Conquered Watermark / Badge */}
              {c.isConquered && (
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="text-[10px] bg-success text-white font-bold gap-1 px-1.5 py-0.5">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Đã thu phục</span>
                  </Badge>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl" role="img" aria-label={c.animal.name}>
                    {c.animal.iconSymbol}
                  </span>
                  <div>
                    <h4 className="font-heading font-extrabold text-base text-foreground leading-tight">
                      {c.animal.vietnameseName} ({c.animal.name})
                    </h4>
                    <span className="text-[10px] text-foreground-muted font-medium">
                      Hành: {c.animal.element}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-foreground-muted line-clamp-1 mb-3">
                  {c.animal.title}
                </p>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-primary">
                  {c.question.subjectName}
                </span>

                {!c.isConquered ? (
                  <Button
                    size="sm"
                    variant={isSelected ? 'primary' : 'outline'}
                    className="h-7 text-xs font-bold px-2.5"
                    disabled={isGameOver || isWon}
                  >
                    Giải đố
                  </Button>
                ) : (
                  <span className="text-[11px] font-bold text-success font-mono">
                    +100 đ
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Challenge Question Modal / Detail View */}
      {activeChallenge && !activeChallenge.isConquered && (
        <Card className="border-primary/40 shadow-lg bg-surface animate-fade-in mt-6">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeChallenge.animal.iconSymbol}</span>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Thử Thách Linh Thú: {activeChallenge.animal.vietnameseName}
                  </h3>
                  <Badge variant="outline" className="text-[10px] text-primary">
                    Lĩnh vực: {activeChallenge.question.subjectName}
                  </Badge>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseChallengeModal}
                className="text-xs"
              >
                Đóng
              </Button>
            </div>

            <p className="font-medium text-sm sm:text-base text-foreground pt-3 leading-relaxed">
              {activeChallenge.question.prompt}
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeChallenge.question.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = opt.key === activeChallenge.question.correctKey;

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
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${btnStyle} ${
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

            {/* Answer Result & Explanation */}
            {isAnswered && (
              <div className="space-y-3 pt-2 animate-fade-in">
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    selectedOption === activeChallenge.question.correctKey
                      ? 'bg-success/10 border-success/30 text-success'
                      : 'bg-danger/10 border-danger/30 text-danger'
                  }`}
                >
                  {selectedOption === activeChallenge.question.correctKey ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs sm:text-sm text-foreground">
                    <strong className="block font-semibold">
                      {selectedOption === activeChallenge.question.correctKey
                        ? `Tuyệt vời! Bạn đã thu phục thành công linh thú ${activeChallenge.animal.vietnameseName} (+100 điểm).`
                        : `Chưa chính xác! Bạn bị trừ 1 mạng.`}
                    </strong>
                    <p className="text-foreground-muted text-xs leading-relaxed">
                      💡 <strong>Giải thích:</strong> {activeChallenge.question.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCloseChallengeModal}
                    className="font-bold"
                  >
                    {selectedOption === activeChallenge.question.correctKey
                      ? 'Tiếp tục chọn con giáp khác'
                      : 'Đóng & Thử con giáp khác'}
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
