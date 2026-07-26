'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

// --- Tuning ----------------------------------------------------------------
/** A touch of lag so the dot glides rather than sticks. */
const FOLLOW = { duration: 0.32, ease: 'power3' } as const;
const REST_SCALE = 1;
const HOVER_SCALE = 1.9;
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary';

/**
 * CURSOR CONTROLLER. Deliberately minimal — a small, clean dot that glides
 * with the pointer. The star of the show is the water it disturbs (WaveField);
 * the cursor just marks where the ripples are born. GPU transforms only.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // No custom cursor on touch or under reduced motion.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setEnabled(fine.matches && !reduced.matches);
    sync();
    fine.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      fine.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  // Hide the OS cursor everywhere (class on <html> beats the UA pointer). See
  // globals.css.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('custom-cursor');
    return () => document.documentElement.classList.remove('custom-cursor');
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !dot.current) return;
    const node = dot.current;
    gsap.set(node, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    const xTo = gsap.quickTo(node, 'x', FOLLOW);
    const yTo = gsap.quickTo(node, 'y', FOLLOW);

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const interactive = !!(e.target as HTMLElement | null)?.closest?.(
        INTERACTIVE,
      );
      gsap.to(node, {
        scale: interactive ? HOVER_SCALE : REST_SCALE,
        duration: 0.3,
        ease: 'power3.out',
      });
    };
    const leave = () => gsap.to(node, { opacity: 0, duration: 0.25 });
    const enter = () => gsap.to(node, { opacity: 1, duration: 0.25 });

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over, { passive: true });
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      data-cursor
      aria-hidden
      style={{ viewTransitionName: 'site-cursor' }}
      className="pointer-events-none fixed left-0 top-0 z-[60] h-2.5 w-2.5 rounded-full bg-white/90 shadow-[0_0_10px_2px_rgba(79,217,255,0.4)] ring-1 ring-[#4fd9ff]/40"
    />
  );
}
