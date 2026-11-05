import { defineQuery } from "next-sanity";

// Delt projeksjon for seksjoner. Brukes av både Side og Tjeneste, slik at begge
// kan bygges av de samme seksjonene. Referanser (tjenester, pakker, case, uttalelser)
// hentes ut her, så hver seksjon får alt den trenger i ett kall.
const SECTIONS = /* groq */ `
  sections[]{
    _key,
    _type,
    _type == "textSection" => { heading, body },
    _type == "serviceCardsSection" => {
      heading,
      intro,
      variant,
      "services": services[]->{
        _id, title, "slug": slug.current, summary, bullets, image{ asset, alt }
      }
    },
    _type == "statsSection" => { heading, items[]{ _key, value, label } },
    _type == "packagesSection" => {
      heading,
      intro,
      variant,
      note,
      "packages": packages[]->{
        _id, name, tier, badge, tagline, audience, cardFeatures, priceFrom, priceNote,
        detailHeading, detailIntro, responsibilities, youGetIntro,
        youGet[]{ _key, title, text },
        channels, fitFor, priceLine, priceSuffix,
        terms[]{ _key, label, value },
        ctaHeading, ctaText, ctaLabel,
        pickLabel, pickHeading, pickText, pickBullets
      }
    },
    _type == "stepsSection" => { heading, intro, steps[]{ _key, title, text } },
    _type == "phasesSection" => {
      heading,
      phases[]{ _key, label, title, text, items[]{ _key, title, text } }
    },
    _type == "timelineSection" => { heading, intro, items[]{ _key, period, title, text } },
    _type == "principlesSection" => { heading, intro, items[]{ _key, title, text } },
    _type == "testimonialsSection" => {
      heading,
      "testimonials": testimonials[]->{ _id, quote, author, role, company, featured, "logo": logo.asset->url }
    },
    _type == "casesSection" => {
      heading,
      intro,
      "cases": cases[]->{
        _id, client, title, "slug": slug.current, summary, tags,
        metrics[]{ _key, value, label }
      }
    },
    _type == "clientsSection" => {
      heading,
      "clients": *[_id == "siteSettings"][0].clients[]{ _key, name, "logo": logo.asset->{ url, metadata { dimensions } } }
    },
    _type == "faqSection" => { heading, items[]{ _key, question, answer } },
    _type == "contactSection" => { heading, intro, email, buttonLabel },
    _type == "contactFormSection" => {
      heading,
      intro,
      benefitsTitle,
      benefits,
      topics,
      submitLabel,
      successTitle,
      successText,
      showPeople,
      "people": *[_type == "teamMember"] | order(coalesce(order, 9999) asc){ _id, name, role, photo{ asset, alt, hotspot, crop } }
    },
    _type == "teamSection" => {
      heading, intro, showContact,
      image{ asset, alt, hotspot, crop },
      "people": *[_type == "teamMember"] | order(coalesce(order, 9999) asc){
        _id, name, role, bio, email, phone, photo{ asset, alt, hotspot, crop }
      }
    },
    _type == "ctaSection" => { heading, intro, tone, checklist, buttonLabel, buttonHref },
    _type == "splitSection" => {
      heading,
      body,
      image{ asset, alt },
      imageSide,
      buttonLabel,
      buttonHref
    },
    _type == "benefitsSection" => { heading, intro, items[]{ _key, title, text } },
    _type == "highlightsSection" => { heading, items[]{ _key, title, text } },
    _type == "compareSection" => {
      heading, intro, withoutTitle, withoutItems, withTitle, withItems
    },
    _type == "statementSection" => { text, accent }
  }
`;

export const SERVICE_QUERY = defineQuery(`
  *[_type == "service" && slug.current == $slug][0]{
    _id,
    title,
    summary,
    bullets,
    image{ asset, alt },
    body,
    seoTitle,
    seoDescription,
    ${SECTIONS}
  }
`);

export const SERVICES_QUERY = defineQuery(`
  *[_type == "service" && defined(slug.current)]
  | order(coalesce(order, 9999) asc, title asc){
    _id,
    title,
    "slug": slug.current,
    summary,
    bullets,
    image{ asset, alt }
  }
`);

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    eyebrow,
    heading,
    headingAccent,
    intro,
    badges,
    primaryCta,
    secondaryCta,
    heroImage{ asset, alt },
    seoTitle,
    seoDescription,
    ${SECTIONS}
  }
`);

export const CASE_QUERY = defineQuery(`
  *[_type == "case" && slug.current == $slug][0]{
    _id,
    client,
    title,
    subtitle,
    summary,
    tags,
    metrics[]{ _key, value, label },
    facts[]{ _key, label, value },
    body,
    quote{ text, author, role },
    seoTitle,
    seoDescription
  }
`);

export const SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    tagline,
    phone,
    email,
    linkedin,
    facebook,
    offices[]{ _key, city, street, postalCode },
    clients[]{ _key, name },
    bannerImage{ asset, alt }
  }
`);

// Fagartikler. Kortet brukes i oversikten og under «Les også».
const ARTICLE_CARD = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  topics,
  publishedAt,
  heroImage{ asset, alt, hotspot, crop },
  "readingMinutes": round(length(pt::text(body)) / 1100),
  "author": author->{ name }
`;

export const ARTICLES_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc){
    ${ARTICLE_CARD}
  }
`);

export const ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0]{
    ${ARTICLE_CARD},
    keyPoints,
    body[]{
      ...,
      _type == "bodyImage" => { ..., alt, caption, "url": asset->url, "dimensions": asset->metadata.dimensions },
      markDefs[]{ ..., _type == "link" => { _key, _type, href } }
    },
    "author": author->{ name, role, bio, photo{ asset, alt, hotspot, crop } },
    "services": relatedServices[]->{ _id, title, "slug": slug.current, summary },
    "related": *[_type == "article" && slug.current != $slug && defined(slug.current)
      && count(topics[@ in ^.topics]) > 0] | order(publishedAt desc)[0...3]{
      ${ARTICLE_CARD}
    },
    seoTitle,
    seoDescription
  }
`);
