# PROGRESS — Sito Vetrina Misericordia di Gello

> Stato aggiornato: 22 maggio 2026  
> Segna ogni fase come `[x]` non appena è completata e verificata prima di passare alla successiva.

---

## Legenda stati

| Simbolo | Significato             |
| ------- | ----------------------- |
| `[ ]`   | Da fare                 |
| `[~]`   | In corso                |
| `[x]`   | Completato e verificato |

---

## Fase 0 — Pianificazione ✓

- [x] Design mockup ricevuto da Claude Design (v1, v2, v3)
- [x] Stack tecnico definito (vedere `ARCHITECTURE.md`)
- [x] Content model derivato dal design (vedere `SANITY.md`)
- [x] Strategia deploy e caching definita (vedere `VERCEL.md`)

---

## Fase 1 — Scaffold progetto ✓

- [x] Next.js 16.2.6 + React 19 + TS strict + Tailwind v4 + App Router
- [x] Dipendenze Sanity: `next-sanity` 12, `@sanity/image-url` 2, `@sanity/types` 5
- [x] `next-intl` 4, `zod` 4
- [x] `noUncheckedIndexedAccess: true` in `tsconfig.json`
- [x] `next.config.ts` — `remotePatterns` per `cdn.sanity.io`
- [x] Login Sanity — progetto ID: `zmh64ht0`, dataset: `production`
- [x] `src/sanity/env.ts`, `lib/client.ts`, `lib/utils.ts`, `lib/queries.ts`
- [x] Studio embedded su `/studio` funzionante
- [x] TypeScript compila senza errori

---

## Fase 2 — Configurazione base ✓

- [x] `src/lib/types.ts` — tipi TypeScript per tutti i document type Sanity
- [x] `src/app/globals.css` — `@theme inline` + classi tipografiche (Tailwind v4, 165 righe)
- [x] Query GROQ in `src/sanity/lib/queries.ts`

---

## Fase 3 — Schemi Sanity ✓

- [x] Schemi documents: `page`, `post`, `servizio`, `mezzo`, `settings`, `servizioCivile`, `contactSubmission`, `volunteerSubmission`
- [x] Schemi objects: `seo`, `heroSection`, `timelineEvent`, `tipoServizio`, `scProgetto`, `scStep`, `scTestimonianza`, `scFaq`
- [x] Structure builder con singleton (Settings, Servizio Civile)
- [x] Script seed `scripts/seed.mjs` (1 settings, 4 pagine, 6 servizi, 6 mezzi, 3 post, 1 servizioCivile)
- [ ] Dati di test inseriti nel CMS — `node scripts/seed.mjs`

---

## Fase D — Design system v3 + componenti ← FASE CORRENTE

Implementazione bottom-up dal design v3 (`mise_web-3.zip`).  
**Regola:** design system → atomi → layout → sezioni → pagine. Niente markup inline nei page.tsx.

### D1 — `globals.css` (target ≤ 230 righe)

- [x] Aggiungere: `.num`, `.btn-accent`, `.dark-band`, `.rule`
- [x] Aggiungere: stili strutturali per `.nav` e `.nav-drawer` (offcanvas mobile)

### D2 — Atomi `src/components/ui/`

- [x] `Arrow.tsx` — SVG freccia, prop `dir: right|left|up|down`
- [x] `Btn.tsx` — button/link, varianti `dark` `ghost` `accent`
- [x] `Kicker.tsx` — kicker uppercase + regola decorativa, prop `noRule`
- [x] `Num.tsx` — span monospace (JetBrains Mono)
- [x] `SanityImage.tsx` — `next/image` con `urlFor`

### D3 — Layout `src/components/layout/`

- [x] `Header.tsx` — nav desktop + offcanvas drawer destra mobile
- [x] `Footer.tsx` — griglia 4 colonne + barra legale
- [x] `Section.tsx` — wrapper `<section>` con varianti `dark` `tight` `loose`, include `SectionLabel`

