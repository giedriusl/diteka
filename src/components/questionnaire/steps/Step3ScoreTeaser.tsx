'use client'

import type { Dispatch } from 'react'
import type { FormState, AssessmentAction } from '@/lib/assessment/types'
import { getT, tmpl } from '@/lib/assessment/translations'
import { calculateProcessScore, getScoreBand } from '@/lib/assessment/scoring'
import { ScoreArc } from '../ScoreArc'
import { NavigationButtons } from '../NavigationButtons'

interface Step3Props {
  state: FormState
  dispatch: Dispatch<AssessmentAction>
}

export function Step3ScoreTeaser({ state, dispatch }: Step3Props) {
  const t = getT(state.language)
  const result = calculateProcessScore(state.processes[0], 0)
  const knockout = result.knockout
  const band = getScoreBand(result.processScore)

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
          <h2 className="font-serif text-xl font-semibold text-[#37322F] text-center">
            {tmpl(t.step3.teaserHeadline, { n: 1, score: result.processScore })}
          </h2>
          <ScoreArc score={result.processScore} band={band} />
          <p className="max-w-sm text-center text-sm text-[#605A57] leading-relaxed">
            {t.step3.teaserSubtext}
          </p>
        </div>
      )}

      <NavigationButtons
        onBack={() => dispatch({ type: 'SET_STEP', step: 2 })}
        onNext={() => dispatch({ type: 'SET_STEP', step: 4 })}
        canAdvance={true}
        nextLabel={knockout !== null ? t.nav.next : t.step3.cta}
        backLabel={t.nav.back}
        submitLabel={t.nav.submit}
      />
    </div>
  )
}
