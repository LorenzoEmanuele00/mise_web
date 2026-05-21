import type { ServizioListItem } from '@/lib/types'
import Section from '@/components/layout/Section'
import { SectionLabel } from '@/components/layout/Section'
import Btn from '@/components/ui/Btn'
import Num from '@/components/ui/Num'
import Link from 'next/link'
import Arrow from '@/components/ui/Arrow'

interface ServiziGridProps {
  servizi: Pick<ServizioListItem, '_id' | 'num' | 'title' | 'shortDesc' | 'slug'>[]
  preview?: boolean
}

export default function ServiziGrid({ servizi, preview = false }: ServiziGridProps) {
  if (!servizi.length) return null

  const items = preview ? servizi.slice(0, 6) : servizi

  return (
    <Section>
      <SectionLabel num="01" label="Cosa facciamo" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: 'var(--color-hair)' }}>
        {items.map((s) => {
          const card = (
            <div className="p-8 flex flex-col gap-4 h-full" style={{ backgroundColor: 'var(--color-bg)' }}>
              <Num>{s.num}</Num>
              <h3 className="h-3 text-ink">{s.title}</h3>
              <p className="body flex-1" style={{ color: 'var(--color-ink-soft)' }}>{s.shortDesc}</p>
              {s.slug?.current && (
                <span className="flex items-center gap-2 body-sm" style={{ color: 'var(--color-accent)' }}>
                  Scopri <Arrow size={12} />
                </span>
              )}
            </div>
          )

          if (s.slug?.current) {
            return (
              <Link key={s._id} href={`/servizi/${s.slug.current}`} className="block group hover:opacity-90 transition-opacity">
                {card}
              </Link>
            )
          }

          return <div key={s._id}>{card}</div>
        })}
      </div>
      {preview && (
        <div className="mt-12 rule" />
      )}
      {preview && (
        <div className="mt-8">
          <Btn href="/servizi" variant="ghost">Tutti i servizi</Btn>
        </div>
      )}
    </Section>
  )
}
