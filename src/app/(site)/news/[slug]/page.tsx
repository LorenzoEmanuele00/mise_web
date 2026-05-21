import { client } from '@/sanity/lib/client'
import { POST_QUERY, ALL_POST_SLUGS_QUERY } from '@/sanity/lib/queries'
import { formatDate } from '@/sanity/lib/utils'
import type { Post } from '@/lib/types'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(ALL_POST_SLUGS_QUERY)
  return slugs.map((s) => ({ slug: s.slug }))
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await client.fetch<Post | null>(
    POST_QUERY,
    { slug, lang: 'it' },
    { next: { tags: ['post'] } }
  )

  if (!post) notFound()

  return (
    <main>
      <article className="shell py-24 max-w-3xl">
        <div className="mb-8">
          {post.tag && (
            <p className="body-sm text-accent uppercase tracking-wide mb-3">{post.tag}</p>
          )}
          <h1 className="h-1 text-ink mb-4">{post.title}</h1>
          <p className="body-sm text-muted">{formatDate(post.date)}</p>
        </div>
        <p className="body-lg text-ink-soft mb-10">{post.excerpt}</p>
      </article>
    </main>
  )
}