### D4 — Sezioni `src/components/sections/`

- [x] `HeroSection.tsx`
- [x] `StatsStrip.tsx`
- [x] `TimelineSection.tsx`
- [x] `ServiziGrid.tsx`
- [x] `MezziGrid.tsx`
- [x] `NewsGrid.tsx`

### D5 — Componenti client (foglie interattive)

- [x] `ServiziAccordion.tsx` (client)
- [x] `NewsFilter.tsx` (client)
- [x] `ContactForm.tsx` (client) — Server Action con Zod + honeypot
- [x] `VolunteerForm.tsx` (client) — Server Action con Zod + honeypot
- [x] `src/app/actions/submitForms.ts` — Server Actions

### D6 — Rebuild pagine (≤ 70 righe cad., solo composizione)

- [x] `app/page.tsx` — Home
- [x] `app/storia/page.tsx` — timeline statica (CMS non ha campo timeline su page)
- [x] `app/servizi/page.tsx`
- [x] `app/servizi/[slug]/page.tsx` — invariato (già pulito)
- [x] `app/servizio-civile/page.tsx` — invariato (struttura fissa già corretta)
- [x] `app/news/page.tsx`
- [x] `app/news/[slug]/page.tsx` — invariato (già pulito)
- [x] `app/galleria/page.tsx` — invariato (placeholder per v1)
- [x] `app/volontariato/page.tsx`
- [x] `app/contatti/page.tsx`

---

## Revisione D — Issues trovati dalla code review

> Review del 21 maggio 2026. Issues raggruppati per priorità.  
> Completare prima di procedere con Fase 7.

---

### R1 — Bug critici (HTML / accessibilità / font)

- [x] **`<main>` annidati** — `(site)/layout.tsx:17` wrappa `{children}` in `<main className="flex-1">`, ma **ogni page.tsx ha già il proprio `<main>`**, producendo `<main><main>` (HTML non valido). Fix: sostituire `<main className="flex-1">` con `<div className="flex-1">` nel layout; i page.tsx mantengono i loro `<main>`.
  - File: `src/app/(site)/layout.tsx:17`
  - Pagine affette: tutte le 9 route (page.tsx, storia, servizi, servizi/[slug], news, news/[slug], contatti, volontariato, servizio-civile)

- [x] **`Instrument_Serif` manca variante italic** — `layout.tsx` carica solo `weight: "400"` senza `style: ['normal', 'italic']`. Il browser sintetizza l'obliquo invece di usare il vero italic. Il design usa l'italic serif ovunque (`serif-it`, heading con `<em>`). Fix: aggiungere `style: ['normal', 'italic']` all'oggetto di config `Instrument_Serif`.
  - File: `src/app/layout.tsx:5-9`

---

### R2 — Design system incompleto

- [x] **7 classi CSS mancanti in `globals.css`** — Il design v3 `Header.jsx` usa queste classi che non esistono in `globals.css`; l'header le rimpiazza con Tailwind inline. Aggiungere le classi per completare il design system:
  - `.emerg-badge` — contenitore pill per badge "118" (border 1px solid currentColor, border-radius: 2em, padding: 0.25rem 0.75rem, display: inline-flex, align-items: center, gap: 0.5rem)
  - `.emerg-dot` — pallino pulsante (w: 0.5rem, h: 0.5rem, rounded-full, background: currentColor, animation: pulse)
  - `.nav-drawer-head` — intestazione del drawer (px-6 py-5, border-bottom, display: flex, justify-between, align-items: center)
  - `.nav-drawer-close` — bottone × (p-1, opacity 0.6, hover 1.0, bg trasparente, border none, cursor pointer, font-size 1.5rem)
  - `.nav-drawer-link` — link nel drawer (display flex, justify-between, align-items center, px-6 py-4, border-bottom, hover bg-white/5, transition)
  - `.nav-drawer-footer` — footer del drawer (px-6 py-6, mt-auto, display flex, flex-col, gap 1rem, border-top)
  - `.nav-burger-icon` — icona hamburger (flex-col, gap, width/height)
  - File: `src/app/globals.css`

