# Deployment — Violympus

## Prerequisites

- Node.js ≥ 20
- npm
- Supabase project (free tier sufficient for MVP)
- Vercel account (optional, for production deploy)

## Local Development Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd violympus
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Source | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API | Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | `anon` / `public` key |
| `VITE_APP_URL` | — | `http://localhost:5173` for local |

### 3. Supabase Setup

#### Run Migrations

Option A: Supabase CLI (recommended)
```bash
npx supabase db push
```

Option B: SQL Editor
- Go to Supabase Dashboard → SQL Editor
- Run each file in `supabase/migrations/` in order

#### Seed Data

```bash
npx supabase db seed
```
Or paste `supabase/seed.sql` into SQL Editor.

### 4. Supabase Auth Configuration

1. **Site URL**: Set to `http://localhost:5173` (local) or production URL
2. **Redirect URLs**: Add:
   - `http://localhost:5173/auth/callback`
   - `https://your-domain.com/auth/callback` (production)
3. **Email provider**: Enable email/password sign-ups
4. **Email templates**: Customize confirmation and reset emails (optional)
5. Do NOT use wildcard redirect URLs in production

### 5. Supabase Realtime

1. Go to Database → Replication
2. Enable Realtime for tables: `arena_rooms`, `arena_participants`, `arena_matches`, `arena_match_questions`, `arena_answers`
3. Verify in Dashboard → Realtime → Inspector

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`.

## Bootstrap First Admin

After initial setup, create the first admin account:

1. Register a normal account through the UI
2. Run this SQL in Supabase SQL Editor (**not** in migrations/seed):

```sql
INSERT INTO public.user_roles (user_id, role, granted_by)
SELECT id, 'admin', id
FROM auth.users
WHERE email = '<your-email-here>'
ON CONFLICT (user_id, role) DO NOTHING;
```

3. Log out and log back in to pick up the new role

## Production Deployment (Vercel)

### 1. Connect Repository

- Import project in Vercel Dashboard
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### 2. Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_APP_URL` | `https://your-domain.com` |

### 3. Supabase Production Config

- Update Site URL to production domain
- Update Redirect URLs
- Enable RLS on ALL tables (should already be in migrations)
- Review rate limits

### 4. Verify

- [ ] Auth flow works (register, login, logout)
- [ ] Data loads from Supabase
- [ ] Realtime works (arena)
- [ ] Security headers present (check with browser DevTools)

## Updating Database Schema

1. Create new migration file in `supabase/migrations/`
2. Run migration on Supabase
3. Regenerate types:
   ```bash
   npx supabase gen types typescript --project-id <project-id> > src/lib/supabase/database.types.ts
   ```
4. Commit both migration and generated types

## Monitoring

- Supabase Dashboard: database metrics, auth logs, API logs
- Vercel Dashboard: deployment logs, function logs
- Browser: check for console errors, network failures
