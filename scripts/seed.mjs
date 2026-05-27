// Seed script — inserisce dati di test nel CMS Sanity
// Uso: node scripts/seed.mjs [--env-file .env.staging]
// Richiede SANITY_API_WRITE_TOKEN nel file env

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envFileArg = process.argv.indexOf('--env-file')
const envFileName = envFileArg !== -1 ? process.argv[envFileArg + 1] : '.env.local'
const envPath = resolve(__dirname, '..', envFileName)
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const writeToken = env['SANITY_API_WRITE_TOKEN']
if (!writeToken) {
  console.error('SANITY_API_WRITE_TOKEN mancante in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: env['NEXT_PUBLIC_SANITY_PROJECT_ID'],
  dataset: env['NEXT_PUBLIC_SANITY_DATASET'] ?? 'production',
  apiVersion: env['NEXT_PUBLIC_SANITY_API_VERSION'] ?? '2024-01-01',
  token: writeToken,
  useCdn: false,
})

const tx = client.transaction()

// ─── Settings (singleton) ───────────────────────────────────────────────────
tx.createOrReplace({
  _id: 'singleton-settings',
  _type: 'settings',
  siteName: 'Misericordia di Gello',
  footerText: 'Confraternita di Misericordia di Gello ODV — Volontariato, soccorso e aggregazione sociale dal 1947.',
  address: 'Via della Misericordia 12, 56017 Gello (PI)',
  phone: '050 000000',
  email: 'info@misericordiadigello.it',
  emailSC: 'serviziocivile@misericordiadigello.it',
  iban: 'IT00 X000 0000 0000 0000 0000 000',
  codiceFiscale: '90000000000',
  orariSede: 'Lun–Ven: 8:00–13:00 / 15:00–19:00\nSab: 8:00–13:00\nDomenica: chiuso',
  navigation: [
    { _key: 'nav-1', label: 'Chi siamo',       href: '/storia' },
    { _key: 'nav-2', label: 'Servizi',          href: '/servizi' },
    { _key: 'nav-3', label: 'Servizio Civile',  href: '/servizio-civile' },
    { _key: 'nav-4', label: 'News',             href: '/news' },
    { _key: 'nav-5', label: 'Galleria',         href: '/galleria' },
    { _key: 'nav-6', label: 'Volontariato',     href: '/volontariato' },
    { _key: 'nav-7', label: 'Contatti',         href: '/contatti' },
  ],
})

// ─── Page: Home ─────────────────────────────────────────────────────────────
tx.createOrReplace({
  _id: 'page-home-it',
  _type: 'page',
  language: 'it',
  title: 'Home',
  slug: { _type: 'slug', current: 'home' },
  heroSection: {
    kicker: 'Misericordia di Gello dal 1947',
    headingPre: 'Volontari al tuo',
    headingEm: 'fianco',
    headingPost: '24 ore su 24',
    body: 'Soccorso, assistenza, formazione e comunità. Ogni giorno, con dedizione e professionalità, siamo presenti per chi ha bisogno.',
    ctaPrimary:  { label: 'Scopri i servizi', href: '/servizi' },
    ctaSecondary: { label: 'Diventa volontario', href: '/volontariato' },
  },
  seo: {
    metaTitle: 'Misericordia di Gello — Volontariato e soccorso',
    metaDescription: 'Confraternita Misericordia di Gello: trasporto sanitario, emergenza 118, protezione civile, formazione e molto altro.',
  },
})

// ─── Page: Storia ───────────────────────────────────────────────────────────
tx.createOrReplace({
  _id: 'page-storia-it',
  _type: 'page',
  language: 'it',
  title: 'Chi siamo',
  slug: { _type: 'slug', current: 'storia' },
  heroSection: {
    kicker: 'La nostra storia',
    headingPre: 'Quasi ottant\'anni di',
    headingEm: 'servizio',
    headingPost: 'alla comunità',
    body: 'Fondata nel 1947 da un gruppo di volontari della comunità di Gello, la Misericordia è cresciuta fino a diventare un punto di riferimento per l\'intera area di San Giuliano Terme.',
  },
})

// ─── Page: Volontariato ─────────────────────────────────────────────────────
tx.createOrReplace({
  _id: 'page-volontariato-it',
  _type: 'page',
  language: 'it',
  title: 'Volontariato',
  slug: { _type: 'slug', current: 'volontariato' },
  heroSection: {
    kicker: 'Entra nella squadra',
    headingPre: 'Fai la',
    headingEm: 'differenza',
    headingPost: 'nella tua comunità',
    body: 'Non serve esperienza pregressa: offriamo formazione completa. Servono solo buona volontà e voglia di mettersi in gioco.',
  },
})

