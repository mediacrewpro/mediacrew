import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isAppLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/metadata';
import { ContactForm } from '@/components/sections/ContactForm';
import { CONTACT } from '@/lib/contact';

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
    <main className="bg-white px-6 pb-32 pt-36 text-center text-void md:px-16 md:pt-52">
      <p className="mb-6 font-mono text-label text-teal">{t('label')}</p>
      <h1 className="text-display mx-auto max-w-[14ch] text-void">
        {t('title')}
      </h1>
      <p className="mx-auto mt-8 max-w-[48ch] text-lg leading-relaxed text-void/60">
        {t('intro')}
      </p>

      {/* The form itself stays left-aligned — centred inputs hurt usability —
          but the block is centred on the page. */}
      <div className="mx-auto mt-16 max-w-2xl text-left md:mt-24">
        <ContactForm
          email={CONTACT.email}
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

      <div className="mt-20 grid gap-10 border-t border-black/10 pt-12 text-center sm:grid-cols-3">
        {/* Email */}
        <div>
          <p className="font-mono text-label text-teal">{t('directLabel')}</p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-3 inline-block text-lg text-void transition-colors duration-300 hover:text-teal md:text-xl"
          >
            {CONTACT.email}
          </a>
        </div>

        {/* Phones */}
        <div>
          <p className="font-mono text-label text-teal">{t('phoneLabel')}</p>
          <div className="mt-3 flex flex-col gap-1">
            {CONTACT.phones.map((phone) => (
              <a
                key={phone.e164}
                href={`tel:${phone.e164}`}
                className="text-lg text-void transition-colors duration-300 hover:text-teal md:text-xl"
              >
                {phone.display}
              </a>
            ))}
          </div>
        </div>

        {/* Instagram */}
        <div>
          <p className="font-mono text-label text-teal">{t('socialLabel')}</p>
          <a
            href={CONTACT.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 text-lg text-void transition-colors duration-300 hover:text-teal md:text-xl"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="2" y="2" width="20" height="20" rx="5.5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1.1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            {CONTACT.instagram.handle}
          </a>
        </div>
      </div>
    </main>
  );
}
