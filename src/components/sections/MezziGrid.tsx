import type { MezzoListItem } from "@/lib/types";
import Section, { SectionLabel } from "@/components/layout/Section";
import R2Image from "@/components/ui/R2Image";
import Num from "@/components/ui/Num";
import StaggerGrid from "@/components/ui/StaggerGrid";

interface MezziGridProps {
  mezzi: MezzoListItem[];
}

export default function MezziGrid({ mezzi }: MezziGridProps) {
  if (!mezzi.length) return null;

  return (
    <Section>
      <SectionLabel num="03" label="I nostri mezzi" />
      <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {mezzi.map((m) => (
          <div key={m._id} className="stagger-item flex flex-col gap-4 bg-bg">
            <div className="relative aspect-[4/3] overflow-hidden bg-bg-deep">
              {m.photo ? (
                <R2Image
                  image={m.photo}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="body-sm text-muted">Foto non disponibile</span>
                </div>
              )}
            </div>
            <div className="flex items-start justify-between gap-4 px-5 pb-5">
              <div>
                {m.code && <Num>{m.code}</Num>}
                {m.name && (
                  <h3 className="heading-03 text-ink mt-1">{m.name}</h3>
                )}
                {m.role && (
                  <p className="body-sm mt-1 text-ink-soft">{m.role}</p>
                )}
              </div>
              {m.year && (
                <span className="body-sm shrink-0 text-muted">{m.year}</span>
              )}
            </div>
          </div>
        ))}
      </StaggerGrid>
    </Section>
  );
}
