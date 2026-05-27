# Questionnaire v1.2 — Implementation Plan

**Objective:** Align the existing assessment questionnaire with v1.2 requirements:
1. Remove Calendly — replace with "We'll be in touch" copy
2. Remove n8n/CRM — replace with Brevo direct integration
3. Two-stage questionnaire — Stage 1 directional score + Stage 2 deep dive
4. Reset button on every step

**Branch strategy:** Each PR is a branch off `main`, merged in dependency order.

---

## Gap Analysis

### Current codebase (Step 0–7)

| Step | Component | Content |
|---|---|---|
| 0 | `Step0Language` | Language picker |
| 1 | `Step1Context` | companySize + sector + painPoint (3 questions) |
| 2 | `Step2Process` | Process 1 assessment (D1–D8 + hours) |
| 3 | `Step3ScoreTeaser` | Process 1 score reveal (separate page) |
| 4 | `Step4ExtraProcesses` | Add Process 2 & 3 |
| 5 | `Step5DbModule` | DB module (unchanged) |
| 6 | `Step6EmailGate` | Email field |
| 7 | `Step7ThankYou` | Thank you + Calendly CTA + PDF download |

### Required (v1.2) step mapping

| Step | Component | Content |
|---|---|---|
| 0 | `Step0Language` | Language picker (unchanged) |
| 1 | `Step1Context` | **Q1.0 company name** + companySize + sector + painPoint + **Q1.4 C1** + **Q1.5 C2** |
| 2 | `Step2DirectionalScore` | **NEW** — animated score, benchmark, disclaimer, dual CTA + optional Stage 1 email |
| 3 | `Step3Process` (was Step2) | Process 1 assessment, add **sector dropdown** for process name |
| 4 | `Step4ProcessScore` (replaces Step3+Step4) | **Inline** score reveal after Process 1 + add Process 2/3 expansion |
| 5 | `Step5DbModule` | DB module (unchanged) |
| 6 | `Step6EmailGate` | Email field, pre-fill if Stage 1 email given |
| 7 | `Step7ThankYou` | Remove Calendly → "We'll be in touch within 2 working days" |

### Backend changes

| Route | Current | Required |
|---|---|---|
| `POST /api/assessment/stage1` | Missing | New — Brevo teaser email + contact upsert |
| `POST /api/assessment/submit` | Forwards to N8N_WEBHOOK_URL | Replace with Brevo direct (email + PDF + contact + lead alerts) |

---

## PR 1 — Quick Wins: Calendly Removal + Global Reset Button

**Branch:** `feat/questionnaire-pr1-quick-wins`  
**Dependencies:** None  
**Risk:** Low — UI copy changes + additive UI element

### Context

Step 7 currently renders a "Book a Free 30-Minute Discovery Call" Calendly button. Spec requires replacing it with a "We'll be in touch within 2 working days" message. Separately, a "Start over" reset button must appear on every step (currently only Step 7 has one).

### Tasks

1. **`src/lib/assessment/translations.ts`**
   - Remove `calendarCta` and `calendarSubtext` keys from both `en` and `lt` step7 sections
   - Add `contactCta` (EN: `"We'll be in touch within 2 working days."`, LT: `"Susisieksime per 24 valandas."`)
   - Add `contactSubtext` (EN: `"Our team will review your results and reach out by email or phone to discuss next steps."`, LT: `"Mūsų komanda peržiūrės jūsų rezultatus ir susisieks el. paštu arba telefonu aptarti tolesnių žingsnių."`)
   - Add `contactFallback` (EN: `"Can't wait? Email us at info@diteka.lt"`, LT: `"Negalite laukti? Rašykite mums: info@diteka.lt"`)
   - Add `resetConfirm` (EN: `"This will clear all your answers. Are you sure?"`, LT: `"Tai ištrins visus jūsų atsakymus. Ar tikrai?"`)
   - Add `resetYes` / `resetCancel` strings (EN: `"Yes, start over"` / `"Cancel"`, LT: `"Taip, pradėti iš naujo"` / `"Atšaukti"`)
   - Add `resetLink` (EN: `"Start over"`, LT: `"Pradėti iš naujo"`)

