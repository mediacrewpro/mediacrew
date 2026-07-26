'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export type ServiceCategory = {
  key: string;
  title: string;
  items: { key: string; label: string }[];
};

type Props = {
  categories: ServiceCategory[];
  countLabel: string;
};

export function ServiceCategories({ categories, countLabel }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-category]').forEach((cat) => {
          // Blur the heading itself; the section wrapper is full-width and
          // gaussian-blurring that surface is what froze the hero once.
          gsap.from(cat.querySelector('[data-category-title]'), {
            filter: 'blur(16px)',
            opacity: 0,
            y: 24,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: cat, start: 'top 80%' },
          });
          gsap.from(cat.querySelectorAll('[data-service-item]'), {
            opacity: 0,
            y: 14,
            duration: 0.5,
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: { trigger: cat, start: 'top 72%' },
          });
        });
      });
    },
    { scope: root, dependencies: [categories] },
  );

  return (
    <div ref={root}>
      {categories.map((cat, i) => (
        <section
          key={cat.key}
          data-category
          className="border-t border-petrol/30 px-6 py-20 md:px-16 md:py-28"
        >
          <div className="mb-10 flex items-baseline justify-center gap-5 md:mb-14 md:gap-10">
            <span className="font-mono text-label text-signal">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2 data-category-title className="text-title w-fit text-light">
              {cat.title}
            </h2>
            <span className="shrink-0 font-mono text-label text-teal/60">
              {cat.items.length} {countLabel}
            </span>
          </div>

          <ul
            onMouseLeave={() => setHovered(null)}
            className="grid gap-x-12 gap-y-1 text-center md:grid-cols-2"
          >
            {cat.items.map((item) => {
              const id = `${cat.key}:${item.key}`;
              const dimmed = hovered !== null && hovered !== id;
              return (
                <li
                  key={item.key}
                  data-service-item
                  onMouseEnter={() => setHovered(id)}
                  className="border-b border-petrol/20 py-4"
                >
                  <span
                    className="inline-block w-fit text-lg text-light/80 md:text-xl"
                    style={{
                      filter: dimmed ? 'blur(2.5px)' : 'blur(0px)',
                      opacity: dimmed ? 0.4 : 1,
                      transition:
                        'filter 350ms cubic-bezier(0.16,1,0.3,1), opacity 350ms cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
