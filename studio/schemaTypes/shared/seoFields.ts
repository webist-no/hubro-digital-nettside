import {defineField} from 'sanity'

export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'SEO-tittel',
    type: 'string',
    description: 'Vises i søkeresultater og nettleserfanen. Faller tilbake til tittelen.',
    validation: (rule) => rule.max(60).warning('Under 60 tegn vises best i Google.'),
    group: 'seo',
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO-beskrivelse',
    type: 'text',
    rows: 3,
    validation: (rule) => rule.max(160).warning('Under 160 tegn vises best i Google.'),
    group: 'seo',
  }),
]
