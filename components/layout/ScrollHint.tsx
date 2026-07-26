'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

type Props = { label: string };

/**
 * A scroll-down cue at the bottom of the hero. It shows while the page is idle
 * and fades away the moment the visitor starts scrolling, returning once they
 * settle. Clicking it glides down one viewport. Hidden near the page bottom.
 */
export function ScrollHint({ label }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      // Continuous bob on the chevron (motion-safe only).
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('[data-bob]', {
          y: 6,
          duration: 0.9,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      const atBottom = () =>
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 80;

      // Start hidden; reveal once things are idle (and not at the very bottom).
      gsap.set(el, { opacity: 0, y: 10 });
      let idle: ReturnType<typeof setTimeout>;
      const settle = () => {
        clearTimeout(idle);
        idle = setTimeout(() => {
          if (!atBottom())
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
              overwrite: true,
            });
        }, 550);
      };

      const onScroll = () => {
        gsap.to(el, {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
        });
        settle();
      };

      settle(); // reveal shortly after load
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        clearTimeout(idle);
      };
    },
    { scope: ref },
  );

  const scrollDown = () =>
    window.scrollTo({
      top: window.scrollY + window.innerHeight * 0.9,
      behavior: 'smooth',
    });

  return (
    <button
      ref={ref}
      type="button"
      onClick={scrollDown}
      aria-label={label}
      className="fixed bottom-7 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 mix-blend-difference"
    >
      {/* White content + mix-blend-difference: reads black over light
          backgrounds and white over dark ones, automatically. */}
      <span className="font-mono text-label uppercase tracking-[0.28em] text-white">
        {label}
      </span>
      <span
        data-bob
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </button>
  );
}
