'use client'

import { useState } from 'react'
import type { Dispatch } from 'react'
import type { FormState, AssessmentAction } from '@/lib/assessment/types'
import { getT, tmpl } from '@/lib/assessment/translations'
import { computeFullScore, calculateMigrationScore, buildWebhookPayload } from '@/lib/assessment/scoring'
import { ScoreArc } from '../ScoreArc'

interface Step7Props {
  state: FormState
  dispatch: Dispatch<AssessmentAction>
}

export function Step7ThankYou({ state, dispatch }: Step7Props) {
  const t = getT(state.language)
  const [downloading, setDownloading] = useState(false)

  const scoreResult = computeFullScore(state)
  const migrationResult = state.dbModule.enabled ? calculateMigrationScore(state.dbModule) : null
  const bandLabel = t.step7.bands[scoreResult.band]

  async function downloadPdf() {
    setDownloading(true)
    try {
      const payload = buildWebhookPayload(
        state,
        scoreResult,
        migrationResult,
        new Date().toISOString(),
      )
      const res = await fetch('/api/assessment/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('PDF generation failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Diteka_Automation_Report.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  const topProcess = scoreResult.processes
    .filter(p => p.knockout === null)
    .sort((a, b) => b.processScore - a.processScore)[0]

  const hoursSaved = topProcess?.annualHoursSaved ?? 0
  const daysSaved = Math.round(hoursSaved / 8)

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <h2 className="font-serif text-2xl font-semibold text-[#37322F] text-center leading-snug">
        {tmpl(t.step7.headline, { score: scoreResult.companyScore })}
      </h2>

      <ScoreArc
        score={scoreResult.companyScore}
        band={scoreResult.band}
        bandLabel={bandLabel}
        size={220}
      />

      <div className="flex w-full max-w-sm flex-col gap-3 text-center text-sm leading-relaxed text-[#605A57]">
        <p>
          {tmpl(t.step7.benchmark, {
            benchmark: scoreResult.benchmarkPercent,
            score: scoreResult.companyScore,
          })}
          {' '}
          <a
            href="https://www.mckinsey.com/featured-insights/digital-disruption/harnessing-automation-for-a-future-that-works"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#9ca3af] underline underline-offset-2 hover:text-[#605A57]"
          >
            McKinsey MGI, 2017
          </a>
        </p>
        {hoursSaved > 0 && (
          <p>
            {tmpl(t.step7.hoursSaved, { hours: hoursSaved, days: daysSaved })}
          </p>
        )}
        <p className="font-medium text-[#37322F]">
          {tmpl(t.step7.emailSent, { email: state.email })}
        </p>
      </div>

      {migrationResult && (
        <div className="w-full max-w-sm rounded-xl border border-[#E0DEDB] bg-[#F7F5F3] p-4">
          <p className="text-sm font-semibold text-[#37322F]">{t.step7.migration.headline}</p>
          <p className="mt-1 text-sm text-[#605A57]">
            {tmpl(t.step7.migration.score, { score: migrationResult.migrationScore })}
          </p>
          <span className="mt-1 inline-block text-xs font-semibold text-[#37322F]">
            {t.step7.migration.bands[migrationResult.band]}
          </span>
        </div>
      )}

      <div className="flex w-full max-w-sm flex-col items-center gap-2">
        <a
          href="#"
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#37322F] px-6 text-sm font-medium text-[#FBFAF9] transition-all hover:bg-[#605A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30"
        >
          {t.step7.calendarCta}
        </a>
        <p className="text-xs text-[#605A57]">{t.step7.calendarSubtext}</p>

        <button
          type="button"
          onClick={downloadPdf}
          disabled={downloading}
          className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E0DEDB] bg-white px-6 text-sm font-medium text-[#37322F] transition-all hover:border-[#605A57] hover:bg-[#F7F5F3] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30"
        >
          {downloading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-[#37322F]/20 border-t-[#37322F]" aria-hidden="true" />
              Generating…
            </>
          ) : (
            'Download PDF Report'
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'RESET' })}
        className="text-xs text-[#605A57] underline underline-offset-2 hover:text-[#37322F]"
      >
        {state.language === 'lt' ? 'Pradėti iš naujo' : 'Start over'}
      </button>
    </div>
  )
}
