'use client'

import type { Dispatch } from 'react'
import type { FormState, AssessmentAction } from '@/lib/assessment/types'
import { getT } from '@/lib/assessment/translations'

interface Step0Props {
  state: FormState
  dispatch: Dispatch<AssessmentAction>
}

export function Step0Language({ dispatch }: Step0Props) {
  const t = getT('en')

  function selectLanguage(lang: 'en' | 'lt') {
    dispatch({ type: 'SET_LANGUAGE', language: lang })
    dispatch({ type: 'SET_STEP', step: 1 })
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <h1 className="font-serif text-2xl font-semibold text-[#37322F] text-center leading-snug">
        {t.step0.headline}
      </h1>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => selectLanguage('en')}
          className="inline-flex h-14 w-40 items-center justify-center rounded-xl border-2 border-[#37322F] bg-[#37322F] text-base font-semibold text-[#FBFAF9] transition-all hover:bg-[#605A57] hover:border-[#605A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30"
        >
          {t.step0.en}
        </button>
        <button
          type="button"
          onClick={() => selectLanguage('lt')}
          className="inline-flex h-14 w-40 items-center justify-center rounded-xl border-2 border-[#37322F] bg-white text-base font-semibold text-[#37322F] transition-all hover:bg-[#F7F5F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30"
        >
          {t.step0.lt}
        </button>
      </div>
    </div>
  )
}
