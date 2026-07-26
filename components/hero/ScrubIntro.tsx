'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/** How much scroll distance the whole clip is spread across (× viewport). */
const SCROLL_LENGTH = '+=300%';
/** Keep a hair off the final frame — seeking to exact duration can blank out. */
const END_EPSILON = 0.05;

/**
 * Scroll-scrubbed site entrance. The clip does not play on its own — its frame
 * is locked to scroll position, so the visitor "scrubs" through the intro as
 * they move down the page. Served at native 4K, untouched, so quality and
 * resolution never degrade (the trade-off is seek smoothness, since the source
 * keyframes are ~1.25s apart).
 */
export function ScrubIntro() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const v = video.current;
      if (!v) return;

      const mm = gsap.matchMedia();

      // Reduced motion: no scrub, no pin — just hold the opening frame.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const show = () => {
          v.pause();
          v.currentTime = 0.1;
        };
        if (v.readyState >= 1) show();
        else v.addEventListener('loadedmetadata', show, { once: true });
      });

      // Full experience: currentTime follows the (scrub-smoothed) scroll.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        v.pause();
        const proxy = { p: 0 };

        const tween = gsap.to(proxy, {
          p: 1,
          ease: 'none',
          // onUpdate reads the scrub-eased proxy, so seeks are as smooth as the
          // source allows.
          onUpdate: () => {
            if (!v.duration || v.readyState < 2) return;
            v.currentTime = proxy.p * (v.duration - END_EPSILON);
          },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: SCROLL_LENGTH,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => tween.scrollTrigger?.kill();
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="MediaCrew"
      className="relative h-dvh overflow-hidden bg-void"
    >
      <video
        ref={video}
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      >
        {/* Native 4K, no re-encode — quality/resolution preserved exactly. */}
        <source src="/video/site-intro.mp4" type="video/mp4" />
      </video>

      {/* Melt the lower edge into the void so the next section has no hard seam. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-void"
      />
    </section>
  );
}
