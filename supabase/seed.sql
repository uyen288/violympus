-- seed.sql
-- Violympus Idempotent Comprehensive Seed Data
-- Full spectrum of subjects: Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa, Kinh tế & Pháp luật, Tin học, Logic
-- Classic Violympic-inspired question formats: Trắc nghiệm tốc độ, Cặp đôi hoàn hảo (Matching), Điền số/từ (Fill-in), Đúng/Sai

-- 1. Subjects (11 Môn học & Lĩnh vực toàn diện)
INSERT INTO public.subjects (id, slug, name, description, icon_name, sort_order, status)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'toan-hoc', 'Toán học', 'Số học, đại số, hình học không gian, giải tích và bài toán tư duy logic.', 'Brain', 1, 'published'),
  ('00000000-0000-0000-0000-000000000002', 'ngu-van', 'Ngữ văn & Tiếng Việt', 'Văn học dân gian, văn học trung - hiện đại, ngữ pháp tiếng Việt và nghị luận.', 'BookOpen', 2, 'published'),
  ('00000000-0000-0000-0000-000000000003', 'tieng-anh', 'Tiếng Anh', 'Ngữ pháp, từ vựng học thuật, đọc hiểu và thành ngữ tiếng Anh chuẩn quốc tế.', 'Languages', 3, 'published'),
  ('00000000-0000-0000-0000-000000000004', 'vat-ly', 'Vật lý', 'Cơ học, nhiệt học, điện quang, vật lý nguyên tử và định luật vũ trụ.', 'Atom', 4, 'published'),
  ('00000000-0000-0000-0000-000000000005', 'hoa-hoc', 'Hóa học', 'Cấu tạo chất, bảng tuần hoàn, phản ứng vô cơ và hóa học hữu cơ ứng dụng.', 'FlaskConical', 5, 'published'),
  ('00000000-0000-0000-0000-000000000006', 'sinh-hoc', 'Sinh học & Y sinh', 'Di truyền học Men-đen, cấu trúc tế bào, sinh thái học và cơ thể người.', 'Dna', 6, 'published'),
  ('00000000-0000-0000-0000-000000000007', 'lich-su', 'Lịch sử', 'Lịch sử dựng nước & giữ nước Việt Nam, các nền văn minh thế giới và chiến tranh hiện đại.', 'Landmark', 7, 'published'),
  ('00000000-0000-0000-0000-000000000008', 'dia-ly', 'Địa lý', 'Địa lý tự nhiên, khí hậu, các vùng kinh tế trọng điểm và bản đồ thế giới.', 'Globe2', 8, 'published'),
  ('00000000-0000-0000-0000-000000000009', 'kinh-te-phap-luat', 'Kinh tế & Pháp luật', 'Quy luật thị trường, tài chính cá nhân, quyền công dân và hệ thống pháp luật Việt Nam.', 'Scale', 9, 'published'),
  ('00000000-0000-0000-0000-000000000010', 'tin-hoc', 'Tin học & Thuật toán', 'Khoa học máy tính, cấu trúc dữ liệu, giải thuật tìm kiếm và tư duy lập trình.', 'Zap', 10, 'published'),
  ('00000000-0000-0000-0000-000000000011', 'triet-hoc-logic', 'Tư duy Logic & Triết học', 'Tam đoạn luận, quy luật mâu thuẫn, nghịch lý logic và tư duy phản biện.', 'Lightbulb', 11, 'published')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  sort_order = EXCLUDED.sort_order;

