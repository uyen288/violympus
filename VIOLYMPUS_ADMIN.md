# VIOLYMPUS_ADMIN — Đặc tả kỹ thuật phía Admin

Đọc `AGENTS.md` trước. Schema dùng chung và RLS nền: `VIOLYMPUS_FRONTEND.md` §3–4. Giao diện: `UI&UX.md` §Admin Studio.

Admin Studio là giao diện thật để admin/content editor quản lý nội dung, import dữ liệu, quản lý người dùng và theo dõi audit. Mọi thao tác ghi đi qua RPC có kiểm tra vai trò ở database; ẩn nút ở frontend **không** phải là bảo vệ.

---

## 1. Vai trò và ma trận quyền

Vai trò xác minh ở database (`user_roles`): `user`, `content_editor`, `admin`.

|Khu vực|user|content_editor|admin|
|---|:-:|:-:|:-:|
|Xem Admin Studio|✗|✓|✓|
|CRUD subjects/topics/lessons|✗|✓|✓|
|CRUD questions, import CSV/XLSX|✗|✓ (draft; publish theo chính sách)|✓|
|Publish/archive subjects, exams|✗|✗ (mặc định)|✓|
|Quản lý exams|✗|✓ (draft)|✓|
|Xem arena rooms/tournaments|✗|✗|✓|
|Quản lý users/roles|✗|✗|✓|
|Audit log|✗|✗|✓|

- Quyết định chính sách "editor có được publish không" ghi vào `docs/SECURITY.md`; mặc định như bảng trên.
- Helper SQL `has_role(role)`, `is_staff()` (`SECURITY DEFINER`, `search_path` cố định) dùng trong policy và RPC.
- Frontend guard: `RequireRole roles={['content_editor','admin']}`; thiếu quyền → trang 403. Guard chỉ là UX; RPC từ chối lần nữa.
- Không cho user tự đổi role của chính mình; không cho admin tự gỡ admin cuối cùng (RPC kiểm tra còn ≥ 1 admin).

### Bootstrap admin đầu tiên

Không seed tài khoản/mật khẩu. Tài liệu hóa trong `docs/DEPLOYMENT.md`:

1. Đăng ký tài khoản bình thường qua UI.
2. Chạy SQL **riêng trong SQL Editor/CLI của chủ project** (không nằm trong migration/seed):

```sql
insert into public.user_roles (user_id, role, granted_by)
select id, 'admin', id from auth.users where email = '<email-cua-ban>'
on conflict (user_id, role) do nothing;
```

---

## 2. Routes admin

|Route|Chức năng|
|---|---|
|`/admin`|Tổng quan: số câu hỏi theo trạng thái, import gần đây, hoạt động gần đây (dữ liệu thật)|
|`/admin/subjects`|CRUD lĩnh vực, sắp xếp, publish/archive|
|`/admin/topics`|CRUD chủ đề, lọc theo lĩnh vực|
|`/admin/lessons`|CRUD bài học, preview, draft/publish|
|`/admin/questions`|Danh sách, lọc, tìm kiếm, phân trang|
|`/admin/questions/new`|Tạo câu hỏi|
|`/admin/questions/:questionId`|Sửa câu hỏi, lịch sử version|
|`/admin/import`|Import CSV/XLSX + danh sách import jobs|
|`/admin/exams`|Soạn đề: chọn câu, sắp xếp, điểm, thời lượng, trạng thái|
|`/admin/arena`|Xem phòng/trận, trạng thái, người tham gia (chỉ đọc + hủy phòng)|
|`/admin/tournaments`|Hiển thị đúng thực trạng; nếu chưa có luồng giải đấu thì nêu rõ chưa khả dụng|
|`/admin/users`|Danh sách người dùng, gán/gỡ role|
|`/admin/audit-log`|Nhật ký thao tác nhạy cảm|

Layout `AdminLayout` riêng, lazy-load toàn bộ route admin (không đưa parser XLSX vào bundle người dùng).

---

## 3. Database bổ sung cho admin

