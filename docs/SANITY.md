# SANITY — Content Model & CMS Configuration

> Schemi, query GROQ, strategia di caching e configurazione webhook.  
> Tutto derivato dal design mockup `mise_web.zip`.

---

## Document types

### `page` — Pagina generica

Per le pagine statiche editoriali: Home, Storia, Galleria, Volontariato, Contatti.  
**Servizio Civile è escluso** — ha un proprio document type dedicato (vedere `servizioCivile` sotto).

```ts
// src/sanity/schemas/documents/page.ts
{
  name: 'page',
  title: 'Pagina',
  type: 'document',
  fields: [
    { name: 'title',       type: 'string',  validation: required },
    { name: 'slug',        type: 'slug',    options: { source: 'title' }, validation: required },
    { name: 'language',    type: 'string',  readOnly: true },  // 'it' | 'en' — gestito dal plugin i18n
    { name: 'seo',         type: 'seo' },
    { name: 'heroSection', type: 'heroSection' },
  ]
}
```

**Pagine previste** (slug fissi, non dinamici eccetto `/news/[slug]` e `/servizi/[slug]`):

| Slug | Titolo |
|------|--------|
| `home` | Home |
| `storia` | Chi siamo |
| `galleria` | Galleria |
| `volontariato` | Volontariato |
| `contatti` | Contatti |

---

### `servizioCivile` — Servizio Civile (singleton)

Document type **dedicato e singleton** (no create/delete — esiste un solo documento).  
Struttura fissa derivata dal design; cambiano solo i dati: date, posti, compensi, progetti, documenti PDF scaricabili.

Il design ha due tab con la stessa struttura (SCU — Universale, SCR — Regionale). Modellati come array di `tipoServizio`.

```ts
// src/sanity/schemas/documents/servizioCivile.ts
{
  name: 'servizioCivile',
  title: 'Servizio Civile',
  type: 'document',
  __experimental_actions: ['update', 'publish'],  // singleton — no create, no delete
  fields: [

    // ── Sezione hero ─────────────────────────────────────────────
    { name: 'introText', title: 'Testo introduttivo hero', type: 'text', rows: 3,
      description: 'Il paragrafo sotto il titolo principale della pagina.' },

    // ── Tipi di servizio (SCU + SCR) ─────────────────────────────
    {
      name: 'tipi',
      title: 'Tipi di Servizio Civile',
      type: 'array',
      of: [{ type: 'tipoServizio' }],
      validation: (r) => r.min(1).max(3),
    },

    // ── Come funziona — 5 step ────────────────────────────────────
    {
      name: 'steps',
      title: 'Come funziona (5 step)',
      type: 'array',
      of: [{ type: 'scStep' }],
      validation: (r) => r.min(5).max(5),
    },

    // ── Testimonianze ─────────────────────────────────────────────
    {
      name: 'testimonianze',
      title: 'Testimonianze',
      type: 'array',
      of: [{ type: 'scTestimonianza' }],
    },

    // ── FAQ ───────────────────────────────────────────────────────
    {
      name: 'faq',
      title: 'Domande frequenti',
      type: 'array',
      of: [{ type: 'scFaq' }],
    },

    // ── SEO ───────────────────────────────────────────────────────
    { name: 'seo', type: 'seo' },
  ],
}
```

**Object type `tipoServizio`** (SCU o SCR — uno per tab):

