import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

// Singleton: ett dokument med ID «siteSettings» (se structure.ts).
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Nettstedinnstillinger',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'tagline',
      title: 'Kort beskrivelse (bunnfelt)',
      type: 'text',
      rows: 3,
    }),
    defineField({name: 'phone', title: 'Telefon', type: 'string'}),
    defineField({name: 'email', title: 'E-post', type: 'string'}),
    defineField({
      name: 'offices',
      title: 'Kontorer',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'office',
          fields: [
            defineField({name: 'city', title: 'By', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'street', title: 'Gateadresse', type: 'string'}),
            defineField({name: 'postalCode', title: 'Postnummer og sted', type: 'string'}),
          ],
          preview: {select: {title: 'city', subtitle: 'street'}},
        }),
      ],
    }),
    defineField({name: 'linkedin', title: 'LinkedIn-lenke', type: 'url'}),
    defineField({name: 'facebook', title: 'Facebook-lenke', type: 'url'}),
    defineField({
      name: 'clients',
      title: 'Kunder',
      type: 'array',
      description:
        'Vises i kundefeltet. Legg inn logo (helst hvit, på gjennomsiktig bakgrunn) – uten logo vises navnet som tekst.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'client',
          title: 'Kunde',
          fields: [
            defineField({name: 'name', title: 'Navn', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'logo', title: 'Logo', type: 'image'}),
          ],
          preview: {select: {title: 'name', media: 'logo'}},
        }),
      ],
    }),
    defineField({
      name: 'bannerImage',
      title: 'Bannerbilde (forside)',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternativ tekst', type: 'string'})],
    }),
    defineField({
      name: 'aboutImage',
      title: 'Bilde på «Om Hubro»',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternativ tekst', type: 'string'})],
    }),
  ],
  preview: {prepare: () => ({title: 'Nettstedinnstillinger'})},
})
