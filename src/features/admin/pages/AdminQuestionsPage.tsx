import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  HelpCircle,
  PlusCircle,
  Search,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorState } from '@/components/shared/ErrorState';
import {
  listQuestionsAdmin,
  deleteQuestion,
  type QuestionWithRelations,
} from '@/features/admin/services/adminQuestionService';

const PAGE_SIZE = 20;

const TYPE_LABELS: Record<string, string> = {
  single_choice: 'Trắc nghiệm',
  multiple_choice: 'Nhiều lựa chọn',
  true_false: 'Đúng/Sai',
  fill_blank: 'Điền đáp án',
  matching: 'Ghép cặp',
};

const DIFFICULTY_STYLE: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-slate-100 text-slate-600',
  archived: 'bg-gray-100 text-gray-500',
};

export function AdminQuestionsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const questionsQuery = useQuery({
    queryKey: ['admin', 'questions', { page, search, filterType, filterDifficulty, filterStatus }],
    queryFn: () =>
      listQuestionsAdmin({
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        search: search || undefined,
        type: filterType || undefined,
        difficulty: filterDifficulty || undefined,
        status: filterStatus || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'questions'] });
      setDeleteConfirmId(null);
    },
  });

  const totalPages = Math.ceil((questionsQuery.data?.count ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ngân hàng câu hỏi</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {questionsQuery.data?.count ?? 0} câu hỏi tổng cộng
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/admin/questions/new">
            <PlusCircle size={16} /> Tạo câu hỏi
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Tìm kiếm câu hỏi..."
            className="pl-8 h-9 text-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(0); }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Tất cả loại</option>
          {Object.entries(TYPE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select
          value={filterDifficulty}
          onChange={(e) => { setFilterDifficulty(e.target.value); setPage(0); }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Tất cả độ khó</option>
          <option value="easy">Dễ</option>
          <option value="medium">Trung bình</option>
          <option value="hard">Khó</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="published">Đã đăng</option>
          <option value="draft">Nháp</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </div>

      {/* Table */}
      {questionsQuery.isPending ? (
        <LoadingSpinner text="Đang tải câu hỏi..." />
      ) : questionsQuery.isError ? (
        <ErrorState message="Không thể tải danh sách câu hỏi." />
      ) : questionsQuery.data.data.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center">
          <HelpCircle size={32} className="mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">Không tìm thấy câu hỏi nào.</p>
          <Button asChild size="sm" className="mt-4 gap-2">
            <Link to="/admin/questions/new"><PlusCircle size={14} /> Tạo câu hỏi đầu tiên</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-2.5 text-left font-medium">Câu hỏi</th>
                    <th className="px-4 py-2.5 text-left font-medium">Loại</th>
                    <th className="px-4 py-2.5 text-left font-medium">Độ khó</th>
                    <th className="px-4 py-2.5 text-left font-medium">Trạng thái</th>
                    <th className="px-4 py-2.5 text-left font-medium">Chủ đề</th>
                    <th className="px-4 py-2.5 text-right font-medium">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {questionsQuery.data.data.map((q: QuestionWithRelations) => (
                    <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium truncate" title={q.prompt}>{q.prompt}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{q.points} điểm · {q.time_limit_seconds}s</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          {TYPE_LABELS[q.type] ?? q.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLE[q.difficulty] ?? ''}`}>
                          {q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'medium' ? 'TB' : 'Khó'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[q.status] ?? ''}`}>
                          {q.status === 'published' ? 'Đã đăng' : q.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {q.topics?.subjects?.name ?? '—'} / {q.topics?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild size="sm" variant="ghost" className="h-7 px-2">
                            <Link to={`/admin/questions/${q.id}`}><Edit2 size={13} /></Link>
                          </Button>
                          {deleteConfirmId === q.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => deleteMutation.mutate(q.id)}
                                disabled={deleteMutation.isPending}
                                className="text-xs text-destructive font-medium hover:underline"
                              >
                                Xác nhận
                              </button>
                              <button onClick={() => setDeleteConfirmId(null)} className="text-xs text-muted-foreground hover:underline ml-1">Huỷ</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(q.id)}
                              className="p-1 rounded hover:bg-muted text-muted-foreground"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Trang {page + 1} / {totalPages} · {questionsQuery.data.count} câu hỏi
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline" size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="gap-1"
                >
                  <ChevronLeft size={14} /> Trước
                </Button>
                <Button
                  variant="outline" size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="gap-1"
                >
                  Tiếp <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {deleteMutation.isError && (
        <div className="flex items-center gap-2 text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2">
          <AlertCircle size={15} />
          Lỗi khi xóa câu hỏi. Vui lòng thử lại.
        </div>
      )}
    </div>
  );
}