2. **`src/components/questionnaire/steps/Step7ThankYou.tsx`**
   - Remove the Calendly `<a>` button and `calendarSubtext` paragraph
   - Replace with: bold headline from `t.step7.contactCta`, subtext from `t.step7.contactSubtext`, smaller contact fallback from `t.step7.contactFallback` (link to `mailto:info@diteka.lt`)
   - Remove the existing "Start over" button (it moves to `AssessmentQuestionnaire.tsx`)

3. **`src/components/questionnaire/AssessmentQuestionnaire.tsx`**
   - Add a `ResetButton` inline component (within this file) that:
     - On Step 7: renders a plain text link, dispatches `RESET` on click with no confirmation
     - On Steps 1–6: renders a plain text link; on click, shows an inline confirmation (`<div>` with "Are you sure?" + Yes/Cancel buttons); on Yes, dispatches `RESET`
   - Position: below the `LanguageToggle`, right-aligned, `text-xs text-[#605A57]`
   - Confirmation state is local (`useState<boolean>`) inside `ResetButton`
   - After `RESET`, `dispatch({ type: 'SET_STEP', step: 0 })` — the `RESET` action in the reducer already returns `initialFormState` which has `step: 0`, so just dispatching `RESET` is sufficient

### Verification

```bash
pnpm typecheck
pnpm build
# Open /assessment → Step 1 → click "Start over" → confirmation appears → Yes → goes to Step 0
# Go to Step 7 → "Start over" link → no confirmation → goes to Step 0
# Step 7 shows "We'll be in touch" block, no Calendly button
```

### Exit criteria

- No Calendly references in codebase
- "Start over" visible on Steps 1–7
- Confirmation only on Steps 1–6
- `pnpm build` passes

---

## PR 2 — State Foundation + Directional Score Formula

**Branch:** `feat/questionnaire-pr2-state-foundation`  
**Dependencies:** PR 1 merged  
**Risk:** Medium — state shape change; requires updating tests

### Context

Stage 1 introduces two new signal questions (C1/C2) and a directional score formula. The form state needs new fields before any UI can use them. This PR adds all new state fields, actions, and the scoring formula — no visible UI change except that `initialFormState` now includes the new fields.

### Tasks

1. **`src/lib/assessment/types.ts`**
   - Add to `FormState`:
     ```ts
     company_name: string          // Q1.0
     stage: 1 | 2                 // which stage the user is in
     c1: number | null            // Q1.4 answer (1–5)
     c2: number | null            // Q1.5 answer (1–5)
     directional_score: number | null
     stage1_email: string | null  // collected via Stage 1 secondary CTA
     ```
   - Add to `AssessmentAction`:
     ```ts
     | { type: 'SET_COMPANY_NAME'; name: string }
     | { type: 'SET_C1'; value: number }
     | { type: 'SET_C2'; value: number }
     | { type: 'SET_DIRECTIONAL_SCORE'; score: number }
     | { type: 'SET_STAGE1_EMAIL'; email: string }
     | { type: 'SET_STAGE'; stage: 1 | 2 }
     ```

2. **`src/lib/assessment/session.ts`**
   - Update `initialFormState` to include new fields with defaults:
     `company_name: ''`, `stage: 1`, `c1: null`, `c2: null`, `directional_score: null`, `stage1_email: null`
   - Verify `readSession` / `writeSession` handle the new fields (they use `JSON.parse`/`JSON.stringify` so no changes needed unless there is explicit field validation)

3. **`src/hooks/useAssessmentSession.ts`** (reducer)
   - Add cases for all 5 new actions in `assessmentReducer`

4. **`src/lib/assessment/scoring.ts`**
   - Add:
     ```ts
     export function calculateDirectionalScore(c1: number, c2: number): number {
       const raw = (c1 * 0.25) + (c2 * 0.20)
       return Math.round((raw / 2.25) * 100)
     }
     ```
   - Range: 20 (both=1) to 100 (both=5)

