# AGENTS.md — Violympus

> Nền tảng học tập và đấu trường tri thức đa lĩnh vực. _Learn. Compete. Ascend. / Học hỏi. Thi đấu. Vươn tầm._

File này là **điểm vào bắt buộc** cho mọi AI agent làm việc trong repository. Đọc file này trước, sau đó đọc file chuyên biệt theo phạm vi công việc:

| File                    | Phạm vi                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `AGENTS.md` (file này)  | Stack, cấu trúc, quy ước code, ranh giới tin cậy, quy trình, nghiệm thu                                      |
| `VIOLYMPUS_FRONTEND.md` | Phía người dùng: auth, học tập, thi cá nhân, arena realtime, leaderboard, profile, i18n, database dùng chung |
| `VIOLYMPUS_ADMIN.md`    | Phía admin: Admin Studio, CRUD nội dung, import CSV/XLSX, users/roles, audit log                             |
| `UI&UX.md`              | Đặc tả giao diện, design tokens, component, trạng thái, responsive, accessibility                            |

Khi các file mâu thuẫn nhau, ưu tiên: **AGENTS.md (Nguyên tắc ưu tiên + Ranh giới tin cậy) > file chuyên biệt > UI&UX.md**.

---

## Vai trò và cách làm việc

Bạn đóng vai Senior Full-Stack Engineer, Software Architect, Database Engineer, QA Engineer và Product Designer. Hãy **trực tiếp xây dựng phần mềm chạy được** bằng cách đọc, tạo và sửa file trong repository. Không chỉ trả lời bằng kế hoạch, code rời rạc hay mockup.

- Nếu repository đã có mã nguồn: kiểm tra cấu trúc, package, framework, conventions, tính năng hiện có; giữ phần tốt, không ghi đè mù quáng.
- Nếu repository trống: khởi tạo theo stack bên dưới.
- Chạy kiểm tra thật, sửa lỗi, ghi rõ những gì **đã thực sự hoàn thành**. Không bịa log, kết quả test, URL production hay trạng thái deploy.

## Tầm nhìn sản phẩm (tóm tắt)

- **Sản phẩm:** học kiến thức, luyện tập, thi cá nhân, thi đấu nhiều người realtime, giải đấu, thành tích, bảng xếp hạng.
- **Đối tượng:** người học mọi độ tuổi và trình độ, không khóa vào riêng học sinh phổ thông.
- **Ngôn ngữ:** tiếng Việt và tiếng Anh ngay từ đầu, i18n thực sự.
- **Visual:** Light Modern Academic Arena (chi tiết trong `UI&UX.md`).
- **Không tích hợp AI trong MVP.** Thiết kế để bổ sung sau mà không phụ thuộc AI ở luồng hiện tại.
- **Không dùng dữ liệu giả để giả vờ một tính năng đã hoạt động.** Seed phải được đánh dấu rõ là dữ liệu mẫu.

### Nguyên tắc sản phẩm

1. Học tập quan trọng hơn việc farm XP.
2. Điểm thi, đáp án đúng, trạng thái trận và kết quả chính thức được xác minh **phía server**.
3. Realtime phải xử lý refresh, mất mạng, gửi đáp án lặp, hết giờ, người chơi rời phòng.
4. Least privilege; không bao giờ đưa Supabase service-role key vào frontend.
5. Mọi tính năng hiển thị phải hoạt động, hoặc được đánh dấu rõ là chưa có và không giả lập thành công.
6. UX có đủ loading, empty, error, success, disabled và retry state.
7. Không hứa "chống gian lận tuyệt đối". Triển khai biện pháp giảm gian lận thực tế và nêu giới hạn.

---

## Stack

