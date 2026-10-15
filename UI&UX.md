# UI&UX — Violympus: Light Modern Academic Arena

Tài liệu đặc tả giao diện cho agent thiết kế/triển khai. Đọc cùng `AGENTS.md` (quy ước code), `VIOLYMPUS_FRONTEND.md` (luồng người dùng) và `VIOLYMPUS_ADMIN.md` (Admin Studio).

---

## 1. Định hướng

**Cảm giác:** sáng, rõ ràng, thân thiện nhưng học thuật; cạnh tranh cao cấp, không trẻ con, không "game hóa" lòe loẹt. Giống một đấu trường tri thức hiện đại: gọn, tự tin, có nhịp điệu.

**Nguyên tắc**

1. Học tập trước, thi đấu sau: màn học/luyện tập yên tĩnh, màn thi đấu có năng lượng nhưng không gây phân tâm.
2. Mỗi trang phải thể hiện ngữ cảnh (học, thi, xếp hạng), tránh dashboard quản trị chung chung.
3. Hierarchy rõ: một hành động chính nổi bật mỗi màn hình.
4. Whitespace rộng, ít shadow, viền trung tính.
5. Mặc định **light** toàn sản phẩm; chỉ màn phòng thi realtime có thể dùng dark treatment riêng.
6. Mọi trạng thái đều được thiết kế: loading, empty, error, success, disabled, retry.
7. Mobile-first; làm bài trên điện thoại phải tốt.
8. Không dùng emoji làm icon giao diện; dùng Lucide.

---

## 2. Design tokens

Khai báo bằng CSS variables trong `src/index.css`, ánh xạ vào `tailwind.config` (không dùng giá trị tùy ý ngoài token).

### 2.1 Màu

|Token|Giá trị gợi ý|Dùng cho|
|---|---|---|
|`--background`|`#FFFFFF` / off-white `#F8FAFC`|Nền trang|
|`--surface`|`#FFFFFF`|Card, panel|
|`--surface-muted`|`#F1F5F9`|Vùng phụ, hàng bảng xen kẽ|
|`--border`|`#E2E8F0`|Viền trung tính|
|`--foreground`|`#0F172A`|Chữ chính|
|`--foreground-muted`|`#475569`|Chữ phụ (tương phản ≥ 4.5:1 trên nền)|
|`--primary`|`#1D3F8F` (navy-blue)|Hành động chính, link, focus|
|`--primary-hover`|`#16336F`|Hover|
|`--primary-soft`|`#E8EEFB`|Nền badge/tab chọn|
|`--accent-gold`|`#C99A2E`|Trophy, giải thưởng, rank cao — **dùng tiết chế**|
|`--accent-gold-soft`|`#FBF3DC`|Nền highlight rank/giải|
|`--success`|`#15803D` / soft `#E7F6EC`|Đúng, thành công|
|`--danger`|`#B91C1C` / soft `#FCEAEA`|Sai, lỗi, hành động nguy hiểm|
|`--warning`|`#B45309` / soft `#FDF1E0`|Cảnh báo, sắp hết giờ|
|`--focus-ring`|`#1D3F8F` 2px + offset 2px|Focus keyboard|

Quy tắc: green/red **chỉ** cho đúng/sai, thành công/lỗi. Không dùng màu làm cách duy nhất truyền đạt trạng thái — luôn kèm icon (Check/X/AlertTriangle) + chữ.

**Dark treatment cho phòng thi realtime** (token riêng `--arena-*`): nền `#0B1220`, surface `#121B2E`, chữ `#E6ECF8`, primary sáng `#7FA6FF`, gold `#E3B84F`. Đảm bảo tương phản ≥ 4.5:1.

### 2.2 Typography

- Font: **Inter** (hoặc Geist), self-host/`@fontsource`, `font-display: swap`, hỗ trợ subset `latin` + `vietnamese`.
- Thang chữ (mobile → desktop): Display 32→48 / H1 28→36 / H2 22→28 / H3 18→22 / Body 16 / Small 14 / Caption 12.
- Line-height: tiêu đề 1.2–1.3, body 1.6. Số liệu (điểm, timer, rank) dùng `font-variant-numeric: tabular-nums`.
- Tiếng Việt dài hơn: không dùng `truncate` cho nội dung chính; cho phép xuống dòng; button cho phép 2 dòng khi cần, giữ chiều cao tối thiểu.

