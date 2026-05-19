import { client } from '@/sanity/lib/client'
import { SERVIZIO_QUERY, ALL_SERVIZI_SLUGS_QUERY } from '@/sanity/lib/queries'
import type { Servizio } from '@/lib/types'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: { current: string } }[]>(ALL_SERVIZI_SLUGS_QUERY)
  return slugs.map((s) => ({ slug: s.slug.current }))
}

export default async function ServizioPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const servizio = await client.fetch<Servizio | null>(
    SERVIZIO_QUERY,
    { slug },
    { next: { tags: ['servizio'] } }
  )

  if (!servizio) notFound()

  return (
    <main>
      <section className="shell py-24">
        <p className="kicker text-accent mb-6">{servizio.num}</p>
        <h1 className="h-1 text-ink mb-8">{servizio.title}</h1>
        <p className="body-lg text-ink-soft max-w-2xl">{servizio.shortDesc}</p>
        {servizio.longDesc && (
          <p className="body text-ink-soft max-w-2xl mt-6">{servizio.longDesc}</p>
        )}
        <div className="mt-10 flex flex-wrap gap-8 body-sm text-muted">
          {servizio.mezzi && <span>Mezzi: {servizio.mezzi}</span>}
          {servizio.orario && <span>Orari: {servizio.orario}</span>}
          {servizio.contatto && <span>Contatto: {servizio.contatto}</span>}
        </div>
      </section>
    </main>
  )
}
