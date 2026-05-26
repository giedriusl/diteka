import { describe, it, expect } from 'vitest'
import {
  checkKnockout,
  calculateProcessScore,
  calculateCompanyScore,
  calculateMigrationScore,
  getScoreBand,
  getMigrationBand,
  getAutomationBenchmark,
  computeFullScore,
  buildWebhookPayload,
} from './scoring'
import type {
  ProcessAnswers,
  DBModuleAnswers,
  FormState,
} from './types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeProcess(overrides: Partial<ProcessAnswers> = {}): ProcessAnswers {
  return {
    name: 'Test Process',
    D1: 4, D2: 3, D3: 4, D4: 4, D5: 4, D6: 2, D7: 3, D8: 5,
    hoursPerWeek: 10,
    ...overrides,
  }
}

function emptyProcess(): ProcessAnswers {
  return {
    name: '',
    D1: null, D2: null, D3: null, D4: null,
    D5: null, D6: null, D7: null, D8: null,
    hoursPerWeek: null,
  }
}

function makeFormState(overrides: Partial<FormState> = {}): FormState {
  return {
    step: 1,
    language: 'en',
    sector: 'manufacturing',
    companySize: 's',
    painPoint: 'staff',
    processes: [makeProcess(), emptyProcess(), emptyProcess()],
    activeProcessCount: 1,
    dbModule: { enabled: false, M1: null, M2: null, M3: null, M4: null, M5: [] },
    email: 'test@example.com',
    submitStatus: 'idle',
    submitError: null,
    ...overrides,
  }
}

// ─── checkKnockout ────────────────────────────────────────────────────────────

describe('checkKnockout', () => {
  it('returns null when no knockout condition met', () => {
    expect(checkKnockout(makeProcess())).toBe(null)
  })

  it('returns no_compliance when D8 = 1', () => {
    expect(checkKnockout(makeProcess({ D8: 1 }))).toBe('no_compliance')
  })

  it('returns no_data_and_rules when D1 = 1 AND D4 = 1', () => {
    expect(checkKnockout(makeProcess({ D1: 1, D4: 1 }))).toBe('no_data_and_rules')
  })

  it('does not trigger no_data_and_rules when only D1 = 1', () => {
    expect(checkKnockout(makeProcess({ D1: 1, D4: 2 }))).toBe(null)
  })

  it('does not trigger no_data_and_rules when only D4 = 1', () => {
    expect(checkKnockout(makeProcess({ D1: 2, D4: 1 }))).toBe(null)
  })

  it('no_compliance takes priority over no_data_and_rules when both apply', () => {
    expect(checkKnockout(makeProcess({ D8: 1, D1: 1, D4: 1 }))).toBe('no_compliance')
  })
})

// ─── calculateProcessScore ────────────────────────────────────────────────────

