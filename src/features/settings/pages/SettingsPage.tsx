import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { ShieldCheck, Globe, User, KeyRound, ChevronRight, AlertTriangle } from 'lucide-react';

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

        {/* Profile and Security Quick Access */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Thông tin hồ sơ & Bảo mật</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Thay đổi tên hiển thị, tên người dùng, ảnh đại diện và mật khẩu tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <Link
              to="/profile"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-soft text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    Sửa thông tin cá nhân & Ảnh đại diện
                  </div>
                  <div className="text-xs text-foreground-muted">
                    Cập nhật họ tên, username, liên kết ảnh avatar
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-foreground-muted group-hover:text-foreground" />
            </Link>

            <Link
              to="/profile"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-soft text-primary">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    Thay đổi mật khẩu đăng nhập
                  </div>
                  <div className="text-xs text-foreground-muted">
                    Thiết lập mật khẩu mới cho tài khoản email
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-foreground-muted group-hover:text-foreground" />
            </Link>
          </CardContent>
        </Card>

        {/* Security setting */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-success" />
              <CardTitle className="text-base">Hạ tầng bảo mật tài khoản</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Mật khẩu và phiên đăng nhập được mã hóa và quản lý thông qua Supabase Auth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Tài khoản của bạn được bảo vệ bởi chứng chỉ mã hóa TLS và xác thực JWT token an toàn, hỗ trợ đăng nhập mật khẩu và Google OAuth 2.0.
            </p>
          </CardContent>
        </Card>

        {/* Danger zone link */}
        <Card className="border-danger/30 bg-danger-soft/10">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-danger" />
              <div>
                <div className="text-sm font-bold text-danger">Quản lý xóa tài khoản</div>
                <div className="text-xs text-foreground-muted">
                  Xóa tài khoản vĩnh viễn và các dữ liệu liên quan
                </div>
              </div>
            </div>
            <Button asChild variant="danger" size="sm">
              <Link to="/profile">Đi tới xóa tài khoản</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
