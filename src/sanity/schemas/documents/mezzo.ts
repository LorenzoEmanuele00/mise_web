import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mezzo',
  title: 'Mezzo',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Codice (es. A1)',
      type: 'string',
    }),
    defineField({
      name: 'name',
      title: 'Modello (es. Fiat Ducato)',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Anno immatricolazione',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Ruolo / utilizzo',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'r2Image',
    }),
    defineField({
      name: 'order',
      title: 'Ordine visualizzazione',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'code', subtitle: 'name' },
  },
})
