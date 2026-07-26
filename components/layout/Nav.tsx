'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { AppLocale, AppPathname } from '@/i18n/routing';
import { AuroraButton } from '@/components/ui/AuroraButton';

export type NavItem = { href: AppPathname; label: string };

type NavProps = {
  items: NavItem[];
  openLabel: string;
  closeLabel: string;
  switchLanguageLabel: string;
  ctaLabel: string;
};

/** Kadraj easing — matches --ease-kadraj. */
const EASE = [0.16, 1, 0.3, 1] as const;

export function Nav({
  items,
  openLabel,
  closeLabel,
  switchLanguageLabel,
  ctaLabel,
}: NavProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  // Desktop nav: which link the sliding pill sits behind. Falls back to the
  // active route so the current page is marked even before any hover.
  const [navHover, setNavHover] = useState<string | null>(null);
  const pathname = usePathname();
  const routeParams = useParams();
  const locale = useLocale() as AppLocale;

  // Switching language must carry the current route's params, otherwise a
  // dynamic pathname like /services/[slug] has no slug to fill and next-intl
  // throws. Passing params is harmless for static routes (they have none).
  const switchHref = {
    pathname,
    params: routeParams,
  } as { pathname: AppPathname; params: Record<string, string | string[]> };
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const other: AppLocale = locale === 'tr' ? 'en' : 'tr';
  // The pill rests on the current route when nothing is hovered.
  const activeHref = items.find((i) => i.href === pathname)?.href ?? null;

  // Route change closes the menu — otherwise it hangs over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus(); // return focus where it came from
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Move focus into the panel so keyboard users aren't left behind the overlay.
  useEffect(() => {
    if (!open) return;
    const first = panel.current?.querySelector<HTMLElement>('a[href]');
    first?.focus();
  }, [open]);

  return (
    <>
      <header
        data-nav
        // Anchors the header across route transitions (see globals.css)
        style={{ viewTransitionName: 'site-header' }}
        className="fixed inset-x-0 top-0 z-30 px-4 pt-3 md:px-6 md:pt-4"
      >
        {/* Floating pill — frosted glass, rounded-full, detached from the edge. */}
        <div className="group relative mx-auto flex max-w-7xl items-center justify-between gap-6 overflow-hidden rounded-full border border-petrol/50 px-5 py-2 md:px-7">
          {/* Semi-opaque tint instead of backdrop-blur. backdrop-filter forces
              Chrome to re-blur everything behind the fixed pill every frame
              (catastrophic over the playing video / while scrolling); a solid
              translucent fill reads nearly identical and costs nothing. */}
          <div aria-hidden className="absolute inset-0 bg-void/80" />
          {/* Ambient aurora that turns on its own, always — a single conic
              gradient spun by a transform (composited, no per-frame repaint),
              clipped to the pill. Replaces the old cursor-tracked glow. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="h-full w-full animate-[spin_18s_linear_infinite] opacity-55 motion-reduce:animate-none"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(40,199,250,0.6) 45deg, transparent 120deg, rgba(74,222,128,0.45) 190deg, transparent 250deg, rgba(30,144,255,0.55) 310deg, transparent 360deg)',
              }}
            />
          </div>

          <Link
            href="/"
            aria-label="MediaCrew"
            className="group/logo relative z-10 flex items-center"
          >
            <img
              src="/logo-white.png"
              alt="MediaCrew"
              className="h-5 w-auto transition-transform duration-500 group-hover/logo:scale-105 md:h-6"
            />
          </Link>

          {/* Desktop: the links live in the bar. Below lg they'd crowd, so the
              menu button + fullscreen overlay take over. A single pill slides
              behind the hovered link (or the active one at rest). */}
          <nav
            className="relative z-10 hidden items-center gap-1 lg:flex"
            onMouseLeave={() => setNavHover(null)}
          >
            {items.map((item) => {
              const isActive = pathname === item.href;
              const showPill = (navHover ?? activeHref) === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onMouseEnter={() => setNavHover(item.href)}
                  onFocus={() => setNavHover(item.href)}
                  className={`relative rounded-full px-4 py-1.5 font-mono text-label font-medium uppercase tracking-wider transition-colors duration-300 ${
                    showPill ? 'text-void' : 'text-white hover:text-white'
                  }`}
                >
                  {showPill && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-white"
                      style={{
                        boxShadow: '0 0 22px -6px rgba(10,220,228,0.55)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 34,
                        mass: 0.7,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="relative z-10 flex items-center gap-4 md:gap-5">
            <Link
              href={switchHref}
              locale={other}
              aria-label={switchLanguageLabel}
              className="font-mono text-label text-light/60 transition-colors hover:text-light"
            >
              {other.toUpperCase()}
            </Link>

            {/* Accent CTA — same aurora button as the rest of the site. */}
            <span className="hidden font-mono font-medium lg:inline-flex">
              <AuroraButton href="/contact" size="sm">
                {ctaLabel}
              </AuroraButton>
            </span>

            {/* Menu button is mobile/tablet only now. */}
            <button
              ref={trigger}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="main-menu"
              className="font-mono text-label text-light lg:hidden"
            >
              {open ? closeLabel : openLabel}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="main-menu"
            ref={panel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-20 flex flex-col justify-center bg-void/98 px-6 md:px-16"
          >
            <nav>
              <ul onMouseLeave={() => setHovered(null)}>
                {items.map((item, i) => {
                  const isActive = pathname === item.href;
                  // The Kadraj move: what you look at is what stays in focus.
                  const dimmed = hovered !== null && hovered !== item.href;

                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 32, filter: 'blur(14px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{
                        opacity: 0,
                        y: -12,
                        filter: 'blur(10px)',
                        transition: { duration: 0.25, delay: i * 0.02 },
                      }}
                      transition={{
                        duration: 0.7,
                        delay: 0.08 + i * 0.055,
                        ease: EASE,
                      }}
                    >
                      <Link
                        href={item.href}
                        onMouseEnter={() => setHovered(item.href)}
                        onFocus={() => setHovered(item.href)}
                        className="group flex items-baseline justify-center gap-4 py-1 md:gap-8"
                        style={{
                          filter: dimmed ? 'blur(3px)' : 'blur(0px)',
                          opacity: dimmed ? 0.35 : 1,
                          transition:
                            'filter 400ms cubic-bezier(0.16,1,0.3,1), opacity 400ms cubic-bezier(0.16,1,0.3,1)',
                        }}
                      >
                        <span
                          className={`text-title uppercase transition-colors duration-300 ${
                            isActive
                              ? 'text-neon'
                              : 'text-light group-hover:text-neon'
                          }`}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 rounded-full bg-neon"
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
