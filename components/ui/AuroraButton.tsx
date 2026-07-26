'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type Props = {
  href: ComponentProps<typeof Link>['href'];
  children: ReactNode;
  /** 'md' for content CTAs, 'sm' for the compact navbar button. */
  size?: 'md' | 'sm';
  /** Extra classes for spacing/sizing at the call site. */
  className?: string;
};

const SIZES = {
  md: 'gap-3 px-7 py-3.5 text-sm hover:gap-5 md:text-base',
  sm: 'gap-2 px-5 py-2.5 text-label hover:gap-3.5',
} as const;

/**
 * The site's primary call-to-action: a translucent white pill whose interior
 * fills, on hover, with the same slowly rotating dark aurora as the navbar.
 * One component so every CTA reads identically.
 */
export function AuroraButton({
  href,
  children,
  size = 'md',
  className = '',
}: Props) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center overflow-hidden rounded-full border border-neon/60 bg-white/70 text-center text-void transition-all duration-300 hover:border-neon hover:text-light ${SIZES[size]} ${className}`}
    >
      {/* Rotating aurora fill, revealed on hover. Centring lives on a wrapper so
          it doesn't fight the inner element's spin transform. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-75"
      >
        <span className="absolute left-1/2 top-1/2 aspect-square w-[220%] -translate-x-1/2 -translate-y-1/2">
          <span
            className="block h-full w-full animate-[spin_6s_linear_infinite] motion-reduce:animate-none"
            style={{
              background:
                'conic-gradient(from 0deg, #0a5266, #123f6b, #15803d, #0b3d4e, #0a5266)',
            }}
          />
        </span>
      </span>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 transition-transform duration-300"
      >
        →
      </span>
    </Link>
  );
}
