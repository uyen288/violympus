// src/features/practice/data/practiceBank.ts
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
  type LucideIcon,
} from 'lucide-react';

export interface SubjectMeta {
  slug: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  color: string;
  badgeColor: string;
  description: string;
}

export const SUBJECT_METAS: SubjectMeta[] = [
  {
    slug: 'toan-hoc',
    name: 'Toán học',
    shortName: 'Toán',
    icon: Brain,
    color: 'text-blue-500',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    description: 'Đại số, lượng giác, hình học không gian, giải tích và bài toán tư duy.',
  },
  {
    slug: 'ngu-van',
    name: 'Ngữ văn & Tiếng Việt',
    shortName: 'Văn',
    icon: BookOpen,
    color: 'text-rose-500',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
    description: 'Tác phẩm văn học lớn, tiếng Việt, tu từ và nghệ thuật ngôn từ.',
  },
  {
    slug: 'tieng-anh',
    name: 'Tiếng Anh',
    shortName: 'Anh',
    icon: Languages,
    color: 'text-emerald-500',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    description: 'Academic vocabulary, grammar structures, reading & idioms.',
  },
  {
    slug: 'vat-ly',
    name: 'Vật lý',
    shortName: 'Lý',
    icon: Atom,
    color: 'text-indigo-500',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
    description: 'Cơ học, điện từ, sóng ánh sáng và các định luật vật lý thực nghiệm.',
  },
  {
    slug: 'hoa-hoc',
    name: 'Hóa học',
    shortName: 'Hóa',
    icon: FlaskConical,
    color: 'text-amber-500',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    description: 'Bảng tuần hoàn, phản ứng vô cơ, hữu cơ và ứng dụng đời sống.',
  },
  {
    slug: 'sinh-hoc',
    name: 'Sinh học & Y sinh',
    shortName: 'Sinh',
    icon: Dna,
    color: 'text-teal-500',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/30',
    description: 'Cơ chế di truyền phân tử ADN, tế bào học, sinh thái và cơ thể người.',
  },
  {
    slug: 'lich-su',
    name: 'Lịch sử',
    shortName: 'Sử',
    icon: Landmark,
    color: 'text-red-500',
    badgeColor: 'bg-red-500/10 text-red-600 border-red-500/30',
    description: 'Lịch sử hào hùng Việt Nam, các nền văn minh và sự kiện thế giới.',
  },
  {
    slug: 'dia-ly',
    name: 'Địa lý',
    shortName: 'Địa',
    icon: Globe2,
    color: 'text-sky-500',
    badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-500/30',
    description: 'Địa lý tự nhiên, khí hậu, các vùng kinh tế và bản đồ thế giới.',
  },
  {
    slug: 'kinh-te-phap-luat',
    name: 'Kinh tế & Pháp luật',
    shortName: 'KT&PL',
    icon: Scale,
    color: 'text-purple-500',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    description: 'Kinh tế thị trường, tài chính, Hiến pháp và pháp luật Việt Nam.',
  },
  {
    slug: 'tin-hoc',
    name: 'Tin học & Thuật toán',
    shortName: 'Tin',
    icon: Zap,
    color: 'text-yellow-600',
    badgeColor: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    description: 'Khoa học máy tính, cấu trúc dữ liệu, thuật toán và tư duy code.',
  },
  {
    slug: 'triet-hoc-logic',
    name: 'Tư duy Logic & Triết học',
    shortName: 'Logic',
    icon: Lightbulb,
    color: 'text-orange-500',
    badgeColor: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
    description: 'Tam đoạn luận, nhận diện ngụy biện, tư duy phản biện và triết học.',
  },
];

// --- 1. Matching Pairs Type ---
export interface MatchingPair {
  id: string;
  pairId: string;
  subjectSlug: string;
  subjectName: string;
  leftText: string;
  rightText: string;
}