- **Ngôn ngữ/UI:** React + TypeScript (strict mode), Vite.
- **Routing:** React Router.
- **Styling:** Tailwind CSS + shadcn/ui (hoặc bộ tương đương tùy biến được, accessibility tốt). Icon: Lucide React.
- **Server state:** TanStack Query.
- **Client state:** Zustand — chỉ khi thực sự cần (xem mục State management).
- **Form/validation:** React Hook Form + Zod.
- **i18n:** i18next + react-i18next.
- **Backend:** Supabase
    - PostgreSQL là nguồn dữ liệu chuẩn.
    - Supabase Auth cho đăng ký/đăng nhập.
    - Row Level Security (RLS) cho mọi bảng client có thể truy cập.
    - Supabase Realtime cho broadcast trạng thái phòng/trận/bảng điểm.
    - PostgreSQL functions/RPC cho thao tác nghiệp vụ nguyên tử.
    - Supabase Storage chỉ khi thực sự cần (avatar/tài nguyên).
    - Edge Functions / Vercel serverless endpoints chỉ khi RPC không đủ; không tạo backend thứ hai phức tạp.
- **Deploy:** Vercel (frontend + serverless nếu có).
- **Test:** Vitest + React Testing Library (unit/component), Playwright (E2E).
- **Chất lượng:** ESLint + Prettier.
- **Package manager:** pnpm (nếu repo đang dùng manager khác thì giữ nhất quán).

Không thêm thư viện lớn nếu không có nhu cầu rõ ràng. Khóa phiên bản dependency, đảm bảo build reproducible.

**Cấm:** Redux Toolkit.

---

## Cấu trúc thư mục dự án

```
src/
  app/
    router/            # route config, guard (auth, role)
    providers/         # QueryClient, i18n, auth, error boundary
    layouts/           # PublicLayout, AppLayout, AdminLayout, ExamLayout
  components/
    ui/                # shadcn/ui primitives
    shared/            # component dùng chung nhiều feature
  features/
    auth/
    dashboard/
    subjects/
    learning/
    questions/
    practice/
	    exams/
    arena/
    tournaments/
    leaderboard/
    profile/
    settings/
    admin/             # xem VIOLYMPUS_ADMIN.md
  hooks/               # hook dùng chung
  services/            # API/RPC client dùng chung (supabase wrapper, normalize lỗi)
  lib/
    supabase/          # client + generated types
    i18n/              # config + resources vi/en
    validation/        # schema Zod dùng chung
    utils/
    errors/            # AppError, mã lỗi, reportError
  types/               # type dùng chung
  test/                # setup, fixtures, helpers
supabase/
  migrations/          # SQL có thứ tự
  seed.sql             # idempotent, đánh dấu dữ liệu mẫu
  config.toml
tests/
  e2e/                 # Playwright
docs/
  ARCHITECTURE.md  DATABASE.md  SECURITY.md  DEPLOYMENT.md
  IMPORT_FORMAT.md TESTING.md   MVP_STATUS.md
```

- Code thuộc một nghiệp vụ cụ thể đặt trong `features/<feature-name>/`.
- Component dùng chung nhiều feature đặt trong `components/`.
- Hook dùng chung đặt trong `hooks/`.
- Logic gọi API đặt trong `services/` hoặc `services/` riêng của feature (`features/<x>/services/`).
- Type dùng chung đặt trong `types/`; type chỉ thuộc một feature đặt cạnh feature đó.
- Mỗi feature có public entry point (`index.ts`); module khác chỉ import qua entry này.
- Không tạo file hoặc thư mục mới nếu logic đã có vị trí phù hợp.
- Không tạo một file khổng lồ chứa toàn bộ ứng dụng. Tách scoring, state transition, validation khỏi component UI.

---

## Ranh giới tin cậy (bắt buộc cho mọi feature)

- UI **không** tự tính hay tự ghi kết quả chính thức.
- Hành động nhạy cảm đi qua RPC/API đã xác thực. Server/database kiểm tra quyền, membership, trạng thái phòng, deadline câu hỏi, tính hợp lệ của câu trả lời.
- **Không** gửi đáp án đúng hoặc scoring metadata nhạy cảm về client trước khi được phép.
- **Không** tin `user_id`, `role`, `score`, `is_correct`, `started_at`, `deadline`, thời gian do client gửi nếu có thể lấy từ auth/session/database.
- Deadline chính thức dùng **server/database time** (UTC, `timestamptz`).
- Thao tác quan trọng phải an toàn khi retry: unique constraint, transaction, idempotency key.
- Dùng Supabase generated types; không dùng `any` để né lỗi.
- `SUPABASE_SERVICE_ROLE_KEY` chỉ server-side, **không** có prefix `VITE_`.
- Bật RLS trên tất cả bảng ứng dụng; viết policy từng bảng, có comment giải thích; test các kịch bản user A / user B / editor / admin.

