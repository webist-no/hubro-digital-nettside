import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Kundeuttalelse',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Sitat',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Navn',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'role', title: 'Rolle', type: 'string'}),
    defineField({name: 'company', title: 'Selskap', type: 'string'}),
    defineField({
      name: 'logo',
      title: 'Selskapets logo',
      type: 'image',
      description: 'Helst hvit eller ensfarget logo på gjennomsiktig bakgrunn.',
    }),
    defineField({
      name: 'featured',
      title: 'Fremhevet',
      type: 'boolean',
      description: 'Vises stort øverst i kundeuttalelser. Bare én bør fremheves per seksjon.',
      initialValue: false,
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
    select: {title: 'author', subtitle: 'company'},
  },
})
