import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isAppLocale, locales, type AppLocale } from '@/i18n/routing';
import { Link, getPathname } from '@/i18n/navigation';
import { SITE_URL } from '@/lib/metadata';
import { AuroraButton } from '@/components/ui/AuroraButton';
import { PORTFOLIO, getPortfolio } from '@/lib/portfolio';

const OG_LOCALE: Record<AppLocale, string> = { tr: 'tr_TR', en: 'en_US' };

export function generateStaticParams() {
  return Object.keys(PORTFOLIO).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getPortfolio(slug);
  if (!isAppLocale(locale) || !project) return {};

  const t = await getTranslations({ locale });
  const siteName = t('meta.siteName');
  const title = `${t(`projectsPage.slides.${project.projectKey}.title`)} — ${siteName}`;
  const description = t(`projectsPage.slides.${project.projectKey}.description`);

  const href = { pathname: '/projects/[slug]', params: { slug } } as const;
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
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();
  const project = getPortfolio(slug);
  if (!project) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const lang = locale === 'en' ? 'en' : 'tr';
  const key = project.projectKey;
  const subtitle = t(`projectsPage.slides.${key}.subtitle`);
  const title = t(`projectsPage.slides.${key}.title`);
  const description = t(`projectsPage.slides.${key}.description`);

  const videos = project.videos.filter((v) => v.youtube || v.src);
  const sites = project.sites ?? [];
  const isEmpty =
    videos.length === 0 && sites.length === 0 && project.images.length === 0;

  return (
    <main className="relative px-6 pb-32 pt-36 md:px-16 md:pt-44">
      {/* Full-bleed banner behind the header, fading into the page. */}
      {project.banner && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden md:h-[720px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.banner}
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/55 to-void" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-6xl">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 font-mono text-label text-teal transition-colors duration-300 hover:text-neon"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          {t('projectDetail.back')}
        </Link>

        <header className={`max-w-3xl ${project.banner ? 'mt-24 md:mt-40' : 'mt-10'}`}>
          <p className="mb-4 font-mono text-label uppercase tracking-[0.28em] text-neon/90">
            {subtitle}
          </p>
          <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-light [text-shadow:0_4px_30px_rgba(0,0,0,0.5)]">
            {title}
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-light/70 [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
            {description}
          </p>
        </header>

        {/* Launched websites (Web Deneyimi). */}
        {sites.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="mb-8 font-mono text-label uppercase tracking-[0.28em] text-signal">
              {t('projectDetail.sitesTitle')}
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {sites.map((site) => (
                <article
                  key={site.url}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-petrol/40 bg-abyss/30 transition-all duration-500 hover:-translate-y-1.5 hover:border-neon/60"
                >
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-video overflow-hidden border-b border-petrol/40"
                    aria-label={site.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={site.image}
                      alt={site.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </a>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-2xl font-medium tracking-tight text-light">
                      {site.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-light/60 md:text-base">
                      {site.desc[lang]}
                    </p>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.2em] text-neon transition-colors hover:text-light"
                    >
                      {t('projectDetail.visitSite')} <span aria-hidden>↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Videos — presentation-style, streamed from YouTube. */}
        {videos.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="mb-8 font-mono text-label uppercase tracking-[0.28em] text-signal">
              {t('projectDetail.worksTitle')}
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {videos.map((v) => (
                <figure
                  key={v.src ?? v.youtube}
                  className={`w-full overflow-hidden rounded-2xl border border-petrol/40 bg-abyss/30 ${
                    v.vertical ? 'max-w-[300px]' : 'max-w-[560px]'
                  }`}
                >
                  <div
                    className={`relative bg-void ${v.vertical ? 'aspect-[9/16]' : 'aspect-video'}`}
                  >
                    {v.src ? (
                      <video
                        src={v.src}
                        controls
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${v.youtube}`}
                        title={v.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    )}
                  </div>
                  <figcaption className="px-5 py-4 text-sm text-light/70">
                    {v.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Nothing published yet. */}
        {isEmpty && (
          <p className="mt-16 rounded-2xl border border-petrol/30 bg-abyss/30 px-6 py-8 text-center text-light/50 md:mt-24">
            {t('projectDetail.comingSoon')}
          </p>
        )}

        {/* Stills / posts — self-hosted images. */}
        {project.images.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="mb-8 font-mono text-label uppercase tracking-[0.28em] text-signal">
              {t('projectDetail.galleryTitle')}
            </h2>
            <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
              {project.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full break-inside-avoid rounded-xl border border-petrol/30"
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-20 rounded-2xl border border-petrol/40 bg-abyss/30 p-8 text-center md:mt-28 md:p-12">
          <h2 className="text-title mx-auto max-w-[20ch] text-light">
            {t('projectDetail.ctaTitle')}
          </h2>
          <div className="mt-8 flex justify-center">
            <AuroraButton href="/contact">
              {t('projectDetail.ctaButton')}
            </AuroraButton>
          </div>
        </section>
      </div>
    </main>
  );
}
