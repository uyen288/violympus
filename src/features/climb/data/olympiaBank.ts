export interface OlympiaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  points: number;
}

export interface ObstaclePuzzle {
  keyword: string; // The secret keyword
  hint: string;
  totalLetters: number;
  rows: {
    number: number;
    question: string;
    answer: string;
    options: string[];
    correctIndex: number;
  }[];
}

export const OLYMPIA_KHOI_DONG: OlympiaQuestion[] = [
  {
    id: 'kd-1',
    category: 'Lịch sử',
    question: 'Chiến thắng Bạch Đằng năm 938 do vị anh hùng dân tộc nào lãnh đạo?',
    options: ['Ngô Quyền', 'Đinh Bộ Lĩnh', 'Trần Hưng Đạo', 'Lê Hoàn'],
    correctIndex: 0,
    explanation: 'Ngô Quyền lãnh đạo nhân dân đánh tan quân Nam Hán trên sông Bạch Đằng năm 938.',
    points: 10,
  },
  {
    id: 'kd-2',
    category: 'Khoa học',
    question: 'Hành tinh nào trong Hệ Mặt Trời được mệnh danh là "Hành tinh Đỏ"?',
    options: ['Sao Kim', 'Sao Hỏa', 'Sao Mộc', 'Sao Thủy'],
    correctIndex: 1,
    explanation: 'Sao Hỏa có bề mặt chứa nhiều oxit sắt tạo nên màu đỏ đặc trưng.',
    points: 10,
  },
  {
    id: 'kd-3',
    category: 'Toán học',
    question: 'Số nguyên tố chẵn duy nhất là số nào?',
    options: ['0', '2', '4', '6'],
    correctIndex: 1,
    explanation: 'Số 2 là số nguyên tố chẵn duy nhất và cũng là số nguyên tố nhỏ nhất.',
    points: 10,
  },
  {
    id: 'kd-4',
    category: 'Địa lý',
    question: 'Đỉnh núi nào được coi là "Nóc nhà Đông Dương"?',
    options: ['Fansipan', 'Langbiang', 'Bạch Mộc Lương Tử', 'Pu Si Lung'],
    correctIndex: 0,
    explanation: 'Đỉnh Fansipan cao 3.143m tại Lào Cai, Việt Nam.',
    points: 10,
  },
  {
    id: 'kd-5',
    category: 'Văn học',
    question: 'Tác phẩm "Truyện Kiều" của đại thi hào Nguyễn Du gồm bao nhiêu câu thơ lục bát?',
    options: ['3.254 câu', '3.142 câu', '2.846 câu', '3.020 câu'],
    correctIndex: 0,
    explanation: 'Đoạn trường tân thanh (Truyện Kiều) gồm chính xác 3.254 câu thơ lục bát.',
    points: 10,
  },
  {
    id: 'kd-6',
    category: 'Hóa học',
    question: 'Kim loại nào có tính dẫn điện và dẫn nhiệt tốt nhất?',
    options: ['Đồng (Cu)', 'Vàng (Au)', 'Bạc (Ag)', 'Nhôm (Al)'],
    correctIndex: 2,
    explanation: 'Bạc là kim loại dẫn điện và nhiệt tốt nhất trong tất cả các kim loại.',
    points: 10,
  },
  {
    id: 'kd-7',
    category: 'Tiếng Anh',
    question: 'Từ nào sau đây là từ đồng nghĩa với "Enormous"?',
    options: ['Tiny', 'Gigantic', 'Fragile', 'Ancient'],
    correctIndex: 1,
    explanation: 'Enormous và Gigantic đều có nghĩa là khổng lồ, to lớn.',
    points: 10,
  },
  {
    id: 'kd-8',
    category: 'Sinh học',
    question: 'Bào quan nào được ví như "nhà máy năng lượng" của tế bào?',
    options: ['Ribosome', 'Ti thể (Mitochondria)', 'Nhân tế bào', 'Lưới nội chất'],
    correctIndex: 1,
    explanation: 'Ti thể là nơi diễn ra hô hấp tế bào và tổng hợp ATP cung cấp năng lượng.',
    points: 10,
  },
];

export const OLYMPIA_OBSTACLE: ObstaclePuzzle = {
  keyword: 'VIỆT NAM',
  hint: 'Tổ quốc thân yêu hình chữ S nằm bên bờ Biển Đông',
  totalLetters: 7,
  rows: [
    {
      number: 1,
      question: 'Sông nào dài nhất chảy hoàn toàn trên lãnh thổ Việt Nam?',
      answer: 'ĐỒNG NAI',
      options: ['Sông Hồng', 'Sông Đồng Nai', 'Sông Đà', 'Sông Tiền'],
      correctIndex: 1,
    },
    {
      number: 2,
      question: 'Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là thành phố nào?',
      answer: 'HÀ NỘI',
      options: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Huế'],
      correctIndex: 0,
    },
    {
      number: 3,
      question: 'Quốc hoa truyền thống được người dân Việt Nam tôn vinh là hoa gì?',
      answer: 'HOA SEN',
      options: ['Hoa Mai', 'Hoa Đào', 'Hoa Sen', 'Hoa Cúc'],
      correctIndex: 2,
    },
    {
      number: 4,
      question: 'Bản Tuyên ngôn Độc lập khai sinh nước VNDCCH được Bác Hồ đọc vào năm nào?',
      answer: '1945',
      options: ['1930', '1945', '1954', '1975'],
      correctIndex: 1,
    },
  ],
};