// ─── Page: Contatti ─────────────────────────────────────────────────────────
tx.createOrReplace({
  _id: 'page-contatti-it',
  _type: 'page',
  language: 'it',
  title: 'Contatti',
  slug: { _type: 'slug', current: 'contatti' },
  heroSection: {
    kicker: 'Scrivici',
    headingPre: 'Siamo qui per',
    headingEm: 'aiutarti',
    headingPost: '',
    body: 'Per informazioni sui nostri servizi, per candidarti come volontario o per qualsiasi altra necessità.',
  },
})

// ─── Servizi ─────────────────────────────────────────────────────────────────
const servizi = [
  {
    _id: 'servizio-s01',
    num: 'S/01',
    title: 'Trasporto in emergenza',
    slug: { _type: 'slug', current: 'trasporto-emergenza' },
    shortDesc: 'Servizio 118 attivo 24 ore su 24, 7 giorni su 7. Interveniamo su tutto il territorio con ambulanze attrezzate e personale formato.',
    longDesc: 'Garantiamo copertura continua per il servizio di emergenza territoriale in convenzione con l\'AUSL Toscana Centro. Le nostre ambulanze sono dotate di defibrillatore, ossigenoterapia e tutto il necessario per la stabilizzazione del paziente.',
    mezzi: 'Fiat Ducato ALS, Mercedes Sprinter ALS',
    orario: '24/7 – 365 giorni l\'anno',
    contatto: 'Centrale 118',
    order: 1,
    language: 'it',
  },
  {
    _id: 'servizio-s02',
    num: 'S/02',
    title: 'Trasporto sanitario ordinario',
    slug: { _type: 'slug', current: 'trasporto-sanitario' },
    shortDesc: 'Trasporto programmato per dialisi, dimissioni ospedaliere, visite specialistiche e terapie oncologiche.',
    longDesc: 'Offriamo un servizio di trasporto sanitario non urgente per pazienti che necessitano di accompagnamento verso strutture ospedaliere e ambulatoriali. Il servizio è prenotabile con anticipo e copre l\'intera provincia.',
    mezzi: 'Volkswagen Caddy, Fiat Panda',
    orario: 'Lun–Sab: 7:00–20:00',
    contatto: '050 000000',
    order: 2,
    language: 'it',
  },
  {
    _id: 'servizio-s03',
    num: 'S/03',
    title: 'Assistenza alla persona',
    slug: { _type: 'slug', current: 'assistenza-persona' },
    shortDesc: 'Supporto domiciliare per anziani e persone non autosufficienti: compagnia, accompagnamento a visite e disbrigo pratiche.',
    longDesc: 'I nostri volontari visitano regolarmente le persone sole o anziane, offrendo compagnia, aiuto nelle commissioni quotidiane e supporto morale. Collaboriamo con i servizi sociali comunali.',
    orario: 'Su appuntamento',
    contatto: '050 000001',
    order: 3,
    language: 'it',
  },
  {
    _id: 'servizio-s04',
    num: 'S/04',
    title: 'Protezione civile · AIB',
    slug: { _type: 'slug', current: 'protezione-civile' },
    shortDesc: 'Gruppo di Antincendio Boschivo certificato e nucleo di Protezione Civile. Interveniamo in emergenze naturali e calamità.',
    longDesc: 'Il nostro nucleo AIB è formato e certificato dalla Regione Toscana. Partecipiamo a esercitazioni periodiche e siamo disponibili su chiamata della Centrale Operativa Regionale per gli interventi di spegnimento.',
    mezzi: 'Ford Ranger AIB attrezzato',
    orario: 'Su attivazione Regionale',
    contatto: 'Centrale Operativa Toscana',
    order: 4,
    language: 'it',
  },
  {
    _id: 'servizio-s05',
    num: 'S/05',
    title: 'Centro di formazione',
    slug: { _type: 'slug', current: 'formazione' },
    shortDesc: 'Corsi BLSD, disostruzione pediatrica e adulti, primo soccorso e antincendio. Istruttori certificati IRC e Regione Toscana.',
    longDesc: 'Organizziamo corsi per aziende, scuole e privati. I corsi BLSD rilasciano la certificazione IRC valida 2 anni. Disponibili anche corsi personalizzati su richiesta.',
    orario: 'Corsi mensili – vedere calendario',
    contatto: 'formazione@misericordiadigello.it',
    order: 5,
    language: 'it',
  },
  {
    _id: 'servizio-s06',
    num: 'S/06',
    title: 'Donazione del sangue',
    slug: { _type: 'slug', current: 'donazione-sangue' },
    shortDesc: 'Gruppo Fratres attivo dal 1990. Le raccolte si tengono il primo sabato di ogni mese presso la sede.',
    longDesc: 'Il gruppo Fratres della Misericordia di Gello organizza raccolte mensili in collaborazione con l\'ospedale di Pistoia. Donare il sangue è un gesto semplice che può salvare molte vite.',
    orario: 'Primo sabato del mese: 7:30–11:00',
    contatto: 'fratres@misericordiadigello.it',
    order: 6,
    language: 'it',
  },
]

