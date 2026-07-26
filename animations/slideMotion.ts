import type { SliderConfig } from '@/types/projects';
import { clamp, softClamp } from '@/utils/math';
import { DISTORT_BOOST } from '@/constants/slider';

/**
 * Signed distance of a slide from the viewport centre, in viewport-heights:
 *   -1 = just below, entering   0 = centred, active   +1 = exited past the top.
 */
export type SlideInput = {
  progress: number;
  /** Normalised scroll velocity (~ -0.4..0.4 on a hard flick). */
  velocity: number;
  /** Scroll-active envelope, 0 (stopped/flat) .. 1 (actively scrolling). */
  activity: number;
  /** Mouse position, -1..1 on each axis. */
  mouseX: number;
  mouseY: number;
};

export type SlideMotion = {
  scene: string;
  image: string;
  imageFilter: string;
  overlayOpacity: number;
  title: string;
  /** Distortion (rotate/skew) applied to the heading stack alone. */
  titleDistort: string;
  titleOpacity: number;
};

// Aesthetic weights (named, not magic). These shape how each channel reacts.
const IMAGE_PARALLAX = 0.45; // image lags the scroll
const TITLE_PARALLAX = 1.25; // title drifts further/independently
const VELOCITY_TILT = 5.5; // deg of rotateY per unit velocity
const VELOCITY_STRETCH = 0.35; // image vertical stretch per unit velocity
const INACTIVE_BLUR = 7; // px on a fully off-centre slide
const INACTIVE_DIM = 0.5; // brightness reduction on inactive slides
// Permanent 3D pose the heading always rests in (the signature cinematic lean).
const BASE_TILT_X = 6; // forward tilt
const BASE_TILT_Z = -6; // in-plane slant
// Extra distortion added by scroll velocity, on top of the baseline pose.
const DIST_ROT_Z = 6; // extra slant
const DIST_ROT_Y = 13; // perspective turn
const DIST_SKEW = 6; // shear

export function computeSlideMotion(
  { progress, velocity, activity, mouseX, mouseY }: SlideInput,
  c: SliderConfig,
): SlideMotion {
  const active = clamp(1 - Math.abs(progress), 0, 1);
  const inactive = 1 - active;
  const absVel = Math.abs(velocity);

  // Scene: a gentle tilt from scroll offset + mouse, plus a velocity lean.
  const rotateX = softClamp(progress * c.tilt, c.tilt) + mouseY * c.mouseTilt;
  const rotateY = -mouseX * c.mouseTilt - velocity * VELOCITY_TILT;
  const scene = `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;

  // Image sits in negative Z; scale up to close the perspective gap it opens.
  const coverScale = (c.perspective + c.depth) / c.perspective;
  const zoom = coverScale * (1 + c.zoom * active);
  const stretchY = zoom * (1 + absVel * VELOCITY_STRETCH);
  const imageY = progress * c.parallax * IMAGE_PARALLAX;
  const image = `translate3d(0, ${imageY.toFixed(1)}px, ${(-c.depth).toFixed(
    0,
  )}px) scale(${zoom.toFixed(4)}, ${stretchY.toFixed(4)})`;

  const grayscale = c.grayscale ? inactive : 0;
  const imageFilter = `blur(${(inactive * INACTIVE_BLUR).toFixed(
    2,
  )}px) brightness(${(1 - inactive * INACTIVE_DIM).toFixed(
    3,
  )}) grayscale(${grayscale.toFixed(3)})`;

  const overlayOpacity = clamp(c.overlayOpacity + inactive * 0.35, 0, 0.92);

  // Title wrapper: positions the block in positive Z (a compensating down-scale
  // keeps its size stable) — no rotation here, so subtitle/description stay level.
  const titleScale = c.perspective / (c.perspective + c.depth);
  const titleY = progress * -c.parallax * TITLE_PARALLAX;
  const title = `translate3d(0, ${titleY.toFixed(1)}px, ${c.depth.toFixed(
    0,
  )}px) scale(${titleScale.toFixed(4)})`;

  // Distortion goes on the heading stack alone and only while scrolling: the
  // `activity` envelope carries the 3D lean (so it's flat at rest), while a
  // soft-clamped velocity adds the perspective turn + extra slant/shear —
  // saturating so a flick never turns it into a glitch.
  const velInt = softClamp(velocity * DISTORT_BOOST, 1); // -1..1
  const rotX = activity * BASE_TILT_X;
  const rotY = velInt * DIST_ROT_Y;
  const rotZ = activity * BASE_TILT_Z + velInt * DIST_ROT_Z;
  const skew = velInt * DIST_SKEW;
  const titleDistort = `rotateX(${rotX.toFixed(3)}deg) rotateY(${rotY.toFixed(
    3,
  )}deg) rotateZ(${rotZ.toFixed(3)}deg) skewY(${skew.toFixed(3)}deg)`;

  const titleOpacity = clamp(active * 1.35, 0, 1);

  return {
    scene,
    image,
    imageFilter,
    overlayOpacity,
    title,
    titleDistort,
    titleOpacity,
  };
}

/** The cheap resting state for slides parked outside the render window. */
export const PARKED_MOTION: SlideMotion = {
  scene: 'rotateX(0deg) rotateY(0deg)',
  image: 'translate3d(0,0,0) scale(1,1)',
  imageFilter: 'blur(7px) brightness(0.5) grayscale(1)',
  overlayOpacity: 0.85,
  title: 'translate3d(0,0,0) scale(1)',
  titleDistort: 'rotateY(0deg) rotateZ(0deg) skewY(0deg)',
  titleOpacity: 0,
};
