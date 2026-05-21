import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import type { PostListItem } from '@/lib/types'
import Section from '@/components/layout/Section'
import Kicker from '@/components/ui/Kicker'
import NewsFilter from '@/components/sections/NewsFilter'

export default async function NewsPage() {
  const posts = await client.fetch<PostListItem[]>(
    POSTS_QUERY,
    { lang: 'it' },
    { next: { tags: ['post'] } }
  )

  return (
    <main>
      <Section loose>
        <p className="mb-6">
          <Kicker style={{ color: 'var(--color-accent)' }}>Aggiornamenti</Kicker>
        </p>
        <h1 className="h-1 text-ink mb-12">Notizie</h1>
        <NewsFilter posts={posts} />
      </Section>
    </main>
  )
}
