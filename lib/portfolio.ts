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

/** A launched website case (visual + live link + bilingual blurb). */
export type PortfolioSite = {
  name: string;
  url: string;
  /** Still image / video poster. */
  image: string;
  /** Optional muted autoplay-loop video shown in place of the still (GIF-style). */
  preview?: string;
  /** CSS aspect-ratio for the card media (defaults to 16/9). Match the video so
   *  no letterbox shows. */
  aspect?: string;
  desc: { tr: string; en: string };
};

export type PortfolioProject = {
  /** Maps to the projects-slider key so the detail shares its copy. */
  projectKey: 'p1' | 'p2' | 'p3' | 'p4' | 'p6';
  /** Optional wide hero banner behind the detail-page header. */
  banner?: string;
  videos: PortfolioVideo[];
  images: PortfolioImage[];
  /** Launched websites (Web Deneyimi). */
  sites?: PortfolioSite[];
};

export const PORTFOLIO: Record<string, PortfolioProject> = {
  'reklam-filmi': {
    projectKey: 'p1',
    banner: '/portfolio/reklam-filmi/banner.webp',
    videos: [
      { title: "Kia Öztopraklar Hatay Akvaryum", youtube: 'tYUMYzTFnS4', vertical: true },
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
      { title: "TARİHİ BİZİM KÜNEFECİ GENEL", youtube: 'n6kRZQXRUYY', vertical: true },
      { title: "BIÇAKÇI NAİM vs NANO BURGER ÇEKİM", youtube: 'yRjDeVpUmAk', vertical: true },
      { title: "DÜZEL GRUP ÜRÜN TANITIMI 1", youtube: 'sOwtqm1QA94', vertical: true },
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
      { title: "Kia Öztopraklar Hatay Akvaryum", youtube: 'tYUMYzTFnS4', vertical: true },
      { title: "Nadir Fırıncıoğlu Drone Çekimi", youtube: '826j8ViMPPE', vertical: true },
      { title: "Gü-Kur Eğitim Kurumları Transformer", youtube: 'DL3YyqnwWRU', vertical: true },
      { title: "Her Başarılı Kadının Arkasında \"Kia\" Var! 8 Mart Dünya Kadınlar Günü", youtube: 'pMGzTgNGERw', vertical: true },
      { title: "Meşhur Selanik Aspava Drone", youtube: 'HQACkW5SNBA', vertical: true },
      { title: "Aspava Klip II", youtube: 'OX7b2wKO2OU', vertical: true },
      { title: "DÜZEL GRUP ÜRÜN TANITIMI", youtube: '-CFLldw5KT0', vertical: true },
      { title: "HIZLI SERVİS PAXOY DÖNER", youtube: 'YOC6NGKyMZU', vertical: true },
      { title: "Kerimcan Durmaz Roman Gecesi 001", youtube: 'BWw-m_M4Oj0', vertical: true },
      { title: "RootRaft", youtube: 'JnNfoi3SEuw', vertical: true },
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
      { src: '/portfolio/sosyal-medya/10haziran-7.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/10haziran.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/10temmuz.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/12mart.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/15temmuz.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/17temmuz.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/1temmuz-6.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/21nisan.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/24haziran.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/24temmuz-1.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/25temmuz.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/6mayis.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/6mayishuzs.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/7nisan.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/8temmuz-7.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/fakulte-kutuphane-10.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/cd-15nisan.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/cd-1temmuz.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/cd22nisan.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/chicken-4-mart.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/chicken1nisan.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/dogrularseramik.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/eyal-15-aralik.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/gu-kur-11-aralik.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/huzi22nisan.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/huzi27mart.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/pazartesi.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/skola26mart.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/smz-yapi-3.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/smz-yapi-post.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/smz-14-mart.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/smz-15-aralik.webp', alt: 'Sosyal medya tasarımı' },
      { src: '/portfolio/sosyal-medya/smz-24-ocak.webp', alt: 'Sosyal medya tasarımı' },
    ],
  },
  'web-deneyimi': {
    projectKey: 'p4',
    banner: '/portfolio/web-deneyimi/banner.webp',
    videos: [],
    images: [],
    sites: [
      {
        name: 'Turuncu Motors',
        url: 'https://turuncumotor.com',
        image: '/portfolio/web-deneyimi/turuncumotor-poster.webp',
        preview: '/portfolio/web-deneyimi/turuncumotor.mp4',
        aspect: '1920 / 950',
        desc: {
          tr: 'Antalya merkezli motosiklet kiralama markası için sinematik, koyu temalı ve çok dilli bir deneyim. Animasyonlu hero, filo ve rota sayfaları, WhatsApp + rezervasyon akışı; aramalarda görünür olacak SEO altyapısı.',
          en: 'A cinematic, dark-themed and multilingual experience for an Antalya-based motorcycle rental brand. Animated hero, fleet & route pages, a WhatsApp + booking flow, and an SEO foundation built for search visibility.',
        },
      },
      {
        name: 'Doğrular Seramik',
        url: 'https://dogrularseramik.com',
        image: '/portfolio/web-deneyimi/dogrularseramik-poster.webp',
        preview: '/portfolio/web-deneyimi/dogrularseramik.mp4',
        aspect: '1920 / 950',
        desc: {
          tr: 'Seramik ve vitrifiye markası için lüks ve hızlı bir katalog sitesi. Ürün ile vitrifiye koleksiyonları, kataloglar, blog ve "örnek iste" akışı; sade, premium bir estetik.',
          en: 'A luxury, fast catalogue site for a ceramics & sanitaryware brand. Product and sanitaryware collections, catalogues, a blog and a “request a sample” flow, in a clean, premium aesthetic.',
        },
      },
      {
        name: 'Skola',
        url: 'https://skolakurs.com',
        image: '/portfolio/web-deneyimi/skolakurs-poster.webp',
        preview: '/portfolio/web-deneyimi/skolakurs.mp4',
        aspect: '1920 / 944',
        desc: {
          tr: 'Bir YKS eğitim kurumu için modern ve dönüşüm odaklı bir site. Programlar, kadro, YKS rehberi ve WhatsApp danışma akışı; güven veren istatistiklerle desteklenen premium bir tasarım.',
          en: 'A modern, conversion-focused site for a university-prep education brand. Programmes, staff, an exam guide and a WhatsApp consultation flow, in a premium design backed by trust-building stats.',
        },
      },
    ],
  },
  'reji-hizmeti': {
    projectKey: 'p6',
    banner: '/portfolio/reji-hizmeti/banner.webp',
    videos: [
      { title: "Ceylan Ertem Konseri Reji Hizmeti", youtube: 'hZ9UsDhk5EQ', vertical: true },
      { title: "Ceylan Ertem Reji Hizmeti 2", youtube: 'Wg1pMkkqTaI', vertical: true },
      { title: "Can Bonomo Reji Hizmeti", youtube: 'pna-HQ7uiYU', vertical: true },
      { title: "Patron Reji Hizmeti", youtube: 'bQEtee6Nhvk', vertical: true },
      { title: "Köfn Reji Hizmeti", youtube: '77dljEuuZUY', vertical: true },
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
