'use client'

import { useState } from 'react'
import Kicker from '@/components/ui/Kicker'
import Num from '@/components/ui/Num'
import Btn from '@/components/ui/Btn'
import Arrow from '@/components/ui/Arrow'
import type { TipoServizio } from '@/lib/types'
import { formatDate } from '@/sanity/lib/utils'

interface ScTabControllerProps {
  tipi: TipoServizio[]
  introText?: string
}

export default function ScTabController({ tipi, introText }: ScTabControllerProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const data = tipi[activeIdx] ?? tipi[0]
  if (!data) return null

  const stats: [string, string][] = [
    ['Durata', data.durata ?? ''],
    ['Età richiesta', data.eta ?? ''],
    ['Impegno', data.impegno ?? ''],
    ['Compenso', data.compenso ?? ''],
    ['Posti totali', data.postiTotali != null ? `${data.postiTotali} posti` : ''],
  ].filter(([, v]) => v !== '') as [string, string][]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ paddingTop: 56, paddingBottom: 0 }}>
        <div className="shell">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 56 }}>
            <Kicker>Pagina · Servizio Civile</Kicker>
            <Num>{data.code} · bando 2026</Num>
          </div>

          <h1 className="h-display">
            Un anno<br />
            dalla parte <em className="serif-it" style={{ color: 'var(--color-accent)' }}>giusta</em>.
          </h1>

          <p className="body-lg" style={{ maxWidth: 720, marginTop: 32, color: 'var(--color-ink-soft)' }}>
            {introText ?? 'Vivi dodici mesi dentro la Misericordia. Impari un mestiere fatto di persone, ti formi davvero, ricevi un\'indennità mensile. Hai due strade: l\'Universale (statale) o il Regionale toscano.'}
          </p>

          {/* Tab switcher */}
          <div
            style={{
              marginTop: 56,
              padding: 6,
              background: 'var(--color-bg-elev)',
              border: '1px solid var(--color-hair-strong)',
              borderRadius: 999,
              display: 'inline-flex',
            }}
          >
            {tipi.map((t, i) => (
              <button
                key={t.code}
                type="button"
                onClick={() => setActiveIdx(i)}
                style={{
                  padding: '12px 28px',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeIdx === i ? 'var(--color-ink)' : 'transparent',
                  color: activeIdx === i ? 'var(--color-bg)' : 'var(--color-ink)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  transition: 'all .3s ease',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', opacity: 0.7 }}>
                  {t.code}
                </span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Summary ──────────────────────────────────── */}
      <section style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div className="shell">
          {stats.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
                border: '1px solid var(--color-hair-strong)',
                background: 'var(--color-bg-elev)',
              }}
            >
              {stats.map(([k, v], i) => (
                <div
                  key={k}
                  style={{
                    padding: '32px 24px',
                    borderRight: i < stats.length - 1 ? '1px solid var(--color-hair)' : 'none',
                  }}
                >
                  <Kicker noRule>{k}</Kicker>
                  <div className="serif" style={{ fontSize: 28, marginTop: 14, lineHeight: 1.05 }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {data.scadenza && (
            <div
              className="dark-band"
              style={{
                marginTop: 16,
                padding: '32px 36px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 32,
                alignItems: 'center',
              }}
            >
              <div>
                <Kicker style={{ color: 'rgba(242,236,224,0.6)' }}>Prossima scadenza</Kicker>
                <div className="h-2" style={{ marginTop: 12 }}>
                  <span style={{ color: 'var(--color-accent-soft)' }}>{formatDate(data.scadenza)}</span>
                  {data.scadenzaOra && (
                    <span style={{ color: 'rgba(242,236,224,0.5)', fontSize: 22, marginLeft: 24 }}>
                      ore {data.scadenzaOra}
                    </span>
                  )}
                </div>
                {data.ente && (
                  <p className="body-sm" style={{ marginTop: 12, color: 'rgba(242,236,224,0.7)' }}>
                    La domanda si presenta online sul portale di {data.ente}, tramite SPID.
                  </p>
                )}
              </div>
              {data.portaleCandidatura ? (
                <a
                  href={data.portaleCandidatura}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent"
                >
                  <span>Candidati</span>
                  <Arrow />
                </a>
              ) : (
                <Btn variant="accent" href="/contatti">Candidati</Btn>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────── */}
      {data.progetti && data.progetti.length > 0 && (
        <section style={{ paddingTop: 32, paddingBottom: 96 }}>
          <div className="shell">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
              <Kicker>Progetti · {data.code} 2026</Kicker>
              <Num>{data.progetti.length} progetti aperti</Num>
            </div>
            <h2 className="h-1" style={{ marginBottom: 48, maxWidth: 800 }}>
              Scegli il <em className="serif-it">progetto</em> che ti somiglia di più.
            </h2>

            <div style={{ borderTop: '1px solid var(--color-hair-strong)' }}>
              {data.progetti.map((p, i) => (
                <div
                  key={p.codice}
                  style={{
                    padding: '40px 0',
                    borderBottom: '1px solid var(--color-hair-strong)',
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 1fr 200px',
                    gap: 40,
                    alignItems: 'start',
                  }}
                >
                  <div>
                    <Num>0{i + 1}</Num>
                    <div
                      style={{
                        marginTop: 8,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.12em',
                        color: 'var(--color-accent)',
                      }}
                    >
                      {p.codice}
                    </div>
                  </div>

                  <div>
                    <div className="serif" style={{ fontSize: 'clamp(22px, 2.2vw, 32px)', lineHeight: 1.1 }}>
                      {p.titolo}
                    </div>
                    {p.focus && (
                      <p className="body" style={{ marginTop: 16, maxWidth: 480, color: 'var(--color-ink-soft)' }}>
                        {p.focus}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'grid', gap: 16 }}>
                    <div>
                      <Kicker noRule>Posti</Kicker>
                      <div className="serif" style={{ fontSize: 36, marginTop: 8 }}>{p.posti}</div>
                    </div>
                    {p.sede && (
                      <div>
                        <Kicker noRule>Sede</Kicker>
                        <div style={{ marginTop: 6, fontSize: 14 }}>{p.sede}</div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {p.schedaPdfUrl ? (
                      <a
                        href={p.schedaPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                      >
                        <span>Scheda progetto</span>
                      </a>
                    ) : (
                      <Btn variant="ghost" href="/contatti" arrow={false}>Informazioni</Btn>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
