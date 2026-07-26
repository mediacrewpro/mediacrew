import { Link } from '@/i18n/navigation';
import type { NavItem } from '@/components/layout/Nav';
import { CONTACT } from '@/lib/contact';

type FooterProps = {
  items: NavItem[];
  rights: string;
  navLabel: string;
  contactLabel: string;
  /** Resolved at build time — these pages are statically prerendered. */
  year: number;
};

export function Footer({
  items,
  rights,
  navLabel,
  contactLabel,
  year,
}: FooterProps) {
  return (
    <footer className="border-t border-black/10 bg-white px-6 py-16 text-center text-void md:px-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10">
        {/* Brand mark — white logo darkened for the light background. */}
        <img
          src="/logo-white.png"
          alt="MediaCrew"
          className="h-7 w-auto [filter:brightness(0)] md:h-8"
        />

        {/* Contact block */}
        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-label tracking-[0.28em] text-petrol">
            {contactLabel}
          </p>

          <a
            href={`mailto:${CONTACT.email}`}
            className="text-lg text-void transition-colors duration-300 hover:text-petrol md:text-xl"
          >
            {CONTACT.email}
          </a>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-void/70">
            {CONTACT.phones.map((phone) => (
              <a
                key={phone.e164}
                href={`tel:${phone.e164}`}
                className="text-base transition-colors duration-300 hover:text-petrol md:text-lg"
              >
                {phone.display}
              </a>
            ))}
          </div>

          <a
            href={CONTACT.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-base text-void/70 transition-colors duration-300 hover:text-petrol md:text-lg"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="2" y="2" width="20" height="20" rx="5.5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            {CONTACT.instagram.handle}
          </a>
        </div>

        {/* Page links */}
        <nav aria-label={navLabel}>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-void/50 transition-colors duration-300 hover:text-petrol"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="mt-12 font-mono text-label text-void/40">
        © {year} MediaCrew. {rights}
      </p>
    </footer>
  );
}
