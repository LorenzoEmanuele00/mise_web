"use client";

import { useState, type CSSProperties } from "react";
import Kicker from "@/components/ui/Kicker";
import Num from "@/components/ui/Num";
import Btn from "@/components/ui/Btn";
import Arrow from "@/components/ui/Arrow";
import type { TipoServizio } from "@/lib/types";
import { formatDate } from "@/sanity/lib/utils";

interface ScTabControllerProps {
  tipi: TipoServizio[];
  introText?: string;
}

export default function ScTabController({
  tipi,
  introText,
}: ScTabControllerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [bouncingIdx, setBouncingIdx] = useState<number | null>(null);
  const data = tipi[activeIdx] ?? tipi[0];

  const handleSelect = (i: number) => {
    if (i === activeIdx) return;
    setActiveIdx(i);
    setBouncingIdx(i);
  };
  if (!data) return null;

  const stats: [string, string][] = [
    ["Durata", data.durata ?? ""],
    ["Età richiesta", data.eta ?? ""],
    ["Impegno", data.impegno ?? ""],
    ["Compenso", data.compenso ?? ""],
    [
      "Posti totali",
      data.postiTotali != null ? `${data.postiTotali} posti` : "",
    ],
  ].filter(([, v]) => v !== "") as [string, string][];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="pt-[clamp(3rem,5vw,4rem)]">
        <div className="shell">
          <div className="flex justify-between items-center mb-14">
            <Kicker>Pagina · Servizio Civile</Kicker>
            <Num>{data.code} · bando 2026</Num>
          </div>

          <h1 className="h-display">
            Un anno
            <br />
            dalla parte{" "}
            <em className="serif-it text-accent">giusta</em>.
          </h1>

          <p className="body-lg max-w-[720px] mt-8 text-ink-soft">
            {introText ??
              "Vivi dodici mesi dentro la Misericordia. Impari un mestiere fatto di persone, ti formi davvero, ricevi un'indennità mensile. Hai due strade: l'Universale (statale) o il Regionale toscano."}
          </p>

          {/* Tab switcher */}
          <div className="flex flex-col lg:flex-row rounded-[20px] lg:rounded-full mt-14 p-1.5 bg-bg-elev border border-hair-strong">
            {tipi.map((t, i) => (
              <button
                key={t.code}
                type="button"
                onClick={() => handleSelect(i)}
                onAnimationEnd={() => setBouncingIdx(null)}
                className={`w-full lg:flex-1 rounded-[14px] lg:rounded-full px-7 py-3 border-none cursor-pointer font-sans text-sm flex gap-3 items-center justify-center transition-colors duration-300 ${activeIdx === i ? 'bg-ink text-bg' : 'bg-transparent text-ink'} ${bouncingIdx === i ? 'animate-bounce-in' : ''}`}
              >
                <span className="font-mono text-[11px] tracking-[0.16em] opacity-70">
                  {t.code}
                </span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Summary ──────────────────────────────────── */}
      <section className="py-[clamp(3rem,6vw,5rem)]">
        <div className="shell" key={activeIdx}>
          {stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border border-hair-strong bg-hair-strong gap-px animate-fade-up">
              {stats.map(([k, v]) => (
                <div key={k} className="px-6 py-8 bg-bg-elev">
                  <Kicker noRule>{k}</Kicker>
                  <div className="serif text-[28px] mt-3.5 leading-[1.05]">{v}</div>
                </div>
              ))}
            </div>
          )}

          {data.scadenza && (
            <div className="dark-band flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mt-4 px-9 py-8 animate-fade-up" style={{ "--anim-delay": "0.1s" } as CSSProperties}>
              <div>
                <Kicker className="text-bg/60">Prossima scadenza</Kicker>
                <div className="heading-02 mt-3">
                  <span className="text-accent-soft">{formatDate(data.scadenza)}</span>
                  {data.scadenzaOra && (
                    <span className="text-bg/50 text-[22px] ml-6">
                      ore {data.scadenzaOra}
                    </span>
                  )}
                </div>
                {data.ente && (
                  <p className="body-sm mt-3 text-bg/70">
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
        <section className="pt-8 pb-24">
          <div className="shell animate-fade-up" key={`proj-${activeIdx}`} style={{ "--anim-delay": "0.15s" } as CSSProperties}>
            <div className="flex justify-between items-center mb-12">
              <Kicker>Progetti · {data.code} 2026</Kicker>
              <Num>{data.progetti.length} progetti aperti</Num>
            </div>
            <h2 className="heading-01 mb-12 max-w-[800px]">
              Scegli il <em className="serif-it">progetto</em> che ti somiglia di più.
            </h2>

            <div className="border-t border-hair-strong">
              {data.progetti.map((p, i) => (
                <div
                  key={p.codice}
                  className="grid grid-cols-1 lg:grid-cols-[120px_1fr_1fr_200px] py-10 px-8 border-b border-hair-strong gap-10 items-start bg-bg"
                >
                  <div>
                    <Num>0{i + 1}</Num>
                    <div className="mt-2 font-mono text-[11px] tracking-[0.12em] text-accent">
                      {p.codice}
                    </div>
                  </div>

                  <div>
                    <div className="serif text-[clamp(22px,2.2vw,32px)] leading-[1.1]">
                      {p.titolo}
                    </div>
                    {p.focus && (
                      <p className="body mt-4 max-w-[480px] text-ink-soft">{p.focus}</p>
                    )}
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Kicker noRule>Posti</Kicker>
                      <div className="serif text-[36px] mt-2">{p.posti}</div>
                    </div>
                    {p.sede && (
                      <div>
                        <Kicker noRule>Sede</Kicker>
                        <div className="mt-1.5 text-sm">{p.sede}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
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
                      <Btn variant="ghost" href="/contatti" arrow={false}>
                        Informazioni
                      </Btn>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