- `content_import_jobs`: `id`, `actor_id`, `file_name`, `file_size_bytes`, `file_type` (`csv`|`xlsx`), `file_sha256`, `duplicate_policy` (`reject`|`skip`|`update_draft`), `status` (`validated`|`importing`|`completed`|`failed`|`cancelled`), `total_rows`, `valid_rows`, `success_rows`, `failed_rows`, `created_at`, `completed_at`.
- `content_import_errors`: `job_id`, `row_number`, `field`, `error_code`, `safe_message`. Không lưu nội dung nhạy cảm (đáp án) trong message.
- `audit_logs`: `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `metadata` (JSONB tối thiểu), `created_at`. Append-only (chặn UPDATE/DELETE). Không lưu secrets/PII không cần thiết.
- RLS: các bảng trên chỉ staff (import jobs/errors: người tạo + admin; audit: admin) SELECT; ghi chỉ qua RPC.

**Hành động bắt buộc ghi audit:** đổi role, publish/archive subject/exam/question, import hoàn tất, xóa nội dung, hủy phòng arena bởi admin, sửa câu hỏi đã publish.

---

## 4. CRUD nội dung

Mọi form: React Hook Form + Zod; validate lại ở RPC/constraint; disable submit khi đang gửi; lỗi hiển thị cạnh field; xác nhận bằng dialog cho hành động nguy hiểm (xóa, archive, đổi role).

### 4.1 Subjects / Topics / Lessons

- Trường song ngữ `vi`/`en` cho tên, mô tả, tiêu đề; `slug` unique (tự sinh từ tên, sửa được, validate `^[a-z0-9]+(-[a-z0-9]+)*$`).
- `icon_key` chọn từ danh sách Lucide cho phép (không nhập tùy ý).
- Sắp xếp: kéo-thả có phương án bàn phím (nút lên/xuống) → lưu `sort_order`/`order_index` qua RPC.
- Lesson: soạn markdown + **preview song ngữ** (tab VI/EN), preview qua cùng renderer đã sanitize như phía người dùng. Draft → Published.
- Archive thay cho xóa cứng nếu có dữ liệu liên quan (attempts, exams).

### 4.2 Questions

- Trường: lĩnh vực, chủ đề, loại (`single_choice`/`true_false`/`short_text`/`multi_select`), đề bài song ngữ, lựa chọn, đáp án, giải thích song ngữ, độ khó, tag, trạng thái, điểm mặc định.
- Form động theo loại:
    - `single_choice`: 2–6 lựa chọn, **đúng 1** đáp án đúng.
    - `true_false`: 2 lựa chọn cố định (`true`/`false`), 1 đáp án đúng.
    - `short_text`: danh sách `accepted_answers`, tùy chọn `case_sensitive`/`exact`; hiển thị cách normalization áp dụng.
    - `multi_select`: ≥ 2 lựa chọn, ≥ 1 đáp án đúng, nhãn rõ "all-or-nothing".
- Admin/editor được đọc đáp án (qua RPC `admin_get_question`), người khác không.
- Publish gate (RPC kiểm tra): đủ bản dịch theo chính sách, đáp án hợp lệ với loại, giải thích có, không trùng lặp theo policy. Câu loại chưa hỗ trợ chấm tự động → không publish.
- Sửa câu hỏi đã publish: tăng `version`, đề/trận đã snapshot không bị đổi; ghi audit.
- Danh sách: bảng responsive (chuyển card trên mobile), lọc theo lĩnh vực/chủ đề/loại/độ khó/trạng thái/tag, tìm kiếm, phân trang server-side.

### 4.3 Exams

- Chọn câu từ ngân hàng (lọc/tìm), sắp xếp thứ tự, đặt điểm từng câu, `duration_seconds`, `mode`, `rules` (xác thực bằng Zod schema dùng chung với server).
- Chỉ câu `published` mới thêm vào đề `published`. Tổng điểm và số câu hiển thị tự động.
- Preview đề như người dùng sẽ thấy (không kèm đáp án).

### 4.4 Arena & Tournaments

- `/admin/arena`: danh sách phòng (lọc theo status), chi tiết participants/match state; hành động admin duy nhất: **hủy phòng** (confirm + audit + broadcast). Không sửa điểm.
- `/admin/tournaments`: chỉ hiển thị khi có luồng thật.

### 4.5 Users / Roles

- Danh sách (tên hiển thị, username, role, ngày tạo; **không** hiển thị email nếu không cần thiết — nếu cần cho admin thì chỉ qua RPC admin và không log).
- Gán/gỡ role qua `admin_set_user_role(user_id, role, action)`: kiểm tra caller là admin, không tự hạ quyền admin cuối cùng, ghi audit.
- Tìm kiếm + phân trang.

---

## 5. Import CSV / XLSX

### 5.1 Ràng buộc an toàn

- Chỉ `.csv` và `.xlsx`. Kiểm tra **phần mở rộng + magic bytes** (xlsx = ZIP `PK\x03\x04`), không tin MIME đơn lẻ.
- Không thực thi macro (từ chối `.xlsm`; chỉ đọc giá trị ô, bỏ qua công thức/chỉ lấy cached value).
- Giới hạn: dung lượng (mặc định 5 MB), số dòng (mặc định 2.000), số cột, độ dài mỗi ô, thời gian xử lý (timeout, xử lý trong Web Worker để không treo UI). Hằng số đặt tên, tài liệu hóa.
- Chống CSV/formula injection khi xuất báo cáo lỗi: ô bắt đầu bằng `= + - @` được prefix `'`.
- Parse ở **frontend (Web Worker)** bằng thư viện nhỏ đã khóa phiên bản (ví dụ `papaparse` cho CSV, `exceljs` hoặc `read-excel-file` cho XLSX — chọn một, nêu lý do trong `docs/IMPORT_FORMAT.md`); validate lần nữa ở RPC trước khi ghi.

