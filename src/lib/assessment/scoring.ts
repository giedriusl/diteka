import type {
  ProcessAnswers,
  DBModuleAnswers,
  FormState,
  ProcessScoreResult,
  ScoreResult,
  MigrationScoreResult,
  BandLabel,
  MigrationBandLabel,
  KnockoutReason,
  SectorKey,
  WebhookPayload,
} from './types'

// ─── Volume weight lookup ─────────────────────────────────────────────────────

const VOLUME_WEIGHTS: Record<number, number> = {
  1: 0.5,
  2: 0.75,
  3: 1.0,
  4: 1.25,
  5: 1.5,
}

function volumeWeight(d2: number): number {
  return VOLUME_WEIGHTS[d2] ?? 1.0
}

// ─── Sector benchmarks (hard-coded until N≥20) ────────────────────────────────

const SECTOR_BENCHMARKS: Record<SectorKey, number> = {
  manufacturing: 61,
  logistics: 67,
  wholesale: 59,
  services: 55,
  retail: 52,
  other: 58,
}

// ─── Knockout check ───────────────────────────────────────────────────────────

export function checkKnockout(answers: ProcessAnswers): KnockoutReason {
  if (answers.D8 === 1) return 'no_compliance'
  if (answers.D1 === 1 && answers.D4 === 1) return 'no_data_and_rules'
  return null
}

// ─── Per-process score ────────────────────────────────────────────────────────

export function calculateProcessScore(
  answers: ProcessAnswers,
  processIndex: number
): ProcessScoreResult {
  const weight = volumeWeight(answers.D2 ?? 3)
  const knockout = checkKnockout(answers)

  if (knockout !== null) {
    return {
      processIndex,
      rawScore: 0,
      processScore: 0,
      knockout,
      annualHoursSaved: 0,
      volumeWeight: weight,
    }
  }

  // D6 is inverted: more systems = lower ease
  const d6Ease = 6 - (answers.D6 ?? 3)

  const raw =
    (answers.D1! * 0.25) +
    (answers.D3! * 0.20) +
    (answers.D4! * 0.15) +
    (answers.D5! * 0.15) +
    (answers.D8! * 0.10) +
    (answers.D2! * 0.08) +
    (answers.D7! * 0.05) +
    (d6Ease    * 0.02)

  const processScore = round1((raw / 5) * 100)
  const annualHoursSaved = Math.round((answers.hoursPerWeek ?? 0) * 52 * (processScore / 100))

  return {
    processIndex,
    rawScore: raw,
    processScore,
    knockout: null,
    annualHoursSaved,
    volumeWeight: weight,
  }
}

// ─── Company-level aggregated score ──────────────────────────────────────────

export function calculateCompanyScore(processResults: ProcessScoreResult[]): number {
  const active = processResults.filter(p => p.knockout === null)
  if (active.length === 0) return 0

  const weightedSum = active.reduce((acc, p) => acc + p.processScore * p.volumeWeight, 0)
  return round1(weightedSum / active.length)
}

// ─── Migration module score ───────────────────────────────────────────────────

export function calculateMigrationScore(answers: DBModuleAnswers): MigrationScoreResult {
  if (
    !answers.enabled ||
    answers.M1 === null ||
    answers.M2 === null ||
    answers.M3 === null ||
    answers.M4 === null
  ) {
    return { migrationScore: 0, band: 'no_action' }
  }

  // M1, M2, M4 are inverted; M3 is direct; M5 = count of signals (0–5)
  const m1Urgency  = 6 - answers.M1
  const m2Adjusted = 6 - answers.M2
  const m4Ease     = 6 - answers.M4
  const m5Score    = answers.M5.length

  const raw =
    (m1Urgency  * 0.25) +
    (answers.M3 * 0.30) +
    (m2Adjusted * 0.15) +
    (m4Ease     * 0.15) +
    (m5Score    * 0.15)

  const migrationScore = round1((raw / 5) * 100)

  return { migrationScore, band: getMigrationBand(migrationScore) }
}

// ─── Band lookups ─────────────────────────────────────────────────────────────

export function getScoreBand(score: number): BandLabel {
  if (score >= 80) return 'strong'
  if (score >= 60) return 'good'
  if (score >= 40) return 'moderate'
  if (score >= 20) return 'low'
  return 'not_suitable'
}

export function getMigrationBand(score: number): MigrationBandLabel {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'ready'
  if (score >= 40) return 'prepare_first'
  if (score >= 20) return 'low_urgency'
  return 'no_action'
}

export function getAutomationBenchmark(sector: SectorKey): number {
  return SECTOR_BENCHMARKS[sector]
}

// ─── Full score from form state ───────────────────────────────────────────────

export function computeFullScore(state: FormState): ScoreResult {
  const processResults = state.processes
    .slice(0, state.activeProcessCount)
    .map((p, i) => calculateProcessScore(p, i))

  const companyScore = calculateCompanyScore(processResults)
  const band = getScoreBand(companyScore)
  const benchmarkPercent = getAutomationBenchmark(state.sector ?? 'other')
  const totalAnnualHoursSaved = processResults.reduce((acc, p) => acc + p.annualHoursSaved, 0)

  return { processes: processResults, companyScore, band, benchmarkPercent, totalAnnualHoursSaved }
}

// ─── Webhook payload builder ──────────────────────────────────────────────────

export function buildWebhookPayload(
  state: FormState,
  scoreResult: ScoreResult,
  migrationResult: MigrationScoreResult | null,
  submittedAt: string
): WebhookPayload {
  const processes = scoreResult.processes.map((result, i) => {
    const answers = state.processes[i]
    return {
      name: answers.name,
      scores: {
        D1: answers.D1 ?? 0,
        D2: answers.D2 ?? 0,
        D3: answers.D3 ?? 0,
        D4: answers.D4 ?? 0,
        D5: answers.D5 ?? 0,
        D6: answers.D6 ?? 0,
        D7: answers.D7 ?? 0,
        D8: answers.D8 ?? 0,
      },
      process_score: result.processScore,
      hours_per_week: answers.hoursPerWeek ?? 0,
      annual_hours_saved: result.annualHoursSaved,
      knockout: result.knockout,
    }
  })

  const dbCompleted = state.dbModule.enabled &&
    state.dbModule.M1 !== null &&
    state.dbModule.M2 !== null &&
    state.dbModule.M3 !== null &&
    state.dbModule.M4 !== null

  return {
    email: state.email,
    language: state.language,
    sector: state.sector ?? 'other',
    company_size: state.companySize ?? 'xs',
    pain_point: state.painPoint ?? 'other',
    company_score: scoreResult.companyScore,
    processes,
    db_module_completed: dbCompleted,
    db_scores: dbCompleted
      ? {
          M1: state.dbModule.M1,
          M2: state.dbModule.M2,
          M3: state.dbModule.M3,
          M4: state.dbModule.M4,
          M5: state.dbModule.M5,
        }
      : null,
    migration_score: migrationResult?.migrationScore ?? null,
    submitted_at: submittedAt,
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
