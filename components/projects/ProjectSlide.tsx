'use client';

import { useEffect, useRef } from 'react';
import type { Project, SliderConfig } from '@/types/projects';

/** The live element handles the render loop drives every frame. */
export type SlideParts = {
  scene: HTMLElement;
  image: HTMLElement;
  overlay: HTMLElement;
  title: HTMLElement;
  /** The heading stack — carries the rotate/skew distortion. */
  stack: HTMLElement;
  /** The two chromatic ghosts behind the crisp white base. */
  red: HTMLElement;
  cyan: HTMLElement;
};

type Props = {
  index: number;
  project: Project;
  config: SliderConfig;
  register: (index: number, parts: SlideParts) => void;
};

/** Shared typography so all three chromatic layers align pixel-for-pixel. */
const HEADING =
  'text-[clamp(2.5rem,9vw,9rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em]';

export function ProjectSlide({ index, project, config, register }: Props) {
  const scene = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const red = useRef<HTMLSpanElement>(null);
  const cyan = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const refs = [scene, image, overlay, title, stack, red, cyan];
    const els = refs.map((r) => r.current);
    if (els.every(Boolean)) {
      const [s, i, o, t, st, r, c] = els as HTMLElement[];
      register(index, {
        scene: s,
        image: i,
        overlay: o,
        title: t,
        stack: st,
        red: r,
        cyan: c,
      });
    }
  }, [index, register]);

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      style={{ perspective: `${config.perspective}px` }}
      aria-label={project.title}
    >
      <div
        ref={scene}
        className="absolute inset-0 [transform-style:preserve-3d] will-change-transform"
      >
        <div
          ref={image}
          className="absolute inset-0 [backface-visibility:hidden] will-change-transform"
        >
          {/* Phones get the portrait cut; desktop is untouched (the img src
              is the default source, only overridden below 768px). */}
          <picture>
            {project.imageMobile && (
              <source
                media="(max-width: 767px)"
                srcSet={project.imageMobile}
              />
            )}
            <img
              src={project.image}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
            />
          </picture>
        </div>

        <div
          ref={overlay}
          className="absolute inset-0 bg-void will-change-[opacity]"
          style={{ opacity: config.overlayOpacity }}
        />

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div
            ref={title}
            className="text-center [transform-style:preserve-3d] will-change-transform"
          >
            <p className="mb-4 font-mono text-label uppercase tracking-[0.28em] text-neon/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
              {project.subtitle}
            </p>

            {/* Chromatic stack: red + cyan ghosts sit BEHIND the white base, so
                at rest (opacity 0) the title is perfectly crisp white. This box
                also carries the rotate/skew distortion. */}
            <div
              ref={stack}
              className="relative inline-block [transform-style:preserve-3d] will-change-transform"
            >
              <span
                ref={red}
                aria-hidden
                className={`${HEADING} absolute inset-0 will-change-transform`}
                style={{ color: 'rgb(255,40,90)', opacity: 0 }}
              >
                {project.title}
              </span>
              <span
                ref={cyan}
                aria-hidden
                className={`${HEADING} absolute inset-0 will-change-transform`}
                style={{ color: 'rgb(40,220,255)', opacity: 0 }}
              >
                {project.title}
              </span>
              <h2
                tabIndex={0}
                className={`${HEADING} relative text-light outline-none [text-shadow:0_6px_34px_rgba(0,0,0,0.5)]`}
              >
                {project.title}
              </h2>
            </div>

            <p className="mx-auto mt-6 max-w-[44ch] text-base leading-relaxed text-light/70 [text-shadow:0_2px_16px_rgba(0,0,0,0.65)] md:text-lg">
              {project.description}
            </p>
            {project.href && (
              <a
                href={project.href}
                className="mt-8 inline-flex h-11 w-11 items-center justify-center rounded-full border border-light/40 text-light transition-colors duration-300 hover:border-neon hover:text-neon"
                aria-label={project.title}
              >
                ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
