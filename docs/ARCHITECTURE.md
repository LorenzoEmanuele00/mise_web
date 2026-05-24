# ARCHITECTURE — Sito Vetrina Misericordia di Gello

> Documento di riferimento architetturale. Non cambiare stack o pattern senza aggiornare questo file.

---

## Stack (versioni reali installate)

| Layer       | Scelta                                   | Versione                                    |
| ----------- | ---------------------------------------- | ------------------------------------------- |
| Framework   | Next.js App Router                       | 16.2.6                                      |
| UI          | React                                    | 19.2.4                                      |
| Linguaggio  | TypeScript                               | 5.x, strict + noUncheckedIndexedAccess      |
| Stile       | Tailwind CSS v4                          | 4.x (config via CSS, no tailwind.config.ts) |
| CMS         | Sanity v3 (Studio embedded su `/studio`) | next-sanity 12.x                            |
| i18n        | next-intl                                | 4.x                                         |
| Validazione | Zod                                      | 4.x                                         |
| Deploy      | Vercel                                   | —                                           |
| Node        | 20.x LTS                                 | —                                           |

**Note versioni importanti:**

- Tailwind v4 usa `@theme inline` in CSS — niente `tailwind.config.ts`
- next-sanity v12 include `@sanity/client` v7 e `groq` v3
- `@sanity/types` v5 (allineato a Sanity Studio v3)

---

## Struttura del progetto

Next.js è alla radice del repo. Lo Studio Sanity è **embedded** come route `/studio` (no cartella separata). Gli schemi vivono in `src/sanity/schemas/`.