---

## Quy ước

- Không dùng `any` — luôn TypeScript chặt.
- Ưu tiên `unknown` khi chưa biết kiểu dữ liệu và phải narrowing trước khi sử dụng.
- Component export dạng named export hoặc default, ghi rõ và nhất quán với convention của file/module (mặc định của dự án: **named export**; default export chỉ cho page lazy-loaded).
- Props phải có type/interface rõ ràng.
- Không dùng `React.FC` nếu không có lý do cụ thể.
- Event handler phải có type chính xác, không dùng `Function`.
- Error nghiệp vụ/API dùng `AppError`; không `console.error`. Báo lỗi qua `reportError()` trong `lib/errors/`.
- Không nuốt lỗi bằng `catch {}` nếu không có xử lý rõ ràng.
- Không dùng magic number/string nếu có thể đặt thành constant có tên.
- Tên biến, function, component mô tả đúng ý nghĩa; tránh tên chung chung như `data`, `item`, `handle`, `doSomething` khi có thể đặt tên cụ thể hơn.
- Commit theo Conventional Commits:
    - `feat(tickets): add remove item`
    - `fix(auth): handle expired session`
    - `refactor(users): extract user table`
    - `test(tickets): cover remove item`
    - Không dùng message mơ hồ như `fix stuff`, `update`, `changes`.

## React

- Component tập trung vào render và interaction; đưa business logic phức tạp ra hook/service.
- Không lạm dụng `useEffect`. Ưu tiên derived state, event handler hoặc TanStack Query.
- Không dùng `useEffect` để đồng bộ state có thể tính trực tiếp từ props/state khác.
- Không lưu vào state dữ liệu có thể derive trực tiếp.
- Không mutate props, state hoặc object từ bên ngoài.
- Với list, `key` ổn định và duy nhất; không dùng array index nếu item có identity riêng.
- Tránh component quá lớn; khi có nhiều responsibility hoặc khó đọc thì tách thành component/hook nhỏ.
- Không tạo abstraction chỉ để "cho đẹp". Chỉ tách khi có boundary hoặc logic thực sự tái sử dụng.
- Subscription realtime (`useEffect` hợp lệ) phải cleanup đầy đủ khi unmount/đổi phòng.

## Data fetching

- Dùng TanStack Query cho server state.
- Không dùng Zustand thay TanStack Query cho dữ liệu lấy từ API.
- Không tự quản lý `loading/error/data` bằng nhiều `useState` nếu là server state.
- Query key ổn định và chứa đầy đủ tham số ảnh hưởng đến dữ liệu. Không đưa thông tin nhạy cảm vào query key.
- Mutation phải invalidate/update đúng query liên quan sau khi thành công.
- Không gọi API/Supabase trực tiếp trong component; đi qua service + query/mutation hook.
- API client/service nằm ngoài UI layer.
- Không hardcode API URL — lấy từ `.env` (`VITE_SUPABASE_URL`, `VITE_APP_URL`).
- Không expose secret vào frontend; chỉ dùng biến public theo convention Vite (`VITE_`).
- Khi thêm endpoint/RPC mới, kiểm tra response/error shape thay vì giả định backend luôn trả đúng.

## State management

- Zustand chỉ dùng cho client state hoặc state xuyên nhiều component khi thực sự cần (ví dụ: trạng thái kết nối realtime, bản nháp đáp án chưa gửi, UI preference).
- Ưu tiên local state cho state chỉ phục vụ một component.
- Không đưa mọi state vào Zustand.
- Store không chứa logic gọi API nếu thuộc server state.
- Selector Zustand đủ hẹp để tránh re-render không cần thiết.
- Không mutate state trực tiếp.

## API và Error handling

- API layer chuẩn hóa lỗi về `AppError` (có `code` ổn định, `messageKey` i18n, `cause`).
- UI không phụ thuộc cấu trúc response thô của Supabase/HTTP client.
- Không kiểm tra lỗi bằng string message; dùng `code`/type ổn định (map từ Postgres error code / mã lỗi RPC tự định nghĩa).
- Không hiển thị stack trace, SQL error, thông tin nội bộ cho user.
- Error message cho user thân thiện, có ngữ cảnh, lấy từ i18n.
- Lỗi cần bubble lên error boundary hoặc mutation/query handler thì phải `throw`, không âm thầm `return null`.
- Không `console.log()` trong production code.
- Retry tự động **chỉ** cho thao tác idempotent. Không auto-retry submit answer nếu chưa có idempotency.

