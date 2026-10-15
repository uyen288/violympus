import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      <div className="flex items-center gap-2">
        <Badge variant="warning" className="gap-1 text-xs">
          <AlertTriangle className="h-3 w-3" />
          <span>Dự thảo — Cần hoàn thiện pháp lý</span>
        </Badge>
      </div>

      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
        Điều khoản dịch vụ (Terms of Service)
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông báo pháp lý quan trọng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-foreground-muted leading-relaxed">
          <p>
            Văn bản này hiện là bản dự thảo phục vụ cho phiên bản thử nghiệm (MVP) của dự án Violympus.
            Chưa có giá trị cam kết pháp lý chính thức cho đến khi được rà soát bởi đội ngũ chuyên gia tư vấn luật.
          </p>
          <h2 className="text-base font-bold text-foreground pt-2">1. Quyền sở hữu nội dung</h2>
          <p>
            Mọi câu hỏi, hình ảnh, tài liệu giáo dục và mã nguồn thuộc bản quyền của Violympus hoặc các tác giả cấp phép. Người dùng không được sao chép với mục đích thương mại khi chưa có sự đồng ý bằng văn bản.
          </p>
          <h2 className="text-base font-bold text-foreground pt-2">2. Quy định thi đấu & chống gian lận</h2>
          <p>
            Hệ thống áp dụng chấm điểm và xác minh độc quyền từ phía server. Các hành vi can thiệp trái phép vào gói tin websocket, cố ý giả mạo dữ liệu nộp bài hoặc khai thác lỗ hổng sẽ dẫn tới khóa tài khoản vĩnh viễn.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
