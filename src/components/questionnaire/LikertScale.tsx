'use client'

import { cn } from '@/lib/utils'
import styles from './questionnaire.module.css'

interface LikertScaleProps {
  id: string
  name: string
  value: number | null
  onChange: (value: number) => void
  options: readonly [string, string, string, string, string]
  required?: boolean
}

export function LikertScale({
  id,
  name,
  value,
  onChange,
  options,
  required = false,
}: LikertScaleProps) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      aria-required={required}
      className={styles.likertGrid}
    >
      {options.map((label, i) => {
        const score = i + 1
        const checked = value === score
        const inputId = `${id}-${score}`

        return (
          <label
            key={score}
            htmlFor={inputId}
            className={cn(
              'relative flex cursor-pointer flex-col gap-2 rounded-lg border px-3 py-3 text-xs leading-snug transition-all',
              'focus-within:ring-2 focus-within:ring-[#37322F]/30 focus-within:ring-offset-1',
              checked
                ? 'border-[#37322F] bg-[#37322F] text-[#FBFAF9]'
                : 'border-[#E0DEDB] bg-white text-[#37322F] hover:border-[#605A57] hover:bg-[#F7F5F3]',
            )}
          >
            <input
              type="radio"
              id={inputId}
              name={name}
              value={score}
              checked={checked}
              onChange={() => onChange(score)}
              required={required && value === null}
              className="sr-only"
            />
            <span
              className={cn(
                'text-[10px] font-semibold tabular-nums',
                checked ? 'text-[#FBFAF9]/60' : 'text-[#605A57]',
              )}
            >
              {score}
            </span>
            {label}
          </label>
        )
      })}
    </div>
  )
}
