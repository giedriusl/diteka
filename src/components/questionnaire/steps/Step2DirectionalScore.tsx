'use client'

import { useState } from 'react'
import type { Dispatch } from 'react'
import type { FormState, AssessmentAction } from '@/lib/assessment/types'
import { getT, tmpl } from '@/lib/assessment/translations'
import { calculateDirectionalScore, getScoreBand, getAutomationBenchmark } from '@/lib/assessment/scoring'
import { ScoreArc } from '../ScoreArc'

interface Step2Props {
  state: FormState
  dispatch: Dispatch<AssessmentAction>
}

export function Step2DirectionalScore({ state, dispatch }: Step2Props) {
  const t = getT(state.language)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const score = calculateDirectionalScore(state.c1 ?? 3, state.c2 ?? 3)
  const band = getScoreBand(score)
  const benchmark = state.sector ? getAutomationBenchmark(state.sector) : 50

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!emailValue.includes('@')) return
    dispatch({ type: 'SET_STAGE1_EMAIL', email: emailValue })
    await fetch('/api/assessment/stage1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailValue,
        language: state.language,
        company_name: state.company_name,
        sector: state.sector,
        company_size: state.companySize,
        pain_point: state.painPoint,
        directional_score: score,
      }),
    }).catch(() => {/* fire-and-forget */})
    setEmailSent(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 py-2">
        <ScoreArc score={score} band={band} animationDurationMs={1200} />

        <h2 className="font-serif text-xl font-semibold text-[#37322F] text-center">
          {tmpl(t.step2_directional.headline, { score })}
        </h2>

        <p className="max-w-sm text-center text-sm text-[#605A57] leading-relaxed">
          {tmpl(t.step2_directional.benchmark, { benchmark })}
          {' '}
          <span className="text-xs text-[#9ca3af]">({t.step2_directional.benchmarkSource})</span>
        </p>

        <p className="max-w-sm text-center text-xs text-[#9ca3af] leading-relaxed">
          {t.step2_directional.disclaimer}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'SET_DIRECTIONAL_SCORE', score })
            dispatch({ type: 'SET_STEP', step: 3 })
          }}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#37322F] px-5 text-sm font-medium text-[#FBFAF9] transition-all hover:bg-[#605A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30"
        >
          {t.step2_directional.primaryCta}
        </button>

        {!showEmailForm && !emailSent && (
          <button
            type="button"
            onClick={() => setShowEmailForm(true)}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#E0DEDB] bg-white px-5 text-sm font-medium text-[#605A57] transition-colors hover:border-[#605A57] hover:text-[#37322F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30"
          >
            {t.step2_directional.secondaryCta}
          </button>
        )}

        {showEmailForm && !emailSent && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2">
            <label htmlFor="stage1-email" className="text-sm font-medium text-[#37322F]">
              {t.step2_directional.emailLabel}
            </label>
            <div className="flex gap-2">
              <input
                id="stage1-email"
                type="email"
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
                placeholder={t.step2_directional.emailPlaceholder}
                required
                className="h-10 flex-1 rounded-lg border border-[#E0DEDB] bg-white px-3 text-sm text-[#37322F] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#37322F]/30"
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center rounded-lg bg-[#37322F] px-4 text-sm font-medium text-[#FBFAF9] hover:bg-[#605A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30 disabled:opacity-40"
                disabled={!emailValue.includes('@')}
              >
                {t.step2_directional.emailSubmit}
              </button>
            </div>
          </form>
        )}

        {emailSent && (
          <p className="rounded-lg border border-[#E0DEDB] bg-[#F7F5F3] px-4 py-3 text-sm text-[#605A57] text-center">
            {t.step2_directional.emailSent}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
        className="text-sm text-[#9ca3af] underline underline-offset-2 hover:text-[#605A57] self-start"
      >
        {t.nav.back}
      </button>
    </div>
  )
}
