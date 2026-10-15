# VIOLYMPUS_FRONTEND — Đặc tả kỹ thuật phía người dùng

Đọc `AGENTS.md` trước. Giao diện chi tiết: `UI&UX.md`. Phần admin: `VIOLYMPUS_ADMIN.md`.

File này gồm: routes người dùng, auth, **database schema dùng chung**, RLS, học tập, thi cá nhân, **arena realtime**, gamification, dashboard, i18n, test, nghiệm thu phía người dùng.

---

## 1. Routes và guard

**Public**

|Route|Nội dung|
|---|---|
|`/`|Landing page|
|`/subjects`|Danh sách lĩnh vực công khai|
|`/subjects/:slug`|Chi tiết lĩnh vực/chủ đề|
|`/leaderboard`|Bảng xếp hạng công khai (nếu chính sách profile cho phép)|
|`/login`, `/register`|Đăng nhập, đăng ký|
|`/forgot-password`, `/reset-password`|Quên/đặt lại mật khẩu|
|`/auth/callback`|Chỉ khi có OAuth provider thực sự cấu hình|

**Authenticated**

`/dashboard`, `/learn/:lessonId`, `/practice`, `/practice/:subjectSlug`, `/arena`, `/arena/lobby/:roomCode`, `/arena/match/:matchId`, `/results/:attemptId`, `/tournaments`, `/tournaments/:tournamentId`, `/profile`, `/profile/:username` (hồ sơ công khai), `/settings`.

Admin routes: xem `VIOLYMPUS_ADMIN.md`.

**Yêu cầu chung**

- Guard theo quyền: chưa đăng nhập → `/login?redirect=...`; thiếu quyền → trang 403; không tồn tại → 404.
- Mỗi route có nội dung thật, trạng thái loading/error/empty, điều hướng hoạt động. Không placeholder không giải thích.
- `/tournaments`: nếu chưa triển khai luồng thật thì hiển thị trạng thái "chưa khả dụng" rõ ràng, **không** menu/CTA giả.
- Redirect sau login: chỉ chấp nhận đường dẫn nội bộ (bắt đầu bằng `/`, không `//`, không scheme); từ chối mọi giá trị khác.

---

## 2. Authentication

- Email/password signup, login, logout, forgot/reset password.
- Email verification nếu cấu hình Supabase yêu cầu (UI xử lý trạng thái "chờ xác minh email").
- OAuth chỉ thêm khi provider thật sự được cấu hình; không hiển thị nút giả.
- Session do Supabase Auth SDK persist/refresh; xử lý session hết hạn (redirect login + thông báo, giữ route để quay lại).
- Form validate bằng Zod; lỗi thân thiện song ngữ; không ghi token/mật khẩu vào log.
- Một `AuthProvider` duy nhất + `useAuth()`; không duplicate auth logic.
- Role đọc từ database (`user_roles` qua RPC/view an toàn), **không** từ input client hay metadata do user sửa được.

---

## 3. Database schema dùng chung

Tất cả thay đổi schema nằm trong `supabase/migrations/` có thứ tự, chạy được trên Supabase mới. Được đổi tên/chuẩn hóa nếu ghi lý do trong `docs/DATABASE.md`. Dùng `timestamptz` UTC; có FK, unique, check, index cho query thật (slug, room_code, room participants, active matches, leaderboard). Không index tràn lan.

### 3.1 Identity

- `profiles`: `id` → `auth.users`, `username` unique (normalized, lowercase), `display_name`, `avatar_url?`, `bio?`, `locale` check (`vi`|`en`), `is_public`, `created_at`, `updated_at`.
- `user_roles`: `user_id`, `role` (`user`|`content_editor`|`admin`), `granted_by`, `created_at`, unique `(user_id, role)`.
- Trigger tạo `profiles` khi user đăng ký, xử lý conflict username an toàn (sinh hậu tố). Document trigger trong `docs/DATABASE.md`.
- User **không** thể tự cập nhật role (RLS không cho ghi `user_roles` từ client; chỉ RPC admin).

