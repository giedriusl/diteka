'use client'

import { useState } from 'react'
import type { Dispatch } from 'react'
import type { FormState, AssessmentAction } from '@/lib/assessment/types'
import { getT, tmpl } from '@/lib/assessment/translations'
import { computeFullScore, calculateMigrationScore, buildWebhookPayload } from '@/lib/assessment/scoring'
import { NavigationButtons } from '../NavigationButtons'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Step6Props {
  state: FormState
  dispatch: Dispatch<AssessmentAction>
}

export function Step6EmailGate({ state, dispatch }: Step6Props) {
  const t = getT(state.language)
  const [touched, setTouched] = useState(false)

  const scoreResult = computeFullScore(state)
  const isValidEmail = EMAIL_RE.test(state.email)
  const emailError = touched && !isValidEmail ? t.errors.invalidEmail : null
  const canAdvance = isValidEmail && state.submitStatus !== 'pending'

  async function handleSubmit() {
    setTouched(true)
    if (!isValidEmail) return

    dispatch({ type: 'SET_SUBMIT_STATUS', status: 'pending' })

    try {
      const migrationResult = state.dbModule.enabled
        ? calculateMigrationScore(state.dbModule)
        : null

      const payload = buildWebhookPayload(
        state,
        scoreResult,
        migrationResult,
        new Date().toISOString(),
      )

      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: t.errors.submitFailed })) as { error?: string }
        dispatch({
          type: 'SET_SUBMIT_STATUS',
          status: 'error',
          error: body.error ?? t.errors.submitFailed,
        })
        return
      }

      dispatch({ type: 'SET_SUBMIT_STATUS', status: 'success' })
      dispatch({ type: 'SET_STEP', step: 7 })
    } catch {
      dispatch({ type: 'SET_SUBMIT_STATUS', status: 'error', error: t.errors.submitFailed })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-2xl font-semibold text-[#37322F]">
          {tmpl(t.step6.teaserHeadline, { score: scoreResult.companyScore })}
        </h2>
        <p className="text-sm text-[#605A57] leading-relaxed">{t.step6.subtext}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="assessment-email" className="text-sm font-medium text-[#37322F]">
          {t.step6.emailLabel}
          <span aria-hidden="true" className="ml-1 text-[#ea580c]">*</span>
        </label>
        <input
          id="assessment-email"
          type="email"
          value={state.email}
          onChange={e => dispatch({ type: 'SET_EMAIL', email: e.target.value })}
          onBlur={() => setTouched(true)}
          placeholder={t.step6.emailPlaceholder}
          autoComplete="email"
          className="h-10 w-full max-w-sm rounded-lg border border-[#E0DEDB] bg-white px-3 text-sm text-[#37322F] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#37322F]/30"
          aria-invalid={emailError ? 'true' : undefined}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        {emailError && (
          <p id="email-error" className="text-xs text-[#ea580c]" role="alert">
            {emailError}
          </p>
        )}
      </div>

      <p className="text-xs text-[#605A57]">{t.step6.privacy}</p>

      {state.submitStatus === 'error' && state.submitError && (
        <p className="text-sm text-[#ea580c]" role="alert">{state.submitError}</p>
      )}

      <NavigationButtons
        onBack={() => dispatch({ type: 'SET_STEP', step: 5 })}
        onSubmit={handleSubmit}
        canAdvance={canAdvance}
        isSubmitting={state.submitStatus === 'pending'}
        nextLabel={t.nav.next}
        backLabel={t.nav.back}
        submitLabel={t.step6.submit}
      />
    </div>
  )
}
