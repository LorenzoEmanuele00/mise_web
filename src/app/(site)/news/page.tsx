import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import type { PostListItem } from '@/lib/types'
import Section from '@/components/layout/Section'
import PageHeader from '@/components/layout/PageHeader'
import NewsFilter from '@/components/sections/NewsFilter'

export const metadata: Metadata = {
  title: 'Notizie',
  description: 'Comunicati, bandi, eventi e aggiornamenti dalla Misericordia di Gello.',
}

export default async function NewsPage() {
  const posts = await client.fetch<PostListItem[]>(
    POSTS_QUERY,
    { lang: 'it' },
    { next: { tags: ['post'] } }
  )

  return (
    <main>
      <Section loose>
        <PageHeader kicker="Aggiornamenti" title="Notizie" />
        <NewsFilter posts={posts} />
      </Section>
    </main>
  )
}