-- 2. Topics cho các môn học
INSERT INTO public.topics (id, subject_id, slug, name, description, sort_order, status)
VALUES
  -- Toán học
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'dai-so-giai-tich', 'Đại số & Giải tích', 'Hàm số, đạo hàm, nguyên hàm và phương trình lượng giác.', 1, 'published'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'hinh-hoc-khong-gian', 'Hình học không gian & Oxyz', 'Khối đa diện, mặt cầu, tọa độ không gian.', 2, 'published'),

  -- Ngữ văn
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000002', 'van-hoc-viet-nam', 'Tác phẩm Văn học Việt Nam', 'Truyện Kiều, Nam quốc sơn hà, Tuyên ngôn Độc lập, Vợ nhặt, Sóng.', 1, 'published'),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000002', 'tieng-viet-bien-phap-tu-tu', 'Tiếng Việt & Biện pháp tu từ', 'Ẩn dụ, hoán dụ, điệp từ, thành ngữ và ngữ pháp tiếng Việt.', 2, 'published'),

  -- Tiếng Anh
  ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000003', 'grammar-tenses', 'English Grammar & Tenses', 'Các thì động từ, câu điều kiện, câu bị động, mệnh đề quan hệ.', 1, 'published'),
  ('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000003', 'idioms-vocabulary', 'Idioms & Academic Collocations', 'Thành ngữ thông dụng, collocations học thuật và phrasal verbs.', 2, 'published'),

  -- Vật lý
  ('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000004', 'co-hoc-song', 'Dao động cơ & Sóng cơ học', 'Con lắc lò xo, con lắc đơn, giao thoa sóng và sóng dừng.', 1, 'published'),
  ('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000004', 'dien-xoay-chieu', 'Dòng điện xoay chiều', 'Mạch RLC nối tiếp, công suất tiêu thụ và máy biến áp.', 2, 'published'),

  -- Hóa học
  ('00000000-0000-0000-0001-000000000009', '00000000-0000-0000-0000-000000000005', 'hoa-vo-co-kim-loai', 'Kim loại & Phi kim', 'Dãy điện hóa kim loại, ăn mòn và phản ứng oxi hóa khử.', 1, 'published'),
  ('00000000-0000-0000-0001-000000000010', '00000000-0000-0000-0000-000000000005', 'hoa-huu-co', 'Hóa học hữu cơ', 'Este, lipit, amino axit, protein và polime.', 2, 'published'),

  -- Sinh học
  ('00000000-0000-0000-0001-000000000011', '00000000-0000-0000-0000-000000000006', 'di-truyen-hoc', 'Cơ chế di truyền & Biến dị', 'Nhân đôi ADN, phiên mã, dịch mã và quy luật di truyền Men-đen.', 1, 'published'),

  -- Lịch sử
  ('00000000-0000-0000-0001-000000000012', '00000000-0000-0000-0000-000000000007', 'lich-su-viet-nam', 'Lịch sử Việt Nam thế kỷ XX', 'Cách mạng tháng Tám 1945, Chiến dịch Điện Biên Phủ 1954, Đại thắng mùa Xuân 1975.', 1, 'published'),

  -- Địa lý
  ('00000000-0000-0000-0001-000000000013', '00000000-0000-0000-0000-000000000008', 'dia-ly-viet-nam', 'Địa lý tự nhiên & Dân cư Việt Nam', 'Địa hình đồi núi, khí hậu nhiệt đới gió mùa, sông ngòi và các vùng biển đảo.', 1, 'published'),

  -- Kinh tế & Pháp luật
  ('00000000-0000-0000-0001-000000000014', '00000000-0000-0000-0000-000000000009', 'kinh-te-thi-truong-phap-luat', 'Thị trường & Quyền công dân', 'Cung cầu, lạm phát, quyền và nghĩa vụ công dân theo Hiến pháp.', 1, 'published')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 3. Questions (Đa dạng thể loại: Single choice, Multiple choice, True/False, Điền đáp án Fill-in, Ghép cặp Matching)
