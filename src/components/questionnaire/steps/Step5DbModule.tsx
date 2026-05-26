'use client'

import type { Dispatch } from 'react'
import { cn } from '@/lib/utils'
import type { FormState, AssessmentAction, M5UrgencySignal } from '@/lib/assessment/types'
import { getT } from '@/lib/assessment/translations'
import { QuestionBlock } from '../QuestionBlock'
import { LikertScale } from '../LikertScale'
import { NavigationButtons } from '../NavigationButtons'

interface Step5Props {
  state: FormState
  dispatch: Dispatch<AssessmentAction>
}

const M1234 = ['M1', 'M2', 'M3', 'M4'] as const
const M5_SIGNALS: M5UrgencySignal[] = ['gdpr', 'vendor_eol', 'growth', 'security', 'investors']

export function Step5DbModule({ state, dispatch }: Step5Props) {
  const t = getT(state.language)
  const db = state.dbModule

  const canAdvance = !db.enabled || (
    db.M1 !== null && db.M2 !== null && db.M3 !== null && db.M4 !== null
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-xl font-semibold text-[#37322F]">
          {t.step5.headline}
        </h2>
        <p className="text-sm text-[#605A57] leading-relaxed">{t.step5.subtext}</p>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={db.enabled}
          onChange={e => dispatch({ type: 'SET_DB_ENABLED', enabled: e.target.checked })}
          className="sr-only"
        />
        <span
          className={cn(
            'relative h-6 w-11 flex-shrink-0 rounded-full transition-colors',
            db.enabled ? 'bg-[#37322F]' : 'bg-[#E0DEDB]',
          )}
          aria-hidden="true"
        >
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              db.enabled ? 'translate-x-5' : 'translate-x-0.5',
            )}
          />
        </span>
        <span className="text-sm font-medium text-[#37322F]">{t.step5.toggleLabel}</span>
      </label>

      {db.enabled && (
        <div className="flex flex-col gap-6">
          {M1234.map(dim => {
            const dimData = t.step5[dim] as { label: string; 1: string; 2: string; 3: string; 4: string; 5: string }
            const options = [dimData[1], dimData[2], dimData[3], dimData[4], dimData[5]] as const
            return (
              <QuestionBlock key={dim} id={`db-${dim}`} label={dimData.label} required>
                <LikertScale
                  id={`db-${dim}`}
                  name={`db-${dim}`}
                  value={db[dim]}
                  onChange={v => dispatch({ type: 'SET_DB_FIELD', field: dim, value: v })}
                  options={options}
                  required
                />
              </QuestionBlock>
            )
          })}

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-[#37322F]">{t.step5.M5.label}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {M5_SIGNALS.map(signal => {
                const active = db.M5.includes(signal)
                return (
                  <label
                    key={signal}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-all',
                      'focus-within:ring-2 focus-within:ring-[#37322F]/30 focus-within:ring-offset-1',
                      active
                        ? 'border-[#37322F] bg-[#37322F] text-[#FBFAF9]'
                        : 'border-[#E0DEDB] bg-white text-[#37322F] hover:border-[#605A57] hover:bg-[#F7F5F3]',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => dispatch({ type: 'TOGGLE_M5_SIGNAL', signal })}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border',
                        active ? 'border-[#FBFAF9]/50' : 'border-[#E0DEDB] bg-white',
                      )}
                      aria-hidden="true"
                    >
                      {active && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {t.step5.M5[signal]}
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <NavigationButtons
        onBack={() => dispatch({ type: 'SET_STEP', step: 4 })}
        onNext={() => dispatch({ type: 'SET_STEP', step: 6 })}
        canAdvance={canAdvance}
        nextLabel={t.nav.next}
        backLabel={t.nav.back}
        submitLabel={t.nav.submit}
      />
    </div>
  )
}
