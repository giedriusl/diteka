import { useTranslations } from 'next-intl'

export function TestimonialsSection() {
  const t = useTranslations('testimonials')
  return (
    <section aria-labelledby="testimonials-heading" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 id="testimonials-heading" className="text-3xl font-bold text-center">{t('title')}</h2>
        {/* Testimonials — replace with v0 component */}
      </div>
    </section>
  )
}
