import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle, ArrowLeft, Check, Plus, Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getQuestionAdmin, upsertQuestion } from '@/features/admin/services/adminQuestionService';
import { supabase } from '@/lib/supabase/client';

const optionSchema = z.object({
  key: z.string().min(1),
  content: z.string().min(1, 'Nội dung lựa chọn không được trống'),
  sort_order: z.number(),
});

const questionFormSchema = z.object({
  topic_id: z.string().min(1, 'Phải chọn chủ đề'),
  type: z.enum(['single_choice', 'multiple_choice', 'true_false', 'fill_blank', 'matching']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  prompt: z.string().min(1, 'Đề bài không được để trống'),
  explanation: z.string().optional(),
  points: z.number().int().min(1, 'Điểm tối thiểu là 1'),
  time_limit_seconds: z.number().int().min(5),
  status: z.enum(['draft', 'published', 'archived']),
  options: z.array(optionSchema),
  correct_keys: z.string().optional(),
  accepted_answers: z.string().optional(),
});
type QuestionFormValues = z.infer<typeof questionFormSchema>;

const TYPE_LABELS: Record<string, string> = {
  single_choice: 'Trắc nghiệm đơn',
  multiple_choice: 'Nhiều lựa chọn',
  true_false: 'Đúng / Sai',
  fill_blank: 'Điền đáp án',
  matching: 'Ghép cặp',
};

export function AdminQuestionFormPage() {
  const { questionId } = useParams<{ questionId?: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = !!questionId && questionId !== 'new';

  // Fetch subjects + topics for dropdown
  const subjectsQuery = useQuery({
    queryKey: ['admin', 'subjects-with-topics'],
    queryFn: async () => {
      const { data } = await supabase
        .from('subjects')
        .select('id, name, topics(id, name)')
        .order('sort_order');
      return (data ?? []) as unknown as Array<{ id: string; name: string; topics?: Array<{ id: string; name: string }> }>;
    },
  });

  // Fetch existing question if editing
  const questionQuery = useQuery({
    queryKey: ['admin', 'question', questionId],
    queryFn: () => getQuestionAdmin(questionId!),
    enabled: isEdit,
  });

  const {
    register, handleSubmit, control, reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      topic_id: '',
      type: 'single_choice',
      difficulty: 'medium',
      status: 'draft',
      prompt: '',
      explanation: '',
      points: 10,
      time_limit_seconds: 30,
      options: [
        { key: 'A', content: '', sort_order: 0 },
        { key: 'B', content: '', sort_order: 1 },
      ],
      correct_keys: '',
      accepted_answers: '',
    },
  });

  const { fields: optionFields, append, remove } = useFieldArray({ control, name: 'options' });
  const watchType = useWatch({ control, name: 'type' });

  // Populate form when editing
  useEffect(() => {
    if (!isEdit || !questionQuery.data) return;
    const { question, options, answer_payload } = questionQuery.data;
    const payload = answer_payload as Record<string, unknown> | null;
    reset({
      topic_id: question.topic_id,
      type: question.type as QuestionFormValues['type'],
      difficulty: question.difficulty as QuestionFormValues['difficulty'],
      prompt: question.prompt,
      explanation: question.explanation ?? '',
      points: question.points,
      time_limit_seconds: question.time_limit_seconds,
      status: question.status as QuestionFormValues['status'],
      options: options.map((o) => ({ key: o.option_key, content: o.content, sort_order: o.sort_order })),
      correct_keys: Array.isArray(payload?.keys) ? (payload.keys as string[]).join(';') : '',
      accepted_answers: Array.isArray(payload?.accepted) ? (payload.accepted as string[]).join('|') : '',
    });
  }, [isEdit, questionQuery.data, reset]);

  const upsertMutation = useMutation({
    mutationFn: (values: QuestionFormValues) => {
      // Build answer_payload
      let answer_payload: Record<string, unknown> | undefined;
      if (values.type === 'fill_blank') {
        answer_payload = { accepted: (values.accepted_answers ?? '').split('|').map((s) => s.trim()).filter(Boolean) };
      } else if (values.type !== 'matching') {
        answer_payload = { keys: (values.correct_keys ?? '').split(';').map((s) => s.trim()).filter(Boolean) };
      }

      return upsertQuestion({
        id: isEdit ? questionId : undefined,
        topic_id: values.topic_id,
        type: values.type,
        difficulty: values.difficulty,
        prompt: values.prompt,
        explanation: values.explanation,
        points: values.points,
        time_limit_seconds: values.time_limit_seconds,
        status: values.status,
        options: values.options,
        answer_payload,
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'questions'] });
      void navigate('/admin/questions');
    },
  });

  const needsOptions = ['single_choice', 'multiple_choice'].includes(watchType);
  const needsAnswer = watchType !== 'matching';
  const isFillBlank = watchType === 'fill_blank';

  const addOption = () => {
    const nextKey = String.fromCharCode(65 + optionFields.length);
    if (optionFields.length < 6) {
      append({ key: nextKey, content: '', sort_order: optionFields.length });
    }
  };

  if (isEdit && questionQuery.isPending) return <LoadingSpinner text="Đang tải câu hỏi..." />;

  // Build flat topic list from subjects
  const topics = (subjectsQuery.data ?? []).flatMap((s) =>
    (s.topics ?? []).map((t) => ({
      id: t.id,
      label: `${s.name} / ${t.name}`,
    }))
  );

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link to="/admin/questions"><ArrowLeft size={14} /> Quay lại</Link>
        </Button>
        <h1 className="text-xl font-bold tracking-tight">
          {isEdit ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit((v) => upsertMutation.mutate(v))} className="space-y-5">
        {/* Topic */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Chủ đề *</label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            {...register('topic_id')}
          >
            <option value="">— Chọn chủ đề —</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          {errors.topic_id && <p className="text-xs text-destructive mt-1">{errors.topic_id.message}</p>}
        </div>

        {/* Type & Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Loại câu hỏi *</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              {...register('type')}
            >
              {Object.entries(TYPE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Độ khó *</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              {...register('difficulty')}
            >
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>
        </div>

        {/* Prompt */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Đề bài (Tiếng Việt) *</label>
          <textarea
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y"
            placeholder="Nhập nội dung câu hỏi..."
            {...register('prompt')}
          />
          {errors.prompt && <p className="text-xs text-destructive mt-1">{errors.prompt.message}</p>}
        </div>

        {/* Options (for single/multiple choice) */}
        {needsOptions && (
          <div className="space-y-3">
            <label className="text-sm font-medium block">Các lựa chọn *</label>
            <div className="space-y-2">
              {optionFields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-md bg-muted text-muted-foreground flex items-center justify-center text-xs font-semibold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <Input
                    placeholder={`Nội dung lựa chọn ${String.fromCharCode(65 + idx)}`}
                    {...register(`options.${idx}.content` as const)}
                    className="h-9 text-sm flex-1"
                  />
                  {optionFields.length > 2 && (
                    <button type="button" onClick={() => remove(idx)} className="p-1.5 rounded hover:bg-muted text-muted-foreground">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
              {optionFields.length < 6 && (
                <Button type="button" variant="ghost" size="sm" onClick={addOption} className="gap-1.5 text-xs mt-1">
                  <Plus size={12} /> Thêm lựa chọn
                </Button>
              )}
            </div>
          </div>
        )}

        {/* True/False fixed options hint */}
        {watchType === 'true_false' && (
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-2.5 text-sm text-blue-700">
            Câu Đúng/Sai dùng hai lựa chọn cố định: <strong>true</strong> và <strong>false</strong>.
          </div>
        )}

        {/* Answer section */}
        {needsAnswer && (
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              {isFillBlank ? 'Đáp án chấp nhận (phân cách bằng |)' : 'Đáp án đúng (phân cách bằng ;)'}
            </label>
            <Input
              {...register(isFillBlank ? 'accepted_answers' : 'correct_keys')}
              placeholder={isFillBlank ? 'VD: 3.14|pi|3,14' : watchType === 'true_false' ? 'true hoặc false' : 'VD: A hoặc A;C'}
              className="h-9 text-sm font-mono"
            />
          </div>
        )}

        {/* Explanation */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Giải thích (tuỳ chọn)</label>
          <textarea
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y"
            placeholder="Giải thích đáp án đúng..."
            {...register('explanation')}
          />
        </div>

        {/* Points + Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Điểm *</label>
            <Input type="number" min={1} {...register('points', { valueAsNumber: true })} className="h-9 text-sm" />
            {errors.points && <p className="text-xs text-destructive mt-1">{errors.points.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Thời gian (giây)</label>
            <Input type="number" min={5} {...register('time_limit_seconds', { valueAsNumber: true })} className="h-9 text-sm" />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Trạng thái</label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            {...register('status')}
          >
            <option value="draft">Nháp</option>
            <option value="published">Đã đăng</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button
            type="submit"
            disabled={upsertMutation.isPending}
            className="gap-2"
          >
            <Check size={15} />
            {upsertMutation.isPending ? 'Đang lưu...' : isEdit ? 'Cập nhật câu hỏi' : 'Tạo câu hỏi'}
          </Button>
          <Button asChild variant="ghost" type="button">
            <Link to="/admin/questions">Huỷ</Link>
          </Button>
          {upsertMutation.isError && (
            <p className="text-xs text-destructive flex items-center gap-1 ml-2">
              <AlertCircle size={13} /> {String(upsertMutation.error)}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
