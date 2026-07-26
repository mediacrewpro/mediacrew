import { Link } from '@/i18n/navigation';
import type { NavItem } from '@/components/layout/Nav';

type FooterProps = {
  items: NavItem[];
  rights: string;
  navLabel: string;
  /** Resolved at build time — these pages are statically prerendered. */
  year: number;
};

export function Footer({ items, rights, navLabel, year }: FooterProps) {
  return (
    <footer className="border-t border-petrol/30 px-6 py-14 text-center md:px-16">
      <div className="flex flex-col items-center gap-10">
        <p className="font-mono text-label tracking-[0.2em] text-light">
          MEDIACREW
        </p>

        <nav aria-label={navLabel}>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-light/50 transition-colors duration-300 hover:text-neon"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="mt-12 font-mono text-label text-teal/50">
        © {year} MediaCrew. {rights}
      </p>
    </footer>
  );
}
