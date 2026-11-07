import {defineField} from 'sanity'

export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'SEO-tittel',
    type: 'string',
    description:
      'Vises i søkeresultater og nettleserfanen. Faller tilbake til tittelen. «| Hubro Digital» legges til automatisk, så hold deg under ca. 45 tegn.',
    validation: (rule) => rule.max(60).warning('Under 60 tegn vises best i Google.'),
    group: 'seo',
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO-beskrivelse',
    type: 'text',
    rows: 3,
    description: 'Teksten under tittelen i Google. Skriv hva siden handler om og hvorfor man bør klikke.',
    validation: (rule) => rule.max(160).warning('Under 160 tegn vises best i Google.'),
    group: 'seo',
  }),
  defineField({
    name: 'seoImage',
    title: 'Delingsbilde',
    type: 'image',
    description:
      'Bildet som vises når siden deles på LinkedIn, Facebook og i meldinger. 1200 × 630 px fungerer best. Uten bilde brukes sidens eget bilde, ellers et standardbilde.',
    options: {hotspot: true},
    group: 'seo',
  }),
  defineField({
    name: 'noIndex',
    title: 'Skjul for søkemotorer',
    type: 'boolean',
    description: 'Slå på hvis siden ikke skal dukke opp i Google. Siden tas også ut av sitemapet.',
    initialValue: false,
    group: 'seo',
  }),
]
