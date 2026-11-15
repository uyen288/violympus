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
import { GoogleAuthButton } from '@/features/auth/components/GoogleAuthButton';
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
  const [isResendingConfirm, setIsResendingConfirm] = React.useState<boolean>(false);

  const oauthError = searchParams.get('error_description')
    ? decodeURIComponent(searchParams.get('error_description') || '')
    : null;
  const currentError = authError || oauthError;
  const isEmailUnconfirmed = Boolean(
    currentError?.includes('chưa được xác nhận') || currentError?.includes('not confirmed'),
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const redirectParam = searchParams.get('redirect');
  const redirectTarget = redirectParam ? decodeURIComponent(redirectParam) : '/dashboard';
  const googleRedirectUrl = `${window.location.origin}${redirectTarget.startsWith('/') ? redirectTarget : `/${redirectTarget}`}`;

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        const appErr = mapSupabaseAuthError(error);
        const translated = appErr.messageKey
          ? t(appErr.messageKey, { defaultValue: appErr.message })
          : appErr.message;
        setAuthError(translated);
        return;
      }

      toast.success(t('auth.loginSuccess', 'Đăng nhập thành công!'));
      navigate(redirectTarget);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi đăng nhập');
    }
  };

  const handleResendConfirmation = async () => {
    const emailVal = getValues('email');
    if (!emailVal) {
      toast.error('Vui lòng nhập địa chỉ email vào ô bên dưới trước khi gửi lại.');
      return;
    }
    try {
      setIsResendingConfirm(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailVal,
        options: {
          emailRedirectTo: googleRedirectUrl,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('auth.confirmation_sent', 'Đã gửi liên kết xác nhận đến email của bạn.'));
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể gửi lại email xác nhận');
    } finally {
      setIsResendingConfirm(false);
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

        <CardContent className="space-y-4">
          {currentError && (
            <div
              className="rounded-lg bg-danger-soft border border-danger/20 p-3 text-xs font-medium text-danger text-left space-y-1.5"
              role="alert"
            >
              <div>{currentError}</div>
              {isEmailUnconfirmed && (
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={isResendingConfirm}
                  className="inline-flex items-center gap-1 font-bold underline cursor-pointer hover:opacity-80 text-primary"
                >
                  {isResendingConfirm
                    ? 'Đang gửi email...'
                    : 'Bấm vào đây để gửi lại email kích hoạt'}
                </button>
              )}
            </div>
          )}

          {/* Google OAuth Login */}
          <GoogleAuthButton
            mode="login"
            redirectTo={googleRedirectUrl}
            onError={(msg) => setAuthError(msg)}
          />

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-foreground-muted font-medium">
                {t('auth.or_continue_with', 'Hoặc đăng nhập bằng email')}
              </span>
            </div>
          </div>

          <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            form="login-form"
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
      </Card>
    </div>
  );
}
