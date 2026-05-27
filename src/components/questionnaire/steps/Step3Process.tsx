'use client'

import type { Dispatch } from 'react'
import type { FormState, AssessmentAction } from '@/lib/assessment/types'
import { getT } from '@/lib/assessment/translations'
import { ProcessForm, processComplete } from '../ProcessForm'
import { NavigationButtons } from '../NavigationButtons'

interface Step3Props {
  state: FormState
  dispatch: Dispatch<AssessmentAction>
}

export function Step3Process({ state, dispatch }: Step3Props) {
  const t = getT(state.language)
  const canAdvance = processComplete(state.processes[0])

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-serif text-xl font-semibold text-[#37322F]">
        {t.step2.headline}
      </h2>
      <ProcessForm processIndex={0} state={state} dispatch={dispatch} />
      <NavigationButtons
        onBack={() => dispatch({ type: 'SET_STEP', step: 2 })}
        onNext={() => dispatch({ type: 'SET_STEP', step: 4 })}
        canAdvance={canAdvance}
        nextLabel={t.nav.next}
        backLabel={t.nav.back}
        submitLabel={t.nav.submit}
      />
    </div>
  )
}
