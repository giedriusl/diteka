import type { FormState, ProcessAnswers } from './types'

export const STORAGE_KEY = 'diteka_assessment_v1'

// ─── Initial state ────────────────────────────────────────────────────────────

const emptyProcess: ProcessAnswers = {
  name: '',
  D1: null, D2: null, D3: null, D4: null,
  D5: null, D6: null, D7: null, D8: null,
  hoursPerWeek: null,
}

export const initialFormState: FormState = {
  step: 0,
  language: 'en',
  stage: 1,
  company_name: '',
  sector: null,
  companySize: null,
  painPoint: null,
  c1: null,
  c2: null,
  directional_score: null,
  stage1_email: null,
  processes: [
    { ...emptyProcess },
    { ...emptyProcess },
    { ...emptyProcess },
  ],
  activeProcessCount: 1,
  dbModule: { enabled: false, M1: null, M2: null, M3: null, M4: null, M5: [] },
  email: '',
  submitStatus: 'idle',
  submitError: null,
}

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidState(value: unknown): value is FormState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.step === 'number' &&
    v.step >= 0 && v.step <= 7 &&
    (v.language === 'en' || v.language === 'lt') &&
    Array.isArray(v.processes) &&
    v.processes.length === 3 &&
    typeof v.email === 'string' &&
    typeof v.activeProcessCount === 'number'
  )
}

// ─── Storage helpers (pure — accept Storage as param for testability) ─────────

export function readSession(storage: Storage): FormState | null {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isValidState(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function writeSession(storage: Storage, state: FormState): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // sessionStorage may be unavailable (private browsing quota, etc.)
  }
}

export function clearSession(storage: Storage): void {
  try {
    storage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
