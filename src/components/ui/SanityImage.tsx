import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '@/sanity/lib/utils'

interface SanityImageProps {
  source: SanityImageSource
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
}

export default function SanityImage({
  source,
  alt,
  width = 800,
  height = 600,
  fill,
  className,
  sizes,
  priority,
}: SanityImageProps) {
  const url = urlFor(source).auto('format').fit('max').url()
  if (!url) return null

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        className={className}
        sizes={sizes ?? '100vw'}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
