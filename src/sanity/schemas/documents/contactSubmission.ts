import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactSubmission',
  title: 'Messaggio Contatti',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'oggetto', title: 'Oggetto', type: 'string' }),
    defineField({ name: 'messaggio', title: 'Messaggio', type: 'text' }),
    defineField({ name: 'createdAt', title: 'Ricevuto il', type: 'datetime', readOnly: true }),
    defineField({ name: 'ip', title: 'IP', type: 'string', hidden: true }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'createdAt' },
  },
})