export const MATCHING_PAIRS_BANK: MatchingPair[] = [
  // Toán học
  { id: 'm-toan-1', pairId: 'toan-p1', subjectSlug: 'toan-hoc', subjectName: 'Toán học', leftText: '√64', rightText: '8' },
  { id: 'm-toan-2', pairId: 'toan-p2', subjectSlug: 'toan-hoc', subjectName: 'Toán học', leftText: '2^5', rightText: '32' },
  { id: 'm-toan-3', pairId: 'toan-p3', subjectSlug: 'toan-hoc', subjectName: 'Toán học', leftText: 'Đạo hàm của x^3', rightText: '3x^2' },
  { id: 'm-toan-4', pairId: 'toan-p4', subjectSlug: 'toan-hoc', subjectName: 'Toán học', leftText: 'Sin(90°)', rightText: '1' },
  { id: 'm-toan-5', pairId: 'toan-p5', subjectSlug: 'toan-hoc', subjectName: 'Toán học', leftText: 'Số nguyên tố chẵn duy nhất', rightText: '2' },
  { id: 'm-toan-6', pairId: 'toan-p6', subjectSlug: 'toan-hoc', subjectName: 'Toán học', leftText: 'Diện tích hình tròn', rightText: 'π · r²' },

  // Ngữ văn
  { id: 'm-van-1', pairId: 'van-p1', subjectSlug: 'ngu-van', subjectName: 'Ngữ văn', leftText: 'Truyện Kiều', rightText: 'Nguyễn Du' },
  { id: 'm-van-2', pairId: 'van-p2', subjectSlug: 'ngu-van', subjectName: 'Ngữ văn', leftText: 'Tắt đèn', rightText: 'Ngô Tất Tố' },
  { id: 'm-van-3', pairId: 'van-p3', subjectSlug: 'ngu-van', subjectName: 'Ngữ văn', leftText: 'Lão Hạc', rightText: 'Nam Cao' },
  { id: 'm-van-4', pairId: 'van-p4', subjectSlug: 'ngu-van', subjectName: 'Ngữ văn', leftText: 'Sóng', rightText: 'Xuân Quỳnh' },
  { id: 'm-van-5', pairId: 'van-p5', subjectSlug: 'ngu-van', subjectName: 'Ngữ văn', leftText: 'Tây Tiến', rightText: 'Quang Dũng' },
  { id: 'm-van-6', pairId: 'van-p6', subjectSlug: 'ngu-van', subjectName: 'Ngữ văn', leftText: 'Đất Nước', rightText: 'Nguyễn Khoa Điềm' },

  // Tiếng Anh
  { id: 'm-anh-1', pairId: 'anh-p1', subjectSlug: 'tieng-anh', subjectName: 'Tiếng Anh', leftText: 'Gigantic', rightText: 'Enormous' },
  { id: 'm-anh-2', pairId: 'anh-p2', subjectSlug: 'tieng-anh', subjectName: 'Tiếng Anh', leftText: 'Essential', rightText: 'Crucial' },
  { id: 'm-anh-3', pairId: 'anh-p3', subjectSlug: 'tieng-anh', subjectName: 'Tiếng Anh', leftText: 'Obligatory', rightText: 'Mandatory' },
  { id: 'm-anh-4', pairId: 'anh-p4', subjectSlug: 'tieng-anh', subjectName: 'Tiếng Anh', leftText: 'Abundant', rightText: 'Plentiful' },
  { id: 'm-anh-5', pairId: 'anh-p5', subjectSlug: 'tieng-anh', subjectName: 'Tiếng Anh', leftText: 'Tolerate', rightText: 'Put up with' },
  { id: 'm-anh-6', pairId: 'anh-p6', subjectSlug: 'tieng-anh', subjectName: 'Tiếng Anh', leftText: 'Innovate', rightText: 'Pioneer' },

  // Vật lý
  { id: 'm-ly-1', pairId: 'ly-p1', subjectSlug: 'vat-ly', subjectName: 'Vật lý', leftText: 'Vận tốc ánh sáng c', rightText: '300.000 km/s' },
  { id: 'm-ly-2', pairId: 'ly-p2', subjectSlug: 'vat-ly', subjectName: 'Vật lý', leftText: 'Đơn vị điện tích', rightText: 'Culông (C)' },
  { id: 'm-ly-3', pairId: 'ly-p3', subjectSlug: 'vat-ly', subjectName: 'Vật lý', leftText: 'Đơn vị công suất', rightText: 'Oát (W)' },
  { id: 'm-ly-4', pairId: 'ly-p4', subjectSlug: 'vat-ly', subjectName: 'Vật lý', leftText: 'Định luật II Newton', rightText: 'F = m · a' },
  { id: 'm-ly-5', pairId: 'ly-p5', subjectSlug: 'vat-ly', subjectName: 'Vật lý', leftText: 'Sóng điện từ tần số cao', rightText: 'Tia Gamma' },
  { id: 'm-ly-6', pairId: 'ly-p6', subjectSlug: 'vat-ly', subjectName: 'Vật lý', leftText: 'Gia tốc trọng trường', rightText: 'g ≈ 9.8 m/s²' },

  // Hóa học
  { id: 'm-hoa-1', pairId: 'hoa-p1', subjectSlug: 'hoa-hoc', subjectName: 'Hóa học', leftText: 'Vôi sống', rightText: 'CaO' },
  { id: 'm-hoa-2', pairId: 'hoa-p2', subjectSlug: 'hoa-hoc', subjectName: 'Hóa học', leftText: 'Muối ăn thông dụng', rightText: 'NaCl' },
  { id: 'm-hoa-3', pairId: 'hoa-p3', subjectSlug: 'hoa-hoc', subjectName: 'Hóa học', leftText: 'Khí cười', rightText: 'N2O' },
  { id: 'm-hoa-4', pairId: 'hoa-p4', subjectSlug: 'hoa-hoc', subjectName: 'Hóa học', leftText: 'Kim loại dẫn điện tốt nhất', rightText: 'Bạc (Ag)' },
  { id: 'm-hoa-5', pairId: 'hoa-p5', subjectSlug: 'hoa-hoc', subjectName: 'Hóa học', leftText: 'Kim loại nhẹ nhất', rightText: 'Liti (Li)' },
  { id: 'm-hoa-6', pairId: 'hoa-p6', subjectSlug: 'hoa-hoc', subjectName: 'Hóa học', leftText: 'Axit clohiđric', rightText: 'HCl' },

  // Sinh học
  { id: 'm-sinh-1', pairId: 'sinh-p1', subjectSlug: 'sinh-hoc', subjectName: 'Sinh học', leftText: 'Đơn phân của ADN', rightText: 'Nuclêôtit' },
  { id: 'm-sinh-2', pairId: 'sinh-p2', subjectSlug: 'sinh-hoc', subjectName: 'Sinh học', leftText: 'Đơn phân của Protein', rightText: 'Axit amin' },
  { id: 'm-sinh-3', pairId: 'sinh-p3', subjectSlug: 'sinh-hoc', subjectName: 'Sinh học', leftText: 'Bào quan quang hợp', rightText: 'Lục lạp' },
  { id: 'm-sinh-4', pairId: 'sinh-p4', subjectSlug: 'sinh-hoc', subjectName: 'Sinh học', leftText: 'Bào quan hô hấp tế bào', rightText: 'Ti thể' },
  { id: 'm-sinh-5', pairId: 'sinh-p5', subjectSlug: 'sinh-hoc', subjectName: 'Sinh học', leftText: 'Nhóm máu chuyên cho', rightText: 'Nhóm máu O' },
  { id: 'm-sinh-6', pairId: 'sinh-p6', subjectSlug: 'sinh-hoc', subjectName: 'Sinh học', leftText: 'Nhóm máu chuyên nhận', rightText: 'Nhóm máu AB' },

  // Lịch sử
  { id: 'm-su-1', pairId: 'su-p1', subjectSlug: 'lich-su', subjectName: 'Lịch sử', leftText: 'Chiến thắng Điện Biên Phủ', rightText: 'Năm 1954' },
  { id: 'm-su-2', pairId: 'su-p2', subjectSlug: 'lich-su', subjectName: 'Lịch sử', leftText: 'Cách mạng Tháng Tám', rightText: 'Năm 1945' },
  { id: 'm-su-3', pairId: 'su-p3', subjectSlug: 'lich-su', subjectName: 'Lịch sử', leftText: 'Giải phóng miền Nam', rightText: '30/4/1975' },
  { id: 'm-su-4', pairId: 'su-p4', subjectSlug: 'lich-su', subjectName: 'Lịch sử', leftText: 'Chiến thắng Bạch Đằng', rightText: 'Năm 938' },
  { id: 'm-su-5', pairId: 'su-p5', subjectSlug: 'lich-su', subjectName: 'Lịch sử', leftText: 'Chiếu dời đô về Thăng Long', rightText: 'Năm 1010' },
  { id: 'm-su-6', pairId: 'su-p6', subjectSlug: 'lich-su', subjectName: 'Lịch sử', leftText: 'Chiến dịch Hồ Chí Minh', rightText: 'Tháng 4/1975' },

  // Địa lý
  { id: 'm-dia-1', pairId: 'dia-p1', subjectSlug: 'dia-ly', subjectName: 'Địa lý', leftText: 'Đỉnh núi cao nhất VN', rightText: 'Fansipan (3.143m)' },
  { id: 'm-dia-2', pairId: 'dia-p2', subjectSlug: 'dia-ly', subjectName: 'Địa lý', leftText: 'Thủ đô của nước Úc', rightText: 'Canberra' },
  { id: 'm-dia-3', pairId: 'dia-p3', subjectSlug: 'dia-ly', subjectName: 'Địa lý', leftText: 'Hoang mạc lớn nhất thế giới', rightText: 'Sahara' },
  { id: 'm-dia-4', pairId: 'dia-p4', subjectSlug: 'dia-ly', subjectName: 'Địa lý', leftText: 'Đảo lớn nhất Việt Nam', rightText: 'Phú Quốc' },
  { id: 'm-dia-5', pairId: 'dia-p5', subjectSlug: 'dia-ly', subjectName: 'Địa lý', leftText: 'Hồ nước ngọt lớn nhất VN', rightText: 'Hồ Ba Bể' },
  { id: 'm-dia-6', pairId: 'dia-p6', subjectSlug: 'dia-ly', subjectName: 'Địa lý', leftText: 'Dãy núi dài nhất thế giới', rightText: 'Dãy Andes' },

  // Kinh tế & Pháp luật
  { id: 'm-ktpl-1', pairId: 'ktpl-p1', subjectSlug: 'kinh-te-phap-luat', subjectName: 'Kinh tế & Pháp luật', leftText: 'Độ tuổi chịu TN hình sự', rightText: 'Từ đủ 14 tuổi' },
  { id: 'm-ktpl-2', pairId: 'ktpl-p2', subjectSlug: 'kinh-te-phap-luat', subjectName: 'Kinh tế & Pháp luật', leftText: 'Hiến pháp hiện hành VN', rightText: 'Hiến pháp 2013' },
  { id: 'm-ktpl-3', pairId: 'ktpl-p3', subjectSlug: 'kinh-te-phap-luat', subjectName: 'Kinh tế & Pháp luật', leftText: 'Khi Cung > Cầu', rightText: 'Giá có xu hướng giảm' },
  { id: 'm-ktpl-4', pairId: 'ktpl-p4', subjectSlug: 'kinh-te-phap-luat', subjectName: 'Kinh tế & Pháp luật', leftText: 'Cơ quan quyền lực nhà nước cao nhất', rightText: 'Quốc hội' },
  { id: 'm-ktpl-5', pairId: 'ktpl-p5', subjectSlug: 'kinh-te-phap-luat', subjectName: 'Kinh tế & Pháp luật', leftText: 'Độ tuổi bầu cử công dân', rightText: 'Từ đủ 18 tuổi' },
  { id: 'm-ktpl-6', pairId: 'ktpl-p6', subjectSlug: 'kinh-te-phap-luat', subjectName: 'Kinh tế & Pháp luật', leftText: 'Tài chính công', rightText: 'Ngân sách Nhà nước' },

  // Tin học & Thuật toán
  { id: 'm-tin-1', pairId: 'tin-p1', subjectSlug: 'tin-hoc', subjectName: 'Tin học', leftText: 'Độ phức tạp Binary Search', rightText: 'O(log n)' },
  { id: 'm-tin-2', pairId: 'tin-p2', subjectSlug: 'tin-hoc', subjectName: 'Tin học', leftText: 'Cấu trúc LIFO (Last In First Out)', rightText: 'Stack (Ngăn xếp)' },
  { id: 'm-tin-3', pairId: 'tin-p3', subjectSlug: 'tin-hoc', subjectName: 'Tin học', leftText: 'Cấu trúc FIFO (First In First Out)', rightText: 'Queue (Hàng đợi)' },
  { id: 'm-tin-4', pairId: 'tin-p4', subjectSlug: 'tin-hoc', subjectName: 'Tin học', leftText: 'Dung lượng 1 Byte', rightText: '8 Bits' },
  { id: 'm-tin-5', pairId: 'tin-p5', subjectSlug: 'tin-hoc', subjectName: 'Tin học', leftText: 'Giao thức web bảo mật', rightText: 'HTTPS (Port 443)' },
  { id: 'm-tin-6', pairId: 'tin-p6', subjectSlug: 'tin-hoc', subjectName: 'Tin học', leftText: 'Thuật toán tìm đường ngắn nhất', rightText: 'Dijkstra' },

  // Logic & Triết học
  { id: 'm-logic-1', pairId: 'logic-p1', subjectSlug: 'triet-hoc-logic', subjectName: 'Logic & Triết học', leftText: 'Tam đoạn luận', rightText: 'Aristotle' },
  { id: 'm-logic-2', pairId: 'logic-p2', subjectSlug: 'triet-hoc-logic', subjectName: 'Logic & Triết học', leftText: 'Ngụy biện công kích cá nhân', rightText: 'Ad Hominem' },
  { id: 'm-logic-3', pairId: 'logic-p3', subjectSlug: 'triet-hoc-logic', subjectName: 'Logic & Triết học', leftText: 'Quy luật mâu thuẫn', rightText: 'Động lực phát triển' },
  { id: 'm-logic-4', pairId: 'logic-p4', subjectSlug: 'triet-hoc-logic', subjectName: 'Logic & Triết học', leftText: 'Vật chất quyết định ý thức', rightText: 'Chủ nghĩa duy vật' },
  { id: 'm-logic-5', pairId: 'logic-p5', subjectSlug: 'triet-hoc-logic', subjectName: 'Logic & Triết học', leftText: 'Phép biện chứng duy vật', rightText: 'Karl Marx & Engels' },
  { id: 'm-logic-6', pairId: 'logic-p6', subjectSlug: 'triet-hoc-logic', subjectName: 'Logic & Triết học', leftText: 'Nghịch lý Achilles và Rùa', rightText: 'Zeno thành Elea' },
];