### 3.2 Learning content

- `subjects`: `slug` unique, `name_i18n`, `description_i18n`, `icon_key` (khóa tới Lucide), `status`, `sort_order`, timestamps.
- `topics`: `subject_id`, `slug`, `title_i18n`, `description_i18n`, `difficulty`, `status`.
- `lessons`: `topic_id`, `title_i18n`, `body_i18n` (markdown, sanitize khi render), `status`, `estimated_minutes`, `order_index`.
- `questions`: `subject_id`, `topic_id?`, `question_type`, `prompt_i18n`, `difficulty`, `explanation_i18n`, `status` (`draft`|`published`|`archived`), `created_by`, `updated_by`, `version`, timestamps.
- `question_options`: `question_id`, `option_key`, `text_i18n`, `order_index`. **Không** chứa cờ đúng/sai.
- `question_answers`: đáp án chuẩn + rule chấm + metadata private. **Chỉ RPC/backend đọc** (không policy SELECT cho `authenticated`).
- `question_tags`: `question_id`, `tag`.
- Dùng JSONB (`*_i18n` dạng `{ "vi": "...", "en": "..." }`) chỉ cho nội dung bản địa hóa có schema rõ + CHECK; quan hệ cần query/ràng buộc thì tách bảng.

**Loại câu hỏi hỗ trợ tối thiểu:** `single_choice`, `true_false`, `short_text`, `multi_select`.

- `short_text` normalization (document và test): trim → Unicode NFC → case folding → gộp khoảng trắng liên tiếp. **Không** bỏ dấu tiếng Việt (gây sai nghĩa), không áp dụng cho câu hỏi công thức/ký hiệu (cờ `case_sensitive`/`exact` trong rule).
- `multi_select`: quy tắc chấm công bố rõ — mặc định **all-or-nothing** (đúng tập đáp án mới có điểm). Không hỗ trợ partial credit trừ khi triển khai và test đầy đủ.
- Câu hỏi cần chấm phức tạp chưa hỗ trợ → **không** cho publish.

### 3.3 Exams và attempts

- `exams`: `title_i18n`, `description_i18n`, `mode` (`practice`|`timed`), `duration_seconds`, `status`, `rules` (JSONB có CHECK/Zod schema), `created_by`, timestamps.
- `exam_questions`: `exam_id`, `question_id`, `order_index`, `points`, unique `(exam_id, order_index)`.
- `attempts`: `exam_id`, `user_id`, `status` (`in_progress`|`submitted`|`expired`|`cancelled`), `started_at`, `deadline_at`, `submitted_at`, `score`, `max_score`, `duration_seconds`, `metadata`.
- `attempt_answers`: `attempt_id`, `question_id`, `answer_payload`, `answered_at`, `awarded_points`, `is_correct` (private), unique `(attempt_id, question_id)`.
- Kết quả chính thức chỉ ghi qua RPC/transaction.

### 3.4 Realtime arena

- `arena_rooms`: `room_code` unique, `host_user_id`, `status` (`waiting`|`starting`|`in_progress`|`finished`|`cancelled`), `visibility` (`public`|`private`), `capacity`, `settings`, `current_match_id?`, timestamps.
- `arena_participants`: `room_id`, `user_id`, `status`, `joined_at`, `last_seen_at`, `final_score`, `rank`, unique `(room_id, user_id)`.
- `arena_matches`: `room_id`, `status` (`pending`|`active`|`question_transition`|`finished`|`cancelled`), `starts_at`, `ends_at`, `current_question_index`, `state_version` (int, tăng mỗi transition), `settings_snapshot`, timestamps.
- `arena_match_questions`: `match_id`, `question_id`, `order_index`, `points`, `time_limit_seconds`, `question_started_at?`, `question_deadline_at?`, snapshot nội dung cần thiết để đề không đổi giữa trận.
- `arena_answers`: `match_id`, `question_id`, `user_id`, `answer_payload`, `received_at` (server `now()`), `awarded_points`, `is_correct` (private), unique `(match_id, question_id, user_id)`.
- Outbox/event/idempotency table chỉ thêm nếu kiến trúc thực sự dùng.

