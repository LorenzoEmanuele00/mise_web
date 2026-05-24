import { cache } from 'react'
import type { Metadata } from 'next'
import { client } from "@/sanity/lib/client";
import { POST_QUERY, ALL_POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import { formatDate } from "@/sanity/lib/utils";
import type { Post } from "@/lib/types";
import { buildMetadata } from '@/lib/seo'
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Section from "@/components/layout/Section";
import Kicker from "@/components/ui/Kicker";

type Props = { params: Promise<{ slug: string }> }

const getPost = cache((slug: string) =>
  client.fetch<Post | null>(POST_QUERY, { slug, lang: 'it' }, { next: { tags: ['post'] } })
)

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(ALL_POST_SLUGS_QUERY);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return buildMetadata(post.seo, { title: post.title, description: post.excerpt })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <main>
      <Section loose>
        <article className="max-w-3xl">
          <div className="mb-8">
            {post.tag && (
              <p className="mb-3">
                <Kicker className="text-accent">{post.tag}</Kicker>
              </p>
            )}
            <h1 className="heading-01 text-ink mb-4">{post.title}</h1>
            <p className="body-sm text-muted">{formatDate(post.date)}</p>
          </div>
          <p className="body-lg text-ink-soft mb-10">{post.excerpt}</p>
          {post.body && (
            <div className="body text-ink-soft prose-content">
              <PortableText
                value={post.body as Parameters<typeof PortableText>[0]["value"]}
              />
            </div>
          )}
        </article>
      </Section>
    </main>
  );
}
