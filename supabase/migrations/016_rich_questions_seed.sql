-- 016_rich_questions_seed.sql
-- Comprehensive expansion of question bank across all 11 subjects
-- Real academic questions with options, explanations, server-side secret answers, and exams

-- 1. Ensure topics for Computer Science (Tin học) & Logic
INSERT INTO public.topics (id, subject_id, slug, name, description, sort_order, status)
VALUES
  (
    '00000000-0000-0000-0001-000000000015',
    '00000000-0000-0000-0000-000000000010',
    'thuat-toan-va-lap-trinh',
    'Thuật toán & Tư duy Máy tính',
    'Độ phức tạp thuật toán, cấu trúc dữ liệu cơ bản, giải thuật sắp xếp và đệ quy.',
    1,
    'published'
  ),
  (
    '00000000-0000-0000-0001-000000000016',
    '00000000-0000-0000-0000-000000000011',
    'tu-duy-logic-phan-bien',
    'Tư duy Logic & Suy luận',
    'Mệnh đề logic, tam đoạn luận, bài toán chân trị và suy luận phản biện.',
    1,
    'published'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 2. Insert Additional High-Quality Questions (Q14 to Q40)
INSERT INTO public.questions (id, topic_id, type, difficulty, prompt, explanation, points, time_limit_seconds, status)
VALUES
  -- Q14: Toán học - Tích phân cơ bản (Single choice)
  (
    '00000000-0000-0000-0002-000000000014',
    '00000000-0000-0000-0001-000000000001',
    'single_choice',
    'easy',
    'Giá trị của tích phân I = ∫[0 đến 1] (3x² + 2x) dx bằng bao nhiêu?',
    'Nguyên hàm của 3x² + 2x là x³ + x². Thay cận [0, 1] ta được: (1³ + 1²) - (0 + 0) = 2.',
    10,
    30,
    'published'
  ),

  -- Q15: Toán học - Hình học không gian (Single choice)
  (
    '00000000-0000-0000-0002-000000000015',
    '00000000-0000-0000-0001-000000000002',
    'single_choice',
    'medium',
    'Thể tích khối chóp có diện tích đáy B = 12 cm² và chiều cao h = 5 cm là:',
    'Công thức thể tích chóp: V = (1/3) * B * h = (1/3) * 12 * 5 = 20 cm³.',
    10,
    30,
    'published'
  ),

  -- Q16: Toán học - Căn bậc hai (Fill blank)
  (
    '00000000-0000-0000-0002-000000000016',
    '00000000-0000-0000-0001-000000000001',
    'fill_blank',
    'easy',
    'Nghiệm dương của phương trình x² - 144 = 0 là số nào?',
    'x² = 144 => x = 12 hoặc x = -12. Nghiệm dương là 12.',
    10,
    20,
    'published'
  ),

  -- Q17: Ngữ văn - Thơ ca hiện đại (Single choice)
  (
    '00000000-0000-0000-0002-000000000017',
    '00000000-0000-0000-0001-000000000003',
    'single_choice',
    'easy',
    'Tác giả của bài thơ "Sóng" mang âm hưởng trữ tình sâu lắng là nhà thơ nào?',
    'Bài thơ "Sóng" do nữ thi sĩ Xuân Quỳnh sáng tác năm 1967 tại bãi biển Diêm Điền (Thái Bình).',
    10,
    20,
    'published'
  ),

  -- Q18: Ngữ văn - Biện pháp tu từ (Single choice)
  (
    '00000000-0000-0000-0002-000000000018',
    '00000000-0000-0000-0001-000000000004',
    'single_choice',
    'medium',
    'Câu thơ "Áo chàm đưa buổi phân ly / Cầm tay nhau biết nói gì hôm nay" (Tố Hữu) sử dụng biện pháp tu từ nào?',
    '"Áo chàm" là hình ảnh hoán dụ lấy dấu hiệu trang phục truyền thống của đồng bào Việt Bắc để chỉ người dân Việt Bắc.',
    10,
    30,
    'published'
  ),

  -- Q19: Tiếng Anh - Câu điều kiện (Single choice)
  (
    '00000000-0000-0000-0002-000000000019',
    '00000000-0000-0000-0001-000000000005',
    'single_choice',
    'medium',
    'Choose the correct option: "If I _______ your contact number, I would have invited you to the seminar yesterday."',
    'Câu điều kiện loại 3 diễn tả sự việc trái với quá khứ: If + S + had + V3/ed, S + would have + V3/ed.',
    10,
    30,
    'published'
  ),

  -- Q20: Tiếng Anh - Ghép cặp từ đồng nghĩa (Matching)
  (
    '00000000-0000-0000-0002-000000000020',
    '00000000-0000-0000-0001-000000000006',
    'matching',
    'medium',
    'Hãy ghép nối mỗi tính từ học thuật (Cột trái) với từ đồng nghĩa chuẩn xác (Cột phải):',
    'Essential tương ứng Crucial; Innovative tương ứng Pioneering; Abundant tương ứng Plentiful.',
    20,
    45,
    'published'
  ),

  -- Q21: Vật lý - Dao động con lắc (Single choice)
  (
    '00000000-0000-0000-0002-000000000021',
    '00000000-0000-0000-0001-000000000007',
    'single_choice',
    'easy',
    'Chu kỳ dao động điều hòa của con lắc lò xo có độ cứng k và khối lượng m được tính theo công thức nào?',
    'Công thức chu kỳ con lắc lò xo: T = 2π√(m/k).',
    10,
    25,
    'published'
  ),

  -- Q22: Vật lý - Vận tốc ánh sáng (Fill blank)
  (
    '00000000-0000-0000-0002-000000000022',
    '00000000-0000-0000-0001-000000000007',
    'fill_blank',
    'easy',
    'Vận tốc truyền sóng ánh sáng trong môi trường chân không xấp xỉ bao nhiêu nghìn kilômét trên giây (chỉ điền số)?',
    'Vận tốc ánh sáng trong chân không là c ≈ 300.000 km/s (300 nghìn km/s).',
    10,
    20,
    'published'
  ),

  -- Q23: Vật lý - Sóng dừng (True/False)
  (
    '00000000-0000-0000-0002-000000000023',
    '00000000-0000-0000-0001-000000000007',
    'true_false',
    'easy',
    'Trong hiện tượng sóng dừng trên sợi dây đàn hồi, khoảng cách giữa hai nút sóng liên tiếp bằng một nửa bước sóng (λ/2). Đúng hay Sai?',
    'Trong sóng dừng, khoảng cách giữa 2 nút sóng liên tiếp hoặc 2 bụng sóng liên tiếp luôn bằng λ/2.',
    10,
    20,
    'published'
  ),

  -- Q24: Hóa học - Kim loại kiềm (Single choice)
  (
    '00000000-0000-0000-0002-000000000024',
    '00000000-0000-0000-0001-000000000009',
    'single_choice',
    'easy',
    'Kim loại nào sau đây thuộc nhóm kim loại kiềm (nhóm IA trong bảng tuần hoàn)?',
    'Natri (Na) là kim loại kiềm thuộc nhóm IA. Canxi thuộc nhóm IIA, Nhôm nhóm IIIA, Sắt là kim loại chuyển tiếp.',
    10,
    20,
    'published'
  ),

  -- Q25: Hóa học - Hợp chất hữu cơ Este (Single choice)
  (
    '00000000-0000-0000-0002-000000000025',
    '00000000-0000-0000-0001-000000000010',
    'single_choice',
    'easy',
    'Este etyl fomat có công thức phân tử thu gọn là gì?',
    'Etyl fomat tạo từ axit fomic (HCOOH) và rượu etylic (C2H5OH), công thức là HCOOC2H5.',
    10,
    25,
    'published'
  ),

  -- Q26: Sinh học - Axit Nucleic (Single choice)
  (
    '00000000-0000-0000-0002-000000000026',
    '00000000-0000-0000-0001-000000000011',
    'single_choice',
    'easy',
    'Loại bazơ nitơ nào sau đây chỉ có trong phân tử ARN mà KHÔNG có trong ADN?',
    'Uraxin (U) chỉ có trong ARN, thay thế cho Timin (T) trong cấu trúc ADN.',
    10,
    20,
    'published'
  ),

  -- Q27: Sinh học - Đột biến gen (True/False)
  (
    '00000000-0000-0000-0002-000000000027',
    '00000000-0000-0000-0001-000000000011',
    'true_false',
    'easy',
    'Tất cả các đột biến gen xảy ra đều gây hại cho sinh vật và bị chọn lọc tự nhiên đào thải ngay lập tức. Đúng hay Sai?',
    'Đột biến gen có thể có hại, trung tính hoặc có lợi tuỳ thuộc vào tổ hợp gen và điều kiện môi trường sống.',
    10,
    20,
    'published'
  ),

  -- Q28: Lịch sử - Chiến thắng Bạch Đằng (Fill blank)
  (
    '00000000-0000-0000-0002-000000000028',
    '00000000-0000-0000-0001-000000000012',
    'fill_blank',
    'easy',
    'Trận đại thắng Bạch Đằng do Ngô Quyền lãnh đạo đánh tan quân Nam Hán diễn ra vào năm nào?',
    'Năm 938, Ngô Quyền lãnh đạo nhân dân đánh tan quân Nam Hán trên sông Bạch Đằng, chấm dứt hơn 1000 năm Bắc thuộc.',
    10,
    20,
    'published'
  ),

  -- Q29: Lịch sử - Chiến dịch Điện Biên Phủ (Single choice)
  (
    '00000000-0000-0000-0002-000000000029',
    '00000000-0000-0000-0001-000000000012',
    'single_choice',
    'easy',
    'Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào ngày tháng năm nào?',
    'Chiều ngày 07/05/1954, tướng Đờ Cát-xtơ-ri bị bắt sống, cờ "Quyết chiến Quyết thắng" tung bay trên nóc hầm chỉ huy.',
    10,
    25,
    'published'
  ),

  -- Q30: Địa lý - Đỉnh núi cao nhất Việt Nam (Single choice)
  (
    '00000000-0000-0000-0002-000000000030',
    '00000000-0000-0000-0001-000000000013',
    'single_choice',
    'easy',
    'Đỉnh núi Fansipan (Phan-xi-păng) nằm trên dãy núi nào của nước ta?',
    'Fansipan cao 3.143m thuộc dãy núi Hoàng Liên Sơn, được mệnh danh là nóc nhà Đông Dương.',
    10,
    20,
    'published'
  ),

  -- Q31: Địa lý - Khí hậu Việt Nam (Single choice)
  (
    '00000000-0000-0000-0002-000000000031',
    '00000000-0000-0000-0001-000000000013',
    'single_choice',
    'easy',
    'Gió mùa mùa hạ hoạt động ở Việt Nam chủ yếu thổi theo hướng nào?',
    'Gió mùa mùa hạ chủ yếu thổi theo hướng Tây Nam mang lại lượng mưa lớn cho cả nước.',
    10,
    20,
    'published'
  ),

  -- Q32: Tin học - Độ phức tạp thuật toán (Single choice)
  (
    '00000000-0000-0000-0002-000000000032',
    '00000000-0000-0000-0001-000000000015',
    'single_choice',
    'medium',
    'Thuật toán Tìm kiếm nhị phân (Binary Search) trên mảng đã sắp xếp gồm n phần tử có độ phức tạp thời gian trường hợp xấu nhất là:',
    'Tìm kiếm nhị phân chia đôi không gian tìm kiếm sau mỗi bước nên có độ phức tạp thời gian là O(log n).',
    10,
    30,
    'published'
  ),

  -- Q33: Tin học - Cấu trúc dữ liệu Stack (Single choice)
  (
    '00000000-0000-0000-0002-000000000033',
    '00000000-0000-0000-0001-000000000015',
    'single_choice',
    'easy',
    'Ngăn xếp (Stack) hoạt động theo nguyên lý nào sau đây?',
    'Stack tuân theo cơ chế LIFO (Last In First Out) — vào sau ra trước.',
    10,
    20,
    'published'
  ),

  -- Q34: Tin học - Python string (Fill blank)
  (
    '00000000-0000-0000-0002-000000000034',
    '00000000-0000-0000-0001-000000000015',
    'fill_blank',
    'easy',
    'Trong Python, hàm nào dùng để xác định độ dài (số lượng phần tử) của một danh sách hoặc chuỗi ký tự?',
    'Hàm len() trả về số lượng phần tử của đối tượng có độ dài (list, str, tuple, dict).',
    10,
    20,
    'published'
  ),

  -- Q35: Logic - Tam đoạn luận (Single choice)
  (
    '00000000-0000-0000-0002-000000000035',
    '00000000-0000-0000-0001-000000000016',
    'single_choice',
    'medium',
    'Cho hai tiền đề: (1) Mọi kim loại đều dẫn điện. (2) Đồng là một kim loại. Kết luận logic tất yếu rút ra là gì?',
    'Theo quy tắc tam đoạn luận khẳng định: Mọi M là P, S là M => S là P. Vậy Đồng dẫn điện.',
    10,
    25,
    'published'
  ),

  -- Q36: Logic - Mệnh đề hội / tuyển (True/False)
  (
    '00000000-0000-0000-0002-000000000036',
    '00000000-0000-0000-0001-000000000016',
    'true_false',
    'easy',
    'Mệnh đề logic "A VÀ B" (A ∧ B) chỉ nhận giá trị ĐÚNG khi và chỉ khi CẢ HAI mệnh đề A và B đều ĐÚNG. Đúng hay Sai?',
    'Phép hội (AND) chỉ đúng khi tất cả các mệnh đề thành phần đều đúng.',
    10,
    20,
    'published'
  ),

  -- Q37: Logic - Ghép cặp bài toán suy luận (Matching)
  (
    '00000000-0000-0000-0002-000000000037',
    '00000000-0000-0000-0001-000000000016',
    'matching',
    'hard',
    'Ghép cặp khái niệm logic học (Cột trái) với định nghĩa tương ứng (Cột phải):',
    'Nghịch lý: Mệnh đề tự mâu thuẫn; Tiên đề: Chân lý hiển nhiên không cần chứng minh; Định lý: Mệnh đề được chứng minh logic từ tiên đề.',
    20,
    45,
    'published'
  ),

  -- Q38: Kinh tế - Quy luật cung cầu (Single choice)
  (
    '00000000-0000-0000-0002-000000000038',
    '00000000-0000-0000-0001-000000000014',
    'single_choice',
    'easy',
    'Trong nền kinh tế thị trường, khi lượng cung hàng hóa vượt quá lượng cầu (Cung > Cầu), giá cả hàng hóa có xu hướng:',
    'Khi Cung > Cầu (thừa hàng), người bán cạnh tranh giảm giá khiến giá cả hàng hóa có xu hướng giảm xuống.',
    10,
    20,
    'published'
  ),

  -- Q39: Pháp luật - Quyền công dân (Multiple choice)
  (
    '00000000-0000-0000-0002-000000000039',
    '00000000-0000-0000-0001-000000000014',
    'multiple_choice',
    'medium',
    'Những quyền nào sau đây là quyền cơ bản của công dân được Hiến pháp nước CHXHCN Việt Nam bảo hộ? (Chọn tất cả đáp án đúng)',
    'Các quyền: Học tập, Bầu cử & Ứng cử, Tự do tín ngưỡng đều là quyền hiến định cơ bản của công dân.',
    15,
    30,
    'published'
  ),

  -- Q40: Tổng hợp - Hằng số Pi (Fill blank)
  (
    '00000000-0000-0000-0002-000000000040',
    '00000000-0000-0000-0001-000000000001',
    'fill_blank',
    'easy',
    'Hai chữ số sau dấu phẩy của số Pi (π ≈ 3,...) là gì?',
    'Số Pi xấp xỉ 3.14159..., hai chữ số sau dấu phẩy là 14.',
    10,
    15,
    'published'
  )
ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  explanation = EXCLUDED.explanation,
  points = EXCLUDED.points,
  time_limit_seconds = EXCLUDED.time_limit_seconds;

-- 3. Options for New Questions
INSERT INTO public.question_options (question_id, option_key, content, sort_order)
VALUES
  -- Q14: Tích phân
  ('00000000-0000-0000-0002-000000000014', 'A', '1', 1),
  ('00000000-0000-0000-0002-000000000014', 'B', '2', 2),
  ('00000000-0000-0000-0002-000000000014', 'C', '3', 3),
  ('00000000-0000-0000-0002-000000000014', 'D', '5', 4),

  -- Q15: Thể tích chóp
  ('00000000-0000-0000-0002-000000000015', 'A', '20 cm³', 1),
  ('00000000-0000-0000-0002-000000000015', 'B', '60 cm³', 2),
  ('00000000-0000-0000-0002-000000000015', 'C', '30 cm³', 3),
  ('00000000-0000-0000-0002-000000000015', 'D', '15 cm³', 4),

  -- Q17: Nhà thơ Sóng
  ('00000000-0000-0000-0002-000000000017', 'A', 'Xuân Quỳnh', 1),
  ('00000000-0000-0000-0002-000000000017', 'B', 'Đoàn Thị Điểm', 2),
  ('00000000-0000-0000-0002-000000000017', 'C', 'Hồ Xuân Hương', 3),
  ('00000000-0000-0000-0002-000000000017', 'D', 'Lâm Thị Mỹ Dạ', 4),

  -- Q18: Biện pháp tu từ
  ('00000000-0000-0000-0002-000000000018', 'A', 'Ẩn dụ', 1),
  ('00000000-0000-0000-0002-000000000018', 'B', 'Hoán dụ', 2),
  ('00000000-0000-0000-0002-000000000018', 'C', 'Nhân hóa', 3),
  ('00000000-0000-0000-0002-000000000018', 'D', 'Nói quá', 4),

  -- Q19: English Conditionals
  ('00000000-0000-0000-0002-000000000019', 'A', 'had known', 1),
  ('00000000-0000-0000-0002-000000000019', 'B', 'knew', 2),
  ('00000000-0000-0000-0002-000000000019', 'C', 'have known', 3),
  ('00000000-0000-0000-0002-000000000019', 'D', 'know', 4),

  -- Q20: English Matching
  ('00000000-0000-0000-0002-000000000020', 'L1', 'Essential', 1),
  ('00000000-0000-0000-0002-000000000020', 'L2', 'Innovative', 2),
  ('00000000-0000-0000-0002-000000000020', 'L3', 'Abundant', 3),
  ('00000000-0000-0000-0002-000000000020', 'R1', 'Crucial', 4),
  ('00000000-0000-0000-0002-000000000020', 'R2', 'Pioneering', 5),
  ('00000000-0000-0000-0002-000000000020', 'R3', 'Plentiful', 6),

  -- Q21: Chu kỳ con lắc
  ('00000000-0000-0000-0002-000000000021', 'A', 'T = 2π√(m/k)', 1),
  ('00000000-0000-0000-0002-000000000021', 'B', 'T = 2π√(k/m)', 2),
  ('00000000-0000-0000-0002-000000000021', 'C', 'T = (1/2π)√(m/k)', 3),
  ('00000000-0000-0000-0002-000000000021', 'D', 'T = 2π√(l/g)', 4),

  -- Q23: True/False Sóng dừng
  ('00000000-0000-0000-0002-000000000023', 'TRUE', 'Đúng', 1),
  ('00000000-0000-0000-0002-000000000023', 'FALSE', 'Sai', 2),

  -- Q24: Kim loại kiềm
  ('00000000-0000-0000-0002-000000000024', 'A', 'Natri (Na)', 1),
  ('00000000-0000-0000-0002-000000000024', 'B', 'Canxi (Ca)', 2),
  ('00000000-0000-0000-0002-000000000024', 'C', 'Nhôm (Al)', 3),
  ('00000000-0000-0000-0002-000000000024', 'D', 'Sắt (Fe)', 4),

  -- Q25: Este
  ('00000000-0000-0000-0002-000000000025', 'A', 'HCOOC2H5', 1),
  ('00000000-0000-0000-0002-000000000025', 'B', 'CH3COOCH3', 2),
  ('00000000-0000-0000-0002-000000000025', 'C', 'CH3COOC2H5', 3),
  ('00000000-0000-0000-0002-000000000025', 'D', 'HCOOCH3', 4),

  -- Q26: Axit nucleic
  ('00000000-0000-0000-0002-000000000026', 'A', 'Uraxin (U)', 1),
  ('00000000-0000-0000-0002-000000000026', 'B', 'Ađênin (A)', 2),
  ('00000000-0000-0000-0002-000000000026', 'C', 'Guanin (G)', 3),
  ('00000000-0000-0000-0002-000000000026', 'D', 'Xitôzin (X)', 4),

  -- Q27: True/False Đột biến gen
  ('00000000-0000-0000-0002-000000000027', 'TRUE', 'Đúng', 1),
  ('00000000-0000-0000-0002-000000000027', 'FALSE', 'Sai', 2),

  -- Q29: Chiến thắng Điện Biên Phủ
  ('00000000-0000-0000-0002-000000000029', 'A', '07/05/1954', 1),
  ('00000000-0000-0000-0002-000000000029', 'B', '19/08/1945', 2),
  ('00000000-0000-0000-0002-000000000029', 'C', '30/04/1975', 3),
  ('00000000-0000-0000-0002-000000000029', 'D', '02/09/1945', 4),

  -- Q30: Đỉnh Fansipan
  ('00000000-0000-0000-0002-000000000030', 'A', 'Hoàng Liên Sơn', 1),
  ('00000000-0000-0000-0002-000000000030', 'B', 'Trường Sơn Bắc', 2),
  ('00000000-0000-0000-0002-000000000030', 'C', 'Trường Sơn Nam', 3),
  ('00000000-0000-0000-0002-000000000030', 'D', 'Đông Triều', 4),

  -- Q31: Gió mùa mùa hạ
  ('00000000-0000-0000-0002-000000000031', 'A', 'Tây Nam', 1),
  ('00000000-0000-0000-0002-000000000031', 'B', 'Đông Bắc', 2),
  ('00000000-0000-0000-0002-000000000031', 'C', 'Tây Bắc', 3),
  ('00000000-0000-0000-0002-000000000031', 'D', 'Đông Nam', 4),

  -- Q32: Binary search
  ('00000000-0000-0000-0002-000000000032', 'A', 'O(log n)', 1),
  ('00000000-0000-0000-0002-000000000032', 'B', 'O(n)', 2),
  ('00000000-0000-0000-0002-000000000032', 'C', 'O(n²)', 3),
  ('00000000-0000-0000-0002-000000000032', 'D', 'O(1)', 4),

  -- Q33: Stack
  ('00000000-0000-0000-0002-000000000033', 'A', 'LIFO (Vào sau ra trước)', 1),
  ('00000000-0000-0000-0002-000000000033', 'B', 'FIFO (Vào trước ra trước)', 2),
  ('00000000-0000-0000-0002-000000000033', 'C', 'Random Access (Ngẫu nhiên)', 3),
  ('00000000-0000-0000-0002-000000000033', 'D', 'Priority Queue (Ưu tiên)', 4),

  -- Q35: Tam đoạn luận
  ('00000000-0000-0000-0002-000000000035', 'A', 'Đồng có tính dẫn điện', 1),
  ('00000000-0000-0000-0002-000000000035', 'B', 'Mọi kim loại đều là đồng', 2),
  ('00000000-0000-0000-0002-000000000035', 'C', 'Đồng không dẫn điện', 3),
  ('00000000-0000-0000-0002-000000000035', 'D', 'Chỉ có đồng mới dẫn điện', 4),

  -- Q36: Logic AND True/False
  ('00000000-0000-0000-0002-000000000036', 'TRUE', 'Đúng', 1),
  ('00000000-0000-0000-0002-000000000036', 'FALSE', 'Sai', 2),

  -- Q37: Logic Matching
  ('00000000-0000-0000-0002-000000000037', 'L1', 'Nghịch lý (Paradox)', 1),
  ('00000000-0000-0000-0002-000000000037', 'L2', 'Tiên đề (Axiom)', 2),
  ('00000000-0000-0000-0002-000000000037', 'L3', 'Định lý (Theorem)', 3),
  ('00000000-0000-0000-0002-000000000037', 'R1', 'Mệnh đề tự mâu thuẫn nhưng có vẻ hợp lý', 4),
  ('00000000-0000-0000-0002-000000000037', 'R2', 'Chân lý mặc định không cần chứng minh', 5),
  ('00000000-0000-0000-0002-000000000037', 'R3', 'Mệnh đề được chứng minh từ các tiền đề', 6),

  -- Q38: Cung cầu
  ('00000000-0000-0000-0002-000000000038', 'A', 'Giảm xuống', 1),
  ('00000000-0000-0000-0002-000000000038', 'B', 'Tăng vọt', 2),
  ('00000000-0000-0000-0002-000000000038', 'C', 'Không đổi', 3),
  ('00000000-0000-0000-0002-000000000038', 'D', 'Bằng 0', 4),

  -- Q39: Quyền công dân Multiple Choice
  ('00000000-0000-0000-0002-000000000039', 'A', 'Quyền học tập và nghiên cứu', 1),
  ('00000000-0000-0000-0002-000000000039', 'B', 'Quyền bầu cử và ứng cử', 2),
  ('00000000-0000-0000-0002-000000000039', 'C', 'Quyền tự do tín ngưỡng, tôn giáo', 3),
  ('00000000-0000-0000-0002-000000000039', 'D', 'Quyền tự ý xâm phạm nơi ở người khác', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET
  content = EXCLUDED.content;

-- 4. Server-side Official Answer Keys
INSERT INTO public.question_answers (question_id, answer_payload)
VALUES
  ('00000000-0000-0000-0002-000000000014', '"B"'::jsonb),
  ('00000000-0000-0000-0002-000000000015', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000016', '"12"'::jsonb),
  ('00000000-0000-0000-0002-000000000017', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000018', '"B"'::jsonb),
  ('00000000-0000-0000-0002-000000000019', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000020', '{"L1": "R1", "L2": "R2", "L3": "R3"}'::jsonb),
  ('00000000-0000-0000-0002-000000000021', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000022', '"300"'::jsonb),
  ('00000000-0000-0000-0002-000000000023', '"TRUE"'::jsonb),
  ('00000000-0000-0000-0002-000000000024', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000025', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000026', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000027', '"FALSE"'::jsonb),
  ('00000000-0000-0000-0002-000000000028', '"938"'::jsonb),
  ('00000000-0000-0000-0002-000000000029', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000030', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000031', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000032', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000033', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000034', '"len"'::jsonb),
  ('00000000-0000-0000-0002-000000000035', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000036', '"TRUE"'::jsonb),
  ('00000000-0000-0000-0002-000000000037', '{"L1": "R1", "L2": "R2", "L3": "R3"}'::jsonb),
  ('00000000-0000-0000-0002-000000000038', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000039', '["A", "B", "C"]'::jsonb),
  ('00000000-0000-0000-0002-000000000040', '"14"'::jsonb)
ON CONFLICT (question_id) DO UPDATE SET
  answer_payload = EXCLUDED.answer_payload;

-- 5. Additional Standardized Exams
INSERT INTO public.exams (id, subject_id, title, description, time_limit_seconds, passing_score, total_points, status)
VALUES
  (
    '00000000-0000-0000-0003-000000000005',
    '00000000-0000-0000-0000-000000000004',
    'Đề thi Khoa học Tự nhiên — Vật lý & Hóa học ứng dụng',
    'Khảo sát kiến thức toàn diện: Dao động sóng, kim loại kiềm, este hữu cơ và bài toán vận tốc.',
    1200,
    50,
    100,
    'published'
  ),
  (
    '00000000-0000-0000-0003-000000000006',
    '00000000-0000-0000-0000-000000000010',
    'Đề thi Tin học & Thuật toán — Lập trình tư duy',
    'Độ phức tạp thuật toán, cấu trúc dữ liệu Stack/Queue, mảng nhị phân và cú pháp lập trình.',
    900,
    50,
    100,
    'published'
  ),
  (
    '00000000-0000-0000-0003-000000000007',
    '00000000-0000-0000-0000-000000000011',
    'Đề thi Tư duy Logic & Triết học phản biện',
    'Thử thách khả năng suy luận logic, tam đoạn luận, bài toán chân trị và phân tích nghịch lý.',
    900,
    60,
    100,
    'published'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- 6. Map Questions into Exams
INSERT INTO public.exam_questions (exam_id, question_id, sort_order, points)
VALUES
  -- Exam 5: Khoa học tự nhiên
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0002-000000000021', 1, 15),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0002-000000000022', 2, 15),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0002-000000000024', 3, 15),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0002-000000000025', 4, 15),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0002-000000000026', 5, 20),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0002-000000000027', 6, 20),

  -- Exam 6: Tin học & Thuật toán
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0002-000000000032', 1, 25),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0002-000000000033', 2, 25),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0002-000000000034', 3, 25),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0002-000000000040', 4, 25),

  -- Exam 7: Tư duy Logic & Triết học
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0002-000000000035', 1, 20),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0002-000000000036', 2, 20),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0002-000000000037', 3, 30),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0002-000000000038', 4, 15),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0002-000000000039', 5, 15)
ON CONFLICT (exam_id, question_id) DO NOTHING;