### 3.5 Gamification

- `xp_transactions`: append-only, `user_id`, `amount`, `source_type`, `source_id`, `idempotency_key` **unique**, `created_at`. Không UPDATE/DELETE (policy + trigger chặn).
- `badges`, `user_badges`, `seasons`. Chỉ làm badge nếu triển khai đầy đủ luồng cấp.
- Không tạo daily quests / shop / premium nếu chưa có luồng thật.

### 3.6 Admin & audit

Bảng `content_import_jobs`, `content_import_errors`, `audit_logs`: xem `VIOLYMPUS_ADMIN.md`.

### 3.7 Yêu cầu triển khai database

- Migrations: enum/types, tables, constraints, indexes, trigger (tối thiểu, có document), RLS, policies, functions.
- `updated_at` trigger có kiểm soát.
- Chính sách xóa/anonymize user và nội dung có lịch sử thi: ghi rõ trong `docs/DATABASE.md` (ví dụ: xóa user → anonymize profile, giữ attempts/arena kết quả với `user_id` ẩn danh hóa).
- `seed.sql` idempotent (`ON CONFLICT DO NOTHING/UPDATE`) hoặc ghi rõ cách reset.
- Sinh Supabase TypeScript types vào `src/lib/supabase/database.types.ts`; hướng dẫn cập nhật sau mỗi migration.

---

## 4. RLS và RPC

### 4.1 Nguyên tắc RLS

- Bật RLS trên **mọi** bảng ứng dụng. Mỗi policy có comment giải thích mục đích.
- `profiles`: xem được profile `is_public = true` hoặc của chính mình; chỉ sửa của mình (trừ cột nhạy cảm).
- Nội dung học (`subjects`, `topics`, `lessons`, `questions` metadata, `question_options`): SELECT bản `published` cho mọi người; draft/archived chỉ editor/admin.
- `question_answers`: **không** có SELECT cho `authenticated`/`anon`.
- `attempts`, `attempt_answers`: chỉ chủ sở hữu SELECT; không INSERT/UPDATE/DELETE trực tiếp từ client.
- `arena_*`: chỉ participant của room xem dữ liệu phù hợp; `arena_answers` chỉ xem của chính mình (và tổng hợp công khai qua RPC/view sau khi câu hỏi khóa).
- `xp_transactions`, `final_score`, `rank`, role, trạng thái trận: client **không** ghi.
- Policy cần helper `SECURITY DEFINER` (ví dụ `has_role()`, `is_room_participant()`) phải đặt `search_path` cố định và không lộ dữ liệu.

### 4.2 RPC cốt lõi (mọi RPC: xác thực `auth.uid()`, kiểm quyền, trạng thái, validate input, trả lỗi có mã ổn định)

Học tập/thi cá nhân:

- `start_attempt(exam_id)` → tạo attempt, `started_at`/`deadline_at` = server time, trả câu hỏi **không kèm đáp án**.
- `save_attempt_answer(attempt_id, question_id, answer_payload)` → idempotent theo `(attempt_id, question_id)`; từ chối nếu quá deadline/không thuộc đề.
- `submit_attempt(attempt_id)` → chấm trong transaction, ghi kết quả, cấp XP idempotent.
- `get_attempt_result(attempt_id)` → chỉ chủ sở hữu, chỉ sau submit/expired; kèm giải thích/đáp án đúng.
- Lazy-expire: mọi RPC đọc/ghi attempt kiểm tra `deadline_at`, nếu quá hạn chuyển `expired` và chấm các câu đã lưu.

Arena (chi tiết §7):

- `create_room`, `join_room(room_code)`, `leave_room`, `set_ready`, `start_match`, `submit_arena_answer`, `advance_match` (host hoặc orchestration), `heartbeat`, `get_match_snapshot(match_id)`, `get_room_snapshot(room_code)`.

Leaderboard/profile:

