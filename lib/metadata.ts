import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { locales, type AppLocale, type AppPathname } from '@/i18n/routing';

// Where the site will actually live. Env var lets deploy override it without
// a code change; the localhost fallback keeps OG/canonical URLs valid in dev.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3004';

const OG_LOCALE: Record<AppLocale, string> = {
  tr: 'tr_TR',
  en: 'en_US',
};

/**
 * Builds title/description plus canonical and hreflang alternates for one page.
 * `metaKey` indexes the `meta` message tree; `pathname` is the internal route
 * whose localized slug next-intl resolves per locale.
 */
export async function buildMetadata({
  locale,
  metaKey,
  pathname,
}: {
  locale: AppLocale;
  metaKey: string;
  // Static routes only — every page passes its own fixed path (the dynamic
  // /services/[slug] page builds its metadata separately).
  pathname: Exclude<AppPathname, `${string}[${string}`>;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });

  const title = t(`${metaKey}.title`);
  const description = t(`${metaKey}.description`);
  const canonical = getPathname({ locale, href: pathname });

  // hreflang: one entry per locale, pointing at that locale's own slug.
  const languages = Object.fromEntries(
    locales.map((l) => [l, getPathname({ locale: l, href: pathname })]),
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { ...languages, 'x-default': languages.tr },
    },
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      title,
      description,
      url: canonical,
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
