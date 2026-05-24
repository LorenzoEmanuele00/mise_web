import Kicker from '@/components/ui/Kicker'
import Num from '@/components/ui/Num'
import SanityImage from '@/components/ui/SanityImage'
import type { ScTestimonianza } from '@/lib/types'

interface ScTestimonianzeSectionProps {
  testimonianze: ScTestimonianza[]
}

export default function ScTestimonianzeSection({ testimonianze }: ScTestimonianzeSectionProps) {
  if (!testimonianze.length) return null

  return (
    <section className="py-[clamp(5rem,10vw,7.5rem)]">
      <div className="shell">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 64 }}>
          <Kicker>Testimonianze</Kicker>
          <Num>0{testimonianze.length} voci</Num>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{
            gap: 40,
          }}
        >
          {testimonianze.map((t) => (
            <div key={t.nome}>
              {t.foto ? (
                <div style={{ position: 'relative', height: 320, background: 'var(--color-bg-elev)', overflow: 'hidden' }}>
                  <SanityImage
                    source={t.foto}
                    alt={t.nome}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div
                  style={{
                    height: 320,
                    background: 'var(--color-bg-elev)',
                    border: '1px solid var(--color-hair)',
                  }}
                />
              )}

              <p
                className="serif"
                style={{ fontSize: 22, lineHeight: 1.4, marginTop: 24, letterSpacing: '-0.005em' }}
              >
                «{t.testo}»
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{t.nome}</span>
                <span className="body-sm" style={{ color: 'var(--color-muted)' }}>·</span>
                {t.anno && (
                  <Kicker noRule style={{ color: 'var(--color-accent)' }}>{t.anno}</Kicker>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
