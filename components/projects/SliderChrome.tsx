'use client';

import type { RefObject } from 'react';
import type { SliderConfig } from '@/types/projects';

type Props = {
  total: number;
  hint: string;
  config: SliderConfig;
  /** The current-slide number; the loop writes its textContent. */
  counterRef: RefObject<HTMLSpanElement | null>;
  /** The progress fill; the loop scales it on Y. */
  progressRef: RefObject<HTMLDivElement | null>;
  /** The scroll hint; the loop fades it on first scroll. */
  hintRef: RefObject<HTMLDivElement | null>;
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Fixed overlays that frame the slider — counter, progress rail, scroll hint.
 *  All updated imperatively via refs, so they never re-render. */
export function SliderChrome({
  total,
  hint,
  config,
  counterRef,
  progressRef,
  hintRef,
}: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {config.showCounter && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 font-mono text-label tracking-widest text-light/70 md:left-10">
          <span ref={counterRef} className="text-light">
            {pad(1)}
          </span>
          <span className="mx-1 text-light/30">/</span>
          <span>{pad(total)}</span>
        </div>
      )}

      {config.showProgress && (
        <div className="absolute right-6 top-1/2 h-40 w-px -translate-y-1/2 overflow-hidden bg-light/15 md:right-10">
          <div
            ref={progressRef}
            className="h-full w-full origin-top bg-neon"
            style={{ transform: 'scaleY(0)' }}
          />
        </div>
      )}

      {config.showHint && (
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-label uppercase tracking-[0.3em] text-light/60"
        >
          {hint}
        </div>
      )}
    </div>
  );
}