```ts
// src/sanity/schemas/objects/tipoServizio.ts
{
  name: 'tipoServizio',
  title: 'Tipo Servizio Civile',
  type: 'object',
  fields: [
    { name: 'code',       title: 'Codice tab (es. SCU)',            type: 'string', validation: required },
    { name: 'label',      title: 'Nome esteso (es. Universale)',     type: 'string', validation: required },
    { name: 'ente',       title: 'Ente promotore',                  type: 'string' },
    // ── Scheda riepilogativa (la strip a 5 colonne) ───────────────
    { name: 'durata',     title: 'Durata (es. 12 mesi)',            type: 'string' },
    { name: 'eta',        title: 'Età (es. 18 – 28 anni)',          type: 'string' },
    { name: 'impegno',    title: 'Impegno settimanale',             type: 'string' },
    { name: 'compenso',   title: 'Compenso mensile (es. € 507,30)', type: 'string' },
    { name: 'postiTotali',title: 'Posti totali',                    type: 'number' },
    // ── Scadenza bando ────────────────────────────────────────────
    { name: 'scadenza',   title: 'Data scadenza bando',             type: 'date', validation: required },
    { name: 'scadenzaOra',title: 'Ora scadenza (es. 14:00)',        type: 'string' },
    { name: 'portaleCandidatura', title: 'URL portale DOL (candidatura ufficiale)', type: 'url' },
    // ── Progetti ──────────────────────────────────────────────────
    {
      name: 'progetti',
      title: 'Progetti',
      type: 'array',
      of: [{ type: 'scProgetto' }],
    },
  ],
  preview: {
    select: { title: 'label', subtitle: 'scadenza' },
  },
}
```

**Object type `scProgetto`** (singolo progetto dentro un tipo):

```ts
// src/sanity/schemas/objects/scProgetto.ts
{
  name: 'scProgetto',
  title: 'Progetto Servizio Civile',
  type: 'object',
  fields: [
    { name: 'codice',        title: 'Codice progetto (es. SCU-MGE-26-A)', type: 'string', validation: required },
    { name: 'titolo',        title: 'Titolo progetto',                    type: 'string', validation: required },
    { name: 'posti',         title: 'Numero posti',                       type: 'number', validation: required },
    { name: 'sede',          title: 'Sede di svolgimento',                type: 'string' },
    { name: 'focus',         title: 'Descrizione attività',               type: 'text', rows: 3 },
    { name: 'schedaPdf',     title: 'Scheda progetto (PDF scaricabile)',   type: 'file',
      options: { accept: '.pdf' },
      description: 'Il documento PDF che i candidati possono scaricare per leggere i dettagli del progetto.' },
  ],
  preview: {
    select: { title: 'titolo', subtitle: 'codice' },
  },
}
```

**Object type `scStep`** (uno dei 5 step "Come funziona"):

```ts
// src/sanity/schemas/objects/scStep.ts
{
  name: 'scStep',
  title: 'Step Come Funziona',
  type: 'object',
  fields: [
    { name: 'numero',      type: 'string', readOnly: true },  // '01' … '05' — non cambia
    { name: 'titolo',      type: 'string', validation: required },
    { name: 'descrizione', type: 'text',   rows: 2 },
  ],
}
```

**Object type `scTestimonianza`**:

```ts
// src/sanity/schemas/objects/scTestimonianza.ts
{
  name: 'scTestimonianza',
  title: 'Testimonianza',
  type: 'object',
  fields: [
    { name: 'nome',  title: 'Nome e età (es. Sofia, 22)', type: 'string', validation: required },
    { name: 'anno',  title: 'Anno servizio (es. SCU 2024)', type: 'string' },
    { name: 'foto',  title: 'Foto (URL Cloudflare R2)', type: 'url' },
    { name: 'testo', title: 'Citazione (senza virgolette)', type: 'text', rows: 4, validation: required },
  ],
  preview: {
    select: { title: 'nome', subtitle: 'anno' },
  },
}
```

**Object type `scFaq`**:

```ts
// src/sanity/schemas/objects/scFaq.ts
{
  name: 'scFaq',
  title: 'FAQ',
  type: 'object',
  fields: [
    { name: 'domanda',  type: 'string', validation: required },
    { name: 'risposta', type: 'text',   rows: 3, validation: required },
  ],
  preview: {
    select: { title: 'domanda' },
  },
}
```

---

### `post` — Articolo News

