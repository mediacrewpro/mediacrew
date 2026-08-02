import { BRAND_LOGOS, type BrandLogo } from '@/lib/brand-logos';

/**
 * A two-row logo ribbon under the featured-work section. The top row drifts
 * left→right, the bottom row right→left. Each track holds two copies of its
 * logos so the CSS translateX(-50%) loop is seamless. Logos are rendered as
 * white silhouettes so mixed-colour brand marks all read on the dark surface.
 */
function Row({
  logos,
  animation,
  duration,
}: {
  logos: BrandLogo[];
  animation: 'marquee-left' | 'marquee-right';
  duration: number;
}) {
  const doubled = [...logos, ...logos];
  return (
    <div className="group flex overflow-hidden">
      <ul
        className="flex w-max shrink-0 items-center gap-12 pr-12 will-change-transform group-hover:[animation-play-state:paused] motion-reduce:!animate-none md:gap-20 md:pr-20"
        style={{ animation: `${animation} ${duration}s linear infinite` }}
      >
        {doubled.map((logo, i) => (
          <li key={i} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              draggable={false}
              className="h-9 w-auto max-w-[9rem] object-contain opacity-55 grayscale transition-all duration-300 [filter:brightness(0)_invert(1)] hover:opacity-100 md:h-11 md:max-w-[11rem]"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BrandMarquee() {
  const mid = Math.ceil(BRAND_LOGOS.length / 2);
  const top = BRAND_LOGOS.slice(0, mid);
  const bottom = BRAND_LOGOS.slice(mid);

  return (
    <section
      aria-label="Bize güvenen markalar"
      className="overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] md:py-12"
    >
      <div className="flex flex-col gap-8 md:gap-10">
        <Row logos={top} animation="marquee-right" duration={55} />
        <Row logos={bottom} animation="marquee-left" duration={55} />
      </div>
    </section>
  );
}
