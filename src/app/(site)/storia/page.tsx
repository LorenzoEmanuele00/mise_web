import { client } from '@/sanity/lib/client'
import { PAGE_QUERY } from '@/sanity/lib/queries'
import type { Page } from '@/lib/types'

export default async function StoriaPage() {
  const page = await client.fetch<Page | null>(
    PAGE_QUERY,
    { slug: 'storia', lang: 'it' },
    { next: { tags: ['page'] } }
  )

  const hero = page?.heroSection

  return (
    <main>
      <section className="shell py-24 md:py-36">
        {hero?.kicker && <p className="kicker text-accent mb-6">{hero.kicker}</p>}
        <h1 className="h-1 text-ink max-w-2xl">
          {hero?.headingPre}{' '}
          {hero?.headingEm && <em className="serif-it text-accent">{hero.headingEm}</em>}{' '}
          {hero?.headingPost}
        </h1>
        {hero?.body && (
          <p className="body-lg text-ink-soft mt-8 max-w-xl">{hero.body}</p>
        )}
      </section>
    </main>
  )
}
