# Questionnaire Feature Blueprint

**Feature:** Automation Readiness Assessment  
**Date:** 2026-05-26  
**Status:** Planning — not yet implemented

---

## Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| i18n | Self-contained `translations.ts` | Avoids next-intl async coupling; works on any page |
| Style isolation | CSS Modules | No bleed to/from landing page CSS |
| State | `useReducer` | Complex enough for explicit actions, not complex enough for global store |
| Scoring | Pure functions in `src/lib/` | Zero React dependency; fully unit-testable |
| Webhook | Next.js Route Handler | Keeps n8n webhook URL server-side in env var |
| Animation | `requestAnimationFrame` + CSS `@keyframes` | No new npm packages |

---

## Files to Create

| File | Purpose |
|---|---|
| `src/lib/assessment/types.ts` | All TypeScript interfaces and union types |
| `src/lib/assessment/translations.ts` | Full EN/LT string map, typed |
| `src/lib/assessment/scoring.ts` | Pure scoring engine functions |
| `src/lib/assessment/session.ts` | sessionStorage read/write helpers (pure, no React) |
| `src/hooks/useAssessmentSession.ts` | React hook wrapping session.ts |
| `src/hooks/useCountUp.ts` | requestAnimationFrame-based number counter hook |
| `src/app/api/assessment/submit/route.ts` | Route Handler: validates payload, forwards to n8n webhook |
| `src/app/[locale]/assessment/page.tsx` | Next.js page rendering `<AssessmentQuestionnaire />` |
| `src/components/questionnaire/AssessmentQuestionnaire.tsx` | Root component: owns reducer, session sync, step routing |
| `src/components/questionnaire/questionnaire.module.css` | Scoped keyframes: slide-in, arc-fill |
| `src/components/questionnaire/ProgressBar.tsx` | Linear "Step X of 8" progress bar with ARIA |
| `src/components/questionnaire/LanguageToggle.tsx` | Fixed top-right EN/LT toggle |
| `src/components/questionnaire/ScoreArc.tsx` | SVG arc with animated fill, accessible |
| `src/components/questionnaire/LikertScale.tsx` | Reusable 1–5 radio button row |
| `src/components/questionnaire/QuestionBlock.tsx` | Labelled question wrapper |
| `src/components/questionnaire/NavigationButtons.tsx` | Back / Next / Submit buttons |
| `src/components/questionnaire/steps/Step0Language.tsx` | Pre-form language splash screen |
| `src/components/questionnaire/steps/Step1Context.tsx` | Company context: sector, size, pain point |
| `src/components/questionnaire/steps/Step2Process.tsx` | Process name + D1–D8 + hours/week |
| `src/components/questionnaire/steps/Step3ScoreTeaser.tsx` | Inline score reveal after Process 1 |
| `src/components/questionnaire/steps/Step4ExtraProcesses.tsx` | Optional Process 2 & 3 |
| `src/components/questionnaire/steps/Step5DbModule.tsx` | Optional DB migration toggle + M1–M5 |
| `src/components/questionnaire/steps/Step6EmailGate.tsx` | Email field + submit |
| `src/components/questionnaire/steps/Step7ThankYou.tsx` | Score circle, band, benchmark, Calendly CTA |

## Files to Modify

| File | Change |
|---|---|
| `src/app/[locale]/page.tsx` | Add CTA link pointing to `/assessment` |
| `.env.local` | Add `N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...` |

---

## TypeScript Interfaces

