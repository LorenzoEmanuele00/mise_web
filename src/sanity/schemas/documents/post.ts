import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Articolo News',
  type: 'document',
  orderings: [
    {
      name: 'dateDesc',
      title: 'Data (recente)',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'language',
      title: 'Lingua',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      options: {
        list: [
          { title: 'Comunicato', value: 'Comunicato' },
          { title: 'Bando', value: 'Bando' },
          { title: 'Formazione', value: 'Formazione' },
          { title: 'Eventi', value: 'Eventi' },
        ],
      },
    }),
    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Estratto',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Immagine di copertina',
      type: 'r2Image',
    }),
    defineField({
      name: 'body',
      title: 'Corpo',
      type: 'array',
      of: [{ type: 'block' }, { type: 'r2Image' }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'date' },
  },
})
