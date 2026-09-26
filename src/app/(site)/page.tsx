import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { HOME_QUERY } from "@/sanity/lib/queries";
import type { HomeData } from "@/lib/types";
import { buildMetadata } from "@/lib/seo";
import HeroSection from "@/components/sections/HeroSection";
import StatsStrip from "@/components/sections/StatsStrip";
import ServiziGrid from "@/components/sections/ServiziGrid";
import NewsGrid from "@/components/sections/NewsGrid";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch<HomeData>(
    HOME_QUERY,
    { lang: "it" },
    { next: { tags: ["page"] } },
  );
  return buildMetadata(data?.page?.seo, { title: "Home" });
}

export default async function HomePage() {
  const data = await client.fetch<HomeData>(
    HOME_QUERY,
    { lang: "it" },
    { next: { tags: ["page", "servizio", "post"] } },
  );

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NGO",
          name: SITE_NAME,
          url: SITE_URL,
          foundingDate: "1994",
        }}
      />
      <HeroSection hero={data?.page?.heroSection} display />
      <StatsStrip />
      <ServiziGrid servizi={data?.servizi ?? []} preview />
      <NewsGrid posts={data?.news ?? []} preview />
    </main>
  );
}
