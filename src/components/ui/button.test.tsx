import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button component', () => {
  it('renders children correctly', () => {
    render(<Button>Bắt đầu ngay</Button>);
    expect(screen.getByRole('button', { name: /Bắt đầu ngay/i })).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Không khả dụng</Button>);
    const btn = screen.getByRole('button', { name: /Không khả dụng/i });
    expect(btn).toBeDisabled();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<Button isLoading>Đang gửi</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });
});
