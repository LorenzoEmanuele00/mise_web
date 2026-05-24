# VERCEL — Deploy, Cache & Revalidation

> Configurazione Vercel, variabili d'ambiente, strategia ISR e webhook Sanity.

---

## Progetto Vercel

| Campo | Valore |
|-------|--------|
| Framework preset | Next.js |
| Root directory | `frontend/` |
| Build command | `next build` (default) |
| Output directory | `.next` (default) |
| Node version | 20.x |
| Dominio target | `misericordiadigello.it` |

> Il monorepo ha `frontend/` e `studio/`. Vercel deve puntare solo alla cartella `frontend/`.  
> Studio gira embedded nel frontend su `/studio`, non come app separata.

---

## Variabili d'ambiente

### `frontend/.env.example` — template da committare

```env
# Sanity — pubbliche (prefisso NEXT_PUBLIC_ = esposte al browser)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Sanity — riservate (solo server-side)
SANITY_API_READ_TOKEN=       # Token con permesso "viewer" — per draft mode / preview
SANITY_API_WRITE_TOKEN=      # Token con permesso "editor" — solo per le API route form
SANITY_WEBHOOK_SECRET=       # Secret HMAC condiviso tra Sanity e Vercel

# next-intl (opzionale, se si imposta locale di default)
# NEXT_PUBLIC_DEFAULT_LOCALE=it

# Sanity Studio — usato nel sanity.config.ts
SANITY_STUDIO_PREVIEW_URL=   # es. https://misericordiadigello.it (prod) o https://...vercel.app (preview)
```

### `frontend/.env.local` — valori reali (mai committare)

Assicurarsi che `.env.local` sia nel `.gitignore`. Contiene gli stessi campi con i valori reali.

### Variabili da inserire nel dashboard Vercel

Tutte le variabili sopra vanno inserite in **Settings → Environment Variables** del progetto Vercel, con i valori corretti per i tre environment:

| Variabile | Production | Preview | Development |
|-----------|-----------|---------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✓ | ✓ | ✓ |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | `production` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | ✓ | ✓ | ✓ |
| `SANITY_API_READ_TOKEN` | ✓ | ✓ | ✓ |
| `SANITY_API_WRITE_TOKEN` | ✓ | ✓ | ✓ |
| `SANITY_WEBHOOK_SECRET` | ✓ | ✓ | — |
| `SANITY_STUDIO_PREVIEW_URL` | URL prod | URL preview | `http://localhost:3000` |

---

## Strategia di caching

### Panoramica

```
Utente          Vercel Edge Cache       Next.js Data Cache      Sanity CDN
  │                    │                       │                    │
  │──── GET /news ────>│                       │                    │
  │                    │──── cache MISS ──────>│                    │
  │                    │                       │──── fetch ─────────>│
  │                    │                       │<─── dati ──────────│
  │                    │<──── render ──────────│                    │
  │<─── HTML ──────────│                       │                    │
  │                    │                       │                    │
  │  [redattore pubblica su Sanity]            │                    │
  │                    │                       │                    │
  │               Sanity Webhook               │                    │
  │                    │──── POST /api/revalidate ────────────────> │
  │                    │                       │<── revalidateTag() │
  │                    │                       │    svuota cache    │
  │──── GET /news ────>│                       │                    │
  │                    │──── cache MISS ──────>│                    │
  │                    │                       │──── fetch (fresh) ──>│
```

### Regole

1. **Tutte le pagine pubbliche** sono statiche (`generateStaticParams` dove serve). Non si usa `revalidate: N` con timer — si usa solo `revalidateTag` da webhook.
2. **Ogni `fetch` a Sanity** porta il tag corrispondente al document type:
   ```ts
   { next: { tags: ['post'] } }
   ```
3. **Il webhook Sanity** chiama `revalidateTag(tag)` per il tipo di documento pubblicato.
4. **`useCdn: true`** nel client Sanity — le letture vanno sempre sulla CDN Sanity, non sull'API diretta.

### Tag di revalidation

| Document type Sanity | Tag cache Next.js | Pagine invalidate |
|---------------------|-------------------|-------------------|
| `page` | `'page'` | `/`, `/storia`, ecc. |
| `post` | `'post'` | `/news`, `/news/[slug]` |
| `servizio` | `'servizio'` | `/servizi`, `/servizi/[slug]` |
| `mezzo` | `'mezzo'` | `/servizi` (sezione parco mezzi) |
| `settings` | `'settings'` | Tutte le pagine (header, footer) |
| `servizioCivile` | `'servizioCivile'` | `/servizio-civile` |

---

## Webhook Sanity — configurazione

### 1. Creare il webhook su `sanity.io`

**Dashboard Sanity → API → Webhooks → Add Webhook**

