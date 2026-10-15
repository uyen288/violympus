import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorState } from '@/components/shared/ErrorState';
import { listAuditLogs, type AuditLog } from '@/features/admin/services/adminAuditService';

const PAGE_SIZE = 25;

const ACTION_LABEL: Record<string, string> = {
  create_subject: 'Tạo môn học',
  update_subject: 'Cập nhật môn học',
  archive_subject: 'Lưu trữ môn học',
  delete_subject: 'Xóa môn học',
  create_topic: 'Tạo chủ đề',
  update_topic: 'Cập nhật chủ đề',
  create_question: 'Tạo câu hỏi',
  update_question: 'Cập nhật câu hỏi',
  delete_question: 'Xóa câu hỏi',
  import_questions: 'Import câu hỏi',
  change_user_role: 'Đổi vai trò',
};

const ENTITY_BADGE: Record<string, string> = {
  subjects: 'bg-purple-100 text-purple-700',
  topics: 'bg-blue-100 text-blue-700',
  questions: 'bg-teal-100 text-teal-700',
  profiles: 'bg-amber-100 text-amber-700',
  content_import_jobs: 'bg-gray-100 text-gray-600',
};

export function AdminAuditPage() {
  const [page, setPage] = useState(0);
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');

  const auditQuery = useQuery({
    queryKey: ['admin', 'audit', { page, filterAction, filterEntity }],
    queryFn: () =>
      listAuditLogs({
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        action: filterAction || undefined,
        entity: filterEntity || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const totalPages = Math.ceil((auditQuery.data?.count ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nhật ký hoạt động</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Append-only · Không thể sửa hoặc xóa · Chỉ admin xem được
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={filterAction}
          onChange={(e) => { setFilterAction(e.target.value); setPage(0); }}
          placeholder="Lọc theo hành động..."
          className="h-9 rounded-md border border-input bg-background px-3 text-sm flex-1 min-w-36"
        />
        <select
          value={filterEntity}
          onChange={(e) => { setFilterEntity(e.target.value); setPage(0); }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Tất cả đối tượng</option>
          <option value="subjects">Môn học</option>
          <option value="topics">Chủ đề</option>
          <option value="questions">Câu hỏi</option>
          <option value="profiles">Người dùng</option>
          <option value="content_import_jobs">Import</option>
        </select>
      </div>

      {auditQuery.isPending ? (
        <LoadingSpinner text="Đang tải nhật ký..." />
      ) : auditQuery.isError ? (
        <ErrorState message="Không thể tải nhật ký hoạt động." />
      ) : auditQuery.data.data.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center text-muted-foreground text-sm">
          Không có bản ghi nhật ký nào.
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {auditQuery.data.data.map((log: AuditLog) => (
                <div key={log.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-muted grid place-items-center shrink-0 mt-0.5">
                    <Activity size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <p className="text-sm font-medium">
                        {ACTION_LABEL[log.action] ?? log.action}
                      </p>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${ENTITY_BADGE[log.target_entity] ?? 'bg-gray-100 text-gray-600'}`}>
                        {log.target_entity}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span>{log.profiles?.display_name ?? 'Unknown'} (@{log.profiles?.username ?? '?'})</span>
                      <span>·</span>
                      <span>{new Date(log.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {Object.entries(log.changes).map(([k, v]) => (
                          <span key={k} className="text-[10px] bg-muted rounded px-1.5 py-0.5 font-mono">
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {log.target_id && (
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 hidden sm:block">
                      {log.target_id.slice(0, 8)}…
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Trang {page + 1} / {totalPages} · {auditQuery.data.count} bản ghi
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="gap-1">
                  <ChevronLeft size={14} /> Trước
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="gap-1">
                  Tiếp <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
