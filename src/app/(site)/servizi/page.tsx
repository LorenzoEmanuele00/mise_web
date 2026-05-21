import { client } from '@/sanity/lib/client'
import { SERVIZI_QUERY } from '@/sanity/lib/queries'
import type { ServizioListItem } from '@/lib/types'

export default async function ServiziPage() {
  const servizi = await client.fetch<ServizioListItem[]>(
    SERVIZI_QUERY,
    { lang: 'it' },
    { next: { tags: ['servizio'] } }
  )

  return (
    <main>
      <section className="shell py-24">
        <p className="kicker text-accent mb-6">Cosa facciamo</p>
        <h1 className="h-1 text-ink mb-16">I nostri servizi</h1>

        <div className="divide-y divide-hair">
          {servizi.map((s) => (
            <div key={s._id} className="py-10">
              <div className="flex items-baseline gap-6 mb-4">
                <span className="body-sm text-muted font-mono">{s.num}</span>
                <h2 className="h-2 text-ink">{s.title}</h2>
              </div>
              <p className="body text-ink-soft max-w-2xl">{s.shortDesc}</p>
              {s.longDesc && (
                <p className="body text-ink-soft max-w-2xl mt-4">{s.longDesc}</p>
              )}
              <div className="mt-6 flex flex-wrap gap-8 body-sm text-muted">
                {s.mezzi && <span>Mezzi: {s.mezzi}</span>}
                {s.orario && <span>Orari: {s.orario}</span>}
                {s.contatto && <span>Contatto: {s.contatto}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
