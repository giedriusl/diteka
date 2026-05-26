'use client'

import { useReducer, useEffect, useRef } from 'react'
import type { FormState, AssessmentAction } from '@/lib/assessment/types'
import { initialFormState, readSession, writeSession } from '@/lib/assessment/session'

// ─── Reducer ──────────────────────────────────────────────────────────────────

export function assessmentReducer(state: FormState, action: AssessmentAction): FormState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.language }

    case 'SET_STEP':
      return { ...state, step: action.step }

    case 'SET_SECTOR':
      return { ...state, sector: action.sector }

    case 'SET_COMPANY_SIZE':
      return { ...state, companySize: action.size }

    case 'SET_PAIN_POINT':
      return { ...state, painPoint: action.painPoint }

    case 'SET_PROCESS_FIELD': {
      const processes = state.processes.map((p, i) =>
        i === action.index ? { ...p, [action.field]: action.value } : p,
      ) as FormState['processes']
      return { ...state, processes }
    }

    case 'SET_ACTIVE_PROCESS_COUNT':
      return { ...state, activeProcessCount: action.count }

    case 'SET_DB_ENABLED':
      return { ...state, dbModule: { ...state.dbModule, enabled: action.enabled } }

    case 'SET_DB_FIELD':
      return { ...state, dbModule: { ...state.dbModule, [action.field]: action.value } }

    case 'TOGGLE_M5_SIGNAL': {
      const current = state.dbModule.M5
      const next = current.includes(action.signal)
        ? current.filter(s => s !== action.signal)
        : [...current, action.signal]
      return { ...state, dbModule: { ...state.dbModule, M5: next } }
    }

    case 'SET_EMAIL':
      return { ...state, email: action.email }

    case 'SET_SUBMIT_STATUS':
      return {
        ...state,
        submitStatus: action.status,
        submitError: action.error ?? null,
      }

    case 'RESTORE_SESSION':
      return action.state

    case 'RESET':
      return { ...initialFormState }

    default:
      return state
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAssessmentSession() {
  const [state, dispatch] = useReducer(assessmentReducer, initialFormState)
  const hydratedRef = useRef(false)

  // Restore from sessionStorage once on mount (client only)
  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true

    const saved = readSession(sessionStorage)
    if (saved) {
      dispatch({ type: 'RESTORE_SESSION', state: saved })
    }
  }, [])

  // Persist to sessionStorage on every state change after hydration
  useEffect(() => {
    if (!hydratedRef.current) return
    writeSession(sessionStorage, state)
  }, [state])

  return { state, dispatch }
}
