import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getTranslations } from 'next-intl/server';
import { isAppLocale, routing } from '@/i18n/routing';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'MediaCrew';

// Next 16: params reaches image routes as a Promise, same as pages.
export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isAppLocale(locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: active, namespace: 'meta' });

  // Satori needs a real TTF; woff2 is not supported.
  const satoshi = await readFile(
    join(process.cwd(), 'app/fonts/Satoshi-Bold.ttf'),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#1b1e24',
          padding: '80px',
          fontFamily: 'Satoshi',
        }}
      >
        {/* A single turquoise focus point — the aperture, top-right */}
        <div
          style={{
            position: 'absolute',
            top: 120,
            right: 140,
            width: 340,
            height: 340,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(10,220,228,0.55) 0%, rgba(10,220,228,0) 68%)',
          }}
        />

        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: '#0FA8AD' }}>
          MEDIACREW
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.02,
              letterSpacing: -3,
              color: '#F2F4F5',
              maxWidth: 900,
            }}
          >
            {t('home.title').replace('MediaCrew — ', '')}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: '#0adce4',
              display: 'flex',
            }}
          >
            {active === 'tr' ? 'Yaratıcı Ajans' : 'Creative Agency'}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Satoshi', data: satoshi, weight: 700, style: 'normal' }],
    },
  );
}
