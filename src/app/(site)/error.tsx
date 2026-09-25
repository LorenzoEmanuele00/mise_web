"use client";

import { useEffect } from "react";
import StatusMessage from "@/components/sections/StatusMessage";
import Btn from "@/components/ui/Btn";

interface SiteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

// Error boundary for the pages: header and footer from the (site) layout
// stay visible. Errors in the layouts themselves reach global-error.tsx.
export default function SiteError({ error, retry }: SiteErrorProps) {
  useEffect(() => {
    // The digest matches the server-side log entry for this error.
    console.error("[site] Errore di pagina", error.digest ?? error.message);
  }, [error]);

  return (
    <main>
      <StatusMessage
        kicker="Errore"
        title="Qualcosa non ha funzionato."
        body="Non siamo riusciti a caricare questa pagina. Riprova tra qualche istante; se il problema continua, contattaci."
      >
        <Btn onClick={retry} variant="dark">
          Riprova
        </Btn>
        <Btn href="/" variant="ghost">
          Torna alla home
        </Btn>
      </StatusMessage>
    </main>
  );
}
