// src/features/admin/services/adminUserService.ts
import { supabase } from '@/lib/supabase/client';
import { AppError } from '@/lib/errors';

export interface AdminUser {
  id: string;
  username: string;
  display_name: string;
  role: 'learner' | 'editor' | 'admin';
  xp: number;
  level: number;
  created_at: string;
}

export async function listUsersAdmin(params: {
  limit?: number;
  offset?: number;
  search?: string;
  role?: 'learner' | 'editor' | 'admin';
}): Promise<{ users: AdminUser[]; total: number }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('admin_list_users', {
    p_limit: params.limit ?? 20,
    p_offset: params.offset ?? 0,
    p_search: params.search ?? null,
    p_role: params.role ?? null,
  });

  if (error) throw AppError.fromSupabaseError(error);
  const result = data as unknown as { users: AdminUser[]; total: number };
  return { users: result.users ?? [], total: result.total ?? 0 };
}

export async function setUserRole(targetUserId: string, newRole: 'learner' | 'editor' | 'admin'): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)('admin_set_user_role', {
    p_target_user_id: targetUserId,
    p_new_role: newRole,
  });
  if (error) throw AppError.fromSupabaseError(error);
}
