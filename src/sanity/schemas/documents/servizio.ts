import { defineField, defineType } from "sanity";

export default defineType({
  name: "servizio",
  title: "Servizio",
  type: "document",
  fields: [
    defineField({
      name: "num",
      title: "Codice (es. S/01)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "language",
      title: "Lingua",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "shortDesc",
      title: "Descrizione breve (accordion chiuso)",
      type: "text",
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "longDesc",
      title: "Descrizione completa (accordion aperto)",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "mezzi",
      title: "Mezzi impiegati",
      type: "string",
    }),
    defineField({
      name: "orario",
      title: "Orario / disponibilità",
      type: "string",
    }),
    defineField({
      name: "contatto",
      title: "Numero / email / riferimento",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Ordine visualizzazione",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "num", subtitle: "title" },
  },
});