export const OLYMPIA_TANG_TOC: OlympiaQuestion[] = [
  {
    id: 'tt-1',
    category: 'Tư duy logic',
    question: 'Tìm số tiếp theo trong dãy số quy luật: 2, 6, 12, 20, 30, ...?',
    options: ['36', '40', '42', '44'],
    correctIndex: 2,
    explanation: 'Quy luật n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, tiếp theo là 6*7 = 42.',
    points: 40,
  },
  {
    id: 'tt-2',
    category: 'Khoa học tổng hợp',
    question: 'Âm thanh truyền nhanh nhất trong môi trường nào sau đây?',
    options: ['Chân không', 'Chất khí (Không khí)', 'Chất lỏng (Nước)', 'Chất rắn (Thép)'],
    correctIndex: 3,
    explanation: 'Âm thanh là sóng cơ học, truyền nhanh nhất trong chất rắn (thép đạt khoảng 5.100 m/s).',
    points: 40,
  },
  {
    id: 'tt-3',
    category: 'Địa lý & Lịch sử',
    question: 'Eo biển hẹp nào kết nối Địa Trung Hải với Đại Tây Dương?',
    options: ['Eo biển Malacca', 'Eo biển Gibraltar', 'Eo biển Bosphorus', 'Eo biển Bering'],
    correctIndex: 1,
    explanation: 'Eo biển Gibraltar nằm giữa Tây Ban Nha và Morocco, kết nối Địa Trung Hải và Đại Tây Dương.',
    points: 40,
  },
  {
    id: 'tt-4',
    category: 'Công nghệ',
    question: 'Ngôn ngữ lập trình nào được sáng lập bởi Guido van Rossum vào năm 1991?',
    options: ['Java', 'C++', 'Python', 'JavaScript'],
    correctIndex: 2,
    explanation: 'Guido van Rossum phát triển ngôn ngữ lập trình Python và ra mắt lần đầu năm 1991.',
    points: 40,
  },
];

export const OLYMPIA_VE_DICH: OlympiaQuestion[] = [
  {
    id: 'vd-1',
    category: 'Khoa học 20đ',
    question: 'Tia nào trong ánh sáng Mặt Trời giúp cơ thể con người tổng hợp Vitamin D?',
    options: ['Tia hồng ngoại', 'Tia tử ngoại (UV-B)', 'Ánh sáng khả kiến', 'Tia X'],
    correctIndex: 1,
    explanation: 'Tia cực tím UV-B kích thích tổng hợp Vitamin D dưới da.',
    points: 20,
  },
  {
    id: 'vd-2',
    category: 'Lịch sử 20đ',
    question: 'Ai là người cắm cờ giải phóng trên nóc Dinh Độc Lập vào trưa ngày 30/4/1975?',
    options: ['Bùi Quang Thận', 'Nguyễn Văn Tập', 'Lê Duẩn', 'Võ Nguyên Giáp'],
    correctIndex: 0,
    explanation: 'Đại đội trưởng Bùi Quang Thận là người cắm lá cờ chiến thắng lên nóc Dinh Độc Lập.',
    points: 20,
  },
  {
    id: 'vd-3',
    category: 'Văn hóa & Xã hội 30đ',
    question: 'Di sản thế giới nào của Việt Nam được UNESCO vinh danh là Di sản Thiên nhiên và Văn hóa kép?',
    options: ['Vịnh Hạ Long', 'Quần thể danh thắng Tràng An', 'Vườn quốc gia Phong Nha - Kẻ Bàng', 'Cố đô Huế'],
    correctIndex: 1,
    explanation: 'Tràng An (Ninh Bình) là di sản hỗn hợp (kép) đầu tiên và duy nhất ở Đông Nam Á.',
    points: 30,
  },
  {
    id: 'vd-4',
    category: 'Thiên văn học 30đ',
    question: 'Ngôi sao sáng nhất trên bầu trời đêm khi nhìn từ Trái Đất (không tính Mặt Trời) là sao nào?',
    options: ['Sao Bắc Cực (Polaris)', 'Sao Thiên Lang (Sirius)', 'Sao Chức Nữ (Vega)', 'Sao Kim'],
    correctIndex: 1,
    explanation: 'Sao Thiên Lang (Sirius) thuộc chòm sao Đại Khuyển có cấp sao biểu kiến sáng nhất (-1.46).',
    points: 30,
  },
];
