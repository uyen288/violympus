import { Link } from 'react-router';
import {
  Brain,
  BookOpen,
  Languages,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
  Globe2,
  Scale,
  Zap,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Layers,
  Mountain,
  FileEdit,
  Swords,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SubjectsPage() {
  const subjects = [
    {
      slug: 'toan-hoc',
      title: 'Toán học',
      description: 'Số học, đại số tuyến tính, hình học không gian, giải tích và bài toán tư duy logic.',
      icon: Brain,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'Trọng điểm',
      topicsCount: 14,
      questionsCount: 220,
    },
    {
      slug: 'ngu-van',
      title: 'Ngữ văn & Tiếng Việt',
      description: 'Văn học dân gian, văn học trung - hiện đại, biện pháp tu từ và phân tích tác phẩm kinh điển.',
      icon: BookOpen,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: 'Cốt lõi',
      topicsCount: 12,
      questionsCount: 180,
    },
    {
      slug: 'tieng-anh',
      title: 'Tiếng Anh',
      description: 'Ngữ pháp chuyên sâu, từ vựng học thuật, đọc hiểu logic và thành ngữ chuẩn quốc tế.',
      icon: Languages,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'Quốc tế',
      topicsCount: 15,
      questionsCount: 250,
    },
    {
      slug: 'vat-ly',
      title: 'Vật lý',
      description: 'Cơ học, điện xoay chiều, sóng ánh sáng, thuyết tương đối và các quy luật vũ trụ.',
      icon: Atom,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'Tự nhiên',
      topicsCount: 10,
      questionsCount: 160,
    },
    {
      slug: 'hoa-hoc',
      title: 'Hóa học',
      description: 'Bảng tuần hoàn, liên kết hóa học, phản ứng vô cơ và hóa học hữu cơ ứng dụng đời sống.',
      icon: FlaskConical,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Thực nghiệm',
      topicsCount: 11,
      questionsCount: 170,
    },
    {
      slug: 'sinh-hoc',
      title: 'Sinh học & Y sinh',
      description: 'Cơ chế di truyền Men-đen, sinh học phân tử, hệ sinh thái và giải phẫu cơ thể người.',
      icon: Dna,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      badge: 'Sự sống',
      topicsCount: 9,
      questionsCount: 140,
    },
    {
      slug: 'lich-su',
      title: 'Lịch sử',
      description: 'Lịch sử dựng nước & giữ nước Việt Nam hào hùng, các nền văn minh nhân loại và biến cố thế giới.',
      icon: Landmark,
      color: 'bg-red-50 text-red-700 border-red-200',
      badge: 'Hào hùng',
      topicsCount: 12,
      questionsCount: 190,
    },
    {
      slug: 'dia-ly',
      title: 'Địa lý',
      description: 'Địa hình, khí hậu, các vùng kinh tế trọng điểm, tài nguyên khoáng sản và bản đồ địa cầu.',
      icon: Globe2,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      badge: 'Khám phá',
      topicsCount: 8,
      questionsCount: 130,
    },
    {
      slug: 'kinh-te-phap-luat',
      title: 'Kinh tế & Pháp luật',
      description: 'Thị trường tài chính, cung cầu tiền tệ, quyền nghĩa vụ công dân và hệ thống pháp chế Việt Nam.',
      icon: Scale,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'Thực tiễn',
      topicsCount: 8,
      questionsCount: 120,
    },
    {
      slug: 'tin-hoc',
      title: 'Tin học & Thuật toán',
      description: 'Khoa học máy tính, cấu trúc dữ liệu, giải thuật tìm kiếm, quy hoạch động và lập trình logic.',
      icon: Zap,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'Công nghệ',
      topicsCount: 10,
      questionsCount: 150,
    },
    {
      slug: 'triet-hoc-logic',
      title: 'Tư duy Logic & Triết học',
      description: 'Tam đoạn luận, nhận diện ngụy biện, các nghịch lý logic kinh điển và tư duy phản biện sắc bén.',
      icon: Lightbulb,
      color: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      badge: 'Trí tuệ',
      topicsCount: 7,
      questionsCount: 110,
    },
  ];

  const gameModes = [
    {
      title: 'Cặp đôi hoàn hảo (Matching)',
      desc: 'Tìm và ghép nối hai ô có giá trị tương đương (ví dụ căn bậc hai với số nguyên, từ vựng với nghĩa, nhà thơ với tác phẩm).',
      icon: Layers,
      tag: 'Kinh điển Violympic',
    },
    {
      title: 'Vượt chướng ngại vật (Streak)',
      desc: 'Chuỗi câu hỏi liên tiếp leo lên đỉnh núi tri thức. Trả lời đúng nhận nhân hệ số Combo XP, sai 1 câu bị tụt dốc!',
      icon: Mountain,
      tag: 'Tốc độ & Bền bỉ',
    },
    {
      title: 'Đừng để điểm rơi (Fill-in)',
      desc: 'Không có lựa chọn A/B/C/D! Bạn phải tự tính toán và điền chính xác con số hoặc từ khóa vào chỗ trống.',
      icon: FileEdit,
      tag: 'Chính xác 100%',
    },
    {
      title: '12 Con Giáp & Đấu trường Realtime',
      desc: 'Áp lực thời gian từng giây! Thách đấu trực tiếp nhiều người chơi trong phòng thi, bảng điểm nhảy realtime.',
      icon: Swords,
      tag: 'Đối kháng trực tiếp',
    },
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="max-w-3xl space-y-3">
        <Badge variant="secondary" className="gap-1.5 py-1 px-3">
          <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
          <span>Hệ thống 11 Lĩnh vực Tri thức Toàn diện</span>
        </Badge>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
          Khám phá các môn học & Đấu trường kiến thức
        </h1>
        <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
          Được thiết kế dựa trên tinh thần thi đấu của các kỳ thi học thuật và Violympic huyền thoại: đa dạng môn học, thử thách đa thể loại và chuẩn hóa bảo mật chấm điểm server.
        </p>
      </div>

      {/* Violympic Gameplay Modes Showcase */}
      <div className="rounded-2xl border border-primary/20 bg-primary-soft/30 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Đa dạng thể thức thi đấu & học tập</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-black text-foreground mb-6">
          Các hình thức thử thách lấy cảm hứng từ Violympic
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gameModes.map((mode, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary-soft text-primary">
                    <mode.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="gold" className="text-[10px] font-semibold">
                    {mode.tag}
                  </Badge>
                </div>
                <h3 className="font-heading font-bold text-base text-foreground mb-1.5">
                  {mode.title}
                </h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {mode.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid 11 Môn học */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Toàn bộ 11 Môn học & Chuyên đề
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted mt-0.5">
              Chọn môn học bạn muốn ôn luyện hoặc bước vào phòng thi đấu
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex text-xs font-semibold">
            11 Môn học • 1,800+ Câu hỏi
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <Card
              key={sub.slug}
              className="flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-md group"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl border ${sub.color}`}>
                    <sub.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {sub.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {sub.title}
                </CardTitle>
                <CardDescription className="text-xs mt-2 leading-relaxed">
                  {sub.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 border-t border-border/50 mt-4 flex items-center justify-between">
                <div className="text-xs text-foreground-muted font-medium pt-3">
                  <span className="font-bold text-foreground">{sub.topicsCount}</span> chủ đề •{' '}
                  <span className="font-bold text-foreground">{sub.questionsCount}</span> câu hỏi
                </div>
                <Button asChild size="sm" className="mt-3 gap-1 font-semibold">
                  <Link to="/practice">
                    <span>Ôn tập</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
