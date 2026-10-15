import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  BookOpen, Edit2, PlusCircle, Trash2, X, Check, AlertCircle, ChevronUp, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorState } from '@/components/shared/ErrorState';
import {
  listSubjects, upsertSubject, deleteSubject, type Subject,
} from '@/features/admin/services/adminSubjectService';
import { supabase } from '@/lib/supabase/client';

const ICON_OPTIONS = [
  'BookOpen','Calculator','FlaskConical','Globe2','Layers3','Code2','Brain',
  'Atom','Scale','Landmark','Leaf','Map','Music','Palette','Sigma',
] as const;

const subjectSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug chỉ dùng chữ thường, số và dấu gạch ngang'),
  description: z.string().optional(),
  icon_name: z.string().default('BookOpen'),
  sort_order: z.coerce.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});
type SubjectForm = z.infer<typeof subjectSchema>;

interface TopicRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  subject_id: string;
}

export function AdminSubjectsPage() {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const subjectsQuery = useQuery({
    queryKey: ['admin', 'subjects'],
    queryFn: listSubjects,
  });

  const topicsQuery = useQuery({
    queryKey: ['admin', 'topics', expandedSubjectId],
    queryFn: async () => {
      if (!expandedSubjectId) return [];
      const { data } = await supabase
        .from('topics')
        .select('id, name, slug, status, subject_id')
        .eq('subject_id', expandedSubjectId)
        .order('sort_order');
      return (data ?? []) as TopicRow[];
    },
    enabled: !!expandedSubjectId,
  });

  const upsertMutation = useMutation({
    mutationFn: (payload: SubjectForm & { id?: string }) => upsertSubject(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      setEditingId(null);
      setIsCreating(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      setDeleteConfirmId(null);
    },
  });

  const {
    register, handleSubmit, reset,
    formState: { errors },
  } = useForm<SubjectForm>({ resolver: zodResolver(subjectSchema) as import('react-hook-form').Resolver<SubjectForm> });

  function startCreate() {
    reset({ name: '', slug: '', description: '', icon_name: 'BookOpen', sort_order: 0, status: 'published' });
    setIsCreating(true);
    setEditingId(null);
  }

  function startEdit(subject: Subject) {
    reset({
      name: subject.name,
      slug: subject.slug,
      description: subject.description ?? '',
      icon_name: subject.icon_name,
      sort_order: subject.sort_order,
      status: subject.status as SubjectForm['status'],
    });
    setEditingId(subject.id);
    setIsCreating(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
  }

  const onSubmit = (data: SubjectForm) => {
    upsertMutation.mutate({ ...data, id: editingId ?? undefined });
  };

  if (subjectsQuery.isPending) return <LoadingSpinner text="Đang tải môn học..." />;
  if (subjectsQuery.isError) return <ErrorState message="Không thể tải danh sách môn học." />;

  const subjects = subjectsQuery.data;

  const STATUS_BADGE: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-amber-100 text-amber-700',
    archived: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Môn học</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{subjects.length} môn học</p>
        </div>
        <Button onClick={startCreate} className="gap-2">
          <PlusCircle size={16} /> Thêm môn học
        </Button>
      </div>

      {/* Create / Edit form */}
      {(isCreating || editingId) && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4"
        >
          <p className="font-semibold text-sm">{isCreating ? 'Thêm môn học mới' : 'Chỉnh sửa môn học'}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium mb-1 block">Tên môn học *</label>
              <Input {...register('name')} placeholder="VD: Toán học" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Slug *</label>
              <Input {...register('slug')} placeholder="VD: toan-hoc" />
              {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium mb-1 block">Mô tả</label>
              <Input {...register('description')} placeholder="Mô tả ngắn về môn học" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Icon</label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                {...register('icon_name')}
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Trạng thái</label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                {...register('status')}
              >
                <option value="published">Đã đăng</option>
                <option value="draft">Nháp</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" size="sm" disabled={upsertMutation.isPending} className="gap-2">
              <Check size={14} /> {upsertMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={cancelEdit} className="gap-2">
              <X size={14} /> Huỷ
            </Button>
            {upsertMutation.isError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={13} /> {String(upsertMutation.error)}
              </p>
            )}
          </div>
        </form>
      )}

      {/* Subjects list */}
      <div className="rounded-xl border border-border overflow-hidden">
        {subjects.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Chưa có môn học nào. Nhấn "Thêm môn học" để bắt đầu.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {subjects.map((subject) => (
              <div key={subject.id}>
                {/* Subject row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                    <BookOpen size={17} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{subject.name}</p>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[subject.status] ?? ''}`}>
                        {subject.status === 'published' ? 'Đã đăng' : subject.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{subject.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedSubjectId(expandedSubjectId === subject.id ? null : subject.id)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                      title="Xem chủ đề"
                    >
                      {expandedSubjectId === subject.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button
                      onClick={() => startEdit(subject)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={15} />
                    </button>
                    {deleteConfirmId === subject.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteMutation.mutate(subject.id)}
                          disabled={deleteMutation.isPending}
                          className="text-xs text-destructive font-medium hover:underline"
                        >
                          Xác nhận xóa
                        </button>
                        <button onClick={() => setDeleteConfirmId(null)} className="text-xs text-muted-foreground hover:underline">Huỷ</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(subject.id)}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                        title="Xóa"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Topics expansion */}
                {expandedSubjectId === subject.id && (
                  <div className="bg-muted/30 px-6 py-3 space-y-1 border-t border-border">
                    {topicsQuery.isPending ? (
                      <p className="text-xs text-muted-foreground">Đang tải chủ đề...</p>
                    ) : topicsQuery.data && topicsQuery.data.length > 0 ? (
                      topicsQuery.data.map((topic) => (
                        <div key={topic.id} className="flex items-center gap-2 py-1">
                          <span className="text-xs text-foreground">{topic.name}</span>
                          <Badge variant="outline" className="text-[10px] h-4">{topic.slug}</Badge>
                          <span className={`text-[10px] ml-auto ${topic.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                            {topic.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">Chưa có chủ đề nào.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