INSERT INTO public.questions (id, topic_id, type, difficulty, prompt, explanation, points, time_limit_seconds, status)
VALUES
  -- Q1: Toán học - Single choice
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'single_choice',
    'easy',
    'Đạo hàm của hàm số f(x) = x^3 - 3x^2 + 2 tại điểm x = 1 là bao nhiêu?',
    'Ta có f''(x) = 3x^2 - 6x. Thay x = 1 ta được f''(1) = 3(1)^2 - 6(1) = -3.',
    10,
    30,
    'published'
  ),

  -- Q2: Toán học - Điền số (Violympic classic Fill-in-the-blank)
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0001-000000000001',
    'fill_blank',
    'medium',
    'Giá trị nhỏ nhất của hàm số f(x) = x^2 - 4x + 9 trên tập số thực là bao nhiêu? (Nhập giá trị số nguyên)',
    'Ta có f(x) = (x - 2)^2 + 5 >= 5 với mọi x. Do đó giá trị nhỏ nhất bằng 5 khi x = 2.',
    15,
    30,
    'published'
  ),

  -- Q3: Toán học - Cặp đôi hoàn hảo (Violympic Matching pairs)
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0001-000000000001',
    'matching',
    'medium',
    'Ghép mỗi biểu thức toán học ở cột trái với giá trị tương ứng ở cột phải:',
    'Căn bậc hai của 64 là 8; 2^5 = 32; log2(16) = 4; Tích phân từ 0 đến 1 của 2x dx là 1.',
    20,
    60,
    'published'
  ),

  -- Q4: Ngữ văn - Single choice
  (
    '00000000-0000-0000-0002-000000000004',
    '00000000-0000-0000-0001-000000000003',
    'single_choice',
    'easy',
    'Tác phẩm "Truyện Kiều" của Đại thi hào Nguyễn Du được viết bằng chữ gì và theo thể thơ nào?',
    'Truyện Kiều được viết bằng chữ Nôm theo thể thơ lục bát truyền thống của dân tộc.',
    10,
    20,
    'published'
  ),

  -- Q5: Ngữ văn - Điền từ khuyết (Violympic Fill-blank)
  (
    '00000000-0000-0000-0002-000000000005',
    '00000000-0000-0000-0001-000000000003',
    'fill_blank',
    'easy',
    'Điền từ còn thiếu vào câu thơ trong bài thơ Tây Tiến của Quang Dũng: "Tây Tiến đoàn binh không mọc tóc / Quân xanh màu lá dữ oai..."?',
    'Câu thơ đầy đủ là: "Quân xanh màu lá dữ oai hùm". Từ cần điền là: hùm.',
    10,
    20,
    'published'
  ),

  -- Q6: Tiếng Anh - Single choice
  (
    '00000000-0000-0000-0002-000000000006',
    '00000000-0000-0000-0001-000000000005',
    'single_choice',
    'medium',
    'Choose the correct option: "If I _______ harder when I was at university, I would have passed the exam."',
    'Đây là câu điều kiện hỗn hợp/loại 3 diễn tả giả định trái ngược với quá khứ: Had studied.',
    10,
    25,
    'published'
  ),

  -- Q7: Tiếng Anh - Cặp đôi từ đồng nghĩa (Violympic Synonym Matching)
  (
    '00000000-0000-0000-0002-000000000007',
    '00000000-0000-0000-0001-000000000006',
    'matching',
    'medium',
    'Match each English word with its closest synonym:',
    'Gigantic = Enormous; Rapid = Swift; Diligent = Hard-working; Accurate = Precise.',
    20,
    50,
    'published'
  ),

  -- Q8: Vật lý - True / False
  (
    '00000000-0000-0000-0002-000000000008',
    '00000000-0000-0000-0001-000000000007',
    'true_false',
    'easy',
    'Sóng âm có thể truyền được trong môi trường chân không. Đúng hay Sai?',
    'Sai. Sóng cơ/sóng âm cần môi trường vật chất (rắn, lỏng, khí) để lan truyền, không truyền được trong chân không.',
    10,
    15,
    'published'
  ),

  -- Q9: Hóa học - Điền công thức (Fill-in)
  (
    '00000000-0000-0000-0002-000000000009',
    '00000000-0000-0000-0001-000000000009',
    'fill_blank',
    'easy',
    'Công thức hóa học của khí gây ra hiệu ứng nhà kính chính trên Trái Đất (Cacbon đioxit) là gì?',
    'Khí Cacbon đioxit có công thức hóa học là CO2.',
    10,
    20,
    'published'
  ),

  -- Q10: Sinh học - Single choice
  (
    '00000000-0000-0000-0002-000000000010',
    '00000000-0000-0000-0001-000000000011',
    'single_choice',
    'easy',
    'Phân tử nào sau đây mang thông tin di truyền mã hóa cho các chuỗi pôlipeptit trong tế bào?',
    'mARN (ARN thông tin) trực tiếp làm khuôn cho quá trình dịch mã tổng hợp chuỗi pôlipeptit.',
    10,
    25,
    'published'
  ),

  -- Q11: Lịch sử - Điền năm lịch sử (Violympic Fill-in)
  (
    '00000000-0000-0000-0002-000000000011',
    '00000000-0000-0000-0001-000000000012',
    'fill_blank',
    'easy',
    'Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm nào? (Nhập 4 chữ số)',
    'Chiến thắng Điện Biên Phủ kết thúc vào ngày 7 tháng 5 năm 1954.',
    10,
    20,
    'published'
  ),

  -- Q12: Địa lý - Single choice
  (
    '00000000-0000-0000-0002-000000000012',
    '00000000-0000-0000-0001-000000000013',
    'single_choice',
    'easy',
    'Đỉnh núi cao nhất Việt Nam và được mệnh danh là "nóc nhà Đông Dương" là đỉnh núi nào?',
    'Đỉnh Fansipan thuộc dãy Hoàng Liên Sơn có độ cao 3.143m là đỉnh núi cao nhất.',
    10,
    20,
    'published'
  ),

  -- Q13: Kinh tế & Pháp luật - Multiple choice
  (
    '00000000-0000-0000-0002-000000000013',
    '00000000-0000-0000-0001-000000000014',
    'multiple_choice',
    'medium',
    'Theo quy định của pháp luật Việt Nam, những quyền nào sau đây là quyền cơ bản của công dân? (Chọn tất cả các đáp án đúng)',
    'Quyền bầu cử, quyền học tập và quyền bất khả xâm phạm về thân thể đều là quyền cơ bản của công dân theo Hiến pháp.',
    15,
    30,
    'published'
  )
ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  explanation = EXCLUDED.explanation;

