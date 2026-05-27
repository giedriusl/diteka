'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import type { Language } from '@/lib/assessment/types'

export function LocaleSwitch() {
  const locale = useLocale() as Language
  const router = useRouter()
  const pathname = usePathname()

  function toggle() {
    const next: Language = locale === 'lt' ? 'en' : 'lt'
    router.replace(pathname, { locale: next })
  }

  return <LanguageToggle language={locale} onToggle={toggle} />
}