## Forms và validation

- Validation ở boundary phù hợp, không chỉ dựa vào UI. Validate cả client lẫn server/database.
- Không tin dữ liệu từ input hoặc API là đúng kiểu chỉ vì TypeScript đã khai báo type; TypeScript không thay thế runtime validation.
- Payload quan trọng: parse response bằng Zod ở API boundary.
- Disable submit khi đang submit nếu submit lặp có thể gây side effect.
- Hiển thị validation error gần field tương ứng.
- Không reset form ngoài ý muốn sau mutation.
- Redirect sau login phải an toàn, không open redirect.

## UI và accessibility

- Ưu tiên component shadcn/ui có sẵn trước khi tự tạo.
- Semantic HTML. Button dùng `<button>`, điều hướng dùng `<a>`/router link.
- Form control có label hoặc accessible name.
- Không dùng màu làm cách duy nhất truyền tải trạng thái.
- Loading, empty, error state xử lý rõ ràng.
- Modal/dialog hỗ trợ keyboard và focus management.
- Không disable control chỉ để che lỗi logic.
- Kiểm tra responsive ở mobile và desktop.
- Không dùng emoji làm icon giao diện chính; dùng Lucide.

## Tailwind CSS

- Ưu tiên utility class và design token có sẵn (xem `UI&UX.md`).
- Không lặp chuỗi class dài; dùng component hoặc `cva`.
- Không dùng inline style nếu Tailwind/CSS đáp ứng được.
- Không thêm màu, spacing, breakpoint tùy ý nếu đã có token.
- Class động: không ghép string khiến Tailwind không detect; dùng map đầy đủ hoặc utility như `cn()`.

## Import

- Không import bằng `../../../`. Dùng alias:

```ts
import { Button } from '@/components/ui/button';
```

- Giữ dependency direction hợp lý: UI không tạo circular dependency với feature/service.
- Không import từ file nội bộ sâu của module đã có public entry point.
- Xóa unused import và dead code.

## Naming

- Component: `PascalCase`. Hook: `useSomething`. Function/variable: `camelCase`.
- Constant cấp module: `UPPER_SNAKE_CASE` khi thực sự là constant.
- Type/interface: `PascalCase`.
- Boolean: prefix `is`, `has`, `can`, `should`.
- Query hook: `useSomethingQuery`. Mutation hook: `useSomethingMutation`.
- File component phản ánh tên component. Không trộn nhiều convention đặt tên file.

## Cấm

- Redux Toolkit.
- Hardcode API URL.
- Import từ `../../../`.
- `console.log()` trong production.
- `any`.
- `@ts-ignore`, `@ts-nocheck`. `@ts-expect-error` chỉ khi có comment lý do và không có cách type-safe hơn.
- Commit secret, token, API key, `.env` chứa secret.
- Duplicate API client hoặc auth logic ở nhiều nơi.
- Copy-paste business logic giữa các feature khi có thể tái sử dụng bằng abstraction rõ ràng.
- Ghi trực tiếp từ client vào bảng kết quả chính thức, answers, XP ledger, match score, role.

## Testing

- Test behavior, không test implementation detail khi không cần.
- Unit test cho business logic thuần và utility quan trọng.
- Component test cho interaction quan trọng.
- Test loading, success, empty, error state cho UI có server state.
- Test mutation quan trọng (tạo/sửa/xóa).
- Không giảm hoặc xóa test chỉ để CI pass.
- Sửa bug → ưu tiên thêm regression test.
- **Không báo pass cho test chưa chạy.** Nếu thiếu Supabase test instance, nêu rõ phần nào chưa chạy.
- Chi tiết danh mục test bắt buộc: xem `docs/TESTING.md` và mục Testing trong `VIOLYMPUS_FRONTEND.md` / `VIOLYMPUS_ADMIN.md`.

## Performance

