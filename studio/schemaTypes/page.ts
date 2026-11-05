import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {seoFields} from './shared/seoFields'
import {sectionMembers} from './sections'

const cta = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    group: 'hero',
    fields: [
      defineField({name: 'label', title: 'Tekst', type: 'string'}),
      defineField({name: 'href', title: 'Lenke', type: 'string', description: 'F.eks. /snakk-med-oss'}),
    ],
  })

export const page = defineType({
  name: 'page',
  title: 'Side',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'hero', title: 'Toppseksjon', default: true},
    {name: 'sections', title: 'Seksjoner'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Intern tittel og navn i menyer.',
      validation: (rule) => rule.required(),
      group: 'hero',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Bruk «forside» for forsiden.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
      group: 'hero',
    }),
    defineField({name: 'eyebrow', title: 'Liten overskrift', type: 'string', group: 'hero'}),
    defineField({name: 'heading', title: 'Hovedoverskrift', type: 'string', group: 'hero'}),
    defineField({
      name: 'headingAccent',
      title: 'Utheving',
      type: 'string',
      description: 'Siste del av overskriften, vises i grønn.',
      group: 'hero',
    }),
    defineField({name: 'intro', title: 'Ingress', type: 'text', rows: 3, group: 'hero'}),
    defineField({
      name: 'badges',
      title: 'Merker',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      group: 'hero',
    }),
    cta('primaryCta', 'Hovedknapp'),
    cta('secondaryCta', 'Sekundær lenke'),
    defineField({
      name: 'heroImage',
      title: 'Bilde',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternativ tekst', type: 'string'})],
      group: 'hero',
    }),
    defineField({
      name: 'sections',
      title: 'Seksjoner',
      type: 'array',
      of: sectionMembers,
      group: 'sections',
    }),
    ...seoFields,
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})
