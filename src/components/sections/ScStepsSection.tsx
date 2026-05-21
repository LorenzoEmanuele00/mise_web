import Kicker from '@/components/ui/Kicker'
import Num from '@/components/ui/Num'
import type { ScStep } from '@/lib/types'

export default function ScStepsSection({ steps }: { steps: ScStep[] }) {
  return (
    <section className="dark-band" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="shell">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <Kicker>Come funziona</Kicker>
          <Num>0{steps.length} step</Num>
        </div>
        <h2 className="h-1" style={{ marginBottom: 64, maxWidth: 800 }}>
          Dal click <em className="serif-it">al primo giorno</em>, in cinque passaggi.
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(steps.length, 5)}, 1fr)`,
            border: '1px solid rgba(242,236,224,0.15)',
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.titolo}
              style={{
                padding: '32px 24px 36px',
                borderRight: i < steps.length - 1 ? '1px solid rgba(242,236,224,0.15)' : 'none',
              }}
            >
              {step.numero && (
                <div className="serif" style={{ fontSize: 56, color: 'var(--color-accent-soft)', lineHeight: 1 }}>
                  {step.numero}
                </div>
              )}
              <div style={{ marginTop: 24, fontSize: 17, fontWeight: 500 }}>{step.titolo}</div>
              {step.descrizione && (
                <p className="body-sm" style={{ marginTop: 10, lineHeight: 1.65, color: 'rgba(242,236,224,0.75)' }}>
                  {step.descrizione}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