### 2.3 Spacing, bo góc, bóng, chuyển động

- Spacing theo thang 4px (4, 8, 12, 16, 24, 32, 48, 64). Container tối đa 1200px (landing 1280px), padding ngang 16/24/32.
- Radius: `sm 6`, `md 10`, `lg 14`, `full` cho avatar/pill. Card dùng `lg`.
- Shadow: tối đa 2 mức (`shadow-sm` cho card nổi nhẹ, `shadow-md` cho dropdown/dialog). Ưu tiên viền hơn bóng.
- Motion: 150–250ms, easing `ease-out`; chỉ dùng cho chuyển trạng thái (hover, mở dialog, đổi câu hỏi, đếm điểm). **Tôn trọng `prefers-reduced-motion`** (tắt/giảm mọi animation không thiết yếu). Không animation lặp vô hạn trong lúc thi.

### 2.4 Breakpoints

`sm 640`, `md 768`, `lg 1024`, `xl 1280`. Thiết kế mobile trước, mở rộng lên.

---

## 3. Bố cục toàn cục

### 3.1 Header (mọi layout công khai/app)

- Logo Violympus (trái), điều hướng chính (desktop), **language switcher (VI/EN)**, thông báo (chỉ khi có hệ thống thông báo thật), avatar menu (Profile, Settings, Logout).
- Chưa đăng nhập: nút "Đăng nhập" (secondary) + "Bắt đầu" (primary).
- Sticky, nền trắng, viền dưới `--border`. Chiều cao 64px.

### 3.2 AppLayout (đã đăng nhập)

- **Desktop (≥ lg):** sidebar trái 248px (Dashboard, Practice, Arena, Tournaments*, Leaderboard, Profile) + vùng nội dung. *Chỉ hiển thị mục chưa có luồng thật dưới dạng disabled có nhãn "Sắp có" hoặc ẩn hẳn — không CTA giả.
- **Mobile/tablet (< lg):** header gọn + nút menu mở **drawer** (focus trap, đóng bằng Esc, trả focus về nút mở). Thêm bottom navigation 4 mục chính (Dashboard, Practice, Arena, Profile) cho mobile.
- Skip link "Bỏ qua tới nội dung" ở đầu trang.

### 3.3 ExamLayout (làm bài / trận đấu)

- Ẩn sidebar. Thanh trên cùng gọn: tên đề, tiến độ, timer, nút thoát (có xác nhận).
- Vùng câu hỏi trung tâm, rộng đọc tối ưu (max 720px). Điều hướng câu (số câu dạng lưới) nằm panel phụ (desktop) hoặc bottom sheet (mobile).

### 3.4 AdminLayout

- Sidebar admin cố định (Tổng quan, Nội dung ▸ Subjects/Topics/Lessons/Questions, Import, Exams, Arena, Tournaments, Users, Audit). Nhãn khu vực "Admin Studio" + badge vai trò hiện tại.
- Breadcrumb ở đầu trang; thanh hành động (Tạo mới) ở phải.

### 3.5 Trang hệ thống

- **404** và **403**: minh họa SVG đơn giản (không emoji), thông điệp thân thiện, nút "Về trang chủ/Dashboard".
- **Error boundary:** thẻ lỗi với mã tham chiếu, nút "Thử lại" và "Về trang chủ"; không lộ stack.
- Banner kết nối (arena/exam): "Đang kết nối lại…" / "Đã mất kết nối" / "Đã đồng bộ lại".

---

## 4. Thư viện component

Dùng shadcn/ui làm nền: `Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Tabs, Dialog, AlertDialog, Sheet, DropdownMenu, Tooltip, Badge, Card, Table, Skeleton, Toast(Sonner), Progress, Avatar, Pagination, Form`. Bổ sung component riêng khi cần:

