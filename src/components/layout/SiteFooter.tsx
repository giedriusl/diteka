import { useTranslations } from 'next-intl'

export function SiteFooter() {
  const t = useTranslations('footer')
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Diteka. {t('rights')}
      </div>
    </footer>
  )
}
