import Kicker from "@/components/ui/Kicker";
import Num from "@/components/ui/Num";
import type { ScStep } from "@/lib/types";

export default function ScStepsSection({ steps }: { steps: ScStep[] }) {
  return (
    <section className="dark-band py-[clamp(4rem,8vw,6rem)]">
      <div className="shell">
        <div className="flex justify-between items-center mb-12">
          <Kicker>Come funziona</Kicker>
          <Num>0{steps.length} step</Num>
        </div>
        <h2 className="heading-01 mb-16 max-w-[800px]">
          Dal click <em className="serif-it">al primo giorno</em>, in cinque passaggi.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border border-bg/15 bg-bg/15 gap-px">
          {steps.map((step) => (
            <div key={step.titolo} className="px-6 pt-8 pb-9 bg-ink">
              {step.numero && (
                <div className="serif text-[56px] text-accent-soft leading-none">
                  {step.numero}
                </div>
              )}
              <div className="mt-6 text-[17px] font-medium">{step.titolo}</div>
              {step.descrizione && (
                <p className="body-sm mt-2.5 leading-[1.65] text-bg/75">
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