```ts
// src/sanity/schemas/documents/post.ts
{
  name: 'post',
  title: 'Articolo News',
  type: 'document',
  fields: [
    { name: 'title',     type: 'string',   validation: required },
    { name: 'slug',      type: 'slug',     options: { source: 'title' }, validation: required },
    { name: 'language',  type: 'string',   readOnly: true },
    { name: 'tag',       type: 'string',   options: { list: ['Comunicato', 'Bando', 'Formazione', 'Eventi'] } },
    { name: 'date',      type: 'date',     validation: required },
    { name: 'excerpt',   type: 'text',     rows: 3, validation: required },
    { name: 'cover',     title: 'Copertina (URL Cloudflare R2)', type: 'url' },
    { name: 'body',      type: 'array',    of: [{ type: 'block' }, { type: 'image' }] }, // immagini inline nel body restano asset Sanity, proiettate via asset->url in GROQ
    { name: 'seo',       type: 'seo' },
  ],
  orderings: [{ name: 'dateDesc', title: 'Data (recente)', by: [{ field: 'date', direction: 'desc' }] }],
}
```

---

### `servizio` — Servizio

I 6 servizi del design, gestibili autonomamente dal CMS.

```ts
// src/sanity/schemas/documents/servizio.ts
{
  name: 'servizio',
  title: 'Servizio',
  type: 'document',
  fields: [
    { name: 'num',       type: 'string',  title: 'Codice (es. S/01)',  validation: required },
    { name: 'title',     type: 'string',  validation: required },
    { name: 'slug',      type: 'slug',    options: { source: 'title' } },
    { name: 'language',  type: 'string',  readOnly: true },
    { name: 'shortDesc', type: 'text',    title: 'Descrizione breve (accordion chiuso)', rows: 2, validation: required },
    { name: 'longDesc',  type: 'text',    title: 'Descrizione completa (accordion aperto)', rows: 5 },
    { name: 'mezzi',     type: 'string',  title: 'Mezzi impiegati' },
    { name: 'orario',    type: 'string',  title: 'Orario / disponibilità' },
    { name: 'contatto',  type: 'string',  title: 'Numero / email / riferimento' },
    { name: 'order',     type: 'number',  title: 'Ordine visualizzazione' },
  ],
}
```

**Dati di seed** (dai mockup):

| Codice | Titolo |
|--------|--------|
| S/01 | Trasporto in emergenza (118, 24/7) |
| S/02 | Trasporto sanitario ordinario (dialisi, dimissioni, visite) |
| S/03 | Assistenza alla persona (anziani, domicilio) |
| S/04 | Protezione civile · AIB |
| S/05 | Centro di formazione (BLSD, disostruzione, antincendio) |
| S/06 | Donazione del sangue (Fratres, primo sabato del mese) |

---

### `mezzo` — Veicolo del parco mezzi

```ts
// src/sanity/schemas/documents/mezzo.ts
{
  name: 'mezzo',
  title: 'Mezzo',
  type: 'document',
  fields: [
    { name: 'code',   type: 'string',  title: 'Codice (es. A1)' },
    { name: 'name',   type: 'string',  title: 'Modello (es. Fiat Ducato)' },
    { name: 'year',   type: 'string',  title: 'Anno immatricolazione' },
    { name: 'role',   type: 'string',  title: 'Ruolo / utilizzo' },
    { name: 'photo',  title: 'Foto (URL Cloudflare R2)', type: 'url' },
    { name: 'order',  type: 'number' },
  ],
}
```

**Dati di seed**:

| Codice | Modello | Anno | Ruolo |
|--------|---------|------|-------|
| A1 | Fiat Ducato | 2019 | Emergenza 118 |
| A2 | Mercedes Sprinter | 2021 | Emergenza 118 |
| A4 | Ford Transit | 2026 | Emergenza · nuovo |
| T1 | Volkswagen Caddy | 2020 | Trasporto disabili |
| AIB | Ford Ranger | 2018 | Antincendio boschivo |
| S1 | Fiat Panda | 2022 | Servizi sociali |

---

### `settings` — Impostazioni globali (singleton)

