'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Link } from '@/i18n/navigation';

export type WheelItem = { key: string; title: string; meta: string };

type Props = {
  label: string;
  viewAll: string;
  items: WheelItem[];
};

/**
 * Cylinder radius in px: how far each row sits from the axis of rotation.
 * This is the dial for spacing — the gap between neighbouring rows is
 * 2 * RADIUS * sin(step / 2), so a smaller radius pulls the titles together.
 */
const RADIUS = 115;

/** How much scrolling completes one full revolution. */
const SCROLL_LENGTH = '+=240%';

/** Blur at 90° from centre. Rows rack into focus as they reach the front. */
const MAX_BLUR = 7;

export function ProjectWheel({ label, viewAll, items }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>('[data-wheel-row]');
      const count = rows.length;
      if (!count) return;

      const step = 360 / count;
      // Keeps every angle in -180..180 so the maths stays continuous as the
      // wheel passes the seam — this is what makes the loop feel endless.
      const wrapAngle = gsap.utils.wrap(-180, 180);
      const spin = { rotation: 0 };

      // Rotate each row about the CYLINDER axis, not its own centre. Pushing
      // the origin back by RADIUS is what wraps the list onto a surface.
      // yPercent centres each row on the axis; backfaceVisibility hides the
      // far side, which would otherwise show up mirror-flipped.
      gsap.set(rows, {
        transformOrigin: `50% 50% -${RADIUS}px`,
        yPercent: -50,
        backfaceVisibility: 'hidden',
      });

      const paint = () => {
        rows.forEach((row, i) => {
          const angle = wrapAngle(i * step + spin.rotation);
          // cos(angle): 1 = facing the camera, 0 = edge-on, -1 = behind.
          const facing = Math.cos((angle * Math.PI) / 180);
          const front = Math.max(0, facing); // back half stays dark

          gsap.set(row, {
            rotationX: angle,
            opacity: 0.05 + front * 0.95,
            scale: 0.62 + front * 0.38,
            // Focus is earned by alignment: fully sharp only dead centre,
            // racking out as the row turns away. This is the Kadraj idea
            // applied to the wheel, not decoration bolted on.
            filter: `blur(${((1 - front) * MAX_BLUR).toFixed(2)}px)`,
            // Only the row actually facing you can be clicked, otherwise
            // invisible rows would swallow the pointer.
            pointerEvents: facing > 0.86 ? 'auto' : 'none',
          });
        });
      };

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        paint();
        const tween = gsap.to(spin, {
          rotation: -360,
          ease: 'none',
          onUpdate: paint,
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: SCROLL_LENGTH,
            pin: true,
            // scrub ties rotation to the wheel: stop scrolling, it stops.
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => tween.kill();
      });

      // A spinning wheel is exactly what reduced-motion users opt out of.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(rows, {
          rotationX: 0,
          opacity: 1,
          scale: 1,
          filter: 'none',
          pointerEvents: 'auto',
          transformOrigin: '50% 50%',
          position: 'relative',
          clearProps: 'transform',
        });
      });
    },
    { scope: root, dependencies: [items] },
  );

  return (
    <section
      ref={root}
      className="relative h-dvh overflow-hidden border-t border-petrol/30"
      aria-label={label}
    >
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 pt-28 md:px-16 md:pt-32">
        <p className="font-mono text-label text-signal">{label}</p>
        <Link
          href="/projects"
          className="font-mono text-label text-teal transition-colors hover:text-neon"
        >
          {viewAll} →
        </Link>
      </header>

      {/* perspective must live on an ANCESTOR of the rotating elements */}
      <div
        className="flex h-full items-center px-6 md:px-16"
        style={{ perspective: '1500px' }}
      >
        {/* Zero height: the stage IS the axis line, so rows (pulled up by
            yPercent:-50) sit centred on it. preserve-3d keeps children in the
            same 3D space instead of flattening them into this plane. */}
        <div
          className="relative h-0 w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => (
            <Link
              key={item.key}
              href="/projects"
              data-wheel-row
              className="absolute inset-x-0 top-0 flex items-baseline justify-between gap-6 border-b border-petrol/40 pb-5 will-change-transform"
            >
              <span className="font-mono text-label text-signal">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-title text-neon">{item.title}</h3>
              <span className="font-mono text-label text-teal">{item.meta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
