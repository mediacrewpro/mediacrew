import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Static export (`out/`) only when BUILD_EXPORT=true, so `next dev` and normal
  // builds keep the middleware-driven locale routing untouched.
  ...(process.env.BUILD_EXPORT === 'true'
    ? { output: 'export' as const, images: { unoptimized: true } }
    : {}),
  turbopack: {
    // A stray package-lock.json in the user's home directory makes Next infer
    // the workspace root as C:\Users\abayb; pin it to this project instead.
    root: import.meta.dirname,
  },
  experimental: {
    // Route changes animate via the browser's View Transitions API, so the
    // blur runs on snapshots in the compositor rather than on live DOM.
    viewTransition: true,
  },
};

export default withNextIntl(nextConfig);
