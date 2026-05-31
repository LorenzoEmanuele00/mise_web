import type { CSSProperties } from "react";
import type { HeroSection as HeroSectionData } from "@/lib/types";
import Section from "@/components/layout/Section";
import Btn from "@/components/ui/Btn";
import CardSwap from "@/components/ui/CardSwap";
import HeroScrollStack from "@/components/ui/HeroScrollStack";
import Kicker from "@/components/ui/Kicker";
import R2Image from "@/components/ui/R2Image";

interface HeroSectionProps {
  hero?: HeroSectionData | null;
  display?: boolean;
}

export default function HeroSection({
  hero,
  display = false,
}: HeroSectionProps) {
  if (!hero) return null;

  const hasCards = Boolean(hero.swapCards?.length);

  return (
    <Section loose>
      <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
        <div className="lg:flex-1 min-w-0">
          {hero.kicker && (
            <p
              className="mb-6 animate-fade-up"
              style={{ "--anim-delay": "0s" } as CSSProperties}
            >
              <Kicker className="text-accent">{hero.kicker}</Kicker>
            </p>
          )}
          <h1
            className={`${display ? "h-display" : "heading-01"} text-ink ${hasCards ? "max-w-2xl" : "max-w-3xl"} animate-fade-up`}
            style={{ "--anim-delay": "0.08s" } as CSSProperties}
          >
            {hero.headingPre}
            {hero.headingEm && (
              <>
                {" "}
                <em className="serif-it text-accent">{hero.headingEm}</em>
              </>
            )}
            {hero.headingPost && <> {hero.headingPost}</>}
          </h1>
          {hero.body && (
            <p
              className="body-lg mt-8 max-w-xl text-ink-soft animate-fade-up"
              style={{ "--anim-delay": "0.18s" } as CSSProperties}
            >
              {hero.body}
            </p>
          )}
          {(hero.ctaPrimary?.href || hero.ctaSecondary?.href) && (
            <div
              className="mt-10 flex flex-wrap gap-4 animate-fade-up"
              style={{ "--anim-delay": "0.28s" } as CSSProperties}
            >
              {hero.ctaPrimary?.href && (
                <Btn href={hero.ctaPrimary.href} variant="dark">
                  {hero.ctaPrimary.label}
                </Btn>
              )}
              {hero.ctaSecondary?.href && (
                <Btn href={hero.ctaSecondary.href} variant="ghost">
                  {hero.ctaSecondary.label}
                </Btn>
              )}
            </div>
          )}
        </div>
        {hasCards && (
          <>
            <CardSwap
              cards={hero.swapCards ?? []}
              className="hidden lg:block lg:mx-0 lg:mt-0 lg:flex-shrink-0 animate-fade-up"
            />
            <HeroScrollStack cards={hero.swapCards ?? []} />
          </>
        )}
      </div>
      {hero.image && (
        <div
          className="relative mt-12 aspect-[16/7] w-full overflow-hidden rounded-2xl animate-fade-up"
          style={{ "--anim-delay": "0.38s" } as CSSProperties}
        >
          <R2Image
            image={hero.image}
            fill
            className="object-cover"
            priority={display}
          />
        </div>
      )}
    </Section>
  );
}
