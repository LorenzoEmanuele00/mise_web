# CLOUDFLARE R2 — Storage Immagini

> Cloudflare R2 è lo storage S3-compatibile di Cloudflare.  
> Egress verso internet **gratuito** — le immagini arrivano al browser senza costi, senza passare per Vercel o Sanity.

---

## Architettura

```
Amministratore              Utente finale
      │                           │
      │ carica immagine           │
      ▼                           │
Cloudflare R2 ─────────────────► Browser
(bucket pubblico)        <img src="https://images.misericordiadigello.it/mezzo-ducato.webp">
                                   ▲
Sanity (CMS)                       │
 └─ salva solo l'URL (stringa) ────┘
     es. "https://images.misericordiadigello.it/mezzo-ducato.webp"
     Next.js legge la stringa, la scrive nell'<img src>
```

**Zero bandwidth Vercel per le immagini.** Next.js serve solo l'HTML con l'URL. Il browser va direttamente su R2. `next/image` **non viene usato** per le immagini R2 — passerebbe per l'Image Optimization API di Vercel e consumerebbe bandwidth. Le immagini vengono pre-ottimizzate prima del caricamento.

---

## Fase 1 — Creare il bucket R2

1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com) → seleziona il tuo account → **R2 Object Storage**
2. Clicca **Create bucket**
3. Compila:
   - **Bucket name**: `mise-images`
   - **Location**: Automatic
4. Clicca **Create bucket**

---

## Fase 2 — Rendere il bucket pubblico

### Opzione A — Custom domain `images.misericordiadigello.it` (consigliata)

URL finale: `https://images.misericordiadigello.it/logo.svg`

Richiede che il dominio `misericordiadigello.it` usi i **nameserver Cloudflare**. Se il dominio è su un registrar esterno (Aruba, Register.it), aggiungi il dominio su Cloudflare (piano Free) e aggiorna i nameserver del registrar.

1. Vai nel bucket → **Settings → Custom Domains**
2. Clicca **Connect Domain**
3. Inserisci: `images.misericordiadigello.it`
4. Cloudflare aggiorna i DNS automaticamente
5. Attendi la propagazione (tipicamente < 5 minuti)

### Opzione B — URL r2.dev (rapido, senza configurazioni DNS)

URL finale: `https://pub-abc123def456.r2.dev/logo.svg`

1. Vai nel bucket → **Settings → Public access**
2. Attiva **Allow Access**
3. Cloudflare assegna un URL `pub-xxxx.r2.dev`

Funziona subito. Puoi aggiungere il custom domain in seguito senza cambiare il codice — aggiorna solo `NEXT_PUBLIC_R2_BASE_URL` in Vercel.

---

## Fase 3 — Configurare CORS

1. Nel bucket → **Settings → CORS policy**
2. Clicca **Add CORS policy** e incolla:

```json
[
  {
    "AllowedOrigins": [
      "https://misericordiadigello.it",
      "https://www.misericordiadigello.it",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

3. Clicca **Save**

---

## Fase 4 — Caricare le immagini

### Ottimizzazione obbligatoria prima dell'upload

R2 non fa resize o conversione automatica. Le immagini devono essere pre-ottimizzate.

**Strumento consigliato:** [Squoosh](https://squoosh.app) — gratuito, browser-based.  
Converti in **WebP** e ridimensiona alle dimensioni indicate prima di caricare.

| Contesto | Larghezza max | Formato |
|----------|--------------|---------|
| Foto mezzi (card griglia) | 640 px | WebP |
| Cover articoli news | 1200 px | WebP |
| Foto testimonianze SC | 400 px | WebP |
| Logo | vettoriale | SVG |
| OG Image (social preview) | 1200 × 630 px | WebP o JPG |

### Convenzione di naming

Nomi in minuscolo, separati da `-`, senza spazi:

```
logo.svg
mezzo-ducato-2019.webp
mezzo-sprinter-2021.webp
mezzo-transit-2026.webp
mezzo-caddy-2020.webp
mezzo-ranger-2018.webp
mezzo-panda-2022.webp
testimonianza-sofia.webp
testimonianza-marco.webp
news-cover-esempio.webp
og-default.webp
```

### Upload

1. Nel bucket → clicca **Upload**
2. Trascina i file (o usa il file picker)
3. Dopo l'upload, clicca sul file → copia l'**Object URL**

---

## Fase 5 — Variabile d'ambiente

Aggiungi in `.env.local`:

```env
NEXT_PUBLIC_R2_BASE_URL=https://images.misericordiadigello.it
```

E in **Vercel → Settings → Environment Variables** (Production + Preview + Development).

Nel codice Next.js non serve costruire URL programmaticamente: in Sanity Studio l'admin inserisce l'URL completo direttamente nel campo testo. La variabile serve solo come riferimento per eventuali immagini hardcoded.

---

## Fase 6 — Inserire gli URL in Sanity Studio

Dopo aver caricato le immagini su R2, aggiorna i documenti Sanity:

| Documento | Campo | URL da inserire |
|-----------|-------|----------------|
| Settings | Logo | `https://images.misericordiadigello.it/logo.svg` |
| Settings | SEO ogImage | `https://images.misericordiadigello.it/og-default.webp` |
| Ogni `mezzo` | Foto | URL WebP del veicolo |
| Ogni `post` | Copertina | URL WebP della cover |
| Ogni `scTestimonianza` | Foto | URL WebP del volontario |

---

## Riepilogo costi R2

| Voce | Valore piano Free |
|------|-------------------|
| Egress verso internet | **Gratuito** |
| Egress verso Workers/Pages Cloudflare | Gratuito |
| Storage | 10 GB/mese gratuiti |
| Operazioni classe A (PUT, DELETE) | 1 M/mese gratuite |
| Operazioni classe B (GET) | 10 M/mese gratuite |

Per un sito vetrina con ~50–100 immagini statiche il piano gratuito è più che sufficiente a lungo termine.
