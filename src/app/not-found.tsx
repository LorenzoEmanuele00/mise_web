import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";
import NotFoundMessage from "@/components/sections/NotFoundMessage";

// Next.js already adds noindex to 404 responses.
export const metadata: Metadata = { title: "Pagina non trovata" };

// Unmatched URLs: rendered under the root layout only, so it brings its own
// header and footer. notFound() inside (site) uses (site)/not-found.tsx.
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundMessage />
    </SiteShell>
  );
}
