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
  gems?: number;
  streakDays?: number;
  isBanned?: boolean;
  banReason?: string | null;
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
