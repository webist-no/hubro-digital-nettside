import {defineArrayMember, defineField, defineType} from 'sanity'
import {TrendUpwardIcon} from '@sanity/icons/TrendUpward'
import {seoFields} from './shared/seoFields'

const metricFields = [
  defineField({name: 'value', title: 'Verdi', type: 'string', description: 'F.eks. «+240%».'}),
  defineField({name: 'label', title: 'Forklaring', type: 'string'}),
]

export const caseStudy = defineType({
  name: 'case',
  title: 'Case',
  type: 'document',
  icon: TrendUpwardIcon,
  groups: [
    {name: 'content', title: 'Innhold', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'client', title: 'Kunde', type: 'string', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Tittel', type: 'string', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'subtitle', title: 'Undertittel', type: 'string', group: 'content'}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({name: 'summary', title: 'Sammendrag', type: 'text', rows: 4, group: 'content', validation: (r) => r.required()}),
    defineField({
      name: 'tags',
      title: 'Tagger',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      group: 'content',
    }),
    defineField({
      name: 'metrics',
      title: 'Nøkkeltall',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metric',
          fields: metricFields,
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'facts',
      title: 'Fakta',
      type: 'array',
      group: 'content',
      description: 'F.eks. Kunde, Bransje, Samarbeid.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'fact',
          fields: [
            defineField({name: 'label', title: 'Navn', type: 'string'}),
            defineField({name: 'value', title: 'Verdi', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Innhold',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      group: 'content',
    }),
    defineField({
      name: 'quote',
      title: 'Sitat',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3}),
        defineField({name: 'author', title: 'Navn', type: 'string'}),
        defineField({name: 'role', title: 'Rolle', type: 'string'}),
      ],
    }),
    defineField({name: 'order', title: 'Rekkefølge', type: 'number', group: 'content'}),
    ...seoFields,
  ],
  orderings: [{title: 'Rekkefølge', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'client'}},
})
