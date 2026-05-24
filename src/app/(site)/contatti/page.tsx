import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Settings } from '@/lib/types'
import Section from '@/components/layout/Section'
import PageHeader from '@/components/layout/PageHeader'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Indirizzo, telefono, orari sede e modulo di contatto della Misericordia di Gello a San Giuliano Terme (PI).',
}

export default async function ContattiPage() {
  const settings = await client.fetch<Settings | null>(
    SETTINGS_QUERY,
    {},
    { next: { tags: ['settings'] } }
  )

  return (
    <main>
      <Section loose>
        <PageHeader kicker="Dove siamo" title="Contatti" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div style={{ borderTop: '1px solid var(--color-hair)' }}>
            {[
              { label: 'Indirizzo', value: settings?.address },
              { label: 'Telefono', value: settings?.phone, href: settings?.phone ? `tel:${settings.phone}` : undefined },
              { label: 'Email', value: settings?.email, href: settings?.email ? `mailto:${settings.email}` : undefined },
              { label: 'Orari sede', value: settings?.orariSede },
            ].filter((r) => r.value).map((r) => (
              <div key={r.label} className="py-6" style={{ borderBottom: '1px solid var(--color-hair)' }}>
                <p className="input-label mb-2">{r.label}</p>
                {r.href
                  ? <a href={r.href} className="body text-ink hover:opacity-70 transition-opacity">{r.value}</a>
                  : <p className="body text-ink whitespace-pre-line">{r.value}</p>
                }
              </div>
            ))}
          </div>

          <ContactForm />
        </div>
      </Section>
    </main>
  )
}
