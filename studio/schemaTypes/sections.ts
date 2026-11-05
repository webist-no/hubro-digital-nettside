import {defineArrayMember, defineField, defineType, type FieldDefinition} from 'sanity'

// Seksjoner som kan settes sammen på en Side (sidebygger).
// Data > presentasjon: hver seksjon beskriver innhold, ikke utseende.

const heading = defineField({name: 'heading', title: 'Overskrift', type: 'string'})
const intro = defineField({name: 'intro', title: 'Ingress', type: 'text', rows: 3})

function section(name: string, title: string, fields: FieldDefinition[]) {
  return defineType({
    name,
    title,
    type: 'object',
    fields,
    preview: {
      select: {heading: 'heading'},
      prepare: ({heading: h}) => ({title: h || title, subtitle: title}),
    },
  })
}

const textItem = (name: string, fields: FieldDefinition[], previewTitle = 'title', previewSubtitle = 'text') =>
  defineArrayMember({
    type: 'object',
    name,
    fields,
    preview: {select: {title: previewTitle, subtitle: previewSubtitle}},
  })

const titleText = [
  defineField({name: 'title', title: 'Tittel', type: 'string'}),
  defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3}),
]

export const textSection = section('textSection', 'Tekst', [
  heading,
  defineField({name: 'body', title: 'Innhold', type: 'array', of: [defineArrayMember({type: 'block'})]}),
])

export const serviceCardsSection = section('serviceCardsSection', 'Tjenestekort', [
  heading,
  intro,
  defineField({
    name: 'variant',
    title: 'Visning',
    type: 'string',
    initialValue: 'cards',
    options: {
      list: [
        {title: 'Kort med bilde', value: 'cards'},
        {title: 'Lenkeliste', value: 'list'},
      ],
      layout: 'radio',
    },
  }),
  defineField({
    name: 'services',
    title: 'Tjenester',
    type: 'array',
    of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
  }),
])

export const statsSection = section('statsSection', 'Nøkkeltall', [
  heading,
  defineField({
    name: 'items',
    title: 'Tall',
    type: 'array',
    of: [
      textItem(
        'stat',
        [
          defineField({name: 'value', title: 'Verdi', type: 'string'}),
          defineField({name: 'label', title: 'Forklaring', type: 'string'}),
        ],
        'value',
        'label',
      ),
    ],
  }),
])

export const packagesSection = section('packagesSection', 'Pakker', [
  heading,
  intro,
  defineField({
    name: 'variant',
    title: 'Visning',
    type: 'string',
    initialValue: 'teaser',
    options: {
      list: [
        {title: 'Kort med pris', value: 'teaser'},
        {title: 'Detaljert per pakke', value: 'detailed'},
        {title: 'Velg pakke på 30 sekunder', value: 'picker'},
      ],
      layout: 'radio',
    },
  }),
  defineField({
    name: 'packages',
    title: 'Pakker',
    type: 'array',
    of: [defineArrayMember({type: 'reference', to: [{type: 'package'}]})],
  }),
  defineField({
    name: 'note',
    title: 'Merknad',
    type: 'text',
    rows: 3,
    description: 'Vises under pakkene, f.eks. om annonsekost.',
  }),
])

export const stepsSection = section('stepsSection', 'Nummererte steg', [
  heading,
  intro,
  defineField({name: 'steps', title: 'Steg', type: 'array', of: [textItem('step', titleText)]}),
])

export const phasesSection = section('phasesSection', 'Faser', [
  heading,
  defineField({
    name: 'phases',
    title: 'Faser',
    type: 'array',
    of: [
      textItem(
        'phase',
        [
          defineField({name: 'label', title: 'Merke', type: 'string', description: 'F.eks. «Fase 1: Kartlegging».'}),
          defineField({name: 'title', title: 'Tittel', type: 'string'}),
          defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3}),
          defineField({
            name: 'items',
            title: 'Punkter',
            type: 'array',
            of: [textItem('phaseItem', [
              defineField({name: 'title', title: 'Navn', type: 'string'}),
              defineField({name: 'text', title: 'Forklaring', type: 'string'}),
            ])],
          }),
        ],
        'title',
        'label',
      ),
    ],
  }),
])

