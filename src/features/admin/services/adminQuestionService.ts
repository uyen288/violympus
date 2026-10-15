// src/features/admin/services/adminQuestionService.ts
import { supabase } from '@/lib/supabase/client';
import { AppError } from '@/lib/errors';
import type { ContentStatus, DifficultyLevel, QuestionType, Tables } from '@/lib/supabase/database.types';

export type Question = Tables<'questions'>;
export type QuestionOption = Tables<'question_options'>;

export interface QuestionOptionPayload {
  key: string;
  content: string;
  sort_order?: number;
}

export interface UpsertQuestionPayload {
  id?: string;
  topic_id?: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  prompt: string;
  explanation?: string;
  points?: number;
  time_limit_seconds?: number;
  status?: ContentStatus;
  options?: QuestionOptionPayload[];
  answer_payload?: Record<string, unknown>;
}

export interface QuestionFilter {
  topic_id?: string;
  type?: string;
  difficulty?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface QuestionWithRelations {
  id: string;
  topic_id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  prompt: string;
  explanation: string | null;
  points: number;
  time_limit_seconds: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  topics?: { name: string; subject_id: string; subjects?: { name: string } | null } | null;
}

export async function listQuestionsAdmin(filter: QuestionFilter = {}): Promise<{ data: QuestionWithRelations[]; count: number }> {
  let query = supabase
    .from('questions')
    .select('id,topic_id,type,difficulty,prompt,explanation,points,time_limit_seconds,status,created_at,updated_at,topics(name,subject_id,subjects(name))', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filter.topic_id) query = query.eq('topic_id', filter.topic_id);
  if (filter.type) query = query.eq('type', filter.type as QuestionType);
  if (filter.difficulty) query = query.eq('difficulty', filter.difficulty as DifficultyLevel);
  if (filter.status) query = query.eq('status', filter.status as ContentStatus);
  if (filter.search) query = query.ilike('prompt', `%${filter.search}%`);
  if (filter.limit) query = query.limit(filter.limit);
  if (filter.offset !== undefined && filter.limit) {
    query = query.range(filter.offset, filter.offset + filter.limit - 1);
  }

  const { data, error, count } = await query;
  if (error) throw AppError.fromSupabaseError(error);
  return { data: (data ?? []) as unknown as QuestionWithRelations[], count: count ?? 0 };
}

export async function getQuestionAdmin(id: string): Promise<{ question: Question; options: QuestionOption[]; answer_payload: unknown }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('admin_get_question', { p_question_id: id });
  if (error) throw AppError.fromSupabaseError(error);
  return data as { question: Question; options: QuestionOption[]; answer_payload: unknown };
}

export async function upsertQuestion(payload: UpsertQuestionPayload): Promise<{ question_id: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('admin_upsert_question', {
    p_id: payload.id ?? null,
    p_topic_id: payload.topic_id ?? null,
    p_type: payload.type,
    p_difficulty: payload.difficulty,
    p_prompt: payload.prompt,
    p_explanation: payload.explanation ?? null,
    p_points: payload.points ?? 10,
    p_time_limit_seconds: payload.time_limit_seconds ?? 30,
    p_status: payload.status ?? 'draft',
    p_options: payload.options ? JSON.stringify(payload.options) : '[]',
    p_answer_payload: payload.answer_payload ? JSON.stringify(payload.answer_payload) : null,
  });

  if (error) throw AppError.fromSupabaseError(error);
  return data as { question_id: string };
}

export async function deleteQuestion(id: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)('admin_delete_question', { p_id: id });
  if (error) throw AppError.fromSupabaseError(error);
}
