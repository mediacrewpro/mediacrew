'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import {
  SERVICE_PREVIEWS,
  PREVIEW_FALLBACK,
  type ServicePreview,
  type PreviewMotif,
} from '@/constants/service-previews';

type Item = { id: string; key: string; label: string };
export type ExplorerCategory = { key: string; title: string; items: Item[] };

type Props = {
  categories: ExplorerCategory[];
  countLabel: string;
  locale: string;
};

const EASE = 'power3.out';

export function ServiceExplorer({ categories, countLabel, locale }: Props) {
  const lang = locale === 'en' ? 'en' : 'tr';
  const root = useRef<HTMLDivElement>(null);

  const flat = useMemo(
    () => categories.flatMap((c) => c.items),
    [categories],
  );
  const [activeId, setActiveId] = useState<string>(flat[0]?.id ?? '');
  const active = flat.find((i) => i.id === activeId) ?? flat[0];
  const preview: ServicePreview =
    SERVICE_PREVIEWS[activeId] ?? PREVIEW_FALLBACK;
  const categoryTitle =
    categories.find((c) => c.items.some((i) => i.id === activeId))?.title ?? '';

  // ── Preview panel refs ──────────────────────────────────────────
  const panelRef = useRef<HTMLDivElement>(null);
  const layerA = useRef<HTMLImageElement>(null);
  const layerB = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const showA = useRef(true);
  const firstRun = useRef(true);

  // Crossfade the image + spring the content on every active change.
  useEffect(() => {
    const incoming = showA.current ? layerB.current : layerA.current;
    const outgoing = showA.current ? layerA.current : layerB.current;
    if (!incoming || !outgoing) return;

    incoming.src = preview.image;
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        background: `radial-gradient(60% 60% at 50% 35%, ${preview.accent}44, transparent 70%)`,
        duration: 0.6,
        ease: EASE,
      });
    }

    if (firstRun.current) {
      gsap.set(incoming, { opacity: 1 });
      gsap.set(outgoing, { opacity: 0 });
      firstRun.current = false;
    } else {
      gsap.fromTo(
        incoming,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 0.7, ease: EASE, overwrite: 'auto' },
      );
      gsap.to(outgoing, {
        opacity: 0,
        duration: 0.6,
        ease: EASE,
        overwrite: 'auto',
      });
    }
    showA.current = !showA.current;

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 16, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.55,
          ease: EASE,
          overwrite: 'auto',
        },
      );
      const chips =
        contentRef.current.querySelectorAll<HTMLElement>('[data-metric]');
      gsap.fromTo(
        chips,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.1,
          ease: EASE,
          overwrite: 'auto',
        },
      );
      // Count-up the numeric part of each metric.
      contentRef.current
        .querySelectorAll<HTMLElement>('[data-count]')
        .forEach((el) => animateCount(el, el.dataset.count ?? ''));
    }
  }, [activeId, preview.image, preview.accent]);

  // Subtle mouse parallax on the panel (GPU transforms only).
  useGSAP(
    () => {
      const panel = panelRef.current;
      const px = parallaxRef.current;
      if (!panel || !px) return;
      const xTo = gsap.quickTo(px, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(px, 'y', { duration: 0.6, ease: 'power3' });
      const move = (e: MouseEvent) => {
        const r = panel.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        xTo(dx * 12);
        yTo(dy * 12);
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };
      panel.addEventListener('mousemove', move);
      panel.addEventListener('mouseleave', reset);
      return () => {
        panel.removeEventListener('mousemove', move);
        panel.removeEventListener('mouseleave', reset);
      };
    },
    { scope: root },
  );

  // Reveal categories/rows on scroll.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-cat-block]', {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: EASE,
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative grid gap-12 px-6 pb-32 md:grid-cols-[1.05fr_1fr] md:gap-16 md:px-16"
    >
      {/* Ambient background sweep */}
      <BackgroundSweep />

      {/* LEFT — categories & service lists */}
      <div className="relative z-10 flex flex-col gap-16 md:gap-24">
        {categories.map((cat) => (
          <div key={cat.key} data-cat-block>
            <div className="mb-6 flex items-baseline justify-center gap-4 border-b border-petrol/25 pb-4 text-center">
              <h2 className="text-title text-light">{cat.title}</h2>
              <span className="font-mono text-label text-signal">
                {cat.items.length} {countLabel}
              </span>
            </div>

            <ul>
              {cat.items.map((item) => {
                const isActive = item.id === activeId;
                const accent =
                  (SERVICE_PREVIEWS[item.id] ?? PREVIEW_FALLBACK).accent;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveId(item.id)}
                      onFocus={() => setActiveId(item.id)}
                      onClick={() => setActiveId(item.id)}
                      aria-pressed={isActive}
                      className="group relative flex w-full items-center justify-center py-3.5 text-center md:py-4"
                    >
                      {/* animated glowing accent line (decoration, left) */}
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-6 w-[3px] origin-center rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: accent,
                          transform: isActive
                            ? 'translateY(-50%) scaleY(1)'
                            : 'translateY(-50%) scaleY(0)',
                          opacity: isActive ? 1 : 0,
                          boxShadow: isActive ? `0 0 16px ${accent}` : 'none',
                        }}
                      />
                      <span
                        className="text-lg transition-colors duration-300 md:text-2xl"
                        style={{
                          color: isActive
                            ? '#ffffff'
                            : 'rgba(242,244,245,0.55)',
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        aria-hidden
                        className="absolute right-0 top-1/2 transition-all duration-300"
                        style={{
                          color: isActive ? accent : 'rgba(242,244,245,0)',
                          transform: isActive
                            ? 'translateY(-50%) translateX(0)'
                            : 'translateY(-50%) translateX(-6px)',
                        }}
                      >
                        →
                      </span>
                    </button>

                    {/* Mobile: tapping a service expands its preview inline. */}
                    {isActive && (
                      <div className="md:hidden">
                        <MobilePreview
                          key={item.id}
                          preview={SERVICE_PREVIEWS[item.id] ?? PREVIEW_FALLBACK}
                          category={cat.title}
                          lang={lang}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* RIGHT — sticky preview panel */}
      <div className="relative z-10 hidden md:block">
        <div className="sticky top-28 flex justify-center">
          <div
            ref={panelRef}
            className="relative aspect-[941/1672] h-[78vh] max-h-[780px] overflow-hidden rounded-3xl border border-white/10 bg-abyss/40"
          >
            {/* Parallax image stack. The frame matches the image's portrait
                ratio, so object-cover fills it with no crop. Small bleed gives
                the parallax room without exposing an edge. */}
            <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
              <div className="absolute inset-[-5%]">
                {/* two layers for crossfade */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={layerA}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={layerB}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover opacity-0"
                />
              </div>
            </div>

            {/* accent glow + legibility scrim */}
            <div ref={glowRef} aria-hidden className="absolute inset-0" />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/10"
            />

            {/* frame chrome */}
            <FrameChrome frame={preview.frame} accent={preview.accent} />

            {/* motif — the expertise signal */}
            <div className="absolute right-5 top-5">
              <Motif
                key={activeId}
                kind={preview.motif}
                accent={preview.accent}
              />
            </div>

            {/* content */}
            <div
              ref={contentRef}
              className="absolute inset-x-0 bottom-0 p-7 md:p-9"
            >
              <p
                className="mb-3 font-mono text-label"
                style={{ color: preview.accent }}
              >
                {categoryTitle}
              </p>
              <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {active?.label}
              </h3>
              <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-light/70 md:text-base">
                {preview.desc[lang]}
              </p>

              <div className="mt-6 flex gap-3">
                {preview.metrics.map((m, i) => (
                  <div
                    key={i}
                    data-metric
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm"
                  >
                    <span
                      data-count={m.value}
                      className="block text-xl font-semibold text-white md:text-2xl"
                    >
                      {m.value}
                    </span>
                    <span className="mt-0.5 block font-mono text-[0.7rem] tracking-wider text-light/50">
                      {m.label[lang]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Count-up: animate the numeric part, keep prefix/suffix ─────── */
function animateCount(el: HTMLElement, text: string) {
  const match = text.match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
  if (!match) {
    el.textContent = text;
    return;
  }
  const [, prefix, numStr, suffix] = match;
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  const target = parseFloat(numStr.replace(/,/g, ''));
  const grouped = numStr.includes(',');
  const proxy = { v: 0 };
  gsap.to(proxy, {
    v: target,
    duration: 0.9,
    ease: EASE,
    overwrite: 'auto',
    onUpdate: () => {
      let n = proxy.v.toFixed(decimals);
      if (grouped) n = Number(n).toLocaleString('en-US');
      el.textContent = `${prefix}${n}${suffix}`;
    },
  });
}

/* ── Frame chrome: subtle browser bar / phone notch ────────────── */
function FrameChrome({
  frame,
  accent,
}: {
  frame: ServicePreview['frame'];
  accent: string;
}) {
  if (frame === 'browser') {
    return (
      <div
        aria-hidden
        className="absolute inset-x-4 top-4 flex items-center gap-2 rounded-lg border border-white/10 bg-void/40 px-3 py-2 backdrop-blur-sm"
      >
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span
          className="ml-2 h-2 flex-1 rounded-full"
          style={{ background: `${accent}33` }}
        />
      </div>
    );
  }
  if (frame === 'phone') {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-4 h-5 w-24 -translate-x-1/2 rounded-full border border-white/10 bg-void/50 backdrop-blur-sm"
      />
    );
  }
  return null;
}

/* ── Mobile: inline preview that expands under the tapped service. ─ */
function MobilePreview({
  preview,
  category,
  lang,
}: {
  preview: ServicePreview;
  category: string;
  lang: 'tr' | 'en';
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 14,
        duration: 0.5,
        ease: EASE,
      });
      ref.current
        ?.querySelectorAll<HTMLElement>('[data-count]')
        .forEach((el) => animateCount(el, el.dataset.count ?? ''));
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="mb-2 mt-3 flex justify-center">
      <div className="relative aspect-[941/1672] h-[60vh] max-h-[540px] overflow-hidden rounded-2xl border border-white/10 bg-abyss/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview.image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at 50% 35%, ${preview.accent}44, transparent 70%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/10"
      />
      <FrameChrome frame={preview.frame} accent={preview.accent} />
      <div className="absolute right-4 top-4">
        <Motif kind={preview.motif} accent={preview.accent} />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="mb-2 font-mono text-label" style={{ color: preview.accent }}>
          {category}
        </p>
        <p className="max-w-[38ch] text-sm leading-relaxed text-light/75">
          {preview.desc[lang]}
        </p>
        <div className="mt-4 flex gap-2.5">
          {preview.metrics.map((m, i) => (
            <div
              key={i}
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-sm"
            >
              <span
                data-count={m.value}
                className="block text-lg font-semibold text-white"
              >
                {m.value}
              </span>
              <span className="mt-0.5 block font-mono text-[0.65rem] tracking-wider text-light/50">
                {m.label[lang]}
              </span>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

/* ── Ambient background: barely-there gradient + cyan sweep ─────── */
function BackgroundSweep() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-sweep]',
          { xPercent: -30, opacity: 0 },
          {
            xPercent: 130,
            opacity: 0.5,
            duration: 9,
            ease: 'sine.inOut',
            repeat: -1,
            repeatDelay: 5,
            yoyo: false,
          },
        );
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        data-sweep
        className="absolute -inset-y-1/2 left-0 w-1/3 blur-3xl"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(10,220,228,0.10), transparent)',
        }}
      />
    </div>
  );
}

/* ── Motifs: small animated expertise signals ──────────────────── */
function Motif({ kind, accent }: { kind: PreviewMotif; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (kind === 'graph') {
          gsap.fromTo(
            '[data-bar]',
            { scaleY: 0.15 },
            {
              scaleY: 1,
              transformOrigin: 'bottom',
              duration: 1,
              ease: 'power2.out',
              stagger: 0.09,
              repeat: -1,
              yoyo: true,
            },
          );
        } else if (kind === 'nodes') {
          gsap.to('[data-node]', {
            opacity: 0.35,
            duration: 0.9,
            ease: 'sine.inOut',
            stagger: { each: 0.15, repeat: -1, yoyo: true },
          });
        } else if (kind === 'pipeline') {
          gsap.fromTo(
            '[data-card]',
            { x: 0 },
            { x: 34, duration: 1.4, ease: 'power2.inOut', repeat: -1, yoyo: true },
          );
        } else if (kind === 'film') {
          gsap.fromTo(
            '[data-playhead]',
            { x: 0 },
            { x: 44, duration: 2, ease: 'none', repeat: -1 },
          );
        } else if (kind === 'camera') {
          gsap.fromTo(
            '[data-reticle]',
            { scale: 0.8, opacity: 0.4 },
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            },
          );
        }
      });
    },
    { scope: ref, dependencies: [kind, accent] },
  );

  const box =
    'flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-void/40 backdrop-blur-md';

  return (
    <div ref={ref} className={box}>
      {kind === 'graph' && (
        <svg viewBox="0 0 40 32" className="h-7 w-8">
          {[6, 14, 22, 30].map((x, i) => (
            <rect
              key={i}
              data-bar
              x={x}
              y={4}
              width="5"
              height="24"
              rx="1.5"
              fill={accent}
            />
          ))}
        </svg>
      )}
      {kind === 'nodes' && (
        <svg viewBox="0 0 40 40" className="h-8 w-8">
          <line x1="8" y1="8" x2="32" y2="14" stroke={accent} strokeWidth="1" opacity="0.5" />
          <line x1="8" y1="8" x2="14" y2="32" stroke={accent} strokeWidth="1" opacity="0.5" />
          <line x1="32" y1="14" x2="30" y2="32" stroke={accent} strokeWidth="1" opacity="0.5" />
          {[
            [8, 8],
            [32, 14],
            [14, 32],
            [30, 32],
          ].map(([cx, cy], i) => (
            <circle key={i} data-node cx={cx} cy={cy} r="3.2" fill={accent} />
          ))}
        </svg>
      )}
      {kind === 'pipeline' && (
        <svg viewBox="0 0 48 32" className="h-7 w-9">
          <rect x="2" y="4" width="12" height="24" rx="2" fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
          <rect x="34" y="4" width="12" height="24" rx="2" fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
          <rect data-card x="4" y="10" width="8" height="6" rx="1.5" fill={accent} />
        </svg>
      )}
      {kind === 'film' && (
        <svg viewBox="0 0 48 32" className="h-7 w-9">
          <rect x="2" y="8" width="44" height="16" rx="2" fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
          {[6, 12, 18, 24, 30, 36].map((x) => (
            <rect key={x} x={x} y="11" width="3" height="3" fill={accent} opacity="0.4" />
          ))}
          <rect data-playhead x="3" y="6" width="2" height="20" rx="1" fill={accent} />
        </svg>
      )}
      {kind === 'camera' && (
        <svg viewBox="0 0 40 40" className="h-8 w-8">
          <g data-reticle stroke={accent} strokeWidth="1.4" fill="none">
            <path d="M6 12 V6 H12" />
            <path d="M28 6 H34 V12" />
            <path d="M34 28 V34 H28" />
            <path d="M12 34 H6 V28" />
            <circle cx="20" cy="20" r="5" />
          </g>
        </svg>
      )}
    </div>
  );
}
