import { client } from '@/sanity/lib/client'
import { SERVIZIO_CIVILE_QUERY } from '@/sanity/lib/queries'
import { formatDate } from '@/sanity/lib/utils'
import type { ServizioCivile } from '@/lib/types'

export default async function ServizioCivilePage() {
  const sc = await client.fetch<ServizioCivile | null>(
    SERVIZIO_CIVILE_QUERY,
    {},
    { next: { tags: ['servizioCivile'] } }
  )

  return (
    <main>
      {/* Hero */}
      <section className="shell py-24">
        <p className="kicker text-accent mb-6">Opportunità</p>
        <h1 className="h-1 text-ink mb-8">Servizio Civile</h1>
        {sc?.introText && (
          <p className="body-lg text-ink-soft max-w-xl">{sc.introText}</p>
        )}
      </section>

      {/* Tab tipi (SCU / SCR) */}
      {sc?.tipi && sc.tipi.length > 0 && (
        <section className="shell py-16 border-t border-hair">
          {sc.tipi.map((tipo) => (
            <div key={tipo.code} className="mb-16">
              <h2 className="h-2 text-ink mb-2">{tipo.label}</h2>
              {tipo.ente && <p className="body-sm text-muted mb-6">Ente: {tipo.ente}</p>}

              {/* Strip riepilogativa */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-bg-elev p-6 mb-8">
                {tipo.durata && <div><p className="body-sm text-muted mb-1">Durata</p><p className="body font-medium">{tipo.durata}</p></div>}
                {tipo.eta && <div><p className="body-sm text-muted mb-1">Età</p><p className="body font-medium">{tipo.eta}</p></div>}
                {tipo.impegno && <div><p className="body-sm text-muted mb-1">Impegno</p><p className="body font-medium">{tipo.impegno}</p></div>}
                {tipo.compenso && <div><p className="body-sm text-muted mb-1">Compenso</p><p className="body font-medium">{tipo.compenso}</p></div>}
                {tipo.postiTotali !== undefined && <div><p className="body-sm text-muted mb-1">Posti totali</p><p className="body font-medium">{tipo.postiTotali}</p></div>}
              </div>

              {tipo.scadenza && (
                <p className="body text-ink mb-2">
                  Scadenza bando: <strong>{formatDate(tipo.scadenza)}</strong>
                  {tipo.scadenzaOra && ` ore ${tipo.scadenzaOra}`}
                </p>
              )}

              {tipo.portaleCandidatura && (
                <a href={tipo.portaleCandidatura} target="_blank" rel="noopener noreferrer" className="btn btn-dark inline-flex mt-4">
                  Candidati sul portale DOL
                </a>
              )}

              {/* Progetti */}
              {tipo.progetti && tipo.progetti.length > 0 && (
                <div className="mt-10">
                  <h3 className="h-3 text-ink mb-6">Progetti</h3>
                  <div className="divide-y divide-hair">
                    {tipo.progetti.map((p) => (
                      <div key={p.codice} className="py-6">
                        <div className="flex items-baseline gap-4 mb-2">
                          <span className="body-sm text-muted font-mono">{p.codice}</span>
                          <h4 className="h-3 text-ink">{p.titolo}</h4>
                        </div>
                        <div className="flex flex-wrap gap-6 body-sm text-muted mb-3">
                          <span>Posti: {p.posti}</span>
                          {p.sede && <span>Sede: {p.sede}</span>}
                        </div>
                        {p.focus && <p className="body text-ink-soft">{p.focus}</p>}
                        {p.schedaPdfUrl && (
                          <a href={p.schedaPdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost inline-flex mt-4 body-sm">
                            Scarica scheda PDF
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Come funziona */}
      {sc?.steps && sc.steps.length > 0 && (
        <section className="shell py-16 border-t border-hair">
          <p className="kicker text-accent mb-8">Come funziona</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {sc.steps.map((step) => (
              <div key={step.numero}>
                {step.numero && <p className="h-2 text-accent mb-3">{step.numero}</p>}
                <h3 className="h-3 text-ink mb-2">{step.titolo}</h3>
                {step.descrizione && <p className="body-sm text-ink-soft">{step.descrizione}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {sc?.faq && sc.faq.length > 0 && (
        <section className="shell py-16 border-t border-hair">
          <p className="kicker text-accent mb-8">Domande frequenti</p>
          <div className="divide-y divide-hair max-w-2xl">
            {sc.faq.map((item, i) => (
              <div key={i} className="py-6">
                <h3 className="h-3 text-ink mb-3">{item.domanda}</h3>
                <p className="body text-ink-soft">{item.risposta}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