|Component|Mô tả|
|---|---|
|`SubjectCard`|Icon Lucide trong ô nền soft, tên, mô tả 2 dòng, số topic/câu hỏi, nút "Luyện tập". Hover: viền primary|
|`QuestionCard`|Đề bài, lựa chọn dạng thẻ chọn lớn (≥ 48px cao), trạng thái: mặc định / chọn / đúng / sai / khóa|
|`OptionButton`|`role="radio"` hoặc `checkbox` đúng loại; phím A–D chọn nhanh trên desktop (hiển thị gợi ý phím)|
|`ExamTimer`|Số đếm lớn (tabular), thanh tiến trình mảnh; chuyển `--warning` khi còn ≤ 20% hoặc ≤ 60s, kèm icon + thông báo screen-reader mỗi mốc (60s, 30s, 10s) bằng `aria-live="polite"` — **không** đọc từng giây|
|`QuestionNavigator`|Lưới số câu: đã trả lời / chưa / đang xem / đánh dấu|
|`ProgressRing` / `ProgressBar`|Tiến độ học/bài thi|
|`ScoreBoard`|Danh sách xếp hạng realtime: rank, avatar, tên, điểm; hàng của mình nổi bật; animation đổi chỗ nhẹ (tắt khi reduced-motion)|
|`RankBadge`|Rank 1–3 dùng gold/silver/bronze kèm icon Trophy/Medal + số (không chỉ màu)|
|`PlayerChip`|Avatar + tên + trạng thái (connected/disconnected/forfeited) bằng icon + chữ|
|`RoomCodeDisplay`|Mã phòng cỡ lớn, chữ monospace, nút "Sao chép" (toast xác nhận), nút chia sẻ|
|`ConnectionBadge`|Online / Reconnecting / Offline|
|`EmptyState`|Icon Lucide, tiêu đề, mô tả, 1 CTA hướng dẫn|
|`ErrorState`|Icon cảnh báo, thông điệp thân thiện, nút "Thử lại"|
|`ResultSummary`|Điểm lớn, đúng/sai/bỏ qua, thời gian, so với lần trước|
|`LanguageSwitcher`|Dropdown VI/EN, hiển thị ngôn ngữ hiện tại bằng chữ ("Tiếng Việt"/"English")|
|`ConfirmDialog`|AlertDialog; nút nguy hiểm dùng `--danger`; nút mặc định focus vào "Hủy"|
|`DataTable` (admin)|Responsive: desktop bảng; < md chuyển card xếp dọc; cột sắp xếp, phân trang, trạng thái loading/empty/error|

Mỗi component có: props type rõ, trạng thái disabled/focus/hover, và story/test tối thiểu cho các state chính.

---

## 5. Đặc tả từng màn hình

### 5.1 Landing `/`

- **Hero:** tagline song ngữ ("Học hỏi. Thi đấu. Vươn tầm." / "Learn. Compete. Ascend."), mô tả 1–2 câu, CTA chính "Bắt đầu miễn phí", CTA phụ "Khám phá lĩnh vực". Bên phải: minh họa trừu tượng (SVG: bảng điểm xếp hạng + thẻ câu hỏi), **không** số liệu giả.
- **Lĩnh vực:** lưới 6 `SubjectCard` lấy từ DB (loading skeleton / empty / error).
- **Cách hoạt động:** 3 bước (Học → Luyện tập → Thi đấu) với icon Lucide.
- **Đấu trường:** mô tả thi đấu realtime; CTA "Tạo phòng" (dẫn tới đăng nhập nếu chưa).
- **Bảng xếp hạng:** top người chơi công khai (nếu có dữ liệu; nếu chưa có → empty state thật, không số giả).
- Footer: liên kết Terms/Privacy (có nhãn "Cần hoàn thiện pháp lý" nếu là placeholder), language switcher.
- Số liệu thống kê chỉ hiển thị khi lấy từ DB thật.

### 5.2 Subjects `/subjects`, `/subjects/:slug`

- Thanh tìm kiếm + filter (độ khó, loại). Lưới card responsive 1/2/3/4 cột.
- Chi tiết: banner lĩnh vực, danh sách topic (accordion), bài học, nút "Luyện tập chủ đề này", đề thi liên quan.

