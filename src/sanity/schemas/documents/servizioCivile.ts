import { defineField, defineType } from "sanity";

export default defineType({
  name: "servizioCivile",
  title: "Servizio Civile",
  type: "document",
  preview: {
    select: { intro: "introText" },
    prepare({ intro }: { intro?: string }) {
      return {
        title: "Servizio Civile",
        subtitle: intro
          ? intro.slice(0, 80) + (intro.length > 80 ? "…" : "")
          : "Pagina singleton",
      };
    },
  },
  fields: [
    defineField({
      name: "introText",
      title: "Testo introduttivo hero",
      type: "text",
      rows: 3,
      description: "Il paragrafo sotto il titolo principale della pagina.",
    }),
    defineField({
      name: "tipi",
      title: "Tipi di Servizio Civile (SCU + SCR)",
      type: "array",
      of: [{ type: "tipoServizio" }],
      validation: (r) => r.min(1).max(3),
    }),
    defineField({
      name: "steps",
      title: "Come funziona — step",
      type: "array",
      of: [{ type: "scStep" }],
      validation: (r) => r.min(1).max(10),
    }),
    defineField({
      name: "testimonianze",
      title: "Testimonianze",
      type: "array",
      of: [{ type: "scTestimonianza" }],
    }),
    defineField({
      name: "faq",
      title: "Domande frequenti",
      type: "array",
      of: [{ type: "scFaq" }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});
