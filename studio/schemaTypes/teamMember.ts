import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Teammedlem',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'role', title: 'Rolle', type: 'string'}),
    defineField({name: 'bio', title: 'Presentasjon', type: 'text', rows: 5}),
    defineField({name: 'email', title: 'E-post', type: 'string'}),
    defineField({name: 'phone', title: 'Telefon', type: 'string'}),
    defineField({
      name: 'photo',
      title: 'Portrett',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternativ tekst', type: 'string'})],
    }),
    defineField({
      name: 'order',
      title: 'Rekkefølge',
      type: 'number',
      description: 'Lavest tall vises først.',
    }),
  ],
  orderings: [{title: 'Rekkefølge', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})