### 5.3 Auth (`/login`, `/register`, `/forgot-password`, `/reset-password`)

- Bố cục 2 cột desktop (trái: form; phải: panel giá trị với trích dẫn ngắn/biểu tượng), 1 cột mobile.
- Label luôn hiển thị; lỗi inline dưới field (`aria-describedby`, `aria-invalid`); nút hiện/ẩn mật khẩu có `aria-label`; nút submit loading + disabled.
- Chỉ hiển thị nút OAuth nếu provider thật được cấu hình.
- Trạng thái: "Kiểm tra email để xác minh", "Link đặt lại đã gửi", "Link hết hạn" (có nút gửi lại).

### 5.4 Dashboard `/dashboard`

- Hàng đầu: lời chào + CTA "Tiếp tục học" (dựa trên hoạt động gần nhất).
- Lưới: Tiến độ theo lĩnh vực (ProgressRing), Thống kê (số bài thi, độ chính xác trung bình), Hoạt động gần đây (danh sách), Phòng đang mở / Giải đấu sắp diễn ra, Vị trí xếp hạng/huy hiệu.
- **Zero state** cho user mới: thẻ hướng dẫn 3 bước và CTA "Chọn lĩnh vực đầu tiên".

### 5.5 Học (`/learn/:lessonId`)

- Cột đọc 720px, mục lục topic ở panel phải (desktop), tiến độ ở trên. Nội dung markdown typography tốt (heading, code, bảng, trích dẫn). Footer: "Bài trước / Bài tiếp / Luyện tập chủ đề".

### 5.6 Practice (`/practice`, `/practice/:subjectSlug`)

- Bước chọn: lĩnh vực → độ khó → số câu (stepper hoặc form 1 trang). Sau đó vào ExamLayout.
- Sau mỗi câu: trạng thái đúng/sai (icon + chữ + màu), giải thích mở ra dưới câu, nút "Câu tiếp theo".

### 5.6b Thi cá nhân (ExamLayout)

- Header: tên đề, `ExamTimer`, tiến độ `n/N`, nút "Nộp bài" (primary, luôn thấy nhưng không che nội dung).
- Nút "Nộp bài" mở `ConfirmDialog` hiển thị số câu chưa trả lời. **Không** tự submit câu cuối mà không giải thích.
- Rời trang → hộp thoại cảnh báo (nêu rõ thời gian vẫn chạy).
- Mobile: timer + tiến độ cố định phía trên (sticky, thấp), nút điều hướng Trước/Sau ở dưới (sticky, tính safe-area), lưới câu trong bottom sheet.

### 5.7 Kết quả `/results/:attemptId`

- `ResultSummary` ở trên; tab "Tất cả / Đúng / Sai / Bỏ qua"; mỗi câu một thẻ gập: đề, đáp án của bạn, đáp án đúng, giải thích. Nút "Luyện lại" (nếu cho phép), "Về dashboard".

### 5.8 Arena `/arena`

- Hai khối chính: **Tạo phòng** (form: lĩnh vực/đề, công khai/riêng tư, sức chứa, số câu, thời gian mỗi câu) và **Vào bằng mã** (input 6 ký tự, tự viết hoa, lỗi inline cho mã sai/phòng đầy/đã bắt đầu). Dưới: danh sách phòng công khai (card: chủ phòng, lĩnh vực, số người/capacity, nút Tham gia; empty state "Chưa có phòng công khai — hãy tạo phòng đầu tiên").

### 5.9 Lobby `/arena/lobby/:roomCode`

- Trái: `RoomCodeDisplay` lớn, nút Sao chép/Chia sẻ, luật chơi (tóm tắt), cài đặt.
- Phải: danh sách `PlayerChip` (host có icon Crown + chữ "Chủ phòng", trạng thái kết nối), đếm `n/capacity`.
- Hành động: host thấy "Bắt đầu" (disabled kèm lý do hiển thị rõ nếu chưa đủ người); người chơi thấy "Sẵn sàng"/"Rời phòng". Trạng thái "đang bắt đầu…" khi `starting`.
- Chuyển host: thông báo toast + cập nhật badge.