for (const s of servizi) {
  tx.createOrReplace({ _type: 'servizio', ...s })
}

// ─── Mezzi ───────────────────────────────────────────────────────────────────
const mezzi = [
  { _id: 'mezzo-a1',  code: 'A1',  name: 'Fiat Ducato',        year: '2019', role: 'Emergenza 118 ALS',    order: 1 },
  { _id: 'mezzo-a2',  code: 'A2',  name: 'Mercedes Sprinter',  year: '2021', role: 'Emergenza 118 ALS',    order: 2 },
  { _id: 'mezzo-a4',  code: 'A4',  name: 'Ford Transit',       year: '2026', role: 'Emergenza · nuovo',    order: 3 },
  { _id: 'mezzo-t1',  code: 'T1',  name: 'Volkswagen Caddy',   year: '2020', role: 'Trasporto disabili',   order: 4 },
  { _id: 'mezzo-aib', code: 'AIB', name: 'Ford Ranger',        year: '2018', role: 'Antincendio boschivo', order: 5 },
  { _id: 'mezzo-s1',  code: 'S1',  name: 'Fiat Panda',         year: '2022', role: 'Servizi sociali',      order: 6 },
]

for (const m of mezzi) {
  tx.createOrReplace({ _type: 'mezzo', ...m })
}

// ─── News / Post ─────────────────────────────────────────────────────────────
tx.createOrReplace({
  _id: 'post-bando-sc-2026',
  _type: 'post',
  language: 'it',
  title: 'Servizio Civile Universale 2026 — bando aperto',
  slug: { _type: 'slug', current: 'servizio-civile-universale-2026' },
  tag: 'Bando',
  date: '2026-05-01',
  excerpt: 'Sono aperte le candidature per il Servizio Civile Universale 2026. La Misericordia di Gello mette a disposizione posti nei propri progetti. Scadenza: 18 giugno 2026.',
  body: [
    {
      _type: 'block',
      _key: 'block-1',
      style: 'normal',
      children: [{ _type: 'span', _key: 'span-1', text: 'La Misericordia di Gello partecipa al bando SCU 2026 con due progetti nelle aree del soccorso e dell\'assistenza sociale. Le candidature sono aperte fino al 18 giugno 2026 alle ore 14:00 sul portale DOL.' }],
    },
  ],
})

tx.createOrReplace({
  _id: 'post-corso-blsd-giugno',
  _type: 'post',
  language: 'it',
  title: 'Corso BLSD — 7 giugno 2026',
  slug: { _type: 'slug', current: 'corso-blsd-giugno-2026' },
  tag: 'Formazione',
  date: '2026-05-10',
  excerpt: 'Nuovo corso BLSD (defibrillazione precoce) per adulti. Certificazione IRC valida 2 anni. Posti limitati, iscrizione obbligatoria.',
  body: [
    {
      _type: 'block',
      _key: 'block-1',
      style: 'normal',
      children: [{ _type: 'span', _key: 'span-1', text: 'Il 7 giugno 2026 si terrà presso la nostra sede un corso BLSD per adulti. La durata è di circa 6 ore. Al termine viene rilasciata la certificazione IRC valida per 2 anni. Per iscriversi contattare la segreteria.' }],
    },
  ],
})

tx.createOrReplace({
  _id: 'post-nuova-ambulanza',
  _type: 'post',
  language: 'it',
  title: 'Nuova ambulanza Ford Transit in servizio',
  slug: { _type: 'slug', current: 'nuova-ambulanza-ford-transit-2026' },
  tag: 'Comunicato',
  date: '2026-04-15',
  excerpt: 'La nostra flotta si rinnova: entra in servizio il Ford Transit A4, la nostra nuova ambulanza di emergenza. Grazie a tutti i donatori e al 5×1000 che lo ha reso possibile.',
  body: [
    {
      _type: 'block',
      _key: 'block-1',
      style: 'normal',
      children: [{ _type: 'span', _key: 'span-1', text: 'Siamo orgogliosi di presentare la nostra nuova ambulanza Ford Transit (codice A4), entrata in servizio il 15 aprile 2026. Il veicolo è stato acquistato grazie alle donazioni dei cittadini e al 5×1000. Grazie a tutti coloro che ci supportano ogni anno.' }],
    },
  ],
})

