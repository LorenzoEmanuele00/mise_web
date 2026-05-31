import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Pagina",
  type: "document",
  fields: [
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
      validation: (r) => r.required(),
    }),
    defineField({
      name: "language",
      title: "Lingua",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "heroSection",
      title: "Hero",
      type: "heroSection",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