```ts
// src/sanity/schemas/documents/settings.ts
{
  name: 'settings',
  title: 'Impostazioni Sito',
  type: 'document',
  __experimental_actions: ['update', 'publish'],  // no create/delete — singleton
  fields: [
    { name: 'siteName',       type: 'string' },
    { name: 'logo',           title: 'Logo (URL Cloudflare R2)', type: 'url' },
    {
      name: 'navigation',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string' },
          { name: 'href',  type: 'string' },
        ]
      }]
    },
    { name: 'footerText',    type: 'text', rows: 2 },
    { name: 'address',       type: 'string',  title: 'Indirizzo sede' },
    { name: 'phone',         type: 'string',  title: 'Telefono centralino' },
    { name: 'email',         type: 'string',  title: 'Email info' },
    { name: 'emailSC',       type: 'string',  title: 'Email Servizio Civile' },
    { name: 'iban',          type: 'string',  title: 'IBAN donazioni' },
    { name: 'codiceFiscale', type: 'string',  title: 'Codice Fiscale (5×1000)' },
    { name: 'orariSede',     type: 'text',    rows: 3, title: 'Orari sede' },
  ],
}
```

---

### `contactSubmission` — Submission form contatti (readonly)

```ts
// src/sanity/schemas/documents/contactSubmission.ts
{
  name: 'contactSubmission',
  title: 'Messaggio Contatti',
  type: 'document',
  __experimental_actions: ['update', 'publish'],  // readonly — solo lettura in Studio
  fields: [
    { name: 'nome',      type: 'string' },
    { name: 'email',     type: 'string' },
    { name: 'oggetto',   type: 'string' },
    { name: 'messaggio', type: 'text' },
    { name: 'createdAt', type: 'datetime', readOnly: true },
    { name: 'ip',        type: 'string',   hidden: true },
  ],
}
```

---

### `volunteerSubmission` — Submission form volontariato (readonly)

```ts
// src/sanity/schemas/documents/volunteerSubmission.ts
{
  name: 'volunteerSubmission',
  title: 'Candidatura Volontario',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    { name: 'nome',          type: 'string' },
    { name: 'cognome',       type: 'string' },
    { name: 'email',         type: 'string' },
    { name: 'telefono',      type: 'string' },
    { name: 'areeInteresse', type: 'array', of: [{ type: 'string' }] },
    { name: 'disponibilita', type: 'text',  rows: 3 },
    { name: 'createdAt',     type: 'datetime', readOnly: true },
    { name: 'ip',            type: 'string',   hidden: true },
  ],
}
```

---

## Object types

### `seo`

```ts
// src/sanity/schemas/objects/seo.ts
{
  name: 'seo', type: 'object',
  fields: [
    { name: 'metaTitle',       type: 'string',  validation: max(60) },
    { name: 'metaDescription', type: 'text',    rows: 3, validation: max(160) },
    { name: 'ogImage',         title: 'Open Graph Image (URL Cloudflare R2)', type: 'url' },
  ]
}
```

### `heroSection`

```ts
// src/sanity/schemas/objects/heroSection.ts
{
  name: 'heroSection', type: 'object',
  fields: [
    { name: 'kicker',      type: 'string', title: 'Kicker (label sopra il titolo)' },
    { name: 'headingPre',  type: 'string', title: 'Testo prima della parola in evidenza' },
    { name: 'headingEm',   type: 'string', title: 'Parola in evidenza (italic accent)' },
    { name: 'headingPost', type: 'string', title: 'Testo dopo la parola in evidenza' },
    { name: 'body',        type: 'text',   rows: 3, title: 'Paragrafo introduttivo' },
    { name: 'ctaPrimary',  type: 'object', fields: [
      { name: 'label', type: 'string' },
      { name: 'href',  type: 'string' },
    ]},
    { name: 'ctaSecondary', type: 'object', fields: [
      { name: 'label', type: 'string' },
      { name: 'href',  type: 'string' },
    ]},
  ]
}
```

### `timelineEvent`