- [x] **`.btn:disabled` non definito** — Il Btn riceve `disabled={pending}` nei form ma nessuna regola CSS cambia l'aspetto. Aggiungere alla fine del blocco `.btn` in `globals.css`: `.btn:disabled { opacity: 0.5; cursor: not-allowed; }`
  - File: `src/app/globals.css`

- [x] **Footer `mb-16` → `mb-20`** — Il design v3 `Footer.jsx:7` usa `marginBottom: 80` (80px) tra il grid e la regola. `mb-16` = 64px, `mb-20` = 80px. Differenza: 16px.
  - File: `src/components/layout/Footer.tsx:31`

---

### R3 — Duplicazioni da rimuovere

- [x] **`NAV_ITEMS` duplicato** — Definito identicamente in `Header.tsx:8-16` e `Footer.tsx:6-15`. Estrarre in `src/lib/nav.ts` e importarlo in entrambi. Il link `/volontariato` aggiunto manualmente nel drawer (`Header.tsx:165`) dovrebbe essere incluso nella lista canonica.
  - File: `src/lib/nav.ts` (nuovo), `src/components/layout/Header.tsx:8`, `src/components/layout/Footer.tsx:6`

- [x] **`LogoMark` inline in Header, duplicato in Footer** — `Header.tsx:18-27` definisce `LogoMark` come funzione interna; `Footer.tsx:34-42` riproduce lo stesso cerchio con "M" via stile inline invece della classe `.nav-logo-mark`. Estrarre `LogoMark` in `src/components/ui/LogoMark.tsx` e usarlo in entrambi.
  - File: `src/components/ui/LogoMark.tsx` (nuovo), `Header.tsx:18`, `Footer.tsx:34`

- [x] **Pattern "Kicker accent + h1" triplicato nelle pagine** — `contatti/page.tsx:17-21`, `news/page.tsx:17-21`, `servizi/page.tsx:17-21` hanno identica struttura `<Section loose><Kicker accent>/<h1>`. Estrarre `src/components/layout/PageHeader.tsx` con props `kicker` e `title`, usarlo in tutte e tre.
  - File: `src/components/layout/PageHeader.tsx` (nuovo), tre page.tsx

- [x] **Primitivi form duplicati tra `ContactForm` e `VolunteerForm`** — Honeypot identico, blocco errore identico, blocco successo identico (solo testo diverso), pattern `<div flex-col gap-1><label input-label><input input>` ripetuto 6+ volte. Estrarre:
  - `src/components/forms/FormField.tsx` — `({ id, name, label, type?, required?, rows?, placeholder? })`
  - `src/components/forms/FormSuccess.tsx` — `({ heading, body })`
  - Usarli in `ContactForm` e `VolunteerForm`
  - File: `ContactForm.tsx`, `VolunteerForm.tsx`

- [x] **`Kicker` non accetta `className`** — Il componente usa solo `style` per overridare il colore, forzando `style={{ color: 'var(--color-accent)' }}` ripetuto in molti punti. Aggiungere prop `className?: string` al Kicker e sostituire tutti gli `style` color con Tailwind class (`text-accent`, `text-bg/50`).
  - File: `src/components/ui/Kicker.tsx:3`, poi tutti i consumer

---

### R4 — Stile inline dove esistono classi Tailwind

- [x] **Sostituire `style={{ color/bg: 'var(--color-...)' }}` con classi Tailwind** — Trovate ≥15 occorrenze di inline style per valori già registrati come token Tailwind v4. Elenco completo:
  - `HeroSection.tsx:18,24,29` → `text-accent`, `text-ink-soft`
  - `ServiziGrid.tsx:22,25,28,30` → `bg-hair`, `bg-bg`, `text-ink-soft`, `text-accent`
  - `NewsGrid.tsx:30,42,47,50` → `bg-bg-deep`, `text-accent`, `text-ink-soft`, `text-muted`
  - `ServiziAccordion.tsx:16,20,27,32-38` → `border-t border-hair`, `border-b border-hair`, `text-ink`, `text-ink-soft`, `text-muted`
  - `NewsFilter.tsx:51-58` → `border border-hair`, colori vari
  - `contatti/page.tsx:19`, `news/page.tsx:19`, `servizi/page.tsx:19` → verranno risolti con `PageHeader` (R3)

