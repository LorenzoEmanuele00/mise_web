"use client";

import { useState } from "react";
import Kicker from "@/components/ui/Kicker";
import type { ScFaq } from "@/lib/types";

export default function ScFaqSection({ faq }: { faq: ScFaq[] }) {
  const [open, setOpen] = useState<number>(-1);

  return (
    <section className="pt-8 pb-24">
      <div className="shell">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-20 items-start">
          <div>
            <Kicker>Domande frequenti</Kicker>
            <h2 className="heading-02 mt-6">
              Le risposte più <em className="serif-it">cercate</em>.
            </h2>
          </div>

          <div className="border-t border-hair-strong">
            {faq.map((item, i) => (
              <div key={i} className="border-b border-hair">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full py-6 bg-transparent border-none text-left cursor-pointer flex justify-between items-center gap-6"
                >
                  <span className="serif text-[clamp(18px,1.5vw,22px)]">
                    {item.domanda}
                  </span>
                  <span className={`text-lg shrink-0 transition-transform duration-300${open === i ? ' rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                <div className={`overflow-hidden transition-[max-height] duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)]${open === i ? ' max-h-[300px]' : ' max-h-0'}`}>
                  <p className="body pb-6 max-w-[720px] leading-[1.7] text-ink-soft">
                    {item.risposta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
