'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export type WhyItem = { key: string; title: string; body: string };

type WhyUsProps = {
  label: string;
  title: string;
  items: WhyItem[];
};

export function WhyUs({ label, title, items }: WhyUsProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-why-card]', {
          filter: 'blur(10px)',
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    },
    { scope: root, dependencies: [items] },
  );

  return (
    <section
      ref={root}
      className="px-6 py-24 md:px-16 md:py-36"
    >
      <header className="mb-14 text-center md:mb-20">
        <p className="mb-4 font-mono text-label text-signal">{label}</p>
        <h2 className="text-title mx-auto max-w-[20ch] text-light">{title}</h2>
      </header>

      <div className="grid gap-px overflow-hidden rounded-sm bg-petrol/25 md:grid-cols-2">
        {items.map((item, i) => (
          <article
            key={item.key}
            data-why-card
            className="group bg-void p-8 text-center transition-colors duration-500 hover:bg-abyss/40 md:p-12"
          >
            <h3 className="text-2xl font-medium tracking-tight text-light transition-colors duration-300 group-hover:text-neon md:text-3xl">
              {item.title}
            </h3>
            <p className="mx-auto mt-4 max-w-[46ch] text-base leading-relaxed text-light/55">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
