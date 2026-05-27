'use client'

import type { Dispatch } from 'react'
import { cn } from '@/lib/utils'
import type { FormState, AssessmentAction, SectorKey, CompanySizeKey, PainPointKey } from '@/lib/assessment/types'
import { getT } from '@/lib/assessment/translations'
import { LikertScale } from '../LikertScale'
import { QuestionBlock } from '../QuestionBlock'
import { NavigationButtons } from '../NavigationButtons'

interface Step1Props {
  state: FormState
  dispatch: Dispatch<AssessmentAction>
}

const SIZES: CompanySizeKey[] = ['xs', 's', 'm', 'l']
const SECTORS: SectorKey[] = ['manufacturing', 'logistics', 'wholesale', 'services', 'retail', 'other']
const PAIN_POINTS: PainPointKey[] = ['staff', 'errors', 'overload', 'compliance', 'volume', 'other']

const cardBase =
  'flex cursor-pointer items-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-all focus-within:ring-2 focus-within:ring-[#37322F]/30 focus-within:ring-offset-1'
const cardActive = 'border-[#37322F] bg-[#37322F] text-[#FBFAF9]'
const cardIdle = 'border-[#E0DEDB] bg-white text-[#37322F] hover:border-[#605A57] hover:bg-[#F7F5F3]'

export function Step1Context({ state, dispatch }: Step1Props) {
  const t = getT(state.language)

  const canAdvance =
    state.company_name.trim().length > 0 &&
    state.sector !== null &&
    state.companySize !== null &&
    state.painPoint !== null &&
    state.c1 !== null &&
    state.c2 !== null

  const c1Options = [
    t.step1.c1[1], t.step1.c1[2], t.step1.c1[3], t.step1.c1[4], t.step1.c1[5],
  ] as const

  const c2Options = [
    t.step1.c2[1], t.step1.c2[2], t.step1.c2[3], t.step1.c2[4], t.step1.c2[5],
  ] as const

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-serif text-xl font-semibold text-[#37322F]">
        {t.step1.headline}
      </h2>

      {/* Q1.0 — Company Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="company-name" className="text-sm font-medium text-[#37322F]">
          {t.step1.companyName.label}
          <span aria-hidden="true" className="ml-1 text-[#ea580c]">*</span>
        </label>
        <input
          id="company-name"
          type="text"
          value={state.company_name}
          onChange={e => dispatch({ type: 'SET_COMPANY_NAME', name: e.target.value })}
          placeholder={t.step1.companyName.placeholder}
          maxLength={100}
          className="h-10 w-full rounded-lg border border-[#E0DEDB] bg-white px-3 text-sm text-[#37322F] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#37322F]/30"
          required
        />
      </div>

      {/* Q1.1 — Company Size */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-[#37322F]">
          {t.step1.companySize.label}
          <span aria-hidden="true" className="ml-1 text-[#ea580c]">*</span>
        </legend>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map(size => (
            <label key={size} className={cn(cardBase, 'justify-center', state.companySize === size ? cardActive : cardIdle)}>
              <input
                type="radio"
                name="companySize"
                value={size}
                checked={state.companySize === size}
                onChange={() => dispatch({ type: 'SET_COMPANY_SIZE', size })}
                className="sr-only"
              />
              {t.step1.companySize[size]}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Q1.2 — Sector */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-[#37322F]">
          {t.step1.sector.label}
          <span aria-hidden="true" className="ml-1 text-[#ea580c]">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SECTORS.map(sector => (
            <label key={sector} className={cn(cardBase, state.sector === sector ? cardActive : cardIdle)}>
              <input
                type="radio"
                name="sector"
                value={sector}
                checked={state.sector === sector}
                onChange={() => dispatch({ type: 'SET_SECTOR', sector })}
                className="sr-only"
              />
              {t.step1.sector[sector]}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Q1.3 — Pain Point */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-[#37322F]">
          {t.step1.painPoint.label}
          <span aria-hidden="true" className="ml-1 text-[#ea580c]">*</span>
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PAIN_POINTS.map(pp => (
            <label key={pp} className={cn(cardBase, state.painPoint === pp ? cardActive : cardIdle)}>
              <input
                type="radio"
                name="painPoint"
                value={pp}
                checked={state.painPoint === pp}
                onChange={() => dispatch({ type: 'SET_PAIN_POINT', painPoint: pp })}
                className="sr-only"
              />
              {t.step1.painPoint[pp]}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Q1.4 — Rule-Basedness Proxy (C1) */}
      <QuestionBlock id="step1-c1" label={t.step1.c1.label} required>
        <LikertScale
          id="step1-c1"
          name="step1-c1"
          value={state.c1}
          onChange={v => dispatch({ type: 'SET_C1', value: v })}
          options={c1Options}
          required
        />
      </QuestionBlock>

      {/* Q1.5 — Input Digitisation Proxy (C2) */}
      <QuestionBlock id="step1-c2" label={t.step1.c2.label} required>
        <LikertScale
          id="step1-c2"
          name="step1-c2"
          value={state.c2}
          onChange={v => dispatch({ type: 'SET_C2', value: v })}
          options={c2Options}
          required
        />
      </QuestionBlock>

      <NavigationButtons
        onBack={() => dispatch({ type: 'SET_STEP', step: 0 })}
        onNext={() => dispatch({ type: 'SET_STEP', step: 2 })}
        canAdvance={canAdvance}
        nextLabel={t.nav.next}
        backLabel={t.nav.back}
        submitLabel={t.nav.submit}
      />
    </div>
  )
}
