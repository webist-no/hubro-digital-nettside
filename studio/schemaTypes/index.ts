import {article} from './article'
import {caseStudy} from './caseStudy'
import {inquiry} from './inquiry'
import {page} from './page'
import {servicePackage} from './package'
import {sectionTypes} from './sections'
import {service} from './service'
import {siteSettings} from './siteSettings'
import {teamMember} from './teamMember'
import {testimonial} from './testimonial'

export const schemaTypes = [
  // Dokumenter
  page,
  service,
  servicePackage,
  article,
  caseStudy,
  testimonial,
  teamMember,
  siteSettings,
  inquiry,
  // Seksjoner (brukes av Side)
  ...sectionTypes,
]
