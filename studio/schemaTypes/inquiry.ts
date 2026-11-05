import {defineArrayMember, defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

// Henvendelser fra kontaktskjemaet på nettsiden. Opprettes av nettsiden, ikke i Studio:
// innholdet er skrivebeskyttet, bare «Status» kan endres.
export const inquiry = defineType({
  name: 'inquiry',
  title: 'Henvendelse',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          {title: 'Ny', value: 'new'},
          {title: 'Besvart', value: 'answered'},
          {title: 'Ikke aktuell', value: 'closed'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'name', title: 'Navn', type: 'string', readOnly: true}),
    defineField({name: 'email', title: 'E-post', type: 'string', readOnly: true}),
    defineField({name: 'phone', title: 'Telefon', type: 'string', readOnly: true}),
    defineField({name: 'company', title: 'Selskap eller nettside', type: 'string', readOnly: true}),
    defineField({
      name: 'contactPreference',
      title: 'Ønsket kontaktmåte',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'topics',
      title: 'Ønsker hjelp til',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      readOnly: true,
    }),
    defineField({name: 'message', title: 'Melding', type: 'text', rows: 6, readOnly: true}),
    defineField({name: 'page', title: 'Sendt fra', type: 'string', readOnly: true}),
    defineField({name: 'createdAt', title: 'Mottatt', type: 'datetime', readOnly: true}),
  ],
  orderings: [
    {title: 'Nyeste først', name: 'createdAtDesc', by: [{field: 'createdAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'name', email: 'email', createdAt: 'createdAt', status: 'status'},
    prepare: ({title, email, createdAt, status}) => ({
      title: title || 'Uten navn',
      subtitle: [
        status === 'new' ? 'Ny' : status === 'answered' ? 'Besvart' : status === 'closed' ? 'Ikke aktuell' : '',
        email,
        createdAt ? new Date(createdAt).toLocaleDateString('nb-NO') : '',
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