### 5.2 Quy trình

1. Chọn file → hiển thị template/schema + nút tải template (CSV và XLSX mẫu).
2. Parse + validate **toàn bộ** trước khi ghi (không ghi gì khi chưa xác nhận).
3. Preview: tổng dòng, dòng hợp lệ, cảnh báo, lỗi (bảng phân trang, có row number).
4. Tải báo cáo lỗi (CSV: `row_number, field, error_code, message`).
5. Chọn duplicate policy: `reject` (mặc định), `skip`, `update_draft` (chỉ cập nhật câu đang `draft`). **Không** âm thầm ghi đè câu đã `published`.
6. Người dùng xác nhận → gọi RPC `import_questions_batch(job_id, rows[])`, mỗi batch (ví dụ 100 dòng) chạy trong một transaction. Chính sách lỗi: **all-or-nothing theo toàn bộ file** (mặc định, rollback nếu bất kỳ batch lỗi) hoặc "chỉ import dòng hợp lệ" nếu người dùng chọn rõ ràng — luôn thông báo kết quả chính xác, không import một phần mà không báo.
7. Ghi `content_import_jobs` + `content_import_errors` + `audit_logs`.
8. Câu import vào trạng thái `draft` (trừ khi admin chọn và policy cho phép).
9. Không hiển thị đáp án cho người không có quyền (job errors không chứa đáp án).

### 5.3 Template cột

`subject_slug, topic_slug, question_type, prompt_vi, prompt_en, option_a_vi, option_a_en, option_b_vi, option_b_en, option_c_vi, option_c_en, option_d_vi, option_d_en, correct_option_keys, accepted_answers, explanation_vi, explanation_en, difficulty, points, status`

Mở rộng `option_e_*`, `option_f_*` nếu hỗ trợ tới 6 lựa chọn (ghi trong docs).

### 5.4 Quy ước theo loại (parser riêng cho từng loại, không dùng một parser mơ hồ)