// --- 2. Multiple / Single Choice Questions ---
export interface PracticeQuestion {
  id: string;
  subjectSlug: string;
  subjectName: string;
  prompt: string;
  options: { key: string; text: string }[];
  correctKey: string;
  explanation: string;
}

export const PRACTICE_QUESTIONS_BANK: PracticeQuestion[] = [
  // Toán học
  {
    id: 'pq-toan-1',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Số nguyên tố chẵn duy nhất trong tập hợp các số tự nhiên là số nào?',
    options: [
      { key: 'A', text: '0' },
      { key: 'B', text: '2' },
      { key: 'C', text: '4' },
      { key: 'D', text: 'Không có số nào' },
    ],
    correctKey: 'B',
    explanation: 'Số 2 là số nguyên tố chẵn duy nhất vì chỉ chia hết cho 1 và chính nó. Mọi số chẵn lớn hơn 2 đều chia hết cho 2 nên là hợp số.',
  },
  {
    id: 'pq-toan-2',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Đạo hàm của hàm số y = ln(x) với x > 0 là gì?',
    options: [
      { key: 'A', text: '1/x' },
      { key: 'B', text: 'e^x' },
      { key: 'C', text: '-1/x^2' },
      { key: 'D', text: 'x' },
    ],
    correctKey: 'A',
    explanation: 'Công thức đạo hàm cơ bản: (ln x)\' = 1/x với mọi x > 0.',
  },
  {
    id: 'pq-toan-3',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Tổng các góc trong một tam giác phẳng bằng bao nhiêu độ?',
    options: [
      { key: 'A', text: '90°' },
      { key: 'B', text: '180°' },
      { key: 'C', text: '270°' },
      { key: 'D', text: '360°' },
    ],
    correctKey: 'B',
    explanation: 'Định lý hình học Euclid: Tổng ba góc trong bất kỳ tam giác phẳng nào luôn bằng 180° (hay π radian).',
  },
  {
    id: 'pq-toan-4',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Nghiệm của phương trình logarit log₂(x) = 5 là bao nhiêu?',
    options: [
      { key: 'A', text: '10' },
      { key: 'B', text: '25' },
      { key: 'C', text: '32' },
      { key: 'D', text: '64' },
    ],
    correctKey: 'C',
    explanation: 'Ta có x = 2^5 = 32.',
  },

  // Ngữ văn
  {
    id: 'pq-van-1',
    subjectSlug: 'ngu-van',
    subjectName: 'Ngữ văn & Tiếng Việt',
    prompt: 'Tác phẩm "Nam quốc sơn hà" được coi là bản Tuyên ngôn Độc lập thứ mấy của dân tộc ta?',
    options: [
      { key: 'A', text: 'Bản thứ nhất' },
      { key: 'B', text: 'Bản thứ hai' },
      { key: 'C', text: 'Bản thứ ba' },
      { key: 'D', text: 'Bản thứ tư' },
    ],
    correctKey: 'A',
    explanation: 'Bài thơ thần "Nam quốc sơn hà" tương truyền của Lý Thường Kiệt được coi là bản Tuyên ngôn Độc lập đầu tiên của nước Việt.',
  },
  {
    id: 'pq-van-2',
    subjectSlug: 'ngu-van',
    subjectName: 'Ngữ văn & Tiếng Việt',
    prompt: 'Nhân vật Chí Phèo trong tác phẩm cùng tên của nhà văn Nam Cao khao khát điều gì nhất trước khi chết?',
    options: [
      { key: 'A', text: 'Tiền bạc và ruộng đất' },
      { key: 'B', text: 'Được làm người lương thiện' },
      { key: 'C', text: 'Rượu và đồ nhắm' },
      { key: 'D', text: 'Sự tha thứ của dân làng Vũ Đại' },
    ],
    correctKey: 'B',
    explanation: 'Tiếng kêu xé lòng của Chí Phèo: "Ai cho tao lương thiện? Làm thế nào cho mất được những vết mảnh chai trên mặt này?".',
  },
  {
    id: 'pq-van-3',
    subjectSlug: 'ngu-van',
    subjectName: 'Ngữ văn & Tiếng Việt',
    prompt: 'Biện pháp tu từ nào được sử dụng trong câu ca dao: "Thân em như chẽn lúa đòng đòng / Phất phơ dưới ngọn nắng hồng ban mai"?',
    options: [
      { key: 'A', text: 'So sánh' },
      { key: 'B', text: 'Ẩn dụ' },
      { key: 'C', text: 'Hoán dụ' },
      { key: 'D', text: 'Chơi chữ' },
    ],
    correctKey: 'A',
    explanation: 'Từ so sánh "như" dùng để đối sánh vẻ đẹp thanh xuân tràn trề sức sống của người con gái với chẽn lúa đòng đòng.',
  },

  // Tiếng Anh
  {
    id: 'pq-anh-1',
    subjectSlug: 'tieng-anh',
    subjectName: 'Tiếng Anh',
    prompt: 'Which word is the CLOSEST in meaning to "ubiquitous"?',
    options: [
      { key: 'A', text: 'Omnipresent (everywhere)' },
      { key: 'B', text: 'Extremely rare' },
      { key: 'C', text: 'Dangerous' },
      { key: 'D', text: 'Temporary' },
    ],
    correctKey: 'A',
    explanation: '"Ubiquitous" means present, appearing, or found everywhere (omnipresent).',
  },
  {
    id: 'pq-anh-2',
    subjectSlug: 'tieng-anh',
    subjectName: 'Tiếng Anh',
    prompt: 'Choose the correct form: "If she _______ harder, she would have passed the IELTS test with an 8.0."',
    options: [
      { key: 'A', text: 'studied' },
      { key: 'B', text: 'had studied' },
      { key: 'C', text: 'studies' },
      { key: 'D', text: 'would study' },
    ],
    correctKey: 'B',
    explanation: 'This is a Conditional Sentence Type 3 (unreal in the past): If + S + had + P.P, S + would have + P.P.',
  },
  {
    id: 'pq-anh-3',
    subjectSlug: 'tieng-anh',
    subjectName: 'Tiếng Anh',
    prompt: 'What does the idiom "burn the midnight oil" mean?',
    options: [
      { key: 'A', text: 'To cause an accidental fire' },
      { key: 'B', text: 'To work or study late into the night' },
      { key: 'C', text: 'To waste fuel recklessly' },
      { key: 'D', text: 'To wake up early before sunrise' },
    ],
    correctKey: 'B',
    explanation: '"Burn the midnight oil" means staying awake and working/studying diligently until very late at night.',
  },

  // Vật lý
  {
    id: 'pq-ly-1',
    subjectSlug: 'vat-ly',
    subjectName: 'Vật lý',
    prompt: 'Vận tốc truyền âm lớn nhất trong môi trường nào sau đây?',
    options: [
      { key: 'A', text: 'Chất rắn' },
      { key: 'B', text: 'Chất lỏng' },
      { key: 'C', text: 'Chất khí' },
      { key: 'D', text: 'Chân không' },
    ],
    correctKey: 'A',
    explanation: 'Âm thanh truyền nhanh nhất trong chất rắn, kế tiếp là chất lỏng, chậm nhất trong chất khí và hoàn toàn không truyền được trong chân không.',
  },
  {
    id: 'pq-ly-2',
    subjectSlug: 'vat-ly',
    subjectName: 'Vật lý',
    prompt: 'Hiện tượng quang điện ngoài xảy ra khi chiếu ánh sáng thích hợp vào bề mặt kim loại làm bật ra hạt nào?',
    options: [
      { key: 'A', text: 'Proton' },
      { key: 'B', text: 'Notron' },
      { key: 'C', text: 'Electron' },
      { key: 'D', text: 'Hạt nhân He' },
    ],
    correctKey: 'C',
    explanation: 'Hiện tượng quang điện ngoài là hiện tượng ánh sáng giải phóng các electron khỏi bề mặt kim loại khi bước sóng ánh sáng λ ≤ λ₀.',
  },
  {
    id: 'pq-ly-3',
    subjectSlug: 'vat-ly',
    subjectName: 'Vật lý',
    prompt: 'Trong mạch điện xoay chiều chỉ có tụ điện C, điện áp hai đầu đoạn mạch so với cường độ dòng điện sẽ như thế nào?',
    options: [
      { key: 'A', text: 'Cùng pha' },
      { key: 'B', text: 'Sớm pha π/2' },
      { key: 'C', text: 'Trễ pha π/2' },
      { key: 'D', text: 'Ngược pha π' },
    ],
    correctKey: 'C',
    explanation: 'Trong mạch thuần C, dòng điện i sớm pha hơn điện áp u một góc π/2 (tức u trễ pha π/2 so với i).',
  },

  // Hóa học
  {
    id: 'pq-hoa-1',
    subjectSlug: 'hoa-hoc',
    subjectName: 'Hóa học',
    prompt: 'Kim loại nào có nhiệt độ nóng chảy cao nhất, thường được ứng dụng làm dây tóc bóng đèn sợi đốt?',
    options: [
      { key: 'A', text: 'Sắt (Fe)' },
      { key: 'B', text: 'Đồng (Cu)' },
      { key: 'C', text: 'Vonfram (W)' },
      { key: 'D', text: 'Bạch kim (Pt)' },
    ],
    correctKey: 'C',
    explanation: 'Vonfram (W) có nhiệt độ nóng chảy lên tới ~3.422 °C, cao nhất trong tất cả các kim loại.',
  },
  {
    id: 'pq-hoa-2',
    subjectSlug: 'hoa-hoc',
    subjectName: 'Hóa học',
    prompt: 'Khi nhỏ dung dịch iot vào hồ tinh bột, hiện tượng quan sát được là gì?',
    options: [
      { key: 'A', text: 'Xuất hiện màu đỏ gạch' },
      { key: 'B', text: 'Xuất hiện màu xanh tím đặc trưng' },
      { key: 'C', text: 'Tạo kết tủa trắng' },
      { key: 'D', text: 'Dung dịch sủi bọt khí không màu' },
    ],
    correctKey: 'B',
    explanation: 'Iot chui vào các rãnh xoắn của chuỗi amilozơ trong tinh bột tạo phức chất màu xanh tím đặc trưng.',
  },
  {
    id: 'pq-hoa-3',
    subjectSlug: 'hoa-hoc',
    subjectName: 'Hóa học',
    prompt: 'Chất nào sau đây là thành phần chính của khí đầm lầy, khí thiên nhiên và khí biogas?',
    options: [
      { key: 'A', text: 'Metan (CH4)' },
      { key: 'B', text: 'Etilen (C2H4)' },
      { key: 'C', text: 'Axetilen (C2H2)' },
      { key: 'D', text: 'Benzen (C6H6)' },
    ],
    correctKey: 'A',
    explanation: 'Metan (CH4) là hidrocacbon đơn giản nhất, chiếm tới 80 - 95% thành phần của khí thiên nhiên và khí biogas.',
  },

  // Sinh học
  {
    id: 'pq-sinh-1',
    subjectSlug: 'sinh-hoc',
    subjectName: 'Sinh học & Y sinh',
    prompt: 'Đơn phân cấu tạo nên phân tử ADN là loại hợp chất nào?',
    options: [
      { key: 'A', text: 'Axit amin' },
      { key: 'B', text: 'Nuclêôtit' },
      { key: 'C', text: 'Axit béo' },
      { key: 'D', text: 'Glucôzơ' },
    ],
    correctKey: 'B',
    explanation: 'Phân tử ADN cấu tạo theo nguyên tắc đa phân từ các đơn phân nuclêôtit (Adenin, Timin, Guanin, Xitôzin).',
  },
  {
    id: 'pq-sinh-2',
    subjectSlug: 'sinh-hoc',
    subjectName: 'Sinh học & Y sinh',
    prompt: 'Bào quan nào trong tế bào thực vật chịu trách nhiệm trực tiếp cho quá trình quang hợp?',
    options: [
      { key: 'A', text: 'Ti thể' },
      { key: 'B', text: 'Lục lạp' },
      { key: 'C', text: 'Không bào' },
      { key: 'D', text: 'Ribôxôm' },
    ],
    correctKey: 'B',
    explanation: 'Lục lạp chứa chất diệp lục hấp thụ năng lượng ánh sáng mặt trời để chuyển hóa CO2 và H2O thành chất hữu cơ và O2.',
  },

  // Lịch sử
  {
    id: 'pq-su-1',
    subjectSlug: 'lich-su',
    subjectName: 'Lịch sử',
    prompt: 'Chiến thắng nào của quân dân ta đã đập tan tập đoàn cứ điểm mạnh nhất Đông Dương của thực dân Pháp?',
    options: [
      { key: 'A', text: 'Chiến dịch Việt Bắc 1947' },
      { key: 'B', text: 'Chiến dịch Biên giới 1950' },
      { key: 'C', text: 'Chiến dịch Điện Biên Phủ 1954' },
      { key: 'D', text: 'Chiến dịch Hồ Chí Minh 1975' },
    ],
    correctKey: 'C',
    explanation: 'Chiến thắng lịch sử Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" ngày 7/5/1954 buộc Pháp ký Hiệp định Giơ-ne-vơ.',
  },
  {
    id: 'pq-su-2',
    subjectSlug: 'lich-su',
    subjectName: 'Lịch sử',
    prompt: 'Tổ chức Liên Hợp Quốc (UN) chính thức được thành lập vào năm nào sau Chiến tranh thế giới thứ hai?',
    options: [
      { key: 'A', text: '1945' },
      { key: 'B', text: '1948' },
      { key: 'C', text: '1950' },
      { key: 'D', text: '1939' },
    ],
    correctKey: 'A',
    explanation: 'Hiến chương Liên Hợp Quốc có hiệu lực vào ngày 24 tháng 10 năm 1945, đánh dấu sự ra đời của tổ chức quốc tế lớn nhất hành tinh.',
  },

  // Địa lý
  {
    id: 'pq-dia-1',
    subjectSlug: 'dia-ly',
    subjectName: 'Địa lý',
    prompt: 'Đặc điểm khí hậu nổi bật của phần lãnh thổ phía Bắc nước ta (từ dãy Bạch Mã trở ra) là gì?',
    options: [
      { key: 'A', text: 'Nhiệt đới gió mùa có một mùa đông lạnh' },
      { key: 'B', text: 'Cận xích đạo gió mùa nắng nóng quanh năm' },
      { key: 'C', text: 'Ôn đới lục địa khô hạn' },
      { key: 'D', text: 'Địa trung hải mưa nhiều mùa đông' },
    ],
    correctKey: 'A',
    explanation: 'Phía Bắc chịu ảnh hưởng mạnh của gió mùa Đông Bắc nên có mùa đông lạnh, ít mưa và nửa cuối mùa đông ẩm ướt có mưa phùn.',
  },
  {
    id: 'pq-dia-2',
    subjectSlug: 'dia-ly',
    subjectName: 'Địa lý',
    prompt: 'Đồng bằng châu thổ nào có diện tích lớn nhất Việt Nam?',
    options: [
      { key: 'A', text: 'Đồng bằng sông Hồng' },
      { key: 'B', text: 'Đồng bằng sông Cửu Long' },
      { key: 'C', text: 'Đồng bằng duyên hải miền Trung' },
      { key: 'D', text: 'Đồng bằng sông Mã' },
    ],
    correctKey: 'B',
    explanation: 'Đồng bằng sông Cửu Long (Đồng bằng Tây Nam Bộ) có diện tích khoảng 40.000 km², lớn nhất cả nước.',
  },

  // Kinh tế & Pháp luật
  {
    id: 'pq-ktpl-1',
    subjectSlug: 'kinh-te-phap-luat',
    subjectName: 'Kinh tế & Pháp luật',
    prompt: 'Khi mức giá chung của các hàng hóa và dịch vụ tăng lên liên tục theo thời gian, hiện tượng này được gọi là gì?',
    options: [
      { key: 'A', text: 'Lạm phát' },
      { key: 'B', text: 'Giảm phát' },
      { key: 'C', text: 'Khủng hoảng dư thừa' },
      { key: 'D', text: 'Đình đốn kinh tế' },
    ],
    correctKey: 'A',
    explanation: 'Lạm phát (Inflation) là sự gia tăng liên tục của mức giá chung trong nền kinh tế, dẫn đến sự suy giảm sức mua của đồng tiền.',
  },
  {
    id: 'pq-ktpl-2',
    subjectSlug: 'kinh-te-phap-luat',
    subjectName: 'Kinh tế & Pháp luật',
    prompt: 'Theo Hiến pháp nước Cộng hòa Xã hội Chủ nghĩa Việt Nam năm 2013, cơ quan nào là cơ quan đại biểu cao nhất của Nhân dân?',
    options: [
      { key: 'A', text: 'Chính phủ' },
      { key: 'B', text: 'Quốc hội' },
      { key: 'C', text: 'Tòa án nhân dân tối cao' },
      { key: 'D', text: 'Viện kiểm sát nhân dân tối cao' },
    ],
    correctKey: 'B',
    explanation: 'Quốc hội là cơ quan đại biểu cao nhất của Nhân dân, cơ quan quyền lực nhà nước cao nhất của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
  },

  // Tin học & Thuật toán
  {
    id: 'pq-tin-1',
    subjectSlug: 'tin-hoc',
    subjectName: 'Tin học & Thuật toán',
    prompt: 'Độ phức tạp thời gian trong trường hợp xấu nhất của thuật toán Tìm kiếm nhị phân (Binary Search) trên mảng đã sắp xếp n phần tử là gì?',
    options: [
      { key: 'A', text: 'O(1)' },
      { key: 'B', text: 'O(log n)' },
      { key: 'C', text: 'O(n)' },
      { key: 'D', text: 'O(n²)' },
    ],
    correctKey: 'B',
    explanation: 'Mỗi lần so sánh loại bỏ một nửa không gian tìm kiếm, do đó số bước tối đa là log₂ n, độ phức tạp là O(log n).',
  },
  {
    id: 'pq-tin-2',
    subjectSlug: 'tin-hoc',
    subjectName: 'Tin học & Thuật toán',
    prompt: 'Cấu trúc dữ liệu nào hoạt động theo nguyên tắc LIFO (Last In, First Out — Vào sau, Ra trước)?',
    options: [
      { key: 'A', text: 'Hàng đợi (Queue)' },
      { key: 'B', text: 'Ngăn xếp (Stack)' },
      { key: 'C', text: 'Cây nhị phân (Binary Tree)' },
      { key: 'D', text: 'Bảng băm (Hash Table)' },
    ],
    correctKey: 'B',
    explanation: 'Ngăn xếp (Stack) lưu trữ phần tử sao cho phần tử nào đẩy vào sau cùng sẽ được lấy ra đầu tiên (LIFO).',
  },

  // Logic & Triết học
  {
    id: 'pq-logic-1',
    subjectSlug: 'triet-hoc-logic',
    subjectName: 'Tư duy Logic & Triết học',
    prompt: 'Cho hai tiền đề: (1) "Mọi kim loại đều dẫn điện", (2) "Đồng là kim loại". Kết luận suy luận logic hợp lệ là gì?',
    options: [
      { key: 'A', text: 'Đồng dẫn điện' },
      { key: 'B', text: 'Chỉ có đồng mới dẫn điện' },
      { key: 'C', text: 'Kim loại nào cũng là đồng' },
      { key: 'D', text: 'Đồng không dẫn điện' },
    ],
    correctKey: 'A',
    explanation: 'Đây là dạng suy diễn tam đoạn luận cơ bản (Barbara): Mọi M là P; S là M -> Suy ra S là P (Đồng dẫn điện).',
  },
  {
    id: 'pq-logic-2',
    subjectSlug: 'triet-hoc-logic',
    subjectName: 'Tư duy Logic & Triết học',
    prompt: 'Ngụy biện nào xảy ra khi thay vì phản bác luận điểm, người tranh luận lại tấn công vào xuất thân, phẩm chất cá nhân của đối phương?',
    options: [
      { key: 'A', text: 'Ngụy biện bù nhìn rơm (Straw Man)' },
      { key: 'B', text: 'Ngụy biện công kích cá nhân (Ad Hominem)' },
      { key: 'C', text: 'Ngụy biện viện dẫn uy quyền vô căn cứ' },
      { key: 'D', text: 'Ngụy biện dốc trượt phi lý (Slippery Slope)' },
    ],
    correctKey: 'B',
    explanation: 'Ad Hominem là lỗi ngụy biện phổ biến khi đánh lạc hướng tranh luận bằng cách xúc phạm hoặc nhắm vào tư cách người đối thoại.',
  },
];

