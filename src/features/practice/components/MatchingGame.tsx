import { useState } from 'react';
import { RotateCcw, Trophy, Sparkles, Heart, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getMatchingCardsForSubjects, SUBJECT_METAS } from '../data/practiceBank';

interface CardItem {
  id: string;
  pairId: string;
  text: string;
  category: string;
}

interface MatchingGameProps {
  selectedSubjectSlugs: string[];
  onBack: () => void;
  onChangeSubjects?: () => void;
}

export function MatchingGame({ selectedSubjectSlugs, onBack, onChangeSubjects }: MatchingGameProps) {
  const [cards, setCards] = useState<CardItem[]>(() =>
    getMatchingCardsForSubjects(selectedSubjectSlugs, 6)
  );
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const newCards = getMatchingCardsForSubjects(selectedSubjectSlugs, 6);
    setCards(newCards);
    setSelectedCards([]);
    setMatchedPairs([]);
    setLives(3);
    setScore(0);
    setIsGameOver(false);
    setIsWon(false);
  };

  const handleCardClick = (card: CardItem) => {
    if (
      selectedCards.length === 2 ||
      selectedCards.some((c) => c.id === card.id) ||
      matchedPairs.includes(card.pairId) ||
      isGameOver ||
      isWon
    ) {
      return;
    }

    const nextSelected = [...selectedCards, card];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      const [first, second] = nextSelected;
      if (first.pairId === second.pairId) {
        // Correct Match!
        setTimeout(() => {
          setMatchedPairs((prev) => {
            const next = [...prev, first.pairId];
            if (next.length === cards.length / 2) {
              setIsWon(true);
            }
            return next;
          });
          setScore((s) => s + 20);
          setSelectedCards([]);
        }, 500);
      } else {
        // Wrong Match!
        setTimeout(() => {
          setLives((l) => {
            const nextLives = l - 1;
            if (nextLives <= 0) {
              setIsGameOver(true);
            }
            return nextLives;
          });
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  const activeSubjectsLabel = selectedSubjectSlugs.length === 0
    ? 'Tất cả 11 lĩnh vực'
    : selectedSubjectSlugs
        .map((s) => SUBJECT_METAS.find((m) => m.slug === s)?.shortName || s)
        .join(', ');

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 animate-fade-in">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="text-xs">
              Violympic Classic
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
              <BookOpen className="h-3 w-3 mr-1" />
              Lĩnh vực: {activeSubjectsLabel}
            </Badge>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-foreground">
              Cặp Đôi Hoàn Hảo (Matching Pairs)
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            Tìm và bấm chọn 2 ô có ý nghĩa tương đương hoặc lời giải khớp nhau từ các lĩnh vực bạn đã chọn!
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

          {/* Score */}
          <div className="flex items-center gap-1.5 font-mono font-bold text-accent-gold text-base">
            <Trophy className="h-4 w-4" />
            <span>{score} đ</span>
          </div>

          <Button variant="outline" size="sm" onClick={initGame} className="gap-1 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Chơi lại</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Trở về</span>
          </Button>
        </div>
      </div>

      {/* Empty cards warning */}
      {cards.length === 0 && (
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

      {/* Victory / Game Over Overlay */}
      {isWon && (
        <Card className="p-8 text-center bg-gradient-to-b from-success/10 to-surface border-success/30 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-success/20 text-success">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Tuyệt vời! Bạn đã hoàn thành xuất sắc!
          </h3>
          <p className="text-sm text-foreground-muted">
            Lĩnh vực: <strong>{activeSubjectsLabel}</strong> • Điểm số đạt được:{' '}
            <strong className="text-accent-gold font-mono">{score} điểm</strong> với {lives} mạng còn lại.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={initGame} className="font-bold">
              Chơi màn tiếp theo
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Về trung tâm luyện tập
            </Button>
          </div>
        </Card>
      )}

      {isGameOver && (
        <Card className="p-8 text-center bg-gradient-to-b from-danger/10 to-surface border-danger/30 space-y-4">
          <h3 className="font-heading text-2xl font-bold text-danger">Hết mạng rồi!</h3>
          <p className="text-sm text-foreground-muted">
            Bạn đã ghép sai 3 lần trong lĩnh vực {activeSubjectsLabel}. Đừng nản lòng, hãy thử lại để rèn luyện trí nhớ nhé!
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={initGame} className="font-bold">
              Thử lại ngay
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Về trung tâm luyện tập
            </Button>
          </div>
        </Card>
      )}

      {/* Cards Grid */}
      {!isWon && !isGameOver && cards.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => {
            const isMatched = matchedPairs.includes(card.pairId);
            const isSelected = selectedCards.some((c) => c.id === card.id);

            return (
              <button
                key={card.id}
                type="button"
                disabled={isMatched || isGameOver || isWon}
                onClick={() => handleCardClick(card)}
                className={`min-h-[100px] sm:min-h-[120px] p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all transform duration-200 select-none ${
                  isMatched
                    ? 'opacity-0 scale-95 pointer-events-none'
                    : isSelected
                    ? 'border-accent-gold bg-accent-gold/15 text-foreground ring-4 ring-accent-gold/30 scale-105 shadow-md'
                    : 'border-border bg-surface hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-foreground hover:scale-102 shadow-xs cursor-pointer'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted mb-1 font-semibold">
                  [{card.category}]
                </span>
                <span className="text-xs sm:text-sm font-bold leading-snug">
                  {card.text}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
