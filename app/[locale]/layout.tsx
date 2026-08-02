import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { isAppLocale, locales } from '@/i18n/routing';
import { SITE_URL } from '@/lib/metadata';
import { ApertureLoader } from '@/components/loader/ApertureLoader';
import { Nav, type NavItem } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { FloatingContact } from '@/components/layout/FloatingContact';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';
import '../globals.css';

// latin-ext carries the Turkish glyphs (ş, ğ, ı, İ, …).
const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// metadataBase resolves every relative canonical/OG url in child pages to an
// absolute one — without it social scrapers get bare paths and drop the card.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations('loader');
  const tNav = await getTranslations('nav');
  const tFooter = await getTranslations('footer');
  const tMeta = await getTranslations('meta');

  // Order is the client's, not alphabetical.
  const navItems: NavItem[] = [
    { href: '/', label: tNav('home') },
    { href: '/services', label: tNav('services') },
    { href: '/about', label: tNav('about') },
    { href: '/projects', label: tNav('projects') },
    { href: '/why-us', label: tNav('why') },
    { href: '/blog', label: tNav('blog') },
    { href: '/contact', label: tNav('contact') },
  ];

  return (
    <html
      lang={locale}
      className={montserrat.variable}
    >
      <body className="min-h-dvh text-light">
        <OrganizationSchema description={tMeta('home.description')} />
        <ApertureLoader loadingLabel={t('loading')} skipLabel={t('skip')} />
        <NextIntlClientProvider messages={messages}>
          <Nav
            items={navItems}
            openLabel={tNav('openMenu')}
            closeLabel={tNav('closeMenu')}
            switchLanguageLabel={tNav('switchLanguage')}
            ctaLabel={tNav('cta')}
          />
          {children}
          <FloatingContact />
          <Footer
            items={navItems}
            rights={tFooter('rights')}
            navLabel={tFooter('navLabel')}
            contactLabel={tFooter('contactLabel')}
            year={new Date().getFullYear()}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
