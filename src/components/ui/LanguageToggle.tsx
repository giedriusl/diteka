'use client'

import { cn } from '@/lib/utils'
import type { Language } from '@/lib/assessment/types'

interface LanguageToggleProps {
  language: Language
  onToggle: () => void
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={language === 'en' ? 'Switch to Lithuanian' : 'Switch to English'}
      className={cn(
        'inline-flex items-center gap-px rounded-lg border border-[#E0DEDB] bg-white p-0.5',
        'text-xs font-semibold shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30',
      )}
    >
      <span
        className={cn(
          'rounded-md px-2.5 py-1 transition-colors',
          language === 'en'
            ? 'bg-[#37322F] text-[#FBFAF9]'
            : 'text-[#605A57] hover:text-[#37322F]',
        )}
        aria-current={language === 'en' ? 'true' : undefined}
      >
        EN
      </span>
      <span
        className={cn(
          'rounded-md px-2.5 py-1 transition-colors',
          language === 'lt'
            ? 'bg-[#37322F] text-[#FBFAF9]'
            : 'text-[#605A57] hover:text-[#37322F]',
        )}
        aria-current={language === 'lt' ? 'true' : undefined}
      >
        LT
      </span>
    </button>
  )
}
