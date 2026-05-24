import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { SERVIZIO_CIVILE_QUERY } from '@/sanity/lib/queries'
import type { ServizioCivile } from '@/lib/types'
import { buildMetadata } from '@/lib/seo'
import ScTabController from '@/components/sections/ScTabController'
import ScStepsSection from '@/components/sections/ScStepsSection'
import ScTestimonianzeSection from '@/components/sections/ScTestimonianzeSection'
import ScFaqSection from '@/components/sections/ScFaqSection'
import ScApplySection from '@/components/sections/ScApplySection'

export async function generateMetadata(): Promise<Metadata> {
  const sc = await client.fetch<ServizioCivile | null>(SERVIZIO_CIVILE_QUERY, {}, { next: { tags: ['servizioCivile'] } })
  return buildMetadata(sc?.seo, {
    title: 'Servizio Civile',
    description: 'Vivi un anno dalla parte giusta con la Misericordia di Gello: scopri i progetti di Servizio Civile Universale e Regionale.',
  })
}

export default async function ServizioCivilePage() {
  const sc = await client.fetch<ServizioCivile | null>(
    SERVIZIO_CIVILE_QUERY,
    {},
    { next: { tags: ['servizioCivile'] } }
  )

  return (
    <main>
      {sc?.tipi && sc.tipi.length > 0 && (
        <ScTabController tipi={sc.tipi} introText={sc.introText} />
      )}

      {sc?.steps && sc.steps.length > 0 && (
        <ScStepsSection steps={sc.steps} />
      )}

      {sc?.testimonianze && sc.testimonianze.length > 0 && (
        <ScTestimonianzeSection testimonianze={sc.testimonianze} />
      )}

      {sc?.faq && sc.faq.length > 0 && (
        <ScFaqSection faq={sc.faq} />
      )}

      {sc?.tipi && sc.tipi.length > 0 && (
        <ScApplySection tipi={sc.tipi} />
      )}
    </main>
  )
}
