import * as React from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Zap,
  Trophy,
  User,
  KeyRound,
  Trash2,
  AlertTriangle,
  Save,
  CheckCircle2,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { useAuth } from '@/app/providers';
import { useGamificationStore } from '@/lib/gamification/gamificationStore';
import { getLevelProgress } from '@/lib/gamification/xpSystem';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Validation Schemas
const profileInfoSchema = z.object({
  displayName: z.string().min(2, 'Tên hiển thị phải có ít nhất 2 ký tự').max(50, 'Tối đa 50 ký tự'),
  username: z
    .string()
    .min(3, 'Tên người dùng phải có ít nhất 3 ký tự')
    .max(30, 'Tối đa 30 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên người dùng chỉ bao gồm chữ cái, số và dấu gạch dưới (_)'),
  avatarUrl: z.string().url('URL ảnh không hợp lệ').or(z.literal('')).optional(),
});

type ProfileInfoFormData = z.infer<typeof profileInfoSchema>;

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu không được để trống'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user, authUser, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { gems, streak, xp: storeXp } = useGamificationStore();
  const levelInfo = getLevelProgress(user?.xp || storeXp || 0);

  // State for delete account modal
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  // Profile Info Form
  const [customAvatarInput, setCustomAvatarInput] = React.useState<string | null>(null);
  const previewAvatarUrl = customAvatarInput !== null ? customAvatarInput : (user?.avatarUrl || '');

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm<ProfileInfoFormData>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      username: user?.username || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  // Re-sync form default values when user profile loads
  React.useEffect(() => {
    if (user) {
      resetProfile({
        displayName: user.displayName || '',
        username: user.username || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user, resetProfile]);

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Submit Profile Info Update
  const onUpdateProfile = async (data: ProfileInfoFormData) => {
    if (!user) return;
    try {
      const cleanAvatarUrl = data.avatarUrl?.trim() || null;
      const cleanDisplayName = data.displayName.trim();
      const cleanUsername = data.username.trim();

      // 1. Update public.profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: cleanDisplayName,
          username: cleanUsername,
          avatar_url: cleanAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        if (profileError.code === '23505') {
          toast.error('Tên người dùng (username) này đã có người sử dụng. Vui lòng chọn tên khác.');
          return;
        }
        toast.error(profileError.message || 'Không thể cập nhật hồ sơ');
        return;
      }

      // 2. Also sync auth user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: cleanDisplayName,
          username: cleanUsername,
          avatar_url: cleanAvatarUrl,
        },
      });

      await refreshProfile();
      toast.success('Cập nhật thông tin cá nhân thành công!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi lưu thông tin');
    }
  };

  // Submit Password Change
  const onChangePassword = async (data: PasswordFormData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        toast.error(error.message || 'Không thể thay đổi mật khẩu');
        return;
      }

      toast.success('Mật khẩu của bạn đã được thay đổi thành công!');
      resetPassword();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật mật khẩu');
    }
  };

  // Submit Delete Account
  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);

      // Call secure RPC to delete own account
      const { error } = await supabase.rpc('delete_own_account');

      if (error) {
        setDeleteError(error.message || 'Không thể xóa tài khoản. Vui lòng liên hệ hỗ trợ.');
        return;
      }

      await signOut();
      toast.success('Tài khoản của bạn đã được xóa vĩnh viễn.');
      navigate('/');
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Lỗi khi xóa tài khoản');
    } finally {
      setIsDeleting(false);
    }
  };

  const isGoogleUser = authUser?.app_metadata?.provider === 'google';
  const confirmationTargetText = 'XÓA TÀI KHOẢN';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Hồ sơ cá nhân
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted mt-1">
          Quản lý thông tin tài khoản, cập nhật bảo mật và hành trình học tập tại Violympus.
        </p>
      </div>

      {/* Header Info & Stats Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-border">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-white text-2xl sm:text-3xl font-bold shadow-md overflow-hidden relative border border-border">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{user?.displayName?.[0]?.toUpperCase() || 'U'}</span>
            )}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <CardTitle className="text-xl sm:text-2xl truncate">{user?.displayName}</CardTitle>
              <Badge variant={user?.role === 'admin' ? 'gold' : 'secondary'} className="capitalize">
                {user?.role}
              </Badge>
              {isGoogleUser && (
                <Badge variant="outline" className="text-xs bg-surface-muted gap-1 text-foreground-muted">
                  <span className="font-semibold text-primary">Google</span> OAuth
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-foreground-muted">
              <span className="font-mono text-foreground font-medium">@{user?.username}</span>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-foreground-muted shrink-0" />
                <span className="truncate">{user?.email}</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-border bg-surface-muted/30 p-3 sm:p-4 text-center">
              <div className="flex justify-center mb-1 text-accent-gold">
                <Zap className="h-5 w-5 fill-accent-gold" />
              </div>
              <div className="font-heading text-xl sm:text-2xl font-black tabular-nums">{levelInfo.currentXP}</div>
              <div className="text-xs text-foreground-muted">Tổng điểm XP</div>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/30 p-3 sm:p-4 text-center">
              <div className="flex justify-center mb-1 text-primary">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="font-heading text-xl sm:text-2xl font-black tabular-nums">Cấp {levelInfo.currentLevel}</div>
              <div className="text-xs text-foreground-muted">{levelInfo.title}</div>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/30 p-3 sm:p-4 text-center">
              <div className="flex justify-center mb-1 text-primary text-xl">
                💎
              </div>
              <div className="font-heading text-xl sm:text-2xl font-black text-primary tabular-nums">{gems}</div>
              <div className="text-xs text-foreground-muted">Kim cương</div>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/30 p-3 sm:p-4 text-center">
              <div className="flex justify-center mb-1 text-amber-500">
                <Flame className="h-5 w-5 fill-amber-500" />
              </div>
              <div className="font-heading text-xl sm:text-2xl font-black text-amber-600 tabular-nums">{streak} ngày</div>
              <div className="text-xs text-foreground-muted">Chuỗi học tập</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="rounded-xl border border-border p-3.5 bg-surface space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">
                Tiến độ thăng cấp ({levelInfo.percentage}%)
              </span>
              <span className="text-foreground-muted font-mono">
                {levelInfo.currentXP} / {levelInfo.maxXP} XP (Cần thêm {levelInfo.xpNeeded} XP lên Cấp {levelInfo.nextLevel})
              </span>
            </div>
            <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent-gold transition-all"
                style={{ width: `${levelInfo.percentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Update Profile Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Thông tin tài khoản</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Cập nhật tên hiển thị, tên người dùng và ảnh đại diện hiển thị trong đấu trường và bảng xếp hạng.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Họ và tên / Tên hiển thị"
                placeholder="Nguyễn Văn A"
                error={profileErrors.displayName?.message}
                {...registerProfile('displayName')}
              />

              <Input
                label="Tên người dùng (Username)"
                placeholder="nguyenvana_123"
                hint="Chỉ gồm chữ cái, số và dấu gạch dưới (_)"
                error={profileErrors.username?.message}
                {...registerProfile('username')}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 w-full">
                  <Input
                    label="Liên kết ảnh đại diện (Avatar URL)"
                    placeholder="https://example.com/avatar.jpg"
                    hint="Nhập đường dẫn trực tiếp tới ảnh của bạn hoặc giữ nguyên ảnh Google."
                    error={profileErrors.avatarUrl?.message}
                    {...registerProfile('avatarUrl', {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        setCustomAvatarInput(e.target.value),
                    })}
                  />
                </div>

                {previewAvatarUrl && (
                  <div className="sm:pt-5 flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full border border-border overflow-hidden shrink-0 bg-surface-muted">
                      <img
                        src={previewAvatarUrl}
                        alt="Xem trước ảnh"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="text-xs text-foreground-muted">Xem trước</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Input
                label="Email đăng nhập"
                type="email"
                value={user?.email || ''}
                disabled
                hint="Email xác thực tài khoản không thể chỉnh sửa trực tiếp."
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                className="gap-2 font-bold"
                isLoading={isSubmittingProfile}
              >
                <Save className="h-4 w-4" />
                <span>Lưu thay đổi</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Section 2: Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Đổi mật khẩu</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Cập nhật mật khẩu định kỳ để nâng cao tính an toàn và bảo mật cho tài khoản của bạn.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isGoogleUser && (
            <div className="mb-4 rounded-lg bg-surface-muted border border-border p-3 text-xs text-foreground-muted leading-relaxed flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                Bạn đang sử dụng đăng nhập Google OAuth. Bạn có thể đặt mật khẩu bên dưới để có thêm phương thức đăng nhập bằng email & mật khẩu.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Mật khẩu mới"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword')}
              />

              <Input
                label="Xác nhận mật khẩu mới"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword')}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="outline"
                className="gap-2 font-bold"
                isLoading={isSubmittingPassword}
              >
                <KeyRound className="h-4 w-4" />
                <span>Cập nhật mật khẩu</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Section 3: Danger Zone - Delete Account */}
      <Card className="border-danger/30 bg-danger-soft/10">
        <CardHeader>
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle className="text-lg text-danger">Khu vực nguy hiểm</CardTitle>
          </div>
          <CardDescription className="text-xs text-foreground-muted">
            Các thao tác tại đây mang tính vĩnh viễn và không thể hoàn tác sau khi thực hiện.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="space-y-1">
            <div className="text-sm font-bold text-foreground">Xóa tài khoản vĩnh viễn</div>
            <p className="text-xs text-foreground-muted max-w-xl leading-relaxed">
              Toàn bộ dữ liệu của bạn gồm hồ sơ cá nhân, điểm số, lịch sử thi cử và thành tích xếp hạng sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu.
            </p>
          </div>

          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={() => {
              setIsDeleteDialogOpen(true);
              setDeleteConfirmText('');
              setDeleteError(null);
            }}
            className="gap-2 shrink-0 font-bold"
          >
            <Trash2 className="h-4 w-4" />
            <span>Xóa tài khoản</span>
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(false);
          }
        }}
        title="Xác nhận xóa tài khoản vĩnh viễn"
        description="Hành động này cực kỳ nguy hiểm và không thể đảo ngược."
      >
        <div className="space-y-4">
          {deleteError && (
            <div className="rounded-lg bg-danger-soft border border-danger/20 p-3 text-xs font-medium text-danger">
              {deleteError}
            </div>
          )}

          <div className="rounded-lg border border-danger/30 bg-danger-soft/20 p-3 text-xs text-danger space-y-1">
            <p className="font-semibold">Cảnh báo:</p>
            <ul className="list-disc pl-4 space-y-1 text-foreground-muted">
              <li>Mọi dữ liệu làm bài thi, khảo sát và điểm luyện tập sẽ bị xóa.</li>
              <li>Điểm XP, cấp bậc và huy hiệu danh dự sẽ bị hủy bỏ.</li>
              <li>Bạn sẽ không thể khôi phục lại tài khoản này sau khi xóa.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-delete-input" className="block text-xs font-medium text-foreground">
              Vui lòng nhập <span className="font-bold font-mono text-danger">{confirmationTargetText}</span> để xác nhận:
            </label>
            <Input
              id="confirm-delete-input"
              type="text"
              placeholder={confirmationTargetText}
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="font-mono text-sm"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Hủy bỏ
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              disabled={deleteConfirmText.trim() !== confirmationTargetText || isDeleting}
              className="gap-2 font-bold"
            >
              <Trash2 className="h-4 w-4" />
              <span>Xác nhận xóa vĩnh viễn</span>
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
