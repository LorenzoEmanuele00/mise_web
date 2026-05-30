import { defineField, defineType } from "sanity";

export default defineType({
  name: "scTestimonianza",
  title: "Testimonianza",
  type: "object",
  fields: [
    defineField({
      name: "nome",
      title: "Nome e età (es. Sofia, 22)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "anno",
      title: "Anno servizio (es. SCU 2024)",
      type: "string",
    }),
    defineField({
      name: "foto",
      title: "Foto",
      type: "r2Image",
    }),
    defineField({
      name: "testo",
      title: "Citazione (senza virgolette)",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "nome", subtitle: "anno" },
  },
});
