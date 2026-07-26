/** One entry in the cinematic slider. Text is i18n; image/href are static. */
export type Project = {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href?: string;
};

/** Every knob of the slider, so nothing is a magic number at the call site. */
export type SliderConfig = {
  /** CSS perspective distance (px). Larger = flatter. */
  perspective: number;
  /** Z separation (px) between the receding image and the forward title. */
  depth: number;
  /** Max scene rotateX (deg) from a slide's scroll offset. */
  tilt: number;
  /** Image vertical parallax travel (px) across a slide's pass. */
  parallax: number;
  /** Extra scale added to the centred (active) image. */
  zoom: number;
  /** Base dark overlay opacity above the image. */
  overlayOpacity: number;
  /** Max chromatic-aberration offset (px), only while scrolling fast. */
  rgbStrength: number;
  /** Max scene rotation (deg) from mouse position. */
  mouseTilt: number;
  /** Desaturate inactive slides. */
  grayscale: boolean;
  /** Snap the scroll to whole slides. */
  snap: boolean;
  showCounter: boolean;
  showProgress: boolean;
  showHint: boolean;
};
