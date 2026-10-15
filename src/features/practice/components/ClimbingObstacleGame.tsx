import { useState } from 'react';
import { Mountain, Heart, Trophy, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface ObstacleQuestion {
  level: number;
  subject: string;
  prompt: string;
  options: { key: string; text: string }[];
  correctKey: string;
  explanation: string;
}

const OBSTACLE_QUESTIONS: ObstacleQuestion[] = [
  {
    level: 1,
    subject: 'Toán học',
    prompt: 'Số nguyên tố chẵn duy nhất là số nào?',
    options: [
      { key: 'A', text: '0' },
      { key: 'B', text: '2' },
      { key: 'C', text: '4' },
      { key: 'D', text: 'Không có' },
    ],
    correctKey: 'B',
    explanation: 'Số 2 là số nguyên tố chẵn duy nhất, tất cả các số chẵn khác > 2 đều chia hết cho 2 nên là hợp số.',
  },
  {
    level: 2,
    subject: 'Vật lý',
    prompt: 'Vận tốc truyền âm lớn nhất trong môi trường nào sau đây?',
    options: [
      { key: 'A', text: 'Chất rắn' },
      { key: 'B', text: 'Chất lỏng' },
      { key: 'C', text: 'Chất khí' },
      { key: 'D', text: 'Chân không' },
    ],
    correctKey: 'A',
    explanation: 'Âm thanh truyền nhanh nhất trong chất rắn, tiếp đến chất lỏng, chậm nhất trong chất khí và không truyền được trong chân không.',
  },
  {
    level: 3,
    subject: 'Hóa học',
    prompt: 'Kim loại nào có nhiệt độ nóng chảy cao nhất, thường dùng làm dây tóc bóng đèn?',
    options: [
      { key: 'A', text: 'Sắt (Fe)' },
      { key: 'B', text: 'Đồng (Cu)' },
      { key: 'C', text: 'Vonfram (W)' },
      { key: 'D', text: 'Bạch kim (Pt)' },
    ],
    correctKey: 'C',
    explanation: 'Vonfram (W) có nhiệt độ nóng chảy lên tới ~3422 °C, cao nhất trong tất cả các kim loại.',
  },
  {
    level: 4,
    subject: 'Ngữ văn',
    prompt: 'Bài thơ "Nam quốc sơn hà" được coi là bản Tuyên ngôn độc lập thứ mấy của dân tộc ta?',
    options: [
      { key: 'A', text: 'Thứ nhất' },
      { key: 'B', text: 'Thứ hai' },
      { key: 'C', text: 'Thứ ba' },
      { key: 'D', text: 'Thứ tư' },
    ],
    correctKey: 'A',
    explanation: 'Nam quốc sơn hà gắn liền với Lý Thường Kiệt được coi là bản Tuyên ngôn Độc lập đầu tiên của nước Việt.',
  },
  {
    level: 5,
    subject: 'Sinh học',
    prompt: 'Đơn phân cấu tạo nên phân tử ADN là gì?',
    options: [
      { key: 'A', text: 'Axit amin' },
      { key: 'B', text: 'Nuclêôtit' },
      { key: 'C', text: 'Axit béo' },
      { key: 'D', text: 'Glucôzơ' },
    ],
    correctKey: 'B',
    explanation: 'ADN cấu tạo theo nguyên tắc đa phân từ các đơn phân là nuclêôtit (A, T, G, X).',
  },
  {
    level: 6,
    subject: 'Lịch sử',
    prompt: 'Chiến thắng nào của quân dân ta đã đập tan tập đoàn cứ điểm mạnh nhất Đông Dương của thực dân Pháp?',
    options: [
      { key: 'A', text: 'Chiến dịch Việt Bắc 1947' },
      { key: 'B', text: 'Chiến dịch Biên giới 1950' },
      { key: 'C', text: 'Chiến dịch Điện Biên Phủ 1954' },
      { key: 'D', text: 'Chiến dịch Hồ Chí Minh 1975' },
    ],
    correctKey: 'C',
    explanation: 'Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" ngày 7/5/1954.',
  },
  {
    level: 7,
    subject: 'Tin học',
    prompt: 'Độ phức tạp thời gian trung bình của thuật toán Tìm kiếm nhị phân (Binary Search) là bao nhiêu?',
    options: [
      { key: 'A', text: 'O(1)' },
      { key: 'B', text: 'O(log n)' },
      { key: 'C', text: 'O(n)' },
      { key: 'D', text: 'O(n log n)' },
    ],
    correctKey: 'B',
    explanation: 'Sau mỗi bước tìm kiếm nhị phân, không gian tìm kiếm giảm đi một nửa nên độ phức tạp là O(log n).',
  },
];

export function ClimbingObstacleGame({ onBack }: { onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const question = OBSTACLE_QUESTIONS[currentStep];

  const handleSelectOption = (key: string) => {
    if (isAnswered || isGameOver || isWon) return;

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
    if (currentStep < OBSTACLE_QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsWon(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setLives(3);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setIsWon(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              Violympic Classic
            </Badge>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-foreground">
              Vượt Chướng Ngại Vật (Khỉ Leo Núi)
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            Leo lên đỉnh núi tri thức! Trả lời đúng để leo lên vách đá tiếp theo, chuỗi thắng nhân bội điểm số.
          </p>
        </div>

        <div className="flex items-center gap-4">
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

          <div className="flex items-center gap-1.5 font-mono font-bold text-accent-gold text-base">
            <Trophy className="h-4 w-4" />
            <span>{score} đ</span>
          </div>

          <Button variant="ghost" size="sm" onClick={onBack} className="text-xs">
            Trở về
          </Button>
        </div>
      </div>

      {/* Mountain Progress Visualizer */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-foreground-muted">
          <span className="flex items-center gap-1.5">
            <Mountain className="h-4 w-4 text-primary" />
            <span>Độ cao: Chặng {currentStep + 1} / {OBSTACLE_QUESTIONS.length}</span>
          </span>
          {streak > 1 && (
            <Badge variant="warning" className="text-[10px] font-mono animate-bounce">
              🔥 Chuỗi x{streak} combo!
            </Badge>
          )}
        </div>

        {/* Multi-step progress bar */}
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5">
          {OBSTACLE_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-300 ${
                i < currentStep
                  ? 'bg-success'
                  : i === currentStep
                  ? 'bg-primary'
                  : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Victory / Game Over */}
      {isWon && (
        <Card className="p-8 text-center bg-gradient-to-b from-success/15 to-surface border-success/30 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-success/20 text-success">
            <Mountain className="h-10 w-10" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Chinh phục đỉnh núi thành công!
          </h3>
          <p className="text-sm text-foreground-muted">
            Bạn đã xuất sắc vượt qua toàn bộ các vách núi tri thức với <strong className="text-accent-gold font-mono">{score} điểm</strong>!
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={handleRestart} className="font-bold">
              Chinh phục lại
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Trở về trung tâm
            </Button>
          </div>
        </Card>
      )}

      {isGameOver && (
        <Card className="p-8 text-center bg-gradient-to-b from-danger/15 to-surface border-danger/30 space-y-4">
          <h3 className="font-heading text-2xl font-bold text-danger">Rơi khỏi vách núi!</h3>
          <p className="text-sm text-foreground-muted">
            Bạn đã hết mạng ở Chặng {currentStep + 1}. Hãy thử lại để chinh phục đỉnh cao nhé!
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={handleRestart} className="font-bold">
              Leo núi lại
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Trở về trung tâm
            </Button>
          </div>
        </Card>
      )}

      {/* Active Question Card */}
      {!isWon && !isGameOver && (
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <Badge variant="outline" className="text-xs font-semibold">
              {question.subject}
            </Badge>
            <span className="text-xs font-mono text-accent-gold font-bold">
              +{(10 + (streak + 1) * 5)} điểm
            </span>
          </CardHeader>

          <CardContent className="space-y-6">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              {question.prompt}
            </h3>

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
                    <span>{currentStep < OBSTACLE_QUESTIONS.length - 1 ? 'Chặng tiếp theo' : 'Xem kết quả'}</span>
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