// --- 3. Fill In The Blank Questions (for SpeedBlank) ---
export interface BlankQuestion {
  id: string;
  subjectSlug: string;
  subjectName: string;
  prompt: string;
  hint: string;
  expectedAnswer: string;
  explanation: string;
}

export const BLANK_QUESTIONS_BANK: BlankQuestion[] = [
  // Toán học
  {
    id: 'bq-toan-1',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Giá trị nhỏ nhất của hàm số f(x) = x^2 - 4x + 9 là bao nhiêu? (Nhập số nguyên)',
    hint: 'Biến đổi về dạng hằng đẳng thức (x - a)^2 + b',
    expectedAnswer: '5',
    explanation: 'Ta có f(x) = (x - 2)^2 + 5. Do (x - 2)^2 >= 0 với mọi x nên f(x) >= 5. GTNN bằng 5.',
  },
  {
    id: 'bq-toan-2',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Có bao nhiêu số nguyên tố nhỏ hơn 10? (Nhập số lượng)',
    hint: 'Các số đó là 2, 3, 5, 7',
    expectedAnswer: '4',
    explanation: 'Có 4 số nguyên tố nhỏ hơn 10 là: 2, 3, 5, 7.',
  },

  // Ngữ văn
  {
    id: 'bq-van-1',
    subjectSlug: 'ngu-van',
    subjectName: 'Ngữ văn',
    prompt: 'Điền từ còn thiếu vào câu thơ: "Quân xanh màu lá dữ oai..." (Tây Tiến - Quang Dũng)?',
    hint: 'Một từ chỉ loài thú chúa sơn lâm hung dữ',
    expectedAnswer: 'hùm',
    explanation: 'Câu thơ trọn vẹn: "Tây Tiến đoàn binh không mọc tóc / Quân xanh màu lá dữ oai hùm".',
  },
  {
    id: 'bq-van-2',
    subjectSlug: 'ngu-van',
    subjectName: 'Ngữ văn',
    prompt: 'Tác giả của bài thơ "Sóng" là nữ nhà thơ nào? (Gõ tên đầy đủ)',
    hint: 'Vợ của nhà viết kịch tài hoa Lưu Quang Vũ',
    expectedAnswer: 'Xuân Quỳnh',
    explanation: 'Bài thơ "Sóng" được nữ thi sĩ Xuân Quỳnh sáng tác năm 1967 tại bãi biển Diêm Điền.',
  },

  // Tiếng Anh
  {
    id: 'bq-anh-1',
    subjectSlug: 'tieng-anh',
    subjectName: 'Tiếng Anh',
    prompt: 'What is the past participle (V3) of the irregular verb "fly"? (Type one word)',
    hint: 'fly - flew - ...',
    expectedAnswer: 'flown',
    explanation: 'Bảng động từ bất quy tắc: fly -> flew -> flown.',
  },
  {
    id: 'bq-anh-2',
    subjectSlug: 'tieng-anh',
    subjectName: 'Tiếng Anh',
    prompt: 'Fill in the preposition: "She is very good ______ playing chess."',
    hint: 'Good followed by which preposition?',
    expectedAnswer: 'at',
    explanation: 'Cấu trúc thành ngữ: to be good at something (giỏi về cái gì).',
  },

  // Vật lý
  {
    id: 'bq-ly-1',
    subjectSlug: 'vat-ly',
    subjectName: 'Vật lý',
    prompt: 'Điện trở tương đương của hai điện trở R1 = 6Ω và R2 = 3Ω mắc song song là bao nhiêu Ω? (Nhập số)',
    hint: 'Công thức: (R1 * R2) / (R1 + R2)',
    expectedAnswer: '2',
    explanation: 'Rtd = (6 * 3) / (6 + 3) = 18 / 9 = 2 Ω.',
  },
  {
    id: 'bq-ly-2',
    subjectSlug: 'vat-ly',
    subjectName: 'Vật lý',
    prompt: 'Trong hệ SI, đơn vị của lực là gì? (Nhập tên nhà khoa học phát hiện định luật vạn vật hấp dẫn)',
    hint: 'Ký hiệu là N',
    expectedAnswer: 'Newton',
    explanation: 'Đơn vị đo lực là Newton (N), đặt tên theo nhà bác học Isaac Newton.',
  },

  // Hóa học
  {
    id: 'bq-hoa-1',
    subjectSlug: 'hoa-hoc',
    subjectName: 'Hóa học',
    prompt: 'Khí gì thoát ra khi cho canxi cacbonat (đá vôi CaCO3) phản ứng với dung dịch axit clohiđric (HCl)? (Nhập công thức hóa học)',
    hint: 'Khí gây hiệu ứng nhà kính chính',
    expectedAnswer: 'CO2',
    explanation: 'CaCO3 + 2HCl -> CaCl2 + CO2↑ + H2O. Khí thoát ra là CO2.',
  },
  {
    id: 'bq-hoa-2',
    subjectSlug: 'hoa-hoc',
    subjectName: 'Hóa học',
    prompt: 'Ký hiệu hóa học của nguyên tố Vàng là gì?',
    hint: 'Gồm 2 chữ cái viết tắt từ Aurum trong tiếng Latin',
    expectedAnswer: 'Au',
    explanation: 'Vàng có ký hiệu hóa học là Au (số hiệu nguyên tử 79).',
  },

  // Sinh học
  {
    id: 'bq-sinh-1',
    subjectSlug: 'sinh-hoc',
    subjectName: 'Sinh học',
    prompt: 'Bộ nhiễm sắc thể lưỡng bội bình thường của người gồm bao nhiêu chiếc? (Nhập số)',
    hint: '2n = ...',
    expectedAnswer: '46',
    explanation: 'Người bình thường có bộ NST 2n = 46 chiếc (gồm 22 cặp NST thường và 1 cặp NST giới tính).',
  },

  // Lịch sử
  {
    id: 'bq-su-1',
    subjectSlug: 'lich-su',
    subjectName: 'Lịch sử',
    prompt: 'Chiến dịch Điện Biên Phủ toàn thắng vào năm nào? (Nhập năm gồm 4 chữ số)',
    hint: 'Năm ký kết Hiệp định Giơ-ne-vơ về Đông Dương',
    expectedAnswer: '1954',
    explanation: 'Chiều ngày 7/5/1954, lá cờ Quyết chiến - Quyết thắng tung bay trên nóc hầm Đờ Cát.',
  },
  {
    id: 'bq-su-2',
    subjectSlug: 'lich-su',
    subjectName: 'Lịch sử',
    prompt: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh nước VNDCCH vào ngày tháng nào năm 1945? (Nhập dạng ngày/tháng, ví dụ: 2/9)',
    hint: 'Ngày Quốc khánh Việt Nam',
    expectedAnswer: '2/9',
    explanation: 'Ngày 2/9/1945 tại Quảng trường Ba Đình lịch sử, Bác Hồ đọc bản Tuyên ngôn Độc lập.',
  },

  // Địa lý
  {
    id: 'bq-dia-1',
    subjectSlug: 'dia-ly',
    subjectName: 'Địa lý',
    prompt: 'Việt Nam nằm ở bán đảo nào của khu vực Đông Nam Á? (Nhập tên bán đảo)',
    hint: 'Gồm ba nước Việt Nam, Lào, Campuchia',
    expectedAnswer: 'Đông Dương',
    explanation: 'Việt Nam nằm ở rìa phía đông của bán đảo Đông Dương (Indochina).',
  },

  // Kinh tế & Pháp luật
  {
    id: 'bq-ktpl-1',
    subjectSlug: 'kinh-te-phap-luat',
    subjectName: 'Kinh tế & Pháp luật',
    prompt: 'Công dân Việt Nam từ đủ bao nhiêu tuổi thì có quyền bầu cử Quốc hội và HĐND các cấp? (Nhập số tuổi)',
    hint: 'Theo điều 27 Hiến pháp 2013',
    expectedAnswer: '18',
    explanation: 'Công dân từ đủ mười tám tuổi trở lên có quyền bầu cử và từ đủ hai mươi mốt tuổi trở lên có quyền ứng cử.',
  },

  // Tin học
  {
    id: 'bq-tin-1',
    subjectSlug: 'tin-hoc',
    subjectName: 'Tin học',
    prompt: '1 Megabyte (MB) quy đổi chuẩn sang Kilobyte (KB) theo hệ nhị phân bằng bao nhiêu? (Nhập số nguyên)',
    hint: '2 lũy thừa 10',
    expectedAnswer: '1024',
    explanation: 'Theo chuẩn nhị phân (Binary): 1 MB = 1024 KB = 2^10 KB.',
  },

  // Logic & Triết học
  {
    id: 'bq-logic-1',
    subjectSlug: 'triet-hoc-logic',
    subjectName: 'Logic & Triết học',
    prompt: 'Nhà triết học Hy Lạp cổ đại nào là cha đẻ sáng lập ra Logic học hình thức và Tam đoạn luận?',
    hint: 'Học trò của Plato, thầy của Alexander Đại đế',
    expectedAnswer: 'Aristotle',
    explanation: 'Aristotle là người đầu tiên hệ thống hóa các quy luật tư duy và tam đoạn luận trong bộ sách Organon.',
  },
];

