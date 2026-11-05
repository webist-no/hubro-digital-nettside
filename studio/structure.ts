import {EnvelopeIcon} from '@sanity/icons/Envelope'
import type {StructureResolver} from 'sanity/structure'

// Dokumenttyper som har egne plasser i menyen, og derfor ikke i den automatiske listen.
const customItems = ['siteSettings', 'inquiry']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Innhold')
    .items([
      // Nettstedinnstillinger vises som ett enkelt dokument, ikke som en liste.
      S.listItem()
        .title('Nettstedinnstillinger')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      // Henvendelser fra kontaktskjemaet, nyeste først.
      S.listItem()
        .title('Henvendelser')
        .id('inquiries')
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList('inquiry')
            .title('Henvendelser')
            .defaultOrdering([{field: 'createdAt', direction: 'desc'}]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !customItems.includes(item.getId() ?? '')),
    ])
