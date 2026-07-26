'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CONTACT } from '@/lib/contact';

/** Primary number, digits only (e164 without the +) for wa.me / t.me. */
const PHONE = CONTACT.phones[0].e164.replace('+', '');
const CHANNELS = [
  {
    key: 'whatsapp',
    href: `https://wa.me/${PHONE}`,
    color: '#25D366',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.86 1.21 3.06.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.42 9.42 0 01-4.8-1.31l-.34-.2-3.57.93.96-3.48-.22-.36a9.4 9.4 0 01-1.44-5.02c0-5.2 4.24-9.43 9.45-9.43 2.52 0 4.89.98 6.67 2.76a9.37 9.37 0 012.76 6.68c0 5.2-4.24 9.43-9.44 9.43zM20.5 3.5A11.8 11.8 0 0012.04.01C5.5.01.2 5.31.2 11.84c0 2.08.55 4.12 1.59 5.91L.1 24l6.4-1.67a11.85 11.85 0 005.53 1.4h.01c6.53 0 11.84-5.3 11.84-11.83 0-3.16-1.23-6.14-3.47-8.4z" />
      </svg>
    ),
  },
  {
    key: 'telegram',
    href: `https://t.me/+${PHONE}`,
    color: '#229ED9',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M21.94 4.63l-3.32 15.66c-.25 1.1-.9 1.38-1.83.86l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.15L18.4 6.9c.41-.36-.09-.56-.63-.2L6.16 13.9l-5.02-1.57c-1.09-.34-1.11-1.09.23-1.61l19.62-7.56c.91-.34 1.7.2 1.4 1.62z" />
      </svg>
    ),
  },
  {
    key: 'call',
    href: `tel:+${PHONE}`,
    color: '#0a7285',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1.02 1.02 0 011.05-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.4 21 3 13.6 3 4.5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
    ),
  },
] as const;

/**
 * Floating contact dock, bottom-right. Idle it's a single pulsing button that
 * demands attention; tapped it springs the three channels open with a stagger.
 */
export function FloatingContact() {
  const t = useTranslations('floating');
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-center gap-3 md:bottom-7 md:right-7">
      {/* Channel buttons — spring up in reverse order so WhatsApp lands top. */}
      <ul className="flex flex-col items-center gap-3">
        {CHANNELS.map((c, i) => (
          <li
            key={c.key}
            className="motion-safe:transition-all motion-safe:duration-300 motion-reduce:transition-none"
            style={{
              transitionDelay: open
                ? `${(CHANNELS.length - 1 - i) * 60}ms`
                : `${i * 40}ms`,
              opacity: open ? 1 : 0,
              transform: open
                ? 'translateY(0) scale(1)'
                : 'translateY(20px) scale(0.6)',
              pointerEvents: open ? 'auto' : 'none',
            }}
          >
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(c.key)}
              title={t(c.key)}
              className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/30 ring-1 ring-white/20 transition-transform duration-300 hover:scale-110 md:h-14 md:w-14"
              style={{ backgroundColor: c.color }}
            >
              {c.icon}
            </a>
          </li>
        ))}
      </ul>

      {/* Main trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('toggle')}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-neon text-void shadow-xl shadow-neon/30 transition-transform duration-300 hover:scale-105 md:h-16 md:w-16"
      >
        {/* Attention pulse — only while collapsed. */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-neon motion-safe:animate-ping motion-safe:[animation-duration:2s]" />
        )}
        <span
          className="relative transition-transform duration-300"
          style={{ transform: open ? 'rotate(135deg)' : 'rotate(0deg)' }}
        >
          {open ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="h-7 w-7"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm7 5H7v-2h7v2zm3-6H7V6h10v2z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
