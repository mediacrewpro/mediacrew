'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { AuroraButton } from '@/components/ui/AuroraButton';

type ContactCtaProps = {
  label: string;
  title: string;
  cta: string;
  mailLabel: string;
  email: string;
};

export function ContactCta({
  label,
  title,
  cta,
  mailLabel,
  email,
}: ContactCtaProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Blur sits on the heading itself, not the section.
        gsap.from('[data-cta-title]', {
          filter: 'blur(18px)',
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="px-6 py-28 text-center md:px-16 md:py-44"
    >
      <p className="mb-6 font-mono text-label text-signal">{label}</p>

      <h2
        data-cta-title
        className="text-display mx-auto max-w-[14ch] text-light"
      >
        {title}
      </h2>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:mt-16">
        <AuroraButton href="/contact">{cta}</AuroraButton>

        <a
          href={`mailto:${email}`}
          className="font-mono text-label text-teal transition-colors hover:text-light"
        >
          {mailLabel}: {email}
        </a>
      </div>
    </section>
  );
}