```typescript
// src/lib/assessment/types.ts

export type Language = 'en' | 'lt'

export type SectorKey =
  | 'manufacturing'
  | 'logistics'
  | 'wholesale'
  | 'services'
  | 'retail'
  | 'other'

export type CompanySizeKey = 'xs' | 's' | 'm' | 'l' | 'xl'

export type PainPointKey =
  | 'staff'
  | 'errors'
  | 'speed'
  | 'cost'
  | 'scale'
  | 'other'

export type BandLabel =
  | 'strong'
  | 'good'
  | 'moderate'
  | 'low'
  | 'not_suitable'

export type MigrationBandLabel =
  | 'critical'
  | 'ready'
  | 'prepare_first'
  | 'low_urgency'
  | 'no_action'

export type KnockoutReason =
  | 'no_compliance'      // D8 = 1
  | 'no_data_and_rules'  // D1 = 1 AND D4 = 1
  | null

export interface ProcessAnswers {
  name: string
  D1: number | null
  D2: number | null
  D3: number | null
  D4: number | null
  D5: number | null
  D6: number | null
  D7: number | null
  D8: number | null
  hoursPerWeek: number | null
}

export type M5UrgencySignal =
  | 'gdpr'
  | 'vendor_eol'
  | 'performance'
  | 'integration'
  | 'growth'

export interface DBModuleAnswers {
  enabled: boolean
  M1: number | null
  M2: number | null
  M3: number | null
  M4: number | null
  M5: M5UrgencySignal[]
}

export interface ProcessScoreResult {
  processIndex: number
  rawScore: number
  processScore: number       // 0–100
  knockout: KnockoutReason
  annualHoursSaved: number
  volumeWeight: number       // from D2: 0.5/0.75/1.0/1.25/1.5
}

export interface ScoreResult {
  processes: ProcessScoreResult[]
  companyScore: number       // 0–100, volume-weighted average
  band: BandLabel
  benchmarkPercent: number
  totalAnnualHoursSaved: number
}

export interface MigrationScoreResult {
  migrationScore: number     // 0–100
  band: MigrationBandLabel
}

export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface FormState {
  step: StepIndex
  language: Language
  sector: SectorKey | null
  companySize: CompanySizeKey | null
  painPoint: PainPointKey | null
  processes: [ProcessAnswers, ProcessAnswers, ProcessAnswers]
  activeProcessCount: 1 | 2 | 3
  dbModule: DBModuleAnswers
  email: string
  submitStatus: 'idle' | 'pending' | 'success' | 'error'
  submitError: string | null
}

export interface WebhookProcessPayload {
  name: string
  scores: Record<'D1'|'D2'|'D3'|'D4'|'D5'|'D6'|'D7'|'D8', number>
  process_score: number
  hours_per_week: number
  annual_hours_saved: number
  knockout: KnockoutReason
}

export interface WebhookPayload {
  email: string
  language: Language
  sector: SectorKey
  company_size: CompanySizeKey
  pain_point: PainPointKey
  company_score: number
  processes: WebhookProcessPayload[]
  db_module_completed: boolean
  db_scores: {
    M1: number | null
    M2: number | null
    M3: number | null
    M4: number | null
    M5: M5UrgencySignal[]
  } | null
  migration_score: number | null
  submitted_at: string
}

export type AssessmentAction =
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'SET_STEP'; step: StepIndex }
  | { type: 'SET_SECTOR'; sector: SectorKey }
  | { type: 'SET_COMPANY_SIZE'; size: CompanySizeKey }
  | { type: 'SET_PAIN_POINT'; painPoint: PainPointKey }
  | { type: 'SET_PROCESS_FIELD'; index: 0|1|2; field: keyof ProcessAnswers; value: string | number | null }
  | { type: 'SET_ACTIVE_PROCESS_COUNT'; count: 1|2|3 }
  | { type: 'SET_DB_ENABLED'; enabled: boolean }
  | { type: 'SET_DB_FIELD'; field: keyof Omit<DBModuleAnswers, 'enabled' | 'M5'>; value: number | null }
  | { type: 'TOGGLE_M5_SIGNAL'; signal: M5UrgencySignal }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_SUBMIT_STATUS'; status: FormState['submitStatus']; error?: string }
  | { type: 'RESET' }
```

---

## Scoring Engine API

