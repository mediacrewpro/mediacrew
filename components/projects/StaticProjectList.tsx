import type { Project } from '@/types/projects';

type Props = { projects: Project[]; overlayOpacity: number };

/**
 * The no-frills path: reduced motion or a GPU-less browser gets full-screen
 * slides on plain native scroll — same content, no transforms, no smooth-scroll,
 * nothing that could stutter.
 */
export function StaticProjectList({ projects, overlayOpacity }: Props) {
  return (
    <div>
      {projects.map((project) => (
        <section
          key={project.key}
          className="relative flex h-screen w-full items-center justify-center overflow-hidden px-6 text-center"
          aria-label={project.title}
        >
          <img
            src={project.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-void"
            style={{ opacity: overlayOpacity }}
          />
          <div className="relative">
            <p className="mb-4 font-mono text-label uppercase tracking-[0.28em] text-neon/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
              {project.subtitle}
            </p>
            <h2 className="text-[clamp(2.5rem,9vw,8rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-light [text-shadow:0_6px_34px_rgba(0,0,0,0.5)]">
              {project.title}
            </h2>
            <p className="mx-auto mt-6 max-w-[44ch] text-base leading-relaxed text-light/70 [text-shadow:0_2px_16px_rgba(0,0,0,0.65)] md:text-lg">
              {project.description}
            </p>
            {project.href && (
              <a
                href={project.href}
                className="mt-8 inline-flex h-11 w-11 items-center justify-center rounded-full border border-light/40 text-light transition-colors hover:border-neon hover:text-neon"
                aria-label={project.title}
              >
                ↗
              </a>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