```ts
// src/sanity/schemas/objects/timelineEvent.ts
{
  name: 'timelineEvent', type: 'object',
  fields: [
    { name: 'year',  type: 'string', validation: required },
    { name: 'title', type: 'string', validation: required },
    { name: 'text',  type: 'text',   rows: 2 },
  ]
}
```

---

## Esportazione schemi

```ts
// src/sanity/schemas/index.ts
import page                from './documents/page'
import post                from './documents/post'
import servizio            from './documents/servizio'
import mezzo               from './documents/mezzo'
import settings            from './documents/settings'
import servizioCivile      from './documents/servizioCivile'
import contactSubmission   from './documents/contactSubmission'
import volunteerSubmission from './documents/volunteerSubmission'
import seo                 from './objects/seo'
import heroSection         from './objects/heroSection'
import timelineEvent       from './objects/timelineEvent'
import tipoServizio        from './objects/tipoServizio'
import scProgetto          from './objects/scProgetto'
import scStep              from './objects/scStep'
import scTestimonianza     from './objects/scTestimonianza'
import scFaq               from './objects/scFaq'

export const schemaTypes = [
  // Documents
  page, post, servizio, mezzo, settings, servizioCivile,
  contactSubmission, volunteerSubmission,
  // Objects
  seo, heroSection, timelineEvent,
  tipoServizio, scProgetto, scStep, scTestimonianza, scFaq,
]
```

---

## Query GROQ — `src/sanity/lib/queries.ts`

### Pattern di fetch con tag revalidation

```ts
// Ogni fetch va fatto così — il tag viene usato per revalidateTag nel webhook
const data = await client.fetch(
  QUERY,
  params,
  { next: { tags: ['nome-tag'] } }
)
```

### Tutte le query

```ts
// Impostazioni globali (header, footer, contatti)
export const SETTINGS_QUERY = groq`
  *[_type == "settings"][0] {
    siteName, logo, navigation, footerText,
    address, phone, email, emailSC, iban, codiceFiscale, orariSede
  }
`
// tag: ['settings']

// Pagina per slug (home, storia, servizio-civile, ecc.)
export const PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug && language == $lang][0] {
    title, slug, language, seo, heroSection
  }
`
// tag: ['page']

// Listing news (tutti gli slug per generateStaticParams)
export const ALL_POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] { "slug": slug.current }
`

// Listing news con filtro opzionale per tag
export const POSTS_QUERY = groq`
  *[_type == "post" && language == $lang] | order(date desc) {
    _id, title, slug, tag, date, excerpt, cover
  }
`
// tag: ['post']

// Articolo singolo
export const POST_QUERY = groq`
  *[_type == "post" && slug.current == $slug && language == $lang][0] {
    title, slug, tag, date, excerpt, cover, seo,
    body[] {
      ...,
      _type == "image" => { "url": asset->url }
    }
  }
`
// tag: ['post']
// Nota: cover è un URL R2 (stringa). Le immagini inline nel body restano asset Sanity
// e vengono proiettate con asset->url per servire direttamente via cdn.sanity.io.

// Tutti i servizi ordinati
export const SERVIZI_QUERY = groq`
  *[_type == "servizio" && language == $lang] | order(order asc) {
    _id, num, title, slug, shortDesc, longDesc, mezzi, orario, contatto
  }
`
// tag: ['servizio']

// Tutti i slugs servizi per generateStaticParams
export const ALL_SERVIZI_SLUGS_QUERY = groq`
  *[_type == "servizio" && defined(slug.current)] { "slug": slug.current }
`

// Parco mezzi
export const MEZZI_QUERY = groq`
  *[_type == "mezzo"] | order(order asc) {
    _id, code, name, year, role, photo
  }
