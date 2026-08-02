import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isAppLocale, locales, type AppLocale } from '@/i18n/routing';
import { Link, getPathname } from '@/i18n/navigation';
import { SITE_URL } from '@/lib/metadata';
import { AuroraButton } from '@/components/ui/AuroraButton';
import { Article } from '@/components/blog/Article';
import { BLOG_POSTS, getPost, readingMinutes } from '@/lib/blog';

const OG_LOCALE: Record<AppLocale, string> = { tr: 'tr_TR', en: 'en_US' };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!isAppLocale(locale) || !post) return {};

  const lang = locale === 'en' ? 'en' : 'tr';
  const t = await getTranslations({ locale });
  const siteName = t('meta.siteName');
  const title = `${post[lang].title} — ${siteName}`;
  const description = post[lang].excerpt;

  const href = { pathname: '/blog/[slug]', params: { slug } } as const;
  const canonical = getPathname({ locale, href });
  const languages = Object.fromEntries(
    locales.map((l) => [l, getPathname({ locale: l, href })]),
  );
  const image = `${SITE_URL}${post.cover}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { ...languages, 'x-default': languages.tr },
    },
    openGraph: {
      type: 'article',
      siteName,
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      locale: OG_LOCALE[locale],
      publishedTime: post.date,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();
  const post = getPost(slug);
  if (!post) notFound();
  setRequestLocale(locale);

  const lang = locale === 'en' ? 'en' : 'tr';
  const t = await getTranslations('blogPage');
  const content = post[lang];
  const dateFmt = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const canonical = getPathname({
    locale,
    href: { pathname: '/blog/[slug]', params: { slug } },
  });

  // Article structured data — real facts only.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: content.title,
    description: content.excerpt,
    image: `${SITE_URL}${post.cover}`,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'MediaCrew', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'MediaCrew', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}${canonical}`,
  };

  return (
    <main className="px-6 pb-32 pt-36 md:px-16 md:pt-44">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 font-mono text-label text-teal transition-colors duration-300 hover:text-neon"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          {t('backToBlog')}
        </Link>

        <header className="mt-8 text-center">
          <p className="mb-4 font-mono text-label text-signal">
            {post.category[lang]}
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-light">
            {content.title}
          </h1>
          <div className="mt-6 flex items-center justify-center gap-2 font-mono text-label text-light/50">
            <span>{dateFmt.format(new Date(post.date))}</span>
            <span aria-hidden>·</span>
            <span>
              {readingMinutes(post, lang)} {t('readingSuffix')}
            </span>
          </div>
        </header>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-petrol/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-12">
          <Article body={content.body} />
        </div>

        <div className="mt-16 rounded-2xl border border-petrol/40 bg-abyss/30 p-8 text-center md:p-12">
          <h2 className="text-title mx-auto max-w-[20ch] text-light">
            {t('ctaTitle')}
          </h2>
          <div className="mt-8 flex justify-center">
            <AuroraButton href="/contact">{t('ctaButton')}</AuroraButton>
          </div>
        </div>
      </article>
    </main>
  );
}
