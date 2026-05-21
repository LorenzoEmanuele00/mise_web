import type { MezzoListItem } from '@/lib/types'
import Section from '@/components/layout/Section'
import { SectionLabel } from '@/components/layout/Section'
import SanityImage from '@/components/ui/SanityImage'
import Num from '@/components/ui/Num'

interface MezziGridProps {
  mezzi: MezzoListItem[]
}

export default function MezziGrid({ mezzi }: MezziGridProps) {
  if (!mezzi.length) return null

  return (
    <Section>
      <SectionLabel num="03" label="I nostri mezzi" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {mezzi.map((m) => (
          <div key={m._id} className="flex flex-col gap-4">
            <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: 'var(--color-bg-deep)' }}>
              {m.photo ? (
                <SanityImage
                  source={m.photo}
                  alt={m.name ?? m.code ?? 'Mezzo'}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="body-sm" style={{ color: 'var(--color-muted)' }}>Foto non disponibile</span>
                </div>
              )}
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                {m.code && <Num>{m.code}</Num>}
                {m.name && <h3 className="h-3 text-ink mt-1">{m.name}</h3>}
                {m.role && <p className="body-sm mt-1" style={{ color: 'var(--color-ink-soft)' }}>{m.role}</p>}
              </div>
              {m.year && (
                <span className="body-sm shrink-0" style={{ color: 'var(--color-muted)' }}>{m.year}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
