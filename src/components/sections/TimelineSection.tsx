import type { TimelineEvent } from "@/lib/types";
import Section from "@/components/layout/Section";
import { SectionLabel } from "@/components/layout/Section";
import Num from "@/components/ui/Num";

interface TimelineSectionProps {
  events: TimelineEvent[];
}

export default function TimelineSection({ events }: TimelineSectionProps) {
  if (!events.length) return null;

  return (
    <Section>
      <SectionLabel num="02" label="La nostra storia" />
      <div className="relative">
        <div
          className="absolute left-[5.5rem] top-0 bottom-0 w-px hidden md:block"
          style={{ backgroundColor: "var(--color-hair)" }}
          aria-hidden="true"
        />
        <ol className="flex flex-col gap-12">
          {events.map((ev) => (
            <li key={ev.year} className="flex gap-8 md:gap-12">
              <div className="shrink-0 w-16 md:w-[5.5rem] pt-1">
                <Num>{ev.year}</Num>
              </div>
              <div className="relative flex-1 pb-12 border-b border-hair last:border-0 last:pb-0">
                <div
                  className="absolute -left-[calc(1.75rem+1px)] top-1.5 w-2 heading-02 rounded-full hidden md:block"
                  style={{ backgroundColor: "var(--color-accent)" }}
                  aria-hidden="true"
                />
                <h3 className="heading-03 text-ink">{ev.title}</h3>
                {ev.text && (
                  <p
                    className="body mt-3 max-w-2xl"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    {ev.text}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
