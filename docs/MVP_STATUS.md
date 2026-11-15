# MVP Status — Violympus

Last updated: 2026-10-15

## ✅ Implemented & Verified

- **Phase 0: Documentation & Architecture**
  - Architecture spec (`ARCHITECTURE.md`), Database spec (`DATABASE.md`), Security & Threat Model (`SECURITY.md`), Deployment guide (`DEPLOYMENT.md`), Testing strategy (`TESTING.md`).
- **Phase 1: Foundation & Tooling**
  - Tooling: React 19 + TypeScript (strict mode) + Vite + Tailwind CSS v4 + React Router v8.
  - Fonts: Google Sans Flex + Plus Jakarta Sans + JetBrains Mono (zero rendering bugs on Vietnamese diacritics).
  - Design Tokens & Theme: Light Modern Academic Arena per `UI&UX.md` §2.
  - Providers: TanStack Query (`QueryProvider`), `AuthProvider` (Supabase session & profiles), `ErrorBoundary` with user recovery and logging.
  - UI Primitives: `Button` (with `asChild`), `Input`, `Card`, `Badge`, `Skeleton`.
  - Shared Components: `LanguageSwitcher` (VI/EN), `EmptyState`, `ErrorState`, `LoadingSpinner`.
  - Layouts: `PublicLayout` (header + responsive footer + skip link), `AppLayout` (desktop sidebar + mobile drawer + bottom nav bar), `ExamLayout` (distraction-free), `AdminLayout` (Admin Studio sidebar + breadcrumbs).
  - Auth Flow: `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage` with Zod validation and Supabase auth error mapping.
  - Pages: `LandingPage`, `DashboardPage`, `SubjectsPage`, `PracticePage`, `ArenaLobbyPage`, `LeaderboardPage`, `ProfilePage`, `SettingsPage`, `AdminOverviewPage`, `TermsPage`, `PrivacyPage`, `NotFoundPage`, `ForbiddenPage`.
  - Verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm test` (all 6 Vitest tests passing), `npm run build` (production bundle built cleanly).

- **Phase 2: Database & Security**
  - Migrations: `001_enums_and_types.sql` through `010_rpc_functions.sql` (10 ordered SQL files).
  - RLS Policies: Complete policy definitions on all 21 tables; secret `question_answers` locked from client SELECT.
  - RPC Functions: 8 core server-side functions (`start_attempt`, `save_attempt_answer`, `submit_attempt`, `create_room`, `join_room`, `leave_room`, `submit_arena_answer`, `arena_heartbeat`).
  - Seed Data: Mở rộng toàn diện **11 môn học & chuyên đề** (Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa, Kinh tế & Pháp luật, Tin học, Logic) và 4 thể thức thi đấu lấy cảm hứng từ Violympic kinh điển (Cặp đôi hoàn hảo - Matching pairs, Vượt chướng ngại vật - Streak, Đừng để điểm rơi - Fill-in-the-blank, và Đấu trường trắc nghiệm Realtime).
  - TypeScript Types: `database.types.ts` generated and wired to Supabase client with zero `any`.
  - Verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm test` (all 6 tests passing), `npm run build` (production build passing).

- **Phase 3: Learning & Solo Exam (Public / Guest Friendly)**
  - **Mô hình Khách tự do (No Login Required):** Người học tự do luyện tập 11 môn học và làm đề thi khảo sát chuẩn hóa mà không bắt buộc tạo tài khoản hay đăng nhập.
  - **Chỉ Battle Rank (`/arena`) yêu cầu Auth:** Phân định rõ ràng: tính năng học tập, thử sức và kiểm tra là công cộng; chỉ đấu trường xếp hạng có ELO và quản lý hồ sơ cá nhân mới yêu cầu đăng nhập (`RequireAuth`).
  - **Trải nghiệm Thi Thử Solo (`/exams` & `/exams/:id`):** Giao diện phòng thi tập trung (`ExamLayout`), đồng hồ đếm ngược tự động nộp bài khi hết giờ, bảng mục lục câu hỏi, hỗ trợ đầy đủ 5 dạng câu hỏi (trắc nghiệm đơn, trắc nghiệm nhiều lựa chọn, đúng/sai, điền đáp án, cặp đôi hoàn hảo).
  - **Chấm điểm & Phân tích Đáp án (`ExamResultView`):** Đánh giá kết quả ngay sau khi nộp bài, phân tích từng câu hỏi kèm lời giải chi tiết của chuyên gia. Banner khích lệ lưu XP và ghi danh Bảng Xếp Hạng dành riêng cho khách.
  - **Chế độ Luyện tập Kinh điển Violympic (`/practice`):**
    - 🧩 *Cặp Đôi Hoàn Hảo (Matching Pairs):* Lưới thẻ bài ghép đôi khái niệm/công thức/từ đồng nghĩa.
    - ⛰️ *Vượt Chướng Ngại Vật (Khỉ Leo Núi):* Bậc thang tri thức 10 cấp, chuỗi đúng nhân combo, 3 mạng.
    - ⏱️ *Đừng Để Điểm Rơi (Speed Blank):* Điểm rơi từ 1.000 điểm theo thời gian thực, gõ đáp án siêu tốc.
  - **Migration & RPC Mới:** `011_guest_evaluation.sql` với 2 hàm `check_practice_answer` và `grade_guest_exam` (anon-accessible, bảo mật tuyệt đối đáp án gốc trên server).
  - **Verification:** `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm test` (11/11 tests passing bao gồm test suite `examService`), `npm run build` (production build thành công).

