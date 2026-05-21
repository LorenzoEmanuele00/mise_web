import type { SanityImageSource } from '@sanity/image-url'

// ─── Shared object types ─────────────────────────────────────────────────────

export interface SeoObject {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImageSource
}

export interface HeroSection {
  kicker?: string
  headingPre?: string
  headingEm?: string
  headingPost?: string
  body?: string
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
}

export interface TimelineEvent {
  year: string
  title: string
  text?: string
}

export interface NavItem {
  label: string
  href: string
}

// ─── Servizio Civile object types ─────────────────────────────────────────────

export interface ScProgetto {
  codice: string
  titolo: string
  posti: number
  sede?: string
  focus?: string
  schedaPdfUrl?: string
}

export interface TipoServizio {
  code: string
  label: string
  ente?: string
  durata?: string
  eta?: string
  impegno?: string
  compenso?: string
  postiTotali?: number
  scadenza: string
  scadenzaOra?: string
  portaleCandidatura?: string
  progetti?: ScProgetto[]
}

export interface ScStep {
  numero?: string
  titolo: string
  descrizione?: string
}

export interface ScTestimonianza {
  nome: string
  anno?: string
  foto?: SanityImageSource
  testo: string
}

export interface ScFaq {
  domanda: string
  risposta: string
}

// ─── Document types ───────────────────────────────────────────────────────────

export interface Page {
  _id: string
  _type: 'page'
  title: string
  slug: { current: string }
  language?: string
  seo?: SeoObject
  heroSection?: HeroSection
}

export interface Post {
  _id: string
  _type: 'post'
  title: string
  slug: { current: string }
  language?: string
  tag?: 'Comunicato' | 'Bando' | 'Formazione' | 'Eventi'
  date: string
  excerpt: string
  cover?: SanityImageSource
  body?: unknown[]
  seo?: SeoObject
}

export interface Servizio {
  _id: string
  _type: 'servizio'
  num: string
  title: string
  slug?: { current: string }
  language?: string
  shortDesc: string
  longDesc?: string
  mezzi?: string
  orario?: string
  contatto?: string
  order?: number
}

export interface Mezzo {
  _id: string
  _type: 'mezzo'
  code?: string
  name?: string
  year?: string
  role?: string
  photo?: SanityImageSource
  order?: number
}

export interface Settings {
  _id: string
  _type: 'settings'
  siteName?: string
  logo?: SanityImageSource
  navigation?: NavItem[]
  footerText?: string
  address?: string
  phone?: string
  email?: string
  emailSC?: string
  iban?: string
  codiceFiscale?: string
  orariSede?: string
}

export interface ServizioCivile {
  _id: string
  _type: 'servizioCivile'
  introText?: string
  tipi?: TipoServizio[]
  steps?: ScStep[]
  testimonianze?: ScTestimonianza[]
  faq?: ScFaq[]
  seo?: SeoObject
}

export interface ContactSubmission {
  _id: string
  _type: 'contactSubmission'
  nome?: string
  email?: string
  oggetto?: string
  messaggio?: string
  createdAt?: string
}

export interface VolunteerSubmission {
  _id: string
  _type: 'volunteerSubmission'
  nome?: string
  cognome?: string
  email?: string
  telefono?: string
  areeInteresse?: string[]
  disponibilita?: string
  createdAt?: string
}

// ─── GROQ query result shapes ─────────────────────────────────────────────────

export interface PostListItem {
  _id: string
  title: string
  slug: { current: string }
  tag?: Post['tag']
  date: string
  excerpt: string
  cover?: SanityImageSource
}

export interface ServizioListItem {
  _id: string
  num: string
  title: string
  slug?: { current: string }
  shortDesc: string
  longDesc?: string
  mezzi?: string
  orario?: string
  contatto?: string
}

export interface MezzoListItem {
  _id: string
  code?: string
  name?: string
  year?: string
  role?: string
  photo?: SanityImageSource
}

export interface HomeData {
  page: Pick<Page, 'title' | 'heroSection' | 'seo'> | null
  servizi: Pick<ServizioListItem, '_id' | 'num' | 'title' | 'shortDesc' | 'slug'>[]
  news: PostListItem[]
}
