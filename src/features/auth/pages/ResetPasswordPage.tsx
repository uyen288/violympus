import * as React from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const resetSchema = z
  .object({
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu không được để trống'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary mb-3 shadow-xs">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">
            Đặt lại mật khẩu
          </CardTitle>
          <CardDescription className="text-xs">
            Nhập mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {authError && (
              <div
                className="rounded-lg bg-danger-soft border border-danger/20 p-3 text-xs font-medium text-danger text-left"
                role="alert"
              >
                {authError}
              </div>
            )}

            <Input
              label="Mật khẩu mới"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full font-bold"
              size="lg"
              isLoading={isSubmitting}
            >
              Cập nhật mật khẩu
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
