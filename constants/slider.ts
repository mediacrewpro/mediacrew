import type { SliderConfig } from '@/types/projects';

/** Tuned defaults — restrained on purpose; the effect lives in the interpolation,
 *  not in big numbers. Override per-instance via the component's props. */
export const DEFAULT_SLIDER_CONFIG: SliderConfig = {
  perspective: 1300,
  depth: 90,
  tilt: 6,
  parallax: 130,
  zoom: 0.12,
  overlayOpacity: 0.5,
  rgbStrength: 12,
  mouseTilt: 3.5,
  grayscale: true,
  snap: false,
  showCounter: false,
  showProgress: true,
  showHint: true,
};

/** A slide further than this many viewport-heights from centre is parked in a
 *  cheap static state — no per-frame transforms for off-screen work. */
export const RENDER_WINDOW = 1.35;

/** Lenis smoothing — lower is heavier/slower to settle (Apple-like inertia). */
export const LENIS_LERP = 0.085;

/** Damping rate for the mouse tilt (higher = snappier follow). */
export const MOUSE_DAMP = 6;

/** Cinematic title chromatic distortion — layered R/C offset, not a text-shadow. */
export const CHROMA = {
  /** Fallback max separation (px) when config.rgbStrength is 0. */
  max: 12,
  /** Amplifies velocity before a soft-clamp saturates it to (-1..1), so the
   *  split is clearly visible at a normal scroll yet never runs away on a flick. */
  boost: 11,
  /** Damping rate while actively scrolling (follows velocity). */
  follow: 16,
  /** Below this |velocity| the scroll counts as stopped. Very low so even a
   *  slow drag keeps the effect alive; only a true stop settles it flat. */
  stopVelocity: 0.0007,
  /** Settle duration (s) with power3.out on stop — back to the baseline, not 0. */
  settle: 0.32,
  /** Peak opacity of the chromatic ghosts (fully saturated colour). */
  opacity: 1,
  /** Split (× rgbStrength) carried by the activity envelope — visible even on a
   *  slow scroll where the velocity component is tiny. */
  baseRatio: 0.5,
  /** Baseline opacity of that resting fringe. */
  baseOpacity: 0.55,
} as const;

/** Amplifies velocity for the title's geometric distortion (same soft-clamp).
 *  Higher = the perspective turn / shear reads even at a gentle scroll speed. */
export const DISTORT_BOOST = 11;

/** Scroll-active envelope (0 = stopped/flat, 1 = actively scrolling). Ramps up
 *  while scrolling, then eases back to 0 (power3.out) so the title returns to
 *  flat, crisp white the moment the scroll stops. */
export const ACTIVITY = {
  /** Damp rate ramping toward 1 while scrolling. */
  rise: 8,
  /** Ease-to-flat duration (s) on stop. */
  settle: 0.35,
} as const;
