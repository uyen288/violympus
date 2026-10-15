import * as React from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound, ArrowLeft, MailCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const forgotSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Định dạng email không hợp lệ'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  const [isSent, setIsSent] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      setAuthError(null);
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      setIsSent(true);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary mb-3 shadow-xs">
            {isSent ? <MailCheck className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">
            {isSent ? 'Kiểm tra hộp thư' : 'Quên mật khẩu?'}
          </CardTitle>
          <CardDescription className="text-xs">
            {isSent
              ? 'Chúng tôi đã gửi đường dẫn đặt lại mật khẩu đến email của bạn nếu tài khoản tồn tại trong hệ thống.'
              : 'Nhập địa chỉ email đăng ký để nhận liên kết khôi phục mật khẩu.'}
          </CardDescription>
        </CardHeader>

        {!isSent ? (
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
                label="Email đăng ký"
                type="email"
                autoComplete="email"
                placeholder="ten@vi-du.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full font-bold"
                size="lg"
                isLoading={isSubmitting}
              >
                Gửi liên kết khôi phục
              </Button>

              <div className="text-center text-xs">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Quay lại đăng nhập</span>
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col gap-4">
            <Button asChild className="w-full font-bold" size="lg">
              <Link to="/login">Quay lại đăng nhập</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