// --- 4. True/False Questions (for Lightning True/False Mode) ---
export interface TrueFalseQuestion {
  id: string;
  subjectSlug: string;
  subjectName: string;
  prompt: string;
  isTrue: boolean;
  explanation: string;
}

export const TRUE_FALSE_QUESTIONS_BANK: TrueFalseQuestion[] = [
  // Toán học
  {
    id: 'tf-toan-1',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Số 1 là số nguyên tố nhỏ nhất.',
    isTrue: false,
    explanation: 'Sai! Số 1 không phải là số nguyên tố vì số nguyên tố phải có đúng 2 ước phân biệt là 1 và chính nó. Số nguyên tố nhỏ nhất là 2.',
  },
  {
    id: 'tf-toan-2',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Một tam giác có ba cạnh tỉ lệ 3 : 4 : 5 luôn luôn là một tam giác vuông.',
    isTrue: true,
    explanation: 'Đúng! Theo định lý Pytago đảo: 3² + 4² = 9 + 16 = 25 = 5².',
  },
  {
    id: 'tf-toan-3',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Số 0 là số nguyên chẵn.',
    isTrue: true,
    explanation: 'Đúng! Số 0 chia hết cho 2 (0 = 2 × 0) và nằm giữa hai số lẻ (-1 và 1) nên 0 là số chẵn.',
  },

  // Ngữ văn
  {
    id: 'tf-van-1',
    subjectSlug: 'ngu-van',
    subjectName: 'Ngữ văn',
    prompt: '"Truyện Kiều" của đại thi hào Nguyễn Du được sáng tác hoàn toàn bằng chữ Nôm.',
    isTrue: true,
    explanation: 'Đúng! Truyện Kiều (Đoạn trường tân thanh) gồm 3.254 câu thơ lục bát viết bằng chữ Nôm.',
  },
  {
    id: 'tf-van-2',
    subjectSlug: 'ngu-van',
    subjectName: 'Ngữ văn',
    prompt: 'Tác giả của bài thơ "Viếng lăng Bác" là nhà thơ Tố Hữu.',
    isTrue: false,
    explanation: 'Sai! "Viếng lăng Bác" là thi phẩm nổi tiếng của nhà thơ Viễn Phương.',
  },

  // Tiếng Anh
  {
    id: 'tf-anh-1',
    subjectSlug: 'tieng-anh',
    subjectName: 'Tiếng Anh',
    prompt: 'The English word "news" is always treated as an uncountable singular noun.',
    isTrue: true,
    explanation: 'Đúng! "News" luôn là danh từ không đếm được và đi kèm với động từ số ít (ví dụ: The news is shocking).',
  },
  {
    id: 'tf-anh-2',
    subjectSlug: 'tieng-anh',
    subjectName: 'Tiếng Anh',
    prompt: 'The comparative form of "good" is "more good".',
    isTrue: false,
    explanation: 'Sai! Dạng so sánh hơn bất quy tắc của "good" là "better".',
  },

  // Vật lý
  {
    id: 'tf-ly-1',
    subjectSlug: 'vat-ly',
    subjectName: 'Vật lý',
    prompt: 'Âm thanh có thể truyền được qua môi trường chân không ngoài không gian vũ trụ.',
    isTrue: false,
    explanation: 'Sai! Sóng âm là sóng cơ học, cần môi trường vật chất hạt để lan truyền dao động. Trong chân không không có âm thanh.',
  },
  {
    id: 'tf-ly-2',
    subjectSlug: 'vat-ly',
    subjectName: 'Vật lý',
    prompt: 'Khi ánh sáng truyền từ không khí vào nước, tốc độ truyền của ánh sáng bị giảm đi.',
    isTrue: true,
    explanation: 'Đúng! Chiết suất của nước lớn hơn không khí (n ≈ 4/3 > 1), vận tốc v = c/n nên tốc độ ánh sáng trong nước giảm.',
  },

  // Hóa học
  {
    id: 'tf-hoa-1',
    subjectSlug: 'hoa-hoc',
    subjectName: 'Hóa học',
    prompt: 'Thủy ngân (Hg) là kim loại duy nhất ở thể lỏng ở điều kiện nhiệt độ phòng bình thường.',
    isTrue: true,
    explanation: 'Đúng! Thủy ngân nóng chảy ở nhiệt độ -38.83 °C nên ở nhiệt độ phòng (25 °C) nó tồn tại ở thể lỏng.',
  },
  {
    id: 'tf-hoa-2',
    subjectSlug: 'hoa-hoc',
    subjectName: 'Hóa học',
    prompt: 'Nước đá nổi trên mặt nước lỏng vì khối lượng riêng của nước đá lớn hơn nước lỏng.',
    isTrue: false,
    explanation: 'Sai! Nước đá có cấu trúc mạng tinh thể xốp hơn, khối lượng riêng nhỏ hơn nước lỏng nên mới nổi được.',
  },

  // Sinh học
  {
    id: 'tf-sinh-1',
    subjectSlug: 'sinh-hoc',
    subjectName: 'Sinh học',
    prompt: 'Tế bào hồng cầu trưởng thành của con người không có nhân tế bào.',
    isTrue: true,
    explanation: 'Đúng! Để tối ưu hóa không gian chứa huyết sắc tố Hemoglobin vận chuyển oxy, hồng cầu người đã tiêu biến nhân.',
  },

  // Lịch sử
  {
    id: 'tf-su-1',
    subjectSlug: 'lich-su',
    subjectName: 'Lịch sử',
    prompt: 'Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng năm 938 bằng chiến thuật cắm cọc ngầm.',
    isTrue: true,
    explanation: 'Đúng! Chiến thắng Bạch Đằng năm 938 chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập tự chủ lâu dài.',
  },

  // Địa lý
  {
    id: 'tf-dia-1',
    subjectSlug: 'dia-ly',
    subjectName: 'Địa lý',
    prompt: 'Đường xích đạo chia Trái Đất thành hai nửa: Bán cầu Đông và Bán cầu Tây.',
    isTrue: false,
    explanation: 'Sai! Đường xích đạo chia Trái Đất thành Bán cầu Bắc và Bán cầu Nam. Kinh tuyến gốc 0° mới chia Bán cầu Đông và Tây.',
  },

  // Kinh tế & Pháp luật
  {
    id: 'tf-ktpl-1',
    subjectSlug: 'kinh-te-phap-luat',
    subjectName: 'Kinh tế & Pháp luật',
    prompt: 'Mọi công dân đều có nghĩa vụ nộp thuế theo luật định.',
    isTrue: true,
    explanation: 'Đúng! Theo Hiến pháp Việt Nam 2013, nộp thuế là nghĩa vụ cơ bản của mọi công dân và pháp nhân.',
  },

  // Tin học
  {
    id: 'tf-tin-1',
    subjectSlug: 'tin-hoc',
    subjectName: 'Tin học',
    prompt: 'Thuật toán Bubble Sort (Sắp xếp nổi bọt) có độ phức tạp thời gian trung bình là O(n log n).',
    isTrue: false,
    explanation: 'Sai! Bubble Sort có độ phức tạp trung bình và xấu nhất là O(n²).',
  },

  // Logic & Triết học
  {
    id: 'tf-logic-1',
    subjectSlug: 'triet-hoc-logic',
    subjectName: 'Logic & Triết học',
    prompt: 'Trong logic học, một mệnh đề không thể vừa đúng lại vừa sai trong cùng một thời điểm và cùng một mối quan hệ.',
    isTrue: true,
    explanation: 'Đúng! Đây là quy luật phi mâu thuẫn (Law of Non-Contradiction) cốt lõi của logic học cổ điển.',
  },
];

