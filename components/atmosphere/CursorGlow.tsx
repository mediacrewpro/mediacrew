'use client';

import { useEffect, useRef } from 'react';
import { useLowPerf } from '@/lib/perf';

type CursorGlowProps = {
  /**
   * blue → cyan → green. Swap for a brand palette in one line, e.g. the Kadraj
   * turquoises: ['#0A5266', '#0FC6C6', '#0ADCE4'].
   */
  colors?: [string, string, string];
};

const DEFAULT_COLORS: [string, string, string] = [
  '#1E90FF',
  '#28C7FA',
  '#4ADE80',
];

/**
 * Per-blob character of the trailing glow. The head leads, brighter and larger;
 * each following blob is smaller and fainter so the chain tapers to a point.
 * size is px; colorIdx picks from `colors`.
 */
const BLOBS = [
  { size: 190, opacity: 0.5, colorIdx: 1 },
  { size: 176, opacity: 0.45, colorIdx: 0 },
  { size: 160, opacity: 0.4, colorIdx: 1 },
  { size: 144, opacity: 0.34, colorIdx: 2 },
  { size: 128, opacity: 0.29, colorIdx: 1 },
  { size: 112, opacity: 0.24, colorIdx: 0 },
  { size: 96, opacity: 0.19, colorIdx: 1 },
  { size: 78, opacity: 0.14, colorIdx: 2 },
  { size: 60, opacity: 0.1, colorIdx: 1 },
  { size: 44, opacity: 0.07, colorIdx: 0 },
] as const;

/** Looser pull → the blobs spread out into a streak instead of a round cluster. */
const EASE = 0.22;

/**
 * A motion-triggered glow trail. Nothing shows while the pointer is still; as
 * it moves, a soft comet-like streak of light follows it, and it fades back to
 * nothing the moment the pointer stops. Purely decorative:
 *
 *   - Transform + opacity only per frame — the blobs' soft radial gradients are
 *     rasterised once, never re-blurred, so this stays off the freeze path.
 *   - No GPU (software renderer), reduced motion or touch → renders nothing.
 */
export function CursorGlow({ colors = DEFAULT_COLORS }: CursorGlowProps) {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lowPerf = useLowPerf();

  useEffect(() => {
    if (lowPerf) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!fine || reduced) return;

    const blobs = blobRefs.current;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let pmx = mx; // previous target, for the speed read
    let pmy = my;
    // Chain of points; each lags the one ahead to form the tail.
    const pts = BLOBS.map(() => ({ x: mx, y: my }));
    let intensity = 0; // 0 = hidden, 1 = fully lit — driven by pointer speed
    let vx = 0; // smoothed velocity → gives the tail its direction + stretch
    let vy = 0;
    let ndx = 0; // normalized travel direction, kept when the pointer pauses
    let ndy = 0;
    // Push the whole streak back along the travel direction so the glow starts
    // just behind the pointer instead of haloing around and ahead of it.
    const OFFSET = 96;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    let running = true;

    const tick = () => {
      // Velocity = how far the target moved since last frame. Still pointer → 0.
      const dx = mx - pmx;
      const dy = my - pmy;
      pmx = mx;
      pmy = my;
      vx = vx * 0.8 + dx * 0.2;
      vy = vy * 0.8 + dy * 0.2;
      const speed = Math.hypot(vx, vy);
      const angle = Math.atan2(vy, vx);
      if (speed > 0.01) {
        ndx = vx / speed;
        ndy = vy / speed;
      }
      // Elongate along the direction of travel — a round blob becomes a streak.
      const stretch = Math.min(speed * 0.06, 2.4);
      const sx = 1 + stretch;
      const sy = 1 / (1 + stretch * 0.55);

      // Rise quickly when moving, ebb gently to nothing when it stops.
      const target = Math.min(speed / 12, 1);
      const k = target > intensity ? 0.4 : 0.08;
      intensity += (target - intensity) * k;

      pts[0].x += (mx - pts[0].x) * EASE;
      pts[0].y += (my - pts[0].y) * EASE;
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * EASE;
        pts[i].y += (pts[i - 1].y - pts[i].y) * EASE;
      }

      for (let i = 0; i < blobs.length; i++) {
        const el = blobs[i];
        if (!el) continue;
        const b = BLOBS[i];
        // Shift each blob back along the travel direction so the streak trails
        // from behind the pointer, never haloing around or ahead of it.
        const gx = pts[i].x - ndx * OFFSET - b.size / 2;
        const gy = pts[i].y - ndy * OFFSET - b.size / 2;
        el.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(
          1,
        )}px, 0) rotate(${angle.toFixed(3)}rad) scale(${sx.toFixed(
          3,
        )}, ${sy.toFixed(3)})`;
        el.style.opacity = String(b.opacity * intensity);
      }

      if (running) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Don't burn frames on a glow nobody can see (backgrounded tab).
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [lowPerf]);

  // Software renderer / reduced motion / touch: no trail at all.
  if (lowPerf) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {BLOBS.map((b, i) => (
        <div
          key={i}
          ref={(el) => {
            blobRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 rounded-full opacity-0 will-change-transform"
          style={{
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${colors[b.colorIdx]} 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}
