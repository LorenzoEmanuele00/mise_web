'use client'

import { useState } from 'react'
import Kicker from '@/components/ui/Kicker'
import type { ScFaq } from '@/lib/types'

export default function ScFaqSection({ faq }: { faq: ScFaq[] }) {
  const [open, setOpen] = useState<number>(-1)

  return (
    <section style={{ paddingTop: 32, paddingBottom: 96 }}>
      <div className="shell">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 80,
            alignItems: 'start',
          }}
        >
          <div>
            <Kicker>Domande frequenti</Kicker>
            <h2 className="h-2" style={{ marginTop: 24 }}>
              Le risposte più <em className="serif-it">cercate</em>.
            </h2>
          </div>

          <div style={{ borderTop: '1px solid var(--color-hair-strong)' }}>
            {faq.map((item, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--color-hair)' }}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  style={{
                    width: '100%',
                    padding: '24px 0',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 24,
                  }}
                >
                  <span className="serif" style={{ fontSize: 'clamp(18px, 1.5vw, 22px)' }}>{item.domanda}</span>
                  <span
                    style={{
                      fontSize: 18,
                      flexShrink: 0,
                      transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                      transition: 'transform .3s',
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: open === i ? 300 : 0,
                    overflow: 'hidden',
                    transition: 'max-height .4s cubic-bezier(.2,.7,.2,1)',
                  }}
                >
                  <p className="body" style={{ paddingBottom: 24, maxWidth: 720, lineHeight: 1.7, color: 'var(--color-ink-soft)' }}>
                    {item.risposta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
