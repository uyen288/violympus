import * as React from 'react';
import { useNavigate } from 'react-router';
import { Swords, Plus, Users, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function ArenaLobbyPage() {
  const navigate = useNavigate();
  const [pinCode, setPinCode] = React.useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pinCode.trim().toUpperCase();
    if (!clean) {
      toast.error('Vui lòng nhập mã phòng');
      return;
    }
    navigate(`/arena/room/${clean}`);
  };

  const handleCreateRoom = () => {
    // Generate a temporary 6-character room code
    const generated = Math.random().toString(36).substring(2, 8).toUpperCase();
    toast.success(`Đã tạo phòng đấu mới: ${generated}`);
    navigate(`/arena/room/${generated}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary mb-2">
          <Swords className="h-3.5 w-3.5" />
          <span>Realtime Knowledge Arena</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Sảnh Đấu trường Trực tiếp
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted mt-1 max-w-2xl">
          Tạo phòng riêng để thi đấu cùng bạn bè hoặc nhập mã PIN phòng do đối thủ chia sẻ để bước vào trận đấu đối kháng trực tiếp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Room Card */}
        <Card className="flex flex-col justify-between border-primary/40 shadow-sm">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white mb-3">
              <Plus className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Tạo phòng đấu mới</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Bạn sẽ là chủ phòng (Host). Bạn có quyền chọn bộ câu hỏi, thời gian cho mỗi câu và phát lệnh bắt đầu khi mọi người sẵn sàng.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button onClick={handleCreateRoom} className="w-full gap-2 font-bold" size="lg">
              <Plus className="h-5 w-5" />
              <span>Tạo phòng ngay</span>
            </Button>
          </CardContent>
        </Card>

        {/* Join Room by PIN */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gold-soft text-amber-900 border border-amber-300 mb-3">
              <Hash className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Tham gia qua mã PIN</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Nhập mã định danh 6 ký tự được cung cấp bởi chủ phòng để tham gia sảnh chờ.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                placeholder="VD: 7X9K2P"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                className="font-mono text-center tracking-widest text-lg font-bold uppercase"
                maxLength={8}
              />
              <Button type="submit" variant="secondary" className="w-full gap-2 font-bold" size="lg">
                <Users className="h-5 w-5" />
                <span>Vào phòng đấu</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
