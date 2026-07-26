import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isAppLocale, locales, type AppLocale } from '@/i18n/routing';
import { Link, getPathname } from '@/i18n/navigation';
import { SITE_URL } from '@/lib/metadata';
import { AuroraButton } from '@/components/ui/AuroraButton';
import { generatedServiceCards } from '@/lib/service-cards.generated';

const OG_LOCALE: Record<AppLocale, string> = { tr: 'tr_TR', en: 'en_US' };

/** The service exists only if there's a generated card for the slug. */
function findCard(slug: string) {
  return generatedServiceCards.find((c) => c.slug === slug);
}

export function generateStaticParams() {
  return generatedServiceCards.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isAppLocale(locale) || !findCard(slug)) return {};

  const t = await getTranslations({ locale });
  const siteName = t('meta.siteName');
  const title = `${t(`serviceDetail.${slug}.title`)} — ${siteName}`;
  const description = t(`serviceDetail.${slug}.intro`);

  const href = { pathname: '/services/[slug]', params: { slug } } as const;
  const canonical = getPathname({ locale, href });
  const languages = Object.fromEntries(
    locales.map((l) => [l, getPathname({ locale: l, href })]),
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
      siteName,
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      locale: OG_LOCALE[locale],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();
  const card = findCard(slug);
  if (!card) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const title = t(`serviceDetail.${slug}.title`);
  const tagline = t(`serviceDetail.${slug}.tagline`);
  const intro = t(`serviceDetail.${slug}.intro`);
  const points = t.raw(`serviceDetail.${slug}.points`) as string[];

  return (
    <main className="px-6 pb-32 pt-32 md:px-16 md:pt-44">
      {/* Back to the full list */}
      <Link
        href="/services"
        className="group mx-auto flex w-fit items-center gap-2 font-mono text-label text-teal transition-colors duration-300 hover:text-neon"
      >
        <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
        {t('serviceDetailPage.back')}
      </Link>

      {/* Header */}
      <header className="mx-auto mt-10 max-w-3xl text-center md:mt-14">
        <p className="mb-5 font-mono text-label text-signal">
          {t('serviceDetailPage.eyebrow')}
        </p>
        <h1 className="text-display text-light">{title}</h1>
        <p className="mt-6 text-xl text-light/60 md:text-2xl">{tagline}</p>
      </header>

      {/* Image + description, stacked and centered */}
      <div className="mx-auto mt-16 flex max-w-2xl flex-col items-center text-center md:mt-20">
        <div className="relative aspect-[4/5] w-full max-w-[22rem] overflow-hidden rounded-2xl border border-petrol/40 bg-abyss/30">
          <img
            src={card.image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        <p className="mt-12 max-w-[52ch] text-lg leading-relaxed text-light/70 md:text-xl">
          {intro}
        </p>

        <h2 className="mt-12 font-mono text-label text-teal">
          {t('serviceDetailPage.whatIncluded')}
        </h2>
        <ul className="mt-6 space-y-4">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-center justify-center gap-3 text-light/85"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-neon"
              />
              <span className="text-lg leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Conversion — take this service to the contact form, prefilled */}
      <section className="mt-24 border-t border-petrol/30 pt-16 text-center md:mt-32">
        <h2 className="text-3xl font-medium tracking-tight text-light md:text-4xl">
          {t('serviceDetailPage.ctaTitle')}
        </h2>
        <p className="mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed text-light/55">
          {t('serviceDetailPage.ctaBody')}
        </p>
        <AuroraButton
          href={{ pathname: '/contact', query: { service: title } }}
          className="mt-10"
        >
          {t('serviceDetailPage.cta')}
        </AuroraButton>
      </section>
    </main>
  );
}
