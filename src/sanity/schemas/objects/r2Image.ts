import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'r2Image',
  title: 'Immagine R2',
  type: 'object',
  fields: [
    defineField({
      name: 'src',
      title: 'URL immagine (Cloudflare R2)',
      type: 'url',
      validation: (r) => r.required().uri({ scheme: ['https', 'http'] }),
    }),
    defineField({
      name: 'altText',
      title: 'Testo alternativo (alt)',
      type: 'string',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'altText', subtitle: 'src' },
  },
})
