import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Atom,
  BookOpen,
  Brain,
  Check,
  Code2,
  FlaskConical,
  Globe2,
  Layers3,
  Medal,
  Play,
  Sparkles,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './LandingPage.css';

type Subject = {
  title: string;
  meta: string;
  icon: LucideIcon;
  tone: string;
};

const subjects: Subject[] = [
  { title: 'Toán học', meta: '12 chủ đề', icon: Layers3, tone: 'subject-blue' },
  { title: 'Khoa học', meta: '08 chủ đề', icon: FlaskConical, tone: 'subject-mint' },
  { title: 'Lập trình', meta: '10 chủ đề', icon: Code2, tone: 'subject-violet' },
  { title: 'Ngoại ngữ', meta: '09 chủ đề', icon: Globe2, tone: 'subject-gold' },
];

const stars = Array.from({ length: 10 }, (_, index) => index);

export function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      <div className="landing-stars" aria-hidden="true">
        {stars.map((star) => <span key={star} />)}
      </div>

      <section className="landing-hero">
        <div className="landing-container hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow"><span /> HỌC TẬP THẾ HỆ MỚI</div>
            <h1>Học hỏi.<br /><em>Thi đấu.</em><br />Vươn tầm.</h1>
            <p className="hero-lede">Biến mỗi câu hỏi thành một bước tiến. Học sâu hơn, luyện tập thông minh và chinh phục bảng xếp hạng.</p>
            <div className="hero-actions">
              <Link to="/register" className="landing-button landing-button-primary">{t('auth.register', 'Bắt đầu miễn phí')} <ArrowRight size={18} /></Link>
              <Link to="#how-it-works" className="hero-play-link"><span><Play size={13} fill="currentColor" /></span> Xem cách hoạt động</Link>
            </div>
            <div className="hero-proof"><div className="proof-avatars"><b>V</b><b>H</b><b>T</b></div><span>Học cùng cộng đồng đang phát triển mỗi ngày</span></div>
          </div>

          <div className="hero-visual" aria-label="Bảng thành tích minh họa">
            <div className="visual-orbit orbit-a" /><div className="visual-orbit orbit-b" /><div className="visual-glow" />
            <div className="rank-card-large">
              <div className="rank-card-top"><span><Trophy size={14} /> XẾP HẠNG</span><b><i /> LIVE</b></div>
              <strong>01<small>/12</small></strong>
              <p>Bạn đang dẫn đầu</p>
              <div className="rank-progress"><span /></div>
              <div className="rank-card-bottom"><span>Điểm hiện tại</span><b>2,480 XP</b></div>
            </div>
            <div className="hero-float-card xp-card"><span><Target size={17} /></span><div><b>+240 XP</b><small>Chuỗi 7 ngày</small></div></div>
            <div className="hero-float-card top-card"><b>#03</b><div><strong>Top 3%</strong><small>Tuần này</small></div></div>
            <div className="question-float"><small>CÂU HỎI 08</small><b>Kiến thức tạo nên<br />bứt phá.</b><span /></div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-container" id="subjects">
        <div className="section-heading"><div><span className="section-kicker">KHÁM PHÁ</span><h2>Chọn lĩnh vực,<br /><em>mở rộng giới hạn.</em></h2></div><Link to="/subjects" className="section-link">Xem tất cả <ArrowRight size={16} /></Link></div>
        <div className="subject-grid">{subjects.map((subject) => <Link to="/practice" className="subject-card" key={subject.title}><span className={`subject-icon ${subject.tone}`}><subject.icon size={22} /></span><span><b>{subject.title}</b><small>{subject.meta}</small></span><ArrowRight className="subject-arrow" size={17} /></Link>)}</div>
      </section>

      <section className="landing-section process-section landing-container" id="how-it-works">
        <div className="section-heading process-heading"><div><span className="section-kicker">ĐƠN GIẢN MÀ HIỆU QUẢ</span><h2>Mỗi ngày một<br /><em>phiên bản tốt hơn.</em></h2></div><p>Một lộ trình rõ ràng để bạn tiến bộ thật, theo cách của riêng mình.</p></div>
        <div className="process-grid">
          <article><span>01</span><i><BookOpen size={22} /></i><div><h3>Học</h3><p>Nắm vững nền tảng qua bài học ngắn, trực quan.</p></div></article>
          <article><span>02</span><i><Brain size={22} /></i><div><h3>Luyện tập</h3><p>Củng cố kiến thức bằng câu hỏi vừa sức.</p></div></article>
          <article><span>03</span><i><Medal size={22} /></i><div><h3>Thi đấu</h3><p>Đo bản lĩnh và vươn lên trên bảng xếp hạng.</p></div></article>
        </div>
      </section>

      <section className="arena-cta landing-container" id="arena">
        <div><span className="section-kicker">ARENA</span><h2>Sẵn sàng<br /><em>chạm đỉnh?</em></h2><p>Thách đấu bạn bè. Cùng nhau tiến bộ.</p><Link to="/arena" className="landing-button landing-button-light">Vào đấu trường <ArrowRight size={17} /></Link></div>
        <div className="arena-visual"><div /><div /><Trophy size={86} /></div>
      </section>

      <div className="landing-trust landing-container"><span><Check size={15} /> Chấm điểm chuẩn xác</span><span><Users size={15} /> Cộng đồng học tập</span><span><Sparkles size={15} /> Hỗ trợ VI / EN</span><span><Atom size={15} /> Nội dung đa lĩnh vực</span></div>
    </div>
  );
}
