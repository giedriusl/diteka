import Link from 'next/link'
import { AssessmentQuestionnaire } from '@/components/questionnaire/AssessmentQuestionnaire'

export const metadata = {
  title: 'Automation Readiness Assessment | Diteka',
  description: 'Find out how ready your business processes are for automation — in under 5 minutes.',
}

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] flex flex-col">
      <header className="w-full px-6 py-4 flex items-center">
        <Link
          href="/"
          className="font-serif text-lg font-semibold text-[#37322F] hover:text-[#605A57] transition-colors"
        >
          Diteka
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center py-4 px-4 sm:px-6">
        <div className="w-full max-w-2xl rounded-2xl border border-[#E0DEDB] bg-white shadow-sm">
          <AssessmentQuestionnaire />
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-[#9ca3af]">
        © {new Date().getFullYear()} Diteka
      </footer>
    </div>
  )
}
