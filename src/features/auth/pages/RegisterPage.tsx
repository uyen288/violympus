import * as React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Swords, UserPlus, MailCheck, ArrowLeft, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { mapSupabaseAuthError } from '@/lib/errors/AppError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { GoogleAuthButton } from '@/features/auth/components/GoogleAuthButton';
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
  const [searchParams] = useSearchParams();

  // Confirmation email sent state
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = React.useState<string>('');
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isResending, setIsResending] = React.useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = React.useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const redirectParam = searchParams.get('redirect');
  const redirectTarget = redirectParam ? decodeURIComponent(redirectParam) : '/dashboard';
  const confirmationRedirectUrl = `${window.location.origin}${redirectTarget.startsWith('/') ? redirectTarget : `/${redirectTarget}`}`;

  // Countdown timer for resend email
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setAuthError(null);
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          emailRedirectTo: confirmationRedirectUrl,
          data: {
            full_name: data.displayName.trim(),
            role: 'learner',
          },
        },
      });

      if (error) {
        const appErr = mapSupabaseAuthError(error);
        const translated = appErr.messageKey
          ? t(appErr.messageKey, { defaultValue: appErr.message })
          : appErr.message;
        setAuthError(translated);
        return;
      }

      // If user session exists immediately (e.g. email confirmation disabled on Supabase)
      if (authData.session) {
        toast.success(t('auth.registerSuccess', 'Đăng ký tài khoản thành công!'));
        navigate(redirectTarget);
        return;
      }

      // Traditional flow: prompt user to check email and click confirmation link
      setRegisteredEmail(data.email.trim());
      setIsSubmitted(true);
      setResendCooldown(60);
      toast.info('Liên kết xác nhận đã được gửi đến email của bạn.');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo tài khoản');
    }
  };

  const handleResendConfirmation = async () => {
    if (resendCooldown > 0 || isResending) return;
    try {
      setIsResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registeredEmail,
        options: {
          emailRedirectTo: confirmationRedirectUrl,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setResendCooldown(60);
      toast.success(t('auth.confirmation_sent', 'Đã gửi lại liên kết xác nhận đến email của bạn.'));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể gửi lại email xác nhận.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border-border">
        {!isSubmitted ? (
          <>
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

            <CardContent className="space-y-4">
              {authError && (
                <div
                  className="rounded-lg bg-danger-soft border border-danger/20 p-3 text-xs font-medium text-danger text-left"
                  role="alert"
                >
                  {authError}
                </div>
              )}

              {/* Google OAuth Register */}
              <GoogleAuthButton
                mode="register"
                redirectTo={confirmationRedirectUrl}
                onError={(msg) => setAuthError(msg)}
              />

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface px-2 text-foreground-muted font-medium">
                    {t('auth.or_continue_with', 'Hoặc đăng ký bằng email')}
                  </span>
                </div>
              </div>

              <form id="register-form" onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
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
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                form="register-form"
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
          </>
        ) : (
          /* Check Email Confirmation Card */
          <>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-3 shadow-xs">
                <MailCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">
                Kiểm tra email của bạn
              </CardTitle>
              <CardDescription className="text-xs">
                Chúng tôi đã gửi một liên kết kích hoạt đến địa chỉ:
              </CardDescription>
              <div className="mt-2">
                <span className="inline-block rounded-lg bg-surface-muted px-3 py-1 font-mono text-xs font-semibold text-foreground border border-border">
                  {registeredEmail}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border bg-surface-muted/40 p-4 text-xs text-foreground-muted leading-relaxed space-y-2 text-left">
                <p>
                  Vui lòng mở hộp thư đến (hoặc kiểm tra thư mục Spam/Quảng cáo) và nhấp vào liên kết xác nhận tài khoản.
                </p>
                <p>
                  Sau khi nhấp vào liên kết, bạn sẽ được tự động kích hoạt tài khoản và chuyển hướng thẳng tới trang chủ Violympus.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 font-medium"
                onClick={handleResendConfirmation}
                disabled={resendCooldown > 0 || isResending}
              >
                <RotateCcw className="h-4 w-4" />
                <span>
                  {resendCooldown > 0
                    ? `Gửi lại liên kết (${resendCooldown}s)`
                    : isResending
                      ? 'Đang gửi...'
                      : 'Gửi lại email xác nhận'}
                </span>
              </Button>

              <div className="flex items-center justify-between w-full pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center gap-1 text-foreground-muted hover:text-foreground font-medium cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Đổi thông tin đăng ký</span>
                </button>

                <Link
                  to="/login"
                  className="font-bold text-primary hover:underline"
                >
                  Đến trang đăng nhập
                </Link>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