- `get_leaderboard(season?, scope, limit, cursor)`, `get_public_profile(username)`.

---

## 5. Học tập và luyện tập

- **Subjects/topics:** tải từ database, filter + search có loading/empty/error. Tên hiển thị theo locale, fallback rõ ràng khi thiếu bản dịch.
- **Lesson (`/learn/:lessonId`):** render markdown **đã sanitize** (không `dangerouslySetInnerHTML` thô), điều hướng bài trước/sau, đánh dấu hoàn thành (ghi qua RPC nếu có tiến độ), nút sang luyện tập chủ đề.
- **Practice (`/practice`, `/practice/:subjectSlug`):** chọn lĩnh vực/độ khó/số câu → tạo attempt `mode = practice` qua RPC → trả lời từng câu → xem giải thích **sau khi trả lời** (RPC chỉ trả đáp án đúng cho câu đã trả lời trong mode practice).
- Tiến độ học lưu server (không chỉ localStorage).

---

## 6. Thi cá nhân (end-to-end)

1. Chọn lĩnh vực/đề.
2. Server xác minh đề `published`, quyền và luật hợp lệ.
3. `start_attempt`: attempt + timestamp ở server.
4. Nhận câu hỏi không kèm answer key.
5. Người dùng trả lời; lưu đáp án qua `save_attempt_answer`.
6. Server xác minh attempt `in_progress`, chưa quá deadline, câu thuộc đề, payload hợp lệ.
7. Chặn/idempotent duplicate theo unique `(attempt_id, question_id)` (ghi đè đáp án trước khi nộp được phép, ghi rõ trong rules).
8. Submit hoặc hết giờ.
9. Server chấm trong transaction.
10. Lưu kết quả, giải thích, lịch sử, thống kê.
11. `/results/:attemptId`: điểm, số câu đúng/sai/bỏ qua, thời gian, giải thích từng câu, nút luyện lại nếu rules cho phép.

**Timer UI:** hiển thị thời gian còn lại tính từ `deadline_at` của server (đồng bộ lệch đồng hồ bằng offset đo lúc fetch), không dùng đếm JS làm nguồn chân lý. Hết giờ → gọi `submit_attempt`; server quyết định cuối cùng.

**UX bắt buộc:** cảnh báo khi rời bài thi (`beforeunload` + điều hướng nội bộ); **không** tự submit câu cuối nếu hành vi chưa được giải thích rõ cho người dùng; refresh giữa bài khôi phục attempt từ server (đáp án đã lưu + thời gian còn lại).

**Test bắt buộc:** timeout, refresh, double-submit, request đến trễ sau deadline, truy cập attempt của người khác (bị từ chối).

---

## 7. Arena realtime — MVP bắt buộc, triển khai thật

### 7.1 Nguyên tắc

- PostgreSQL là **source of truth**. Realtime chỉ là thông báo sau khi trạng thái đã ghi thành công.
- Client reconnect: **fetch snapshot** từ server (`get_match_snapshot`/`get_room_snapshot`) rồi mới subscribe tiếp.
- Xử lý duplicate event, event sai thứ tự (dựa `state_version`: bỏ event có version ≤ version hiện tại; nếu version nhảy cách → refetch snapshot), subscription rớt (resync).
- Client **không** broadcast điểm chính thức. Chỉ broadcast public state tối thiểu; **không** gửi answer key/email/PII trong payload.
- Không cho subscribe đọc toàn bộ `arena_answers`.
- Tách luồng: Realtime Postgres Changes/Broadcast do server-side trigger/RPC phát sau commit; client chỉ nhận và gọi lại snapshot khi cần.

### 7.2 State machine (viết `docs/ARCHITECTURE.md` + unit test trước khi code)

**Room**

```
waiting ──start_match──▶ starting ──match created──▶ in_progress ──match finished──▶ finished
   │                         │                           │
   └──────────── cancel (host/timeout/empty) ────────────┴──▶ cancelled
```

**Match**

