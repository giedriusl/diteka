import { useTranslations } from 'next-intl'

export function HeroSection() {
  const t = useTranslations('hero')
  return (
    <section aria-labelledby="hero-heading" className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 id="hero-heading" className="text-5xl font-bold tracking-tight">
        {t('headline')}
      </h1>
      <p className="mt-6 max-w-2xl text-xl text-muted-foreground">
        {t('subheadline')}
      </p>
    </section>
  )
}
