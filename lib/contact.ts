/**
 * The single source of truth for MediaCrew's contact details. Every surface
 * (contact page, footer, floating dock, organization schema, home CTA) reads
 * from here so the numbers and address never drift apart.
 */
export const CONTACT = {
  email: 'mediacrewpro@gmail.com',
  phones: [{ display: '0535 068 55 57', e164: '+905350685557' }],
  instagram: {
    handle: '@mediacrew.pro',
    url: 'https://www.instagram.com/mediacrew.pro/',
  },
} as const;
