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
