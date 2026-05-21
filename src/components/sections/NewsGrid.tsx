import type { PostListItem } from '@/lib/types'
import Section from '@/components/layout/Section'
import { SectionLabel } from '@/components/layout/Section'
import Btn from '@/components/ui/Btn'
import SanityImage from '@/components/ui/SanityImage'
import { formatDate } from '@/sanity/lib/utils'
import Link from 'next/link'

interface NewsGridProps {
  posts: PostListItem[]
  preview?: boolean
}

export default function NewsGrid({ posts, preview = false }: NewsGridProps) {
  if (!posts.length) return null

  const items = preview ? posts.slice(0, 3) : posts

  return (
    <Section>
      <SectionLabel num={preview ? '04' : '01'} label="Aggiornamenti" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((post) => (
          <Link
            key={post._id}
            href={`/news/${post.slug.current}`}
            className="group flex flex-col gap-4"
          >
            {post.cover && (
              <div className="relative aspect-[16/9] overflow-hidden bg-bg-deep">
                <SanityImage
                  source={post.cover}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 flex-1">
              {post.tag && (
                <span className="kicker no-rule text-accent">
                  {post.tag}
                </span>
              )}
              <h3 className="h-3 text-ink group-hover:opacity-70 transition-opacity">{post.title}</h3>
              <p className="body flex-1 line-clamp-3 text-ink-soft">
                {post.excerpt}
              </p>
              <p className="body-sm text-muted">{formatDate(post.date)}</p>
            </div>
          </Link>
        ))}
      </div>
      {preview && (
        <>
          <div className="mt-12 rule" />
          <div className="mt-8">
            <Btn href="/news" variant="ghost">Tutte le notizie</Btn>
          </div>
        </>
      )}
    </Section>
  )
}
