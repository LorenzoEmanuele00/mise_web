import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'timelineEvent',
  title: 'Evento cronologia',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Anno',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'text',
      title: 'Testo',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'year', subtitle: 'title' },
  },
})
