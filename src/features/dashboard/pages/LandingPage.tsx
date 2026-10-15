import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Swords,
  BookOpen,
  Trophy,
  ArrowRight,
  Brain,
  CheckCircle2,
  Users,
  Timer,
  Sparkles,
  Languages,
  Atom,
  FlaskConical,
  Landmark,
  Layers,
  Mountain,
  FileEdit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function LandingPage() {
  const { t } = useTranslation();

  const sampleSubjects = [
    {
      title: 'Toán học',
      desc: 'Đại số, hình học không gian, giải tích và phương trình lượng giác.',
      icon: Brain,
      tag: 'Cốt lõi',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Ngữ văn & Tiếng Việt',
      desc: 'Văn học dân gian, trung - hiện đại, biện pháp tu từ và cảm thụ tác phẩm.',
      icon: BookOpen,
      tag: 'Kinh điển',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Tiếng Anh',
      desc: 'Từ vựng học thuật, ngữ pháp chuẩn quốc tế và câu đố thành ngữ.',
      icon: Languages,
      tag: 'Toàn cầu',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Vật lý',
      desc: 'Dao động cơ học, điện xoay chiều, sóng ánh sáng và vật lý hạt nhân.',
      icon: Atom,
      tag: 'Tự nhiên',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Hóa học',
      desc: 'Bảng tuần hoàn, phản ứng oxi hóa khử và chuỗi phản ứng hữu cơ.',
      icon: FlaskConical,
      tag: 'Thực nghiệm',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Lịch sử',
      desc: 'Các triều đại Việt Nam, chiến dịch Điện Biên Phủ và văn minh thế giới.',
      icon: Landmark,
      tag: 'Hào hùng',
      color: 'bg-red-50 text-red-700 border-red-200',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-soft/40 via-surface to-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Nền tảng tri thức thế hệ mới</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
                Học hỏi. Thi đấu.{' '}
                <span className="bg-gradient-to-r from-primary via-indigo-700 to-amber-600 bg-clip-text text-transparent">
                  Vươn tầm.
                </span>
              </h1>

              <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-foreground-muted leading-relaxed">
                Violympus là đấu trường học tập đa lĩnh vực, nơi bạn rèn luyện kiến thức cá nhân, thách đấu đối kháng thời gian thực và ghi danh trên bảng vàng xếp hạng học thuật.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button asChild size="lg" className="w-full sm:w-auto gap-2 text-base shadow-md">
                  <Link to="/register">
                    <span>{t('auth.register', 'Bắt đầu ngay — Hoàn toàn miễn phí')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base">
                  <Link to="/subjects">{t('navigation.subjects', 'Khám phá các lĩnh vực')}</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-foreground-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Chấm điểm server-side chuẩn xác</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Đấu trường Realtime WebSockets</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Hỗ trợ song ngữ VI / EN</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
                {/* Visual Simulation of Arena Match */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
                      <Swords className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-heading font-bold text-sm">Phòng thi đấu trực tiếp #8492</span>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-mono font-bold text-amber-900">
                    <Timer className="h-3.5 w-3.5" />
                    <span>00:15</span>
                  </div>
                </div>

                <div className="py-4 space-y-3">
                  <div className="rounded-lg bg-surface-muted p-3 text-xs">
                    <div className="font-semibold text-primary mb-1">Câu hỏi 04/10 • Toán học</div>
                    <p className="text-foreground font-medium">
                      Cho hàm số liên tục trên [a, b]. Khẳng định nào sau đây là hệ quả của định lý giá trị trung gian?
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {['A. Tồn tại ít nhất một nghiệm f(c) = 0', 'B. Hàm số đơn điệu tăng trên toàn miền', 'C. Đạo hàm luôn khác không tại c'].map((opt, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border p-2.5 text-xs font-medium transition-colors ${
                          i === 0
                            ? 'border-primary bg-primary-soft text-primary font-semibold'
                            : 'border-border text-foreground-muted'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live scoreboard simulation */}
                <div className="border-t border-border pt-3">
                  <div className="text-[11px] font-bold text-foreground-muted mb-2 uppercase tracking-wide">
                    Bảng điểm trực tiếp
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between rounded bg-amber-50 px-2.5 py-1 text-amber-900 font-semibold border border-amber-200">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold">🥇 1</span>
                        <span>Nguyễn Minh (Bạn)</span>
                      </div>
                      <span className="font-mono tabular-nums">450 XP</span>
                    </div>
                    <div className="flex items-center justify-between px-2.5 py-1 text-foreground-muted">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold">🥈 2</span>
                        <span>Alex Turner</span>
                      </div>
                      <span className="font-mono tabular-nums">380 XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Overview */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Các lĩnh vực học thuật nổi bật
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Hệ thống câu hỏi được biên soạn chặt chẽ, phân cấp theo độ khó rõ ràng từ cơ bản đến nâng cao.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleSubjects.map((s, idx) => (
              <Card key={idx} className="flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2.5 rounded-xl border ${s.color}`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-medium">
                      {s.tag}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed mt-1">
                    {s.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild variant="secondary" size="sm" className="w-full text-xs">
                    <Link to="/practice">Luyện tập ngay</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Violympic Classic Game Modes Showcase */}
          <div className="mt-16 rounded-2xl border border-primary/20 bg-primary-soft/30 p-6 sm:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  <Sparkles className="h-4 w-4 text-accent-gold" />
                  <span>Kế thừa tinh hoa Violympic</span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-foreground">
                  Đa dạng chế độ thi đấu & vượt ải học tập
                </h3>
              </div>
              <Badge variant="gold" className="text-xs font-semibold">
                Đỉnh núi trí tuệ
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 w-fit mb-3">
                  <Layers className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground mb-1">Cặp đôi hoàn hảo</h4>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Ghép 2 ô tương đương: căn số với giá trị nguyên, từ vựng với định nghĩa hoặc nhà thơ với tác phẩm.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700 w-fit mb-3">
                  <Mountain className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground mb-1">Vượt chướng ngại vật</h4>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Chuỗi câu hỏi leo núi dồn dập (Khỉ leo núi). Trả lời đúng liên tục nhân Combo điểm số, sai 1 câu bị trừ dốc!
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 w-fit mb-3">
                  <FileEdit className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground mb-1">Đừng để điểm rơi</h4>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Không có trắc nghiệm A/B/C/D! Thí sinh phải tự tính toán và điền chính xác con số hoặc từ khóa.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700 w-fit mb-3">
                  <Swords className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground mb-1">Đấu trường Realtime</h4>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Phòng thi đối kháng trực tiếp nhiều người, áp lực từng giây với bảng điểm nhảy theo thời gian thực.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="md">
              <Link to="/subjects" className="gap-2 font-semibold">
                <span>Xem tất cả 11 môn học & lĩnh vực thi đấu</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Quy trình phát triển năng lực
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Kết hợp giữa rèn luyện bền bỉ và thi đấu cọ xát với áp lực thời gian thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface-muted/50 border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-heading font-bold text-base text-foreground mb-2">
                Học & Ôn luyện cá nhân
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Tự do lựa chọn chủ đề, kiểm tra kiến thức với giải thích chi tiết, không áp lực điểm số.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface-muted/50 border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-heading font-bold text-base text-foreground mb-2">
                Thử sức với đề thi chuẩn
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Làm bài thi có giới hạn thời gian thực tế, hệ thống khóa đáp án và tính điểm server-side.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface-muted/50 border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gold text-slate-900 font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-heading font-bold text-base text-foreground mb-2">
                Đấu trường Realtime đa người
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Tạo hoặc tham gia phòng thi qua mã PIN 6 số, tranh tài tốc độ và độ chuẩn xác cùng đối thủ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Arena Teaser Section */}
      <section className="py-20 bg-arena-bg text-arena-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-arena-border bg-arena-surface px-4 py-1 text-xs font-semibold text-arena-primary mb-4">
            <Users className="h-4 w-4" />
            <span>Chế độ Đấu trường Đối kháng</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
            Thách đấu trí tuệ trong từng giây với phòng thi Realtime
          </h2>

          <p className="mt-4 text-sm sm:text-base text-arena-foreground-muted max-w-xl mx-auto leading-relaxed">
            Hỗ trợ kết nối đồng thời, tự động chuyển nhượng quyền chủ phòng khi mất kết nối, đồng bộ câu hỏi chính xác từng mili-giây.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-arena-primary text-slate-950 font-bold hover:bg-blue-400 gap-2">
              <Link to="/arena">
                <Swords className="h-5 w-5" />
                <span>Vào Đấu trường ngay</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-arena-border text-white hover:bg-arena-surface">
              <Link to="/leaderboard" className="gap-2">
                <Trophy className="h-5 w-5 text-arena-gold" />
                <span>Xem Bảng xếp hạng</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
