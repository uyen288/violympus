# Testing — Violympus

## Stack

| Layer | Tool | Location |
|---|---|---|
| Unit | Vitest | `src/**/*.test.ts` |
| Component | Vitest + React Testing Library | `src/**/*.test.tsx` |
| Integration | Vitest (requires Supabase) | `src/**/*.integration.test.ts` |
| E2E | Playwright | `tests/e2e/` |

## Commands

```bash
npm run test          # Vitest (unit + component)
npm run test:e2e      # Playwright
```

## Unit Test Requirements

### Scoring (`features/arena/state/scoring.ts`, `features/exams/`)
- Each question type: correct, incorrect, partial (multi_select)
- Edge cases: empty answer, null, malformed payload
- Tie-break ordering with fixtures

### Short Text Normalization
- Trim whitespace
- Unicode NFC normalization
- Case folding (toLowerCase)
- Collapse multiple spaces
- Vietnamese diacritics preserved ("cá" ≠ "ca")
- `case_sensitive` and `exact` flags

### State Machine (`features/arena/state/arenaStateMachine.ts`)
- All valid transitions
- All invalid transitions (should return false)
- `canTransition` is a pure function

### XP Logic
- Idempotency key generation
- Daily cap enforcement logic
- Anti-farm rules (too-fast completion detection)

### i18n
- All keys present in both `vi` and `en`
- Fallback chain works correctly

## Component Test Requirements

### Auth Forms
- Validation errors display correctly
- Submit button disabled during submission
- Error messages from API displayed

### Lobby
- Player list renders correctly
- Host badge shown
- Start button disabled state with reason

### QuestionStage
- Loading, error, empty, success states
- Option selection
- Timer display
- Answer submission

### Timer
- Displays remaining time
- Warning state at threshold
- Expired state

### ResultView
- Score summary
- Per-question breakdown
- Explanation display

### LanguageSwitcher
- Toggles between VI and EN
- Persists selection

## Integration Tests (Require Supabase)

- Auth → profile creation trigger
- RLS: user A cannot read user B's attempts
- RLS: no one can read `question_answers` via client
- Submit answer: valid, invalid, duplicate, after deadline
- Attempt expiry: lazy-expire on access after deadline
- Arena: create room, join, start, advance, finish
- Room capacity enforcement
- Import: job creation, error recording, audit logging
- Role assignment: admin only, cannot remove last admin

**If no Supabase test instance available:** mark as "NOT VERIFIED" in test output and MVP_STATUS.md.

## E2E Scenarios (Playwright)

1. Landing → Register → Login → Dashboard
2. Switch language VI ↔ EN, verify UI updates
3. Start exam → answer questions → submit → view results
4. Two browser contexts: create room → join → start match → both answer → synced results
5. Refresh during match → resync correctly
6. Non-admin user → navigate to /admin → see 403

## Test Fixtures

- Shared fixtures in `src/test/fixtures/`
- Scoring fixtures used by both TypeScript tests and SQL tests
- Test users created via env variables or setup script, never production credentials