```typescript
// src/lib/assessment/scoring.ts — all pure functions

export function checkKnockout(answers: ProcessAnswers): KnockoutReason
// D8 = 1 → 'no_compliance'
// D1 = 1 AND D4 = 1 → 'no_data_and_rules'
// else → null

export function calculateProcessScore(
  answers: ProcessAnswers,
  processIndex: number
): ProcessScoreResult
// D6_ease = 6 − D6_raw
// Raw = (D1×0.25)+(D3×0.20)+(D4×0.15)+(D5×0.15)+(D8×0.10)+(D2×0.08)+(D7×0.05)+(D6_ease×0.02)
// Score % = (Raw / 5) × 100

export function calculateCompanyScore(processResults: ProcessScoreResult[]): number
// Volume weights: D2=1→0.5, 2→0.75, 3→1.0, 4→1.25, 5→1.5
// Excludes knocked-out processes

export function calculateMigrationScore(answers: DBModuleAnswers): MigrationScoreResult
// M1_urgency = 6−M1, M2_adjusted = 6−M2, M4_ease = 6−M4
// M5_score = M5.length
// Score = [(M1_urgency×0.25)+(M3×0.30)+(M2_adjusted×0.15)+(M4_ease×0.15)+(M5_score×0.15)] / 5 × 100

export function getScoreBand(score: number): BandLabel
// 80–100=strong, 60–79=good, 40–59=moderate, 20–39=low, 0–19=not_suitable

export function getMigrationBand(score: number): MigrationBandLabel
// 80–100=critical, 60–79=ready, 40–59=prepare_first, 20–39=low_urgency, 0–19=no_action

export function getAutomationBenchmark(sector: SectorKey): number
// Manufacturing=61, Logistics=67, Wholesale=59, Services=55, Retail=52, Other=58

export function computeFullScore(state: FormState): ScoreResult

export function buildWebhookPayload(
  state: FormState,
  scoreResult: ScoreResult,
  migrationResult: MigrationScoreResult | null,
  submittedAt: string
): WebhookPayload
```

---

## sessionStorage State Shape

Key: `diteka_assessment_v1`

```json
{
  "step": 2,
  "language": "lt",
  "sector": "manufacturing",
  "companySize": "s",
  "painPoint": "staff",
  "processes": [
    {
      "name": "Sąskaitų apdorojimas",
      "D1": 4, "D2": 3, "D3": null, "D4": 3,
      "D5": null, "D6": null, "D7": null, "D8": null,
      "hoursPerWeek": 10
    },
    {
      "name": "", "D1": null, "D2": null, "D3": null, "D4": null,
      "D5": null, "D6": null, "D7": null, "D8": null,
      "hoursPerWeek": null
    },
    {
      "name": "", "D1": null, "D2": null, "D3": null, "D4": null,
      "D5": null, "D6": null, "D7": null, "D8": null,
      "hoursPerWeek": null
    }
  ],
  "activeProcessCount": 1,
  "dbModule": {
    "enabled": false,
    "M1": null, "M2": null, "M3": null, "M4": null,
    "M5": []
  },
  "email": "",
  "submitStatus": "idle",
  "submitError": null
}
```

Computed scores are never stored — derived fresh from this state when Step 7 mounts.

---

## Component Hierarchy

```
AssessmentQuestionnaire          (owns useReducer state, sessionStorage sync)
├── LanguageToggle               (fixed positioned, reads/writes language)
├── ProgressBar                  (reads step)
└── [step === 0]  Step0Language
    [step === 1]  Step1Context
    [step === 2]  Step2Process          (processIndex=0)
    [step === 3]  Step3ScoreTeaser
    [step === 4]  Step4ExtraProcesses  (processIndex=1,2)
    [step === 5]  Step5DbModule
    [step === 6]  Step6EmailGate
    [step === 7]  Step7ThankYou
        └── ScoreArc
```

All step components receive `(state: FormState, dispatch: Dispatch<AssessmentAction>, t: TranslationFn)`. No step reads sessionStorage directly or calls the scoring engine.

### Props Interfaces

```typescript
// AssessmentQuestionnaire — no external props
export interface AssessmentQuestionnaireProps {}

export interface ProgressBarProps {
  currentStep: StepIndex
  totalSteps: 8
  label: string
}

export interface LanguageToggleProps {
  language: Language
  onToggle: () => void
}

export interface ScoreArcProps {
  score: number
  band: BandLabel
  size?: number               // default 200
  strokeWidth?: number        // default 16
  animationDurationMs?: number // default 1500
}

export interface LikertScaleProps {
  id: string
  name: string
  value: number | null
  onChange: (value: number) => void
  lowLabel: string
  highLabel: string
  required?: boolean
}

export interface QuestionBlockProps {
  id: string
  label: string
  description?: string
  children: React.ReactNode
  required?: boolean
}

export interface NavigationButtonsProps {
  onBack?: () => void
  onNext?: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
  nextLabel: string
  backLabel: string
  submitLabel: string
  canAdvance: boolean
}

// All step components:
export interface StepProps {
  state: FormState
  dispatch: React.Dispatch<AssessmentAction>
  t: (key: string) => string
}
```

