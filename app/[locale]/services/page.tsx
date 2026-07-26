import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isAppLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/metadata';
import {
  ServiceCategories,
  type ServiceCategory,
} from '@/components/sections/ServiceCategories';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildMetadata({ locale, metaKey: 'services', pathname: '/services' });
}

/** Mirrors the message tree — the client's own list, in the client's order. */
const CATEGORY_MAP = {
  ads: ['seo', 'meta', 'tiktok', 'youtube'],
  web: ['design', 'crm', 'automation'],
  social: ['instagram', 'facebook', 'tiktok', 'youtube'],
  pr: [
    'photo',
    'commercial',
    'video',
    'direction',
    'shortFilm',
    'live',
    'event',
    'drone',
    'influencer',
    'brand',
    'identity',
    'graphic',
  ],
} as const;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();

  const categories: ServiceCategory[] = (
    Object.keys(CATEGORY_MAP) as (keyof typeof CATEGORY_MAP)[]
  ).map((key) => ({
    key,
    title: t(`services.${key}.title`),
    items: CATEGORY_MAP[key].map((item) => ({
      key: item,
      label: t(`services.${key}.items.${item}`),
    })),
  }));

  return (
    <main>
      <header className="px-6 pb-16 pt-36 text-center md:px-16 md:pb-24 md:pt-52">
        <p className="mb-6 font-mono text-label text-signal">
          {t('servicesPage.label')}
        </p>
        <h1 className="text-display mx-auto max-w-[16ch] text-light">
          {t('servicesPage.title')}
        </h1>
        <p className="mx-auto mt-8 max-w-[52ch] text-lg leading-relaxed text-light/55">
          {t('servicesPage.intro')}
        </p>
      </header>

      <ServiceCategories
        categories={categories}
        countLabel={t('servicesPage.countLabel')}
      />
    </main>
  );
}
