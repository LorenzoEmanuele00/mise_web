"use client";

import { useEffect } from "react";
import StatusMessage from "@/components/sections/StatusMessage";
import Btn from "@/components/ui/Btn";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

// Last-resort boundary: replaces the root layout when it (or the (site)
// layout) fails, so it must render its own <html> and <body>.
export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[global] Errore di layout", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <title>Errore | Misericordia di Gello</title>
        <main>
          <StatusMessage
            kicker="Errore"
            title="Il sito non è disponibile in questo momento."
            body="Riprova tra qualche istante. Per urgenze sanitarie chiama il 112."
          >
            <Btn onClick={retry} variant="dark">
              Riprova
            </Btn>
          </StatusMessage>
        </main>
      </body>
    </html>
  );
}
