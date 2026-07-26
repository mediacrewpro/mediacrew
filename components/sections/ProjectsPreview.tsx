'use client';

import { Link } from '@/i18n/navigation';
import { AuroraButton } from '@/components/ui/AuroraButton';

export type ProjectItem = {
  key: string;
  title: string;
  meta: string;
  image: string;
};

type Props = {
  label: string;
  title: string;
  viewAll: string;
  projects: ProjectItem[];
};

/**
 * A taste of the work on the home page — a few real projects, then a button
 * through to the full list. Each card carries its project image. Kept static
 * (no scroll-reveal): this section sits after a pinned carousel, where a
 * ScrollTrigger fade was firing at the wrong point and leaving cards hidden.
 */
export function ProjectsPreview({ label, title, viewAll, projects }: Props) {
  return (
    <section className="px-6 py-24 md:px-16 md:py-36">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center md:mb-16">
          <p className="mb-4 font-mono text-label text-signal">{label}</p>
          <h2 className="text-display mx-auto max-w-[16ch] text-light">
            {title}
          </h2>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.key}
              href="/projects"
              data-project-card
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-petrol/40 bg-abyss/30 transition-all duration-500 hover:-translate-y-1.5 hover:border-neon/60"
            >
              <img
                src={project.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]"
              />
              {/* Scrim keeps the name legible over the photo. */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/60 to-transparent p-6 pt-24">
                <span className="font-mono text-label text-teal">
                  {project.meta}
                </span>
                <h3 className="mt-1 text-2xl font-medium tracking-tight text-light transition-colors duration-300 group-hover:text-neon md:text-3xl">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex justify-center md:mt-20">
          <AuroraButton href="/projects">{viewAll}</AuroraButton>
        </div>
      </div>
    </section>
  );
}