```
mise_web/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    ← Root layout (html, body, font)
│   │   ├── page.tsx                      ← Home (/)
│   │   ├── storia/
│   │   │   └── page.tsx                  ← Chi siamo / Storia (/storia)
│   │   ├── servizi/
│   │   │   ├── page.tsx                  ← Lista servizi (/servizi)
│   │   │   └── [slug]/
│   │   │       └── page.tsx              ← Dettaglio servizio
│   │   ├── servizio-civile/
│   │   │   └── page.tsx                  ← (/servizio-civile)
│   │   ├── news/
│   │   │   ├── page.tsx                  ← Listing news (/news)
│   │   │   └── [slug]/
│   │   │       └── page.tsx              ← Articolo singolo
│   │   ├── galleria/
│   │   │   └── page.tsx                  ← (/galleria)
│   │   ├── volontariato/
│   │   │   └── page.tsx                  ← (/volontariato)
│   │   ├── contatti/
│   │   │   └── page.tsx                  ← (/contatti)
│   │   ├── studio/
│   │   │   └── [[...tool]]/
│   │   │       └── page.tsx              ← Sanity Studio embedded (/studio)
│   │   └── api/
│   │       ├── revalidate/
│   │       │   └── route.ts              ← Webhook Sanity → revalidateTag
│   │       ├── contact/
│   │       │   └── route.ts              ← Form contatti → submission Sanity
│   │       └── volunteer/
│   │           └── route.ts              ← Form volontariato → submission Sanity
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx                ← variant: "dark" | "ghost" | "outline"
│   │   │   ├── Kicker.tsx                ← label uppercase con regola decorativa
│   │   │   ├── Num.tsx                   ← numero monospace (stats, codici servizio)
│   │   │   ├── Arrow.tsx                 ← freccia diagonale SVG inline
│   │   │   └── SanityImage.tsx           ← next/image wrappato con urlFor
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx           ← hero display heading + italic accent color
│   │   │   ├── StatsStrip.tsx            ← 4-col strip statistiche
│   │   │   ├── TimelineGrid.tsx          ← griglia 4-col eventi storici
│   │   │   ├── ServizioAccordion.tsx     ← accordion expand/collapse con transizioni
│   │   │   ├── MezziGrid.tsx             ← griglia 3-col parco mezzi
│   │   │   └── NewsGrid.tsx              ← featured article + griglia 3-col
│   │   ├── forms/
│   │   │   ├── ContactForm.tsx           ← form contatti (nome, email, oggetto, messaggio)
│   │   │   └── VolunteerForm.tsx         ← form volontariato (campi + selezione aree)
│   │   └── layout/
│   │       ├── Header.tsx                ← nav principale + logo
│   │       └── Footer.tsx                ← footer con links, contatti, CF
│   │
│   ├── sanity/
│   │   ├── schemas/
│   │   │   ├── index.ts                  ← esporta schemaTypes
│   │   │   ├── documents/
│   │   │   │   ├── page.ts
│   │   │   │   ├── post.ts
│   │   │   │   ├── servizio.ts
│   │   │   │   ├── mezzo.ts
│   │   │   │   ├── settings.ts
│   │   │   │   ├── servizioCivile.ts
│   │   │   │   ├── contactSubmission.ts
│   │   │   │   └── volunteerSubmission.ts
│   │   │   └── objects/
│   │   │       ├── seo.ts
│   │   │       ├── heroSection.ts
│   │   │       ├── timelineEvent.ts
│   │   │       ├── tipoServizio.ts
│   │   │       ├── scProgetto.ts
│   │   │       ├── scStep.ts
│   │   │       ├── scTestimonianza.ts
│   │   │       └── scFaq.ts
│   │   └── lib/
│   │       ├── client.ts                 ← createClient configurato
│   │       ├── queries.ts                ← tutte le query GROQ con tag revalidation
│   │       └── utils.ts                  ← urlFor, formatDate, helpers
│   │
│   ├── lib/
│   │   ├── types.ts                      ← TypeScript types dei document type Sanity
│   │   └── validation/
│   │       ├── contactSchema.ts          ← Zod schema form contatti
│   │       └── volunteerSchema.ts        ← Zod schema form volontariato
│   │
│   └── i18n/                             ← next-intl config (attivare in Fase 4)
│       ├── routing.ts
│       └── locales/
│           ├── it.json
│           └── en.json
│
├── public/
├── docs/                                 ← Documentazione progetto
├── .env.local                            ← variabili reali (non committare)
├── .env.example                          ← template variabili (committare)
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Routing — pagine

| Route                 | File                           | Tipo           | Note                                       |
| --------------------- | ------------------------------ | -------------- | ------------------------------------------ |
| `/`                   | `app/page.tsx`                 | Static         | Hero, stats, anteprima servizi, news       |
| `/storia`             | `app/storia/page.tsx`          | Static         | Timeline, valori, testo editoriale         |
| `/servizi`            | `app/servizi/page.tsx`         | Static         | Accordion 6 servizi                        |
| `/servizi/[slug]`     | `app/servizi/[slug]/page.tsx`  | Dynamic static | generateStaticParams                       |
| `/servizio-civile`    | `app/servizio-civile/page.tsx` | Static         | Schema singleton dedicato                  |
| `/news`               | `app/news/page.tsx`            | Static         | Listing con filtro tag lato client         |
| `/news/[slug]`        | `app/news/[slug]/page.tsx`     | Dynamic static | generateStaticParams                       |
| `/galleria`           | `app/galleria/page.tsx`        | Static         | Griglia immagini                           |
| `/volontariato`       | `app/volontariato/page.tsx`    | Static         | Info + form (client component)             |
| `/contatti`           | `app/contatti/page.tsx`        | Static         | Info + mappa + form (client component)     |
| `/studio/[[...tool]]` | Studio embedded                | Client only    | `'use client'`, escluso da middleware i18n |

---

## Routing — API

| Route             | Metodo | Funzione                                      |
| ----------------- | ------ | --------------------------------------------- |
| `/api/revalidate` | POST   | Riceve webhook Sanity, chiama `revalidateTag` |

> **Form**: gestiti via **Server Actions** (`src/app/actions/submitForms.ts`), non API routes.

---

## i18n

- **Libreria**: `next-intl` 4.x
- **Lingue**: IT (default, senza prefisso), EN (`/en/`)
- **Config**: `localePrefix: 'as-needed'`
- **Sanity**: `@sanity/document-internationalization` plugin — un documento per lingua
- **Priorità v1**: soltanto IT; la struttura EN si predispone ma non si traduce subito
- **Esclusione middleware**: `/studio` va escluso dal matcher di next-intl

---

## Architettura componenti — layer system

I componenti seguono una gerarchia bottom-up. Ogni layer usa solo quello sottostante.

```
Layer 1 — globals.css        token + 6-8 classi strutturali (≤ 230 righe)
Layer 2 — ui/                atomi: Arrow, Btn, Kicker, Num, SanityImage
Layer 3 — layout/            Section, Header, Footer
Layer 4 — sections/          HeroSection, StatsStrip, TimelineSection, ...
Layer 5 — app/*/page.tsx     composizione pura (≤ 70 righe, server component)
```

**Regole:**

- Stili dei componenti: Tailwind utilities inline nel TSX. Niente CSS per componente.
- Eccezioni in globals.css: solo classi che non si esprimono bene con Tailwind (nav offcanvas, dark-band, transizioni drawer).
- Componenti client (`'use client'`): solo le foglie interattive (accordion, filtri, form).
- Ogni page.tsx importa sezioni, non fa markup inline.

---

## Design system — Tailwind v4 + CSS variables

In Tailwind v4 la configurazione è tutta in CSS. In `src/app/globals.css`:

```css
@import "tailwindcss";

@theme inline {
  /* Palette principale */
  --color-ink: #16130e;
  --color-bg: #f2ece0;
  --color-accent: #b85333;

  /* Derivate (calcolate via JS al runtime del design mockup,
     qui fissate con i valori della palette default) */
  --color-bg-elev: #eae4d4; /* bg + 8 */
  --color-bg-deep: #e5dfcf; /* bg - 10 */
  --color-ink-soft: #2e2b27; /* ink + 18 */
  --color-muted: #b8b5b1; /* ink + 90 */
  --color-accent-soft: #d48a6b; /* accent + 36 */
  --color-accent-deep: #7a3218; /* accent - 30 */
  --color-hair: rgba(22, 19, 14, 0.12);
  --color-hair-strong: rgba(22, 19, 14, 0.22);

  /* Font */
  --font-display: "Instrument Serif", "Cormorant Garamond", Georgia, serif;
  --font-sans: "DM Sans", system-ui, sans-serif;
}
```

Con Tailwind v4, i token `--color-*` diventano automaticamente utility classes: `bg-ink`, `text-accent`, `border-hair-strong`, ecc.

**Palette alternative** (4 opzioni dal design):

```
Nero · avorio · terracotta   #16130E · #F2ECE0 · #B85333  (default)
Nero · crema · vinaccia      #1A1814 · #EDE8DE · #7A1F22
Nero · avorio · verde salvia #0E1419 · #F0EEE7 · #2D5C4F
Blu notte · crema · oro      #0F1419 · #EDE7D9 · #C28A2F
```

---

## Classi tipografiche

Da aggiungere in `globals.css` con `@layer base` / `@utility`:

```
.h-display  — serif, clamp(52px, 6vw, 88px), line-height 0.96
.heading-01        — serif, clamp(38px, 4vw, 56px)
.heading-02        — serif, clamp(26px, 2.8vw, 36px)
.heading-03        — serif, clamp(20px, 2vw, 26px)
.serif      — font-family display, dimensione body
.serif-it   — italic del display font
.body-lg    — sans, 18–20px
.body       — sans, 16–17px, line-height 1.7
.body-sm    — sans, 14–15px
.kicker     — sans, uppercase, tracking 0.14em, 12–13px, con ::before regola decorativa
.shell      — max-width 1200px, padding orizzontale 24–48px, margin auto
.btn        — base bottone
.btn-dark   — bottone solido ink
.btn-ghost  — bottone outline
.input      — campo form con border-bottom
.input-label — label campo form
```

---

## Configurazione Next.js

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // Il middleware next-intl va configurato con matcher che esclude /studio e /api
};
```

---

## Dipendenze — package.json (versioni reali)

```json
"dependencies": {
  "next": "16.2.6",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "next-sanity": "^12.4.5",
  "@sanity/image-url": "^2.1.1",
  "next-intl": "^4.12.0",
  "zod": "^4.4.3"
},
"devDependencies": {
  "typescript": "^5",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@sanity/types": "^5.26.0",
  "@tailwindcss/postcss": "^4",
  "tailwindcss": "^4",
  "eslint": "^9",
  "eslint-config-next": "16.2.6"
}
```
