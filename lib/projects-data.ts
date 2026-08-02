/**
 * The slide list — image + key only; the copy is pulled from `projectsPage`
 * messages so it stays translatable. Images are placeholders for now (reuse the
 * cinematic service renders); swap in real project photography here.
 */
export const PROJECT_SLIDES = [
  {
    key: 'p1',
    image: '/projects/reklam-filmi.webp',
    imageMobile: '/projects/reklam-filmi-mobile.webp',
  },
  {
    key: 'p2',
    image: '/projects/urun-tanitimi.webp',
    imageMobile: '/projects/urun-tanitimi-mobile.webp',
  },
  {
    key: 'p3',
    image: '/projects/sosyal-medya.webp',
    imageMobile: '/projects/sosyal-medya-mobile.webp',
  },
  {
    key: 'p4',
    image: '/projects/web-deneyimi.webp',
    imageMobile: '/projects/web-deneyimi-mobile.webp',
  },
  {
    key: 'p5',
    image: '/projects/kisa-film.webp',
    imageMobile: '/projects/kisa-film-mobile.webp',
  },
] as const;