### 5.10 Match `/arena/match/:matchId` (dark treatment)

- **Bố cục desktop:** giữa: câu hỏi + lựa chọn; phải: `ScoreBoard`; trên: số câu `n/N`, timer đếm ngược theo deadline server, trạng thái kết nối.
- **Mobile:** timer + điểm của mình sticky trên cùng; câu hỏi full width; bảng điểm là bottom sheet kéo lên (nút "Bảng xếp hạng").
- Sau khi gửi đáp án: lựa chọn khóa, hiển thị "Đã gửi — chờ đối thủ/hết giờ" (không lộ đúng/sai nếu luật chỉ công bố cuối câu). Khi câu kết thúc: màn chuyển tiếp ngắn (2–4s) hiển thị đáp án đúng + điểm cộng + thứ hạng thay đổi.
- Đối thủ: chỉ hiện "đã trả lời/chưa" (icon + chữ), không hiện lựa chọn của họ.
- Mất kết nối: banner cố định, vô hiệu nút gửi nếu không chắc trạng thái, tự resync khi quay lại; thông báo "Đã đồng bộ".
- **Kết thúc:** podium top 3 (gold/silver/bronze + icon + số), bảng xếp hạng đầy đủ, điểm cá nhân, XP nhận được, nút "Chơi lại", "Về Arena".
- Animation: đếm điểm và đổi chỗ bảng điểm nhẹ; hiệu ứng ăn mừng chỉ ở màn kết thúc và tắt khi reduced-motion.

### 5.11 Leaderboard `/leaderboard`

- Tab: Mùa này / Mọi thời đại; filter lĩnh vực. Bảng (desktop) / danh sách card (mobile). 3 hàng đầu dùng `RankBadge`. Hàng của mình ghim/nổi bật. Phân trang. Empty/error state.

### 5.12 Profile `/profile`, `/profile/:username`

- Header: avatar, tên hiển thị, username, bio, ngày tham gia. Tab: Tổng quan (XP, số trận, thắng/thua, lĩnh vực nổi bật), Thành tích (badge nếu có), Lịch sử.
- Hồ sơ công khai tôn trọng cài đặt riêng tư; user ẩn → trang "Hồ sơ riêng tư".

### 5.13 Settings `/settings`

- Mục: Hồ sơ (tên, username, bio, avatar nếu có Storage), Ngôn ngữ, Quyền riêng tư (hiển thị trên bảng xếp hạng), Tài khoản (đổi mật khẩu). Lưu từng phần với feedback thành công/lỗi; không reset form ngoài ý muốn.

### 5.14 Tournaments `/tournaments`

- Nếu chưa có luồng thật: trang giải thích trung thực "Tính năng giải đấu chưa khả dụng trong phiên bản này", không nút giả.

---

## 6. Admin Studio — đặc tả giao diện

- **Phong cách:** cùng light theme, mật độ thông tin cao hơn nhưng vẫn thoáng; badge `Admin Studio` màu navy ở đầu sidebar.
- **Danh sách (DataTable):** thanh công cụ (tìm kiếm, filter dạng chip/dropdown, nút Tạo mới), cột có thể sắp xếp, hàng có menu hành động (Sửa, Nhân bản, Archive), phân trang dưới. < md → card xếp dọc, hành động trong dropdown.
- **Trạng thái nội dung:** `Badge` — Draft (xám), Published (xanh success kèm icon), Archived (nâu nhạt kèm icon).
- **Form câu hỏi (`/admin/questions/new`, `:id`):** bố cục 2 cột desktop: trái soạn (loại, đề bài, lựa chọn, đáp án, giải thích), phải **Preview** (tab VI | EN) hiển thị đúng như người dùng thấy. Mobile: tab "Soạn / Xem trước".
    - Tab ngôn ngữ có chỉ báo thiếu bản dịch (dấu chấm + chữ "Thiếu").
    - Phần lựa chọn: thêm/xóa/sắp xếp (nút lên/xuống + kéo-thả), chọn đáp án đúng bằng radio/checkbox theo loại, nhãn "Đáp án đúng" có icon.
    - Thanh hành động cố định đáy: Lưu nháp, Xuất bản (disabled kèm lý do tooltip nếu chưa đạt publish gate), Hủy.
    - Danh sách lỗi validation tổng hợp ở đầu form (link nhảy tới field).