5. **`src/lib/assessment/translations.ts`** — add Stage 1 and Step 2 strings
   - Add to `step1` section: `companyName.label`, `companyName.placeholder`, `c1.label`, `c1[1..5]`, `c2.label`, `c2[1..5]`  
     (See requirements §3 Q1.0, Q1.4, Q1.5 for exact text in EN/LT)
   - Add `step2_directional` section (for the new directional score page):  
     `headline` (`~{score}% estimated automation potential` / LT equiv), `benchmark`, `disclaimer`, `primaryCta`, `secondaryCta`, `emailLabel`, `emailSent`, `emailConfirmation`
   - Add `progress.stage1Label`, `progress.stage2Label` for two-segment bar

6. **Tests** — `src/lib/assessment/scoring.test.ts`
   - Add unit tests for `calculateDirectionalScore`: verify 20% at (1,1), 100% at (5,5), midpoint

### Verification

```bash
pnpm typecheck
pnpm test  # scoring.test.ts must pass
```

### Exit criteria

- `FormState` has all 6 new fields
- `calculateDirectionalScore` returns correct values for boundary inputs
- All tests pass

---

## PR 3 — Stage 1: Updated Step 1 Questions

**Branch:** `feat/questionnaire-pr3-stage1-questions`  
**Dependencies:** PR 2 merged  
**Risk:** Medium — visual change to Step 1; adds 3 new questions

### Context

Step 1 must now collect 6 questions: Q1.0 (company name), Q1.1 (size), Q1.2 (sector), Q1.3 (pain point), Q1.4 (C1 proxy), Q1.5 (C2 proxy). Q1.0 must appear first. Q1.4 and Q1.5 are 5-option Likert scales feeding the directional score formula.

Step 1 currently navigates to Step 2 (Process assessment). After this PR it must navigate to Step 2 (Directional Score Reveal, added in PR 4). The navigation target changes here, but the destination step component doesn't exist until PR 4 — that is fine; the routing will land on the correct slot once Step2DirectionalScore is added.

### Tasks

1. **`src/components/questionnaire/steps/Step1Context.tsx`**
   - Add company name text input at the top:
     - `<input type="text">`, max 100 chars, required
     - On change: `dispatch({ type: 'SET_COMPANY_NAME', name: value })`
     - Validation: non-empty before advancing
   - Keep existing companySize, sector, painPoint fieldsets
   - Add C1 question after painPoint (Likert scale, 5 options, use existing `LikertScale` component):
     - `dispatch({ type: 'SET_C1', value })`
   - Add C2 question after C1:
     - `dispatch({ type: 'SET_C2', value })`
   - Update `canAdvance`:
     ```ts
     const canAdvance =
       state.company_name.trim().length > 0 &&
       state.sector !== null &&
       state.companySize !== null &&
       state.painPoint !== null &&
       state.c1 !== null &&
       state.c2 !== null
     ```
   - On next: `dispatch({ type: 'SET_STEP', step: 2 })` (Step 2 = new Directional Score, added in PR 4)

2. **Translations** already added in PR 2. No translation work in this PR.

### Verification

```bash
pnpm typecheck
pnpm build
# Open /assessment → Step 0 → Step 1
# Verify: company name field first, then size/sector/painPoint, then C1/C2 Likert scales
# Verify: "Next" button disabled until all 6 questions answered
# Verify: "Next" navigates to Step 2 (currently Step2Process — that's fine for now, PR 4 inserts the correct step)
```

### Exit criteria

- Step 1 has all 6 questions in correct order
- `canAdvance` requires all 6 to be answered
- No regressions on existing questions

---

## PR 4 — Directional Score Reveal + Stage 2 Restructure

**Branch:** `feat/questionnaire-pr4-stage2-restructure`  
**Dependencies:** PR 3 merged  
**Risk:** High — renames/moves 3 step components, inserts new step, merges two steps; touch `AssessmentQuestionnaire.tsx`

