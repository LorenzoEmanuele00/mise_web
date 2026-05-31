import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PAGE_QUERY } from "@/sanity/lib/queries";
import type { Page, TimelineEvent } from "@/lib/types";
import { buildMetadata } from "@/lib/seo";
import HeroSection from "@/components/sections/HeroSection";
import TimelineSection from "@/components/sections/TimelineSection";

const TIMELINE: TimelineEvent[] = [
  {
    year: "1947",
    title: "Fondazione",
    text: "La Confraternita Misericordia di Gello nasce grazie all'impegno di un gruppo di volontari della comunità locale, con l'obiettivo di assistere malati e anziani.",
  },
  {
    year: "1970",
    title: "Servizi di emergenza",
    text: "Avvio della collaborazione con il sistema di emergenza sanitaria territoriale e acquisto dei primi mezzi di soccorso.",
  },
  {
    year: "1990",
    title: "Espansione",
    text: "Potenziamento della flotta, ampliamento delle attività di assistenza e consolidamento della presenza sul territorio di San Giuliano Terme.",
  },
  {
    year: "2010",
    title: "Nuova sede",
    text: "Inaugurazione della sede ampliata con spazi dedicati alla formazione dei volontari e all'accoglienza della comunità.",
  },
  {
    year: "Oggi",
    title: "Sempre presenti",
    text: "Decine di volontari attivi ogni giorno garantiscono sei servizi operativi h24, dalla protezione civile al trasporto sociale.",
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
