import * as React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Swords, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { mapSupabaseAuthError } from '@/lib/errors/AppError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Định dạng email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        const appErr = mapSupabaseAuthError(error);
        setAuthError(appErr.messageKey ? t(appErr.messageKey, error.message) : error.message);
        return;
      }

      toast.success(t('auth.loginSuccess', 'Đăng nhập thành công!'));
      const redirect = searchParams.get('redirect');
      navigate(redirect ? decodeURIComponent(redirect) : '/dashboard');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi đăng nhập');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white mb-3 shadow-xs">
            <Swords className="h-6 w-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">
            Đăng nhập Violympus
          </CardTitle>
          <CardDescription className="text-xs">
            Chào mừng bạn quay lại! Nhập thông tin để tiếp tục học tập và thi đấu.
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
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="ten@vi-du.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-1">
              <Input
                label="Mật khẩu"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end pt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full gap-2 font-bold"
              size="lg"
              isLoading={isSubmitting}
            >
              <LogIn className="h-4 w-4" />
              <span>{t('auth.login', 'Đăng nhập')}</span>
            </Button>

            <div className="text-center text-xs text-foreground-muted">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline">
                {t('auth.register', 'Đăng ký ngay')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
