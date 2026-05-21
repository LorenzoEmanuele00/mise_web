import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'scFaq',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'domanda',
      title: 'Domanda',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'risposta',
      title: 'Risposta',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'domanda' },
  },
})