| Campo | Valore |
|-------|--------|
| Name | `Vercel Revalidation` |
| URL | `https://misericordiadigello.it/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | *(lasciare vuoto — qualsiasi documento)* |
| HTTP method | POST |
| HTTP Headers | `Content-Type: application/json` |
| Secret | *(generare con `openssl rand -hex 32` e copiare in `SANITY_WEBHOOK_SECRET`)* |
| Projection | `{ _type }` ← inviare solo il tipo del documento, non il contenuto |

### 2. Verifica HMAC nell'endpoint — `src/app/api/revalidate/route.ts`

Il formato dell'header inviato da Sanity è `t=<unixTs>,v1=<hmac-sha256(secret, '<ts>.<body>')>`.  
Il body firmato è `<timestamp>.<rawBody>`, non solo il rawBody.

```ts
import { createHmac, timingSafeEqual } from 'crypto'
import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'

const TAG_MAP: Record<string, string[]> = {
  settings:       ['settings'],
  page:           ['page'],
  post:           ['post'],
  servizio:       ['servizio'],
  mezzo:          ['mezzo'],
  servizioCivile: ['servizioCivile'],
}

function verifySignature(rawBody: string, header: string, secret: string): boolean {
  const match = header.match(/^t=(\d+),v1=([a-f0-9]+)$/)
  if (!match) return false
  const [, timestamp, received] = match
  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex')
  try {
    return timingSafeEqual(Buffer.from(received!, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) return new Response('Webhook secret not configured', { status: 500 })

  const rawBody = await req.text()
  const signature = req.headers.get('sanity-webhook-signature') ?? ''

  if (!verifySignature(rawBody, signature, secret)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = JSON.parse(rawBody) as { _type?: string }
  const tags = body._type ? TAG_MAP[body._type] : undefined
  if (tags) {
    for (const tag of tags) revalidateTag(tag, { expire: 0 })
  }

  return new Response('OK', { status: 200 })
}
```

### 3. Testare il webhook

Il webhook Sanity si testa pubblicando un documento in Studio e verificando i log Vercel (`Functions → /api/revalidate` → status 200).

Non è possibile testarlo con `curl` simulando la firma HMAC in modo semplice, perché il payload firmato include il timestamp corrente (`t=<unixTs>,v1=<hmac(secret, '<ts>.<body>')>`). Il modo più affidabile è usare il webhook reale da Sanity.

---

## Piano free Vercel — limiti e contromisure

| Limite Hobby plan | Valore | Strategia |
|-------------------|--------|-----------|
| Bandwidth | 100 GB/mese | Immagini da CDN Sanity (non passano per Vercel) |
| Build minutes | 6.000/mese | Build solo su push — non in loop |
| Serverless function duration | 10s max | Le API route form sono leggere (< 1s) |
| Edge function duration | 25ms budget | Non usare edge per le API route — usare Node.js runtime |
| Deployments | illimitati | — |
| Custom domain | 1 | `misericordiadigello.it` |
| HTTPS | automatico | — |
| Cron jobs | non disponibili su Hobby | Non necessari — usiamo webhook Sanity |

**Regola**: le immagini non passano mai per Vercel. Ogni `<img>` o `<Image>` di Sanity usa `urlFor().url()` dalla CDN `cdn.sanity.io`. Il componente `next/image` con `remotePatterns: [{ hostname: 'cdn.sanity.io' }]` ottimizza il formato ma serve bandwidth Vercel — valutare se usarlo solo per immagini critiche (hero) e CDN diretta per il resto.

---

## Configurazione dominio

1. Aggiungere `misericordiadigello.it` in **Vercel → Settings → Domains**
2. Configurare i DNS del dominio con il registrar:
   - Record `A`: `76.76.21.21` (Vercel IP)
   - Record `CNAME` per `www`: `cname.vercel-dns.com`
3. Vercel attiva HTTPS automaticamente con Let's Encrypt
4. Redirect `www → apex` configurabile da Vercel

---

## `next.config.ts` — configurazione produzione

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  // Escludere /studio dal middleware next-intl
  // Il middleware va configurato con il matcher appropriato in middleware.ts
}

export default nextConfig
```

---

## Checklist pre go-live

- [ ] Tutte le env var inserite in Vercel (Production)
- [ ] Build di produzione completa senza errori (`vercel --prod`)
- [ ] Webhook Sanity configurato e testato (log Vercel mostrano `200 OK`)
- [ ] Revalidation funziona: pubblica post in Sanity → `/news` si aggiorna entro 10s
- [ ] Dominio `misericordiadigello.it` punta a Vercel
- [ ] HTTPS attivo e redirect HTTP → HTTPS funziona
- [ ] `robots.txt` non blocca indexing in produzione
- [ ] Sitemap accessibile su `/sitemap.xml`
- [ ] Core Web Vitals verificati su PageSpeed Insights
- [ ] Form contatti e volontariato funzionano in produzione e le submission appaiono in Studio