// --- 5. Multiple Select Questions (Multi-Answer Master Mode) ---
export interface MultiSelectQuestion {
  id: string;
  subjectSlug: string;
  subjectName: string;
  prompt: string;
  options: { key: string; text: string }[];
  correctKeys: string[];
  explanation: string;
}

export const MULTI_SELECT_QUESTIONS_BANK: MultiSelectQuestion[] = [
  // Toán học
  {
    id: 'ms-toan-1',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Những số nào sau đây là SỐ NGUYÊN TỐ? (Chọn tất cả các đáp án đúng)',
    options: [
      { key: 'A', text: '2' },
      { key: 'B', text: '9' },
      { key: 'C', text: '17' },
      { key: 'D', text: '21' },
      { key: 'E', text: '29' },
    ],
    correctKeys: ['A', 'C', 'E'],
    explanation: 'Số 2, 17 và 29 chỉ có 2 ước là 1 và chính nó. Còn 9 (chia hết cho 3) và 21 (chia hết cho 3, 7) là hợp số.',
  },
  {
    id: 'ms-toan-2',
    subjectSlug: 'toan-hoc',
    subjectName: 'Toán học',
    prompt: 'Những hình nào sau đây LUÔN CÓ tâm đối xứng?',
    options: [
      { key: 'A', text: 'Hình bình hành' },
      { key: 'B', text: 'Hình tròn' },
      { key: 'C', text: 'Tam giác đều' },
      { key: 'D', text: 'Hình thoi' },
    ],
    correctKeys: ['A', 'B', 'D'],
    explanation: 'Hình bình hành, hình tròn, hình thoi luôn có tâm đối xứng. Tam giác đều chỉ có các trục đối xứng, không có tâm đối xứng.',
  },

  // Ngữ văn
  {
    id: 'ms-van-1',
    subjectSlug: 'ngu-van',
    subjectName: 'Ngữ văn',
    prompt: 'Những tác phẩm nào sau đây được sáng tác bởi đại thi hào NGUYỄN DU?',
    options: [
      { key: 'A', text: 'Đoạn trường tân thanh (Truyện Kiều)' },
      { key: 'B', text: 'Văn tế thập loại chúng sinh' },
      { key: 'C', text: 'Bình Ngô đại cáo' },
      { key: 'D', text: 'Bắc hành tạp lục' },
    ],
    correctKeys: ['A', 'B', 'D'],
    explanation: 'Truyện Kiều, Văn tế thập loại chúng sinh và Bắc hành tạp lục đều là kiệt tác của Nguyễn Du. "Bình Ngô đại cáo" do Nguyễn Trãi viết.',
  },

  // Tiếng Anh
  {
    id: 'ms-anh-1',
    subjectSlug: 'tieng-anh',
    subjectName: 'Tiếng Anh',
    prompt: 'Which of the following are IRREGULAR past tense verbs (bất quy tắc)?',
    options: [
      { key: 'A', text: 'Spoke (from Speak)' },
      { key: 'B', text: 'Played (from Play)' },
      { key: 'C', text: 'Written (from Write)' },
      { key: 'D', text: 'Caught (from Catch)' },
    ],
    correctKeys: ['A', 'C', 'D'],
    explanation: 'Spoke, Written, Caught là dạng động từ bất quy tắc. Played là động từ có quy tắc thêm -ed.',
  },

  // Vật lý
  {
    id: 'ms-ly-1',
    subjectSlug: 'vat-ly',
    subjectName: 'Vật lý',
    prompt: 'Những loại sóng nào sau đây thuộc thang SÓNG ĐIỆN TỪ?',
    options: [
      { key: 'A', text: 'Sóng vô tuyến (Radio)' },
      { key: 'B', text: 'Sóng siêu âm' },
      { key: 'C', text: 'Tia hồng ngoại' },
      { key: 'D', text: 'Tia Rơn-ghen (Tia X)' },
    ],
    correctKeys: ['A', 'C', 'D'],
    explanation: 'Sóng radio, hồng ngoại và tia X đều là sóng điện từ. Sóng siêu âm là sóng cơ học (không phải sóng điện từ).',
  },

  // Hóa học
  {
    id: 'ms-hoa-1',
    subjectSlug: 'hoa-hoc',
    subjectName: 'Hóa học',
    prompt: 'Những kim loại nào sau đây TÁC DỤNG VỚI NƯỚC ở nhiệt độ thường tạo dung dịch kiềm và giải phóng H2?',
    options: [
      { key: 'A', text: 'Natri (Na)' },
      { key: 'B', text: 'Đồng (Cu)' },
      { key: 'C', text: 'Kali (K)' },
      { key: 'D', text: 'Bari (Ba)' },
    ],
    correctKeys: ['A', 'C', 'D'],
    explanation: 'Na, K, Ba là các kim loại kiềm và kiềm thổ phản ứng mãnh liệt với nước ở nhiệt độ thường. Cu không tác dụng với nước.',
  },

  // Lịch sử
  {
    id: 'ms-su-1',
    subjectSlug: 'lich-su',
    subjectName: 'Lịch sử',
    prompt: 'Những chiến dịch quân sự trọng đại nào sau đây diễn ra trong cuộc Kháng chiến chống Mỹ cứu nước?',
    options: [
      { key: 'A', text: 'Chiến dịch Điện Biên Phủ trên không 1972' },
      { key: 'B', text: 'Chiến dịch Việt Bắc thu đông 1947' },
      { key: 'C', text: 'Chiến dịch Hồ Chí Minh 1975' },
      { key: 'D', text: 'Chiến dịch Tây Nguyên 1975' },
    ],
    correctKeys: ['A', 'C', 'D'],
    explanation: 'Việt Bắc 1947 diễn ra trong Kháng chiến chống Pháp (1945-1954). Các chiến dịch còn lại diễn ra trong Kháng chiến chống Mỹ.',
  },

  // Tin học
  {
    id: 'ms-tin-1',
    subjectSlug: 'tin-hoc',
    subjectName: 'Tin học & Thuật toán',
    prompt: 'Những thuật toán sắp xếp nào sau đây có độ phức tạp trung bình là O(n log n)?',
    options: [
      { key: 'A', text: 'Merge Sort (Sắp xếp trộn)' },
      { key: 'B', text: 'Bubble Sort (Sắp xếp nổi bọt)' },
      { key: 'C', text: 'Quick Sort (Sắp xếp nhanh)' },
      { key: 'D', text: 'Heap Sort (Sắp xếp vun đống)' },
    ],
    correctKeys: ['A', 'C', 'D'],
    explanation: 'Merge Sort, Quick Sort và Heap Sort đều đạt độ phức tạp O(n log n). Bubble Sort là O(n²).',
  },
];

