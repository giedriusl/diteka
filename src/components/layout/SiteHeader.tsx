import { useTranslations } from 'next-intl'

export function SiteHeader() {
  const t = useTranslations('nav')
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <span className="text-lg font-semibold tracking-tight">diteka</span>
        <nav aria-label="Main navigation" className="flex gap-6 text-sm text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">{t('howItWorks')}</a>
          <a href="#services" className="hover:text-foreground transition-colors">{t('services')}</a>
          <a href="#contact" className="hover:text-foreground transition-colors">{t('contact')}</a>
        </nav>
      </div>
    </header>
  )
}
