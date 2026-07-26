'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { LENIS_LERP } from '@/constants/slider';

/**
 * Smooth, inertial scrolling scoped to one page. Lenis is driven off GSAP's
 * ticker (a single rAF for the whole app) and kept in lockstep with
 * ScrollTrigger. Returns a ref to the instance so callers can `scrollTo`.
 *
 * When `enabled` is false (reduced motion / touch-only fallbacks) native scroll
 * is left untouched.
 */
export function useLenis(enabled: boolean, snap: boolean) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      lerp: LENIS_LERP,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled, snap]);

  return lenisRef;
}
