import { defineField, defineType } from "sanity";

export default defineType({
  name: "scProgetto",
  title: "Progetto Servizio Civile",
  type: "object",
  fields: [
    defineField({
      name: "codice",
      title: "Codice progetto (es. SCU-MGE-26-A)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "titolo",
      title: "Titolo progetto",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "posti",
      title: "Numero posti",
      type: "number",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sede",
      title: "Sede di svolgimento",
      type: "string",
    }),
    defineField({
      name: "focus",
      title: "Descrizione attività",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "schedaPdf",
      title: "Scheda progetto (PDF scaricabile)",
      type: "file",
      options: { accept: ".pdf" },
      description: "PDF con i dettagli del progetto scaricabile dai candidati.",
    }),
  ],
  preview: {
    select: { title: "titolo", subtitle: "codice" },
  },
});
