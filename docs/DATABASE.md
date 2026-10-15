# Database — Violympus

## Overview

PostgreSQL via Supabase. All timestamps use `timestamptz` in UTC. Schema managed through ordered migrations in `supabase/migrations/`.

## Naming Conventions

- Tables: `snake_case`, plural (`profiles`, `arena_rooms`)
- Columns: `snake_case`
- Enums: `snake_case` type name, `snake_case` values
- Indexes: `idx_{table}_{columns}`
- Constraints: `{table}_{type}_{columns}` (e.g., `profiles_pkey_id`, `arena_rooms_uq_room_code`)
- Functions: `snake_case` verb phrases (`start_attempt`, `has_role`)
- i18n columns: `*_i18n` suffix, JSONB `{ "vi": "...", "en": "..." }`

## ERD Summary

```
auth.users
  └── profiles (1:1, trigger-created)
  └── user_roles (1:N)

subjects
  └── topics (1:N)
      └── lessons (1:N)
  └── questions (1:N, via subject_id)
      ├── question_options (1:N)
      ├── question_answers (1:N, server-only)
      └── question_tags (1:N)

exams
  └── exam_questions (1:N, references questions)
  └── attempts (1:N)
      └── attempt_answers (1:N)

arena_rooms
  ├── arena_participants (1:N)
  └── arena_matches (1:N)
      ├── arena_match_questions (1:N)
      └── arena_answers (1:N)

xp_transactions (append-only)
seasons
badges
  └── user_badges (N:M)

content_import_jobs
  └── content_import_errors (1:N)
audit_logs (append-only)
```

## Enums

| Enum | Values |
|---|---|
| `user_role` | `user`, `content_editor`, `admin` |
| `content_status` | `draft`, `published`, `archived` |
| `question_type` | `single_choice`, `true_false`, `short_text`, `multi_select` |
| `difficulty_level` | `easy`, `medium`, `hard` |
| `exam_mode` | `practice`, `timed` |
| `attempt_status` | `in_progress`, `submitted`, `expired`, `cancelled` |
| `room_status` | `waiting`, `starting`, `in_progress`, `finished`, `cancelled` |
| `match_status` | `pending`, `active`, `question_transition`, `finished`, `cancelled` |
| `participant_status` | `joined`, `ready`, `connected`, `disconnected`, `forfeited`, `finished` |
| `room_visibility` | `public`, `private` |
| `import_status` | `validated`, `importing`, `completed`, `failed`, `cancelled` |
| `duplicate_policy` | `reject`, `skip`, `update_draft` |

## Triggers

### `handle_new_user` (on `auth.users` INSERT)

Creates a `profiles` row with:
- `id` = `auth.users.id`
- `username` = derived from email prefix, lowercased, sanitized
- `display_name` = email prefix
- `locale` = `'vi'`
- `is_public` = `true`

On username conflict: appends random 4-digit suffix, retries up to 5 times.

### `update_updated_at` (generic)

Applied to: `profiles`, `subjects`, `topics`, `lessons`, `questions`, `exams`, `arena_rooms`, `arena_matches`.

Sets `updated_at = now()` on UPDATE.

### `prevent_xp_modification`

On `xp_transactions`: blocks UPDATE and DELETE operations. Append-only enforcement.

### `prevent_audit_modification`

On `audit_logs`: blocks UPDATE and DELETE. Append-only enforcement.

## Deletion / Anonymization Policy

### User Deletion

When a user requests account deletion:

1. `profiles`: set `username` to `deleted_<hash>`, `display_name` to `'Deleted User'`, `avatar_url` to NULL, `bio` to NULL, `is_public` to FALSE
2. `user_roles`: delete all roles
3. `attempts` / `attempt_answers`: retain with anonymized `user_id` reference (profile already anonymized)
4. `arena_participants` / `arena_answers`: retain for match history integrity
5. `xp_transactions`: retain (append-only, profile anonymized)
6. `auth.users`: delete via Supabase Admin API (server-side only)

Rationale: Exam and match results are part of the platform's data integrity. Anonymizing the profile suffices for privacy.

### Content Deletion

- Subjects/topics with existing exams or attempts: **archive** instead of hard delete
- Questions referenced by exam_questions or attempt_answers: **archive** instead of hard delete
- Draft content with no references: hard delete allowed

## Generated Types

TypeScript types generated from schema into `src/lib/supabase/database.types.ts`.

Update after each migration:
```bash
npx supabase gen types typescript --project-id <project-id> > src/lib/supabase/database.types.ts
```

## i18n Column Format

```sql
name_i18n JSONB NOT NULL DEFAULT '{}',
CONSTRAINT subjects_name_i18n_check CHECK (
  name_i18n ? 'vi' OR name_i18n ? 'en'
)
```

At least one language must be present. Application code handles fallback display.