`
// tag: ['mezzo']

// Servizio Civile (singleton — nessun parametro)
export const SERVIZIO_CIVILE_QUERY = groq`
  *[_type == "servizioCivile"][0] {
    introText,
    tipi[] {
      code, label, ente,
      durata, eta, impegno, compenso, postiTotali,
      scadenza, scadenzaOra, portaleCandidatura,
      progetti[] {
        codice, titolo, posti, sede, focus,
        "schedaPdfUrl": schedaPdf.asset->url
      }
    },
    steps[] { numero, titolo, descrizione },
    testimonianze[] { nome, anno, foto, testo },
    faq[] { domanda, risposta },
    seo
  }
`
// tag: ['servizioCivile']

// Homepage — composizione dati aggregati
export const HOME_QUERY = groq`
  {
    "page":    *[_type == "page" && slug.current == "home" && language == $lang][0] { title, heroSection, seo },
    "servizi": *[_type == "servizio" && language == $lang] | order(order asc)[0..5] { num, title, shortDesc },
    "news":    *[_type == "post" && language == $lang] | order(date desc)[0..2] { title, slug, tag, date, excerpt, cover },
  }
`
// tag: ['page', 'servizio', 'post']
```

---

## Client Sanity — `src/sanity/lib/client.ts`

```ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,  // sempre true: CDN Sanity = zero costi API read + latenza bassa
  stega: {       // per Visual Editing / Draft mode
    enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview',
    studioUrl: '/studio',
  },
})
```

> **Nota `useCdn: true`**: la CDN di Sanity ha una latenza di ~100–200ms (vs ~20–50ms del server API diretto) ma è gratuita e illimitata. I dati pubblicati ci arrivano entro ~60s. Con il webhook di revalidation questo è perfettamente accettabile — la CDN è il modo migliore per restare nel piano free senza consumare richieste API.

---

## Helper — `src/sanity/lib/utils.ts`

Le immagini principali sono URL stringa (Cloudflare R2) — non serve `urlFor` né `@sanity/image-url`.  
La dipendenza `@sanity/image-url` è rimossa dal progetto.

```ts
export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
```

---

## Webhook revalidation — `src/app/api/revalidate/route.ts`

```ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const DOCUMENT_TYPE_TO_TAG: Record<string, string[]> = {
  page:               ['page'],
  post:               ['post'],
  servizio:           ['servizio'],
  mezzo:              ['mezzo'],
  settings:           ['settings'],
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('sanity-webhook-signature')
  // Verifica HMAC con SANITY_WEBHOOK_SECRET (vedere VERCEL.md per la logica completa)
  
  const body = await req.json()
  const docType: string = body._type ?? ''
  const tags = DOCUMENT_TYPE_TO_TAG[docType] ?? []
  
  tags.forEach(tag => revalidateTag(tag))
  
  return NextResponse.json({ revalidated: tags })
}
```

---

## Visual Editing e Draft Mode

- Visual Editing attivo solo in preview (`NEXT_PUBLIC_VERCEL_ENV === 'preview'`)
- Studio embedded su `/studio/[[...tool]]` — Client Component con `import { NextStudio } from 'next-sanity/studio'`
- Presentation tool configurato in `src/app/studio/[[...tool]]/page.tsx` con `previewUrl: process.env.SANITY_STUDIO_PREVIEW_URL`

---

## Piano free Sanity — limiti e contromisure

| Limite piano free | Valore | Strategia |
|-------------------|--------|-----------|
| API CDN requests | illimitate | `useCdn: true` su tutti i fetch |
| API non-CDN requests | 500k/mese | Solo webhook + write token form |
| Bandwidth | 10 GB/mese | Immagini principali su Cloudflare R2 — zero storage/bandwidth Sanity. Solo immagini inline nel body dei post usano ancora CDN Sanity (`cdn.sanity.io`, non passa per Vercel) |
| Assets | 20 GB storage | Ottimizzare upload immagini prima del caricamento |
| Utenti studio | illimitati (OSS) | Nessuna limitazione |
| Dataset | 2 | Solo `production` |

**Regola pratica**: tutto quello che il frontend legge va sul CDN (`useCdn: true`). Solo le write API route (`/api/contact`, `/api/volunteer`) usano il client con write token, e solo su richiesta utente.
