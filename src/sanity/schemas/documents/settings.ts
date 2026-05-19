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
      type: 'image',
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
  ],
})