### Context

This is the largest PR. It inserts the new `Step2DirectionalScore` between current Step 1 and the process assessment, renames the existing Step 2/3/4 files, and merges the old Steps 3+4 (score teaser + extra processes) into a single inline `Step4ProcessScore` component.

### File changes overview

| Old | New | Notes |
|---|---|---|
| `Step2Process.tsx` | `Step3Process.tsx` | Rename, update nav: back→2, next→4 |
| `Step3ScoreTeaser.tsx` | (deleted) | Absorbed into Step4ProcessScore |
| `Step4ExtraProcesses.tsx` | (deleted) | Absorbed into Step4ProcessScore |
| (new) | `Step2DirectionalScore.tsx` | New stage 1 reveal |
| (new) | `Step4ProcessScore.tsx` | Inline score reveal + add process 2/3 |

### Tasks

1. **`src/components/questionnaire/steps/Step3Process.tsx`** (was Step2Process)
   - Copy `Step2Process.tsx` content, rename component to `Step3Process`
   - Add sector-specific process name dropdown: a `<select>` + free-text fallback combo
     - Import a `PROCESS_SUGGESTIONS` const (defined in a new file `src/lib/assessment/processSuggestions.ts`) keyed by `SectorKey`
     - On sector change, reset selected process name; on select, populate `process.name`
     - Free-text option ("Other / type your own") opens text input
   - Navigation: back → Step 2, next → Step 4
   - Delete `Step2Process.tsx` after import in orchestrator is updated

2. **`src/lib/assessment/processSuggestions.ts`** (new file)
   - Export `PROCESS_SUGGESTIONS: Record<SectorKey, { en: string; lt: string }[]>`
   - Populate with all sector lists from requirements §3A (manufacturing, logistics, wholesale, services, retail, other)

3. **`src/components/questionnaire/steps/Step2DirectionalScore.tsx`** (new)
   - Compute directional score: `calculateDirectionalScore(state.c1!, state.c2!)`
   - Dispatch `SET_DIRECTIONAL_SCORE` on mount and `SET_STAGE` to 2 when user clicks primary CTA
   - Layout:
     - Animated score circle (reuse `ScoreArc`, use `useCountUp` hook already present)
     - Headline: `~{score}% estimated automation potential` / LT equiv
     - Benchmark line (look up `state.sector` in `SECTOR_BENCHMARKS`, already exported from `scoring.ts`)
     - Disclaimer paragraph (smaller text)
     - **Primary CTA**: full-width button → `dispatch({ type: 'SET_STEP', step: 3 })`
     - **Secondary CTA**: text link that toggles an inline email field; on submit calls `POST /api/assessment/stage1` with payload; shows confirmation message after success; primary CTA remains visible
   - No score band label shown here (spec §2.4)
   - Back button → Step 1

4. **`src/components/questionnaire/steps/Step4ProcessScore.tsx`** (new, replaces Step3+Step4)
   - Compute Process 1 score inline on render
   - If knockout: show knockout message in card
   - If no knockout: show inline score card (no `ScoreArc`, just coloured progress bar with score %)
   - Show incentive banner: "Assess 3 or more processes and receive a free Automation Roadmap"
   - Show "Add Process 2" button (only if `activeProcessCount < 2`); clicking expands Process 2 form inline using the same `ProcessForm` component
   - Show "Add Process 3" button (only if Process 2 complete and `activeProcessCount < 3`)
   - Show micro-score reveal after each additional process (inline card)
   - After Process 3 complete: show aggregate company score
   - Show "Continue →" / "Skip to next step" link
   - Navigation: back → Step 3, continue → Step 5
   - Delete `Step3ScoreTeaser.tsx` and `Step4ExtraProcesses.tsx`

5. **`src/components/questionnaire/ProgressBar.tsx`**
   - Accept `stage: 1 | 2` prop and `stageLabel: string` alongside existing props
   - Render two visual segments: Stage 1 bar (Steps 1–2) + Stage 2 bar (Steps 3–7)
   - Stage 2 segment is grey/muted during Stage 1; fills on Stage 2 entry
   - Show `"Stage 1: Company Snapshot — Step X of 2"` during Stage 1
   - Show `"Stage 2: Process Assessment — Step X of 5"` during Stage 2

