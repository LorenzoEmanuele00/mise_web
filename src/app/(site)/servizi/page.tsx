import { client } from '@/sanity/lib/client'
import { SERVIZI_QUERY, MEZZI_QUERY } from '@/sanity/lib/queries'
import type { ServizioListItem, MezzoListItem } from '@/lib/types'
import Section from '@/components/layout/Section'
import PageHeader from '@/components/layout/PageHeader'
import ServiziAccordion from '@/components/sections/ServiziAccordion'
import MezziGrid from '@/components/sections/MezziGrid'

export default async function ServiziPage() {
  const [servizi, mezzi] = await Promise.all([
    client.fetch<ServizioListItem[]>(SERVIZI_QUERY, { lang: 'it' }, { next: { tags: ['servizio'] } }),
    client.fetch<MezzoListItem[]>(MEZZI_QUERY, {}, { next: { tags: ['mezzo'] } }),
  ])

  return (
    <main>
      <Section loose>
        <PageHeader kicker="Cosa facciamo" title="I nostri servizi" />
        <ServiziAccordion servizi={servizi} />
      </Section>
      <MezziGrid mezzi={mezzi} />
    </main>
  )
}
