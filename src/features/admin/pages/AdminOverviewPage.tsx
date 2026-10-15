import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
  Upload,
  Users,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorState } from '@/components/shared/ErrorState';
import { Badge } from '@/components/ui/badge';
import { listAuditLogs } from '@/features/admin/services/adminAuditService';

interface StatsData {
  totalQuestions: number;
  publishedQuestions: number;
  draftQuestions: number;
  totalSubjects: number;
  totalTopics: number;
  totalUsers: number;
}

async function fetchAdminStats(): Promise<StatsData> {
  const [questionsRes, subjectsRes, topicsRes, usersRes] = await Promise.all([
    supabase.from('questions').select('status', { count: 'exact', head: false }),
    supabase.from('subjects').select('id', { count: 'exact', head: true }),
    supabase.from('topics').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ]);

  const questions = questionsRes.data ?? [];
  const published = questions.filter((q) => q.status === 'published').length;
  const draft = questions.filter((q) => q.status === 'draft').length;

  return {
    totalQuestions: questionsRes.count ?? 0,
    publishedQuestions: published,
    draftQuestions: draft,
    totalSubjects: subjectsRes.count ?? 0,
    totalTopics: topicsRes.count ?? 0,
    totalUsers: usersRes.count ?? 0,
  };
}

const ACTION_LABEL: Record<string, string> = {
  create_subject: 'Tạo môn học',
  update_subject: 'Cập nhật môn học',
  archive_subject: 'Lưu trữ môn học',
  delete_subject: 'Xóa môn học',
  create_question: 'Tạo câu hỏi',
  update_question: 'Cập nhật câu hỏi',
  delete_question: 'Xóa câu hỏi',
  import_questions: 'Import câu hỏi',
  change_user_role: 'Đổi vai trò',
};

export function AdminOverviewPage() {
  const statsQuery = useQuery({ queryKey: ['admin', 'stats'], queryFn: fetchAdminStats });
  const auditQuery = useQuery({
    queryKey: ['admin', 'audit', 'recent'],
    queryFn: () => listAuditLogs({ limit: 8 }),
  });

  if (statsQuery.isPending) return <LoadingSpinner text="Đang tải thống kê..." />;
  if (statsQuery.isError) return <ErrorState message="Không thể tải thống kê admin." />;

  const stats = statsQuery.data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tổng quan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trạng thái nội dung và hoạt động gần đây của Violympus Admin Studio.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Câu hỏi', value: stats.totalQuestions, icon: HelpCircle, color: 'text-blue-600 bg-blue-50' },
          { label: 'Đã đăng', value: stats.publishedQuestions, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
          { label: 'Nháp', value: stats.draftQuestions, icon: FileQuestion, color: 'text-amber-600 bg-amber-50' },
          { label: 'Môn học', value: stats.totalSubjects, icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
          { label: 'Chủ đề', value: stats.totalTopics, icon: Activity, color: 'text-teal-600 bg-teal-50' },
          { label: 'Người dùng', value: stats.totalUsers, icon: Users, color: 'text-sky-600 bg-sky-50' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-background p-4 flex flex-col gap-2"
          >
            <div className={`w-9 h-9 rounded-lg grid place-items-center ${item.color}`}>
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{item.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Truy cập nhanh</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { to: '/admin/subjects', label: 'Quản lý môn học', icon: BookOpen },
            { to: '/admin/questions', label: 'Ngân hàng câu hỏi', icon: HelpCircle },
            { to: '/admin/import', label: 'Import CSV/XLSX', icon: Upload },
            { to: '/admin/users', label: 'Người dùng & Vai trò', icon: Users },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <link.icon size={18} className="text-primary shrink-0" />
              <span className="text-sm font-medium">{link.label}</span>
              <ArrowRight size={14} className="ml-auto text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent audit log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Hoạt động gần đây</h2>
          <Link to="/admin/audit" className="text-xs text-primary hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight size={12} />
          </Link>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          {auditQuery.isPending ? (
            <div className="p-6 flex justify-center"><LoadingSpinner /></div>
          ) : auditQuery.isError ? (
            <div className="p-6 flex items-center gap-2 text-destructive text-sm">
              <AlertCircle size={16} /> Không thể tải nhật ký hoạt động.
            </div>
          ) : auditQuery.data.data.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Chưa có hoạt động nào.</div>
          ) : (
            <div className="divide-y divide-border">
              {auditQuery.data.data.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-muted grid place-items-center shrink-0">
                    <Activity size={14} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {ACTION_LABEL[log.action] ?? log.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.profiles?.display_name ?? 'Unknown'} ·{' '}
                      {new Date(log.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto shrink-0 text-xs">
                    {log.target_entity}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