---

## Data Flow

```
User interaction (click/input)
        │
        ▼
Step component calls dispatch(action)
        │
        ▼
AssessmentQuestionnaire: useReducer(assessmentReducer, state)
        │
        ├──► useEffect: JSON.stringify(state) → sessionStorage['diteka_assessment_v1']
        │
        ▼
Updated state flows to all step components as props
        │
        ▼ (on Step 6 submit)
Step6EmailGate: dispatch SET_SUBMIT_STATUS 'pending'
        │
        ├──► POST /api/assessment/submit
        │         body: buildWebhookPayload(state, scoreResult, ...)
        │
        ▼
src/app/api/assessment/submit/route.ts
        │
        ├──► Validates payload
        ├──► fetch(process.env.N8N_WEBHOOK_URL, { method: 'POST', body })  // n8n webhook
        └──► Returns { ok: true } or { error: string }
        │
        ▼
dispatch SET_SUBMIT_STATUS 'success' → dispatch SET_STEP 7
        │
        ▼
Step7ThankYou mounts
        │
        ├──► computeFullScore(state) → ScoreResult
        ├──► calculateMigrationScore(state.dbModule) → MigrationScoreResult
        ├──► ScoreArc: useCountUp animates 0→final over 1500ms
        └──► Renders band, benchmark, hours saved, Calendly CTA
```

---

## Animation

### Score Arc (ScoreArc.tsx)

SVG with two `<circle>` elements. Foreground ring `strokeDashoffset` driven by `useCountUp`. Band colours as constants (avoids Tailwind JIT purge):

```typescript
const BAND_COLORS: Record<BandLabel, string> = {
  strong:       '#16a34a',  // green-600
  good:         '#0d9488',  // teal-600
  moderate:     '#ca8a04',  // yellow-600
  low:          '#ea580c',  // orange-600
  not_suitable: '#9ca3af',  // gray-400
}
```

### Step Transitions (questionnaire.module.css)

Each step wrapped in `<div key={step}>` — React unmounts/remounts on step change, triggering entrance animation automatically:

```css
.stepEnter {
  animation: slideInRight 200ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes slideInRight {
  from { transform: translateX(2rem); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
```

---

## Route Handler

```typescript
// src/app/api/assessment/submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import type { WebhookPayload } from '@/lib/assessment/types'

export async function POST(request: NextRequest) {
  const payload: WebhookPayload = await request.json()
  if (!payload.email || !payload.email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }
  const upstream = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!upstream.ok) {
    return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
```

---

## Page Integration

```typescript
// src/app/[locale]/assessment/page.tsx
import AssessmentQuestionnaire from '@/components/questionnaire/AssessmentQuestionnaire'

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F3]">
      <AssessmentQuestionnaire />
    </main>
  )
}
```

Add `<Link href="/assessment">` in existing CTA section on `src/app/[locale]/page.tsx`.

---

## Build Order

| Stage | Files | Gate |
|---|---|---|
| 1 | `types.ts` | `pnpm typecheck` |
| 2 | `translations.ts` | `pnpm typecheck` |
| 3 | `scoring.ts` + `scoring.test.ts` | Tests pass |
| 4 | `session.ts` | Unit tests with mock Storage |
| 5 | `useCountUp.ts` | `renderHook` test |
| 6 | `useAssessmentSession.ts` | `renderHook` test |
| 7 | Route Handler | Request/response test |
| 8 | `questionnaire.module.css` | Visual check |
| 9 | Primitive components (LikertScale, QuestionBlock, NavigationButtons, ProgressBar, LanguageToggle, ScoreArc) | Storybook or isolated render |
| 10 | Step components (Step0–Step7) | Each step renderable in isolation |
| 11 | `AssessmentQuestionnaire.tsx` | Full flow at `/assessment` |
| 12 | `assessment/page.tsx` | Route accessible |
| 13 | Fill all translation values | Visual review EN + LT |
| 14 | Add CTA link on landing page | Navigation works |
