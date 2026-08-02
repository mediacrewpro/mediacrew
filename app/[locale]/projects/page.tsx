import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isAppLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/metadata';
import { CinematicSlider } from '@/components/projects/CinematicSlider';
import { PROJECT_SLIDES } from '@/lib/projects-data';
import type { Project } from '@/types/projects';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildMetadata({ locale, metaKey: 'projects', pathname: '/projects' });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('projectsPage');

  const projects: Project[] = PROJECT_SLIDES.map((slide) => ({
    key: slide.key,
    image: slide.image,
    imageMobile: slide.imageMobile,
    title: t(`slides.${slide.key}.title`),
    subtitle: t(`slides.${slide.key}.subtitle`),
    description: t(`slides.${slide.key}.description`),
  }));

  return (
    <main>
      {/* overlayOpacity 0 → the active image shows at full brightness. */}
      <CinematicSlider projects={projects} hint={t('hint')} overlayOpacity={0} />
    </main>
  );
}
