'use client'

import Link from 'next/link'
import { useAssessmentSession } from '@/hooks/useAssessmentSession'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { AssessmentQuestionnaire } from '@/components/questionnaire/AssessmentQuestionnaire'

export function AssessmentLayout() {
  const { state, dispatch } = useAssessmentSession()

  function toggleLanguage() {
    dispatch({ type: 'SET_LANGUAGE', language: state.language === 'en' ? 'lt' : 'en' })
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3] flex flex-col">
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg font-semibold text-[#37322F] hover:text-[#605A57] transition-colors"
        >
          Diteka
        </Link>
        <LanguageToggle language={state.language} onToggle={toggleLanguage} />
      </header>

      <main className="flex-1 flex items-start justify-center py-4 px-4 sm:px-6">
        <div className="w-full max-w-2xl rounded-2xl border border-[#E0DEDB] bg-white shadow-sm">
          <AssessmentQuestionnaire state={state} dispatch={dispatch} />
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-[#9ca3af]">
        © {new Date().getFullYear()} Diteka
      </footer>
    </div>
  )
}
