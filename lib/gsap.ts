'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// SplitText/ScrollSmoother ship free with GSAP 3.13+, no club licence needed.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** The single easing the whole site animates on. Mirrors --ease-kadraj in CSS. */
export const KADRAJ_EASE = 'power3.out';

// Dev-only handles so a scroll timeline can be scrubbed from the console
// without relying on real scrolling (rAF stalls in background tabs).
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  Object.assign(window, { __gsap: gsap, __ScrollTrigger: ScrollTrigger });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
