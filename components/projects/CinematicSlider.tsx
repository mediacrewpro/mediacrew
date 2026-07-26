'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import type { Project, SliderConfig } from '@/types/projects';
import { ACTIVITY, CHROMA, DEFAULT_SLIDER_CONFIG, MOUSE_DAMP, RENDER_WINDOW } from '@/constants/slider';
import { clamp, damp, softClamp } from '@/utils/math';
import { computeSlideMotion, PARKED_MOTION } from '@/animations/slideMotion';
import { ProjectSlide, type SlideParts } from './ProjectSlide';
import { SliderChrome } from './SliderChrome';
import { useLenis } from '@/hooks/useLenis';
import { useMouseTilt } from '@/hooks/useMouseTilt';

type Props = { projects: Project[]; hint: string } & Partial<SliderConfig>;

const VELOCITY_CLAMP = 0.6;

export function CinematicSlider({ projects, hint, ...overrides }: Props) {
  const config: SliderConfig = { ...DEFAULT_SLIDER_CONFIG, ...overrides };

  // The Projects page always runs the full cinematic experience for every
  // visitor — no GPU/perf or reduced-motion gating, by product decision. The
  // animations here must never be stripped out.
  const cinematic = true;

  const partsRef = useRef<(SlideParts | null)[]>([]);
  const parkedRef = useRef<boolean[]>([]);
  const register = useCallback((i: number, parts: SlideParts) => {
    partsRef.current[i] = parts;
  }, []);

  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const lenisRef = useLenis(cinematic, config.snap);
  const mouse = useMouseTilt(cinematic && config.mouseTilt > 0);

  // The single render loop: read smoothed scroll, drive every slide via refs.
  useEffect(() => {
    if (!cinematic) return;
    const total = projects.length;
    let last = window.scrollY;
    let velocity = 0;
    let currentIndex = -1;

    // Scroll-active envelope (global): 0 at rest → flat crisp white; 1 while
    // scrolling → full lean + chromatic split. A power3.out tween eases it back
    // to 0 on stop.
    const activity = { v: 0 };
    let settle: gsap.core.Tween | null = null;

    const render = (_t: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      const vh = window.innerHeight;
      const scroll = window.scrollY;
      const base = scroll / vh;

      const raw = (scroll - last) / vh;
      last = scroll;
      velocity = clamp(damp(velocity, raw, 9, dt), -VELOCITY_CLAMP, VELOCITY_CLAMP);

      mouse.value.current.x = damp(mouse.value.current.x, mouse.target.current.x, MOUSE_DAMP, dt);
      mouse.value.current.y = damp(mouse.value.current.y, mouse.target.current.y, MOUSE_DAMP, dt);

      // Activity envelope: rise while scrolling, ease to 0 (flat/crisp) on stop.
      if (Math.abs(velocity) > CHROMA.stopVelocity) {
        if (settle) {
          settle.kill();
          settle = null;
        }
        activity.v = damp(activity.v, 1, ACTIVITY.rise, dt);
      } else if (activity.v > 0.01 && !settle) {
        settle = gsap.to(activity, {
          v: 0,
          duration: ACTIVITY.settle,
          ease: 'power3.out',
          onComplete: () => {
            settle = null;
          },
        });
      }
      const act = activity.v;
      const velInt = softClamp(velocity * CHROMA.boost, 1);

      // Chromatic split scales with activity → invisible & crisp at rest.
      const maxSep = config.rgbStrength || CHROMA.max;
      const sep = act * (maxSep * CHROMA.baseRatio) + velInt * (maxSep * (1 - CHROMA.baseRatio));
      const chromaOpacity = clamp(act * CHROMA.opacity, 0, 1);
      const redX = sep.toFixed(2);
      const cyanX = (-sep).toFixed(2);

      for (let i = 0; i < total; i++) {
        const p = partsRef.current[i];
        if (!p) continue;
        const progress = base - i;

        if (Math.abs(progress) > RENDER_WINDOW) {
          if (!parkedRef.current[i]) {
            parkedRef.current[i] = true;
            apply(p, PARKED_MOTION);
            p.red.style.opacity = '0';
            p.cyan.style.opacity = '0';
          }
          continue;
        }
        parkedRef.current[i] = false;
        apply(
          p,
          computeSlideMotion(
            {
              progress,
              velocity,
              activity: act,
              mouseX: mouse.value.current.x,
              mouseY: mouse.value.current.y,
            },
            config,
          ),
        );
        p.red.style.transform = `translate3d(${redX}px,0,0)`;
        p.cyan.style.transform = `translate3d(${cyanX}px,0,0)`;
        p.red.style.opacity = String(chromaOpacity);
        p.cyan.style.opacity = String(chromaOpacity);
      }

      const index = clamp(Math.round(base), 0, total - 1);
      if (index !== currentIndex && counterRef.current) {
        currentIndex = index;
        counterRef.current.textContent = String(index + 1).padStart(2, '0');
      }
      const maxScroll = vh * (total - 1) || 1;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${clamp(scroll / maxScroll, 0, 1).toFixed(4)})`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(clamp(1 - base * 1.4, 0, 1));
      }
    };

    gsap.ticker.add(render);
    return () => gsap.ticker.remove(render);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinematic, projects.length]);

  // Keyboard navigation between whole slides.
  useEffect(() => {
    if (!cinematic) return;
    const onKey = (e: KeyboardEvent) => {
      const vh = window.innerHeight;
      const here = Math.round(window.scrollY / vh);
      const step = ['ArrowDown', 'PageDown', ' '].includes(e.key)
        ? 1
        : ['ArrowUp', 'PageUp'].includes(e.key)
          ? -1
          : e.key === 'Home'
            ? -here
            : e.key === 'End'
              ? projects.length - 1 - here
              : 0;
      if (!step) return;
      e.preventDefault();
      const target = clamp(here + step, 0, projects.length - 1);
      lenisRef.current?.scrollTo(target * vh, { duration: 1.1 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cinematic, projects.length, lenisRef]);

  return (
    <>
      <div>
        {projects.map((project, i) => (
          <ProjectSlide
            key={project.key}
            index={i}
            project={project}
            config={config}
            register={register}
          />
        ))}
      </div>
      <SliderChrome
        total={projects.length}
        hint={hint}
        config={config}
        counterRef={counterRef}
        progressRef={progressRef}
        hintRef={hintRef}
      />
    </>
  );
}

/** Push a computed motion frame onto a slide's elements — transform/opacity/
 *  filter only, so it stays on the compositor. */
function apply(p: SlideParts, m: ReturnType<typeof computeSlideMotion>) {
  p.scene.style.transform = m.scene;
  p.image.style.transform = m.image;
  p.image.style.filter = m.imageFilter;
  p.overlay.style.opacity = String(m.overlayOpacity);
  p.title.style.transform = m.title;
  p.title.style.opacity = String(m.titleOpacity);
  p.stack.style.transform = m.titleDistort;
}