// --- 6. 12 Zodiac Animals Questions Data ---
export interface ZodiacAnimal {
  id: string;
  name: string;
  vietnameseName: string;
  iconSymbol: string;
  element: string;
  title: string;
}

export const ZODIAC_ANIMALS: ZodiacAnimal[] = [
  { id: 'ty', name: 'Chuột', vietnameseName: 'Tý', iconSymbol: '🐀', element: 'Thủy', title: 'Thông Thái & Nhanh Nhẹn' },
  { id: 'suu', name: 'Trâu', vietnameseName: 'Sửu', iconSymbol: '🐂', element: 'Thổ', title: 'Kiên Cường & Bền Bỉ' },
  { id: 'dan', name: 'Hổ', vietnameseName: 'Dần', iconSymbol: '🐅', element: 'Mộc', title: 'Uy Dũng & Đột Phá' },
  { id: 'mao', name: 'Mèo', vietnameseName: 'Mão', iconSymbol: '🐈', element: 'Mộc', title: 'Khéo Léo & Nhạy Bén' },
  { id: 'thin', name: 'Rồng', vietnameseName: 'Thìn', iconSymbol: '🐉', element: 'Thổ', title: 'Quyền Năng & Tối Thượng' },
  { id: 'ty_2', name: 'Rắn', vietnameseName: 'Tỵ', iconSymbol: '🐍', element: 'Hỏa', title: 'Bí Ẩn & Sâu Sắc' },
  { id: 'ngo', name: 'Ngựa', vietnameseName: 'Ngọ', iconSymbol: '🐎', element: 'Hỏa', title: 'Tốc Độ & Bứt Phá' },
  { id: 'mui', name: 'Dê', vietnameseName: 'Mùi', iconSymbol: '🐐', element: 'Thổ', title: 'Điềm Đạm & Sáng Tạo' },
  { id: 'than', name: 'Khỉ', vietnameseName: 'Thân', iconSymbol: '🐒', element: 'Kim', title: 'Linh Hoạt & Đỉnh Cao' },
  { id: 'dau', name: 'Gà', vietnameseName: 'Dậu', iconSymbol: '🐓', element: 'Kim', title: 'Kỷ Luật & Đúng Giờ' },
  { id: 'tuat', name: 'Chó', vietnameseName: 'Tuất', iconSymbol: '🐕', element: 'Thổ', title: 'Trung Thực & Chính Trực' },
  { id: 'hoi', name: 'Lợn', vietnameseName: 'Hợi', iconSymbol: '🐖', element: 'Thủy', title: 'Sung Túc & Viên Mãn' },
];

