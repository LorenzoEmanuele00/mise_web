# Setup ambiente di test (staging)

> Ambiente usa-e-getta per validare Vercel, Sanity e Cloudflare R2 **prima** del go-live sul dominio reale `misericordiadigello.it`.
>
> **Architettura:** Vercel Preview deployment (branch → `*.vercel.app`) + dataset Sanity `staging` + bucket R2 `mise-images-test`.
> Lo scoping Vercel separa i due ambienti: env _Preview_ → staging, env _Production_ → production (riempita al go-live).

---

## Panoramica — cosa testare

| Processo          | Cosa si verifica                                                       |
| ----------------- | ---------------------------------------------------------------------- |
| **Vercel**        | Build verde, tutte le pagine caricano sull'URL preview                 |
| **Sanity read**   | Pagine mostrano i contenuti dal dataset `staging`                      |
| **Sanity write**  | Form contatti/volontariato salvano submission nel dataset `staging`    |
| **Cloudflare R2** | Le `<img>` caricano dall'host `*.r2.dev` (Network tab del browser)     |
| **Webhook**       | Pubblica post in Studio → `/news` si aggiorna senza rebuild entro ~10s |

---

## Passo 0 — Credenziali staging (genera prima di tutto)

Usa credenziali **separate** per lo staging — non riusare quelle di produzione.

### Token Sanity staging

