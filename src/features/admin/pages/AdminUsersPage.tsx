import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle, ChevronLeft, ChevronRight, Search, Shield, ShieldCheck, User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorState } from '@/components/shared/ErrorState';
import {
  listUsersAdmin, setUserRole, type AdminUser,
} from '@/features/admin/services/adminUserService';

const PAGE_SIZE = 20;

const ROLE_STYLE: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  editor: 'bg-blue-100 text-blue-700',
  learner: 'bg-gray-100 text-gray-600',
};
const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin', editor: 'Editor', learner: 'Học viên',
};

export function AdminUsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'learner' | 'editor' | 'admin' | ''>('');
  const [changeRoleFor, setChangeRoleFor] = useState<AdminUser | null>(null);
  const [pendingRole, setPendingRole] = useState<'learner' | 'editor' | 'admin'>('learner');

  const usersQuery = useQuery({
    queryKey: ['admin', 'users', { page, search, filterRole }],
    queryFn: () =>
      listUsersAdmin({
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        search: search || undefined,
        role: filterRole || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'learner' | 'editor' | 'admin' }) =>
      setUserRole(userId, role),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setChangeRoleFor(null);
    },
  });

  const totalPages = Math.ceil((usersQuery.data?.total ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Người dùng & Vai trò</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {usersQuery.data?.total ?? 0} người dùng · chỉ admin mới truy cập được trang này
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Tìm theo tên hoặc username..."
            className="pl-8 h-9 text-sm"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => { setFilterRole(e.target.value as typeof filterRole); setPage(0); }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="learner">Học viên</option>
        </select>
      </div>

      {/* Role change dialog (inline) */}
      {changeRoleFor && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <p className="text-sm font-medium">
            Đổi vai trò cho <strong>{changeRoleFor.display_name}</strong> (@{changeRoleFor.username})
          </p>
          <div className="flex items-center gap-3">
            <select
              value={pendingRole}
              onChange={(e) => setPendingRole(e.target.value as typeof pendingRole)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="learner">Học viên</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <Button
              size="sm"
              onClick={() => roleMutation.mutate({ userId: changeRoleFor.id, role: pendingRole })}
              disabled={roleMutation.isPending || pendingRole === changeRoleFor.role}
              className="gap-2"
            >
              {roleMutation.isPending ? 'Đang lưu...' : 'Xác nhận'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setChangeRoleFor(null)}>Huỷ</Button>
          </div>
          {roleMutation.isError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle size={13} /> {String(roleMutation.error)}
            </p>
          )}
        </div>
      )}

      {/* Table */}
      {usersQuery.isPending ? (
        <LoadingSpinner text="Đang tải người dùng..." />
      ) : usersQuery.isError ? (
        <ErrorState message="Không thể tải danh sách người dùng." />
      ) : usersQuery.data.users.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center text-muted-foreground text-sm">
          Không tìm thấy người dùng nào.
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-2.5 text-left font-medium">Người dùng</th>
                    <th className="px-4 py-2.5 text-left font-medium">Vai trò</th>
                    <th className="px-4 py-2.5 text-left font-medium">XP / Cấp</th>
                    <th className="px-4 py-2.5 text-left font-medium">Ngày tham gia</th>
                    <th className="px-4 py-2.5 text-right font-medium">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usersQuery.data.users.map((user: AdminUser) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 grid place-items-center shrink-0">
                            <User size={15} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user.display_name}</p>
                            <p className="text-xs text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_STYLE[user.role] ?? ''}`}>
                          {user.role === 'admin' ? <Shield size={11} /> : user.role === 'editor' ? <ShieldCheck size={11} /> : <User size={11} />}
                          {ROLE_LABEL[user.role] ?? user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-medium">{user.xp.toLocaleString()}</span>
                        <span className="text-muted-foreground"> XP · Lv.{user.level}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => { setChangeRoleFor(user); setPendingRole(user.role); }}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Đổi vai trò
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Trang {page + 1} / {totalPages}
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
