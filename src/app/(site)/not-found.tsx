import type { Metadata } from "next";
import NotFoundMessage from "@/components/sections/NotFoundMessage";

export const metadata: Metadata = { title: "Pagina non trovata" };

// notFound() in a (site) page: header and footer come from the (site) layout.
export default function SiteNotFound() {
  return <NotFoundMessage />;
}
