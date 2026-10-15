export type UserRole = 'learner' | 'editor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  xp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEditor: boolean;
}
