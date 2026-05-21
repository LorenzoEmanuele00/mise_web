# Guida Sanity Studio — Mappatura campi → frontend → codice

Per ogni sezione dell'admin Studio questa guida dice:
- **cosa fa** il campo
- **dove appare** nel sito pubblico
- **quale file** del codice lo legge

---

## Impostazioni Sito (`settings`)

Documento singleton. Si trova in Studio sotto **"Impostazioni Sito"**.

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Nome sito** | Non ancora usato nel frontend (previsto per `<title>` globale) | — |
| **Logo** | Non ancora usato (il logo è hardcoded nell'header) | `Header.tsx` |
| **Navigazione** → Etichetta / URL | Non ancora usato (i link nav sono hardcoded) | `Header.tsx:8-16` |
| **Testo footer** | Non ancora usato nel frontend | — |
| **Indirizzo sede** | Pagina `/contatti` → sezione "Indirizzo" · Footer → colonna "Contatti" | `contatti/page.tsx:21-25` · `Footer.tsx:70-73` |
| **Telefono centralino** | Pagina `/contatti` → sezione "Telefono" · Footer → "Contatti" e "Emergenze" | `contatti/page.tsx:26-31` · `Footer.tsx:74` · `Footer.tsx:95` |
| **Email info** | Pagina `/contatti` → sezione "Email" · Footer → colonna "Contatti" | `contatti/page.tsx:32-37` · `Footer.tsx:79` |
| **Email Servizio Civile** | Non ancora usato nel frontend | — |
| **IBAN donazioni** | Non ancora usato nel frontend | — |
| **Codice Fiscale (5×1000)** | Footer → barra in fondo: "C.F. XXXXXXXXXX" | `Footer.tsx:103` |
| **Orari sede** | Pagina `/contatti` → sezione "Orari sede" | `contatti/page.tsx:38-43` |

> `settings` è letto nel layout globale (`(site)/layout.tsx:8`) e passato al `Footer` come prop. L'`Header` è per ora hardcoded e non riceve `settings`.

---

## Pagina (`page`)

Usato per le pagine statiche: **Home**, **Storia**, **Volontariato**.  
Ogni documento corrisponde a uno slug fisso (`home`, `storia`, `volontariato`).

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Titolo** | Usato come chiave interna (non renderizzato direttamente) | — |
| **Slug** | Determina quale pagina viene caricata (es. `storia` → `/storia`) | `queries.ts:PAGE_QUERY` |
| **Lingua** | Filtro interno — non visibile all'utente | `queries.ts` |
| **SEO → Meta title** | `<title>` nel browser (da agganciare in `generateMetadata`) | — |
| **SEO → Meta description** | Tag `<meta name="description">` | — |
| **SEO → Open Graph image** | Immagine per anteprima su social/WhatsApp | — |

### Hero (sezione `heroSection` dentro `page`)

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Kicker** (label sopra il titolo) | Piccolo testo in colore rosso/accent sopra il titolo H1 | `page.tsx:20` · `storia/page.tsx:17` · `volontariato/page.tsx:17` |
| **Testo prima della parola in evidenza** | Prima parte del titolo H1 grande | `page.tsx:22` · `storia/page.tsx:19` |
| **Parola in evidenza** (italic accent) | Parola in corsivo + colore accent nel titolo H1 | `page.tsx:23` · `storia/page.tsx:20` |
| **Testo dopo la parola in evidenza** | Ultima parte del titolo H1 | `page.tsx:24` · `storia/page.tsx:21` |
| **Paragrafo introduttivo** | Testo grigio sotto il titolo | `page.tsx:27` · `storia/page.tsx:23` |
| **CTA primario → Etichetta** | Testo del bottone scuro principale | `page.tsx:32` *(solo home)* |
| **CTA primario → URL** | Destinazione del bottone principale | `page.tsx:31` |
| **CTA secondario → Etichetta** | Testo del bottone ghost (outline) | `page.tsx:36` *(solo home)* |
| **CTA secondario → URL** | Destinazione del bottone ghost | `page.tsx:35` |

> I CTA compaiono solo nella home (`src/app/(site)/page.tsx`). Nelle pagine Storia e Volontariato il hero mostra solo kicker, titolo e paragrafo.

---

## Articolo News (`post`)

Ogni documento è un articolo pubblicato su `/news/[slug]`.

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Titolo** | H1 nella pagina articolo · H2/H3 nelle card news · card in homepage | `news/[slug]/page.tsx:34` · `news/page.tsx:26` · `page.tsx:72` |
| **Slug** | URL dell'articolo: `/news/questo-slug` | `news/[slug]/page.tsx` |
| **Lingua** | Filtro — non visibile | `queries.ts:POSTS_QUERY` |
| **Tag** (Comunicato / Bando / Formazione / Eventi) | Badge colorato sopra il titolo nelle card e nell'articolo | `news/[slug]/page.tsx:31` · `news/page.tsx:24` · `page.tsx:70` |
| **Data** | Data formattata (es. "21 maggio 2026") sotto il titolo | `news/[slug]/page.tsx:35` · `news/page.tsx:29` |
| **Estratto** | Testo breve nelle card · testo introduttivo grande nell'articolo | `news/[slug]/page.tsx:37` · `news/page.tsx:28` |
| **Immagine di copertina** | Non ancora renderizzata (campo pronto per implementazione futura) | — |
| **Corpo** | Corpo completo dell'articolo — non ancora renderizzato | — |
| **SEO** | Metadata per il browser e social | — |

> Le card in homepage mostrano solo tag, titolo, data (senza estratto). La lista `/news` mostra anche l'estratto.

---

## Servizio (`servizio`)

Ogni documento è uno dei servizi offerti (S/01, S/02 …).  
Appare in lista su `/servizi` e in dettaglio su `/servizi/[slug]`.

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Codice** (es. S/01) | Badge grigio monospaziato sopra il nome del servizio | `servizi/page.tsx:21` · `servizi/[slug]/page.tsx:28` · `page.tsx:51` |
| **Titolo** | Nome del servizio — H2 in lista, H1 in dettaglio | `servizi/page.tsx:23` · `servizi/[slug]/page.tsx:29` |
| **Slug** | URL della pagina dettaglio: `/servizi/questo-slug` | `servizi/[slug]/page.tsx` |
| **Lingua** | Filtro — non visibile | `queries.ts` |
| **Descrizione breve** | Testo nelle card home · prima riga descrittiva in lista | `page.tsx:53` · `servizi/page.tsx:25` · `servizi/[slug]/page.tsx:30` |
| **Descrizione completa** | Paragrafo aggiuntivo in lista e dettaglio (se compilato) | `servizi/page.tsx:27-29` · `servizi/[slug]/page.tsx:31-33` |
| **Mezzi impiegati** | "Mezzi: …" nella riga metadati sotto la descrizione | `servizi/page.tsx:30` · `servizi/[slug]/page.tsx:35` |
| **Orario / disponibilità** | "Orari: …" nella riga metadati | `servizi/page.tsx:31` · `servizi/[slug]/page.tsx:36` |
| **Numero / email / riferimento** | "Contatto: …" nella riga metadati | `servizi/page.tsx:32` · `servizi/[slug]/page.tsx:37` |
| **Ordine visualizzazione** | Controlla l'ordine in cui appaiono i servizi nelle liste | `queries.ts:SERVIZI_QUERY` (`order asc`) |

---

## Mezzo (`mezzo`)

Ogni documento è un veicolo del parco mezzi.  
Previsto per la pagina `/galleria` — attualmente non ancora renderizzata.

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Codice** (es. A1) | Etichetta identificativa del mezzo | `queries.ts:MEZZI_QUERY` *(galleria non implementata)* |
| **Modello** (es. Fiat Ducato) | Nome del veicolo | — |
| **Anno immatricolazione** | Anno del mezzo | — |
| **Ruolo / utilizzo** | Descrizione funzione (es. "Emergenza 118") | — |
| **Foto** | Immagine del mezzo nella griglia | — |
| **Ordine visualizzazione** | Ordine nella griglia galleria | `queries.ts:MEZZI_QUERY` (`order asc`) |

> La query `MEZZI_QUERY` è già scritta ma la pagina `/galleria` mostra solo un placeholder. I dati saranno visibili quando la galleria verrà implementata.

---

## Servizio Civile (`servizioCivile`)

Documento singleton. Pagina pubblica: `/servizio-civile`.  
Query: `src/sanity/lib/queries.ts:SERVIZIO_CIVILE_QUERY`.

### Sezione hero

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Testo introduttivo hero** | Paragrafo grigio sotto il titolo "Servizio Civile" | `servizio-civile/page.tsx:19` |

### Tipi di Servizio Civile (array — es. SCU, SCR)

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Codice tab** (es. SCU) | Chiave interna React — non mostrato direttamente | `servizio-civile/page.tsx:28` |
| **Nome esteso** (es. Universale) | H2 del blocco: "Servizio Civile Universale" | `servizio-civile/page.tsx:29` |
| **Ente promotore** | "Ente: …" in grigio sotto il titolo del tipo | `servizio-civile/page.tsx:30` |
| **Durata** | Strip riepilogativa → colonna "Durata" | `servizio-civile/page.tsx:34` |
| **Età** | Strip riepilogativa → colonna "Età" | `servizio-civile/page.tsx:35` |
| **Impegno settimanale** | Strip riepilogativa → colonna "Impegno" | `servizio-civile/page.tsx:36` |
| **Compenso mensile** | Strip riepilogativa → colonna "Compenso" | `servizio-civile/page.tsx:37` |
| **Posti totali** | Strip riepilogativa → colonna "Posti totali" | `servizio-civile/page.tsx:38` |
| **Data scadenza bando** | "Scadenza bando: [data formattata]" | `servizio-civile/page.tsx:43` |
| **Ora scadenza** | "ore [ora]" accanto alla data di scadenza | `servizio-civile/page.tsx:44` |
| **URL portale DOL** | Bottone "Candidati sul portale DOL" | `servizio-civile/page.tsx:49-51` |

#### Progetti (dentro ogni tipo)

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Codice progetto** (es. SCU-MGE-26-A) | Badge monospace accanto al titolo del progetto | `servizio-civile/page.tsx:62` |
| **Titolo progetto** | Nome del progetto in H4 | `servizio-civile/page.tsx:63` |
| **Numero posti** | "Posti: [n]" sotto il titolo | `servizio-civile/page.tsx:66` |
| **Sede di svolgimento** | "Sede: …" accanto ai posti | `servizio-civile/page.tsx:67` |
| **Descrizione attività** | Testo descrittivo del progetto | `servizio-civile/page.tsx:69` |
| **Scheda progetto (PDF)** | Bottone "Scarica scheda PDF" (link diretto al file) | `servizio-civile/page.tsx:71-73` |

### Come funziona — 5 step

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Numero** (es. 01) | Numero grande in colore accent sopra il titolo | `servizio-civile/page.tsx:92` |
| **Titolo** | Nome dello step | `servizio-civile/page.tsx:93` |
| **Descrizione** | Breve testo descrittivo dello step | `servizio-civile/page.tsx:94` |

### Testimonianze

Non ancora renderizzate nel frontend. I dati vengono già fetchati (`SERVIZIO_CIVILE_QUERY` include `testimonianze[]`) ma non c'è ancora JSX che li mostra.

| Campo in Studio | Utilizzo futuro |
|---|---|
| **Nome e età** (es. Sofia, 22) | Nome + età nella card testimonianza |
| **Anno servizio** (es. SCU 2024) | Etichetta anno sotto il nome |
| **Foto** | Foto profilo nella card |
| **Citazione** (senza virgolette) | Testo citazione — le virgolette vengono aggiunte dal CSS |

### Domande frequenti (FAQ)

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Domanda** | H3 nell'accordion FAQ | `servizio-civile/page.tsx:108` |
| **Risposta** | Testo sotto la domanda | `servizio-civile/page.tsx:109` |

### SEO

| Campo in Studio | Dove appare nel sito | File/riga codice |
|---|---|---|
| **Meta title** | `<title>` nel browser | *(da agganciare in `generateMetadata`)* |
| **Meta description** | Tag meta description | — |
| **Open Graph image** | Immagine anteprima social | — |

---

## Messaggio Contatti (`contactSubmission`) — sola lettura in Studio

Questi documenti vengono creati automaticamente quando un utente invia il form contatti.  
In Studio si vedono in sola lettura per gestire le richieste.

| Campo in Studio | Provenienza |
|---|---|
| **Nome** | Campo "Nome" del form `/contatti` |
| **Email** | Campo "Email" del form |
| **Oggetto** | Campo "Oggetto" del form |
| **Messaggio** | Textarea "Messaggio" del form |
| **Ricevuto il** | Timestamp automatico alla ricezione |
| **IP** | *(nascosto in Studio)* — IP del mittente per antispam |

> Il form di contatto è attualmente un placeholder ("disponibile a breve") in `contatti/page.tsx:49`. L'API route e la scrittura in Sanity non sono ancora implementate.

---

## Candidatura Volontario (`volunteerSubmission`) — sola lettura in Studio

Stessa logica di `contactSubmission` per il form volontariato.

| Campo in Studio | Provenienza |
|---|---|
| **Nome** | Campo "Nome" del form `/volontariato` |
| **Cognome** | Campo "Cognome" |
| **Email** | Campo "Email" |
| **Telefono** | Campo "Telefono" |
| **Aree di interesse** | Checkbox multipli |
| **Disponibilità** | Textarea disponibilità oraria |
| **Ricevuto il** | Timestamp automatico |
| **IP** | *(nascosto)* |

> Anche qui il form è un placeholder in `volontariato/page.tsx:26-28`.

---

## Riepilogo: cosa è hardcoded vs cosa viene da Sanity

| Elemento del sito | Da Sanity? | Note |
|---|---|---|
| Logo nell'header | No | Hardcoded: lettera "M" in `Header.tsx:18-27` |
| Voci di navigazione (desktop + mobile) | No | Hardcoded in `Header.tsx:8-16` e `Footer.tsx:6-15` |
| Testo "dal 1947" nell'header | No | Hardcoded in `Header.tsx:65` |
| Link "Unisciti" nell'header | No | Hardcoded → `/volontariato` |
| Numero "118" nell'header e footer | No | Hardcoded |
| Hero homepage (titolo, kicker, CTA) | **Sì** | Da `page` slug=`home` → `heroSection` |
| Hero storia / volontariato | **Sì** | Da `page` slug=`storia`/`volontariato` → `heroSection` |
| Card servizi in homepage | **Sì** | Primi 6 da `servizio` |
| Card news in homepage | **Sì** | Ultimi 3 da `post` |
| Lista completa `/servizi` | **Sì** | Tutti i `servizio` ordinati per `order` |
| Pagina dettaglio servizio | **Sì** | `servizio` per slug |
| Lista `/news` | **Sì** | Tutti i `post` ordinati per data |
| Pagina articolo `/news/[slug]` | **Sì** | `post` per slug (corpo non ancora renderizzato) |
| Pagina `/servizio-civile` | **Sì** | Singleton `servizioCivile` |
| Pagina `/contatti` (indirizzo, tel, email, orari) | **Sì** | Da `settings` |
| Footer (indirizzo, tel, email, CF) | **Sì** | Da `settings` |
| Footer (testo descrittivo brand) | No | Hardcoded in `Footer.tsx:44-47` |
| Pagina `/galleria` | No (ancora) | Placeholder statico — `MEZZI_QUERY` già pronta |