```
pending ─▶ active(q0) ─▶ question_transition ─▶ active(q1) ─▶ … ─▶ finished
   └────────────────── cancel ──────────────────────────────────▶ cancelled
```

**Participant:** `joined → ready → connected ⇄ disconnected → finished`, hoặc `forfeited` (rời giữa trận).

- Chỉ transition hợp lệ trong bảng transition (hằng số + hàm thuần `canTransition(from, to)` được dùng cả ở test lẫn đồng bộ với SQL).
- Chống hai request đồng thời advance cùng một câu: `SELECT ... FOR UPDATE` trên match + kiểm tra `state_version`/`current_question_index` khớp tham số truyền vào (optimistic check); request thua nhận lỗi `STALE_STATE` và client resync.

### 7.3 User flow

1. Tạo phòng public/private. Room code ngắn, ngẫu nhiên có độ chênh lệch cao (ví dụ 6 ký tự, bỏ ký tự dễ nhầm `0/O/1/I`), unique, retry khi va chạm. Room code **không** là cơ chế bảo mật duy nhất (private room vẫn kiểm tra membership qua RPC).
2. Join bằng code hoặc danh sách phòng public (`waiting`, chưa đầy).
3. Lobby: host, participants, capacity, trạng thái kết nối (từ `last_seen_at` + heartbeat), luật chơi.
4. Host bắt đầu khi đủ tối thiểu (mặc định ≥ 2 người; ghi rõ trong settings). Server xác minh host, trạng thái, số người; khóa roster; snapshot câu hỏi vào `arena_match_questions`; tạo match.
5. Client nhận sự kiện → hiển thị câu hiện tại, thời gian còn lại, trạng thái đối thủ (đã trả lời/chưa — **không** lộ nội dung đáp án), bảng điểm.
6. Gửi đáp án qua `submit_arena_answer`; server chấm + ghi trong transaction, trả kết quả riêng cho người gửi.
7. Hết giờ câu → server chặn câu trả lời trễ; `advance_match` chuyển câu tiếp/kết thúc. Orchestration: client host gọi `advance_match` khi hết deadline **và** cơ chế dự phòng server-side (xem 7.6) để trận không kẹt.
8. Kết thúc: server tính điểm, rank (tie-break deterministic), lưu `final_score`/`rank`, cấp XP idempotent.
9. Reconnect: snapshot → subscribe.
10. Host disconnect: **host transfer** (người tham gia connected lâu nhất) hoặc tiếp tục bằng server state; trận luôn kết thúc được.
11. Rời phòng: trước trận → xóa participant; giữa trận → `forfeited`, **giữ** dữ liệu lịch sử.
12. Xử lý và hiển thị lỗi: room full (`ROOM_FULL`), code không tồn tại (`ROOM_NOT_FOUND`), trận đã bắt đầu (`MATCH_ALREADY_STARTED`), đã tham gia (`ALREADY_JOINED` → idempotent vào lại), mất kết nối, lỗi server.

### 7.4 Scoring (hàm thuần riêng + unit test)

- Câu đúng: điểm theo cấu hình của câu; sai/bỏ qua: 0. Không âm điểm trừ khi luật nói rõ.
- Điểm tốc độ (nếu bật): chỉ dùng `received_at` server và công thức công bố, ví dụ `points × (1 + bonus × remaining/limit)`, làm tròn xác định. Mặc định MVP: tắt.
- Tie-break deterministic theo thứ tự: tổng điểm ↓ → số câu đúng ↓ → tổng thời gian trả lời đúng ↑ → `user_id` (ổn định). Ghi trong luật hiển thị cho người chơi.
- XP ≠ điểm thi. Leaderboard chỉ dùng kết quả đã xác nhận.
- Logic scoring TypeScript (cho test/preview UI) và SQL phải cho kết quả giống nhau; test đối chiếu bằng fixtures dùng chung.

### 7.5 Bảo mật realtime

