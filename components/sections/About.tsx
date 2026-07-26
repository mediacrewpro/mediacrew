'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP } from '@/lib/gsap';
import { AuroraButton } from '@/components/ui/AuroraButton';

const CAPABILITY_KEYS = [
  'web',
  'content',
  'ads',
  'geo',
  'direction',
  'operations',
] as const;

/**
 * The About page: vision + mission, the referral philosophy as a pull quote,
 * and the full sweep of what we manage. Copy lives in the `about` messages.
 */
export function About() {
  const t = useTranslations('about');
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            filter: 'blur(10px)',
            opacity: 0,
            y: 28,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              once: true,
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <main ref={root} className="overflow-hidden">
      {/* Intro */}
      <section className="relative px-6 pb-24 pt-40 text-center md:px-16 md:pb-32 md:pt-52">
        {/* Backdrop */}
        <img
          src="/about-hero-bg.webp"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Scrim keeps the copy legible and fades into the page below. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/70 via-void/60 to-void"
        />
        <div className="relative mx-auto max-w-4xl">
          <p
            data-reveal
            className="mb-6 font-mono text-label text-signal"
          >
            {t('label')}
          </p>
          <h1
            data-reveal
            className="mx-auto max-w-[30ch] whitespace-pre-line text-[clamp(1.75rem,4.4vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.01em] text-light"
          >
            {t('heading')}
          </h1>
          <p
            data-reveal
            className="mx-auto mt-8 max-w-[56ch] text-lg leading-relaxed text-light/60 md:text-xl"
          >
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-6 pb-24 md:px-16 md:pb-32">
        <div
          data-reveal
          className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-lg bg-petrol/25 md:grid-cols-2"
        >
          {(['vision', 'mission'] as const).map((key) => (
            <article
              key={key}
              className="group bg-void p-10 text-center transition-colors duration-500 hover:bg-abyss/40 md:p-14"
            >
              <span className="font-mono text-label text-signal">
                {t(`${key}.label`)}
              </span>
              <h2 className="mx-auto mt-6 max-w-[16ch] text-2xl font-medium leading-tight tracking-tight text-light transition-colors duration-300 group-hover:text-neon md:text-3xl">
                {t(`${key}.title`)}
              </h2>
              <p className="mx-auto mt-5 max-w-[42ch] text-base leading-relaxed text-light/55">
                {t(`${key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Referral pull quote */}
      <section className="border-y border-black/10 bg-white px-6 py-28 text-center text-void md:px-16 md:py-40">
        <blockquote data-reveal className="mx-auto max-w-4xl">
          <p className="text-title text-void">{t('quote')}</p>
          <footer className="mx-auto mt-8 max-w-[52ch] text-base leading-relaxed text-teal">
            {t('quoteCaption')}
          </footer>
        </blockquote>
      </section>

      {/* Approach */}
      <section className="px-6 pt-28 text-center md:px-16 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <p data-reveal className="mb-5 font-mono text-label text-signal">
            {t('approach.label')}
          </p>
          <h2
            data-reveal
            className="text-title mx-auto max-w-[18ch] text-light"
          >
            {t('approach.title')}
          </h2>
          <p
            data-reveal
            className="mx-auto mt-7 max-w-[54ch] text-lg leading-relaxed text-light/60"
          >
            {t('approach.body')}
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-6 py-24 md:px-16 md:py-32">
        <p
          data-reveal
          className="mb-12 text-center font-mono text-label text-teal/70"
        >
          {t('capabilitiesLabel')}
        </p>
        <div
          data-reveal
          className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-lg bg-petrol/25 sm:grid-cols-2 md:grid-cols-3"
        >
          {CAPABILITY_KEYS.map((key) => (
            <article
              key={key}
              className="group bg-void p-8 transition-colors duration-500 hover:bg-abyss/40 md:p-10"
            >
              <h3 className="text-xl font-medium tracking-tight text-light transition-colors duration-300 group-hover:text-neon md:text-2xl">
                {t(`capabilities.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-light/55 md:text-base">
                {t(`capabilities.${key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 text-center md:px-16 md:pb-44">
        <div data-reveal className="mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-title mx-auto max-w-[18ch] text-light">
            {t('ctaTitle')}
          </h2>
          <div className="mt-10">
            <AuroraButton href="/contact">{t('ctaButton')}</AuroraButton>
          </div>
        </div>
      </section>
    </main>
  );
}
