'use client'

import { useState } from 'react'
import type { Dispatch } from 'react'
import type { FormState, AssessmentAction } from '@/lib/assessment/types'
import { getT, tmpl } from '@/lib/assessment/translations'
import { calculateProcessScore } from '@/lib/assessment/scoring'
import { ProcessForm, processComplete } from '../ProcessForm'
import { NavigationButtons } from '../NavigationButtons'

interface Step4Props {
  state: FormState
  dispatch: Dispatch<AssessmentAction>
}

export function Step4ProcessScore({ state, dispatch }: Step4Props) {
  const t = getT(state.language)
  const [formIndex, setFormIndex] = useState<1 | 2 | null>(null)

  const result = calculateProcessScore(state.processes[0], 0)
  const knockout = result.knockout
  const canSaveProcess = formIndex !== null && processComplete(state.processes[formIndex])

  function saveProcess() {
    if (formIndex === null) return
    dispatch({ type: 'SET_ACTIVE_PROCESS_COUNT', count: (formIndex + 1) as 2 | 3 })
    setFormIndex(null)
  }

  if (formIndex !== null) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="font-serif text-xl font-semibold text-[#37322F]">
          {tmpl(t.step2.headlineN, { n: formIndex + 1 })}
        </h2>
        <ProcessForm processIndex={formIndex} state={state} dispatch={dispatch} />
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setFormIndex(null)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#E0DEDB] bg-white px-4 text-sm font-medium text-[#605A57] transition-colors hover:border-[#605A57] hover:text-[#37322F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30"
          >
            {t.nav.back}
          </button>
          <button
            type="button"
            onClick={saveProcess}
            disabled={!canSaveProcess}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#37322F] px-5 text-sm font-medium text-[#FBFAF9] transition-all hover:bg-[#605A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.nav.next}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {knockout !== null ? (
        <div className="rounded-xl border border-[#E0DEDB] bg-[#F7F5F3] p-5">
          <p className="text-sm text-[#37322F] leading-relaxed">
            {t.step3.knockout[knockout]}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="max-w-sm text-center text-sm font-medium text-[#37322F]">
            {t.step3.scoreLocked}
          </p>
          <p className="max-w-sm text-center text-sm text-[#605A57] leading-relaxed">
            {t.step3.teaserSubtext}
          </p>
        </div>
      )}

      <h3 className="font-medium text-[#37322F]">{t.step4.headline}</h3>
      <p className="text-sm text-[#605A57] leading-relaxed">{t.step4.incentive}</p>

      <div className="flex flex-col gap-2">
        {state.activeProcessCount < 2 && (
          <button
            type="button"
            onClick={() => setFormIndex(1)}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#E0DEDB] text-sm font-medium text-[#605A57] transition-all hover:border-[#605A57] hover:text-[#37322F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30"
          >
            + {t.step4.addProcess2}
          </button>
        )}
        {state.activeProcessCount >= 2 && state.activeProcessCount < 3 && (
          <button
            type="button"
            onClick={() => setFormIndex(2)}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#E0DEDB] text-sm font-medium text-[#605A57] transition-all hover:border-[#605A57] hover:text-[#37322F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30"
          >
            + {t.step4.addProcess3}
          </button>
        )}
      </div>

      <NavigationButtons
        onBack={() => dispatch({ type: 'SET_STEP', step: 3 })}
        onNext={() => dispatch({ type: 'SET_STEP', step: 5 })}
        canAdvance={true}
        nextLabel={state.activeProcessCount < 2 ? t.step4.skip : t.nav.next}
        backLabel={t.nav.back}
        submitLabel={t.nav.submit}
      />
    </div>
  )
}