describe('calculateProcessScore', () => {
  it('scores 100% when all dimensions are 5 and D6 = 1 (ease = 5)', () => {
    const result = calculateProcessScore(
      makeProcess({ D1: 5, D2: 5, D3: 5, D4: 5, D5: 5, D6: 1, D7: 5, D8: 5 }),
      0,
    )
    expect(result.processScore).toBe(100)
    expect(result.knockout).toBe(null)
  })

  it('inverts D6 correctly — D6=5 (7+ systems) gives ease=1', () => {
    const highFragmentation = calculateProcessScore(
      makeProcess({ D1: 5, D2: 5, D3: 5, D4: 5, D5: 5, D6: 5, D7: 5, D8: 5 }),
      0,
    )
    const lowFragmentation = calculateProcessScore(
      makeProcess({ D1: 5, D2: 5, D3: 5, D4: 5, D5: 5, D6: 1, D7: 5, D8: 5 }),
      0,
    )
    expect(highFragmentation.processScore).toBeLessThan(lowFragmentation.processScore)
  })

  it('returns processScore 0 and knockout reason when D8 = 1', () => {
    const result = calculateProcessScore(makeProcess({ D8: 1 }), 0)
    expect(result.processScore).toBe(0)
    expect(result.knockout).toBe('no_compliance')
    expect(result.annualHoursSaved).toBe(0)
  })

  it('returns processScore 0 and knockout reason when D1=1 and D4=1', () => {
    const result = calculateProcessScore(makeProcess({ D1: 1, D4: 1 }), 0)
    expect(result.processScore).toBe(0)
    expect(result.knockout).toBe('no_data_and_rules')
  })

  it('calculates known values correctly', () => {
    // D1=4 D2=3 D3=2 D4=3 D5=4 D6=2(ease=4) D7=3 D8=5
    // Raw = (4×0.25)+(2×0.20)+(3×0.15)+(4×0.15)+(5×0.10)+(3×0.08)+(3×0.05)+(4×0.02)
    //     = 1.00+0.40+0.45+0.60+0.50+0.24+0.15+0.08 = 3.42
    // Score = 3.42/5×100 = 68.4
    const result = calculateProcessScore(
      makeProcess({ D1: 4, D2: 3, D3: 2, D4: 3, D5: 4, D6: 2, D7: 3, D8: 5 }),
      0,
    )
    expect(result.processScore).toBeCloseTo(68.4, 1)
    expect(result.rawScore).toBeCloseTo(3.42, 2)
  })

  it('assigns correct volume weight from D2', () => {
    expect(calculateProcessScore(makeProcess({ D2: 1 }), 0).volumeWeight).toBe(0.5)
    expect(calculateProcessScore(makeProcess({ D2: 2 }), 0).volumeWeight).toBe(0.75)
    expect(calculateProcessScore(makeProcess({ D2: 3 }), 0).volumeWeight).toBe(1.0)
    expect(calculateProcessScore(makeProcess({ D2: 4 }), 0).volumeWeight).toBe(1.25)
    expect(calculateProcessScore(makeProcess({ D2: 5 }), 0).volumeWeight).toBe(1.5)
  })

  it('calculates annualHoursSaved from hoursPerWeek and processScore', () => {
    // 10 h/wk × 52 × (68.4/100) ≈ 355.68 → rounds to 356
    const result = calculateProcessScore(
      makeProcess({ D1: 4, D2: 3, D3: 2, D4: 3, D5: 4, D6: 2, D7: 3, D8: 5, hoursPerWeek: 10 }),
      0,
    )
    expect(result.annualHoursSaved).toBeCloseTo(356, 0)
  })

  it('annualHoursSaved is 0 when hoursPerWeek is null', () => {
    const result = calculateProcessScore(makeProcess({ hoursPerWeek: null }), 0)
    expect(result.annualHoursSaved).toBe(0)
  })

  it('stores the correct processIndex', () => {
    expect(calculateProcessScore(makeProcess(), 2).processIndex).toBe(2)
  })
})

// ─── calculateCompanyScore ────────────────────────────────────────────────────

describe('calculateCompanyScore', () => {
  it('returns 0 when all processes are knocked out', () => {
    const ko = calculateProcessScore(makeProcess({ D8: 1 }), 0)
    expect(calculateCompanyScore([ko])).toBe(0)
  })

  it('equals process score for a single non-KO process with D2=3 (weight=1.0)', () => {
    const p = calculateProcessScore(makeProcess({ D2: 3 }), 0)
    expect(calculateCompanyScore([p])).toBeCloseTo(p.processScore, 1)
  })

  it('weights higher-volume processes more heavily', () => {
    // Low-volume process with high score vs high-volume process with low score
    const highVolLowScore = calculateProcessScore(makeProcess({ D2: 5, D1: 2, D3: 2, D4: 2 }), 0)
    const lowVolHighScore = calculateProcessScore(makeProcess({ D2: 1, D1: 5, D3: 5, D4: 5 }), 0)
    const company = calculateCompanyScore([highVolLowScore, lowVolHighScore])
    // High-vol low-score process has weight 1.5, low-vol high-score has weight 0.5
    // So company score should lean toward high-vol low-score result
    const simpleAvg = (highVolLowScore.processScore + lowVolHighScore.processScore) / 2
    expect(company).not.toBeCloseTo(simpleAvg, 0)
  })

  it('excludes knocked-out processes from the calculation', () => {
    const ko = calculateProcessScore(makeProcess({ D8: 1 }), 0)
    const ok = calculateProcessScore(makeProcess({ D2: 3 }), 1)
    const company = calculateCompanyScore([ko, ok])
    expect(company).toBeCloseTo(ok.processScore, 1)
  })
})

