'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP } from '@/lib/gsap';
import { AuroraButton } from '@/components/ui/AuroraButton';

const EASE = 'power3.out';

/**
 * The About page — Media Crew's own story, in its own voice. Editorial rhythm:
 * a lead statement, then "what / how / why" as their own beats. Copy lives in
 * the `aboutPage` messages so it stays bilingual.
 */
export function AboutStory() {
  const t = useTranslations('aboutPage');
  const root = useRef<HTMLElement>(null);

  const steps = t.raw('how.steps') as { lead: string; body: string }[];
  const reasons = t.raw('why.reasons') as string[];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 26,
            filter: 'blur(8px)',
            duration: 0.85,
            ease: EASE,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
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
        <img
          src="/about-hero-bg.webp"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/75 via-void/65 to-void"
        />
        <div className="relative mx-auto max-w-4xl">
          <p data-reveal className="mb-6 font-mono text-label text-signal">
            {t('label')}
          </p>
          <h1
            data-reveal
            className="mx-auto max-w-[24ch] text-[clamp(1.9rem,4.6vw,3.75rem)] font-bold leading-[1.15] tracking-[-0.01em] text-light"
          >
            {t('heading')}
          </h1>
          <p
            data-reveal
            className="mx-auto mt-8 max-w-[60ch] text-lg leading-relaxed text-light/65 md:text-xl"
          >
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Ne yapıyoruz? */}
      <section className="px-6 py-20 text-center md:px-16 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 data-reveal className="text-title text-light">
            {t('do.title')}
          </h2>
          <p
            data-reveal
            className="mx-auto mt-7 max-w-[62ch] text-lg leading-relaxed text-light/65"
          >
            {t('do.body')}
          </p>
        </div>
      </section>

      {/* Nasıl çalışıyoruz? — three beats */}
      <section className="border-y border-petrol/25 bg-abyss/20 px-6 py-24 md:px-16 md:py-32">
        <h2 data-reveal className="text-title mb-14 text-center text-light md:mb-20">
          {t('how.title')}
        </h2>
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-lg bg-petrol/25 md:grid-cols-3">
          {steps.map((step, i) => (
            <article
              key={i}
              data-reveal
              className="flex flex-col bg-void p-8 text-center md:p-10"
            >
              <span className="mx-auto font-mono text-label text-signal">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-2xl font-medium tracking-tight text-light">
                {step.lead}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-light/60">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Neden biz? + closing CTA */}
      <section className="px-6 py-24 text-center md:px-16 md:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 data-reveal className="text-title text-light">
            {t('why.title')}
          </h2>

          <ul
            data-reveal
            className="mx-auto mt-10 flex max-w-[46ch] flex-col gap-4"
          >
            {reasons.map((reason, i) => (
              <li
                key={i}
                className="flex items-start justify-center gap-3 text-lg leading-relaxed text-light/75"
              >
                <span
                  aria-hidden
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon"
                />
                <span>{reason}</span>
              </li>
            ))}
          </ul>

          <p
            data-reveal
            className="mx-auto mt-12 max-w-[48ch] text-xl leading-relaxed text-light md:text-2xl"
          >
            {t('why.closing')}
          </p>

          <div data-reveal className="mt-10 flex justify-center">
            <AuroraButton href="/contact">{t('why.cta')}</AuroraButton>
          </div>
        </div>
      </section>
    </main>
  );
}
