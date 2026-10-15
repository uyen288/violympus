import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      <div className="flex items-center gap-2">
        <Badge variant="warning" className="gap-1 text-xs">
          <AlertTriangle className="h-3 w-3" />
          <span>Dự thảo — Cần hoàn thiện pháp lý</span>
        </Badge>
      </div>

      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
        Chính sách bảo mật (Privacy Policy)
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quyền riêng tư & bảo vệ dữ liệu cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-foreground-muted leading-relaxed">
          <p>
            Văn bản này hiện là bản dự thảo cho phiên bản thử nghiệm. Mọi dữ liệu người dùng được lưu trữ trên nền tảng Supabase PostgreSQL tuân thủ cơ chế mã hóa lưu trữ (Encryption at Rest) và truyền tải (TLS).
          </p>
          <h2 className="text-base font-bold text-foreground pt-2">1. Thông tin thu thập</h2>
          <p>
            Chúng tôi chỉ thu thập địa chỉ email, tên hiển thị và dữ liệu điểm số, lịch sử làm bài để phục vụ trực tiếp cho tính năng bảng xếp hạng và theo dõi tiến độ học tập.
          </p>
          <h2 className="text-base font-bold text-foreground pt-2">2. Cam kết bảo mật</h2>
          <p>
            Violympus không chia sẻ, bán hoặc chuyển giao dữ liệu cá nhân của người học cho bên thứ ba cho mục đích tiếp thị hoặc quảng cáo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