// ─── calculateMigrationScore ──────────────────────────────────────────────────

describe('calculateMigrationScore', () => {
  it('returns 0 / no_action when module is disabled', () => {
    const result = calculateMigrationScore({
      enabled: false, M1: 3, M2: 3, M3: 3, M4: 3, M5: [],
    })
    expect(result.migrationScore).toBe(0)
    expect(result.band).toBe('no_action')
  })

  it('returns 0 / no_action when any field is null', () => {
    const result = calculateMigrationScore({
      enabled: true, M1: null, M2: 3, M3: 3, M4: 3, M5: [],
    })
    expect(result.migrationScore).toBe(0)
  })

  it('scores 100% with optimal values', () => {
    // M1=1 → urgency=5, M2=1 → adjusted=5, M3=5 (direct), M4=1 → ease=5, M5=5 signals
    const result = calculateMigrationScore({
      enabled: true,
      M1: 1, M2: 1, M3: 5, M4: 1,
      M5: ['gdpr', 'vendor_eol', 'growth', 'security', 'investors'],
    })
    expect(result.migrationScore).toBe(100)
  })

  it('M5 score = 0 when no signals checked', () => {
    const withM5 = calculateMigrationScore({
      enabled: true, M1: 3, M2: 3, M3: 3, M4: 3, M5: ['gdpr', 'vendor_eol'],
    })
    const withoutM5 = calculateMigrationScore({
      enabled: true, M1: 3, M2: 3, M3: 3, M4: 3, M5: [],
    })
    expect(withM5.migrationScore).toBeGreaterThan(withoutM5.migrationScore)
  })

  it('calculates known values correctly', () => {
    // M1=3 → urgency=3, M2=3 → adjusted=3, M3=3, M4=3 → ease=3, M5=[] → score=0
    // raw = (3×0.25)+(3×0.30)+(3×0.15)+(3×0.15)+(0×0.15)
    //     = 0.75+0.90+0.45+0.45+0 = 2.55
    // score = 2.55/5×100 = 51
    const result = calculateMigrationScore({
      enabled: true, M1: 3, M2: 3, M3: 3, M4: 3, M5: [],
    })
    expect(result.migrationScore).toBeCloseTo(51, 0)
    expect(result.band).toBe('prepare_first')
  })

  it('assigns correct band', () => {
    const dbAnswers = (m3: number): DBModuleAnswers => ({
      enabled: true, M1: 1, M2: 1, M3: m3, M4: 1, M5: ['gdpr', 'vendor_eol', 'growth', 'security', 'investors'],
    })
    // With all max except M3, vary M3 to hit different bands
    expect(calculateMigrationScore({ enabled: true, M1: 1, M2: 1, M3: 5, M4: 1, M5: ['gdpr', 'vendor_eol', 'growth', 'security', 'investors'] }).band).toBe('critical')
    expect(calculateMigrationScore({ enabled: true, M1: 3, M2: 3, M3: 3, M4: 3, M5: ['gdpr'] }).band).toBe('prepare_first')
  })
})

// ─── getScoreBand ─────────────────────────────────────────────────────────────

describe('getScoreBand', () => {
  it.each([
    [0,   'not_suitable'],
    [19,  'not_suitable'],
    [20,  'low'],
    [39,  'low'],
    [40,  'moderate'],
    [59,  'moderate'],
    [60,  'good'],
    [79,  'good'],
    [80,  'strong'],
    [100, 'strong'],
  ])('score %d → %s', (score, expected) => {
    expect(getScoreBand(score)).toBe(expected)
  })
})

// ─── getMigrationBand ─────────────────────────────────────────────────────────

describe('getMigrationBand', () => {
  it.each([
    [0,   'no_action'],
    [19,  'no_action'],
    [20,  'low_urgency'],
    [39,  'low_urgency'],
    [40,  'prepare_first'],
    [59,  'prepare_first'],
    [60,  'ready'],
    [79,  'ready'],
    [80,  'critical'],
    [100, 'critical'],
  ])('score %d → %s', (score, expected) => {
    expect(getMigrationBand(score)).toBe(expected)
  })
})

