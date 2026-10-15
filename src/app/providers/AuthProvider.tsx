import * as React from 'react';
import { supabase } from '@/lib/supabase/client';
import type { UserProfile, UserRole } from '@/types/auth';
import type { Session, User } from '@supabase/supabase-js';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const fetchProfile = React.useCallback(async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          email: user.email ?? '',
          username: data.username || user.email?.split('@')[0] || 'User',
          displayName: data.display_name || user.user_metadata?.full_name || 'User',
          avatarUrl: data.avatar_url || null,
          role: (data.role as UserRole) || 'learner',
          xp: data.xp || 0,
          level: data.level || 1,
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString(),
        });
      } else {
        const metaRole = (user.user_metadata?.role as UserRole) || 'learner';
        setProfile({
          id: user.id,
          email: user.email ?? '',
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
          displayName: user.user_metadata?.full_name || 'User',
          avatarUrl: user.user_metadata?.avatar_url || null,
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
        displayName: user.user_metadata?.full_name || 'User',
        avatarUrl: null,
        role: 'learner',
        xp: 0,
        level: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, []);

  const refreshProfile = React.useCallback(async () => {
    if (authUser) {
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