// --- Filtering Helpers ---

/**
 * Filter matching pairs strictly by selected subject slugs.
 * If subjects list is empty, returns all pairs.
 */
export function getMatchingCardsForSubjects(selectedSlugs: string[], maxPairs = 6) {
  let filtered = MATCHING_PAIRS_BANK;
  if (selectedSlugs.length > 0) {
    filtered = MATCHING_PAIRS_BANK.filter((p) => selectedSlugs.includes(p.subjectSlug));
  }

  // If not enough pairs for chosen subjects, fallback gracefully within available
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  const pickedPairs = shuffled.slice(0, Math.min(maxPairs, shuffled.length));

  // Transform each pair into 2 cards
  const cards: Array<{ id: string; pairId: string; text: string; category: string }> = [];
  pickedPairs.forEach((p) => {
    cards.push({
      id: `${p.id}-left`,
      pairId: p.pairId,
      text: p.leftText,
      category: p.subjectName,
    });
    cards.push({
      id: `${p.id}-right`,
      pairId: p.pairId,
      text: p.rightText,
      category: p.subjectName,
    });
  });

  return cards.sort(() => Math.random() - 0.5);
}

/**
 * Filter multiple choice practice questions strictly by selected subject slugs.
 */
export function getPracticeQuestionsForSubjects(selectedSlugs: string[], count = 10): PracticeQuestion[] {
  let filtered = PRACTICE_QUESTIONS_BANK;
  if (selectedSlugs.length > 0) {
    filtered = PRACTICE_QUESTIONS_BANK.filter((q) => selectedSlugs.includes(q.subjectSlug));
  }
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Filter fill-in-the-blank questions strictly by selected subject slugs.
 */
export function getBlankQuestionsForSubjects(selectedSlugs: string[], count = 5): BlankQuestion[] {
  let filtered = BLANK_QUESTIONS_BANK;
  if (selectedSlugs.length > 0) {
    filtered = BLANK_QUESTIONS_BANK.filter((q) => selectedSlugs.includes(q.subjectSlug));
  }
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Filter True/False questions strictly by selected subject slugs.
 */
export function getTrueFalseQuestionsForSubjects(selectedSlugs: string[], count = 10): TrueFalseQuestion[] {
  let filtered = TRUE_FALSE_QUESTIONS_BANK;
  if (selectedSlugs.length > 0) {
    filtered = TRUE_FALSE_QUESTIONS_BANK.filter((q) => selectedSlugs.includes(q.subjectSlug));
  }
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Filter Multi-select questions strictly by selected subject slugs.
 */
export function getMultiSelectQuestionsForSubjects(selectedSlugs: string[], count = 5): MultiSelectQuestion[] {
  let filtered = MULTI_SELECT_QUESTIONS_BANK;
  if (selectedSlugs.length > 0) {
    filtered = MULTI_SELECT_QUESTIONS_BANK.filter((q) => selectedSlugs.includes(q.subjectSlug));
  }
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
