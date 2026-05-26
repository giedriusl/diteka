import { describe, it, expect, beforeEach } from 'vitest'
import { readSession, writeSession, clearSession, initialFormState, STORAGE_KEY } from './session'
import type { FormState } from './types'

// ─── In-memory Storage stub ───────────────────────────────────────────────────

class MemoryStorage implements Storage {
  private store: Record<string, string> = {}
  get length() { return Object.keys(this.store).length }
  key(index: number) { return Object.keys(this.store)[index] ?? null }
  getItem(key: string) { return this.store[key] ?? null }
  setItem(key: string, value: string) { this.store[key] = value }
  removeItem(key: string) { delete this.store[key] }
  clear() { this.store = {} }
}

let storage: MemoryStorage

beforeEach(() => {
  storage = new MemoryStorage()
})

// ─── readSession ──────────────────────────────────────────────────────────────

describe('readSession', () => {
  it('returns null when storage is empty', () => {
    expect(readSession(storage)).toBe(null)
  })

  it('returns null when stored value is invalid JSON', () => {
    storage.setItem(STORAGE_KEY, 'not-json{{')
    expect(readSession(storage)).toBe(null)
  })

  it('returns null when stored object is missing required fields', () => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ step: 1 }))
    expect(readSession(storage)).toBe(null)
  })

  it('returns null when step is out of range', () => {
    const bad = { ...initialFormState, step: 99 }
    storage.setItem(STORAGE_KEY, JSON.stringify(bad))
    expect(readSession(storage)).toBe(null)
  })

  it('returns null when language is invalid', () => {
    const bad = { ...initialFormState, language: 'de' }
    storage.setItem(STORAGE_KEY, JSON.stringify(bad))
    expect(readSession(storage)).toBe(null)
  })

  it('returns the saved state when valid', () => {
    writeSession(storage, initialFormState)
    const result = readSession(storage)
    expect(result).toEqual(initialFormState)
  })

  it('round-trips a modified state correctly', () => {
    const modified: FormState = {
      ...initialFormState,
      step: 3,
      language: 'lt',
      sector: 'manufacturing',
      email: 'test@example.com',
    }
    writeSession(storage, modified)
    const result = readSession(storage)
    expect(result?.step).toBe(3)
    expect(result?.language).toBe('lt')
    expect(result?.sector).toBe('manufacturing')
    expect(result?.email).toBe('test@example.com')
  })
})

// ─── writeSession ─────────────────────────────────────────────────────────────

describe('writeSession', () => {
  it('writes serialised state under the correct key', () => {
    writeSession(storage, initialFormState)
    const raw = storage.getItem(STORAGE_KEY)
    expect(raw).not.toBe(null)
    expect(JSON.parse(raw!)).toMatchObject({ step: 0, language: 'en' })
  })

  it('overwrites a previous value', () => {
    writeSession(storage, initialFormState)
    writeSession(storage, { ...initialFormState, step: 5 })
    const result = readSession(storage)
    expect(result?.step).toBe(5)
  })
})

// ─── clearSession ─────────────────────────────────────────────────────────────

describe('clearSession', () => {
  it('removes the key from storage', () => {
    writeSession(storage, initialFormState)
    clearSession(storage)
    expect(storage.getItem(STORAGE_KEY)).toBe(null)
  })

  it('does not throw when key does not exist', () => {
    expect(() => clearSession(storage)).not.toThrow()
  })
})

// ─── initialFormState ─────────────────────────────────────────────────────────

describe('initialFormState', () => {
  it('has exactly 3 process slots', () => {
    expect(initialFormState.processes).toHaveLength(3)
  })

  it('starts at step 0', () => {
    expect(initialFormState.step).toBe(0)
  })

  it('all process slots start with null scores', () => {
    for (const p of initialFormState.processes) {
      expect(p.D1).toBe(null)
      expect(p.D8).toBe(null)
      expect(p.hoursPerWeek).toBe(null)
    }
  })

  it('dbModule starts disabled with empty M5', () => {
    expect(initialFormState.dbModule.enabled).toBe(false)
    expect(initialFormState.dbModule.M5).toEqual([])
  })
})
