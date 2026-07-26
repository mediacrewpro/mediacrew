'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Link } from '@/i18n/navigation';
import { AuroraButton } from '@/components/ui/AuroraButton';

export type CarouselCard = {
  key: string;
  title: string;
  items?: string[];
  /** Image (public path). The card shows the picture with its name overlaid. */
  image?: string;
};

type Props = {
  label: string;
  title: string;
  /** Short hint shown on card hover, e.g. "İncele". */
  cardCta: string;
  /** The closing "see all services" call to action. */
  cta: string;
  cards: CarouselCard[];
};

/**
 * Vertical scroll drives a horizontal pan across the service cards — the wall
 * of work glides past while the viewport is held still. Pinned + scrubbed so
 * the translation stays glued to the scroll. Transform-only (x), no per-frame
 * filter, which keeps it off the freeze path.
 */
export function ServiceCarousel({ label, title, cardCta, cta, cards }: Props) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      // Desktop only: the pinned horizontal pan. On mobile the cards stack
      // vertically (no scroll-jack, nothing wider than the screen).
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        // How far the track must slide so its right edge meets the viewport.
        const distance = () => el.scrollWidth - window.innerWidth;

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => '+=' + distance(),
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => tween.kill();
      });
    },
    { scope: root, dependencies: [cards] },
  );

  return (
    <section
      ref={root}
      className="relative bg-void py-20 [touch-action:pan-y] md:h-dvh md:overflow-hidden md:py-0"
      aria-label={label}
    >
      {/* Backdrop behind the card wall. */}
      <img
        src="/services-cards-bg.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Scrim keeps the cards and heading legible over the backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-void/60"
      />
      <div
        ref={track}
        style={{ position: 'relative', zIndex: 1 }}
        className="flex flex-col items-center gap-8 px-6 will-change-transform md:h-full md:flex-row md:gap-[clamp(1rem,2.5vw,2.5rem)] md:px-[clamp(1.5rem,6vw,8rem)]"
      >
        {/* Opening panel — the section heading, pans away as the wall arrives. */}
        <div className="flex w-full flex-col items-center justify-center text-center md:h-full md:w-[min(85vw,30rem)] md:shrink-0 md:pr-6">
          <p className="mb-5 font-mono text-label text-signal">{label}</p>
          {/* Two lines by design: split on the comma so "Dört alan" / "tek ekip"
              each get their own line, a little smaller than the display size. */}
          <h2 className="text-[clamp(2rem,5vw,4.25rem)] font-bold leading-[1] tracking-[-0.02em] text-light">
            {title.split(',').map((part, i) => (
              <span key={i} className="block">
                {part.trim()}
              </span>
            ))}
          </h2>
        </div>

        {/* Cards — each links to its own service detail page. */}
        {cards.map((card) => (
          <Link
            key={card.key}
            href={{ pathname: '/services/[slug]', params: { slug: card.key } }}
            aria-label={card.title}
            className="group relative aspect-[4/5] w-[min(88vw,340px)] overflow-hidden rounded-2xl border border-petrol/40 bg-abyss/30 transition-[border-color,transform] duration-500 hover:border-neon/70 md:h-[min(62vh,600px)] md:w-auto md:shrink-0 md:hover:-translate-y-1"
          >
            {card.image && (
              <img
                src={card.image}
                alt={card.title}
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
              />
            )}
            {/* Scrim keeps the name legible over any photo. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/55 to-transparent p-6 pt-20 text-center">
              <h3 className="text-2xl font-medium tracking-tight text-light md:text-3xl">
                {card.title}
              </h3>
              <span className="mt-3 inline-flex items-center gap-2 font-mono text-label text-neon opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {cardCta}
                <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}

        {/* Closing panel — reached after the whole wall has passed. */}
        <div className="flex w-full flex-col items-center justify-center py-2 text-center md:h-full md:w-[min(80vw,26rem)] md:shrink-0 md:px-6 md:py-0">
          <AuroraButton href="/services">{cta}</AuroraButton>
        </div>
      </div>
    </section>
  );
}
