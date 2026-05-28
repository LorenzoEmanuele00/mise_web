import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Impostazioni Sito',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nome sito',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'r2Image',
    }),
    defineField({
      name: 'navigation',
      title: 'Navigazione',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Etichetta', type: 'string' }),
            defineField({ name: 'href', title: 'URL', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Testo footer',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'address',
      title: 'Indirizzo sede',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Telefono centralino',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email info',
      type: 'string',
    }),
    defineField({
      name: 'emailSC',
      title: 'Email Servizio Civile',
      type: 'string',
    }),
    defineField({
      name: 'iban',
      title: 'IBAN donazioni',
      type: 'string',
    }),
    defineField({
      name: 'codiceFiscale',
      title: 'Codice Fiscale (5×1000)',
      type: 'string',
    }),
    defineField({
      name: 'orariSede',
      title: 'Orari sede',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Immagine di sfondo',
      type: 'object',
      description: 'Path immagini su Cloudflare R2 per ogni breakpoint (es. bg-mobile.webp). Lascia vuoto i breakpoint non usati: verrà usata l\'immagine del breakpoint inferiore come fallback.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'mobile',  title: 'Mobile  (< 768 px)',        type: 'string' }),
        defineField({ name: 'tablet',  title: 'Tablet  (768 – 1024 px)',   type: 'string' }),
        defineField({ name: 'desktop', title: 'Desktop (1024 – 1440 px)',  type: 'string' }),
        defineField({ name: 'wide',    title: 'Wide / 4K  (> 1440 px)',    type: 'string' }),
      ],
    }),
  ],
})
