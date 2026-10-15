import { Link } from 'react-router';
import {
  Layers,
  HelpCircle,
  FileCheck2,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/providers';

export function AdminOverviewPage() {
  const { user } = useAuth();

  const adminStats = [
    { label: 'Tổng lĩnh vực', count: '6', icon: Layers, href: '/admin/subjects' },
    { label: 'Ngân hàng câu hỏi', count: '120+', icon: HelpCircle, href: '/admin/questions' },
    { label: 'Đề thi đã xuất bản', count: '14', icon: FileCheck2, href: '/admin/exams' },
    { label: 'Nhập liệu hàng loạt', count: 'CSV/XLSX', icon: FileSpreadsheet, href: '/admin/import' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Trung tâm kiểm soát
            </span>
            <Badge variant="gold" className="text-[10px]">
              {user?.role}
            </Badge>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Admin Studio — Tổng quan hệ thống
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Quản trị nội dung giáo dục, câu hỏi, đề thi và giám sát hoạt động người dùng.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, i) => (
          <Card key={i} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted font-medium">{stat.label}</p>
              <p className="font-heading text-2xl font-black text-foreground mt-1 tabular-nums">
                {stat.count}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <stat.icon className="h-5 w-5" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hành động nhanh quản trị</CardTitle>
            <CardDescription className="text-xs">
              Các chức năng thường dùng cho biên tập viên và admin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link to="/admin/import">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span>Nhập câu hỏi từ file CSV / Excel</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link to="/admin/questions">
                <HelpCircle className="h-4 w-4 text-primary" />
                <span>Tạo câu hỏi mới vào ngân hàng</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link to="/admin/subjects">
                <Layers className="h-4 w-4 text-amber-700" />
                <span>Quản lý danh mục & chủ đề</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trạng thái bảo mật & RLS</CardTitle>
            <CardDescription className="text-xs">
              Tuân thủ ranh giới an toàn dữ liệu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-foreground-muted">
            <div className="flex items-center gap-2 text-success font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Row Level Security (RLS) đang kích hoạt trên mọi bảng</span>
            </div>
            <p className="leading-relaxed">
              Đáp án câu hỏi được bảo vệ độc quyền ở phía server database. Client chỉ nhận câu hỏi và lựa chọn, không thể trích xuất đáp án đúng trước hạn nộp bài.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