|Loại|Quy ước|
|---|---|
|`single_choice`|≥ 2 lựa chọn không rỗng liên tiếp từ A; `correct_option_keys` = đúng 1 khóa (`B`); khóa phải trỏ tới lựa chọn tồn tại|
|`true_false`|Không dùng `option_*`; `correct_option_keys` = `true` hoặc `false`|
|`short_text`|`option_*` để trống; `accepted_answers` = danh sách phân cách bằng `|
|`multi_select`|≥ 2 lựa chọn; `correct_option_keys` = nhiều khóa phân cách bằng `;` (`A;C`), ≥ 1, không trùng|
|Khác / không hỗ trợ|Lỗi `UNSUPPORTED_QUESTION_TYPE`, dòng bị loại|

Quy tắc chung:

- `difficulty` ∈ `easy|medium|hard` (hoặc 1–5, chọn một và ghi rõ). `points` số nguyên dương (≤ giới hạn). `status` ∈ `draft|published` — import `published` bị từ chối nếu thiếu bản dịch bắt buộc.
- **Bản dịch bắt buộc:** chính sách mặc định yêu cầu cả `vi` và `en` cho `prompt` và `explanation`. Nếu cho phép thiếu một ngôn ngữ thì phải là cấu hình rõ, và UI phía người dùng hiển thị fallback có nhãn.
- Trim, chuẩn hóa Unicode NFC; từ chối ký tự điều khiển; chặn HTML script (nội dung được sanitize khi render, nhưng import vẫn loại thẻ nguy hiểm).
- Mã lỗi ổn định: `MISSING_REQUIRED`, `INVALID_ENUM`, `UNKNOWN_SUBJECT`, `UNKNOWN_TOPIC`, `INVALID_CORRECT_KEY`, `TOO_FEW_OPTIONS`, `DUPLICATE_IN_FILE`, `DUPLICATE_IN_DB`, `MISSING_TRANSLATION`, `UNSUPPORTED_QUESTION_TYPE`, `VALUE_TOO_LONG`.
- Phát hiện trùng: hash chuẩn hóa của `prompt_vi + prompt_en + subject_slug` (so với trong file và trong DB).

Tạo `docs/IMPORT_FORMAT.md` (đầy đủ quy ước + ví dụ từng loại) và file mẫu `public/templates/violympus-questions-template.csv` + `.xlsx` (bao gồm ví dụ hợp lệ cho mỗi loại; tạo file `.xlsx` bằng script thật, kiểm tra mở được).

---

## 6. Kiến trúc code admin

```
features/admin/
  subjects/ topics/ lessons/ questions/ exams/ import/ arena/ users/ audit/
    services/        # RPC wrappers + parse Zod
    hooks/           # useXxxQuery / useXxxMutation
    components/
    schemas.ts       # Zod schema form + payload
    index.ts
  import/
    parser/          # csvParser.ts, xlsxParser.ts, rowValidator.ts, typeRules/*.ts (thuần, test được)
    worker/          # importWorker.ts (Web Worker)
```

- Logic parse/validate là **hàm thuần**, test không cần DOM. Validator dùng schema Zod dùng chung giữa form và import để không lệch luật.
- Mutation invalidate đúng query (ví dụ sửa câu hỏi → `['admin','questions', filters]` và `['admin','question', id]`).
- Query key chứa đầy đủ filter/page; không chứa dữ liệu nhạy cảm.

---

## 7. Testing admin

**Unit:** parser CSV/XLSX (BOM, dấu phẩy trong ô, xuống dòng trong ô, Unicode tiếng Việt, ô rỗng, dòng trống cuối file); validator từng loại câu hỏi; duplicate detection; giới hạn dung lượng/dòng; chống formula injection; mã lỗi.

**Component:** form câu hỏi động theo loại (thêm/xóa lựa chọn, validation lỗi gần field); Import UI (chọn file sai loại, preview, tải báo cáo lỗi, nút xác nhận chỉ bật khi hợp lệ); bảng responsive; dialog xác nhận có focus trap.

**Integration (cần Supabase):** editor/admin tạo/sửa câu hỏi; user thường bị từ chối RPC admin; đổi role + audit record; không gỡ admin cuối; import ghi job + errors + audit; import trùng theo từng policy; không ghi đè câu `published`.

**E2E:**

- Admin tạo/sửa một câu hỏi và thấy trong danh sách.
- Import CSV hợp lệ → thành công; CSV có lỗi → thấy báo lỗi theo dòng + tải được báo cáo.
- User thường truy cập `/admin` → 403; gọi RPC admin bằng token user → bị từ chối.

Báo cáo rõ test nào đã chạy, test nào chưa và lý do.

---

## 8. Nghiệm thu phía admin

- [ ] Guard + RPC role check hoạt động; user thường không truy cập được.
- [ ] CRUD subjects/topics/lessons/questions/exams hoạt động thật, song ngữ, preview cả hai ngôn ngữ.
- [ ] Publish gate chặn câu thiếu dữ liệu/loại chưa hỗ trợ.
- [ ] Import CSV + XLSX: giới hạn, preview, báo lỗi theo dòng, tải template + báo cáo lỗi, duplicate policy, xác nhận, job + audit được ghi.
- [ ] Đổi role được bảo vệ và audit; không gỡ admin cuối.
- [ ] Audit log xem được, append-only.
- [ ] Bảng admin không tràn ngang vô hạn (responsive).
- [ ] Không route/CTA giả; mục chưa làm được ghi rõ trong `MVP_STATUS.md`.