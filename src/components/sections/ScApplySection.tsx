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
      <section
        className="dark-band"
        style={{ paddingTop: 120, paddingBottom: 120 }}
      >
        <div className="shell" style={{ textAlign: "center" }}>
          <Kicker style={{ color: "rgba(242,236,224,0.6)" }}>
            Richiesta inviata
          </Kicker>
          <h2
            className="heading-01"
            style={{ marginTop: 32, color: "var(--color-bg)" }}
          >
            Grazie, {form.nome || "te"}.<br />
            <em
              className="serif-it"
              style={{ color: "var(--color-accent-soft)" }}
            >
              Ci sentiamo entro 5 giorni.
            </em>
          </h2>
          <p
            className="body-lg"
            style={{
              marginTop: 24,
              color: "rgba(242,236,224,0.75)",
              maxWidth: 520,
              margin: "24px auto 0",
            }}
          >
            Una volontaria della selezione ti scriverà a {form.email || "—"} per
            concordare un primo incontro in sede.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="dark-band"
      style={{ paddingTop: 120, paddingBottom: 120 }}
    >
      <div className="shell">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          {/* Left copy */}
          <div>
            <Kicker style={{ color: "rgba(242,236,224,0.6)" }}>
              Manifesta interesse
            </Kicker>
            <h2
              className="heading-01"
              style={{ marginTop: 32, color: "var(--color-bg)" }}
            >
              Pensi che faccia per te?
              <br />
              <em
                className="serif-it"
                style={{ color: "var(--color-accent-soft)" }}
              >
                Lasciaci i tuoi contatti.
              </em>
            </h2>
            <p
              className="body-lg"
              style={{ marginTop: 24, color: "rgba(242,236,224,0.75)" }}
            >
              Non è la domanda ufficiale (quella si fa su DOL con SPID). È solo
              un modo per dirci che ti interessa: ti invitiamo in sede, ti
              spieghiamo i progetti, e quando apre il bando ti aiutiamo passo
              passo.
            </p>
            <div
              className="rule"
              style={{
                marginTop: 48,
                marginBottom: 24,
                background: "rgba(242,236,224,0.18)",
              }}
            />
            <div
              className="body-sm"
              style={{ color: "rgba(242,236,224,0.65)" }}
            >
              Per dubbi specifici:{" "}
              <span style={{ color: "var(--color-accent-soft)" }}>
                serviziocivile@misericordiadigello.it
              </span>
            </div>
          </div>

          {/* Right form */}
          <form
            action={action}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.18)",
              padding: 40,
            }}
          >
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <Kicker style={{ color: "rgba(242,236,224,0.55)" }}>
                Step {step + 1} di 3
              </Kicker>
              <div style={{ display: "flex", gap: 6 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 36,
                      height: 3,
                      background:
                        step >= i
                          ? "var(--color-accent)"
                          : "rgba(255,255,255,0.2)",
                      transition: "background .3s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Step 0 — contacts */}
            <div style={{ display: step === 0 ? "grid" : "none", gap: 32 }}>
              <div>
                <label
                  className="input-label"
                  style={{ color: "rgba(242,236,224,0.55)" }}
                  htmlFor="sc-nome"
                >
                  Nome e cognome
                </label>
                <input
                  id="sc-nome"
                  name="nome"
                  className="input"
                  style={{
                    color: "var(--color-bg)",
                    borderBottomColor: "rgba(255,255,255,0.3)",
                  }}
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Es. Sofia Mancini"
                />
              </div>
              <div>
                <label
                  className="input-label"
                  style={{ color: "rgba(242,236,224,0.55)" }}
                  htmlFor="sc-email"
                >
                  Email
                </label>
                <input
                  id="sc-email"
                  name="email"
                  type="email"
                  className="input"
                  style={{
                    color: "var(--color-bg)",
                    borderBottomColor: "rgba(255,255,255,0.3)",
                  }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nome@email.it"
                />
              </div>
              <div>
                <label
                  className="input-label"
                  style={{ color: "rgba(242,236,224,0.55)" }}
                  htmlFor="sc-eta"
                >
                  Età
                </label>
                <input
                  id="sc-eta"
                  name="eta"
                  className="input"
                  style={{
                    color: "var(--color-bg)",
                    borderBottomColor: "rgba(255,255,255,0.3)",
                  }}
                  value={form.eta}
                  onChange={(e) => setForm({ ...form, eta: e.target.value })}
                  placeholder="Es. 21"
                />
              </div>
            </div>

            {/* Step 1 — project picker */}
            <div style={{ display: step === 1 ? "block" : "none" }}>
              <div
                className="input-label"
                style={{ color: "rgba(242,236,224,0.55)", marginBottom: 20 }}
              >
                Quale progetto ti interessa?
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {allProjects.map((p) => (
                  <button
                    key={p.codice}
                    type="button"
                    onClick={() => setForm({ ...form, progetto: p.codice })}
                    style={{
                      textAlign: "left",
                      padding: "20px 22px",
                      background:
                        form.progetto === p.codice
                          ? "var(--color-accent)"
                          : "transparent",
                      border: "1px solid",
                      borderColor:
                        form.progetto === p.codice
                          ? "var(--color-accent)"
                          : "rgba(255,255,255,0.25)",
                      color: "var(--color-bg)",
                      cursor: "pointer",
                      transition: "all .25s",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        opacity: 0.7,
                      }}
                    >
                      {p.tipoCode} · {p.codice}
                    </div>
                    <div
                      className="serif"
                      style={{ fontSize: 20, marginTop: 8 }}
                    >
                      {p.titolo}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — motivation */}
            <div style={{ display: step === 2 ? "block" : "none" }}>
              <label
                className="input-label"
                style={{ color: "rgba(242,236,224,0.55)" }}
                htmlFor="sc-motivo"
              >
                Perché ti interessa? (facoltativo)
              </label>
              <textarea
                id="sc-motivo"
                name="motivo"
                rows={5}
                className="input"
                style={{
                  color: "var(--color-bg)",
                  borderBottomColor: "rgba(255,255,255,0.3)",
                  resize: "vertical",
                  paddingTop: 18,
                }}
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="Quello che ti viene in mente. Bastano due righe."
              />
            </div>

            {state.error && (
              <p
                className="body-sm"
                style={{ color: "var(--color-accent-soft)", marginTop: 16 }}
              >
                {state.error}
              </p>
            )}

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <button
                type="button"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                style={{
                  background: "transparent",
                  border: "none",
                  color:
                    step === 0 ? "rgba(255,255,255,0.25)" : "var(--color-bg)",
                  cursor: step === 0 ? "default" : "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                ← Indietro
              </button>

              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
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
