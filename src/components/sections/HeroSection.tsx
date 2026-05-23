import type { HeroSection as HeroSectionData } from "@/lib/types";
import Section from "@/components/layout/Section";
import Btn from "@/components/ui/Btn";
import Kicker from "@/components/ui/Kicker";

interface HeroSectionProps {
  hero?: HeroSectionData | null;
  display?: boolean;
}

export default function HeroSection({
  hero,
  display = false,
}: HeroSectionProps) {
  if (!hero) return null;

  return (
    <Section loose>
      {hero.kicker && (
        <p className="mb-6">
          <Kicker className="text-accent">{hero.kicker}</Kicker>
        </p>
      )}
      <h1
        className={`${display ? "h-display" : "heading-01"} text-ink max-w-3xl`}
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
        <p className="body-lg mt-8 max-w-xl text-ink-soft">{hero.body}</p>
      )}
      {(hero.ctaPrimary?.href || hero.ctaSecondary?.href) && (
        <div className="mt-10 flex flex-wrap gap-4">
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
    </Section>
  );
}
