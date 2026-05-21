import Section from '@/components/layout/Section'
import Kicker from '@/components/ui/Kicker'
import type { ScFaq } from '@/lib/types'

export default function ScFaqSection({ faq }: { faq: ScFaq[] }) {
  return (
    <Section tight className="border-t border-hair">
      <p className="mb-8"><Kicker className="text-accent">Domande frequenti</Kicker></p>
      <div className="divide-y divide-hair max-w-2xl">
        {faq.map((item, i) => (
          <div key={i} className="py-6">
            <h3 className="h-3 text-ink mb-3">{item.domanda}</h3>
            <p className="body text-ink-soft">{item.risposta}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