- **Phase 5: Admin Studio & Server-side Content Operations (`VIOLYMPUS_ADMIN.md`)**
  - **Database & Server-Side Security (`012_admin_rpc.sql`):**
    - Security Definer helper functions: `is_admin_or_editor()`, `is_admin()` with fixed `search_path`.
    - Server-side Content RPCs: `admin_upsert_subject`, `admin_delete_subject`, `admin_get_question` (safely exposes answer keys only to authorized staff), `admin_upsert_question` (auto version bump + audit logging), `admin_delete_question`.
    - User & Role RPCs: `admin_list_users` (safe user list without leaking emails or passwords), `admin_set_user_role` (atomic role update, guards against demoting the last remaining admin).
    - Batch Import RPCs: `create_import_job`, `import_questions_batch` supporting `skip`, `overwrite`, and `error` duplicate policies.
  - **Admin Studio Interface (`/admin/*`):**
    - `/admin`: Real overview dashboard reading live counts of questions by status, subjects, import jobs, and recent audit activity.
    - `/admin/subjects`: Full CRUD modal for subjects, automatic slug generation, Lucide icon support, sort order.
    - `/admin/questions`: Questions bank with filters by type, difficulty, status, text search, server-side pagination, and delete confirmation.
    - `/admin/questions/new` & `/admin/questions/:questionId`: Dynamic form adapting to question types (`single_choice`, `multiple_choice`, `true_false`, `fill_blank`, `matching`), options builder, answer key payload, points, time limits, and draft/published states.
    - `/admin/import`: CSV drag-and-drop uploader with pure client-side validation, formula-injection-safe error report download, built-in CSV template, duplicate policy selector, and job history.
    - `/admin/users`: User management table with role assignment dialog and confirm protection.
    - `/admin/audit-log`: Append-only audit trail viewer showing actor, action labels, target entities, and change metadata chips.