- **Soạn đề:** hai cột — "Ngân hàng câu hỏi" (tìm/lọc) và "Câu trong đề" (sắp xếp, đặt điểm); tổng điểm/số câu/thời lượng ở thanh tóm tắt.
- **Import (`/admin/import`):** stepper 4 bước — (1) Chọn file + tải template, (2) Kiểm tra (progress), (3) Xem trước (số hợp lệ/cảnh báo/lỗi, bảng lỗi theo dòng, nút "Tải báo cáo lỗi", chọn duplicate policy), (4) Xác nhận & kết quả. Khu vực kéo-thả file có nút "Chọn file" bàn phím được; hiển thị giới hạn (loại, dung lượng, số dòng). Nút "Import" chỉ bật khi đủ điều kiện và nêu rõ sẽ ghi bao nhiêu câu. Dưới stepper: bảng lịch sử import jobs.
- **Users:** bảng + dialog đổi role (xác nhận, nêu hệ quả, hành động nguy hiểm dùng `--danger`).
- **Audit log:** bảng thời gian ↓, filter hành động/người thực hiện/khoảng ngày, hàng mở rộng xem metadata (đã làm sạch).
- **Arena admin:** bảng phòng + panel chi tiết; "Hủy phòng" qua `ConfirmDialog`.

---

## 7. Trạng thái giao diện (bắt buộc cho mọi dữ liệu server)

|Trạng thái|Quy tắc|
|---|---|
|Loading|Skeleton **chỉ** khi thực sự đang tải, đúng hình dạng nội dung; nút dùng spinner + chữ "Đang…" và `aria-busy`|
|Empty|Icon + lời giải thích + một CTA cụ thể (ví dụ "Tạo phòng đầu tiên")|
|Error|Thông điệp thân thiện + nút "Thử lại"; không lộ lỗi kỹ thuật|
|Success|Toast ngắn (`role="status"`) hoặc inline; không chặn thao tác|
|Disabled|Có lý do hiển thị (tooltip/văn bản phụ); không disable để che lỗi logic|
|Retry|Chỉ tự retry thao tác idempotent; còn lại là nút thủ công|
|Offline/Reconnecting|Banner trạng thái kết nối rõ ràng|

Toast: dùng vùng live (`aria-live`) truy cập được; lỗi không tự biến mất quá nhanh (≥ 6s hoặc có nút đóng).

---

## 8. Responsive

- **Mobile (< 640):** 1 cột, bottom navigation, bottom sheet cho bảng điểm/lưới câu, nút hành động chính full-width, vùng chạm ≥ 44×44px.
- **Tablet (640–1023):** 2 cột nơi hợp lý, sidebar dạng drawer.
- **Desktop (≥ 1024):** sidebar cố định, layout 2–3 cột.
- Bảng admin: không tràn ngang vô hạn — hoặc cuộn ngang trong container có gợi ý, hoặc chuyển card.
- Sử dụng `dvh` cho màn thi toàn chiều cao; tính safe-area trên mobile; bàn phím ảo không che input/nút gửi.
- Kiểm tra bằng viewport 360×640, 390×844, 768×1024, 1280×800, 1440×900.

---

## 9. Accessibility (WCAG 2.2 AA là mục tiêu)

