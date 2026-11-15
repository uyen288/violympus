import * as React from 'react';
import { supabase } from '@/lib/supabase/client';
import type { UserProfile, UserRole } from '@/types/auth';
import type { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const fetchProfile = React.useCallback(async (user: User) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If profile record is missing (HTTP 406 / PGRST116), self-heal via ensure_profile RPC
      if (error || !data) {
        const { data: ensuredProfile, error: rpcError } = await supabase.rpc('ensure_profile');
        if (!rpcError && ensuredProfile) {
          data = ensuredProfile;
          error = null;
        } else {
          // Fallback direct insert if RPC is not yet applied
          const newUsername =
            user.user_metadata?.username ||
            user.email?.split('@')[0] ||
            `user_${user.id.slice(0, 6)}`;
          const newDisplayName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.display_name ||
            user.email?.split('@')[0] ||
            'Người học';

          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email ?? `${user.id}@violympus.local`,
            username: newUsername,
            display_name: newDisplayName,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
            role: 'learner',
            xp: 0,
            level: 1,
            gems: 50,
            streak_days: 1,
            climb_high_score: 0,
            is_public: true,
          });

          const refetch = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!refetch.error && refetch.data) {
            data = refetch.data;
            error = null;
          }
        }
      }

      if (!error && data) {
        if (data.is_banned) {
          await supabase.auth.signOut();
          setProfile(null);
          setAuthUser(null);
          setSession(null);
          toast.error(`Tài khoản đã bị cấm: ${data.ban_reason || 'Vi phạm chính sách cộng đồng'}`);
          return;
        }

        setProfile({
          id: data.id,
          email: user.email ?? data.email ?? '',
          username: data.username || user.email?.split('@')[0] || 'User',
          displayName:
            data.display_name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            'User',
          avatarUrl:
            data.avatar_url ||
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null,
          role: (data.role as UserRole) || 'learner',
          xp: data.xp || 0,
          level: data.level || 1,
          gems: data.gems ?? 50,
          streakDays: data.streak_days ?? 1,
          isBanned: data.is_banned,
          banReason: data.ban_reason,
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString(),
        });
      } else {
        const metaRole = (user.user_metadata?.role as UserRole) || 'learner';
        setProfile({
          id: user.id,
          email: user.email ?? '',
          username:
            user.user_metadata?.username || user.email?.split('@')[0] || 'User',
          displayName:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            'User',
          avatarUrl:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null,
          role: metaRole,
          xp: 0,
          level: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch {
      setProfile({
        id: user.id,
        email: user.email ?? '',
        username: user.email?.split('@')[0] || 'User',
        displayName:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          'User',
        avatarUrl:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null,
        role: 'learner',
        xp: 0,
        level: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, []);

  const refreshProfile = React.useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setAuthUser(user);
      await fetchProfile(user);
    } else if (authUser) {
      await fetchProfile(authUser);
    }
  }, [authUser, fetchProfile]);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user).finally(() => setIsLoading(false));
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = React.useCallback(async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setProfile(null);
    setAuthUser(null);
    setSession(null);
    setIsLoading(false);
  }, []);

  const isAuthenticated = Boolean(session && profile);
  const isAdmin = profile?.role === 'admin';
  const isEditor = profile?.role === 'editor' || isAdmin;

  const value = React.useMemo(
    () => ({
      user: profile,
      authUser,
      session,
      isLoading,
      isAuthenticated,
      isAdmin,
      isEditor,
      signOut,
      refreshProfile,
    }),
    [profile, authUser, session, isLoading, isAuthenticated, isAdmin, isEditor, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
