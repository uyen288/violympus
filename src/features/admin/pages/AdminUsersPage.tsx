import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Ban,
  ChevronLeft,
  ChevronRight,
  Edit2,
  PlusCircle,
  Search,
  Shield,
  ShieldCheck,
  ShieldOff,
  Trash2,
  User,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorState } from '@/components/shared/ErrorState';
import {
  listUsersAdmin,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  banUser,
  type AdminUser,
  type CreateUserInput,
  type UpdateUserInput,
} from '@/features/admin/services/adminUserService';
import { toast } from 'sonner';

const PAGE_SIZE = 20;

const ROLE_STYLE: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  editor: 'bg-blue-100 text-blue-700',
  learner: 'bg-gray-100 text-gray-600',
};
const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  editor: 'Editor',
  learner: 'Học viên (User)',
};
const ROLE_ICON: Record<string, typeof Shield> = {
  admin: Shield,
  editor: ShieldCheck,
  learner: User,
};

export function AdminUsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'learner' | 'editor' | 'admin' | ''>('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [banTarget, setBanTarget] = useState<AdminUser | null>(null);
  const [banReason, setBanReason] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  // Create form state
  const [createForm, setCreateForm] = useState<CreateUserInput>({
    email: '',
    displayName: '',
    username: '',
    role: 'learner',
    gems: 50,
  });

  // Edit form state
  const [editForm, setEditForm] = useState<{
    displayName: string;
    username: string;
    role: 'learner' | 'editor' | 'admin';
    xp: number;
    gems: number;
  }>({
    displayName: '',
    username: '',
    role: 'learner',
    xp: 0,
    gems: 50,
  });

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

  const createMutation = useMutation({
    mutationFn: (input: CreateUserInput) => createUserAdmin(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setIsCreateModalOpen(false);
      setCreateForm({ email: '', displayName: '', username: '', role: 'learner', gems: 50 });
      toast.success('Đã thêm người dùng mới thành công!');
    },
    onError: (err) => {
      toast.error(`Không thể tạo người dùng: ${String(err)}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateUserInput) => updateUserAdmin(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setEditingUser(null);
      toast.success('Đã cập nhật thông tin người dùng!');
    },
    onError: (err) => {
      toast.error(`Lỗi cập nhật: ${String(err)}`);
    },
  });

  const banMutation = useMutation({
    mutationFn: ({ userId, ban, reason }: { userId: string; ban: boolean; reason?: string }) =>
      banUser(userId, ban, reason),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setBanTarget(null);
      setBanReason('');
      toast.success(vars.ban ? 'Đã khóa tài khoản người dùng!' : 'Đã mở khóa tài khoản!');
    },
    onError: (err) => {
      toast.error(`Lỗi: ${String(err)}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUserAdmin(userId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setDeleteTarget(null);
      toast.success('Đã xóa người dùng khỏi hệ thống!');
    },
    onError: (err) => {
      toast.error(`Lỗi khi xóa: ${String(err)}`);
    },
  });

  const startEdit = (u: AdminUser) => {
    setEditingUser(u);
    setEditForm({
      displayName: u.display_name,
      username: u.username,
      role: u.role,
      xp: u.xp,
      gems: u.gems ?? 50,
    });
  };

  const totalPages = Math.ceil((usersQuery.data?.total ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Người dùng</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {usersQuery.data?.total ?? 0} tài khoản · Toàn quyền quản lý: thêm, sửa, xóa, khóa (ban) và phân vai trò
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 shrink-0">
          <PlusCircle size={16} /> Thêm người dùng
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Tìm theo tên hoặc username..."
            className="pl-8 h-9 text-sm"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value as typeof filterRole);
            setPage(0);
          }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Tất cả vai trò</option>
          <option value="admin">Quản trị viên (Admin)</option>
          <option value="editor">Biên tập viên (Editor)</option>
          <option value="learner">Học viên (User)</option>
        </select>
      </div>

      {/* Ban confirmation inline banner */}
      {banTarget && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 space-y-3">
          <p className="text-sm font-semibold">
            {banTarget.is_banned
              ? <>Mở khóa tài khoản cho <strong>{banTarget.display_name}</strong> (@{banTarget.username})?</>
              : <>Khóa (Ban) tài khoản người dùng <strong>{banTarget.display_name}</strong> (@{banTarget.username})?</>
            }
          </p>
          {!banTarget.is_banned && (
            <Input
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Lý do khóa tài khoản (VD: Vi phạm nội quy cộng đồng, gian lận...)..."
              className="h-9 text-sm max-w-lg"
            />
          )}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant={banTarget.is_banned ? 'primary' : 'danger'}
              onClick={() =>
                banMutation.mutate({
                  userId: banTarget.id,
                  ban: !banTarget.is_banned,
                  reason: banReason || undefined,
                })
              }
              disabled={banMutation.isPending}
              className="gap-2"
            >
              {banMutation.isPending
                ? 'Đang xử lý...'
                : banTarget.is_banned
                  ? <><UserCheck size={14} /> Xác nhận mở khóa</>
                  : <><Ban size={14} /> Xác nhận khóa tài khoản</>
              }
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setBanTarget(null); setBanReason(''); }}>
              Hủy
            </Button>
          </div>
          {banMutation.isError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle size={13} /> {String(banMutation.error)}
            </p>
          )}
        </div>
      )}

      {/* Delete confirmation inline banner */}
      {deleteTarget && (
        <div className="rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-950/20 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-900 dark:text-red-200">
                Xác nhận xóa vĩnh viễn tài khoản: {deleteTarget.display_name} (@{deleteTarget.username})
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                Hành động này không thể hoàn tác. Toàn bộ tiến trình học, điểm XP và kim cương của người này sẽ bị xóa khỏi hồ sơ.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button
              size="sm"
              variant="danger"
              onClick={() => deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
              className="gap-1.5"
            >
              <Trash2 size={14} />
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Users Table */}
      {usersQuery.isPending ? (
        <LoadingSpinner text="Đang tải danh sách người dùng..." />
      ) : usersQuery.isError ? (
        <ErrorState message="Không thể tải danh sách người dùng." />
      ) : usersQuery.data.users.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center text-muted-foreground text-sm">
          Không tìm thấy người dùng nào phù hợp với bộ lọc.
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden bg-background">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 text-left font-medium">Người dùng</th>
                    <th className="px-4 py-3 text-left font-medium">Vai trò</th>
                    <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-medium">Cấp / XP</th>
                    <th className="px-4 py-3 text-left font-medium">Kim Cương</th>
                    <th className="px-4 py-3 text-left font-medium">Ngày tham gia</th>
                    <th className="px-4 py-3 text-right font-medium">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usersQuery.data.users.map((u: AdminUser) => {
                    const RoleIcon = ROLE_ICON[u.role] ?? User;
                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-muted/30 transition-colors ${
                          u.is_banned ? 'opacity-70 bg-danger/5' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full grid place-items-center shrink-0 ${
                                u.is_banned ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
                              }`}
                            >
                              {u.is_banned ? <ShieldOff size={16} /> : <RoleIcon size={16} />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{u.display_name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                @{u.username} {u.email ? `· ${u.email}` : ''}
                              </p>
                              {u.is_banned && u.ban_reason && (
                                <p className="text-[11px] text-danger mt-0.5 truncate italic">
                                  Lý do: {u.ban_reason}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${
                              ROLE_STYLE[u.role] ?? ''
                            }`}
                          >
                            <RoleIcon size={12} />
                            {ROLE_LABEL[u.role] ?? u.role}
                          </span>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          {u.is_banned ? (
                            <Badge variant="danger" className="text-[10px] gap-1 font-bold">
                              <Ban size={10} /> Đã khóa
                            </Badge>
                          ) : (
                            <Badge variant="success" className="text-[10px] gap-1 font-bold">
                              <UserCheck size={10} /> Hoạt động
                            </Badge>
                          )}
                        </td>

                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <span className="font-bold text-foreground">Lv.{u.level}</span>
                          <span className="text-xs text-muted-foreground"> ({u.xp.toLocaleString()} XP)</span>
                        </td>

                        <td className="px-4 py-3 text-sm font-bold text-primary whitespace-nowrap">
                          💎 {u.gems ?? 50}
                        </td>

                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(u.created_at).toLocaleDateString('vi-VN')}
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 text-xs font-semibold"
                              onClick={() => startEdit(u)}
                              title="Sửa thông tin"
                            >
                              <Edit2 size={13} className="mr-1" /> Sửa
                            </Button>

                            {u.role !== 'admin' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-8 px-2 text-xs font-semibold ${
                                    u.is_banned
                                      ? 'text-success hover:bg-success-soft'
                                      : 'text-amber-600 hover:bg-amber-50'
                                  }`}
                                  onClick={() => {
                                    setBanTarget(u);
                                    setBanReason('');
                                  }}
                                  title={u.is_banned ? 'Mở khóa' : 'Khóa'}
                                >
                                  {u.is_banned ? (
                                    <><UserCheck size={13} className="mr-1" /> Mở cấm</>
                                  ) : (
                                    <><Ban size={13} className="mr-1" /> Cấm</>
                                  )}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 px-2 text-xs font-semibold text-danger hover:bg-danger-soft"
                                  onClick={() => setDeleteTarget(u)}
                                  title="Xóa tài khoản"
                                >
                                  <Trash2 size={13} />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Trang {page + 1} / {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="gap-1"
                >
                  <ChevronLeft size={14} /> Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="gap-1"
                >
                  Tiếp <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* CREATE USER MODAL */}
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm người dùng mới"
        description="Tạo tài khoản người dùng hoặc cấp quyền quản trị trong Violympus Studio"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(createForm);
          }}
          className="space-y-4 pt-2"
        >
          <div>
            <label className="text-xs font-bold text-foreground">Họ và tên / Tên hiển thị *</label>
            <Input
              required
              value={createForm.displayName}
              onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
              placeholder="VD: Nguyễn Văn An"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-foreground">Tên đăng nhập (Username) *</label>
              <Input
                required
                value={createForm.username}
                onChange={(e) => setCreateForm({ ...createForm, username: e.target.value.toLowerCase().trim() })}
                placeholder="nguyenvanan"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground">Email đăng ký *</label>
              <Input
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value.trim() })}
                placeholder="an.nguyen@example.com"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-foreground">Vai trò hệ thống</label>
              <select
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm({ ...createForm, role: e.target.value as 'learner' | 'editor' | 'admin' })
                }
                className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm font-medium"
              >
                <option value="learner">Học viên (User thông thường)</option>
                <option value="editor">Biên tập viên (Editor)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground">Số kim cương ban đầu</label>
              <Input
                type="number"
                min={0}
                value={createForm.gems ?? 50}
                onChange={(e) => setCreateForm({ ...createForm, gems: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="gap-2">
              <PlusCircle size={15} />
              {createMutation.isPending ? 'Đang tạo...' : 'Tạo người dùng'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* EDIT USER MODAL */}
      <Dialog
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title="Chỉnh sửa thông tin người dùng"
        description={`Cập nhật thông tin cho @${editingUser?.username}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!editingUser) return;
            updateMutation.mutate({
              userId: editingUser.id,
              displayName: editForm.displayName,
              username: editForm.username,
              role: editForm.role,
              xp: editForm.xp,
              gems: editForm.gems,
            });
          }}
          className="space-y-4 pt-2"
        >
          <div>
            <label className="text-xs font-bold text-foreground">Tên hiển thị</label>
            <Input
              required
              value={editForm.displayName}
              onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-foreground">Username</label>
              <Input
                required
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().trim() })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Vai trò</label>
              <select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value as 'learner' | 'editor' | 'admin' })
                }
                className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm font-medium"
              >
                <option value="learner">Học viên (User)</option>
                <option value="editor">Biên tập viên (Editor)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-foreground">Điểm kinh nghiệm (XP)</label>
              <Input
                type="number"
                min={0}
                value={editForm.xp}
                onChange={(e) => setEditForm({ ...editForm, xp: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Số dư Kim Cương (💎)</label>
              <Input
                type="number"
                min={0}
                value={editForm.gems}
                onChange={(e) => setEditForm({ ...editForm, gems: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>
              Hủy
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
              <Edit2 size={15} />
              {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
