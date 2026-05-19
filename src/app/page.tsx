import { client } from '@/sanity/lib/client'
import { HOME_QUERY } from '@/sanity/lib/queries'
import { formatDate } from '@/sanity/lib/utils'
import type { HomeData } from '@/lib/types'
import Link from 'next/link'

export default async function HomePage() {
  const data = await client.fetch<HomeData>(
    HOME_QUERY,
    { lang: 'it' },
    { next: { tags: ['page', 'servizio', 'post'] } }
  )

  const hero = data?.page?.heroSection

  return (
    <main>
      {/* Hero */}
      <section className="shell py-24 md:py-36">
        {hero?.kicker && <p className="kicker text-accent mb-6">{hero.kicker}</p>}
        <h1 className="h-display text-ink max-w-3xl">
          {hero?.headingPre}{' '}
          {hero?.headingEm && <em className="serif-it text-accent">{hero.headingEm}</em>}{' '}
          {hero?.headingPost}
        </h1>
        {hero?.body && (
          <p className="body-lg text-ink-soft mt-8 max-w-xl">{hero.body}</p>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          {hero?.ctaPrimary?.href && (
            <Link href={hero.ctaPrimary.href} className="btn btn-dark">
              {hero.ctaPrimary.label}
            </Link>
          )}
          {hero?.ctaSecondary?.href && (
            <Link href={hero.ctaSecondary.href} className="btn btn-ghost">
              {hero.ctaSecondary.label}
            </Link>
          )}
        </div>
      </section>

      {/* Anteprima servizi */}
      {data?.servizi && data.servizi.length > 0 && (
        <section className="shell py-20 border-t border-hair">
          <p className="kicker text-accent mb-8">I nostri servizi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.servizi.map((s) => (
              <div key={s.num} className="border border-hair p-6">
                <p className="body-sm text-muted mb-2 font-mono">{s.num}</p>
                <h3 className="h-3 text-ink mb-3">{s.title}</h3>
                <p className="body text-ink-soft">{s.shortDesc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/servizi" className="btn btn-ghost">Tutti i servizi</Link>
          </div>
        </section>
      )}

      {/* Anteprima news */}
      {data?.news && data.news.length > 0 && (
        <section className="shell py-20 border-t border-hair">
          <p className="kicker text-accent mb-8">Ultime notizie</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.news.map((post) => (
              <Link key={post._id} href={`/news/${post.slug.current}`} className="group block border border-hair p-6 hover:bg-bg-elev transition-colors">
                {post.tag && (
                  <p className="body-sm text-accent uppercase tracking-wide mb-2">{post.tag}</p>
                )}
                <h3 className="h-3 text-ink mb-2 group-hover:text-accent transition-colors">{post.title}</h3>
                <p className="body-sm text-muted">{formatDate(post.date)}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/news" className="btn btn-ghost">Tutte le notizie</Link>
          </div>
        </section>
      )}
    </main>
  )
}