- **Phase 6: Horizontal Navigation Sync, Gamification (XP & Level), Gems Economy, Daily Tasks & Check-in, Streak & Study Tracker, Leo Núi (Olympia Gameshow)**
  - **Chuẩn hóa Giao diện Điều hướng Ngang (Horizontal Header Navigation):**
    - Header trên đỉnh đồng nhất giữa `PublicLayout` và `AppLayout`: Home (Logo giữ nguyên), Học & Luyện tập (`/practice`), Thi & Khảo sát (`/exams`), Đấu trường (`/arena`), Leo núi (`/climb`), Bảng xếp hạng (`/leaderboard`).
    - Khối tiện ích góc phải: Chuỗi Streak (🔥), Ngân khố Kim cương (💎), Cấp độ & Thanh tiến trình (⚡), Bộ chọn ngôn ngữ (VI/EN), Menu hồ sơ/cài đặt/đăng xuất (Auth) hoặc Đăng nhập/Đăng ký (Khách).
  - **Chức năng LEO NÚI — Đường Lên Đỉnh Olympia (`/climb`):**
    - 4 vòng thi gameshow chuẩn mực:
      - 1. *Khởi động:* Trả lời nhanh trong 60 giây, mỗi câu đúng +10đ.
      - 2. *Vượt chướng ngại vật:* Ô chữ 4 hàng ngang gợi ý từ khóa bí mật, tính năng bấm chuông đoán từ khóa sớm nhận tới +60đ.
      - 3. *Tăng tốc:* 4 câu hỏi tốc độ, chia bậc điểm 40/30/20/10 theo thời gian trả lời.
      - 4. *Về đích:* Chọn gói câu hỏi (40đ hoặc 60đ) kèm quyền chọn Ngôi sao hy vọng (⭐) nhân đôi điểm đúng hoặc phạt nếu sai.
    - Hỗ trợ cả 2 chế độ: Thử thách Đơn (Solo) và Đấu trường 4 người (Multiplayer / AI Contestants).
    - Lễ trao vòng nguyệt quế và bục vinh danh Podium, phân phối thưởng XP và Kim Cương.
  - **Hệ thống Điểm Kinh Nghiệm (XP) & Cấp Độ:**
    - 8 cấp bậc danh hiệu: Tập sự, Học giả, Chiến binh tri thức, Dũng sĩ Olympia, Bậc thầy, Đại kiện tướng, Huyền thoại, Đỉnh Olympus.
    - Thanh tiến trình Level, số XP còn thiếu để thăng cấp, tự động đồng bộ profile.
  - **Kinh tế Kim Cương (Gems) & Nhiệm vụ Hàng ngày:**
    - Người dùng khởi đầu với 50 💎, tiêu thụ 10 💎 tạo phòng đấu, 5 💎 vào phòng đấu, 10 💎 vé thi leo núi 4 người.
    - Điểm danh 7 ngày nhận kim cương (+10 💎 -> +50 💎) với lịch trực quan.
    - 4 nhiệm vụ hàng ngày: Khởi động ngày mới, Luyện tập 5 phút, Hoàn thành 1 bài thi/quiz, Tham gia Đấu trường/Leo núi.
  - **Chuỗi Ngày Học (Streak), Thống kê & Nhắc nhở:**
    - Chuỗi ngày học liên tục (Streak 🔥) với lịch tuần.
    - Tự động ghi nhận thời gian học tích cực (`useStudyTracker`), thống kê thời gian học hôm nay, độ chính xác, tổng XP.
    - Cài đặt mục tiêu học tập (10/15/20/30 phút) và giờ nhắc nhở học tập hàng ngày.
  - **Đấu Trường Trực Tiếp (`/arena/room/:code`):**
    - Phòng đấu đối kháng thời gian thực với mã PIN chia sẻ, đếm ngược 3-2-1, câu hỏi tính tốc độ 15s, tính điểm người chơi trực tiếp, vinh danh bục chiến thắng.
  - **Database Migration:** `014_gamification_and_gems.sql` bổ sung các cột `gems`, `streak_days`, `last_active_date`, `study_seconds_today`, `climb_high_score` vào `profiles` cùng 3 hàm RPC nguyên tử (`add_user_xp`, `modify_gems`, `claim_daily_checkin`).
  - **Verification:**
    - `npm run typecheck` (0 errors)
    - `npm run lint` (0 errors, 0 warnings)
    - `npm test` (10 test suites, 55/55 unit tests passing)
    - `npm run build` (production bundle built successfully in 4.4s)
  - **Verification:**
    - `npm run typecheck` (0 errors)
    - `npm run lint` (0 errors, 0 warnings)
    - `npm test` (18/18 tests passing across 4 test suites, including `adminImportService.test.ts`)
    - `npm run build` (production build succeeded)

## 🔜 Next Up: Phase 4 — Realtime Arena & Battle Rank

- Room lifecycle (create, join via code, leave)
- Realtime state synchronization (Supabase Realtime channels)
- Match countdown, live player list, and speed-bonus scoring
- End-of-match ELO updates and podium leaderboard

## ⏳ Deferred (Not in MVP)

| Feature | Reason |
|---|---|
| AI tutor / AI-generated questions | Not in MVP scope |
| Payment / subscription | Not in MVP scope |
| Mobile native app | Web-first |
| Chat / social feed / follow | Not in MVP scope |
| Voice / video | Not in MVP scope |
| Tournament bracket (complex) | Basic tournament deferred |
| Advanced anti-cheat / proctoring | Limitations documented in SECURITY.md |
| Daily quests / shop / items | Not in MVP scope |
| Advanced analytics / BI | Not in MVP scope |
| LMS / SSO integration | Not in MVP scope |
| Multi-channel notifications | Not in MVP scope |
| Multi-tenant schools | Not in MVP scope |
| OAuth providers | Only when actually configured |
| pg_cron for room cleanup | Lazy-resolution used instead |

## Verification Blockers

| Item | Blocker |
|---|---|
| RLS policy testing | Requires Supabase test instance with seed data |
| E2E arena (2 players) | Requires running Supabase + 2 browser contexts |
| Email verification flow | Requires Supabase email provider configured |
