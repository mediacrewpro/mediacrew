'use client';

import { useEffect, useRef } from 'react';

export type Vec2 = { x: number; y: number };

/**
 * Tracks the pointer as a normalised (-1..1) vector without touching React
 * state — the render loop reads `target` and eases `value` toward it every
 * frame. Idle on touch / when disabled, so the scene simply stays level.
 */
export function useMouseTilt(enabled: boolean) {
  const target = useRef<Vec2>({ x: 0, y: 0 });
  const value = useRef<Vec2>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  return { target, value };
}