- Xác thực `auth.uid()` trong từng RPC; kiểm membership và quyền room.
- Chỉ host/orchestration start/advance/finish; client thường không thể.
- Rate limiting submit/join/create: triển khai tin cậy bằng bảng/function đếm theo user + cửa sổ thời gian trong RPC; nếu chưa làm được thì ghi rõ giới hạn.
- Ghi audit các thao tác nhạy cảm đủ để điều tra (không token/secret).
- Cấu hình Realtime publication + channel policies đúng schema, ghi trong `docs/DEPLOYMENT.md`.

### 7.6 Job nền

Cần cơ chế dọn phòng cũ và kết thúc trận bị bỏ dở (`pg_cron` hoặc Supabase scheduled function). Chỉ tuyên bố có khi đã cài đặt thật và document cách cấu hình/xác minh. Nếu chưa cài: lazy-resolution trong `get_match_snapshot`/`advance_match` (kiểm tra deadline, tự đóng trận/phòng quá hạn) và ghi giới hạn trong `MVP_STATUS.md`.

### 7.7 Hook/Module gợi ý

```
features/arena/
  services/arenaService.ts       # gọi RPC, parse bằng Zod, chuẩn hóa AppError
  hooks/useRoomQuery.ts, useMatchSnapshotQuery.ts
  hooks/useSubmitArenaAnswerMutation.ts (KHÔNG auto-retry)
  hooks/useArenaRealtime.ts      # subscribe + version check + resync + cleanup
  state/arenaStateMachine.ts     # canTransition, hằng số trạng thái (hàm thuần)
  state/scoring.ts               # hàm thuần
  components/ ... (Lobby, QuestionStage, Scoreboard, ConnectionBadge, ...)
  index.ts
```

---

## 8. Gamification và leaderboard

- XP từ hành động đã xác nhận server (hoàn thành attempt hợp lệ, kết thúc arena). Quy tắc XP công bố trong trang hướng dẫn/FAQ trong app.
- Chống farm: idempotency key `source_type:source_id:user_id`, trần XP theo ngày theo nguồn, attempt không hợp lệ (quá nhanh bất thường/bỏ trắng) không cấp XP theo quy tắc công bố.
- Leaderboard theo mùa/kỳ (`seasons`), phân trang; chỉ hiển thị user `is_public`; user ẩn hiển thị "Người chơi ẩn danh".
- Profile: thành tích, số trận, lĩnh vực nổi bật, badge (nếu có). User không sửa điểm/badge.

---

## 9. Dashboard

Dữ liệu thật từ Supabase: tiếp tục học/luyện tập, hoạt động gần đây, thống kê bài thi + tiến độ, lĩnh vực đang học, phòng/giải đấu đang mở (nếu có dữ liệu), vị trí bảng xếp hạng/thành tích. User mới → zero state hướng dẫn bắt đầu. Query có pagination; **không** hardcode thống kê.

---

## 10. i18n

- i18next + react-i18next; resources `vi`, `en` đầy đủ cho mọi luồng MVP; namespace theo feature.
- Mọi UI string lấy từ resources; không hardcode trong component. Có lint/test kiểm tra key thiếu giữa `vi` và `en`.
- Locale: ưu tiên `profiles.locale` khi đăng nhập; chưa đăng nhập dùng localStorage → `navigator.language` → mặc định `vi`. Đổi ngôn ngữ cập nhật cả profile (nếu đăng nhập) và local preference. Fallback chain rõ ràng.
- Ngày/giờ/số/thời lượng/điểm dùng `Intl` theo locale.
- Nội dung câu hỏi lấy từ `*_i18n`, fallback sang ngôn ngữ còn lại có nhãn rõ ("Chưa có bản dịch"). **Không** dịch máy runtime.
- Kiểm tra layout với chuỗi dài (tiếng Việt thường dài hơn); không cắt chữ mất nghĩa.

---

## 11. Nội dung mẫu (seed)

