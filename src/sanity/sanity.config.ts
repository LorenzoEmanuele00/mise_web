import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./env";
import { schemaTypes } from "./schemas";

const SINGLETONS = new Set(["settings", "servizioCivile", "galleria"]);
const READONLY = new Set(["contactSubmission", "volunteerSubmission"]);

export default defineConfig({
  name: "misericordia-gello",
  title: "Misericordia di Gello",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenuti")
          .items([
            S.listItem()
              .title("Impostazioni Sito")
              .id("settings")
              .child(
                S.editor()
                  .id("settings")
                  .schemaType("settings")
                  .documentId("settings"),
              ),
            S.listItem()
              .title("Servizio Civile")
              .id("servizioCivile")
              .child(
                S.editor()
                  .id("servizioCivile")
                  .schemaType("servizioCivile")
                  .documentId("singleton-servizio-civile"),
              ),
            S.listItem()
              .title("Galleria fotografica")
              .id("galleria")
              .child(
                S.editor()
                  .id("galleria")
                  .schemaType("galleria")
                  .documentId("singleton-galleria"),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                !SINGLETONS.has(item.getId() ?? "") &&
                !READONLY.has(item.getId() ?? ""),
            ),
            S.divider(),
            S.listItem()
              .title("Messaggi Contatti")
              .child(S.documentTypeList("contactSubmission")),
            S.listItem()
              .title("Candidature Volontari")
              .child(S.documentTypeList("volunteerSubmission")),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
});
