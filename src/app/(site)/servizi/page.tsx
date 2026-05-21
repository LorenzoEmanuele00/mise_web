import { client } from '@/sanity/lib/client'
import { SERVIZI_QUERY } from '@/sanity/lib/queries'
import type { ServizioListItem } from '@/lib/types'
import Section from '@/components/layout/Section'
import Kicker from '@/components/ui/Kicker'
import ServiziAccordion from '@/components/sections/ServiziAccordion'

export default async function ServiziPage() {
  const servizi = await client.fetch<ServizioListItem[]>(
    SERVIZI_QUERY,
    { lang: 'it' },
    { next: { tags: ['servizio'] } }
  )

  return (
    <main>
      <Section loose>
        <p className="mb-6">
          <Kicker style={{ color: 'var(--color-accent)' }}>Cosa facciamo</Kicker>
        </p>
        <h1 className="h-1 text-ink mb-16">I nostri servizi</h1>
        <ServiziAccordion servizi={servizi} />
      </Section>
    </main>
  )
}
