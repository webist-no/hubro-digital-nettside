import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

// Forteller Studio hvilken side på nettstedet hvert dokument vises på.
// Brukes av Presentation-verktøyet til «Brukes på»-lenker og til å hoppe
// til riktig side når du åpner et dokument.
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => {
        if (!doc?.slug) return null
        // Forsiden har slug «forside», men ligger på «/».
        const href = doc.slug === 'forside' ? '/' : `/${doc.slug}`
        return {locations: [{title: doc.title || 'Uten tittel', href}]}
      },
    }),
    service: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                {title: doc.title || 'Uten tittel', href: `/tjenester/${doc.slug}`},
                {title: 'Alle tjenester', href: '/tjenester'},
              ],
            }
          : null,
    }),
    article: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                {title: doc.title || 'Uten tittel', href: `/fagartikler/${doc.slug}`},
                {title: 'Alle fagartikler', href: '/fagartikler'},
              ],
            }
          : null,
    }),
    case: defineLocations({
      select: {title: 'client', slug: 'slug.current'},
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                {title: doc.title || 'Uten tittel', href: `/case/${doc.slug}`},
                {title: 'Alle case', href: '/resultater'},
              ],
            }
          : null,
    }),
  },
}
