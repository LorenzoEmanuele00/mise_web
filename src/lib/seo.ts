import type { Metadata } from 'next'
import type { SeoObject } from '@/lib/types'

const SITE_NAME = 'Misericordia di Gello'
const DEFAULT_DESCRIPTION =
  'Confraternita Misericordia di Gello — volontariato, soccorso e aggregazione sociale dal 1947.'

export function buildMetadata(
  seo: SeoObject | undefined,
  fallback: { title: string; description?: string },
): Metadata {
  const title = seo?.metaTitle ?? fallback.title
  const description = seo?.metaDescription ?? fallback.description ?? DEFAULT_DESCRIPTION
  const ogImageUrl = seo?.ogImage?.src

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      locale: 'it_IT',
      type: 'website',
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  }
}
