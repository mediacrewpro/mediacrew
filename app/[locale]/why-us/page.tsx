import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isAppLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/metadata';
import { About } from '@/components/sections/About';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildMetadata({ locale, metaKey: 'why', pathname: '/why-us' });
}

export default async function WhyUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);
  return <About />;
}