1. Vai su **[sanity.io/manage](https://sanity.io/manage) → progetto `zmh64ht0` → API → Tokens**
2. **Add API token** — token di lettura:
   - Name: `Staging Read Token`
   - Permissions: **Viewer**
   - Copia il valore → `SANITY_API_READ_TOKEN_STAGING`
3. **Add API token** — token di scrittura:
   - Name: `Staging Write Token`
   - Permissions: **Editor**
   - Copia il valore → `SANITY_API_WRITE_TOKEN_STAGING`

### Secret webhook staging

```bash
openssl rand -hex 32
```

Copia l'output → `SANITY_WEBHOOK_SECRET_STAGING`

---

## Passo 1 — Dataset Sanity `staging`

Il piano free di Sanity consente 2 dataset: `production` (già esistente) e uno secondo (lo staging).

1. **sanity.io/manage → progetto `zmh64ht0` → Datasets → Add dataset**
   - Name: `staging`
   - Visibility: Public (più semplice; con token la CDN funziona comunque)
   - Crea

2. **API → CORS Origins** — aggiungi (con **Allow Credentials** su entrambe):
   - `http://localhost:3000`
   - `https://<preview-alias>.vercel.app` ← da aggiungere dopo il passo 5 quando hai l'URL

---

## Passo 2 — Seed del dataset `staging`

Crea il file `.env.staging` nella root del progetto (è in `.gitignore`, non viene committato):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=zmh64ht0
NEXT_PUBLIC_SANITY_DATASET=staging
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_WRITE_TOKEN=<token staging dal Passo 0>
```

Poi lancia il seed puntando a quel file:

```bash
node scripts/seed.mjs --env-file .env.staging
```

Verifica l'output: deve scrivere 21 documenti senza errori. `.env.local` non va mai toccato.

> Il seed non popolava URL di immagini. Se vuoi testare le immagini R2, inseriscile manualmente in Studio dopo il Passo 4 (oppure aggiorna `scripts/seed.mjs` aggiungendo oggetti `{src, altText}` con gli URL R2 reali).

---

## Passo 3 — Bucket Cloudflare R2 di test

1. Vai su **[dash.cloudflare.com](https://dash.cloudflare.com) → R2 Object Storage → Create bucket**
   - Bucket name: `mise-images-test`
   - Location: Automatic

2. **Public access — Opzione B (r2.dev, nessun DNS)**
   - Nel bucket → Settings → Public access → **Allow Access**
   - Cloudflare assegna un URL tipo `https://pub-xxxxxxxxxxxx.r2.dev`
   - Copia questo URL → sarà `NEXT_PUBLIC_R2_BASE_URL`

3. **CORS policy** — nel bucket → Settings → CORS → Add CORS policy:

   ```json
   [
     {
       "AllowedOrigins": [
         "http://localhost:3000",
         "https://<preview-alias>.vercel.app"
       ],
       "AllowedMethods": ["GET"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 86400
     }
   ]
   ```

   _(Aggiorna `<preview-alias>` con l'URL reale dopo il Passo 5)_

4. **Carica immagini di test**
   - Ottimizza 2-3 immagini WebP in locale (es. `logo.svg`, `mezzo-test.webp`) con [Squoosh](https://squoosh.app) se necessario
   - Nel bucket → **Upload** → carica i file
   - Copia gli **Object URL** di ciascuno (es. `https://pub-xxx.r2.dev/logo.svg`)

---

## Passo 4 — URL R2 in Sanity Studio staging

Dopo il passo 3, inserisci gli URL R2 nei documenti del dataset `staging`:

1. Avvia il dev server locale:
   ```bash
   npm run dev
   ```
2. Apri Studio su `http://localhost:3000/studio`
3. Apri **Impostazioni Sito** → campo **Logo** → inserisci:
   - `src`: URL R2 del logo (es. `https://pub-xxx.r2.dev/logo.svg`)
   - `altText`: `Logo Misericordia di Gello`
4. Apri uno dei **Mezzi** → campo **Foto** → inserisci src + altText
5. Salva e pubblica

In alternativa, aggiorna `scripts/seed.mjs` prima del seed (Passo 2) per precompilare i campi immagine con gli URL R2, poi ri-esegui il seed.

---

## Passo 5 — Progetto Vercel

### Crea il progetto

1. Vai su **[vercel.com](https://vercel.com) → Add New → Project**
2. Importa il repository GitHub del progetto
3. Configura:
   - **Framework Preset**: Next.js (rilevato automaticamente)
   - **Root Directory**: `.`
   - **Build Command**: `next build` (default)
   - **Node.js Version**: 20.x
4. **Non aggiungere il dominio custom** — lo farai solo al go-live reale

> Non cliccare ancora Deploy.

### Variabili d'ambiente — ambiente **Preview**

In **Settings → Environment Variables**, aggiungi queste variabili selezionando **solo Preview** (non Production, non Development):

| Variabile                        | Valore                                           |
| -------------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | `zmh64ht0`                                       |
| `NEXT_PUBLIC_SANITY_DATASET`     | `staging`                                        |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01`                                     |
| `SANITY_API_READ_TOKEN`          | Token staging (Passo 0)                          |
| `SANITY_API_WRITE_TOKEN`         | Token staging (Passo 0)                          |
| `SANITY_WEBHOOK_SECRET`          | Secret staging (Passo 0)                         |
| `NEXT_PUBLIC_R2_BASE_URL`        | URL `pub-xxx.r2.dev` (Passo 3)                   |
| `NEXT_PUBLIC_SITE_URL`           | URL preview (da aggiornare dopo il primo deploy) |

> Le variabili _Production_ rimangono vuote per ora — le compilerai durante il go-live reale con i valori `production`.

---

## Passo 6 — Primo deploy (branch Preview)

1. Fai push del branch corrente su GitHub:
   ```bash
   git push origin animations
   ```
2. Vercel rileva il push e avvia una build Preview automaticamente
3. Segui la build in **Deployments** → **Build Logs** — deve terminare senza errori

4. Una volta completata, trovi l'URL nella tab **Domains** del deployment.
   - Usa l'**alias stabile per branch** (es. `misericordia-gello-git-animations-<team>.vercel.app`), **non** l'URL per-deploy che cambia ad ogni push.

5. Torna al **Passo 1** e aggiungi l'alias agli **CORS Origins di Sanity**.
6. Torna al **Passo 3** e aggiorna il CORS del bucket R2.
7. Aggiorna `NEXT_PUBLIC_SITE_URL` in Vercel → Environment Variables → Preview con l'alias.

---

## Passo 7 — Webhook staging ⚠️ (gotcha importante)

La **Deployment Protection** è attiva di default su Vercel (ottima per accesso personale) — ma blocca anche le chiamate in entrata del webhook Sanity con 401/redirect.

### Soluzione: Protection Bypass for Automation

1. **Vercel → Settings → Deployment Protection**
2. Abilita **Protection Bypass for Automation** → copia il **secret bypass** generato

### Crea il webhook su Sanity (dataset staging)

1. **sanity.io/manage → progetto `zmh64ht0` → API → Webhooks → Add webhook**

| Campo            | Valore                                        |
| ---------------- | --------------------------------------------- |
| **Name**         | `Vercel Revalidation (staging)`               |
| **URL**          | `https://<preview-alias>/api/revalidate`      |
| **Dataset**      | `staging`                                     |
| **Trigger on**   | ✅ Create, ✅ Update, ✅ Delete               |
| **Filter**       | _(vuoto)_                                     |
| **Projection**   | `{ _type }`                                   |
| **HTTP method**  | `POST`                                        |
| **HTTP Headers** | `Content-Type: application/json`              |
|                  | `x-vercel-protection-bypass: <secret bypass>` |
| **Secret**       | `SANITY_WEBHOOK_SECRET_STAGING` (Passo 0)     |

2. **Save**

---

## Passo 8 — Verifica end-to-end

Apri `https://<preview-alias>.vercel.app` (richiede login Vercel al primo accesso).

### ✅ Vercel — build e pagine

- [ ] Build completata senza errori nei log
- [ ] Home, /news, /servizi, /storia, /volontariato, /contatti caricano
- [ ] Studio accessibile su `<alias>/studio`

### ✅ Sanity read

- [ ] La home mostra i contenuti seedati (es. "Misericordia di Gello", 6 servizi, 3 news)
- [ ] `/news` elenca i 3 articoli di test

### ✅ Cloudflare R2 — immagini

- [ ] Apri DevTools → Network → filtra per Img
- [ ] Le immagini caricate caricano dall'host `pub-xxx.r2.dev` — **non** da `cdn.sanity.io` né da Vercel
- [ ] Nessun errore CORS (status 200, non 403)

### ✅ Sanity write — form

- [ ] Compila e invia il form Contatti sul sito staging
- [ ] Apri Studio staging → **Messaggi Contatti** → la submission è presente
- [ ] Ripeti per il form Volontariato → **Candidature Volontari**

### ✅ Webhook revalidation

1. In Studio staging (`<alias>/studio`) apri un articolo news → modifica il titolo → **Publish**
2. Aspetta 5-10 secondi
3. Ricarica `<alias>/news` — il contenuto aggiornato deve apparire senza rebuild
4. Verifica in **Vercel → Logs → Functions** → filtra `/api/revalidate`:
   - Deve apparire un `POST 200` nei secondi successivi alla pubblicazione
   - Se vedi `401`: il `SANITY_WEBHOOK_SECRET` in Vercel non coincide con quello in Sanity → rigenera entrambi
   - Se non appare nulla: l'header `x-vercel-protection-bypass` manca o è sbagliato

---

## Gotcha e troubleshooting

| Problema                           | Causa                                                  | Soluzione                                                                  |
| ---------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| Webhook 401                        | Protection bypass non configurato                      | Passo 7 — aggiungi header `x-vercel-protection-bypass`                     |
| Webhook non scatta                 | URL del webhook punta al deploy singolo, non all'alias | Usa l'alias per-branch stabile                                             |
| Immagini non caricano (CORS 403)   | URL preview non nel CORS del bucket R2                 | Passo 3 — aggiungi alias al CORS                                           |
| Build fallisce: variabile mancante | Env var non impostata per ambiente Preview             | Passo 5 — verifica che tutte le var abbiano l'ambiente Preview selezionato |
| Studio non carica dati             | URL non nelle CORS Origins Sanity                      | Passo 1 — aggiungi alias alle CORS Origins                                 |
| Seed scrive su `production`        | `.env.local` non aggiornato prima del seed             | Passo 2 — imposta `NEXT_PUBLIC_SANITY_DATASET=staging` prima di lanciare   |

---

## Checklist finale staging

- [ ] Dataset `staging` creato e seedato (21 documenti)
- [ ] Bucket R2 `mise-images-test` pubblico (r2.dev), CORS configurato
- [ ] Almeno 2-3 immagini WebP caricate su R2, URL inseriti in Sanity staging
- [ ] Progetto Vercel creato, env Preview configurate
- [ ] Branch `animations` deployato, alias stabile identificato
- [ ] Webhook staging attivo con bypass header, test 200 confermato
- [ ] Form contatti e volontariato testati → submission visibili in Studio
- [ ] Immagini caricate da host `r2.dev` confermato nel Network tab

---

## Dopo il test

Quando sei pronto per il go-live:

1. Compila le variabili **Production** in Vercel con i valori definitivi (dataset `production`, token produzione, URL `misericordiadigello.it`).
2. Aggiungi il dominio `misericordiadigello.it` in Vercel → Settings → Domains.
3. Aggiorna i DNS su Aruba (vedi `docs/SETUP-DEPLOY.md §Fase 6`).
4. Crea un webhook Sanity **production** puntando a `https://misericordiadigello.it/api/revalidate` (dataset `production`).
5. Fai push su `main` → Vercel deploya in produzione automaticamente.

Le guide complete per il go-live: `docs/SETUP-DEPLOY.md`, `docs/VERCEL.md`, `docs/CLOUDFLARE-R2.md`.
