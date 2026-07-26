import type { MetadataRoute } from 'next';
import { getPathname } from '@/i18n/navigation';
import {
  locales,
  pathnames,
  routing,
  type AppPathname,
} from '@/i18n/routing';
import { SITE_URL } from '@/lib/metadata';
import { generatedServiceCards } from '@/lib/service-cards.generated';

// Stamped once at build time; a stable value keeps the sitemap deterministic.
const LAST_MODIFIED = new Date().toISOString();

/**
 * One entry per internal route, each carrying hreflang alternates for every
 * locale — this is how Google learns /tr/hizmetlerimiz and /en/services are
 * the same page in two languages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes only — dynamic templates (containing `[…]`) are expanded
  // separately below, since getPathname needs their params.
  const staticRoutes = (Object.keys(pathnames) as AppPathname[]).filter(
    (href) => !href.includes('['),
  );

  const entry = (
    href: AppPathname,
    params?: Record<string, string>,
  ): MetadataRoute.Sitemap[number] => {
    const at = (locale: (typeof locales)[number]) =>
      `${SITE_URL}${getPathname({ locale, href: params ? { pathname: href, params } : href })}`;
    return {
      url: at(routing.defaultLocale),
      lastModified: LAST_MODIFIED,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, at(l)])),
      },
    };
  };

  return [
    ...staticRoutes.map((href) => entry(href)),
    // One entry per service detail page.
    ...generatedServiceCards.map((c) =>
      entry('/services/[slug]', { slug: c.slug }),
    ),
  ];
}
