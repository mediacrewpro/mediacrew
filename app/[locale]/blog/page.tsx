import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { isAppLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/metadata';
import { BLOG_POSTS, readingMinutes } from '@/lib/blog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildMetadata({ locale, metaKey: 'blog', pathname: '/blog' });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('blogPage');
  const lang = locale === 'en' ? 'en' : 'tr';
  const dateFmt = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="px-6 pb-32 pt-36 md:px-16 md:pt-52">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-6 font-mono text-label text-signal">{t('label')}</p>
        <h1 className="text-display text-light">{t('title')}</h1>
        <p className="mx-auto mt-8 max-w-[52ch] text-lg leading-relaxed text-light/55">
          {t('intro')}
        </p>
      </header>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:mt-24 md:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-petrol/40 bg-abyss/30 transition-all duration-500 hover:-translate-y-1.5 hover:border-neon/60"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-void/60 px-3 py-1 font-mono text-label text-signal backdrop-blur-sm">
                {post.category[lang]}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="mb-3 flex items-center gap-2 font-mono text-label text-teal">
                <span>{dateFmt.format(new Date(post.date))}</span>
                <span aria-hidden>·</span>
                <span>
                  {readingMinutes(post, lang)} {t('readingSuffix')}
                </span>
              </div>
              <h2 className="text-xl font-medium leading-snug tracking-tight text-light transition-colors duration-300 group-hover:text-neon">
                {post[lang].title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-light/55">
                {post[lang].excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
