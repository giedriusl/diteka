'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SectorKey, Language } from '@/lib/assessment/types'
import { PROCESS_DROPDOWNS, getOptionLabel } from '@/lib/assessment/processDropdowns'

const OTHER_KEY = 'other'
const FALLBACK_SECTOR: SectorKey = 'other'

interface ProcessNameComboProps {
  id: string
  sector: SectorKey | null
  language: Language
  value: string
  onChange: (value: string) => void
  selectPlaceholder: string
  textPlaceholder: string
}

export function ProcessNameCombo({
  id,
  sector,
  language,
  value,
  onChange,
  selectPlaceholder,
  textPlaceholder,
}: ProcessNameComboProps) {
  const [open, setOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const options = PROCESS_DROPDOWNS[sector ?? FALLBACK_SECTOR]
  const selectedOption = options.find(o => o.key === selectedKey)
  const triggerLabel = selectedOption ? getOptionLabel(selectedOption, language) : selectPlaceholder
  const showTextInput = selectedKey === OTHER_KEY

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open && listRef.current) {
      const selected = listRef.current.querySelector('[aria-selected="true"]') as HTMLElement
      selected?.scrollIntoView({ block: 'nearest' })
    }
  }, [open])

  function selectOption(key: string) {
    setSelectedKey(key)
    setOpen(false)
    if (key === OTHER_KEY) {
      onChange('')
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      const option = options.find(o => o.key === key)
      if (option) onChange(getOptionLabel(option, language))
      triggerRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const currentIndex = options.findIndex(o => o.key === selectedKey)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) { setOpen(true); return }
      const next = Math.min(currentIndex + 1, options.length - 1)
      setSelectedKey(options[next].key)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(currentIndex - 1, 0)
      setSelectedKey(options[prev].key)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!open) { setOpen(true); return }
      if (selectedKey) selectOption(selectedKey)
    } else if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <div className="relative">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          onClick={() => setOpen(o => !o)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm transition-all',
            'focus:outline-none focus:ring-2 focus:ring-[#37322F]/30',
            open
              ? 'border-[#37322F] bg-white text-[#37322F]'
              : selectedKey && selectedKey !== OTHER_KEY
                ? 'border-[#E0DEDB] bg-white text-[#37322F]'
                : 'border-[#E0DEDB] bg-white text-[#9ca3af]',
          )}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown
            className={cn(
              'ml-2 size-4 shrink-0 text-[#605A57] transition-transform duration-150',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>

        {open && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={selectPlaceholder}
            className={cn(
              'absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto',
              'rounded-xl border border-[#E0DEDB] bg-white py-1 shadow-lg',
            )}
          >
            {options.map((opt, i) => {
              const label = getOptionLabel(opt, language)
              const isSelected = selectedKey === opt.key
              const isOther = opt.key === OTHER_KEY
              return (
                <li
                  key={opt.key}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectOption(opt.key)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors',
                    i < options.length - 1 && isOther && 'mt-1 border-t border-[#E0DEDB] pt-2',
                    isSelected
                      ? 'bg-[#37322F] text-[#FBFAF9]'
                      : 'text-[#37322F] hover:bg-[#F7F5F3]',
                  )}
                >
                  <span>{label}</span>
                  {isSelected && <Check className="ml-2 size-3.5 shrink-0" aria-hidden="true" />}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {showTextInput && (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={textPlaceholder}
          maxLength={60}
          className={cn(
            'h-10 w-full rounded-lg border border-[#E0DEDB] bg-white px-3 text-sm text-[#37322F]',
            'placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#37322F]/30',
          )}
          required
        />
      )}
    </div>
  )
}
