import Kicker from '@/components/ui/Kicker'
import Num from '@/components/ui/Num'
import R2Image from '@/components/ui/R2Image'
import type { ScTestimonianza } from '@/lib/types'

interface ScTestimonianzeSectionProps {
  testimonianze: ScTestimonianza[]
}

export default function ScTestimonianzeSection({ testimonianze }: ScTestimonianzeSectionProps) {
  if (!testimonianze.length) return null

  return (
    <section className="py-[clamp(5rem,10vw,7.5rem)]">
      <div className="shell">
        <div className="flex justify-between items-center mb-16">
          <Kicker>Testimonianze</Kicker>
          <Num>0{testimonianze.length} voci</Num>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonianze.map((t) => (
            <div key={t.nome}>
              {t.foto ? (
                <div className="relative h-80 bg-bg-elev overflow-hidden">
                  <R2Image
                    image={t.foto}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-80 bg-bg-elev border border-hair" />
              )}

              <p className="serif text-[22px] leading-[1.4] mt-6 tracking-[-0.005em]">
                «{t.testo}»
              </p>

              <div className="flex items-center gap-3 mt-6">
                <span className="text-sm font-medium">{t.nome}</span>
                <span className="body-sm text-muted">·</span>
                {t.anno && (
                  <Kicker noRule className="text-accent">{t.anno}</Kicker>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
