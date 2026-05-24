import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { ALL_POST_SLUGS_QUERY, ALL_SERVIZI_SLUGS_QUERY } from '@/sanity/lib/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://misericordiadigello.it'

const STATIC_ROUTES = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly' },
  { url: '/storia', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/servizi', priority: 0.9, changeFrequency: 'monthly' },
  { url: '/news', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/volontariato', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/contatti', priority: 0.7, changeFrequency: 'yearly' },
  { url: '/servizio-civile', priority: 0.8, changeFrequency: 'monthly' },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviziSlugs, postSlugs] = await Promise.all([
    client.fetch<{ slug: string }[]>(ALL_SERVIZI_SLUGS_QUERY),
    client.fetch<{ slug: string }[]>(ALL_POST_SLUGS_QUERY),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    priority,
    changeFrequency,
  }))

  const serviziEntries: MetadataRoute.Sitemap = serviziSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/servizi/${slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }))

  const postEntries: MetadataRoute.Sitemap = postSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/news/${slug}`,
    priority: 0.6,
    changeFrequency: 'never',
  }))

  return [...staticEntries, ...serviziEntries, ...postEntries]
}
