import type { CSSProperties } from "react";
import type { R2Image as R2ImageType } from "@/lib/types";
import R2Image from "@/components/ui/R2Image";

interface CardSwapProps {
  cards: R2ImageType[];
  className?: string;
}

export default function CardSwap({ cards, className }: CardSwapProps) {
  const items = cards.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <div
      className={`card-swap ${className ?? ""}`}
      style={{ "--card-count": items.length } as CSSProperties}
    >
      {items.map((card, i) => (
        <div
          key={card.src}
          className="card-swap-item"
          style={{ "--card-index": i } as CSSProperties}
        >
          <R2Image image={card} fill className="object-cover" priority={i === 0} />
        </div>
      ))}
    </div>
  );
}
