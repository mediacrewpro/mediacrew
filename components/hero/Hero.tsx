'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap, useGSAP } from '@/lib/gsap';
import { useLowPerf } from '@/lib/perf';

// WebGL needs a real canvas; never render this on the server.
const Bokeh = dynamic(
  () => import('@/components/atmosphere/Bokeh').then((m) => m.Bokeh),
  { ssr: false },
);

export type HeroService = {
  key: string;
  title: string;
  from: 'left' | 'right';
};

type HeroProps = {
  question: string;
  services: HeroService[];
};

export function Hero({ question, services }: HeroProps) {
  const root = useRef<HTMLDivElement>(null);

  // three.js is ~866KB. The bokeh isn't visible until ~65% of this sequence,
  // so loading it on first paint just delays the video the visitor came for.
  const [bokehMounted, setBokehMounted] = useState(false);
  const [bokehLive, setBokehLive] = useState(false);
  const mountedRef = useRef(false);
  // Software WebGL (no GPU) renders three.js on the CPU — unusably slow. Skip
  // the bokeh entirely there; the static background carries the atmosphere.
  const lowPerf = useLowPerf();
  const liveRef = useRef(false);

  // Feed the cursor into CSS vars so the hero's own glow tracks the mouse — the
  // global CursorGlow can't reach here (the hero is sealed for the dark breath),
  // so this local one appears with the services instead. Written straight to
  // the DOM node; moving the mouse never re-renders React.
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = root.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 768px)',
        },
        (ctx) => {
          const { motion, reduced, desktop } = ctx.conditions as {
            motion: boolean;
            reduced: boolean;
            desktop: boolean;
          };

          // Reduced motion: no scroll hijack, no blur. Everything simply exists.
          if (reduced) {
            gsap.set('[data-scrub-video]', { opacity: 0 });
            gsap.set('[data-center-line]', { scaleY: 1, opacity: 1 });
            gsap.set('[data-question-text], [data-service]', {
              opacity: 1,
              filter: 'none',
              x: 0,
              y: 0,
            });
            gsap.set('[data-services-bg]', { opacity: 1 });
            gsap.set('[data-hero-glow]', { opacity: 1 });
            gsap.set('[data-bokeh]', { opacity: 0.5 });
            setBokehMounted(true); // static depth, frameloop stays 'demand'
            return;
          }
          if (!motion) return;

          // Blur is expensive to composite on mobile GPUs; there we carry the
          // same focus-pull idea with opacity + travel only.
          const focus = (px: number) => (desktop ? `blur(${px}px)` : 'blur(0px)');

          // The navbar stays out of sight through the intro video and slides in
          // once the services arrive. It's a global element (outside this
          // scope), so it's targeted directly; useGSAP reverts it on unmount,
          // restoring the default on other pages.
          const nav = document.querySelector<HTMLElement>('[data-nav]');
          if (nav) gsap.set(nav, { yPercent: -140, opacity: 0 });

          // The centre line starts collapsed at the top and grows downward.
          gsap.set('[data-center-line]', {
            scaleY: 0,
            opacity: 0,
            transformOrigin: 'top center',
          });

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              // The first stretch scrubs the intro video; the services scene
              // follows straight after — all within this one pin.
              end: desktop ? '+=540%' : '+=320%',
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                // Fetch three.js a little before it's needed, not on page load.
                if (p > 0.55 && !mountedRef.current) {
                  mountedRef.current = true;
                  setBokehMounted(true);
                }
                // Only paint while it can actually be seen. Guarded by a ref so
                // this fires on transitions, not on every scroll frame.
                const live = p > 0.66;
                if (live !== liveRef.current) {
                  liveRef.current = live;
                  setBokehLive(live);
                }
              },
            },
          });

          // Phase 1 — the intro video is scrubbed by scroll. Its currentTime is
          // driven from a proxy the timeline eases, so the frame is locked to
          // scroll position. The video ends dark, and the question appears over
          // that same frame — no section change, no black gap.
          const SCRUB_UNITS = 6;
          const scrubVideo = root.current?.querySelector<HTMLVideoElement>(
            '[data-scrub-video]',
          );
          const scrubProxy = { p: 0 };
          tl.to(
            scrubProxy,
            {
              p: 1,
              duration: SCRUB_UNITS,
              onUpdate: () => {
                const v = scrubVideo;
                if (v && v.duration && v.readyState >= 2) {
                  v.currentTime = scrubProxy.p * (v.duration - 0.05);
                }
              },
            },
            0,
          );

          // As the video ends, the question racks into focus over its final
          // frame; then it hands straight off to the services — no long gap.
          const Q_IN = SCRUB_UNITS; // question appears as the video ends
          const Q_OUT = Q_IN + 1.8;

          tl.fromTo(
              '[data-question-text]',
              { filter: focus(24), opacity: 0, scale: 1.04 },
              { filter: 'blur(0px)', opacity: 1, scale: 1, duration: 1.2 },
              Q_IN,
            )
            .to(
              '[data-question-text]',
              { filter: focus(24), opacity: 0, y: -60, duration: 1 },
              Q_OUT,
            )
            // The video fades away so the white services scene can show beneath.
            .to('[data-scrub-video]', { opacity: 0, duration: 1 }, Q_OUT);

          // A short beat, then the services — no long dark breath.
          const SERVICES_IN = Q_OUT + 0.4;
          const DARK_BREATH_END = SERVICES_IN + 0.5;

          // The white services backdrop rises as the video melts away.
          tl.fromTo(
            '[data-services-bg]',
            { opacity: 0 },
            { opacity: 1, duration: 1.6, ease: 'power2.out' },
            SERVICES_IN,
          );
          tl.fromTo(
            '[data-hero-glow]',
            { opacity: 0 },
            { opacity: 1, duration: 1.6, ease: 'power2.out' },
            SERVICES_IN,
          );
          tl.fromTo(
            '[data-bokeh]',
            { opacity: 0 },
            { opacity: 1, duration: 1.6, ease: 'power2.out' },
            SERVICES_IN,
          );

          // The navbar slides down into view as the services scene opens.
          if (nav) {
            tl.to(
              nav,
              { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
              SERVICES_IN,
            );
          }

          // A line draws straight down the centre; each heading blooms as the
          // line passes its level — left, right, left, right.
          const LINE_START = DARK_BREATH_END;
          const LINE_DURATION = 4;
          // When each heading appears, as a fraction of the line's descent.
          const REVEAL_AT = [0.8, 1.8, 2.8, 3.6];

          tl.to('[data-center-line]', { opacity: 1, duration: 0.2 }, LINE_START).to(
            '[data-center-line]',
            { scaleY: 1, duration: LINE_DURATION, ease: 'none' },
            LINE_START,
          );

          // Each heading is born centred ON the line, then slides out to its
          // side — left headings drift left, right headings drift right. Starting
          // from the heading's own centre makes the direction come out right
          // regardless of how wide it is. Measure all rects first (before any
          // fromTo shifts one).
          const centerX = window.innerWidth / 2;
          const measured = services.map((service) => {
            const el = root.current?.querySelector<HTMLElement>(
              `[data-service="${service.key}"]`,
            );
            const rect = el?.getBoundingClientRect();
            const startX = rect ? centerX - (rect.left + rect.width / 2) : 0;
            return { el, startX };
          });

          measured.forEach(({ el, startX }, i) => {
            if (!el) return;
            tl.fromTo(
              el,
              { x: startX, opacity: 0, filter: focus(10) },
              {
                x: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.9,
                ease: 'power3.out',
              },
              LINE_START + REVEAL_AT[i],
            );
          });
        },
      );
    },
    { scope: root, dependencies: [services] },
  );

  return (
    <section
      ref={root}
      // Sealed with an opaque void: the hero is its own cinematic stage. Without
      // this the app-root CursorGlow (fixed, -z-10) would bleed into the dark
      // breath when the video fades to 0 — killing the total-darkness beat.
      className="relative h-dvh overflow-hidden bg-void"
      aria-label={question}
      onMouseMove={onMove}
    >
      {/* Scene 0 — the backdrop the services emerge over. Now a plain white
          surface (black text on white); fades up only once the void is empty,
          so the video and the dark breath before it stay pure black. */}
      <div
        data-services-bg
        aria-hidden
        // z-[3] so the plain white sits above the bokeh (z-0) and cursor glow
        // (z-[1]) that used to play on the old dark backdrop — kept out of sight
        // here — while the words (z-20) and the faded-out video stay correct.
        className="pointer-events-none absolute inset-0 z-[3] bg-white opacity-0"
      />
      <div
        data-bokeh
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0"
      >
        {bokehMounted && !lowPerf && <Bokeh active={bokehLive} />}
      </div>

      {/* Cursor-tracked glow, above the backdrop and below the words. Fades in
          with the services (7.0), so the dark breath before it stays pure. */}
      <div
        data-hero-glow
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-0"
        style={{
          background:
            'radial-gradient(300px circle at var(--mx,50%) var(--my,50%), rgba(40,199,250,0.28), rgba(30,144,255,0.12) 45%, rgba(74,222,128,0.08) 62%, transparent 74%)',
        }}
      />

      {/* Scene 1 — the intro video, scrubbed by scroll (currentTime is driven
          from the timeline). 2K, dense keyframes for smooth seeking; it fades
          out straight into the services scene below. */}
      <div className="absolute inset-0 z-10">
        <video
          data-scrub-video
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="h-full w-full object-cover"
        >
          <source src="/video/site-intro.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Scene 2 — the question, over the video's final frame. */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-8">
        <h2
          data-question-text
          className="text-hero max-w-[16ch] text-center text-light opacity-0"
        >
          {question}
        </h2>
      </div>

      {/* The centre line that draws down and reveals each heading. */}
      <div
        data-center-line
        aria-hidden
        style={{ left: 'calc(50% - 1.5px)' }}
        className="pointer-events-none absolute top-0 z-[4] h-full w-[3px] bg-void/60 opacity-0"
      />

      {/* Scene 3 — services, revealed by the line as it passes each level.
          Two columns split at the centre line; each heading hugs the line with a
          small fixed gap (right edge for left ones, left edge for right ones),
          so they sit equally close regardless of how wide the words are. */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center gap-3 px-6 md:gap-6">
        {services.map((service) => (
          <div key={service.key} className="grid grid-cols-2">
            <div
              data-service={service.key}
              // w-fit keeps the blurred box as wide as the words, not the screen.
              className={`w-fit opacity-0 ${
                service.from === 'left'
                  ? 'col-start-1 justify-self-end pr-6 md:pr-10'
                  : 'col-start-2 justify-self-start pl-6 md:pl-10'
              }`}
            >
              <h3 className="text-[clamp(1.6rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.005em] text-void">
                {service.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