-- 4. Question Options
INSERT INTO public.question_options (question_id, option_key, content, sort_order)
VALUES
  -- Q1 options
  ('00000000-0000-0000-0002-000000000001', 'A', '-3', 1),
  ('00000000-0000-0000-0002-000000000001', 'B', '0', 2),
  ('00000000-0000-0000-0002-000000000001', 'C', '3', 3),
  ('00000000-0000-0000-0002-000000000001', 'D', '6', 4),

  -- Q3 options (Matching: Left list & Right list)
  ('00000000-0000-0000-0002-000000000003', 'L1', 'Căn bậc hai của 64', 1),
  ('00000000-0000-0000-0002-000000000003', 'L2', '2 lũy thừa 5 (2^5)', 2),
  ('00000000-0000-0000-0002-000000000003', 'L3', 'log2(16)', 3),
  ('00000000-0000-0000-0002-000000000003', 'R1', '8', 4),
  ('00000000-0000-0000-0002-000000000003', 'R2', '32', 5),
  ('00000000-0000-0000-0002-000000000003', 'R3', '4', 6),

  -- Q4 options
  ('00000000-0000-0000-0002-000000000004', 'A', 'Chữ Nôm, thể thơ lục bát', 1),
  ('00000000-0000-0000-0002-000000000004', 'B', 'Chữ Hán, thể thơ thất ngôn bát cú', 2),
  ('00000000-0000-0000-0002-000000000004', 'C', 'Chữ Quốc ngữ, thể thơ song thất lục bát', 3),
  ('00000000-0000-0000-0002-000000000004', 'D', 'Chữ Nôm, thể thơ tự do', 4),

  -- Q6 options
  ('00000000-0000-0000-0002-000000000006', 'A', 'had studied', 1),
  ('00000000-0000-0000-0002-000000000006', 'B', 'studied', 2),
  ('00000000-0000-0000-0002-000000000006', 'C', 'have studied', 3),
  ('00000000-0000-0000-0002-000000000006', 'D', 'would study', 4),

  -- Q7 options (Matching English synonyms)
  ('00000000-0000-0000-0002-000000000007', 'L1', 'Gigantic', 1),
  ('00000000-0000-0000-0002-000000000007', 'L2', 'Rapid', 2),
  ('00000000-0000-0000-0002-000000000007', 'L3', 'Diligent', 3),
  ('00000000-0000-0000-0002-000000000007', 'R1', 'Enormous', 4),
  ('00000000-0000-0000-0002-000000000007', 'R2', 'Swift', 5),
  ('00000000-0000-0000-0002-000000000007', 'R3', 'Hard-working', 6),

  -- Q8 options
  ('00000000-0000-0000-0002-000000000008', 'TRUE', 'Đúng', 1),
  ('00000000-0000-0000-0002-000000000008', 'FALSE', 'Sai', 2),

  -- Q10 options
  ('00000000-0000-0000-0002-000000000010', 'A', 'mARN', 1),
  ('00000000-0000-0000-0002-000000000010', 'B', 'tARN', 2),
  ('00000000-0000-0000-0002-000000000010', 'C', 'rARN', 3),
  ('00000000-0000-0000-0002-000000000010', 'D', 'Ribôxôm', 4),

  -- Q12 options
  ('00000000-0000-0000-0002-000000000012', 'A', 'Fansipan', 1),
  ('00000000-0000-0000-0002-000000000012', 'B', 'Tây Côn Lĩnh', 2),
  ('00000000-0000-0000-0002-000000000012', 'C', 'Bạch Mộc Lương Tử', 3),
  ('00000000-0000-0000-0002-000000000012', 'D', 'Ngọc Linh', 4),

  -- Q13 options
  ('00000000-0000-0000-0002-000000000013', 'A', 'Quyền bầu cử và ứng cử', 1),
  ('00000000-0000-0000-0002-000000000013', 'B', 'Quyền được học tập', 2),
  ('00000000-0000-0000-0002-000000000013', 'C', 'Quyền bất khả xâm phạm về thân thể', 3),
  ('00000000-0000-0000-0002-000000000013', 'D', 'Quyền tự ý trốn tránh nghĩa vụ quân sự', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET
  content = EXCLUDED.content;

-- 5. Secret Question Answers (Official server-side evaluation payloads)
INSERT INTO public.question_answers (question_id, answer_payload)
VALUES
  ('00000000-0000-0000-0002-000000000001', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000002', '"5"'::jsonb),
  ('00000000-0000-0000-0002-000000000003', '{"L1": "R1", "L2": "R2", "L3": "R3"}'::jsonb),
  ('00000000-0000-0000-0002-000000000004', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000005', '"hùm"'::jsonb),
  ('00000000-0000-0000-0002-000000000006', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000007', '{"L1": "R1", "L2": "R2", "L3": "R3"}'::jsonb),
  ('00000000-0000-0000-0002-000000000008', '"FALSE"'::jsonb),
  ('00000000-0000-0000-0002-000000000009', '"CO2"'::jsonb),
  ('00000000-0000-0000-0002-000000000010', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000011', '"1954"'::jsonb),
  ('00000000-0000-0000-0002-000000000012', '"A"'::jsonb),
  ('00000000-0000-0000-0002-000000000013', '["A", "B", "C"]'::jsonb)
ON CONFLICT (question_id) DO UPDATE SET
  answer_payload = EXCLUDED.answer_payload;

-- 6. Exams (Các bộ đề thi tiêu chuẩn và thi đấu)
INSERT INTO public.exams (id, subject_id, title, description, time_limit_seconds, passing_score, total_points, status)
VALUES
  (
    '00000000-0000-0000-0003-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Đề thi Toán học — Vượt chướng ngại vật Violympus',
    'Bộ câu hỏi tổng hợp: Đạo hàm, cực trị, giải toán điền số và ghép cặp logic.',
    1200,
    50,
    100,
    'published'
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Đề thi Ngữ văn & Tiếng Việt — Tinh hoa ngôn từ',
    'Kiểm tra kiến thức văn học tác phẩm lớn và kỹ năng phân tích biện pháp tu từ.',
    900,
    50,
    100,
    'published'
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Đề thi Tiếng Anh — Academic Vocabulary & Grammar',
    'Thử thách ngữ pháp nâng cao, mệnh đề quan hệ và bài tập ghép cặp từ đồng nghĩa.',
    900,
    60,
    100,
    'published'
  ),
  (
    '00000000-0000-0000-0003-000000000004',
    '00000000-0000-0000-0000-000000000007',
    'Đề thi Lịch sử & Địa lý — Hành trình non sông',
    'Các mốc son lịch sử Việt Nam và kiến thức địa lý tự nhiên, khí hậu vùng miền.',
    900,
    50,
    100,
    'published'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- 7. Exam Questions Mapping
INSERT INTO public.exam_questions (exam_id, question_id, sort_order, points)
VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0002-000000000001', 1, 10),
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0002-000000000002', 2, 15),
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0002-000000000003', 3, 20),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0002-000000000004', 1, 10),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0002-000000000005', 2, 10),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0002-000000000006', 1, 10),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0002-000000000007', 2, 20),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0002-000000000011', 1, 10),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0002-000000000012', 2, 10)
ON CONFLICT (exam_id, question_id) DO NOTHING;

-- 8. Badges (Huy hiệu danh dự)
INSERT INTO public.badges (id, slug, name, description, icon_name, xp_reward)
VALUES
  ('00000000-0000-0000-0004-000000000001', 'tan-binh-olympia', 'Tân binh Olympia', 'Hoàn thành bài luyện tập hoặc đề thi đầu tiên', 'Award', 50),
  ('00000000-0000-0000-0004-000000000002', 'dau-si-realtime', 'Đấu sĩ Realtime', 'Tham gia và hoàn tất một trận đấu đối kháng trực tiếp', 'Swords', 100),
  ('00000000-0000-0000-0004-000000000003', 'bac-thay-toan-hoc', 'Bậc thầy Toán học', 'Đạt điểm tuyệt đối trong một đề thi Toán học chuẩn', 'Brain', 150),
  ('00000000-0000-0000-0004-000000000004', 'chuyen-gia-ngu-van', 'Nhà thông thái Ngữ văn', 'Đạt điểm số xuất sắc trong các bài thi Ngữ văn', 'BookOpen', 150),
  ('00000000-0000-0000-0004-000000000005', 'than-toc-tieng-anh', 'Thần tốc Tiếng Anh', 'Hoàn thành bài thi Tiếng Anh với độ chính xác 100%', 'Languages', 150),
  ('00000000-0000-0000-0004-000000000006', 'chuoi-5-thang', 'Chuỗi 5 trận thắng', 'Giành chiến thắng hạng nhất trong 5 trận đấu đối kháng liên tiếp', 'Trophy', 250)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
