'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

const SESSION_KEY = 'mediacrew:aperture-seen';
/** Even on a warm cache the aperture needs long enough to read as a shutter. */
const MIN_VISIBLE_MS = 1400;

/** Waits for the things that would visibly pop in if we opened too early. */
function whenAssetsReady(): Promise<void> {
  const fonts = document.fonts?.ready ?? Promise.resolve();

  const video = new Promise<void>((resolve) => {
    const el = document.querySelector('video');
    if (!el) return resolve();
    if (el.readyState >= 3) return resolve();
    const done = () => {
      el.removeEventListener('canplay', done);
      el.removeEventListener('error', done);
      resolve();
    };
    el.addEventListener('canplay', done);
    el.addEventListener('error', done); // a broken video must not trap the user
  });

  return Promise.all([fonts, video]).then(() => undefined);
}

type ApertureLoaderProps = {
  loadingLabel: string;
  skipLabel: string;
};

export function ApertureLoader({ loadingLabel, skipLabel }: ApertureLoaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [percent, setPercent] = useState(0);
  const opened = useRef(false);

  // Decide on the client only: sessionStorage and matchMedia don't exist on the server.
  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduced) return;
    setActive(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const open = useCallback(() => {
    if (opened.current) return;
    opened.current = true;
    sessionStorage.setItem(SESSION_KEY, '1');

    gsap
      .timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          setActive(false);
        },
      })
      // Blades rotate as they retract — a shutter opens, it doesn't just grow.
      .to('[data-aperture-blades]', {
        scale: 26,
        rotate: 26,
        duration: 1.15,
        ease: 'power3.inOut',
      })
      .to('[data-aperture-ui]', { opacity: 0, duration: 0.3 }, 0)
      .to(root.current, { opacity: 0, duration: 0.35 }, 0.8);
  }, []);

  // Real progress: time floor vs. actual asset readiness, whichever is slower.
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let assetsReady = false;
    const start = performance.now();

    whenAssetsReady().then(() => {
      assetsReady = true;
    });

    const tick = () => {
      const elapsed = performance.now() - start;
      const byTime = Math.min(elapsed / MIN_VISIBLE_MS, 1);
      // Hold at 92% until assets actually land, so the number never lies.
      const target = assetsReady ? byTime : Math.min(byTime, 0.92);

      setPercent((p) => {
        const next = p + (target * 100 - p) * 0.12;
        if (next >= 99.4 && assetsReady && elapsed >= MIN_VISIBLE_MS) {
          open();
          return 100;
        }
        return next;
      });

      if (!opened.current) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, open]);

  useGSAP(
    () => {
      if (!active) return;
      gsap.to('[data-aperture-glow]', {
        opacity: 0.85,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: root, dependencies: [active] },
  );

  // Escape hatch: nobody should be held hostage by an intro.
  useEffect(() => {
    if (!active) return;
    const skip = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') open();
    };
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, [active, open]);

  // Failsafe. The progress loop runs on rAF, which browsers suspend in
  // background tabs — without this, opening the site in a new tab and looking
  // away would leave the loader up and `body` scroll-locked forever.
  useEffect(() => {
    if (!active) return;
    const bail = setTimeout(open, 6000);
    return () => clearTimeout(bail);
  }, [active, open]);

  if (!active) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 bg-void"
      role="status"
      aria-live="polite"
      aria-label={loadingLabel}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <mask id="aperture-mask">
            {/* white = opaque blades, black = the opening we see through */}
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <g data-aperture-blades style={{ transformOrigin: '50px 50px' }}>
              <polygon
                points="50,48 51.7,49 51.7,51 50,52 48.3,51 48.3,49"
                fill="black"
              />
            </g>
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="var(--color-void)"
          mask="url(#aperture-mask)"
        />

        {/* Turquoise catches the blade edge — the only light in the frame */}
        <g data-aperture-blades style={{ transformOrigin: '50px 50px' }}>
          <polygon
            data-aperture-glow
            points="50,48 51.7,49 51.7,51 50,52 48.3,51 48.3,49"
            fill="none"
            stroke="var(--color-neon)"
            strokeWidth="0.14"
            opacity="0.35"
          />
        </g>
      </svg>

      <div
        data-aperture-ui
        className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-label text-neon tabular-nums">
          {String(Math.round(percent)).padStart(3, '0')}
        </span>
        <span className="font-mono text-label text-teal/50">{skipLabel}</span>
      </div>
    </div>
  );
}
