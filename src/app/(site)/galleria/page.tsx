import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { GALLERIA_QUERY } from "@/sanity/lib/queries";
import type { GalleriaData } from "@/lib/types";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/layout/PageHeader";
import GalleriaGrid from "@/components/sections/GalleriaGrid";

export const metadata: Metadata = {
  title: "Galleria",
  description:
    "Galleria fotografica della Misericordia di Gello — immagini delle attività, dei mezzi e dei volontari.",
};

export default async function GalleriaPage() {
  const data = await client.fetch<GalleriaData>(
    GALLERIA_QUERY,
    {},
    { next: { tags: ["galleria"] } },
  );

  return (
    <main>
      <Section loose>
        <PageHeader kicker="Fotografie" title="Galleria" />
        {data?.intro && (
          <p className="body-lg text-ink-soft mb-12">{data.intro}</p>
        )}
        {data?.images?.length ? (
          <GalleriaGrid images={data.images} />
        ) : (
          <p className="body-lg text-muted">
            La galleria fotografica sarà disponibile a breve.
          </p>
        )}
      </Section>
    </main>
  );
}