export const timelineSection = section('timelineSection', 'Tidslinje', [
  heading,
  intro,
  defineField({
    name: 'items',
    title: 'Perioder',
    type: 'array',
    of: [
      textItem('period', [
        defineField({name: 'period', title: 'Periode', type: 'string'}),
        ...titleText,
      ]),
    ],
  }),
])

export const principlesSection = section('principlesSection', 'Prinsipper', [
  heading,
  intro,
  defineField({name: 'items', title: 'Prinsipper', type: 'array', of: [textItem('principle', titleText)]}),
])

export const testimonialsSection = section('testimonialsSection', 'Kundeuttalelser', [
  heading,
  defineField({
    name: 'testimonials',
    title: 'Uttalelser',
    type: 'array',
    of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
  }),
])

export const casesSection = section('casesSection', 'Case', [
  heading,
  intro,
  defineField({
    name: 'cases',
    title: 'Case',
    type: 'array',
    of: [defineArrayMember({type: 'reference', to: [{type: 'case'}]})],
  }),
])

export const clientsSection = section('clientsSection', 'Kundefelt', [heading])

export const faqSection = section('faqSection', 'Vanlige spørsmål', [
  heading,
  defineField({
    name: 'items',
    title: 'Spørsmål',
    type: 'array',
    of: [
      textItem(
        'faq',
        [
          defineField({name: 'question', title: 'Spørsmål', type: 'string'}),
          defineField({name: 'answer', title: 'Svar', type: 'text', rows: 5}),
        ],
        'question',
        'answer',
      ),
    ],
  }),
])

export const contactSection = section('contactSection', 'Kontakt', [
  heading,
  intro,
  defineField({
    name: 'email',
    title: 'E-post',
    type: 'string',
    description: 'Overstyrer e-posten i nettstedinnstillingene på denne siden.',
  }),
  defineField({name: 'buttonLabel', title: 'Knapp', type: 'string'}),
])

// Kontaktskjema med forklaring, fordeler og kontaktinfo ved siden av.
// Selve henvendelsene lagres som «Henvendelse»-dokumenter.
export const contactFormSection = section('contactFormSection', 'Kontaktskjema', [
  heading,
  intro,
  defineField({name: 'benefitsTitle', title: 'Tittel over fordeler', type: 'string'}),
  defineField({
    name: 'benefits',
    title: 'Dette får du',
    type: 'array',
    description: 'Korte punkter som viser hva kunden får ut av å ta kontakt.',
    of: [defineArrayMember({type: 'string'})],
  }),
  defineField({
    name: 'topics',
    title: 'Hva vil du ha hjelp til? (valg)',
    type: 'array',
    description: 'Vises som valg i skjemaet.',
    of: [defineArrayMember({type: 'string'})],
  }),
  defineField({name: 'submitLabel', title: 'Knapp', type: 'string', initialValue: 'Send forespørsel'}),
  defineField({name: 'successTitle', title: 'Takk-tittel', type: 'string'}),
  defineField({name: 'successText', title: 'Takk-tekst', type: 'text', rows: 3}),
  defineField({
    name: 'showPeople',
    title: 'Vis teamet («De du snakker med»)',
    type: 'boolean',
    initialValue: true,
  }),
])

export const ctaSection = section('ctaSection', 'Oppfordring', [
  heading,
  intro,
  defineField({
    name: 'tone',
    title: 'Farge',
    type: 'string',
    initialValue: 'dark',
    options: {
      list: [
        {title: 'Mørk', value: 'dark'},
        {title: 'Lime', value: 'lime'},
      ],
      layout: 'radio',
    },
  }),
  defineField({
    name: 'checklist',
    title: 'Sjekkliste',
    type: 'array',
    description: 'Korte spørsmål eller punkter som vises med hake (best på limefarget felt).',
    of: [defineArrayMember({type: 'string'})],
  }),
  defineField({name: 'buttonLabel', title: 'Knapp', type: 'string'}),
  defineField({name: 'buttonHref', title: 'Lenke', type: 'string', description: 'F.eks. /snakk-med-oss'}),
])

