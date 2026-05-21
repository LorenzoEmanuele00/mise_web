import Section from '@/components/layout/Section'
import Kicker from '@/components/ui/Kicker'
import type { ScStep } from '@/lib/types'

export default function ScStepsSection({ steps }: { steps: ScStep[] }) {
  return (
    <Section tight className="border-t border-hair">
      <p className="mb-8"><Kicker className="text-accent">Come funziona</Kicker></p>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {steps.map((step) => (
          <div key={step.titolo}>
            {step.numero && <p className="h-2 text-accent mb-3">{step.numero}</p>}
            <h3 className="h-3 text-ink mb-2">{step.titolo}</h3>
            {step.descrizione && <p className="body-sm text-ink-soft">{step.descrizione}</p>}
          </div>
        ))}
      </div>
    </Section>
  )
}
