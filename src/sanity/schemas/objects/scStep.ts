import { defineField, defineType } from "sanity";

export default defineType({
  name: "scStep",
  title: "Step Come Funziona",
  type: "object",
  fields: [
    defineField({
      name: "numero",
      title: "Numero (es. 01)",
      type: "string",
    }),
    defineField({
      name: "titolo",
      title: "Titolo",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descrizione",
      title: "Descrizione",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "numero", subtitle: "titolo" },
  },
});
