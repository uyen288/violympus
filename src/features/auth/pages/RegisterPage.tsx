import * as React from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Swords, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { mapSupabaseAuthError } from '@/lib/errors/AppError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Tên hiển thị phải có ít nhất 2 ký tự'),
    email: z.string().min(1, 'Email không được để trống').email('Định dạng email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu không được để trống'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setAuthError(null);
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.displayName,
            role: 'learner',
          },
        },
      });

      if (error) {
        const appErr = mapSupabaseAuthError(error);
        setAuthError(appErr.messageKey ? t(appErr.messageKey, error.message) : error.message);
        return;
      }

      if (authData.session) {
        toast.success(t('auth.registerSuccess', 'Đăng ký tài khoản thành công!'));
        navigate('/dashboard');
      } else {
        toast.info(
          'Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác nhận kích hoạt tài khoản.',
        );
        navigate('/login');
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo tài khoản');
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
            Tạo tài khoản Violympus
          </CardTitle>
          <CardDescription className="text-xs">
            Gia nhập đấu trường tri thức và rèn luyện năng lực mỗi ngày
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
              label="Họ và tên / Biệt danh"
              type="text"
              placeholder="Nguyễn Văn A"
              error={errors.displayName?.message}
              {...register('displayName')}
            />

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="ten@vi-du.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Mật khẩu"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Xác nhận mật khẩu"
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
              className="w-full gap-2 font-bold"
              size="lg"
              isLoading={isSubmitting}
            >
              <UserPlus className="h-4 w-4" />
              <span>{t('auth.register', 'Đăng ký tài khoản')}</span>
            </Button>

            <div className="text-center text-xs text-foreground-muted">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-bold text-primary hover:underline">
                {t('auth.login', 'Đăng nhập tại đây')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
