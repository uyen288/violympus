import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  listUsersAdmin,
  setUserRole,
  banUser,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
} from './adminUserService';
import { supabase } from '@/lib/supabase/client';

vi.mock('@/lib/supabase/client', () => {
  const rpcMock = vi.fn();
  const fromMock = vi.fn();
  return {
    supabase: {
      rpc: rpcMock,
      from: fromMock,
    },
  };
});

describe('adminUserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listUsersAdmin', () => {
    it('calls admin_list_users RPC with mapped parameters', async () => {
      const mockUsers = [
        {
          id: 'u-1',
          username: 'user1',
          display_name: 'User One',
          role: 'learner',
          xp: 100,
          level: 2,
          is_banned: false,
          banned_at: null,
          ban_reason: null,
          created_at: '2026-01-01T00:00:00Z',
        },
      ];

      (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { users: mockUsers, total: 1 },
        error: null,
      });

      const res = await listUsersAdmin({ limit: 10, offset: 0, search: 'user' });
      expect(res.users).toEqual(mockUsers);
      expect(res.total).toBe(1);
    });
  });

  describe('setUserRole', () => {
    it('calls admin_set_user_role RPC', async () => {
      (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await setUserRole('u-1', 'editor');
      expect(supabase.rpc).toHaveBeenCalledWith('admin_set_user_role', {
        p_target_user_id: 'u-1',
        p_new_role: 'editor',
      });
    });
  });

  describe('banUser', () => {
    it('calls admin_ban_user RPC with ban flag and reason', async () => {
      (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true },
        error: null,
      });

      await banUser('u-2', true, 'Cheating in arena');
      expect(supabase.rpc).toHaveBeenCalledWith('admin_ban_user', {
        p_target_user_id: 'u-2',
        p_ban: true,
        p_reason: 'Cheating in arena',
      });
    });

    it('unbans user by passing ban=false', async () => {
      (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true },
        error: null,
      });

      await banUser('u-2', false);
      expect(supabase.rpc).toHaveBeenCalledWith('admin_ban_user', {
        p_target_user_id: 'u-2',
        p_ban: false,
        p_reason: null,
      });
    });
  });

  describe('createUserAdmin', () => {
    it('calls admin_create_user RPC', async () => {
      (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true, user_id: 'new-id' },
        error: null,
      });

      await createUserAdmin({
        email: 'test@example.com',
        displayName: 'Test User',
        username: 'testuser',
        role: 'learner',
        gems: 100,
      });

      expect(supabase.rpc).toHaveBeenCalledWith('admin_create_user', {
        p_email: 'test@example.com',
        p_display_name: 'Test User',
        p_username: 'testuser',
        p_role: 'learner',
        p_gems: 100,
      });
    });
  });

  describe('updateUserAdmin', () => {
    it('calls admin_update_user RPC', async () => {
      (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true },
        error: null,
      });

      await updateUserAdmin({
        userId: 'u-3',
        displayName: 'Updated Name',
        username: 'updatedname',
        role: 'editor',
        xp: 500,
        gems: 120,
      });

      expect(supabase.rpc).toHaveBeenCalledWith('admin_update_user', {
        p_target_user_id: 'u-3',
        p_display_name: 'Updated Name',
        p_username: 'updatedname',
        p_role: 'editor',
        p_xp: 500,
        p_gems: 120,
      });
    });
  });

  describe('deleteUserAdmin', () => {
    it('calls admin_delete_user RPC', async () => {
      (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { success: true },
        error: null,
      });

      await deleteUserAdmin('u-4');
      expect(supabase.rpc).toHaveBeenCalledWith('admin_delete_user', {
        p_target_user_id: 'u-4',
      });
    });
  });
});
