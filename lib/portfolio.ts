/**
 * Per-project portfolio media for the case-study detail pages.
 *
 * Videos are served from YouTube (unlisted) so full quality stays free and the
 * repo doesn't carry hundreds of MB. Fill each `youtube` with the 11-char video
 * id once the clip is uploaded — items with an empty id are simply skipped, so
 * the page ships now and lights up video-by-video as ids arrive. Images are
 * self-hosted (small, lossless enough) under /portfolio/<slug>/.
 */
export type PortfolioVideo = {
  title: string;
  /** YouTube id for embedded (streamed) clips. Empty if self-hosted via `src`. */
  youtube: string;
  /** Self-hosted mp4 (public path) — rendered in a native <video> player. */
  src?: string;
  /** Vertical (Shorts / 9:16) — rendered in a phone-shaped player. */
  vertical?: boolean;
};
export type PortfolioImage = { src: string; alt: string };

export type PortfolioProject = {
  /** Maps to the projects-slider key so the detail shares its copy. */
  projectKey: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
  /** Optional wide hero banner behind the detail-page header. */
  banner?: string;
  videos: PortfolioVideo[];
  images: PortfolioImage[];
};

export const PORTFOLIO: Record<string, PortfolioProject> = {
  'reklam-filmi': {
    projectKey: 'p1',
    banner: '/portfolio/reklam-filmi/banner.webp',
    videos: [
      { title: 'KIA Akvaryum', youtube: 'tYUMYzTFnS4', vertical: true },
      {
        title: 'Bıçakçı Naim — Sarı Saplı',
        youtube: '',
        src: '/portfolio/reklam-filmi/bicakci-naim-sari-sapli.mp4',
        vertical: true,
      },
    ],
    images: [
      { src: '/portfolio/reklam-filmi/dogrular-seramik.webp', alt: 'Doğrular Seramik' },
    ],
  },
  'urun-tanitimi': {
    projectKey: 'p2',
    banner: '/portfolio/urun-tanitimi/banner.webp',
    videos: [
      { title: 'Bıçakçı Naim vs Nano Burger', youtube: 'n6kRZQXRUYY', vertical: true },
      { title: 'Düzel Grup — Ürün Tanıtımı', youtube: 'yRjDeVpUmAk', vertical: true },
      { title: 'Tarihi Bizim Künefeci', youtube: 'sOwtqm1QA94', vertical: true },
    ],
    images: [
      { src: '/portfolio/urun-tanitimi/paxoy-waffle.webp', alt: 'Paxoy Waffle' },
      { src: '/portfolio/urun-tanitimi/kunefe.webp', alt: 'Künefe' },
    ],
  },
  'sosyal-medya': {
    projectKey: 'p3',
    banner: '/portfolio/sosyal-medya/banner.webp',
    videos: [
      { title: 'KIA Akvaryum', youtube: 'tYUMYzTFnS4', vertical: true },
      { title: 'Nadir Fırıncıoğlu — Gümüşoğlu Apt.', youtube: '826j8ViMPPE', vertical: true },
      { title: 'Gü Kur — D Sınıfı Transform', youtube: 'DL3YyqnwWRU', vertical: true },
      { title: 'Her Başarılı Kadının Arkasında Bir KIA Var', youtube: 'pMGzTgNGERw', vertical: true },
      { title: 'Aspava — Drone Edit', youtube: 'HQACkW5SNBA', vertical: true },
      { title: 'Aspava — Klip II', youtube: 'OX7b2wKO2OU', vertical: true },
      { title: 'Chicken Döner — Ortaya Karışık', youtube: '-CFLldw5KT0', vertical: true },
      { title: 'Düzel Grup', youtube: 'YOC6NGKyMZU', vertical: true },
      { title: 'Hızlı Servis — Paxoy Döner', youtube: 'BWw-m_M4Oj0', vertical: true },
      { title: 'Kerimcan Durmaz — Roman Gecesi', youtube: 'JnNfoi3SEuw', vertical: true },
    ],
    images: [
      { src: '/portfolio/sosyal-medya/post-1.webp', alt: 'Sosyal medya postu 1' },
      { src: '/portfolio/sosyal-medya/post-2.webp', alt: 'Sosyal medya postu 2' },
      { src: '/portfolio/sosyal-medya/post-3.webp', alt: 'Sosyal medya postu 3' },
      { src: '/portfolio/sosyal-medya/post-4.webp', alt: 'Sosyal medya postu 4' },
      { src: '/portfolio/sosyal-medya/post-5.webp', alt: 'Sosyal medya postu 5' },
      { src: '/portfolio/sosyal-medya/post-6.webp', alt: 'Sosyal medya postu 6' },
      { src: '/portfolio/sosyal-medya/post-7.webp', alt: 'Sosyal medya postu 7' },
      { src: '/portfolio/sosyal-medya/post-8.webp', alt: 'Sosyal medya postu 8' },
      { src: '/portfolio/sosyal-medya/post-9.webp', alt: 'Sosyal medya postu 9' },
    ],
  },
  'web-deneyimi': {
    projectKey: 'p4',
    banner: '/portfolio/web-deneyimi/banner.webp',
    videos: [],
    images: [],
  },
  'kisa-film': {
    projectKey: 'p5',
    banner: '/portfolio/kisa-film/banner.webp',
    videos: [],
    images: [],
  },
  'reji-hizmeti': {
    projectKey: 'p6',
    banner: '/portfolio/reji-hizmeti/banner.webp',
    videos: [
      { title: 'Reji — 01', youtube: 'hZ9UsDhk5EQ', vertical: true },
      { title: 'Reji — 02', youtube: 'Wg1pMkkqTaI', vertical: true },
      { title: 'Reji — 03', youtube: 'pna-HQ7uiYU', vertical: true },
      { title: 'Reji — 04', youtube: 'bQEtee6Nhvk', vertical: true },
      { title: 'Reji — 05', youtube: '77dljEuuZUY', vertical: true },
    ],
    images: [],
  },
};

export const getPortfolio = (slug: string): PortfolioProject | undefined =>
  PORTFOLIO[slug];

/** Slugs that actually have a case study — only these titles become links. */
export const PORTFOLIO_SLUGS = Object.keys(PORTFOLIO);

/** projectKey → detail slug, for wiring the slider titles to their pages. */
export const KEY_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(PORTFOLIO).map(([slug, p]) => [p.projectKey, slug]),
);
