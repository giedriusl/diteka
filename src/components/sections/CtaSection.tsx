import { useTranslations } from 'next-intl'

export function CtaSection() {
  const t = useTranslations('cta')
  return (
    <section id="contact" aria-labelledby="cta-heading" className="py-24 px-6 bg-muted/30">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="cta-heading" className="text-3xl font-bold">{t('title')}</h2>
        <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
        {/* CTA button — replace with v0 component */}
      </div>
    </section>
  )
}
