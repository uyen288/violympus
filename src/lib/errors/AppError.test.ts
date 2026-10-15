import { describe, it, expect } from 'vitest';
import { AppError, isAppError, mapSupabaseAuthError } from './AppError';

describe('AppError', () => {
  it('creates AppError with code and messageKey', () => {
    const err = new AppError({
      code: 'AUTH_REQUIRED',
      messageKey: 'auth.required',
      message: 'Session has expired',
    });

    expect(isAppError(err)).toBe(true);
    expect(err.code).toBe('AUTH_REQUIRED');
    expect(err.messageKey).toBe('auth.required');
  });

  it('maps Supabase invalid credentials correctly', () => {
    const err = mapSupabaseAuthError({ message: 'Invalid login credentials' });
    expect(err.code).toBe('AUTH_REQUIRED');
    expect(err.messageKey).toBe('auth.invalidCredentials');
  });

  it('maps unknown errors gracefully', () => {
    const err = mapSupabaseAuthError({ message: 'Unexpected server response' });
    expect(err.code).toBe('UNKNOWN');
    expect(err.messageKey).toBe('errors.unknown');
  });
});