- Semantic HTML: `header/nav/main/footer`, một `h1` mỗi trang, thứ tự heading hợp lý. `<button>` cho hành động, `<a>`/router link cho điều hướng.
- Mọi control có label/accessible name; icon-only button có `aria-label`.
- Focus ring rõ (2px primary + offset); thứ tự tab hợp lý; không bẫy focus ngoại trừ dialog/drawer (có trả focus khi đóng).
- Tương phản: chữ thường ≥ 4.5:1, chữ lớn/UI ≥ 3:1 (kiểm cả trạng thái disabled/warning và dark arena).
- Không dùng màu làm cách duy nhất cho đúng/sai/trạng thái.
- Câu hỏi: nhóm lựa chọn trong `fieldset` + `legend` (đề bài); `role="radiogroup"/"group"` đúng loại; phím mũi tên/số/chữ cái hoạt động.
- Timer: thông báo theo mốc bằng `aria-live="polite"`, không đọc từng giây. Cho phép tùy chọn ẩn timer số (vẫn có thanh tiến trình) nếu luật cho phép.
- `prefers-reduced-motion`: tắt animation không thiết yếu, thay bằng đổi trạng thái tức thời.
- Cập nhật bảng điểm realtime không làm screen reader đọc liên tục: dùng vùng `aria-live="off"` cho bảng, chỉ thông báo sự kiện quan trọng (đã nhận điểm, câu mới).
- Bảng dữ liệu: `<th scope>`, caption/ aria-label, sắp xếp có `aria-sort`.
- Kiểm thử bằng bàn phím toàn bộ luồng chính; chạy axe (jest-axe/@axe-core/playwright) trên các trang chính.

---

## 10. i18n trong giao diện

- Mọi chuỗi từ resources `vi`/`en`; không hardcode.
- Chuỗi dài (tiếng Việt): container linh hoạt, `min-w-0`, cho phép wrap; test với chuỗi giả dài +40%.
- Số, điểm, ngày giờ, thời lượng: `Intl.NumberFormat`/`DateTimeFormat`/`RelativeTimeFormat`/`DurationFormat` (hoặc helper) theo locale.
- Nội dung do admin tạo hiển thị theo locale hiện tại; thiếu bản dịch → fallback ngôn ngữ còn lại + nhãn "Chưa có bản dịch" / "Not translated".
- Language switcher luôn truy cập được (header, auth pages, footer) và đổi ngay không reload.

---

## 11. Nội dung/microcopy

- Giọng văn: rõ ràng, khích lệ, chuyên nghiệp; tránh ngôn ngữ trẻ con. Không hứa "chống gian lận tuyệt đối".
- Thông báo lỗi nêu **chuyện gì xảy ra + làm gì tiếp** (ví dụ "Phòng đã đầy. Hãy thử phòng khác hoặc tạo phòng mới.").
- Nhãn nút là động từ cụ thể ("Nộp bài", "Tạo phòng", "Bắt đầu trận") thay vì "OK"/"Submit".
- Tránh viết tắt khó hiểu; ghi rõ luật điểm và tie-break trong màn "Luật chơi".

---

## 12. Hiệu năng giao diện

- Lazy-load route admin, arena, parser import; preload font chính.
- Ảnh/minh họa: SVG hoặc ảnh có kích thước phù hợp, `loading="lazy"`, có `width/height` để tránh layout shift.
- Danh sách dài: phân trang/virtualization. Realtime scoreboard: cập nhật theo selector hẹp, tránh re-render toàn trang.
- Mục tiêu: LCP < 2.5s trên mạng 4G trung bình, CLS < 0.1.

---

## 13. Checklist bàn giao UI

- [ ] Token màu/typography/spacing khai báo một nơi, không giá trị tùy ý trong component.
- [ ] Mọi màn hình trong §5–6 có đủ loading/empty/error/success/disabled.
- [ ] Mobile 360px không vỡ layout (VI và EN); bảng admin không tràn ngang vô hạn.
- [ ] Toàn bộ luồng chính dùng được bằng bàn phím; focus rõ; axe không có lỗi nghiêm trọng.
- [ ] Reduced motion được tôn trọng; không animation lặp trong lúc thi.
- [ ] Không emoji làm icon; icon Lucide nhất quán (stroke 1.75–2).
- [ ] Màu xanh/đỏ không là tín hiệu duy nhất.
- [ ] Không nút/route giả; mục chưa khả dụng được nêu trung thực.
- [ ] Dark treatment chỉ ở màn Match, đạt tương phản.