6. **`src/components/questionnaire/AssessmentQuestionnaire.tsx`**
   - Update imports: add `Step2DirectionalScore`, `Step3Process`, `Step4ProcessScore`; remove old Step2/3/4
   - Update `renderStep()` switch: add `case 2` and `case 4` mappings
   - Pass `stage` to `ProgressBar`

### Verification

```bash
pnpm typecheck
pnpm build
# Full flow test:
# Step 0 → Step 1 (6 questions) → Step 2 (directional score animates, benchmark shown, disclaimer visible)
# → Primary CTA → Step 3 (process name dropdown present) → fill D1–D8 + hours
# → Step 4 (inline score card, Add Process 2 button)
# → Add Process 2 → fill → score shown inline
# → Continue → Step 5 → Step 6 → Step 7
# Stage 1 secondary CTA: email field expands, submit calls /api/assessment/stage1, confirmation shown
# Progress bar shows two segments, correct labels
```

### Exit criteria

- Directional score animates from 0 to computed value
- Stage 1 email CTA submits to `/api/assessment/stage1` (returns `{ ok: true }` even without backend wired)
- Process name dropdown populated from sector
- Inline score revealed after each process without navigating away
- Two-segment progress bar renders correctly
- Old `Step3ScoreTeaser.tsx` and `Step4ExtraProcesses.tsx` deleted
- `pnpm build` passes

---

## PR 5 — Backend: Stage 1 API + Brevo Integration

**Branch:** `feat/questionnaire-pr5-backend-brevo`  
**Dependencies:** PR 4 merged (for payload shape clarity), but can be developed in parallel  
**Risk:** Medium — new API endpoint, replaces N8N forwarding; needs env vars

### Context

The submit route currently forwards everything to `N8N_WEBHOOK_URL`. Requirements spec §7 replaces this with:
1. **`POST /api/assessment/stage1`** (new): Stage 1 teaser email via Brevo + contact upsert
2. **`POST /api/assessment/submit`** (refactor): Brevo transactional email with PDF attachment + contact upsert + lead tag + HOT/WARM alerts

### Tasks

1. **`src/app/api/assessment/stage1/route.ts`** (new file)
   - Accept body: `{ email, language, company_name, sector, company_size, pain_point, c1, c2, directional_score, submitted_at }`
   - Validate email (re-use regex)
   - Call Brevo `POST https://api.brevo.com/v3/smtp/email` — Stage 1 teaser email (no PDF, body from spec §5)
   - Call Brevo `POST https://api.brevo.com/v3/contacts` — upsert contact with tag `STAGE_1_ONLY`, store `directional_score`, `sector`, `pain_point`, `company_size`
   - If `BREVO_API_KEY` not set: log warning, return `{ ok: true }` (graceful degradation for local dev)
   - Return `{ ok: true }`

2. **`src/app/api/assessment/submit/route.ts`** (refactor)
   - Remove N8N forwarding entirely
   - After validation: determine lead tag (§8 logic: HOT if `company_score >= 70` OR any `process_score >= 80`; WARM if 50–70%; NURTURE if 30–50%; DISQUALIFIED otherwise)
   - Call internal `/api/assessment/report` → get PDF buffer
   - Send transactional email via Brevo with PDF as base64 attachment (spec §5 Stage 2 email)
   - Upsert Brevo contact: set all fields from spec §8 table; replace `STAGE_1_ONLY` with final tag
   - If HOT or WARM: send plain-text alert email to `HOT_LEAD_ALERT_EMAIL`
   - On any upstream error: log server-side, still return `{ ok: true }` (user reaches Step 7 regardless)
   - Remove `N8N_WEBHOOK_URL` env var dependency

