import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {resolve} from './presentation/resolve'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

// Sanity erstatter process.env.SANITY_STUDIO_* når Studio bygges.
declare const process: {env: Record<string, string | undefined>}

export default defineConfig({
  name: 'default',
  title: 'Hubro Digital nettside',

  projectId: 'qv34pyof',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    // Visuell redigering: nettsiden vises ved siden av feltene, og du kan klikke
    // på tekst og bilder for å redigere dem. Sett SANITY_STUDIO_PREVIEW_URL til
    // adressen til den publiserte nettsiden når Studio ligger på nett.
    presentationTool({
      resolve,
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Henvendelser inneholder personopplysninger og ligger som utkast, siden
    // datasettet er offentlig. De skal aldri publiseres (publiserte dokumenter
    // kan leses av alle), så Publiser og Dupliser fjernes for denne typen.
    actions: (prev, {schemaType}) =>
      schemaType === 'inquiry'
        ? prev.filter(({action}) => action !== 'publish' && action !== 'duplicate')
        : prev,
    // Singleton skal ikke kunne opprettes flere ganger.
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter(
            // Singleton og henvendelser opprettes ikke manuelt i Studio.
            (template) => !['siteSettings', 'inquiry'].includes(template.templateId),
          )
        : prev,
  },
})
