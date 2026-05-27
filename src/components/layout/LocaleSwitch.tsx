'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

export function LocaleSwitch() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function toggle() {
    const next = locale === 'lt' ? 'en' : 'lt'
    // Strip existing locale prefix if present, then add new one
    const stripped = pathname.replace(/^\/(en|lt)/, '') || '/'
    const target = next === 'lt' ? stripped : `/en${stripped}`
    router.push(target)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#F0EDE9] transition-colors"
      aria-label={locale === 'lt' ? 'Switch to English' : 'Perjungti į lietuvių'}
    >
      <span className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-medium leading-5 font-sans">
        {locale === 'lt' ? 'EN' : 'LT'}
      </span>
    </button>
  )
}