// Tekst og bilde side om side (Vivamedias «Varför …»-seksjon).
export const splitSection = section('splitSection', 'Tekst og bilde', [
  heading,
  defineField({name: 'body', title: 'Innhold', type: 'array', of: [defineArrayMember({type: 'block'})]}),
  defineField({
    name: 'image',
    title: 'Bilde',
    type: 'image',
    options: {hotspot: true},
    fields: [defineField({name: 'alt', title: 'Alternativ tekst', type: 'string'})],
  }),
  defineField({
    name: 'imageSide',
    title: 'Bildeplassering',
    type: 'string',
    initialValue: 'right',
    options: {
      list: [
        {title: 'Høyre', value: 'right'},
        {title: 'Venstre', value: 'left'},
      ],
      layout: 'radio',
    },
  }),
  defineField({name: 'buttonLabel', title: 'Knapp', type: 'string'}),
  defineField({name: 'buttonHref', title: 'Lenke', type: 'string'}),
])

// Fordeler i rutenett med linjer over (Vivamedias tre-kolonners fordelsgrid).
export const benefitsSection = section('benefitsSection', 'Fordeler', [
  heading,
  intro,
  defineField({name: 'items', title: 'Fordeler', type: 'array', of: [textItem('benefit', titleText)]}),
])

// Store titler med limemarkering og forklaring (Vivamedias «effekt»-seksjon).
export const highlightsSection = section('highlightsSection', 'Utheving (limemarkert)', [
  heading,
  defineField({name: 'items', title: 'Punkter', type: 'array', of: [textItem('highlight', titleText)]}),
])

// Før og etter: hva det koster å la være, og hva du får.
export const compareSection = section('compareSection', 'Uten og med', [
  heading,
  intro,
  defineField({name: 'withoutTitle', title: 'Venstre tittel', type: 'string', initialValue: 'Uten'}),
  defineField({name: 'withoutItems', title: 'Venstre punkter', type: 'array', of: [defineArrayMember({type: 'string'})]}),
  defineField({name: 'withTitle', title: 'Høyre tittel', type: 'string', initialValue: 'Med oss'}),
  defineField({name: 'withItems', title: 'Høyre punkter', type: 'array', of: [defineArrayMember({type: 'string'})]}),
])

// Stor typografisk setning (Vivamedias typografidrevne uttrykk).
export const statementSection = section('statementSection', 'Stor setning', [
  defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3}),
  defineField({name: 'accent', title: 'Utheving', type: 'string', description: 'Siste del av setningen, vises i grønn.'}),
])

// Teamet med portrett, rolle, kort presentasjon og kontaktinfo. Hentes fra «Teammedlem».
export const teamSection = section('teamSection', 'Teamet', [
  heading,
  intro,
  defineField({
    name: 'image',
    title: 'Gruppebilde (valgfritt)',
    type: 'image',
    options: {hotspot: true},
    fields: [defineField({name: 'alt', title: 'Alternativ tekst', type: 'string'})],
  }),
  defineField({
    name: 'showContact',
    title: 'Vis e-post og telefon',
    type: 'boolean',
    initialValue: true,
  }),
])

export const sectionTypes = [
  textSection,
  teamSection,
  serviceCardsSection,
  statsSection,
  packagesSection,
  stepsSection,
  phasesSection,
  timelineSection,
  principlesSection,
  testimonialsSection,
  casesSection,
  clientsSection,
  faqSection,
  contactSection,
  contactFormSection,
  ctaSection,
  splitSection,
  benefitsSection,
  highlightsSection,
  compareSection,
  statementSection,
]

export const sectionMembers = sectionTypes.map((t) => defineArrayMember({type: t.name}))
