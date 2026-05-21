import { groq } from 'next-sanity'

export const SETTINGS_QUERY = groq`
  *[_type == "settings"][0] {
    siteName, logo, navigation, footerText,
    address, phone, email, emailSC, iban, codiceFiscale, orariSede
  }
`

export const PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug && language == $lang][0] {
    title, slug, language, seo, heroSection
  }
`

export const ALL_POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] { "slug": slug.current }
`

export const POSTS_QUERY = groq`
  *[_type == "post" && language == $lang] | order(date desc) {
    _id, title, slug, tag, date, excerpt, cover
  }
`

export const POST_QUERY = groq`
  *[_type == "post" && slug.current == $slug && language == $lang][0] {
    title, slug, tag, date, excerpt, cover, body, seo
  }
`

export const SERVIZI_QUERY = groq`
  *[_type == "servizio" && language == $lang] | order(order asc) {
    _id, num, title, slug, shortDesc, longDesc, mezzi, orario, contatto
  }
`

export const ALL_SERVIZI_SLUGS_QUERY = groq`
  *[_type == "servizio" && defined(slug.current)] { "slug": slug.current }
`

export const SERVIZIO_QUERY = groq`
  *[_type == "servizio" && slug.current == $slug][0] {
    _id, num, title, slug, shortDesc, longDesc, mezzi, orario, contatto, seo
  }
`

export const MEZZI_QUERY = groq`
  *[_type == "mezzo"] | order(order asc) {
    _id, code, name, year, role, photo
  }
`

export const SERVIZIO_CIVILE_QUERY = groq`
  *[_type == "servizioCivile" && _id == "singleton-servizio-civile"][0] {
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

export const HOME_QUERY = groq`
  {
    "page":    *[_type == "page" && slug.current == "home" && language == $lang][0] { title, heroSection, seo },
    "servizi": *[_type == "servizio" && language == $lang] | order(order asc)[0..5] { _id, num, title, shortDesc, slug },
    "news":    *[_type == "post" && language == $lang] | order(date desc)[0..2] { _id, title, slug, tag, date, excerpt, cover }
  }
`
