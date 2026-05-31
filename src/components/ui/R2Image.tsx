import type { R2Image as R2ImageType } from "@/lib/types";

interface R2ImageProps {
  image: R2ImageType | null | undefined;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

const BASE = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

export default function R2Image({
  image,
  className,
  fill,
  priority,
}: R2ImageProps) {
  if (!image?.src) return null;

  return (
    <img
      src={`${BASE}/${image.src}`}
      alt={image.altText}
      loading={priority ? "eager" : "lazy"}
      className={
        fill ? `absolute inset-0 w-full h-full ${className ?? ""}` : className
      }
    />
  );
}
