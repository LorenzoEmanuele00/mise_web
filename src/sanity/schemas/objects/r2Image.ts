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
  ],
  preview: {
    select: { title: "altText", subtitle: "src" },
  },
});
