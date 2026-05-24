import Section from "@/components/layout/Section";
import Num from "@/components/ui/Num";
import { formatDate } from "@/sanity/lib/utils";
import type { TipoServizio } from "@/lib/types";

export default function ScTipiSection({ tipi }: { tipi: TipoServizio[] }) {
  return (
    <Section tight className="border-t border-hair">
      {tipi.map((tipo) => (
        <div key={tipo.code} className="mb-16">
          <h2 className="heading-02 text-ink mb-2">{tipo.label}</h2>
          {tipo.ente && (
            <p className="body-sm text-muted mb-6">Ente: {tipo.ente}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-bg-elev p-6 mb-8">
            {tipo.durata && (
              <div>
                <p className="body-sm text-muted mb-1">Durata</p>
                <p className="body font-medium">{tipo.durata}</p>
              </div>
            )}
            {tipo.eta && (
              <div>
                <p className="body-sm text-muted mb-1">Età</p>
                <p className="body font-medium">{tipo.eta}</p>
              </div>
            )}
            {tipo.impegno && (
              <div>
                <p className="body-sm text-muted mb-1">Impegno</p>
                <p className="body font-medium">{tipo.impegno}</p>
              </div>
            )}
            {tipo.compenso && (
              <div>
                <p className="body-sm text-muted mb-1">Compenso</p>
                <p className="body font-medium">{tipo.compenso}</p>
              </div>
            )}
            {tipo.postiTotali !== undefined && (
              <div>
                <p className="body-sm text-muted mb-1">Posti totali</p>
                <p className="body font-medium">{tipo.postiTotali}</p>
              </div>
            )}
          </div>

          {tipo.scadenza && (
            <p className="body text-ink mb-2">
              Scadenza bando: <strong>{formatDate(tipo.scadenza)}</strong>
              {tipo.scadenzaOra && ` ore ${tipo.scadenzaOra}`}
            </p>
          )}
          {tipo.portaleCandidatura && (
            <a
              href={tipo.portaleCandidatura}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark inline-flex mt-4"
            >
              Candidati sul portale DOL
            </a>
          )}

          {tipo.progetti && tipo.progetti.length > 0 && (
            <div className="mt-10">
              <h3 className="heading-03 text-ink mb-6">Progetti</h3>
              <div className="divide-y divide-hair">
                {tipo.progetti.map((p) => (
                  <div key={p.codice} className="py-6">
                    <div className="flex items-baseline gap-4 mb-2">
                      <Num>{p.codice}</Num>
                      <h4 className="heading-03 text-ink">{p.titolo}</h4>
                    </div>
                    <div className="flex flex-wrap gap-6 body-sm text-muted mb-3">
                      <span>Posti: {p.posti}</span>
                      {p.sede && <span>Sede: {p.sede}</span>}
                    </div>
                    {p.focus && <p className="body text-ink-soft">{p.focus}</p>}
                    {p.schedaPdfUrl && (
                      <a
                        href={p.schedaPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost inline-flex mt-4 body-sm"
                      >
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
    </Section>
  );
}
