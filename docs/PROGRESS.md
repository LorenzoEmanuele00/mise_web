# PROGRESS — Sito Vetrina Misericordia di Gello

> Stato aggiornato: 19 maggio 2026  
> Segna ogni fase come `[x]` non appena è completata e verificata prima di passare alla successiva.

---

## Legenda stati

| Simbolo | Significato |
|---------|-------------|
| `[ ]`   | Da fare |
| `[~]`   | In corso |
| `[x]`   | Completato e verificato |

---

## Fase 0 — Pianificazione ✓

- [x] Design mockup ricevuto da Claude Design (`mise_web.zip`)
- [x] Stack tecnico definito (vedere `ARCHITECTURE.md`)
- [x] Content model derivato dal design (vedere `SANITY.md`)
- [x] Strategia deploy e caching definita (vedere `VERCEL.md`)
- [x] File di piano scritti (`PROGRESS`, `ARCHITECTURE`, `SANITY`, `VERCEL`)

---

## Fase 1 — Scaffold progetto

- [x] Next.js 16.2.6 + React 19 + TS strict + Tailwind v4 + App Router + src/ + alias @/* alla root del repo
- [x] Dipendenze Sanity: `next-sanity` 12, `@sanity/image-url` 2, `@sanity/types` 5
- [x] `next-intl` 4, `zod` 4
- [x] `noUncheckedIndexedAccess: true` aggiunto a `tsconfig.json`
- [x] `next.config.ts` — `remotePatterns` per `cdn.sanity.io`
- [x] `.env.example` con tutte le variabili
- [x] `package.json` — name aggiornato a `misericordia-gello`
- [x] TypeScript compila senza errori
- [x] Login Sanity (`npx sanity@latest login --provider github`)
- [x] Progetto Sanity creato — ID: `zmh64ht0`, dataset: `production`
- [x] `.env.local` con project ID, dataset, api version
- [x] `src/sanity/env.ts` — variabili d'ambiente centralizzate
- [x] `src/sanity/lib/client.ts` — createClient con `useCdn: true` e stega per preview
- [x] `src/sanity/lib/utils.ts` — `urlFor` (import corretto: `@sanity/image-url`) e `formatDate`
- [x] `src/sanity/schemas/index.ts` — placeholder vuoto pronto per Fase 3
- [x] `src/sanity/sanity.config.ts` — config Studio con structureTool e visionTool
- [x] `src/app/studio/[[...tool]]/page.tsx` — Studio embedded (`NextStudio`)
- [x] TypeScript compila senza errori
- [x] `npm run dev` — homepage 200, `/studio` 200 ✓

---

## Fase 2 — Struttura cartelle e configurazione base

- [x] Creare struttura completa `src/` (vedere `ARCHITECTURE.md §struttura`)
- [x] Configurare `src/sanity/lib/client.ts` — createClient con `useCdn: true`
- [x] Configurare `src/sanity/lib/utils.ts` — helper `urlFor`, `formatDate`
- [x] Creare `src/lib/types.ts` con i tipi TypeScript di tutti i documenti Sanity
- [x] Configurare `src/app/globals.css` con variabili CSS `@theme inline` e classi tipografiche (Tailwind v4)
- [x] Verificare: TypeScript compila senza errori (`npx tsc --noEmit`)

---

## Fase 3 — Schemi Sanity (Studio)

- [ ] `src/sanity/schemas/documents/page.ts` — pagina generica con SEO
- [ ] `src/sanity/schemas/documents/post.ts` — articolo news con tag, data, corpo, cover
- [ ] `src/sanity/schemas/documents/servizio.ts` — servizio con tutti i campi del design
- [ ] `src/sanity/schemas/documents/mezzo.ts` — veicolo del parco mezzi
- [ ] `src/sanity/schemas/documents/settings.ts` — impostazioni globali (nav, footer, contatti, logo)
- [ ] `src/sanity/schemas/documents/servizioCivile.ts` — singleton con tipi SCU/SCR, step, testimonianze, FAQ
- [ ] `src/sanity/schemas/objects/seo.ts` — oggetto SEO riutilizzabile
- [ ] `src/sanity/schemas/objects/heroSection.ts` — sezione hero con heading display e italic accent
- [ ] `src/sanity/schemas/objects/timelineEvent.ts` — evento cronologia (anno, titolo, testo)
- [ ] `src/sanity/schemas/objects/tipoServizio.ts` — tab SCU/SCR con campi bando e array progetti
- [ ] `src/sanity/schemas/objects/scProgetto.ts` — progetto singolo con codice, posti, sede, focus, PDF
- [ ] `src/sanity/schemas/objects/scStep.ts` — step "Come funziona"
- [ ] `src/sanity/schemas/objects/scTestimonianza.ts` — testimonianza con foto, citazione, nome, anno
- [ ] `src/sanity/schemas/objects/scFaq.ts` — coppia domanda/risposta
- [ ] `src/sanity/schemas/index.ts` — esporta tutti gli schemi
- [ ] Configurare Studio embedded in `src/app/studio/[[...tool]]/page.tsx` con `schemaTypes` e plugin Presentation
- [ ] Inserire dati di test nel CMS (almeno 1 pagina, 2 post, tutti i servizi)
- [ ] Verificare: Studio si avvia e tutti i document type sono visibili e funzionanti

---

## Fase 4 — Query GROQ e fetch nel frontend

- [ ] Scrivere tutte le query in `src/sanity/lib/queries.ts` (vedere `SANITY.md §queries`)
- [ ] Aggiungere tag di revalidation a ogni `fetch` Sanity
- [ ] `src/app/page.tsx` — Homepage con fetch dati da Sanity
- [ ] `src/app/storia/page.tsx` — Chi siamo / Storia
- [ ] `src/app/servizi/page.tsx` — Lista servizi (accordion)
- [ ] `src/app/servizi/[slug]/page.tsx` — Dettaglio servizio singolo (opzionale)
- [ ] `src/app/servizio-civile/page.tsx` — Pagina Servizio Civile (fetch `SERVIZIO_CIVILE_QUERY`, tag `servizioCivile`)
- [ ] `src/app/news/page.tsx` — Listing news con filtro tag
- [ ] `src/app/news/[slug]/page.tsx` — Articolo singolo
- [ ] `src/app/galleria/page.tsx` — Galleria fotografica
- [ ] `src/app/volontariato/page.tsx` — Pagina volontariato (no form ancora)
- [ ] `src/app/contatti/page.tsx` — Pagina contatti (no form ancora)
- [ ] Configurare `generateStaticParams` per tutte le rotte dinamiche
- [ ] Verificare: tutte le pagine rendono i dati reali dal CMS

---

## Fase 5 — Componenti UI dal design

- [ ] `src/components/ui/Button.tsx` — varianti `dark`, `ghost`, `outline`
- [ ] `src/components/ui/Kicker.tsx` — label uppercase con regola
- [ ] `src/components/ui/Num.tsx` — numero monospace
- [ ] `src/components/ui/Arrow.tsx` — freccia diagonale SVG
- [ ] `src/components/ui/SanityImage.tsx` — wrapper `next/image` con `urlFor`
- [ ] `src/components/sections/HeroSection.tsx` — hero con heading display + italic accent
- [ ] `src/components/sections/StatsStrip.tsx` — 4 stat (fondazione, volontari, servizi, 24/7)
- [ ] `src/components/sections/TimelineGrid.tsx` — griglia 4col eventi storici
- [ ] `src/components/sections/ServizioAccordion.tsx` — accordion servizi con expand/collapse
- [ ] `src/components/sections/MezziGrid.tsx` — griglia parco mezzi
- [ ] `src/components/sections/NewsGrid.tsx` — featured + griglia articoli
- [ ] `src/components/layout/Header.tsx` — navigazione con logo
- [ ] `src/components/layout/Footer.tsx` — footer con links e testo
- [ ] Verificare: design fedele al mockup su desktop e mobile

---

## Fase 6 — Form contatti e volontariato

- [ ] `src/app/api/contact/route.ts` — endpoint POST form contatti, salva in Sanity
- [ ] `src/app/api/volunteer/route.ts` — endpoint POST form volontariato, salva in Sanity
- [ ] Aggiungere schema `studio/schemas/documents/contactSubmission.ts` (readonly)
- [ ] Aggiungere schema `studio/schemas/documents/volunteerSubmission.ts` (readonly)
- [ ] Implementare validazione Zod sugli endpoint
- [ ] Aggiungere rate limiting in-memory sugli endpoint
- [ ] Aggiungere honeypot anti-bot nei form
- [ ] `src/components/forms/ContactForm.tsx` — form contatti con stati sent/error
- [ ] `src/components/forms/VolunteerForm.tsx` — form volontariato con selezione aree
- [ ] Collegare i form agli endpoint API
- [ ] Verificare: form funzionano, le submission appaiono in Studio

---

## Fase 7 — Webhook revalidation

- [ ] `src/app/api/revalidate/route.ts` — endpoint webhook con verifica secret HMAC
- [ ] Configurare webhook su `sanity.io` puntando all'URL Vercel
- [ ] Testare: pubblicare un documento in Sanity → pagina si aggiorna senza rebuild
- [ ] Verificare: header `SANITY_WEBHOOK_SECRET` è validato correttamente

---

## Fase 8 — SEO e metadati

- [ ] `generateMetadata` su tutte le route con dati da Sanity
- [ ] `src/app/sitemap.ts` — sitemap dinamica con tutti gli slug
- [ ] `src/app/robots.ts` — robots.txt
- [ ] Verificare: Open Graph funziona con i link (testare con og:debugger)

---

## Fase 9 — Deploy e go-live

- [ ] Creare progetto su Vercel collegato al repo GitHub
- [ ] Inserire tutte le env var nel dashboard Vercel (vedere `VERCEL.md §variabili`)
- [ ] Verificare build di produzione (`vercel --prod`) senza errori
- [ ] Configurare dominio `misericordiadigello.it` su Vercel
- [ ] Attivare HTTPS (automatico con Vercel)
- [ ] Smoke test su tutte le pagine in produzione
- [ ] Fare `curl` sul webhook e verificare revalidation in prod

---

## Note e blocchi aperti

- Il design non include ancora: Galleria (solo placeholder), pagina Documenti scaricabili (PDF), pagina Donazioni — da chiedere al committente se serve a breve o è fuori scope v1
- `Servizio Civile` → document type singleton dedicato `servizioCivile` con struttura fissa: i campi editabili sono date/scadenze, posti, compensi, testi dei progetti, PDF scaricabile per ogni progetto, testimonianze, FAQ. Layout non modificabile dal CMS. ✓ Decisione confermata dal committente.
- i18n (IT/EN) — struttura già pianificata con `next-intl` ma non impattante sullo scaffold iniziale; si attiva in Fase 4/5
