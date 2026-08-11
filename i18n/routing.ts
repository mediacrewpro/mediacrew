import { defineRouting } from 'next-intl/routing';

export const locales = ['tr', 'en'] as const;
export type AppLocale = (typeof locales)[number];

/**
 * Internal path -> per-locale public slug.
 *
 * The folder under app/[locale] is named after the INTERNAL key (e.g. `services`),
 * while visitors see /tr/hizmetlerimiz or /en/services. Turkish slugs are what
 * Turkish clients actually search for, so they must not be an afterthought.
 */
export const pathnames = {
  '/': '/',
  '/services': { tr: '/hizmetlerimiz', en: '/services' },
  '/services/[slug]': { tr: '/hizmetlerimiz/[slug]', en: '/services/[slug]' },
  '/about': { tr: '/hakkimizda', en: '/about' },
  '/projects': { tr: '/projeler', en: '/projects' },
  '/why-us': { tr: '/neden-biz', en: '/why-us' },
  '/projects/[slug]': { tr: '/projeler/[slug]', en: '/projects/[slug]' },
  '/blog': '/blog',
  '/blog/[slug]': '/blog/[slug]',
  '/contact': { tr: '/iletisim', en: '/contact' },
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale: 'tr',
  localePrefix: 'always',
  pathnames,
});

export type AppPathname = keyof typeof pathnames;

export function isAppLocale(value: string | undefined): value is AppLocale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}
