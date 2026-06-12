import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PAGE_QUERY } from "@/sanity/lib/queries";
import type { Page, TimelineEvent } from "@/lib/types";
import { buildMetadata } from "@/lib/seo";
import HeroSection from "@/components/sections/HeroSection";
import TimelineSection from "@/components/sections/TimelineSection";

const TIMELINE: TimelineEvent[] = [
  {
    year: "1994",
    title: "Fondazione",
    text: "L'attività della Misericordia di Gello è iniziata il 3 febbraio 1994, quando è stata costituita come sezione della V.A. Misericordia di Pistoia con lo scopo dell'esercizio volontario delle opere di Misericordia corporali e spirituali, della cura dei malati e degli anziani, del pronto soccorso e dell'intervento nelle pubbliche calamità nonchè di costituire un punto di aggregazione sociale e a scopo solidaristico nel paese di Gello e zone limitrofe.",
  },
  {
    year: "1996",
    title: "Indipendenza",
    text: "La Misericordia di Gello, pur rimanendo legata come Sezione della V.A. Misericordia di Pistoia e continuando a condividerne gli scopi, ha acquistato una propria autonomia fiscale.", 
  },
  {
    year: "1997",
    title: "Aggregazione sociale",
    text: 'Dal luglio 1997, facendo parte del Coordinamento delle Misericordie Provinciali di "Pistoia Soccorso", effettua servizi in convenzione con la ASL 3. Ai fini di promuovere l\'aggregazione sociale, la Misericordia di Gello organizza gite presso luoghi di particolare interesse artistico, culturale e paesaggistico.',
  },
  {
    year: "2004",
    title: "Trasporto Scolastico",
    text: "A partire dal 2004 abbiamo effettuato per la Circoscrizione 3 del Comune di Pistoia trasporti sociali di minori dalle proprie abitazioni o dalle scuole del Centro Sociale Airone di Gello.",
  },
  {
    year: "2007",
    title: "Confraternita",
    text: "Il 28 novembre 2007, avuto il parere favorevole della V.A. Misericordia di Pistoia e della Confederazione delle Misericordie d'Italia, la Misericordia di Gello ha assunto la denominazione di Confraternita di Misericordia Gello-Pistoia.",
  },
  {
    year: "Oggi",
    title: "Sempre presenti",
    text: "Decine di volontari attivi ogni giorno garantiscono servizi operativi ogni giorno, dal trasporto sociale alla gestione delle emergenze con il 118.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch<Page | null>(
    PAGE_QUERY,
    { slug: "storia", lang: "it" },
    { next: { tags: ["page"] } },
  );
  return buildMetadata(page?.seo, { title: "La nostra storia" });
}

export default async function StoriaPage() {
  const page = await client.fetch<Page | null>(
    PAGE_QUERY,
    { slug: "storia", lang: "it" },
    { next: { tags: ["page"] } },
  );

  return (
    <main>
      <HeroSection hero={page?.heroSection} />
      <TimelineSection events={TIMELINE} />
    </main>
  );
}
