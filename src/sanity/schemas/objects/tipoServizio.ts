import { defineField, defineType } from "sanity";

export default defineType({
  name: "tipoServizio",
  title: "Tipo Servizio Civile",
  type: "object",
  fields: [
    defineField({
      name: "code",
      title: "Codice tab (es. SCU)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "label",
      title: "Nome esteso (es. Universale)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "ente", title: "Ente promotore", type: "string" }),
    defineField({
      name: "durata",
      title: "Durata (es. 12 mesi)",
      type: "string",
    }),
    defineField({
      name: "eta",
      title: "Età (es. 18 – 28 anni)",
      type: "string",
    }),
    defineField({
      name: "impegno",
      title: "Impegno settimanale",
      type: "string",
    }),
    defineField({
      name: "compenso",
      title: "Compenso mensile (es. € 507,30)",
      type: "string",
    }),
    defineField({ name: "postiTotali", title: "Posti totali", type: "number" }),
    defineField({
      name: "scadenza",
      title: "Data scadenza bando",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "scadenzaOra",
      title: "Ora scadenza (es. 14:00)",
      type: "string",
    }),
    defineField({
      name: "portaleCandidatura",
      title: "URL portale DOL (candidatura ufficiale)",
      type: "url",
    }),
    defineField({
      name: "progetti",
      title: "Progetti",
      type: "array",
      of: [{ type: "scProgetto" }],
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "scadenza", code: "code" },
    prepare({
      title,
      subtitle,
      code,
    }: {
      title: string;
      subtitle?: string;
      code?: string;
    }) {
      const formattedDate = subtitle
        ? new Date(subtitle).toLocaleDateString("it-IT", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";
      return {
        title: code ? `${code} — ${title}` : title,
        subtitle: formattedDate ? `Scadenza: ${formattedDate}` : "",
      };
    },
  },
});
