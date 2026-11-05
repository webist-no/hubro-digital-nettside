import {defineArrayMember, defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons/Package'

const stringList = (name: string, title: string, group: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [defineArrayMember({type: 'string'})],
    group,
    description,
  })

export const servicePackage = defineType({
  name: 'package',
  title: 'Pakke',
  type: 'document',
  icon: PackageIcon,
  groups: [
    {name: 'card', title: 'Kort', default: true},
    {name: 'detail', title: 'Detaljer'},
    {name: 'pick', title: 'Velg pakke'},
  ],
  fields: [
    defineField({name: 'name', title: 'Navn', type: 'string', group: 'card', validation: (r) => r.required()}),
    defineField({name: 'tier', title: 'Nivå', type: 'string', group: 'card', description: 'F.eks. Start, Grow, Scale.'}),
    defineField({name: 'badge', title: 'Merke', type: 'string', group: 'card', description: 'F.eks. «Mest populær».'}),
    defineField({name: 'tagline', title: 'Tittel på kort', type: 'string', group: 'card'}),
    defineField({name: 'audience', title: 'Kort beskrivelse', type: 'text', rows: 3, group: 'card'}),
    stringList('cardFeatures', 'Punkter på kort', 'card'),
    defineField({name: 'priceFrom', title: 'Pris', type: 'string', group: 'card', description: 'F.eks. «Fra 7 500 kr/mnd».'}),
    defineField({name: 'priceNote', title: 'Prisnotat', type: 'string', group: 'card'}),
    defineField({name: 'order', title: 'Rekkefølge', type: 'number', group: 'card'}),

    defineField({name: 'detailHeading', title: 'Overskrift', type: 'string', group: 'detail'}),
    defineField({name: 'detailIntro', title: 'Ingress', type: 'text', rows: 3, group: 'detail'}),
    stringList('responsibilities', 'Vi tar ansvar for', 'detail'),
    defineField({name: 'youGetIntro', title: 'Innledning til «Du får»', type: 'string', group: 'detail'}),
    defineField({
      name: 'youGet',
      title: 'Du får',
      type: 'array',
      group: 'detail',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'deliverable',
          fields: [
            defineField({name: 'title', title: 'Tittel', type: 'string'}),
            defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        }),
      ],
    }),
    stringList('channels', 'Kanaler inkludert', 'detail'),
    stringList('fitFor', 'Passer for deg som', 'detail'),
    defineField({
      name: 'terms',
      title: 'Priser og detaljer',
      type: 'array',
      group: 'detail',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'term',
          fields: [
            defineField({name: 'label', title: 'Navn', type: 'string'}),
            defineField({name: 'value', title: 'Verdi', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({name: 'priceLine', title: 'Pris (stor)', type: 'string', group: 'detail', description: 'F.eks. «Fra 7 500 kr».'}),
    defineField({name: 'priceSuffix', title: 'Pris (forklaring)', type: 'string', group: 'detail', description: 'F.eks. «per måned, + annonsekost».'}),
    defineField({name: 'ctaHeading', title: 'Knappeboks: tittel', type: 'string', group: 'detail'}),
    defineField({name: 'ctaText', title: 'Knappeboks: tekst', type: 'text', rows: 2, group: 'detail'}),
    defineField({name: 'ctaLabel', title: 'Knappeboks: knapp', type: 'string', group: 'detail'}),

    defineField({name: 'pickLabel', title: 'Knapp', type: 'string', group: 'pick', description: 'F.eks. «Velg Salg».'}),
    defineField({name: 'pickHeading', title: 'Tittel', type: 'string', group: 'pick'}),
    defineField({name: 'pickText', title: 'Tekst', type: 'text', rows: 3, group: 'pick'}),
    stringList('pickBullets', 'Punkter', 'pick'),
  ],
  orderings: [{title: 'Rekkefølge', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'priceFrom'}},
})
