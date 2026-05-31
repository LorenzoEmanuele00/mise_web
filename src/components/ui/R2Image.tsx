import type { R2Image as R2ImageType } from "@/lib/types";

interface R2ImageProps {
  image: R2ImageType | null | undefined;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

const BASE = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

// Strips surrounding whitespace plus invisible/zero-width/control characters
// (zero-width space, BOM, bidi marks, etc.) that can sneak in from
// copy-pasted Sanity values and break the R2 image path (400 errors).
const INVISIBLE =
  /[\u0000-\u001F\u007F-\u00A0\u200B-\u200F\u2028-\u202E\u2060\uFEFF]/g;

function cleanPath(value: string): string {
  return value
    .replace(INVISIBLE, "")
    .trim()
    .replace(/^\/+/, "");
}

export default function R2Image({
  image,
  className,
  fill,
  priority,
}: R2ImageProps) {
  if (!image?.src) return null;

  const src = cleanPath(image.src);
  if (!src) return null;

  return (
    <img
      src={`${cleanPath(BASE)}/${src}`}
      alt={image.altText}
      loading={priority ? "eager" : "lazy"}
      className={
        fill ? `absolute inset-0 w-full h-full ${className ?? ""}` : className
      }
    />
  );
}
