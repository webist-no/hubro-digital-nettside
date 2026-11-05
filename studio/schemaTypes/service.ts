import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {sectionMembers} from './sections'
import {seoFields} from './shared/seoFields'

export const service = defineType({
  name: 'service',
  title: 'Tjeneste',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'content', title: 'Toppseksjon', default: true},
    {name: 'sections', title: 'Seksjoner'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'summary',
      title: 'Sammendrag',
      type: 'text',
      rows: 3,
      description: 'Kort tekst som vises i oversikter og på forsiden.',
      validation: (rule) => rule.required().max(240),
      group: 'content',
    }),
    defineField({
      name: 'bullets',
      title: 'Punkter',
      type: 'array',
      description: 'Korte punkter som vises på tjenestekortet og tjenestesiden.',
      of: [defineArrayMember({type: 'string'})],
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativ tekst',
          type: 'string',
          description: 'Beskriver bildet for skjermlesere og søkemotorer.',
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Innhold',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Seksjoner',
      type: 'array',
      description: 'Bygger resten av tjenestesiden: fordeler, bilder, steg, spørsmål og oppfordring.',
      of: sectionMembers,
      group: 'sections',
    }),
    defineField({
      name: 'order',
      title: 'Rekkefølge',
      type: 'number',
      description: 'Lavest tall vises først. Tjenester uten tall havner sist.',
      group: 'content',
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: 'Rekkefølge',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'summary', media: 'image'},
  },
})