---

### R5 — Pagine che violano le regole D6

- [x] **`servizio-civile/page.tsx` — 117 righe, nessun componente del design system** — Usa `<section className="shell py-...">` raw invece di `<Section>`, raw `<p className="kicker ...">` invece di `<Kicker>`, `<span className="body-sm ... font-mono">` invece di `<Num>`. Non rispetta la regola "solo composizione ≤ 70 righe". Refactoring completo: usare `<Section>`, `<Kicker>`, `<Num>`, `<SectionLabel>`, `<Btn>` già esistenti; estrarre sottosezioni complesse (ProgettiList, ScSteps, FaqList) in componenti dedicati in `src/components/sections/`.
  - File: `src/app/(site)/servizio-civile/page.tsx`

- [x] **`servizi/[slug]/page.tsx` — usa raw `<p className="kicker">` e `<span className="... font-mono">`** — Non usa `<Kicker>` né `<Num>` né `<Section>`. Fix: sostituire con componenti esistenti.
  - File: `src/app/(site)/servizi/[slug]/page.tsx:27-36`

- [x] **`news/[slug]/page.tsx` — corpo articolo non renderizzato** — Il campo `body` (Portable Text) viene fetchato dalla query ma non renderizzato: la pagina mostra solo l'excerpt. Fix: installare `@portabletext/react`, aggiungere `<PortableText value={post.body} />` dopo l'excerpt.
  - File: `src/app/(site)/news/[slug]/page.tsx:36`
  - Dipendenza: `npm install @portabletext/react`

---

### R6 — Feature mancante: MezziGrid orfana ✅

- [x] **`MezziGrid` integrato nella pagina `/servizi`** — `MezziGrid` aggiunto come sezione separata dopo `ServiziAccordion` in `servizi/page.tsx`. Le fetch vengono fatte in parallelo (`Promise.all`). Tag cache `mezzo` aggiunto.

---

### R7 — Minori / robustezza ✅

- [x] **`SanityImage` ottimizzazione immagini** — `urlFor(source).auto('format').fit('max').url()` in `SanityImage.tsx:26`.

- [x] **Footer address split robusto** — `address.split(/\s*[—–-]\s*/)` in `Footer.tsx:55`.

- [x] **Rimossi commenti "what"** — `{/* vertical line */}` e `{/* dot on the line */}` rimossi da `TimelineSection.tsx`. Gli altri (ContactForm, VolunteerForm, servizio-civile/page.tsx) erano già assenti.

---

## Fase R — Responsive (mobile & tablet)

> Analisi del 22 maggio 2026. Obiettivo: rendere fruibile il sito su mobile (≥360px) e tablet (≥768px).
> Breakpoint di riferimento: `sm` = 640px · `md` = 768px · `lg` = 1024px.
> Componenti già OK: `ServiziGrid`, `NewsGrid`, `MezziGrid`, `StatsStrip`, `Footer`, `Header` (offcanvas drawer già funzionante).

---

### R-A — Bug critici: layout che si spezza su mobile

I componenti della pagina Servizio Civile usano `gridTemplateColumns` inline con colonne fisse e nessun breakpoint.

- [x] **`ScTabController.tsx` — Stats grid 5 colonne fisse** — Linea ~93: `gridTemplateColumns: \`repeat(${stats.length}, 1fr)\``produce 5 col su qualsiasi schermo. Fix:`className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5"`(rimuovere lo`style` di grid).
  - File: `src/components/sections/ScTabController.tsx`

