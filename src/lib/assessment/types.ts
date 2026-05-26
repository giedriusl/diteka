// ─── Primitives ───────────────────────────────────────────────────────────────

export type Language = 'en' | 'lt'

export type SectorKey =
  | 'manufacturing'
  | 'logistics'
  | 'wholesale'
  | 'services'
  | 'retail'
  | 'other'

export type CompanySizeKey = 'xs' | 's' | 'm' | 'l'
// xs=1-10, s=11-50, m=51-200, l=200+

export type PainPointKey =
  | 'staff'
  | 'errors'
  | 'overload'
  | 'compliance'
  | 'volume'
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
  | 'no_compliance'      // D8 = 1 — process being redesigned
  | 'no_data_and_rules'  // D1 = 1 AND D4 = 1 — judgment + unstructured
  | null

// ─── Per-question answers ─────────────────────────────────────────────────────

export interface ProcessAnswers {
  name: string
  D1: number | null  // Rule-Basedness     25%
  D2: number | null  // Volume              8%
  D3: number | null  // Input Digitisation 20%
  D4: number | null  // Data Structure     15%
  D5: number | null  // Standardisation    15%
  D6: number | null  // System Fragmentation 2% (inverted)
  D7: number | null  // Error Rate          5%
  D8: number | null  // Process Stability  10%
  hoursPerWeek: number | null
}

// M5 urgency signal keys match the 5 checkbox options in Step 5
export type M5UrgencySignal =
  | 'gdpr'
  | 'vendor_eol'
  | 'growth'
  | 'security'
  | 'investors'

export interface DBModuleAnswers {
  enabled: boolean
  M1: number | null  // Storage Type / Urgency 25% (inverted)
  M2: number | null  // Data Volume            15% (inverted)
  M3: number | null  // Data Quality           30%
  M4: number | null  // Integration Requirements 15% (inverted)
  M5: M5UrgencySignal[]  // Urgency Signals    15% (count = score)
}

// ─── Scoring results ──────────────────────────────────────────────────────────

export interface ProcessScoreResult {
  processIndex: number
  rawScore: number
  processScore: number       // 0–100
  knockout: KnockoutReason
  annualHoursSaved: number
  volumeWeight: number       // derived from D2: 0.5 / 0.75 / 1.0 / 1.25 / 1.5
}

export interface ScoreResult {
  processes: ProcessScoreResult[]
  companyScore: number       // 0–100 volume-weighted average of non-KO processes
  band: BandLabel
  benchmarkPercent: number   // hard-coded sector benchmark
  totalAnnualHoursSaved: number
}

export interface MigrationScoreResult {
  migrationScore: number     // 0–100
  band: MigrationBandLabel
}

// ─── Form state ───────────────────────────────────────────────────────────────

export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface FormState {
  step: StepIndex
  language: Language
  // Step 1
  sector: SectorKey | null
  companySize: CompanySizeKey | null
  painPoint: PainPointKey | null
  // Steps 2 & 4
  processes: [ProcessAnswers, ProcessAnswers, ProcessAnswers]
  activeProcessCount: 1 | 2 | 3
  // Step 5
  dbModule: DBModuleAnswers
  // Step 6
  email: string
  submitStatus: 'idle' | 'pending' | 'success' | 'error'
  submitError: string | null
}

// ─── Reducer actions ──────────────────────────────────────────────────────────

export type AssessmentAction =
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'SET_STEP'; step: StepIndex }
  | { type: 'SET_SECTOR'; sector: SectorKey }
  | { type: 'SET_COMPANY_SIZE'; size: CompanySizeKey }
  | { type: 'SET_PAIN_POINT'; painPoint: PainPointKey }
  | { type: 'SET_PROCESS_FIELD'; index: 0 | 1 | 2; field: keyof ProcessAnswers; value: string | number | null }
  | { type: 'SET_ACTIVE_PROCESS_COUNT'; count: 1 | 2 | 3 }
  | { type: 'SET_DB_ENABLED'; enabled: boolean }
  | { type: 'SET_DB_FIELD'; field: keyof Omit<DBModuleAnswers, 'enabled' | 'M5'>; value: number | null }
  | { type: 'TOGGLE_M5_SIGNAL'; signal: M5UrgencySignal }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_SUBMIT_STATUS'; status: FormState['submitStatus']; error?: string }
  | { type: 'RESTORE_SESSION'; state: FormState }
  | { type: 'RESET' }

// ─── Webhook payload ──────────────────────────────────────────────────────────

export interface WebhookProcessPayload {
  name: string
  scores: Record<'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8', number>
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
  submitted_at: string  // ISO 8601
}
