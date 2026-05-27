import { describe, it, expect } from 'vitest'
import { assessmentReducer } from './useAssessmentSession'
import { initialFormState } from '@/lib/assessment/session'
import type { FormState } from '@/lib/assessment/types'

function state(overrides: Partial<FormState> = {}): FormState {
  return { ...initialFormState, ...overrides }
}

describe('assessmentReducer', () => {
  it('SET_LANGUAGE updates language', () => {
    const next = assessmentReducer(state(), { type: 'SET_LANGUAGE', language: 'lt' })
    expect(next.language).toBe('lt')
  })

  it('SET_STEP updates step', () => {
    const next = assessmentReducer(state(), { type: 'SET_STEP', step: 3 })
    expect(next.step).toBe(3)
  })

  it('SET_SECTOR updates sector', () => {
    const next = assessmentReducer(state(), { type: 'SET_SECTOR', sector: 'logistics' })
    expect(next.sector).toBe('logistics')
  })

  it('SET_COMPANY_SIZE updates companySize', () => {
    const next = assessmentReducer(state(), { type: 'SET_COMPANY_SIZE', size: 'm' })
    expect(next.companySize).toBe('m')
  })

  it('SET_PAIN_POINT updates painPoint', () => {
    const next = assessmentReducer(state(), { type: 'SET_PAIN_POINT', painPoint: 'errors' })
    expect(next.painPoint).toBe('errors')
  })

  it('SET_STAGE updates stage', () => {
    const next = assessmentReducer(state(), { type: 'SET_STAGE', stage: 2 })
    expect(next.stage).toBe(2)
  })

  it('SET_COMPANY_NAME updates company_name', () => {
    const next = assessmentReducer(state(), { type: 'SET_COMPANY_NAME', name: 'UAB Test' })
    expect(next.company_name).toBe('UAB Test')
  })

  it('SET_C1 updates c1', () => {
    const next = assessmentReducer(state(), { type: 'SET_C1', value: 4 })
    expect(next.c1).toBe(4)
  })

  it('SET_C2 updates c2', () => {
    const next = assessmentReducer(state(), { type: 'SET_C2', value: 3 })
    expect(next.c2).toBe(3)
  })

  it('SET_DIRECTIONAL_SCORE updates directional_score', () => {
    const next = assessmentReducer(state(), { type: 'SET_DIRECTIONAL_SCORE', score: 72 })
    expect(next.directional_score).toBe(72)
  })

  it('SET_STAGE1_EMAIL updates stage1_email', () => {
    const next = assessmentReducer(state(), { type: 'SET_STAGE1_EMAIL', email: 'early@test.com' })
    expect(next.stage1_email).toBe('early@test.com')
  })

  it('RESET preserves language', () => {
    const modified = state({ step: 5, language: 'lt', company_name: 'UAB Test' })
    const next = assessmentReducer(modified, { type: 'RESET' })
    expect(next.step).toBe(0)
    expect(next.language).toBe('lt')
    expect(next.company_name).toBe('')
  })

  it('SET_PROCESS_FIELD updates correct process at given index', () => {
    const next = assessmentReducer(state(), {
      type: 'SET_PROCESS_FIELD', index: 1, field: 'D1', value: 4,
    })
    expect(next.processes[1].D1).toBe(4)
    expect(next.processes[0].D1).toBe(null)
    expect(next.processes[2].D1).toBe(null)
  })

  it('SET_PROCESS_FIELD updates process name', () => {
    const next = assessmentReducer(state(), {
      type: 'SET_PROCESS_FIELD', index: 0, field: 'name', value: 'Invoice processing',
    })
    expect(next.processes[0].name).toBe('Invoice processing')
  })

  it('SET_PROCESS_FIELD does not mutate other processes', () => {
    const before = state()
    const next = assessmentReducer(before, {
      type: 'SET_PROCESS_FIELD', index: 0, field: 'D1', value: 3,
    })
    expect(next.processes).not.toBe(before.processes)
    expect(next.processes[1]).toBe(before.processes[1])
    expect(next.processes[2]).toBe(before.processes[2])
  })

  it('SET_ACTIVE_PROCESS_COUNT updates count', () => {
    const next = assessmentReducer(state(), { type: 'SET_ACTIVE_PROCESS_COUNT', count: 3 })
    expect(next.activeProcessCount).toBe(3)
  })

  it('SET_DB_ENABLED enables db module', () => {
    const next = assessmentReducer(state(), { type: 'SET_DB_ENABLED', enabled: true })
    expect(next.dbModule.enabled).toBe(true)
  })

  it('SET_DB_FIELD updates a migration field', () => {
    const next = assessmentReducer(state(), { type: 'SET_DB_FIELD', field: 'M3', value: 4 })
    expect(next.dbModule.M3).toBe(4)
  })

  it('TOGGLE_M5_SIGNAL adds signal when not present', () => {
    const next = assessmentReducer(state(), { type: 'TOGGLE_M5_SIGNAL', signal: 'gdpr' })
    expect(next.dbModule.M5).toContain('gdpr')
  })

  it('TOGGLE_M5_SIGNAL removes signal when already present', () => {
    const withSignal = state({ dbModule: { ...initialFormState.dbModule, M5: ['gdpr', 'growth'] } })
    const next = assessmentReducer(withSignal, { type: 'TOGGLE_M5_SIGNAL', signal: 'gdpr' })
    expect(next.dbModule.M5).not.toContain('gdpr')
    expect(next.dbModule.M5).toContain('growth')
  })

  it('SET_EMAIL updates email', () => {
    const next = assessmentReducer(state(), { type: 'SET_EMAIL', email: 'hello@test.com' })
    expect(next.email).toBe('hello@test.com')
  })

  it('SET_SUBMIT_STATUS updates status and clears error', () => {
    const next = assessmentReducer(state(), { type: 'SET_SUBMIT_STATUS', status: 'pending' })
    expect(next.submitStatus).toBe('pending')
    expect(next.submitError).toBe(null)
  })

  it('SET_SUBMIT_STATUS stores error message', () => {
    const next = assessmentReducer(state(), {
      type: 'SET_SUBMIT_STATUS', status: 'error', error: 'Network failure',
    })
    expect(next.submitStatus).toBe('error')
    expect(next.submitError).toBe('Network failure')
  })

  it('RESTORE_SESSION replaces entire state', () => {
    const saved: FormState = { ...initialFormState, step: 6, email: 'saved@test.com' }
    const next = assessmentReducer(state(), { type: 'RESTORE_SESSION', state: saved })
    expect(next.step).toBe(6)
    expect(next.email).toBe('saved@test.com')
  })

  it('RESET returns initial state', () => {
    const modified = state({ step: 5, email: 'x@x.com', sector: 'retail' })
    const next = assessmentReducer(modified, { type: 'RESET' })
    expect(next.step).toBe(0)
    expect(next.email).toBe('')
    expect(next.sector).toBe(null)
  })

  it('does not mutate the input state', () => {
    const before = state()
    const frozen = Object.freeze(before)
    expect(() =>
      assessmentReducer(frozen as FormState, { type: 'SET_LANGUAGE', language: 'lt' })
    ).not.toThrow()
  })
})