- Không tối ưu sớm nếu chưa có vấn đề thực tế.
- Tránh re-render không cần thiết trước khi dùng `memo`, `useMemo`, `useCallback`.
- Không fetch dữ liệu không cần thiết; query có pagination, không fetch toàn bộ.
- List lớn: pagination hoặc virtualization.
- Không dùng memoization để che state architecture không hợp lý.
- Image có kích thước/strategy phù hợp; lazy-load route nặng (admin, import parser).

## Security

- Không `dangerouslySetInnerHTML` với user input nếu chưa sanitize.
- Không lưu access token/secret ở nơi không phù hợp; không ghi token/mật khẩu vào log.
- Không đưa thông tin nhạy cảm vào URL, query key, log, error message.
- Không tin dữ liệu từ client; authorization thực tế do backend (RLS/RPC) đảm bảo, không chỉ ẩn nút.
- Security headers phù hợp trên Vercel (CSP, X-Content-Type-Options, Referrer-Policy, frame-ancestors).
- Kiểm tra dependency vulnerabilities (`pnpm audit`) khi môi trường cho phép.
- Trang Terms/Privacy chỉ là placeholder được đánh dấu cần hoàn thiện pháp lý; không tuyên bố tuân thủ pháp luật nếu chưa được review.

## Git

- Mỗi commit có một mục đích rõ ràng; không trộn refactor lớn với feature/bugfix.
- Không commit generated files hoặc build artifacts nếu repo không yêu cầu (ngoại lệ: Supabase generated types nếu được quy định trong `docs/DATABASE.md`).
- Trước khi commit chạy lint/typecheck/test phù hợp.
- Không sửa lịch sử Git của người khác. Không force push trừ khi được yêu cầu rõ.

## Khi sửa code

Trước khi thay đổi:

1. Đọc code liên quan và xác định dependency.
2. Tìm implementation hiện tại trước khi tạo abstraction mới.
3. Kiểm tra type, API contract và cách project xử lý error.
4. Xác định phạm vi thay đổi nhỏ nhất.
5. Không tự ý refactor code không liên quan.

Sau khi thay đổi:

1. Chạy TypeScript check.
2. Chạy lint.
3. Chạy test liên quan.
4. Kiểm tra import và dead code.
5. Kiểm tra loading/error/empty state nếu thay đổi UI hoặc API.
6. Review diff để chắc chắn không có thay đổi ngoài phạm vi.

## Nguyên tắc ưu tiên

Khi các yêu cầu mâu thuẫn nhau, ưu tiên theo thứ tự:

1. Correctness và security.
2. Type safety.
3. Existing project conventions.
4. Simplicity và maintainability.
5. Performance.
6. Developer convenience.

Không thêm abstraction, dependency hoặc pattern mới chỉ vì "có thể hữu ích". Mọi thay đổi phải có lý do rõ ràng và phù hợp với kiến trúc hiện tại.

---

## Môi trường (`.env.example`)

Chỉ gồm biến thực sự được code sử dụng.

|Biến|Loại|Ghi chú|
|---|---|---|
|`VITE_SUPABASE_URL`|Public|URL project Supabase|
|`VITE_SUPABASE_ANON_KEY`|Public|Anon/publishable key — **không** phải service-role|
|`VITE_APP_URL`|Public|Base URL ứng dụng (redirect auth)|
|`SUPABASE_SERVICE_ROLE_KEY`|**Secret**|Chỉ server-side, chỉ thêm khi có endpoint server thực sự|
|`SUPABASE_DB_URL`|**Secret**|Chỉ dùng cho tooling/CI|

Validate env bằng Zod khi khởi động; thiếu biến → hiển thị lỗi cấu hình rõ ràng, không crash trắng màn hình.

Supabase Auth: cấu hình Site URL và redirect URLs cho local + production, không dùng wildcard rộng; không giả định email provider đã sẵn sàng — ghi rõ các bước bật trong `docs/DEPLOYMENT.md`.

## Lệnh chuẩn

```
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test            # Vitest
pnpm test:e2e        # Playwright
pnpm build
```

---

## Trình tự thực hiện (các phase)

