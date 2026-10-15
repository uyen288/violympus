// src/features/admin/services/adminAuditService.ts
import { supabase } from '@/lib/supabase/client';
import { AppError } from '@/lib/errors';

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  target_entity: string;
  target_id: string | null;
  changes: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  profiles?: { display_name: string; username: string } | null;
}

export async function listAuditLogs(params: {
  limit?: number;
  offset?: number;
  action?: string;
  entity?: string;
}): Promise<{ data: AuditLog[]; count: number }> {
  let query = supabase
    .from('audit_logs')
    .select('*, profiles(display_name, username)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (params.action) query = query.ilike('action', `%${params.action}%`);
  if (params.entity) query = query.eq('target_entity', params.entity);
  if (params.limit) query = query.limit(params.limit);
  if (params.offset) query = query.range(params.offset, params.offset + (params.limit ?? 20) - 1);

  const { data, error, count } = await query;
  if (error) throw AppError.fromSupabaseError(error);
  return { data: (data ?? []) as unknown as AuditLog[], count: count ?? 0 };
}
