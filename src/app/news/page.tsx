import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import { formatDate } from '@/sanity/lib/utils'
import type { PostListItem } from '@/lib/types'
import Link from 'next/link'

export default async function NewsPage() {
  const posts = await client.fetch<PostListItem[]>(
    POSTS_QUERY,
    { lang: 'it' },
    { next: { tags: ['post'] } }
  )

  return (
    <main>
      <section className="shell py-24">
        <p className="kicker text-accent mb-6">Aggiornamenti</p>
        <h1 className="h-1 text-ink mb-16">Notizie</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post._id} href={`/news/${post.slug.current}`} className="group block border border-hair p-6 hover:bg-bg-elev transition-colors">
              {post.tag && (
                <p className="body-sm text-accent uppercase tracking-wide mb-3">{post.tag}</p>
              )}
              <h2 className="h-3 text-ink mb-3 group-hover:text-accent transition-colors">{post.title}</h2>
              <p className="body text-ink-soft mb-4 line-clamp-3">{post.excerpt}</p>
              <p className="body-sm text-muted">{formatDate(post.date)}</p>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="body text-muted">Nessuna notizia pubblicata.</p>
        )}
      </section>
    </main>
  )
}
