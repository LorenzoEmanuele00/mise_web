"use client";

import { useState, useActionState } from "react";
import Kicker from "@/components/ui/Kicker";
import Arrow from "@/components/ui/Arrow";
import { submitScInterest, type FormState } from "@/app/actions/submitForms";
import type { TipoServizio } from "@/lib/types";

interface ScApplySectionProps {
  tipi: TipoServizio[];
}

const initial: FormState = { success: false };

export default function ScApplySection({ tipi }: ScApplySectionProps) {
  const [state, action, pending] = useActionState(submitScInterest, initial);
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState<string | undefined>(undefined);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    eta: "",
    progetto: "",
    motivo: "",
  });

  const allProjects = tipi.flatMap((t) =>
    (t.progetti ?? []).map((p) => ({
      ...p,
      tipoCode: t.code,
      tipoLabel: t.label,
    })),
  );

  if (state.success) {
    return (
      <section className="dark-band py-[clamp(5rem,10vw,7.5rem)]">
        <div className="shell text-center">
          <Kicker className="text-bg/60">Richiesta inviata</Kicker>
          <h2 className="heading-01 mt-8 text-bg">
            Grazie, {form.nome || "te"}.<br />
            <em className="serif-it text-accent-soft">Ci sentiamo entro 5 giorni.</em>
          </h2>
          <p className="body-lg mt-6 text-bg/75 max-w-[520px] mx-auto">
            Una volontaria della selezione ti scriverà a {form.email || "—"} per
            concordare un primo incontro in sede.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="dark-band py-[clamp(5rem,10vw,7.5rem)]">
      <div className="shell">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-20 items-start">
          {/* Left copy */}
          <div>
            <Kicker className="text-bg/60">Manifesta interesse</Kicker>
            <h2 className="heading-01 mt-8 text-bg">
              Pensi che faccia per te?<br />
              <em className="serif-it text-accent-soft">Lasciaci i tuoi contatti.</em>
            </h2>
            <p className="body-lg mt-6 text-bg/75">
              Non è la domanda ufficiale (quella si fa su DOL con SPID). È solo
              un modo per dirci che ti interessa: ti invitiamo in sede, ti
              spieghiamo i progetti, e quando apre il bando ti aiutiamo passo passo.
            </p>
            <div className="h-px bg-bg/18 mt-12 mb-6" />
            <div className="body-sm text-bg/65">
              Per dubbi specifici:{" "}
              <span className="text-accent-soft">serviziocivile@misericordiadigello.it</span>
            </div>
          </div>

          {/* Right form */}
          <form action={action} className="bg-white/4 border border-white/18 p-10">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Hidden inputs always submitted */}
            <input type="hidden" name="progetto" value={form.progetto} />

            {/* Step indicators */}
            <div className="flex justify-between items-center mb-8">
              <Kicker className="text-bg/55">Step {step + 1} di 3</Kicker>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-9 h-[3px] transition-colors duration-300 ${step >= i ? 'bg-accent' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>

            {/* Step 0 — contacts */}
            <div className={`${step === 0 ? 'grid' : 'hidden'} gap-8`}>
              <div>
                <label className="input-label label-on-dark" htmlFor="sc-nome">
                  Nome e cognome
                </label>
                <input
                  id="sc-nome"
                  name="nome"
                  className="input input-on-dark"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Es. Sofia Mancini"
                />
              </div>
              <div>
                <label className="input-label label-on-dark" htmlFor="sc-email">
                  Email
                </label>
                <input
                  id="sc-email"
                  name="email"
                  type="email"
                  className="input input-on-dark"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nome@email.it"
                />
              </div>
              <div>
                <label className="input-label label-on-dark" htmlFor="sc-eta">
                  Età
                </label>
                <input
                  id="sc-eta"
                  name="eta"
                  className="input input-on-dark"
                  value={form.eta}
                  onChange={(e) => setForm({ ...form, eta: e.target.value })}
                  placeholder="Es. 21"
                />
              </div>
            </div>

            {/* Step 1 — project picker */}
            <div className={step === 1 ? 'block' : 'hidden'}>
              <div className="input-label label-on-dark mb-5">
                Quale progetto ti interessa?
              </div>
              <div className="grid gap-3">
                {allProjects.map((p) => (
                  <button
                    key={p.codice}
                    type="button"
                    onClick={() => setForm({ ...form, progetto: p.codice })}
                    className={`text-left px-[22px] py-5 border text-bg cursor-pointer transition-all duration-[250ms] ${form.progetto === p.codice ? 'bg-accent border-accent' : 'bg-transparent border-white/25'}`}
                  >
                    <div className="font-mono text-[10px] tracking-[0.18em] opacity-70">
                      {p.tipoCode} · {p.codice}
                    </div>
                    <div className="serif text-[20px] mt-2">{p.titolo}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — motivation */}
            <div className={step === 2 ? 'block' : 'hidden'}>
              <label className="input-label label-on-dark" htmlFor="sc-motivo">
                Perché ti interessa? (facoltativo)
              </label>
              <textarea
                id="sc-motivo"
                name="motivo"
                rows={5}
                className="input input-on-dark resize-y pt-[18px]"
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="Quello che ti viene in mente. Bastano due righe."
              />
            </div>

            {(state.error || stepError) && (
              <p className="body-sm text-accent-soft mt-4">
                {stepError ?? state.error}
              </p>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10">
              <button
                type="button"
                onClick={() => { setStep(Math.max(0, step - 1)); setStepError(undefined) }}
                disabled={step === 0}
                className={`bg-transparent border-none font-mono text-[12px] tracking-[0.18em] uppercase ${step === 0 ? 'text-white/25 cursor-default' : 'text-bg cursor-pointer'}`}
              >
                ← Indietro
              </button>

              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 0) {
                      if (form.nome.trim().length < 2) {
                        setStepError('Inserisci il tuo nome (almeno 2 caratteri)')
                        return
                      }
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                        setStepError("Inserisci un'email valida")
                        return
                      }
                      setStepError(undefined)
                    }
                    setStep(step + 1)
                  }}
                  className="btn btn-accent"
                >
                  <span>Avanti</span>
                  <Arrow />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-accent"
                  disabled={pending}
                >
                  <span>{pending ? "Invio…" : "Invia richiesta"}</span>
                  {!pending && <Arrow />}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
