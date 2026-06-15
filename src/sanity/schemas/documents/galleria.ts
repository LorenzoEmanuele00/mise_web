import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleria",
  title: "Galleria fotografica",
  type: "document",
  fields: [
    defineField({
      name: "intro",
      title: "Testo introduttivo (opzionale)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "images",
      title: "Fotografie",
      type: "array",
      of: [{ type: "r2Image" }],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Galleria fotografica" };
    },
  },
});
