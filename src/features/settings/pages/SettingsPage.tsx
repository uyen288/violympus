import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { ShieldCheck, Globe } from 'lucide-react';

export function SettingsPage() {

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Cài đặt tài khoản
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted mt-1">
          Tùy chỉnh ngôn ngữ hiển thị và cấu hình tài khoản của bạn.
        </p>
      </div>

      <div className="space-y-4">
        {/* Language setting */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Ngôn ngữ hiển thị (Language)</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Lựa chọn ngôn ngữ sử dụng cho giao diện toàn bộ ứng dụng
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm font-medium">Ngôn ngữ hiện tại:</span>
            <LanguageSwitcher />
          </CardContent>
        </Card>

        {/* Security setting */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-success" />
              <CardTitle className="text-base">Bảo mật tài khoản</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Mật khẩu và phiên đăng nhập được quản lý thông qua Supabase Auth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Tài khoản của bạn được bảo vệ bởi chứng chỉ mã hóa TLS và xác thực JWT token.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
