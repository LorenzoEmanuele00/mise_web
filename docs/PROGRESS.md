# PROGRESS — Sito Vetrina Misericordia di Gello

> Stato aggiornato: 20 maggio 2026  
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

## Fase D — Design system v3 + componenti  ← FASE CORRENTE

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
- [ ] `HeroSection.tsx`
- [ ] `StatsStrip.tsx`
- [ ] `TimelineSection.tsx`
- [ ] `ServiziGrid.tsx`
- [ ] `MezziGrid.tsx`
- [ ] `NewsGrid.tsx`

### D5 — Componenti client (foglie interattive)
- [ ] `ServiziAccordion.tsx` (client)
- [ ] `NewsFilter.tsx` (client)
- [ ] `ContactForm.tsx` (client) — Server Action con Zod + honeypot
- [ ] `VolunteerForm.tsx` (client) — Server Action con Zod + honeypot
- [ ] `src/app/actions/submitForms.ts` — Server Actions

### D6 — Rebuild pagine (≤ 70 righe cad., solo composizione)
- [ ] `app/page.tsx` — Home
- [ ] `app/storia/page.tsx`
- [ ] `app/servizi/page.tsx`
- [ ] `app/servizi/[slug]/page.tsx`
- [ ] `app/servizio-civile/page.tsx`
- [ ] `app/news/page.tsx`
- [ ] `app/news/[slug]/page.tsx`
- [ ] `app/galleria/page.tsx`
- [ ] `app/volontariato/page.tsx`
- [ ] `app/contatti/page.tsx`

---

## Fase 7 — Webhook revalidation

- [ ] `src/app/api/revalidate/route.ts` — endpoint webhook con verifica secret HMAC
- [ ] Configurare webhook su `sanity.io` puntando all'URL Vercel
- [ ] Testare: pubblicare un documento → pagina si aggiorna senza rebuild

---

## Fase 8 — SEO e metadati

- [ ] `generateMetadata` su tutte le route con dati da Sanity
- [ ] `src/app/sitemap.ts` — sitemap dinamica con tutti gli slug
- [ ] `src/app/robots.ts` — robots.txt

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