- ≥ 6 lĩnh vực: Mathematics, Science, History, Geography, Literature, Logic & General Knowledge (Việt/Anh), mỗi lĩnh vực vài topic.
- Lesson mẫu cho luồng bài học đã triển khai.
- ≥ 30 câu hỏi đa dạng loại, song ngữ, có giải thích **chính xác** (kiểm tra thủ công; không đáp án sai, không giải thích bịa).
- ≥ 1 đề thi mẫu dùng được; cấu hình phòng mẫu nếu cần.
- Mọi seed có cờ/tiền tố đánh dấu **dữ liệu mẫu** (ví dụ cột `is_sample` hoặc tag `sample`) và hiển thị nhãn trong UI admin.
- Không seed tài khoản admin/mật khẩu. Hướng dẫn promote admin bằng SQL chạy riêng trong môi trường quản trị (xem `VIOLYMPUS_ADMIN.md` §Bootstrap admin). Không dữ liệu cá nhân thật.

---

## 12. Lỗi, bảo mật, độ bền

- `AppError` với `code` ổn định (ví dụ `AUTH_EXPIRED`, `FORBIDDEN`, `ROOM_FULL`, `STALE_STATE`, `ATTEMPT_EXPIRED`, `NETWORK`, `VALIDATION`) + `messageKey` i18n. Hiển thị thân thiện, không lộ SQL/stack.
- Retry tự động chỉ cho query đọc và RPC idempotent; submit answer: nút "Thử lại" thủ công + idempotency (unique constraint) nên gửi lại an toàn.
- Xử lý session hết hạn và realtime reconnect (banner trạng thái kết nối).
- Sanitize markdown/rich text khi render.
- Security headers + SPA rewrite trong `vercel.json`.
- `docs/SECURITY.md` liệt kê: mô hình đe dọa, những gì client không bao giờ nhận, giới hạn anti-cheat (ví dụ: không ngăn được người chơi dùng thiết bị thứ hai/tra cứu; chỉ giảm bằng thời gian giới hạn, xáo thứ tự, server-side scoring).

---

## 13. Testing phía người dùng

**Unit (Vitest):** scoring từng loại câu hỏi; normalization short text (Unicode, hoa/thường, khoảng trắng, dấu tiếng Việt); state machine room/match (hợp lệ + không hợp lệ); deadline/late answer; tie-break; XP idempotency (logic key); i18n fallback + đủ key.

**Component (RTL):** form auth (validation, disabled khi submit), Lobby, QuestionStage (loading/error/empty/success), Timer, ResultView, language switcher.

**Integration (cần Supabase test instance/local `supabase start`):** auth → tạo profile; RLS user A/B; không đọc answer key sớm; submit hợp lệ/không hợp lệ; double submit; attempt hết hạn; start/advance/finish match; room capacity + duplicate membership. Nếu không có instance → ghi rõ **chưa chạy**.

**E2E (Playwright):**

1. Landing → register/login → dashboard.
2. Chuyển ngôn ngữ Việt/Anh.
3. Mở đề, làm bài, nộp, xem kết quả.
4. Hai browser context: tạo room, join, host bắt đầu, cùng trả lời, thấy kết quả đồng bộ.
5. Refresh/reconnect giữa trận → resync đúng.
6. Người không có quyền vào route admin / gọi RPC nhạy cảm → bị từ chối.

Fixture/test user tạo qua biến môi trường hoặc script riêng; không credentials production trong repo.

---

## 14. Nghiệm thu phía người dùng

- [ ] Landing và `/subjects` responsive, dữ liệu từ DB.
- [ ] Auth đầy đủ, guard hoạt động, redirect an toàn.
- [ ] Practice và thi cá nhân với timer server-validated; refresh khôi phục được.
- [ ] Kết quả + giải thích + lịch sử.
- [ ] Arena: tạo room → join → start → trả lời → sync → kết thúc → lưu kết quả; reconnect resync.
- [ ] Không thể lấy đáp án đúng trước thời điểm cho phép (đã kiểm tra bằng query bằng token user thường).
- [ ] Leaderboard dựa trên kết quả xác nhận.
- [ ] Việt/Anh hoạt động mọi luồng; không có string hardcode.
- [ ] Không route/CTA giả; `MVP_STATUS.md` cập nhật trung thực.