3. **`src/lib/assessment/brevo.ts`** (new helper)
   - `sendEmail(payload: BrevoEmailPayload): Promise<void>` — wraps Brevo `/v3/smtp/email`
   - `upsertContact(email: string, attributes: Record<string, unknown>, listIds?: number[]): Promise<void>` — wraps Brevo `/v3/contacts`
   - Both functions read `BREVO_API_KEY` and `BREVO_SENDER_EMAIL` from env; throw if missing (callers catch and degrade gracefully)

4. **`src/lib/assessment/leadRouting.ts`** (new helper)
   - `computeLeadTag(companyScore: number, processes: WebhookProcessPayload[], migrationScore: number | null): string`
   - Returns: `'HOT' | 'WARM' | 'NURTURE' | 'MIGRATION_LEAD' | 'DISQUALIFIED'`
   - Multiple tags handled via Brevo list membership (MIGRATION_LEAD can co-exist with HOT/WARM)

5. **`.env.local.example`** (update or create)
   - Add: `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `CONTACT_EMAIL`, `HOT_LEAD_ALERT_EMAIL`
   - Remove: `N8N_WEBHOOK_URL`

6. **`src/app/api/assessment/submit/route.test.ts`** (update)
   - Mock Brevo calls (replace N8N mock)
   - Add test: HOT lead triggers alert email
   - Add test: upstream error still returns `{ ok: true }`

### Verification

```bash
pnpm typecheck
pnpm test  # route.test.ts must pass
pnpm build
# With BREVO_API_KEY unset: POST /api/assessment/stage1 returns { ok: true } with console.warn
# With BREVO_API_KEY unset: POST /api/assessment/submit returns { ok: true } with console.warn
```

### Exit criteria

- `N8N_WEBHOOK_URL` removed from all code and docs
- `/api/assessment/stage1` route exists and handles missing Brevo key gracefully
- `/api/assessment/submit` calls Brevo directly, not N8N
- Lead tag computed correctly from score thresholds
- All tests pass

---

## PR 6 — Step 6 Pre-fill + Minor Polish

**Branch:** `feat/questionnaire-pr6-polish`  
**Dependencies:** PR 4 merged  
**Risk:** Low — small additive changes

### Context

If the user submitted an email via the Stage 1 secondary CTA, the email gate (Step 6) should pre-fill that email. A few other spec items not covered in PRs 1–5.

### Tasks

1. **`src/components/questionnaire/steps/Step6EmailGate.tsx`**
   - On mount: if `state.stage1_email` is set, pre-populate email input with its value
   - Show note: `"We'll send the full report to [email]. Change it below if needed."` / LT equiv
   - Add translations for the pre-fill note to `translations.ts`

2. **`src/lib/assessment/translations.ts`** — add `step6.prefillNote`

3. Minor: verify `Step7ThankYou.tsx` shows the "contact fallback" (`info@diteka.lt` mailto link) correctly styled (small, below the main message block) — this was added in PR 1 but verify styling matches spec §3 Step 7 layout

### Verification

```bash
pnpm typecheck
pnpm build
# Go through full flow with Stage 1 email entered → reach Step 6 → email pre-filled
```

### Exit criteria

- Step 6 pre-fills from `stage1_email` when present
- `pnpm build` passes

---

## Execution Order

```
PR 1 (quick wins) → PR 2 (state) → PR 3 (step 1 questions) → PR 4 (stage 2 restructure) → PR 5 (backend)
                                                                                         ↗ (can start in parallel with PR 4)
                                                              PR 6 (polish, after PR 4)
```

PRs 4 and 5 can be developed in parallel once PR 3 is merged; PR 5 does not depend on PR 4 frontend changes.

---

## Invariants (checked after every PR)

- `pnpm typecheck` passes
- `pnpm build` passes
- `pnpm test` passes
- No Calendly references in codebase after PR 1
- No N8N references in codebase after PR 5
- State `RESET` action always returns user to Step 0
- Directional score is never sent in the Stage 2 PDF report (only per-process scores)
- Score band labels (Strong Candidate etc.) never shown on the directional score card
