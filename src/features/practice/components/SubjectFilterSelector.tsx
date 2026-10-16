import { Check, CheckSquare, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SUBJECT_METAS } from '../data/practiceBank';

interface SubjectFilterSelectorProps {
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
}

export function SubjectFilterSelector({ selectedSlugs, onChange }: SubjectFilterSelectorProps) {
  const isAllSelected = selectedSlugs.length === SUBJECT_METAS.length;
  const isNoneSelected = selectedSlugs.length === 0;

  const handleToggle = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      // If user unselects the only remaining item, keep it empty or notify
      onChange(selectedSlugs.filter((s) => s !== slug));
    } else {
      onChange([...selectedSlugs, slug]);
    }
  };

  const handleSelectAll = () => {
    onChange(SUBJECT_METAS.map((s) => s.slug));
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const handleSelectOnly = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([slug]);
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-surface p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary-soft text-primary">
              <Filter className="h-4 w-4" />
            </div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
              Bộ Lọc Đa Chọn Lĩnh Vực / Chủ Đề (Multi-select)
            </h3>
          </div>
          <p className="text-xs text-foreground-muted">
            Chọn một hoặc nhiều môn học. <strong>Các trò chơi sẽ chỉ xuất hiện câu hỏi của môn bạn đã chọn, không gom chung!</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className={`text-xs h-8 font-semibold ${isAllSelected ? 'bg-primary-soft text-primary border-primary/30' : ''}`}
          >
            <CheckSquare className="h-3.5 w-3.5 mr-1" />
            <span>Chọn tất cả (11)</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDeselectAll}
            disabled={isNoneSelected}
            className="text-xs h-8 text-foreground-muted hover:text-danger"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            <span>Bỏ chọn</span>
          </Button>
        </div>
      </div>

      {/* Grid of 11 Subject Badges / Checkboxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {SUBJECT_METAS.map((sub) => {
          const isSelected = selectedSlugs.includes(sub.slug);
          const Icon = sub.icon;

          return (
            <div
              key={sub.slug}
              onClick={() => handleToggle(sub.slug)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer select-none group relative ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-xs ring-2 ring-primary/20'
                  : 'border-border bg-surface-muted/50 hover:bg-surface hover:border-slate-300 dark:hover:border-slate-700 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className={`p-1.5 rounded-lg bg-surface border border-border/60 ${sub.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div
                  className={`h-5 w-5 rounded-md flex items-center justify-center border text-[11px] font-bold transition-colors ${
                    isSelected
                      ? 'bg-primary border-primary text-white'
                      : 'border-border bg-surface text-transparent'
                  }`}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-xs text-foreground leading-snug">
                  {sub.name}
                </h4>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-border/40">
                  <span className="text-[10px] text-foreground-muted font-medium">
                    {sub.shortName}
                  </span>
                  <button
                    type="button"
                    title={`Chỉ chọn duy nhất môn ${sub.name}`}
                    onClick={(e) => handleSelectOnly(sub.slug, e)}
                    className="text-[9px] font-semibold text-primary hover:underline"
                  >
                    Chỉ môn này
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Status Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs border-t border-border/50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-foreground">Trạng thái lọc:</span>
          {isNoneSelected ? (
            <Badge variant="danger" className="text-[11px] font-medium">
              Chưa chọn môn nào (Hệ thống sẽ lấy ngẫu nhiên để không bị gián đoạn)
            </Badge>
          ) : isAllSelected ? (
            <Badge variant="default" className="text-[11px] font-medium">
              Đang chọn toàn bộ 11 lĩnh vực
            </Badge>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className="text-[11px] font-semibold text-primary border-primary/30">
                Đã chọn {selectedSlugs.length} / 11 môn:
              </Badge>
              <span className="text-foreground-muted">
                {selectedSlugs
                  .map((s) => SUBJECT_METAS.find((m) => m.slug === s)?.shortName || s)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>

        <span className="text-[11px] text-foreground-muted italic">
          💡 Nhấp vào từng ô để bật/tắt hoặc nhấn "Chỉ môn này"
        </span>
      </div>
    </div>
  );
}
