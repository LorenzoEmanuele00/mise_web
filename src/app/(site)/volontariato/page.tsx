import { client } from '@/sanity/lib/client'
import { PAGE_QUERY } from '@/sanity/lib/queries'
import type { Page } from '@/lib/types'
import HeroSection from '@/components/sections/HeroSection'
import Section from '@/components/layout/Section'
import { SectionLabel } from '@/components/layout/Section'
import VolunteerForm from '@/components/forms/VolunteerForm'

export default async function VolontariatoPage() {
  const page = await client.fetch<Page | null>(
    PAGE_QUERY,
    { slug: 'volontariato', lang: 'it' },
    { next: { tags: ['page'] } }
  )

  return (
    <main>
      <HeroSection hero={page?.heroSection} />
      <Section>
        <SectionLabel num="01" label="Candidatura" />
        <div className="max-w-2xl">
          <VolunteerForm />
        </div>
      </Section>
    </main>
  )
}
