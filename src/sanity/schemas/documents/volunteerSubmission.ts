import { defineField, defineType } from "sanity";

export default defineType({
  name: "volunteerSubmission",
  title: "Candidatura Volontario",
  type: "document",
  fields: [
    defineField({ name: "nome", title: "Nome", type: "string" }),
    defineField({ name: "cognome", title: "Cognome", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "telefono", title: "Telefono", type: "string" }),
    defineField({
      name: "areeInteresse",
      title: "Aree di interesse",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "disponibilita",
      title: "Disponibilità",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "createdAt",
      title: "Ricevuto il",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "nome", subtitle: "cognome" },
  },
});
