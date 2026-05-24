import Kicker from "@/components/ui/Kicker";
import Num from "@/components/ui/Num";
import type { ScStep } from "@/lib/types";

export default function ScStepsSection({ steps }: { steps: ScStep[] }) {
  return (
    <section
      className="dark-band py-[clamp(4rem,8vw,6rem)]"
    >
      <div className="shell">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 48,
          }}
        >
          <Kicker>Come funziona</Kicker>
          <Num>0{steps.length} step</Num>
        </div>
        <h2 className="heading-01" style={{ marginBottom: 64, maxWidth: 800 }}>
          Dal click <em className="serif-it">al primo giorno</em>, in cinque
          passaggi.
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          style={{
            border: "1px solid rgba(242,236,224,0.15)",
            background: "rgba(242,236,224,0.15)",
            gap: "1px",
          }}
        >
          {steps.map((step) => (
            <div
              key={step.titolo}
              style={{
                padding: "32px 24px 36px",
                background: "var(--color-ink)",
              }}
            >
              {step.numero && (
                <div
                  className="serif"
                  style={{
                    fontSize: 56,
                    color: "var(--color-accent-soft)",
                    lineHeight: 1,
                  }}
                >
                  {step.numero}
                </div>
              )}
              <div style={{ marginTop: 24, fontSize: 17, fontWeight: 500 }}>
                {step.titolo}
              </div>
              {step.descrizione && (
                <p
                  className="body-sm"
                  style={{
                    marginTop: 10,
                    lineHeight: 1.65,
                    color: "rgba(242,236,224,0.75)",
                  }}
                >
                  {step.descrizione}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
