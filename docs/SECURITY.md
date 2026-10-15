# Security — Violympus

## Threat Model

### Assets to Protect

1. **Answer keys** — Must not be exposed to clients before permitted
2. **User credentials** — Passwords, tokens, sessions
3. **Scores and rankings** — Must be server-authoritative
4. **User PII** — Email, profile data
5. **Admin capabilities** — Role escalation prevention

### Threat Actors

| Actor | Capability | Motivation |
|---|---|---|
| Curious user | Browser DevTools, network inspection | See answers early, inflate score |
| Malicious user | API manipulation, automated requests | Cheat, farm XP, disrupt matches |
| Rogue editor | Valid staff credentials | Unauthorized publish, data leak |

### Attack Vectors & Mitigations

| Vector | Mitigation |
|---|---|
| Read answer keys from API | `question_answers` has NO RLS SELECT for authenticated/anon; only server-side RPC reads |
| Submit fake scores | Scores computed server-side in RPC transactions; no client write to result tables |
| Manipulate timer | Server `deadline_at` is source of truth; RPC rejects answers after deadline |
| Farm XP | Idempotency key prevents double-grant; daily caps; anti-farm rules (too-fast completion) |
| Role escalation | `user_roles` has no client INSERT/UPDATE; role checked via `has_role()` SECURITY DEFINER |
| Cross-user data access | RLS policies scope reads to owner or public data |
| CSRF | Supabase Auth uses httpOnly cookies/tokens; SameSite policy |
| XSS | Markdown sanitized before render; no `dangerouslySetInnerHTML` with raw user input |
| Open redirect | Login redirect validates path starts with `/`, no `//` or scheme |
| Secret leakage | `SUPABASE_SERVICE_ROLE_KEY` never has `VITE_` prefix; `.env.local` in `.gitignore` |

## Trust Boundaries

### Client (Untrusted)

The client NEVER:
- Computes or writes official scores, XP, or rankings
- Receives answer keys before the question is answered/closed
- Determines its own role or permissions
- Sets server timestamps (deadlines, `started_at`, `received_at`)
- Broadcasts official match state to other clients

### Server (Trusted)

All RPCs:
- Verify `auth.uid()` is not null
- Check role/membership/ownership as appropriate
- Validate input against Zod/CHECK constraints
- Use `now()` for timestamps
- Run scoring in transactions
- Return structured error codes, not raw SQL errors

## RLS Policy Summary

| Table | anon | authenticated (self) | authenticated (others) | staff | admin |
|---|---|---|---|---|---|
| `profiles` | — | R/W (own, limited cols) | R (public only) | R | R/W |
| `user_roles` | — | R (own) | — | — | via RPC |
| `subjects/topics/lessons` | R (published) | R (published) | R (published) | R (all) | R/W |
| `questions/question_options` | R (published) | R (published) | R (published) | R (all) | R/W |
| `question_answers` | — | — | — | via RPC | via RPC |
| `attempts/attempt_answers` | — | R (own) | — | — | R |
| `arena_rooms/participants` | — | R (participant) | — | — | R |
| `arena_answers` | — | R (own) | — | — | R |
| `xp_transactions` | — | R (own) | — | — | R |
| `audit_logs` | — | — | — | — | R |
| `content_import_*` | — | — | — | R (own jobs) | R |

R = SELECT, W = INSERT/UPDATE (via RPC where noted)

## Helper Functions

```sql
-- SECURITY DEFINER, search_path = public, pg_temp
CREATE FUNCTION has_role(required_role user_role) RETURNS boolean
-- Checks user_roles for auth.uid() having the specified role

CREATE FUNCTION is_staff() RETURNS boolean
-- Returns has_role('content_editor') OR has_role('admin')

CREATE FUNCTION is_room_participant(room uuid) RETURNS boolean
-- Checks arena_participants for auth.uid() in the specified room
```

## Anti-Cheat: Capabilities & Limitations

### What We Do

- Server-side answer validation and scoring
- Server timestamps for deadlines
- Randomizable question order (per exam/match settings)
- Rate limiting on submit/join/create RPCs
- Idempotent answer submission (unique constraint)
- Answer keys never sent to client before permitted

### What We Cannot Prevent

- User looking up answers on a second device/tab
- User collaborating with others in person
- Screen sharing or remote assistance
- Automated answer submission (mitigated by rate limiting and time limits)

We do NOT claim "cheat-proof". The system reduces casual cheating through time pressure, server-side validation, and information control. Advanced proctoring (webcam, screen lock) is deferred.

## Security Headers (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

## Content Security Policy

CSP configured to allow Supabase API domain and self. Details in `vercel.json`.

## Terms & Privacy

Placeholder pages marked with "Needs legal review" banner. Do NOT claim legal compliance without actual legal review.
