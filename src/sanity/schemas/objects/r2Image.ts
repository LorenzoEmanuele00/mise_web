import { defineField, defineType } from "sanity";

export default defineType({
  name: "r2Image",
  title: "Immagine R2",
  type: "object",
  fields: [
    defineField({
      name: "src",
      title: "Path immagine (es. logo.svg, mezzi/ducato.webp)",
      type: "string",
      description:
        "Path relativo al bucket R2 — solo il nome file o sottocartella/file.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "altText",
      title: "Testo alternativo (alt)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "width",
      title: "Larghezza in pixel (facoltativa)",
      type: "number",
      description:
        "Se compilata insieme all'altezza, evita che la pagina \"salti\" mentre l'immagine si carica.",
      validation: (r) => r.integer().positive(),
    }),
    defineField({
      name: "height",
      title: "Altezza in pixel (facoltativa)",
      type: "number",
      validation: (r) => r.integer().positive(),
    }),
  ],
  preview: {
    select: { title: "altText", subtitle: "src" },
  },
});
