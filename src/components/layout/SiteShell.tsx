import type { ReactNode } from "react";
import { client } from "@/sanity/lib/client";
import { SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { Settings } from "@/lib/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Header + footer around the page content. Shared by the (site) layout and
// the root 404 page, which renders outside the (site) route group.
export default async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await client.fetch<Settings | null>(
    SETTINGS_QUERY,
    {},
    { next: { tags: ["settings"] } },
  );

  return (
    <>
      <a href="#main" className="skip-link">
        Salta al contenuto
      </a>
      <Header logo={settings?.logo ?? null} />
      <div id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </div>
      <Footer settings={settings} />
    </>
  );
}
