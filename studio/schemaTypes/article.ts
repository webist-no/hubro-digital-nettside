import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {seoFields} from './shared/seoFields'

// Fagartikler: kunnskapsinnhold som viser faglig tyngde og gir søketrafikk.
// Malen på nettsiden (/fagartikler/[slug]) viser ingress, «Kort fortalt», innholdsliste,
// forfatter, relaterte artikler og en avslutning som leder videre til samtale.

export const article = defineType({
  name: 'article',
  title: 'Fagartikkel',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Innhold', default: true},
    {name: 'meta', title: 'Detaljer'},
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
      title: 'Nettadresse',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description: 'Artikkelen ligger på /fagartikler/«nettadresse».',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Ingress',
      type: 'text',
      rows: 3,
      description: 'Vises under tittelen og på kortet i oversikten. 1–3 setninger.',
      validation: (rule) => rule.required().max(300),
      group: 'content',
    }),
    defineField({
      name: 'keyPoints',
      title: 'Kort fortalt',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description:
        'Tre–fem korte punkter som oppsummerer artikkelen. Vises i en egen boks øverst. Gode for leseren og for AI-søk.',
      validation: (rule) => rule.max(6),
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hovedbilde',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativ tekst',
          type: 'string',
          description: 'Beskriv bildet for dem som ikke ser det.',
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Artikkel',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Vanlig tekst', value: 'normal'},
            {title: 'Overskrift', value: 'h2'},
            {title: 'Underoverskrift', value: 'h3'},
            {title: 'Sitat', value: 'blockquote'},
          ],
          lists: [
            {title: 'Punktliste', value: 'bullet'},
            {title: 'Nummerert liste', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Fet', value: 'strong'},
              {title: 'Kursiv', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Lenke',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'Adresse',
                    type: 'url',
                    validation: (rule) =>
                      rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          name: 'bodyImage',
          title: 'Bilde',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alternativ tekst', type: 'string'}),
            defineField({name: 'caption', title: 'Bildetekst', type: 'string'}),
          ],
        }),
        defineArrayMember({
          type: 'object',
          name: 'callout',
          title: 'Utheving (tips, advarsel)',
          fields: [
            defineField({
              name: 'tone',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Tips', value: 'tip'},
                  {title: 'Pass opp', value: 'warning'},
                  {title: 'Merk deg', value: 'note'},
                ],
                layout: 'radio',
              },
              initialValue: 'tip',
            }),
            defineField({name: 'title', title: 'Tittel', type: 'string'}),
            defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'text'},
            prepare: ({title, subtitle}) => ({title: title || 'Utheving', subtitle}),
          },
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'topics',
      title: 'Emner',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      description: 'Brukes til filter i oversikten og til å finne relaterte artikler. Skriv emnene likt hver gang.',
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publisert',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'author',
      title: 'Forfatter',
      type: 'reference',
      to: [{type: 'teamMember'}],
      group: 'meta',
    }),
    defineField({
      name: 'relatedServices',
      title: 'Relaterte tjenester',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
      description: 'Vises nederst i artikkelen, som neste steg for leseren.',
      validation: (rule) => rule.max(3),
      group: 'meta',
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: 'Nyeste først',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt', media: 'heroImage'},
    prepare: ({title, date, media}) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('nb-NO') : 'Ikke datert',
      media,
    }),
  },
})