- [x] **`ScTabController.tsx` — Projects grid 4 colonne fisse** — Linea ~180: `gridTemplateColumns: '120px 1fr 1fr 200px'`. Su mobile la card dei progetti trabocca. Fix: stacked su mobile (`grid-cols-1`), grid a 4 col da `md` in su (`md:grid-cols-[120px_1fr_1fr_200px]`). Il num + codice diventano una riga inline sopra il titolo su mobile.
  - File: `src/components/sections/ScTabController.tsx`

- [x] **`ScTabController.tsx` — Deadline dark band** — Linea ~122: `gridTemplateColumns: '1fr auto'`. Su schermi < 400px il bottone "Candidati" può clipparsi. Fix: `flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between`.
  - File: `src/components/sections/ScTabController.tsx`

- [x] **`ScTabController.tsx` — Tab switcher overflow** — I pill tab (`inline-flex`) overflow su mobile se i label sono lunghi. Fix: `flex-wrap` o `overflow-x: auto; max-width: 100%` sul contenitore.
  - File: `src/components/sections/ScTabController.tsx`

- [x] **`ScStepsSection.tsx` — Steps grid N colonne fisse** — Linea ~19: `gridTemplateColumns: \`repeat(${Math.min(steps.length, 5)}, 1fr)\``. Fix: `className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"`.
  - File: `src/components/sections/ScStepsSection.tsx`

- [x] **`ScTestimonianzeSection.tsx` — Testimonianze grid 3 colonne fisse** — Linea ~22: `gridTemplateColumns: \`repeat(..., 3), 1fr)\``. Fix: `className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"`.
  - File: `src/components/sections/ScTestimonianzeSection.tsx`

- [x] **`ScFaqSection.tsx` — FAQ layout 2 colonne fisse** — Linea ~17: `gridTemplateColumns: '1fr 2fr'`. Fix: stacked su mobile, `md:grid-cols-[1fr_2fr]` da tablet in su.
  - File: `src/components/sections/ScFaqSection.tsx`

- [x] **`ScApplySection.tsx` — Apply form 2 colonne fisse** — Linea ~49: `gridTemplateColumns: '1fr 1.2fr'`. Fix: stacked su mobile, `md:grid-cols-[1fr_1.2fr]` da tablet in su.
  - File: `src/components/sections/ScApplySection.tsx`

---

### R-B — Padding fissi in pixel (SC components)

I componenti SC usano `paddingTop/Bottom` con valori fissi (es. `96px`, `120px`) invece di `clamp()` come il resto del design system. Su mobile producono spaziature eccessive.

- [x] **Convertire tutti i padding fissi SC in `clamp()`** — Usare la stessa convenzione di `Section.tsx`:
  - `ScTabController.tsx:32` `paddingTop: 56` → `pt-[clamp(3rem,5vw,4rem)]`
  - `ScTabController.tsx:90` `paddingTop: 64, paddingBottom: 80` → `py-[clamp(3rem,6vw,5rem)]`
  - `ScStepsSection.tsx:7` `paddingTop/Bottom: 96` → `py-[clamp(4rem,8vw,6rem)]`
  - `ScTestimonianzeSection.tsx:14` `paddingTop/Bottom: 120` → `py-[clamp(5rem,10vw,7.5rem)]`
  - `ScApplySection.tsx:26,44` `paddingTop/Bottom: 120` → `py-[clamp(5rem,10vw,7.5rem)]`

---

### R-C — Accordion e tabella servizi

- [x] **`ServiziAccordion.tsx` — contenuto espanso `pl-14`** — Su mobile 56px di padding sinistro è proporzionalmente molto. Fix: `pl-8 md:pl-14`.
  - File: `src/components/sections/ServiziAccordion.tsx:32`

---

## Fase I — Migrazione Immagini → Cloudflare R2

