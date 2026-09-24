import StatusMessage from "@/components/sections/StatusMessage";
import Btn from "@/components/ui/Btn";

export default function NotFoundMessage() {
  return (
    <main>
      <StatusMessage
        kicker="Errore 404"
        title="Questa pagina non esiste."
        body="Forse il link è vecchio o l'indirizzo è stato scritto male. Puoi ripartire dalla home o scriverci se cercavi qualcosa in particolare."
      >
        <Btn href="/" variant="dark">
          Torna alla home
        </Btn>
        <Btn href="/contatti" variant="ghost">
          Contattaci
        </Btn>
      </StatusMessage>
    </main>
  );
}
