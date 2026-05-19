import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

export const urlFor = (source: SanityImageSource) => builder.image(source)

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