> Obiettivo: eliminare `next/image` + CDN Sanity per le immagini principali. Ogni immagine viene pre-caricata su Cloudflare R2 e referenziata come stringa URL in Sanity. Il browser le scarica direttamente da R2 — zero Vercel bandwidth.  
> Guida infrastruttura: `docs/CLOUDFLARE-R2.md`

### I-A — Codice (Claude)

- [ ] Aggiornare schemi Sanity (`src/sanity/schemas/`): `mezzo.photo`, `post.cover`, `settings.logo`, `seo.ogImage`, `scTestimonianza.foto` → `type: 'url'` (stringa)
- [ ] Aggiornare `src/lib/types.ts`: i campi immagine migrati diventano `string | null`
- [ ] Sostituire `src/components/ui/SanityImage.tsx` con `R2Image.tsx`: `<img src={src} alt={alt} loading="lazy" />` (nessun `next/image`, nessun `urlFor`)
- [ ] Aggiornare tutti i componenti che usano `SanityImage`: `MezziGrid`, `NewsGrid`, `ScTestimonianzeSection`, `Header` (logo), `Footer` (logo)
- [ ] Aggiornare `next.config.ts`: rimuovere `remotePatterns` (`cdn.sanity.io` non più necessario)
- [ ] Aggiornare la query `POST_QUERY` in `src/sanity/lib/queries.ts`: proiettare `body[] { ..., _type == "image" => { "url": asset->url } }` per le immagini inline del body
- [ ] Aggiornare `news/[slug]/page.tsx`: custom PortableText component `image` che usa `<img src={value.url}>` plain
- [ ] Rimuovere `@sanity/image-url` da `package.json` e da `src/sanity/lib/utils.ts`
- [ ] Aggiornare `ARCHITECTURE.md` se necessario dopo le modifiche

### I-B — Utente (manuale, prima del deploy)

- [ ] Creare bucket R2 e configurarlo pubblico (vedere `docs/CLOUDFLARE-R2.md`)
- [ ] Ottimizzare le immagini in WebP e caricarle su R2
- [ ] Aggiungere `NEXT_PUBLIC_R2_BASE_URL` in `.env.local` e in Vercel → Environment Variables
- [ ] Aggiornare `scripts/seed.mjs`: sostituire i placeholder immagini con gli URL R2 reali dei 6 mezzi
- [ ] In Sanity Studio: aggiornare logo, foto mezzi, foto testimonianze, cover news, ogImage con gli URL R2

---

## Fase 7 — Webhook revalidation

- [x] `src/app/api/revalidate/route.ts` — endpoint webhook con verifica secret HMAC
- [ ] Configurare webhook su `sanity.io` puntando all'URL Vercel
- [ ] Testare: pubblicare un documento → pagina si aggiorna senza rebuild

---

## Fase 8 — SEO e metadati

- [x] `generateMetadata` su tutte le route con dati da Sanity
- [x] `src/app/sitemap.ts` — sitemap dinamica con tutti gli slug
- [x] `src/app/robots.ts` — robots.txt

---

## Fase 9 — Deploy e go-live

- [ ] Creare progetto su Vercel collegato al repo GitHub
- [ ] Inserire tutte le env var nel dashboard Vercel (vedere `VERCEL.md §variabili`)
- [ ] Configurare dominio `misericordiadigello.it` su Vercel
- [ ] Smoke test su tutte le pagine in produzione

---

## Note

- **Design v3** (`mise_web-3.zip`): aggiornati atomi condivisi (shared.jsx → Arrow, LogoMark, Kicker, Num, Btn, Section, SectionLabel) e Header con offcanvas destra. `styles.css` non incluso nel zip — si usa `globals.css` + estensioni minimali.
- **Form**: Server Actions (`useActionState`) non API routes. Write token, validazione Zod, honeypot anti-bot.
- **i18n**: struttura predisposta con next-intl, non attivata in v1 (solo IT).
- **Galleria**: solo placeholder per v1 — decidere con committente se priorità.
- **Servizio Civile**: singleton con struttura fissa — layout non modificabile dal CMS.
