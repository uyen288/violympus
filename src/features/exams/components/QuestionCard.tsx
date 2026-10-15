import { useState } from 'react';
import { Check, Link2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { ExamQuestion } from '../services/examService';

interface QuestionCardProps {
  question: ExamQuestion;
  questionNumber: number;
  totalQuestions: number;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
  disabled = false,
}: QuestionCardProps) {
  // State for matching pair mode
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Group options for matching questions: L1, L2, L3 and R1, R2, R3
  const isMatching = question.type === 'matching';
  const leftOptions = isMatching ? question.options.filter((o) => o.optionKey.startsWith('L')) : [];
  const rightOptions = isMatching ? question.options.filter((o) => o.optionKey.startsWith('R')) : [];
  const currentPairs: Record<string, string> =
    isMatching && typeof value === 'object' && value !== null ? (value as Record<string, string>) : {};

  const handlePairSelection = (rightKey: string) => {
    if (!selectedLeft || disabled) return;
    const nextPairs = { ...currentPairs, [selectedLeft]: rightKey };
    onChange(nextPairs);
    setSelectedLeft(null);
  };

  const handleRemovePair = (leftKey: string) => {
    if (disabled) return;
    const nextPairs = { ...currentPairs };
    delete nextPairs[leftKey];
    onChange(nextPairs);
  };

  const handleResetPairs = () => {
    if (disabled) return;
    onChange({});
    setSelectedLeft(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="font-mono text-xs px-2.5 py-0.5">
            Câu {questionNumber} / {totalQuestions}
          </Badge>
          <Badge variant="outline" className="text-[11px] capitalize">
            {question.type === 'single_choice' && 'Trắc nghiệm đơn'}
            {question.type === 'multiple_choice' && 'Trắc nghiệm nhiều lựa chọn'}
            {question.type === 'true_false' && 'Đúng / Sai'}
            {question.type === 'fill_blank' && 'Điền kết quả'}
            {question.type === 'matching' && 'Cặp đôi hoàn hảo (Ghép nối)'}
          </Badge>
        </div>
        <span className="text-xs font-semibold text-accent-gold flex items-center gap-1">
          +{question.points} điểm
        </span>
      </div>

      {/* Prompt */}
      <div className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
        {question.prompt}
      </div>

      {/* Interactive Options according to Question Type */}
      <div className="space-y-3 pt-2">
        {/* 1. SINGLE CHOICE */}
        {question.type === 'single_choice' && (
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((option) => {
              const isSelected = value === option.optionKey;
              return (
                <button
                  key={option.optionKey}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(option.optionKey)}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary shadow-xs ring-2 ring-primary/20'
                      : 'border-border bg-surface hover:bg-slate-50 dark:hover:bg-slate-900/40 text-foreground'
                  } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
                      isSelected ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-foreground-muted'
                    }`}
                  >
                    {option.optionKey}
                  </div>
                  <span className="text-sm sm:text-base flex-1">{option.content}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. TRUE / FALSE */}
        {question.type === 'true_false' && (
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { key: 'TRUE', label: 'Đúng', color: 'hover:border-success/60' },
              { key: 'FALSE', label: 'Sai', color: 'hover:border-danger/60' },
            ].map((item) => {
              const isSelected = value === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(item.key)}
                  className={`py-4 px-6 rounded-xl border text-center font-bold text-base transition-all ${
                    isSelected
                      ? item.key === 'TRUE'
                        ? 'border-success bg-success/15 text-success ring-2 ring-success/30'
                        : 'border-danger bg-danger/15 text-danger ring-2 ring-danger/30'
                      : `border-border bg-surface text-foreground ${item.color}`
                  } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* 3. MULTIPLE CHOICE */}
        {question.type === 'multiple_choice' && (
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((option) => {
              const selectedArray = Array.isArray(value) ? (value as string[]) : [];
              const isSelected = selectedArray.includes(option.optionKey);
              const toggleOption = () => {
                if (disabled) return;
                if (isSelected) {
                  onChange(selectedArray.filter((k) => k !== option.optionKey));
                } else {
                  onChange([...selectedArray, option.optionKey]);
                }
              };

              return (
                <button
                  key={option.optionKey}
                  type="button"
                  disabled={disabled}
                  onClick={toggleOption}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                      : 'border-border bg-surface hover:bg-slate-50 dark:hover:bg-slate-900/40 text-foreground'
                  } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border font-mono text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-primary border-primary text-white'
                        : 'border-border bg-white dark:bg-slate-800 text-foreground-muted'
                    }`}
                  >
                    {isSelected ? <Check className="h-3.5 w-3.5" /> : option.optionKey}
                  </div>
                  <span className="text-sm sm:text-base flex-1">{option.content}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 4. FILL IN THE BLANK */}
        {question.type === 'fill_blank' && (
          <div className="space-y-3 max-w-lg">
            <p className="text-xs text-foreground-muted">
              Nhập đáp án số hoặc từ chính xác vào ô bên dưới:
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                disabled={disabled}
                placeholder="Ví dụ: 5 hoặc hùm"
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => onChange(e.target.value)}
                className="text-base font-semibold py-3 px-4 rounded-xl border-border focus:border-primary"
                autoComplete="off"
              />
            </div>
          </div>
        )}

        {/* 5. MATCHING PAIRS (Cặp đôi hoàn hảo - Violympic Classic) */}
        {question.type === 'matching' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-foreground-muted bg-surface-muted/60 p-2.5 rounded-lg border border-border/50">
              <span>
                💡 <strong>Cách chơi:</strong> Chọn 1 ô bên Cột A, sau đó bấm chọn 1 ô tương ứng bên Cột B để tạo thành cặp ghép.
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetPairs}
                disabled={disabled || Object.keys(currentPairs).length === 0}
                className="h-7 text-xs gap-1 text-foreground-muted hover:text-danger"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Đặt lại</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column A (Left) */}
              <div className="space-y-2">
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-primary px-1">
                  Cột A (Đề mục)
                </div>
                {leftOptions.map((opt) => {
                  const isPaired = Boolean(currentPairs[opt.optionKey]);
                  const isSelected = selectedLeft === opt.optionKey;

                  return (
                    <button
                      key={opt.optionKey}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedLeft(isSelected ? null : opt.optionKey)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-sm transition-all ${
                        isSelected
                          ? 'border-accent-gold bg-accent-gold/15 text-foreground ring-2 ring-accent-gold'
                          : isPaired
                          ? 'border-success/60 bg-success/10 text-success'
                          : 'border-border bg-surface hover:bg-slate-50 text-foreground'
                      }`}
                    >
                      <span className="font-medium">{opt.content}</span>
                      {isPaired && (
                        <span className="text-[11px] font-mono bg-success/20 text-success font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Link2 className="h-3 w-3" />
                          <span>Đã nối</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Column B (Right) */}
              <div className="space-y-2">
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-primary px-1">
                  Cột B (Giá trị tương ứng)
                </div>
                {rightOptions.map((opt) => {
                  const pairedLeftKey = Object.keys(currentPairs).find(
                    (lk) => currentPairs[lk] === opt.optionKey
                  );
                  const isPaired = Boolean(pairedLeftKey);

                  return (
                    <button
                      key={opt.optionKey}
                      type="button"
                      disabled={disabled || !selectedLeft}
                      onClick={() => handlePairSelection(opt.optionKey)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-sm transition-all ${
                        isPaired
                          ? 'border-success/60 bg-success/10 text-success'
                          : selectedLeft
                          ? 'border-accent-gold/60 bg-accent-gold/5 hover:bg-accent-gold/15 cursor-pointer text-foreground'
                          : 'border-border bg-surface opacity-75 cursor-default text-foreground-muted'
                      }`}
                    >
                      <span className="font-medium">{opt.content}</span>
                      {pairedLeftKey && (
                        <Badge variant="success" className="text-[10px] font-mono">
                          Ghép với {pairedLeftKey}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Paired Summary */}
            {Object.keys(currentPairs).length > 0 && (
              <div className="p-3 bg-surface rounded-xl border border-border flex flex-wrap gap-2 items-center text-xs">
                <span className="font-bold text-foreground">Các cặp đã chọn:</span>
                {Object.entries(currentPairs).map(([lKey, rKey]) => {
                  const lText = leftOptions.find((o) => o.optionKey === lKey)?.content || lKey;
                  const rText = rightOptions.find((o) => o.optionKey === rKey)?.content || rKey;
                  return (
                    <span
                      key={lKey}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium"
                    >
                      <span>{lText}</span>
                      <span className="text-foreground-muted font-bold">↔</span>
                      <span>{rText}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePair(lKey)}
                        className="ml-1 text-foreground-muted hover:text-danger font-bold"
                        title="Bỏ cặp này"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
