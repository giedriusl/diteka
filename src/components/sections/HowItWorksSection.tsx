import { useTranslations } from 'next-intl'

export function HowItWorksSection() {
  const t = useTranslations('howItWorks')
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 id="how-heading" className="text-3xl font-bold text-center">{t('title')}</h2>
        {/* Steps — replace with v0 component */}
      </div>
    </section>
  )
}
