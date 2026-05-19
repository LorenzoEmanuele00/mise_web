import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './env'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'misericordia-gello',
  title: 'Misericordia di Gello',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
})
