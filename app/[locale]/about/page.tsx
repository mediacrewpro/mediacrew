import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isAppLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/metadata';
import { PagePlaceholder } from '@/components/layout/PagePlaceholder';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildMetadata({ locale, metaKey: 'about', pathname: '/about' });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('nav');
  return <PagePlaceholder title={t('about')} />;
}
