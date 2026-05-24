# Guida al deploy: Vercel + Sanity webhook

> Guida operativa passo-passo. Segui l'ordine: prima Sanity, poi Vercel, poi il test.

---

## Prerequisiti

- Account Vercel (piano Hobby è sufficiente)
- Accesso al progetto Sanity su [sanity.io/manage](https://sanity.io/manage)
- Repository GitHub con il codice del progetto
- Dominio `misericordiadigello.it` registrato (o accesso ai DNS del registrar)

---

## Fase 0 — Configurare Cloudflare R2 (storage immagini)

Guida completa: **`docs/CLOUDFLARE-R2.md`**.

Riepilogo dei passi (può procedere in parallelo con le fasi seguenti):

1. Crea il bucket `mise-images` su [dash.cloudflare.com](https://dash.cloudflare.com) → R2 Object Storage → **Create bucket**
2. Attiva l'accesso pubblico — custom domain `images.misericordiadigello.it` (consigliato) o URL `r2.dev` (rapido)
3. Configura il CORS (whitelist `misericordiadigello.it` e `localhost:3000`)
4. Ottimizza le immagini in WebP e caricale nel bucket (convenzione naming: vedere `CLOUDFLARE-R2.md §Fase 4`)
5. Aggiorna i documenti Sanity con gli URL R2 (logo, foto mezzi, foto testimonianze, cover news)
6. Aggiungi `NEXT_PUBLIC_R2_BASE_URL` in `.env.local` e in Vercel → Settings → Environment Variables

> **Da completare prima del deploy** (Fase 5). I passi 1–4 si possono fare subito, anche prima di creare il progetto Vercel.

---

## Fase 1 — Generare i token e il secret

Prima di toccare le dashboard, genera tutte le credenziali che ti serviranno.

### 1.1 Token Sanity (read + write)

1. Vai su **sanity.io/manage → [tuo progetto] → API → Tokens**
2. Clicca **Add API token**
3. Crea il **token di lettura** (per preview/draft mode):
   - Name: `Next.js Read Token`
   - Permissions: **Viewer**
   - Copia il valore → lo chiamerai `SANITY_API_READ_TOKEN`
4. Crea il **token di scrittura** (per i form):
   - Name: `Next.js Write Token`
   - Permissions: **Editor**
   - Copia il valore → lo chiamerai `SANITY_API_WRITE_TOKEN`

### 1.2 Secret per il webhook HMAC

Apri il terminale e genera un secret casuale sicuro:

```bash
openssl rand -hex 32
```

Copia l'output (es. `a3f9b2c1...`) — lo userai sia in Sanity che in Vercel come `SANITY_WEBHOOK_SECRET`.

---

## Fase 2 — Configurare il webhook su Sanity

Il webhook è il meccanismo che fa sì che ogni volta che pubblichi qualcosa in Studio, il sito si aggiorni automaticamente senza rebuild.

> **Prima del deploy**: puoi creare il webhook ora ma non funzionerà finché il sito non è online su Vercel. Va bene così — configuralo ora e testalo dopo.

1. Vai su **sanity.io/manage → [tuo progetto] → API → Webhooks**
2. Clicca **Add webhook** (o **Create webhook**)
3. Compila i campi esattamente così:

| Campo | Valore |
|-------|--------|
| **Name** | `Vercel Revalidation` |
| **URL** | `https://misericordiadigello.it/api/revalidate` |
| **Dataset** | `production` |
| **Trigger on** | ✅ Create, ✅ Update, ✅ Delete |
| **Filter** | *(lascia vuoto — tutti i document type)* |
| **Projection** | `{ _type }` |
| **HTTP method** | `POST` |
| **HTTP Headers** | `Content-Type: application/json` |
| **Secret** | Incolla il secret generato al passo 1.2 |
| **API version** | `v2021-03-25` (o la più recente disponibile) |

4. Clicca **Save**

**Perché la Projection `{ _type }`?**  
Il webhook invia solo il tipo del documento modificato (es. `{ "_type": "post" }`). L'endpoint `/api/revalidate` usa quel tipo per capire quali tag di cache invalidare. Non c'è bisogno di inviare l'intero contenuto del documento.

**Nota sulla firma HMAC:**  
Sanity firma il body con formato `t=<timestamp>,v1=<hmac-sha256>` nell'header `sanity-webhook-signature`. Il codice in `src/app/api/revalidate/route.ts` verifica questa firma esattamente — non tentare di testarla con `curl` con formato diverso.

---

## Fase 3 — Creare il progetto su Vercel

1. Vai su [vercel.com](https://vercel.com) → **Add New → Project**
2. Importa il repository GitHub del progetto
3. Nella schermata di configurazione:
   - **Framework Preset**: Next.js (rilevato automaticamente)
   - **Root Directory**: `.` (la cartella radice — il frontend è la root del repo)
   - **Build Command**: `next build` (default, non toccare)
   - **Output Directory**: `.next` (default, non toccare)
   - **Node.js Version**: 20.x

> Non cliccare ancora **Deploy** — prima configura le variabili d'ambiente.

---

## Fase 4 — Inserire le variabili d'ambiente su Vercel

Nella stessa schermata di configurazione del progetto (o dopo in **Settings → Environment Variables**):

Aggiungi queste variabili. Per ogni variabile seleziona gli environment **Production**, **Preview**, e **Development** dove indicato.

| Variabile | Valore | Production | Preview | Development |
|-----------|--------|:---:|:---:|:---:|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID del tuo progetto Sanity (vedi sanity.io/manage) | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` | ✅ | ✅ | ✅ |
| `SANITY_API_READ_TOKEN` | Token viewer creato al passo 1.1 | ✅ | ✅ | ✅ |
| `SANITY_API_WRITE_TOKEN` | Token editor creato al passo 1.1 | ✅ | ✅ | ✅ |
| `SANITY_WEBHOOK_SECRET` | Secret generato al passo 1.2 | ✅ | ✅ | — |
| `NEXT_PUBLIC_SITE_URL` | `https://misericordiadigello.it` | ✅ | URL preview Vercel | `http://localhost:3000` |
| `SANITY_STUDIO_PREVIEW_URL` | `https://misericordiadigello.it` | ✅ | URL preview Vercel | `http://localhost:3000` |

**Come trovare il Project ID Sanity**: dashboard Sanity → tuo progetto → URL della pagina contiene l'ID, oppure vai in **Settings → General**.

---

## Fase 5 — Primo deploy

1. Clicca **Deploy** (se sei ancora nella schermata di setup) oppure fai una push su `main`
2. Vercel avvia la build — ci vogliono ~2-3 minuti
3. Controlla i **Build Logs** in tempo reale per errori

**Se la build fallisce**, i problemi più comuni sono:
- Variabili d'ambiente mancanti: cerca `Error: Missing environment variable` nei log
- Errori TypeScript: leggi l'errore completo e correggi nel codice
- Timeout Sanity durante la build: può succedere se il dataset è vuoto o il token è sbagliato

---

## Fase 6 — Aggiungere il dominio custom

1. In Vercel → il tuo progetto → **Settings → Domains**
2. Clicca **Add** e inserisci `misericordiadigello.it`
3. Vercel ti mostra i record DNS da configurare. Vai nel pannello del tuo registrar (es. Aruba, Register.it, Namecheap) e aggiungi:

| Tipo | Nome | Valore |
|------|------|--------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

4. Aspetta la propagazione DNS (da pochi minuti a 24 ore)
5. Vercel attiverà HTTPS automaticamente con Let's Encrypt
6. Configura il redirect `www → apex` da Vercel: nella sezione Domains, clicca sul record `www` e seleziona **Redirect to apex**

---

## Fase 7 — Testare il webhook

Dopo che il dominio è attivo e il sito risponde:

### Test rapido da Sanity Studio

1. Apri lo Studio su `https://misericordiadigello.it/studio`
2. Vai su **Articoli News** → apri o crea un articolo → **Publish**
3. Aspetta ~5-10 secondi
4. Vai su `https://misericordiadigello.it/news` — il contenuto deve essere aggiornato

### Verifica nei log Vercel

1. Vercel → il tuo progetto → **Logs** (tab **Functions**)
2. Filtra per `/api/revalidate`
3. Dopo una pubblicazione in Sanity, devi vedere una richiesta POST con **status 200**

Se vedi **401 Unauthorized**: il `SANITY_WEBHOOK_SECRET` in Vercel non corrisponde a quello inserito in Sanity. Rigenera entrambi e aggiorna.

Se non vedi nessuna richiesta: il webhook Sanity non sta scattando. Verifica che l'URL nel webhook Sanity sia esatto (con `https://` e senza slash finale).

---

## Fase 8 — Sanity CORS (se necessario)

Se lo Studio embedded su `/studio` non riesce a caricare i dati:

1. Vai su **sanity.io/manage → [tuo progetto] → API → CORS Origins**
2. Aggiungi:
   - `https://misericordiadigello.it`
   - `http://localhost:3000` (per sviluppo locale)
3. Spunta **Allow Credentials** su entrambe

---

## Checklist finale pre go-live

- [ ] Build Vercel completa senza errori
- [ ] Sito risponde su `https://misericordiadigello.it`
- [ ] Redirect `http://` → `https://` funziona
- [ ] Redirect `www.` → apex funziona
- [ ] Studio accessibile su `/studio` (login con account Sanity)
- [ ] Form contatti invia correttamente (controlla le submission in Studio → Messaggi Contatti)
- [ ] Form volontariato invia correttamente
- [ ] Webhook funziona: pubblica un post in Sanity → `/news` si aggiorna entro 10s
- [ ] Sitemap accessibile su `/sitemap.xml`
- [ ] Robots.txt accessibile su `/robots.txt`
- [ ] Nessuna variabile d'ambiente mancante (controlla Settings → Environment Variables)

---

## Aggiornamenti futuri

Per ogni push su `main`, Vercel fa il deploy automaticamente. Non devi fare nulla.

Per aggiornare il contenuto (news, servizi, ecc.) usa solo Sanity Studio — non serve un nuovo deploy.

Per forzare manualmente un rebuild completo: Vercel → il tuo progetto → **Deployments** → clicca su un deploy → **Redeploy**.
