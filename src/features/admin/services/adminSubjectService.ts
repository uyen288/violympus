// src/features/admin/services/adminSubjectService.ts
import { supabase } from '@/lib/supabase/client';
import { AppError } from '@/lib/errors';
import type { Tables } from '@/lib/supabase/database.types';

export type Subject = Tables<'subjects'>;

export interface UpsertSubjectPayload {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  sort_order?: number;
  status?: 'draft' | 'published' | 'archived';
}

export async function listSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw AppError.fromSupabaseError(error);
  return data ?? [];
}

export async function upsertSubject(payload: UpsertSubjectPayload): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('admin_upsert_subject', {
    p_id: payload.id ?? null,
    p_name: payload.name,
    p_slug: payload.slug,
    p_description: payload.description ?? null,
    p_icon_name: payload.icon_name ?? 'BookOpen',
    p_sort_order: payload.sort_order ?? 0,
    p_status: payload.status ?? 'published',
  });

  if (error) throw AppError.fromSupabaseError(error);
  return data as unknown;
}

export async function deleteSubject(id: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)('admin_delete_subject', { p_id: id });
  if (error) throw AppError.fromSupabaseError(error);
}
