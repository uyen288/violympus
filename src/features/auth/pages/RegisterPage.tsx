import * as React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Swords, UserPlus, MailCheck, ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
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

  // Multi-step: 'form' -> 'otp'
  const [step, setStep] = React.useState<'form' | 'otp'>('form');
  const [registeredEmail, setRegisteredEmail] = React.useState<string>('');
  const [otpCode, setOtpCode] = React.useState<string>('');
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);
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
  const googleRedirectUrl = `${window.location.origin}${redirectTarget.startsWith('/') ? redirectTarget : `/${redirectTarget}`}`;

  // Countdown timer for resend OTP
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
          data: {
            full_name: data.displayName.trim(),
            role: 'learner',
          },
        },
      });

      if (error) {
        const appErr = mapSupabaseAuthError(error);
        setAuthError(appErr.messageKey ? t(appErr.messageKey, error.message) : error.message);
        return;
      }

      // If user session exists immediately (e.g., email confirmation turned off on Supabase)
      if (authData.session) {
        toast.success(t('auth.registerSuccess', 'Đăng ký tài khoản thành công!'));
        navigate(redirectTarget);
        return;
      }

      // Otherwise, transition to OTP entry step
      setRegisteredEmail(data.email.trim());
      setStep('otp');
      setResendCooldown(60);
      setOtpError(null);
      toast.info('Mã xác thực OTP đã được gửi đến email của bạn.');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo tài khoản');
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setOtpError('Vui lòng nhập đầy đủ mã OTP 6 chữ số');
      return;
    }

    try {
      setIsVerifying(true);
      setOtpError(null);

      const { data, error } = await supabase.auth.verifyOtp({
        email: registeredEmail,
        token: otpCode.trim(),
        type: 'signup',
      });

      if (error) {
        setOtpError('Mã xác thực không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại.');
        return;
      }

      if (data.session || data.user) {
        toast.success('Xác thực tài khoản thành công! Chào mừng bạn đến với Violympus.');
        navigate(redirectTarget);
      } else {
        toast.success('Xác thực thành công. Vui lòng đăng nhập để tiếp tục.');
        navigate('/login');
      }
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Lỗi xác thực mã OTP. Vui lòng thử lại.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    try {
      setIsResending(true);
      setOtpError(null);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registeredEmail,
      });

      if (error) {
        setOtpError(error.message);
        return;
      }

      setResendCooldown(60);
      toast.success('Đã gửi lại mã xác thực tới email của bạn.');
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Không thể gửi lại mã xác nhận.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border-border">
        {step === 'form' ? (
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
                redirectTo={googleRedirectUrl}
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
          /* OTP Verification Step */
          <>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary mb-3 shadow-xs">
                <MailCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">
                Xác thực tài khoản
              </CardTitle>
              <CardDescription className="text-xs space-y-1">
                <span>Mã xác thực (OTP) 6 chữ số đã được gửi tới email:</span>
                <span className="block font-semibold text-foreground">{registeredEmail}</span>
              </CardDescription>
            </CardHeader>

            <form onSubmit={onVerifyOtp}>
              <CardContent className="space-y-4">
                {otpError && (
                  <div
                    className="rounded-lg bg-danger-soft border border-danger/20 p-3 text-xs font-medium text-danger text-left"
                    role="alert"
                  >
                    {otpError}
                  </div>
                )}

                <div className="rounded-lg bg-surface-muted/50 border border-border p-3 text-xs text-foreground-muted leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      Vui lòng kiểm tra hộp thư đến (và thư rác/spam). Nhập mã 6 số để kích hoạt tài khoản ngay.
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-center">
                  <label htmlFor="otp-input" className="block text-sm font-semibold text-foreground">
                    Mã xác thực OTP (6 chữ số)
                  </label>
                  <input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="••••••"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-2xl font-bold tracking-[0.4em] font-mono h-12 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    autoFocus
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full gap-2 font-bold"
                  size="lg"
                  isLoading={isVerifying}
                  disabled={otpCode.length < 6 || isVerifying}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Xác nhận & Vào trang chủ</span>
                </Button>

                <div className="flex items-center justify-between w-full pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('form');
                      setOtpCode('');
                      setOtpError(null);
                    }}
                    className="inline-flex items-center gap-1 text-foreground-muted hover:text-foreground font-medium cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Đổi thông tin</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isResending}
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium disabled:opacity-50 disabled:no-underline cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>
                      {resendCooldown > 0
                        ? `Gửi lại mã (${resendCooldown}s)`
                        : isResending
                          ? 'Đang gửi...'
                          : 'Gửi lại mã'}
                    </span>
                  </button>
                </div>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
