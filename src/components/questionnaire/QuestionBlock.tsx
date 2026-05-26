'use client'

import { cn } from '@/lib/utils'

interface QuestionBlockProps {
  id: string
  label: string
  description?: string
  children: React.ReactNode
  required?: boolean
  className?: string
}

export function QuestionBlock({
  id,
  label,
  description,
  children,
  required = false,
  className,
}: QuestionBlockProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-1">
        <p
          id={`${id}-label`}
          className="text-sm font-medium text-[#37322F] leading-snug"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-[#ea580c]">*</span>
          )}
        </p>
        {description && (
          <p id={`${id}-desc`} className="text-xs text-[#605A57] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}
