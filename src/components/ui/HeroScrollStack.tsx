"use client";

import type { R2Image as R2ImageType } from "@/lib/types";
import useMediaQuery from "@/hooks/useMediaQuery";
import R2Image from "@/components/ui/R2Image";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";

interface HeroScrollStackProps {
  cards: R2ImageType[];
}

// Tablet/mobile (< lg breakpoint): replaces the desktop CardSwap with the
// scroll-driven ScrollStack. Mounted only below 1024px so Lenis never hijacks
// the page scroll on desktop.
export default function HeroScrollStack({ cards }: HeroScrollStackProps) {
  const isMobile = useMediaQuery("(max-width: 1023.98px)");

  const items = cards.slice(0, 4);
  if (!isMobile || items.length === 0) return null;

  return (
    <ScrollStack useWindowScroll className="lg:hidden animate-fade-in">
      {items.map((card, i) => (
        <ScrollStackItem key={card.src}>
          <R2Image image={card} fill className="object-cover" priority={i === 0} />
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
