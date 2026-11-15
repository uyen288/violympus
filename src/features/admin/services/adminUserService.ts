// src/features/admin/services/adminUserService.ts
import { supabase } from '@/lib/supabase/client';
import { AppError } from '@/lib/errors';

export interface AdminUser {
  id: string;
  email?: string;
  username: string;
  display_name: string;
  role: 'learner' | 'editor' | 'admin';
  xp: number;
  level: number;
  gems?: number;
  is_banned: boolean;
  banned_at: string | null;
  ban_reason: string | null;
  created_at: string;
}

export interface CreateUserInput {
  email: string;
  displayName: string;
  username: string;
  role?: 'learner' | 'editor' | 'admin';
  gems?: number;
}

export interface UpdateUserInput {
  userId: string;
  displayName: string;
  username: string;
  role: 'learner' | 'editor' | 'admin';
  xp?: number;
  gems?: number;
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

  if (error) {
    // Fallback directly to profiles table query if RPC fails or is unavailable
    let query = supabase
      .from('profiles')
      .select('id, email, username, display_name, role, xp, level, gems, is_banned, banned_at, ban_reason, created_at', { count: 'exact' });

    if (params.search) {
      query = query.or(`display_name.ilike.%${params.search}%,username.ilike.%${params.search}%`);
    }
    if (params.role) {
      query = query.eq('role', params.role);
    }

    const { data: fallbackData, count, error: fallbackError } = await query
      .range(params.offset ?? 0, (params.offset ?? 0) + (params.limit ?? 20) - 1)
      .order('created_at', { ascending: false });

    if (fallbackError) throw AppError.fromSupabaseError(fallbackError);

    const mapped = (fallbackData ?? []).map((row) => ({
      id: row.id,
      email: row.email,
      username: row.username,
      display_name: row.display_name,
      role: row.role as 'learner' | 'editor' | 'admin',
      xp: row.xp,
      level: row.level,
      gems: row.gems,
      is_banned: row.is_banned ?? false,
      banned_at: row.banned_at,
      ban_reason: row.ban_reason,
      created_at: row.created_at,
    }));

    return { users: mapped, total: count ?? mapped.length };
  }

  const result = data as unknown as { users: AdminUser[]; total: number };
  return { users: result.users ?? [], total: result.total ?? 0 };
}

export async function setUserRole(targetUserId: string, newRole: 'learner' | 'editor' | 'admin'): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)('admin_set_user_role', {
    p_target_user_id: targetUserId,
    p_new_role: newRole,
  });
  if (error) {
    // Fallback direct update
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', targetUserId);
    if (updateError) throw AppError.fromSupabaseError(updateError);
  }
}

export async function banUser(targetUserId: string, ban: boolean, reason?: string): Promise<void> {
  const { error } = await supabase.rpc('admin_ban_user', {
    p_target_user_id: targetUserId,
    p_ban: ban,
    p_reason: reason ?? null,
  });
  if (error) {
    // Fallback direct update
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_banned: ban,
        banned_at: ban ? new Date().toISOString() : null,
        ban_reason: ban ? (reason ?? 'Vi phạm quy định') : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);
    if (updateError) throw AppError.fromSupabaseError(updateError);
  }
}

export async function createUserAdmin(input: CreateUserInput): Promise<void> {
  const { error } = await supabase.rpc('admin_create_user', {
    p_email: input.email,
    p_display_name: input.displayName,
    p_username: input.username,
    p_role: input.role ?? 'learner',
    p_gems: input.gems ?? 50,
  });

  if (error) {
    // Fallback: direct insert to profiles
    const { error: insertError } = await supabase.from('profiles').insert({
      id: crypto.randomUUID(),
      email: input.email,
      username: input.username,
      display_name: input.displayName,
      role: input.role ?? 'learner',
      xp: 0,
      level: 1,
      gems: input.gems ?? 50,
      streak_days: 1,
      is_banned: false,
    });
    if (insertError) throw AppError.fromSupabaseError(insertError);
  }
}

export async function updateUserAdmin(input: UpdateUserInput): Promise<void> {
  const { error } = await supabase.rpc('admin_update_user', {
    p_target_user_id: input.userId,
    p_display_name: input.displayName,
    p_username: input.username,
    p_role: input.role,
    p_xp: input.xp ?? null,
    p_gems: input.gems ?? null,
  });

  if (error) {
    // Fallback: direct update to profiles
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        display_name: input.displayName,
        username: input.username,
        role: input.role,
        ...(input.xp !== undefined ? { xp: input.xp } : {}),
        ...(input.gems !== undefined ? { gems: input.gems } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.userId);
    if (updateError) throw AppError.fromSupabaseError(updateError);
  }
}

export async function deleteUserAdmin(targetUserId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_delete_user', {
    p_target_user_id: targetUserId,
  });

  if (error) {
    // Fallback: direct delete from profiles
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', targetUserId);
    if (deleteError) throw AppError.fromSupabaseError(deleteError);
  }
}
