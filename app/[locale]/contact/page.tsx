import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isAppLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/metadata';
import { ContactForm } from '@/components/sections/ContactForm';

// Placeholder until the real address is confirmed.
const CONTACT_EMAIL = 'hello@mediacrew.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildMetadata({ locale, metaKey: 'contact', pathname: '/contact' });
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('contactPage');

  // Arriving from a service page's "I want this service" CTA pre-fills the
  // message so the visitor doesn't start from a blank box.
  const { service } = await searchParams;
  const defaultMessage = service ? t('prefill', { service }) : undefined;

  return (
    <main className="px-6 pb-32 pt-36 text-center md:px-16 md:pt-52">
      <p className="mb-6 font-mono text-label text-signal">{t('label')}</p>
      <h1 className="text-display mx-auto max-w-[14ch] text-light">
        {t('title')}
      </h1>
      <p className="mx-auto mt-8 max-w-[48ch] text-lg leading-relaxed text-light/55">
        {t('intro')}
      </p>

      {/* The form itself stays left-aligned — centred inputs hurt usability —
          but the block is centred on the page. */}
      <div className="mx-auto mt-16 max-w-2xl text-left md:mt-24">
        <ContactForm
          email={CONTACT_EMAIL}
          defaultMessage={defaultMessage}
          labels={{
            name: t('name'),
            email: t('email'),
            company: t('company'),
            message: t('message'),
            messageHint: t('messageHint'),
            optional: t('optional'),
            submit: t('submit'),
            errors: {
              name: t('errors.name'),
              email: t('errors.email'),
              message: t('errors.message'),
            },
            notWired: {
              title: t('notWired.title'),
              body: t('notWired.body'),
            },
          }}
        />
      </div>

      <div className="mt-20 border-t border-petrol/30 pt-10 text-center">
        <p className="font-mono text-label text-teal">{t('directLabel')}</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-3 inline-block text-2xl text-light transition-colors duration-300 hover:text-neon md:text-3xl"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </main>
  );
}
