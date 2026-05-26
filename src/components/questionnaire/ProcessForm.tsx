'use client'

import type { Dispatch } from 'react'
import type { FormState, AssessmentAction, ProcessAnswers } from '@/lib/assessment/types'
import { getT } from '@/lib/assessment/translations'
import { QuestionBlock } from './QuestionBlock'
import { LikertScale } from './LikertScale'

const DIMS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'] as const
type DimKey = (typeof DIMS)[number]

export function processComplete(p: ProcessAnswers): boolean {
  return (
    p.name.trim().length > 0 &&
    p.D1 !== null && p.D2 !== null && p.D3 !== null && p.D4 !== null &&
    p.D5 !== null && p.D6 !== null && p.D7 !== null && p.D8 !== null &&
    p.hoursPerWeek !== null && p.hoursPerWeek >= 1 && p.hoursPerWeek <= 500
  )
}

interface ProcessFormProps {
  processIndex: 0 | 1 | 2
  state: FormState
  dispatch: Dispatch<AssessmentAction>
}

export function ProcessForm({ processIndex, state, dispatch }: ProcessFormProps) {
  const t = getT(state.language)
  const p = state.processes[processIndex]
  const pfx = `process-${processIndex}`

  function set(field: keyof ProcessAnswers, value: string | number | null) {
    dispatch({ type: 'SET_PROCESS_FIELD', index: processIndex, field, value })
  }

  const hoursError =
    p.hoursPerWeek !== null && (p.hoursPerWeek < 1 || p.hoursPerWeek > 500)
      ? t.errors.hoursRange
      : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${pfx}-name`} className="text-sm font-medium text-[#37322F]">
          {t.step2.processName.label}
          <span aria-hidden="true" className="ml-1 text-[#ea580c]">*</span>
        </label>
        <input
          id={`${pfx}-name`}
          type="text"
          value={p.name}
          onChange={e => set('name', e.target.value)}
          placeholder={t.step2.processName.placeholder}
          className="h-10 w-full rounded-lg border border-[#E0DEDB] bg-white px-3 text-sm text-[#37322F] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#37322F]/30"
          required
        />
      </div>

      {DIMS.map(dim => {
        const dimData = t.step2[dim] as { label: string; 1: string; 2: string; 3: string; 4: string; 5: string }
        const options = [dimData[1], dimData[2], dimData[3], dimData[4], dimData[5]] as const
        return (
          <QuestionBlock key={dim} id={`${pfx}-${dim}`} label={dimData.label} required>
            <LikertScale
              id={`${pfx}-${dim}`}
              name={`${pfx}-${dim}`}
              value={p[dim as DimKey]}
              onChange={v => set(dim, v)}
              options={options}
              required
            />
          </QuestionBlock>
        )
      })}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${pfx}-hours`} className="text-sm font-medium text-[#37322F]">
          {t.step2.hoursPerWeek.label}
          <span aria-hidden="true" className="ml-1 text-[#ea580c]">*</span>
        </label>
        <input
          id={`${pfx}-hours`}
          type="number"
          min={1}
          max={500}
          value={p.hoursPerWeek ?? ''}
          onChange={e => set('hoursPerWeek', e.target.value === '' ? null : Number(e.target.value))}
          placeholder={t.step2.hoursPerWeek.placeholder}
          className="h-10 w-48 rounded-lg border border-[#E0DEDB] bg-white px-3 text-sm text-[#37322F] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#37322F]/30"
        />
        {hoursError && (
          <p className="text-xs text-[#ea580c]" role="alert">{hoursError}</p>
        )}
      </div>
    </div>
  )
}
