import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AuthError } from '@supabase/supabase-js';
import { GoogleAuthButton } from './GoogleAuthButton';
import { supabase } from '@/lib/supabase/client';

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
    },
  },
}));

vi.mock('@/lib/errors/reportError', () => ({
  reportError: vi.fn(),
}));

describe('GoogleAuthButton component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders default text for login mode', () => {
    render(<GoogleAuthButton mode="login" />);
    expect(
      screen.getByRole('button', { name: /Đăng nhập với Google/i }),
    ).toBeInTheDocument();
  });

  it('renders default text for register mode', () => {
    render(<GoogleAuthButton mode="register" />);
    expect(
      screen.getByRole('button', { name: /Đăng ký với Google/i }),
    ).toBeInTheDocument();
  });

  it('renders custom text when provided', () => {
    render(<GoogleAuthButton text="Tiếp tục với Google ID" />);
    expect(
      screen.getByRole('button', { name: /Tiếp tục với Google ID/i }),
    ).toBeInTheDocument();
  });

  it('triggers supabase signInWithOAuth on click', async () => {
    const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth);
    mockSignInWithOAuth.mockResolvedValueOnce({
      data: { provider: 'google', url: 'https://accounts.google.com' },
      error: null,
    });

    render(<GoogleAuthButton mode="login" redirectTo="http://localhost:5173/dashboard" />);
    const button = screen.getByRole('button', { name: /Đăng nhập với Google/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/dashboard',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  });

  it('calls onError callback when signInWithOAuth returns error', async () => {
    const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth);
    mockSignInWithOAuth.mockResolvedValueOnce({
      data: { provider: 'google', url: null },
      error: new AuthError('Popup closed by user'),
    });

    const onErrorMock = vi.fn();
    render(<GoogleAuthButton onError={onErrorMock} />);
    const button = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(onErrorMock).toHaveBeenCalledWith('Popup closed by user');
  });
});