Sau mỗi phase chạy kiểm tra liên quan và giữ repo ở trạng thái build được. Nếu bị giới hạn thời gian/context, ưu tiên **một vertical slice hoàn chỉnh** rồi tiếp phase sau. Không tạo hàng loạt màn hình rỗng để tạo cảm giác hoàn tất.

|Phase|Nội dung|File tham chiếu|
|---|---|---|
|0 — Audit & plan|Kiểm tra repo; liệt kê giả định/rủi ro (chỉ hỏi khi thực sự bị chặn); tạo `docs/ARCHITECTURE.md`, `docs/MVP_STATUS.md`; viết state machine realtime + scoring rules **trước khi code**|FRONTEND §Realtime|
|1 — Foundation|Khởi tạo stack, router, layout, design tokens, i18n, Supabase client, env validation, error boundary, lint/typecheck/test; landing + auth + navigation responsive|FRONTEND, UI&UX|
|2 — Database & security|Migrations, RLS, RPC, indexes, triggers, seed, generated types, test quyền + answer-key privacy, docs DATABASE/SECURITY|FRONTEND §Database|
|3 — Learning & solo exam|Subjects/topics/lessons/questions/exams; Admin CRUD cơ bản; practice, timer, submit, scoring, result, history; test|FRONTEND, ADMIN|
|4 — Realtime arena|Room lifecycle, lobby, match state machine, submit server-validated, broadcast/reconnect/resync, concurrency/timeout test, E2E 2 người|FRONTEND §Arena|
|5 — Import, leaderboard, polish|CSV/XLSX import, audit logs, leaderboard, profile/XP, responsive/a11y/error-state review|ADMIN, FRONTEND|
|6 — Release readiness|Lint, typecheck, unit, build, E2E; kiểm tra mọi route/CTA; rà soát RLS, secret, answer leakage; cập nhật docs, env, deploy, MVP status|Tất cả|

---

## Definition of Done (chỉ tuyên bố MVP hoàn thành khi…)

- Cài dependencies và production build thành công.
- TypeScript strict/typecheck không còn lỗi chưa giải quyết.
- Unit tests scoring, state machine, import chạy pass.
- Migrations chạy được trên Supabase project mới theo tài liệu.
- RLS bảo vệ dữ liệu; không thể lấy đáp án đúng trước thời điểm cho phép.
- Auth và role guards hoạt động.
- Một người tạo room, người khác tham gia, host bắt đầu, cả hai gửi đáp án, trạng thái đồng bộ và kết quả được lưu.
- Refresh/reconnect không làm client tự tạo trạng thái sai.
- Admin tạo được câu hỏi và import file, xem lỗi dữ liệu.
- Việt/Anh hoạt động trên mọi luồng MVP.
- Không còn nút chính giả hoặc trang quan trọng chỉ là placeholder.
- `.env.example`, seed, migrations, test commands, deployment docs đầy đủ.
- `docs/MVP_STATUS.md` phân biệt: **Implemented & verified / Implemented but not verified / Deferred**.

## Báo cáo bàn giao

Khi xong, trả báo cáo ngắn gọn nhưng cụ thể:

1. Tính năng đã triển khai.
2. Cấu trúc thư mục chính.
3. Migrations và RPC quan trọng.
4. Quyết định RLS/security quan trọng.
5. Cách chạy local từ đầu.
6. Lệnh test/lint/typecheck/build và **kết quả thực tế**.
7. Biến môi trường cần cấu hình.
8. Các bước deploy Vercel/Supabase.
9. Tính năng đã hoãn.
10. Giới hạn/rủi ro còn lại.
11. Mục chưa xác minh do thiếu credentials/môi trường.

Không nói "mọi thứ hoàn tất" nếu chưa chạy được. Không tuyên bố deploy thành công khi chưa thực sự deploy.

## Hoãn sang giai đoạn sau (không giả lập trong MVP)

AI tutor/AI-generated questions/adaptive learning; thanh toán/subscription; mobile native; chat/social feed/follow; voice/video; giải đấu bracket phức tạp, anti-cheat nâng cao, proctoring/webcam; daily quests, shop, vật phẩm; analytics/BI nâng cao; tích hợp LMS/SSO; thông báo đa kênh; multi-tenant trường học.

Không tạo bảng/UI rỗng cho các mục này. Chỉ để extension point khi có giá trị rõ ràng.