// ─── getAutomationBenchmark ───────────────────────────────────────────────────

describe('getAutomationBenchmark', () => {
  it.each([
    ['manufacturing', 61],
    ['logistics',     67],
    ['wholesale',     59],
    ['services',      55],
    ['retail',        52],
    ['other',         58],
  ] as const)('sector %s → %d%%', (sector, expected) => {
    expect(getAutomationBenchmark(sector)).toBe(expected)
  })
})

// ─── computeFullScore ─────────────────────────────────────────────────────────

describe('computeFullScore', () => {
  it('computes score from form state for single process', () => {
    const state = makeFormState()
    const result = computeFullScore(state)
    expect(result.processes).toHaveLength(1)
    expect(result.companyScore).toBeGreaterThan(0)
    expect(result.band).toBeDefined()
    expect(result.benchmarkPercent).toBe(61) // manufacturing benchmark
  })

  it('respects activeProcessCount — ignores processes beyond count', () => {
    const state = makeFormState({
      processes: [makeProcess(), makeProcess({ D1: 1, D4: 1 }), makeProcess()],
      activeProcessCount: 1,
    })
    const result = computeFullScore(state)
    expect(result.processes).toHaveLength(1)
  })

  it('includes all activeProcessCount processes', () => {
    const state = makeFormState({
      processes: [makeProcess(), makeProcess(), makeProcess()],
      activeProcessCount: 3,
    })
    const result = computeFullScore(state)
    expect(result.processes).toHaveLength(3)
  })

  it('sums annualHoursSaved across all processes', () => {
    const state = makeFormState({
      processes: [makeProcess({ hoursPerWeek: 10 }), makeProcess({ hoursPerWeek: 20 }), emptyProcess()],
      activeProcessCount: 2,
    })
    const result = computeFullScore(state)
    const p0 = result.processes[0].annualHoursSaved
    const p1 = result.processes[1].annualHoursSaved
    expect(result.totalAnnualHoursSaved).toBe(p0 + p1)
  })
})

// ─── buildWebhookPayload ──────────────────────────────────────────────────────

describe('buildWebhookPayload', () => {
  it('builds a payload matching the expected schema', () => {
    const state = makeFormState({ email: 'user@example.com' })
    const scoreResult = computeFullScore(state)
    const payload = buildWebhookPayload(state, scoreResult, null, '2026-05-26T10:00:00Z')

    expect(payload.email).toBe('user@example.com')
    expect(payload.language).toBe('en')
    expect(payload.sector).toBe('manufacturing')
    expect(payload.company_size).toBe('s')
    expect(payload.processes).toHaveLength(1)
    expect(payload.db_module_completed).toBe(false)
    expect(payload.db_scores).toBe(null)
    expect(payload.migration_score).toBe(null)
    expect(payload.submitted_at).toBe('2026-05-26T10:00:00Z')
  })

  it('includes db_scores when module is completed', () => {
    const state = makeFormState({
      dbModule: {
        enabled: true, M1: 2, M2: 3, M3: 4, M4: 2, M5: ['gdpr'],
      },
    })
    const scoreResult = computeFullScore(state)
    const migration = calculateMigrationScore(state.dbModule)
    const payload = buildWebhookPayload(state, scoreResult, migration, '2026-05-26T10:00:00Z')

    expect(payload.db_module_completed).toBe(true)
    expect(payload.db_scores).not.toBe(null)
    expect(payload.db_scores?.M5).toEqual(['gdpr'])
    expect(payload.migration_score).toBeGreaterThan(0)
  })

  it('process scores array includes knockout flag', () => {
    const state = makeFormState({
      processes: [makeProcess({ D8: 1 }), emptyProcess(), emptyProcess()],
      activeProcessCount: 1,
    })
    const scoreResult = computeFullScore(state)
    const payload = buildWebhookPayload(state, scoreResult, null, '2026-05-26T10:00:00Z')

    expect(payload.processes[0].knockout).toBe('no_compliance')
    expect(payload.processes[0].process_score).toBe(0)
  })
})
