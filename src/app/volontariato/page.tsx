import { client } from '@/sanity/lib/client'
import { PAGE_QUERY } from '@/sanity/lib/queries'
import type { Page } from '@/lib/types'

export default async function VolontariatoPage() {
  const page = await client.fetch<Page | null>(
    PAGE_QUERY,
    { slug: 'volontariato', lang: 'it' },
    { next: { tags: ['page'] } }
  )

  const hero = page?.heroSection

  return (
    <main>
      <section className="shell py-24">
        {hero?.kicker && <p className="kicker text-accent mb-6">{hero.kicker}</p>}
        <h1 className="h-1 text-ink mb-8">
          {hero?.headingPre}{' '}
          {hero?.headingEm && <em className="serif-it text-accent">{hero.headingEm}</em>}{' '}
          {hero?.headingPost || 'Diventa volontario'}
        </h1>
        {hero?.body && (
          <p className="body-lg text-ink-soft max-w-xl">{hero.body}</p>
        )}
        <div className="mt-10 p-8 bg-bg-elev border border-hair body text-ink-soft">
          Il modulo di candidatura sarà disponibile a breve.
        </div>
      </section>
    </main>
  )
}
