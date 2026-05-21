import { client } from '@/sanity/lib/client'
import { SERVIZI_QUERY } from '@/sanity/lib/queries'
import type { ServizioListItem } from '@/lib/types'
import Section from '@/components/layout/Section'
import PageHeader from '@/components/layout/PageHeader'
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
        <PageHeader kicker="Cosa facciamo" title="I nostri servizi" />
        <ServiziAccordion servizi={servizi} />
      </Section>
    </main>
  )
}
