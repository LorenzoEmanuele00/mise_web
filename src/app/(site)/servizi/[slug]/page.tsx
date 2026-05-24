import { cache } from 'react'
import type { Metadata } from 'next'
import { client } from "@/sanity/lib/client";
import { SERVIZIO_QUERY, ALL_SERVIZI_SLUGS_QUERY } from "@/sanity/lib/queries";
import type { Servizio } from "@/lib/types";
import { buildMetadata } from '@/lib/seo'
import { notFound } from "next/navigation";
import Section from "@/components/layout/Section";
import Kicker from "@/components/ui/Kicker";

type Props = { params: Promise<{ slug: string }> }

const getServizio = cache((slug: string) =>
  client.fetch<Servizio | null>(SERVIZIO_QUERY, { slug }, { next: { tags: ['servizio'] } })
)

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(ALL_SERVIZI_SLUGS_QUERY);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const servizio = await getServizio(slug)
  if (!servizio) return {}
  return buildMetadata(servizio.seo, { title: servizio.title, description: servizio.shortDesc })
}

export default async function ServizioPage({ params }: Props) {
  const { slug } = await params;
  const servizio = await getServizio(slug);

  if (!servizio) notFound();

  return (
    <main>
      <Section loose>
        <p className="mb-6">
          <Kicker className="text-accent">{servizio.num}</Kicker>
        </p>
        <h1 className="heading-01 text-ink mb-8">{servizio.title}</h1>
        <p className="body-lg text-ink-soft max-w-2xl">{servizio.shortDesc}</p>
        {servizio.longDesc && (
          <p className="body text-ink-soft max-w-2xl mt-6">
            {servizio.longDesc}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-8 body-sm text-muted">
          {servizio.mezzi && <span>Mezzi: {servizio.mezzi}</span>}
          {servizio.orario && <span>Orari: {servizio.orario}</span>}
          {servizio.contatto && <span>Contatto: {servizio.contatto}</span>}
        </div>
      </Section>
    </main>
  );
}