// ─── Servizio Civile (singleton) ─────────────────────────────────────────────
tx.createOrReplace({
  _id: 'singleton-servizio-civile',
  _type: 'servizioCivile',
  introText: 'Il Servizio Civile è un\'opportunità unica per i giovani tra i 18 e i 28 anni di dedicare un anno alla comunità, acquisendo competenze professionali e umane di grande valore.',
  tipi: [
    {
      _key: 'tipo-scu',
      code: 'SCU',
      label: 'Servizio Civile Universale',
      ente: 'Conferenza Nazionale Volontariato Giustizia (CNVG)',
      durata: '12 mesi',
      eta: '18 – 28 anni',
      impegno: '25 ore settimanali',
      compenso: '€ 507,30 / mese',
      postiTotali: 4,
      scadenza: '2026-06-18',
      scadenzaOra: '14:00',
      portaleCandidatura: 'https://domandaonline.serviziocivile.it',
      progetti: [
        {
          _key: 'progetto-scu-a',
          codice: 'SCU-MGE-26-A',
          titolo: 'Soccorso e assistenza sanitaria',
          posti: 2,
          sede: 'Sede Misericordia di Gello, Via della Misericordia 12 — 56017 Gello (PI)',
          focus: 'Supporto alle attività di emergenza 118, trasporto sanitario ordinario e assistenza domiciliare agli anziani.',
        },
        {
          _key: 'progetto-scu-b',
          codice: 'SCU-MGE-26-B',
          titolo: 'Inclusione e servizi sociali',
          posti: 2,
          sede: 'Sede Misericordia di Gello',
          focus: 'Accompagnamento persone fragili, supporto alle attività sociali e aggregative del territorio.',
        },
      ],
    },
  ],
  steps: [
    { _key: 'step-1', numero: '01', titolo: 'Consulta il bando',        descrizione: 'Leggi i requisiti e scegli il progetto che fa per te.' },
    { _key: 'step-2', numero: '02', titolo: 'Candidati sul portale DOL', descrizione: 'Accedi con SPID e invia la domanda entro la scadenza.' },
    { _key: 'step-3', numero: '03', titolo: 'Colloquio di selezione',    descrizione: 'Incontro con i nostri responsabili per conoscerti.' },
    { _key: 'step-4', numero: '04', titolo: 'Formazione iniziale',       descrizione: 'Periodo formativo obbligatorio prima dell\'avvio.' },
    { _key: 'step-5', numero: '05', titolo: 'Inizio servizio',           descrizione: 'Entri a far parte della nostra squadra per 12 mesi.' },
  ],
  testimonianze: [
    {
      _key: 'test-1',
      nome: 'Sofia, 22 anni',
      anno: 'SCU 2024',
      testo: 'Un\'esperienza che mi ha cambiata. Ho imparato a lavorare in squadra in situazioni di vera emergenza. Consiglio a tutti i giovani di provarci.',
    },
    {
      _key: 'test-2',
      nome: 'Marco, 24 anni',
      anno: 'SCU 2023',
      testo: 'Dopo l\'anno di servizio civile sono rimasto come volontario. È il posto giusto per chi vuole fare qualcosa di concreto per la propria comunità.',
    },
  ],
  faq: [
    { _key: 'faq-1', domanda: 'Chi può partecipare?',               risposta: 'Tutti i giovani tra i 18 e i 28 anni (non compiuti), cittadini italiani o UE o stranieri regolarmente soggiornanti in Italia.' },
    { _key: 'faq-2', domanda: 'Come ci si candida?',                risposta: 'Attraverso il portale DOL (Domanda On Line) accessibile con SPID. La candidatura è gratuita.' },
    { _key: 'faq-3', domanda: 'Si può lavorare o studiare?',        risposta: 'È compatibile con la frequenza universitaria. Non è compatibile con un lavoro dipendente a tempo pieno.' },
    { _key: 'faq-4', domanda: 'Il compenso è tassabile?',          risposta: 'No. Il contributo mensile di € 507,30 è esente da imposte e non si cumula ai fini ISEE.' },
    { _key: 'faq-5', domanda: 'Vale come titolo di studio?',        risposta: 'Alcune università riconoscono il servizio civile come crediti formativi. Vale 12 mesi come esperienza lavorativa nel curriculum.' },
  ],
  seo: {
    metaTitle: 'Servizio Civile — Misericordia di Gello',
    metaDescription: 'Partecipa al Servizio Civile con la Misericordia di Gello. Posti disponibili per SCU 2026. Scopri i progetti e candidati.',
  },
})

// ─── Esegui la transazione ────────────────────────────────────────────────────
console.log('Invio dati a Sanity...')
try {
  const result = await tx.commit()
  console.log(`✓ ${result.results.length} documenti creati/aggiornati`)
} catch (err) {
  console.error('Errore:', err.message)
  process.exit(1)
}
