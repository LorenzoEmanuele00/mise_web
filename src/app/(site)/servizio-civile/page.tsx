import { client } from '@/sanity/lib/client'
import { SERVIZIO_CIVILE_QUERY } from '@/sanity/lib/queries'
import type { ServizioCivile } from '@/lib/types'
import Section from '@/components/layout/Section'
import PageHeader from '@/components/layout/PageHeader'
import ScTipiSection from '@/components/sections/ScTipiSection'
import ScStepsSection from '@/components/sections/ScStepsSection'
import ScFaqSection from '@/components/sections/ScFaqSection'

export default async function ServizioCivilePage() {
  const sc = await client.fetch<ServizioCivile | null>(
    SERVIZIO_CIVILE_QUERY,
    {},
    { next: { tags: ['servizioCivile'] } }
  )

  return (
    <main>
      <Section loose>
        <PageHeader kicker="Opportunità" title="Servizio Civile" />
        {sc?.introText && (
          <p className="body-lg text-ink-soft max-w-xl">{sc.introText}</p>
        )}
      </Section>

      {sc?.tipi && sc.tipi.length > 0 && <ScTipiSection tipi={sc.tipi} />}
      {sc?.steps && sc.steps.length > 0 && <ScStepsSection steps={sc.steps} />}
      {sc?.faq && sc.faq.length > 0 && <ScFaqSection faq={sc.faq} />}
    </main>
  )
}
