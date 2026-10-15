import { useState, useEffect } from 'react';
import { Zap, Trophy, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface BlankQuestion {
  id: string;
  subject: string;
  prompt: string;
  hint: string;
  expectedAnswer: string;
  explanation: string;
}

const BLANK_QUESTIONS: BlankQuestion[] = [
  {
    id: '1',
    subject: 'Toán học',
    prompt: 'Giá trị nhỏ nhất của hàm số f(x) = x^2 - 4x + 9 là bao nhiêu? (Nhập số nguyên)',
    hint: 'Biến đổi về dạng hằng đẳng thức (x - a)^2 + b',
    expectedAnswer: '5',
    explanation: 'Ta có f(x) = (x - 2)^2 + 5. Do (x - 2)^2 >= 0 với mọi x nên f(x) >= 5. GTNN bằng 5.',
  },
  {
    id: '2',
    subject: 'Ngữ văn',
    prompt: 'Điền từ còn thiếu vào câu thơ: "Quân xanh màu lá dữ oai..." (Tây Tiến - Quang Dũng)?',
    hint: 'Một từ chỉ loài thú chúa sơn lâm',
    expectedAnswer: 'hùm',
    explanation: 'Câu thơ trọn vẹn: "Tây Tiến đoàn binh không mọc tóc / Quân xanh màu lá dữ oai hùm".',
  },
  {
    id: '3',
    subject: 'Hóa học',
    prompt: 'Khí gì thoát ra khi cho canxi cacbonat (đá vôi) phản ứng với dung dịch axit clohiđric (HCl)? (Nhập công thức hóa học)',
    hint: 'Khí gây hiệu ứng nhà kính chính',
    expectedAnswer: 'CO2',
    explanation: 'CaCO3 + 2HCl -> CaCl2 + CO2↑ + H2O. Khí thoát ra là CO2.',
  },
  {
    id: '4',
    subject: 'Lịch sử',
    prompt: 'Chiến dịch Điện Biên Phủ toàn thắng vào năm nào? (Nhập năm gồm 4 chữ số)',
    hint: 'Năm ký kết Hiệp định Giơ-ne-vơ',
    expectedAnswer: '1954',
    explanation: 'Chiều ngày 7/5/1954, lá cờ "Quyết chiến - Quyết thắng" tung bay trên nóc hầm tướng Đờ Cát-xtơ-ri.',
  },
];

export function SpeedBlankGame({ onBack }: { onBack: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [currentPoints, setCurrentPoints] = useState(1000);
  const [totalScore, setTotalScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question = BLANK_QUESTIONS[currentIdx];

  // Point decay ticker
  useEffect(() => {
    if (isAnswered || isFinished) return;

    const interval = setInterval(() => {
      setCurrentPoints((p) => Math.max(100, p - 20));
    }, 500);

    return () => clearInterval(interval);
  }, [isAnswered, isFinished]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswered || !userInput.trim()) return;

    setIsAnswered(true);
    const correct =
      userInput.trim().toLowerCase() === question.expectedAnswer.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setTotalScore((s) => s + currentPoints);
    }
  };

  const handleNext = () => {
    if (currentIdx < BLANK_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
      setUserInput('');
      setCurrentPoints(1000);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setUserInput('');
    setCurrentPoints(1000);
    setTotalScore(0);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsFinished(false);
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
              Đừng Để Điểm Rơi (Điền Đáp Án Thần Tốc)
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            Mỗi câu khởi điểm 1.000 điểm. Điểm số giảm dần theo từng tích tắc! Gõ và gửi kết quả thật nhanh để bảo toàn điểm.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono font-bold text-accent-gold text-base">
            <Trophy className="h-4 w-4" />
            <span>{totalScore} đ</span>
          </div>

          <Button variant="ghost" size="sm" onClick={onBack} className="text-xs">
            Trở về
          </Button>
        </div>
      </div>

      {isFinished ? (
        <Card className="p-8 text-center bg-gradient-to-b from-primary/10 to-surface border-primary/30 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-primary/20 text-primary">
            <Trophy className="h-10 w-10" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Chúc mừng bạn đã hoàn tất thử thách!
          </h3>
          <p className="text-sm text-foreground-muted">
            Tổng điểm bảo toàn được: <strong className="text-accent-gold font-mono">{totalScore} điểm</strong>!
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={handleRestart} className="font-bold">
              Thử thách lại
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              Trở về trung tâm
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Decaying Points Bar */}
          <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className={`h-5 w-5 ${currentPoints < 400 ? 'text-danger animate-pulse' : 'text-accent-gold'}`} />
              <span className="text-xs font-semibold text-foreground-muted">
                Điểm rơi hiện tại của câu {currentIdx + 1}/{BLANK_QUESTIONS.length}:
              </span>
            </div>
            <div className={`font-mono text-xl sm:text-2xl font-extrabold ${
              currentPoints < 400 ? 'text-danger' : 'text-primary'
            }`}>
              {currentPoints} <span className="text-xs font-normal text-foreground-muted">điểm</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <Badge variant="outline" className="text-xs font-semibold">
                {question.subject}
              </Badge>
              <span className="text-xs text-foreground-muted italic">
                Gợi ý: {question.hint}
              </span>
            </CardHeader>

            <CardContent className="space-y-6">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                {question.prompt}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 max-w-lg">
                  <Input
                    type="text"
                    disabled={isAnswered}
                    placeholder="Nhập câu trả lời của bạn..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="text-base font-semibold py-3 px-4 rounded-xl border-border focus:border-primary"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isAnswered || !userInput.trim()}
                    className="shrink-0 font-bold px-5"
                  >
                    Gửi
                  </Button>
                </div>
              </form>

              {/* Result Banner */}
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
                          ? `Chính xác! Bạn bảo toàn được +${currentPoints} điểm.`
                          : `Chưa chính xác! Đáp án đúng là: ${question.expectedAnswer}`}
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
                      <span>{currentIdx < BLANK_QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
