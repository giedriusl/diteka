'use client'

import { cn } from '@/lib/utils'

interface NavigationButtonsProps {
  onBack?: () => void
  onNext?: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
  nextLabel: string
  backLabel: string
  submitLabel: string
  canAdvance: boolean
}

export function NavigationButtons({
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
  nextLabel,
  backLabel,
  submitLabel,
  canAdvance,
}: NavigationButtonsProps) {
  const primaryAction = onSubmit ?? onNext
  const primaryLabel = onSubmit ? submitLabel : nextLabel
  const primaryDisabled = !canAdvance || isSubmitting

  return (
    <div className="flex items-center justify-between gap-3 pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            'inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#E0DEDB]',
            'bg-white px-4 text-sm font-medium text-[#605A57]',
            'transition-colors hover:border-[#605A57] hover:text-[#37322F]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30',
          )}
        >
          {backLabel}
        </button>
      ) : (
        <span />
      )}

      {primaryAction && (
        <button
          type={onSubmit ? 'submit' : 'button'}
          onClick={onSubmit ? undefined : onNext}
          disabled={primaryDisabled}
          aria-busy={isSubmitting}
          className={cn(
            'inline-flex h-10 items-center gap-1.5 rounded-lg px-5 text-sm font-medium',
            'bg-[#37322F] text-[#FBFAF9]',
            'transition-all hover:bg-[#605A57]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37322F]/30 focus-visible:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          {isSubmitting ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-[#FBFAF9]/30 border-t-[#FBFAF9]"
              />
              <span className="sr-only">Loading</span>
            </>
          ) : (
            primaryLabel
          )}
        </button>
      )}
    </div>
  )
}
