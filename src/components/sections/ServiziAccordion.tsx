"use client";

import { useState } from "react";
import type { ServizioListItem } from "@/lib/types";
import Num from "@/components/ui/Num";
import Arrow from "@/components/ui/Arrow";

interface ServiziAccordionProps {
  servizi: ServizioListItem[];
}

export default function ServiziAccordion({ servizi }: ServiziAccordionProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="border-t border-hair">
      {servizi.map((s) => {
        const isOpen = open === s._id;
        return (
          <div key={s._id} className="border-b border-hair">
            <button
              className="w-full flex items-center gap-6 py-8 text-left"
              onClick={() => setOpen(isOpen ? null : s._id)}
              aria-expanded={isOpen}
            >
              <Num>{s.num}</Num>
              <span className="heading-03 flex-1 text-ink">{s.title}</span>
              <Arrow dir={isOpen ? "up" : "down"} size={16} />
            </button>

            {isOpen && (
              <div className="pb-10 pl-8 md:pl-14">
                <p className="body max-w-2xl text-ink-soft">{s.shortDesc}</p>
                {s.longDesc && (
                  <p className="body max-w-2xl mt-4 text-ink-soft">
                    {s.longDesc}
                  </p>
                )}
                {(s.mezzi || s.orario || s.contatto) && (
                  <div className="mt-6 flex flex-wrap gap-8 body-sm text-muted">
                    {s.mezzi && <span>Mezzi: {s.mezzi}</span>}
                    {s.orario && <span>Orari: {s.orario}</span>}
                    {s.contatto && <span>Contatto: {s.contatto}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
