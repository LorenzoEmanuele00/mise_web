import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker (label sopra il titolo)',
      type: 'string',
    }),
    defineField({
      name: 'headingPre',
      title: 'Testo prima della parola in evidenza',
      type: 'string',
    }),
    defineField({
      name: 'headingEm',
      title: 'Parola in evidenza (italic accent)',
      type: 'string',
    }),
    defineField({
      name: 'headingPost',
      title: 'Testo dopo la parola in evidenza',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Paragrafo introduttivo',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ctaPrimary',
      title: 'CTA primario',
      type: 'object',
      fields: [
        defineField({ name: 'label', type: 'string', title: 'Etichetta' }),
        defineField({ name: 'href', type: 'string', title: 'URL' }),
      ],
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'CTA secondario',
      type: 'object',
      fields: [
        defineField({ name: 'label', type: 'string', title: 'Etichetta' }),
        defineField({ name: 'href', type: 'string', title: 'URL' }),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Foto volontari',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
