import { defineField, defineType } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      validation: (r) => r.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "r2Image",
    }),
  ],
});
