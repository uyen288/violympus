import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const profileInfoSchema = z.object({
  displayName: z.string().min(2, 'Tên hiển thị phải có ít nhất 2 ký tự').max(50, 'Tối đa 50 ký tự'),
  username: z
    .string()
    .min(3, 'Tên người dùng phải có ít nhất 3 ký tự')
    .max(30, 'Tối đa 30 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên người dùng chỉ bao gồm chữ cái, số và dấu gạch dưới (_)'),
  avatarUrl: z.string().url('URL ảnh không hợp lệ').or(z.literal('')).optional(),
});

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu không được để trống'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

describe('Profile validation schemas', () => {
  it('validates correct profile info', () => {
    const valid = {
      displayName: 'Nguyễn Văn A',
      username: 'nguyenvana_99',
      avatarUrl: 'https://example.com/photo.png',
    };
    expect(profileInfoSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid username with special characters', () => {
    const invalid = {
      displayName: 'Nguyễn Văn A',
      username: 'user@name!',
      avatarUrl: '',
    };
    const result = profileInfoSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('allows empty avatarUrl as optional', () => {
    const valid = {
      displayName: 'Trần Bình',
      username: 'tranbinh',
      avatarUrl: '',
    };
    expect(profileInfoSchema.safeParse(valid).success).toBe(true);
  });

  it('validates password matching', () => {
    const valid = {
      newPassword: 'SecretPassword123',
      confirmPassword: 'SecretPassword123',
    };
    expect(passwordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects password mismatch', () => {
    const invalid = {
      newPassword: 'SecretPassword123',
      confirmPassword: 'DifferentPassword123',
    };
    const result = passwordSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 6 characters', () => {
    const invalid = {
      newPassword: '123',
      confirmPassword: '123',
    };
    const result = passwordSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
