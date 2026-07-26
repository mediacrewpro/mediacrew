/**
 * Per-service preview identity for the Services explorer. Each entry drives the
 * right-hand preview panel: an accent colour, the real service image, a themed
 * "expertise motif", a one-line descriptor and two live-feeling metrics.
 *
 * Keyed by `${categoryKey}:${itemKey}` to match the message tree. Copy is kept
 * inline (tr/en) so the panel needs no extra message plumbing.
 */
export type PreviewMotif = 'graph' | 'nodes' | 'pipeline' | 'film' | 'camera';
export type PreviewFrame = 'plain' | 'browser' | 'phone';

export type Bilingual = { tr: string; en: string };
export type PreviewMetric = { value: string; label: Bilingual };

export type ServicePreview = {
  accent: string;
  image: string;
  motif: PreviewMotif;
  frame: PreviewFrame;
  desc: Bilingual;
  metrics: [PreviewMetric, PreviewMetric];
};

const img = (name: string) => `/services/cards/${name}.webp`;

export const SERVICE_PREVIEWS: Record<string, ServicePreview> = {
  // ── Advertising ────────────────────────────────────────────────
  'ads:seo': {
    accent: '#4c8dff',
    image: img('google-seo'),
    motif: 'graph',
    frame: 'browser',
    desc: {
      tr: 'Organik görünürlüğü ölçülebilir sıralama artışına çeviriyoruz.',
      en: 'We turn organic visibility into measurable ranking growth.',
    },
    metrics: [
      { value: '+312%', label: { tr: 'Organik trafik', en: 'Organic traffic' } },
      { value: '#1–3', label: { tr: 'Anahtar kelime', en: 'Keyword rank' } },
    ],
  },
  'ads:meta': {
    accent: '#7c5cff',
    image: img('meta-reklamlari'),
    motif: 'graph',
    frame: 'browser',
    desc: {
      tr: 'Facebook ve Instagram kampanyalarını ROAS için optimize ediyoruz.',
      en: 'Facebook & Instagram campaigns optimised for ROAS.',
    },
    metrics: [
      { value: '4.8x', label: { tr: 'ROAS', en: 'ROAS' } },
      { value: '2.1%', label: { tr: 'CTR', en: 'CTR' } },
    ],
  },
  'ads:tiktok': {
    accent: '#ff2d55',
    image: img('tiktok-reklamlari'),
    motif: 'graph',
    frame: 'phone',
    desc: {
      tr: 'Hızlı, dikey ve yüksek etkileşimli TikTok reklam kurgusu.',
      en: 'Fast, vertical, high-engagement TikTok ad creative.',
    },
    metrics: [
      { value: '1.9M', label: { tr: 'Gösterim', en: 'Impressions' } },
      { value: '6.4%', label: { tr: 'Etkileşim', en: 'Engagement' } },
    ],
  },
  'ads:youtube': {
    accent: '#ff4d4d',
    image: img('youtube-reklamlari'),
    motif: 'graph',
    frame: 'browser',
    desc: {
      tr: 'Video kampanyalarını izlenme ve dönüşüm için ölçekliyoruz.',
      en: 'Video campaigns scaled for watch time and conversion.',
    },
    metrics: [
      { value: '820K', label: { tr: 'İzlenme', en: 'Views' } },
      { value: '38s', label: { tr: 'Ort. izlenme', en: 'Avg. watch' } },
    ],
  },

  // ── Web Solutions ──────────────────────────────────────────────
  'web:design': {
    accent: '#0adce4',
    image: img('web-tasarimi'),
    motif: 'nodes',
    frame: 'browser',
    desc: {
      tr: 'Ödüllü estetikte, hızlı ve dönüşüm odaklı web deneyimleri.',
      en: 'Award-grade, fast, conversion-focused web experiences.',
    },
    metrics: [
      { value: '98', label: { tr: 'Performans', en: 'Performance' } },
      { value: '0.4s', label: { tr: 'Yüklenme', en: 'Load time' } },
    ],
  },
  'web:crm': {
    accent: '#22d3a0',
    image: img('crm'),
    motif: 'pipeline',
    frame: 'browser',
    desc: {
      tr: 'Müşteri hattını uçtan uca yöneten sade SaaS panelleri.',
      en: 'Clean SaaS dashboards that run the full customer pipeline.',
    },
    metrics: [
      { value: '+27%', label: { tr: 'Dönüşüm', en: 'Conversion' } },
      { value: '12k', label: { tr: 'Kayıt', en: 'Records' } },
    ],
  },
  'web:automation': {
    accent: '#38bdf8',
    image: img('web-otomasyonlari'),
    motif: 'nodes',
    frame: 'browser',
    desc: {
      tr: 'Yapay zekâ destekli, bağlı iş akışları ve otomasyonlar.',
      en: 'AI-assisted, connected workflows and automations.',
    },
    metrics: [
      { value: '24/7', label: { tr: 'Çalışma', en: 'Uptime' } },
      { value: '−60%', label: { tr: 'Manuel iş', en: 'Manual work' } },
    ],
  },

  // ── Social Media ───────────────────────────────────────────────
  'social:instagram': {
    accent: '#e1306c',
    image: img('sosyal-medya'),
    motif: 'camera',
    frame: 'phone',
    desc: {
      tr: 'Reels, carousel ve topluluk yönetimiyle büyüyen profiller.',
      en: 'Profiles that grow through reels, carousels and community.',
    },
    metrics: [
      { value: '+18K', label: { tr: 'Takipçi', en: 'Followers' } },
      { value: '7.2%', label: { tr: 'Etkileşim', en: 'Engagement' } },
    ],
  },
  'social:facebook': {
    accent: '#1877f2',
    image: img('sosyal-medya'),
    motif: 'graph',
    frame: 'browser',
    desc: {
      tr: 'İçerik ve topluluk yönetimiyle erişimi katlıyoruz.',
      en: 'Content and community management that multiplies reach.',
    },
    metrics: [
      { value: '3.4M', label: { tr: 'Erişim', en: 'Reach' } },
      { value: '+22%', label: { tr: 'Etkileşim', en: 'Engagement' } },
    ],
  },
  'social:tiktok': {
    accent: '#25f4ee',
    image: img('tiktok-reklamlari'),
    motif: 'camera',
    frame: 'phone',
    desc: {
      tr: 'Trend odaklı dikey içerik üretimi ve profil yönetimi.',
      en: 'Trend-driven vertical content and profile management.',
    },
    metrics: [
      { value: '2.6M', label: { tr: 'İzlenme', en: 'Views' } },
      { value: '9.1%', label: { tr: 'Etkileşim', en: 'Engagement' } },
    ],
  },
  'social:youtube': {
    accent: '#ff0033',
    image: img('youtube-reklamlari'),
    motif: 'film',
    frame: 'browser',
    desc: {
      tr: 'Kanal stratejisi, yayın takvimi ve analitik yönetimi.',
      en: 'Channel strategy, publishing calendar and analytics.',
    },
    metrics: [
      { value: '+41%', label: { tr: 'İzlenme', en: 'Views' } },
      { value: '5.3K', label: { tr: 'Abone', en: 'Subscribers' } },
    ],
  },

  // ── Production & PR ────────────────────────────────────────────
  'pr:photo': {
    accent: '#f5b74c',
    image: img('fotograf-cekimi'),
    motif: 'camera',
    frame: 'plain',
    desc: {
      tr: 'Sinematik ışık ve alan derinliğiyle marka fotoğrafçılığı.',
      en: 'Brand photography with cinematic light and depth of field.',
    },
    metrics: [
      { value: '4K', label: { tr: 'Çözünürlük', en: 'Resolution' } },
      { value: 'RAW', label: { tr: 'İş akışı', en: 'Workflow' } },
    ],
  },
  'pr:commercial': {
    accent: '#ff6a3d',
    image: img('reklam-filmi'),
    motif: 'film',
    frame: 'plain',
    desc: {
      tr: 'Senaryodan renk düzenlemeye tam prodüksiyon reklam filmi.',
      en: 'Full-production commercial film, script to colour grade.',
    },
    metrics: [
      { value: '6K', label: { tr: 'Kamera', en: 'Camera' } },
      { value: '48fps', label: { tr: 'Kayıt', en: 'Capture' } },
    ],
  },
  'pr:video': {
    accent: '#ff8a5b',
    image: img('video-cekimi'),
    motif: 'film',
    frame: 'plain',
    desc: {
      tr: 'İçeriği besleyen sinematik video çekimleri ve kurgu.',
      en: 'Cinematic video shoots and editing that feed your content.',
    },
    metrics: [
      { value: '4K', label: { tr: 'Kalite', en: 'Quality' } },
      { value: '10-bit', label: { tr: 'Renk', en: 'Colour' } },
    ],
  },
  'pr:direction': {
    accent: '#c084fc',
    image: img('reji-hizmeti'),
    motif: 'film',
    frame: 'plain',
    desc: {
      tr: 'Konser, etkinlik ve yayınlar için canlı reji hizmeti.',
      en: 'Live direction for concerts, events and broadcasts.',
    },
    metrics: [
      { value: 'Multi', label: { tr: 'Kamera', en: 'Camera' } },
      { value: 'Live', label: { tr: 'Yayın', en: 'Broadcast' } },
    ],
  },
  'pr:shortFilm': {
    accent: '#f472b6',
    image: img('kisa-film'),
    motif: 'film',
    frame: 'plain',
    desc: {
      tr: 'Hikâye anlatımı güçlü, festival kalitesinde kısa filmler.',
      en: 'Story-led, festival-grade short films.',
    },
    metrics: [
      { value: '2.39:1', label: { tr: 'Format', en: 'Aspect' } },
      { value: 'Grade', label: { tr: 'Renk', en: 'Colour' } },
    ],
  },
  'pr:live': {
    accent: '#ef4444',
    image: img('video-cekimi'),
    motif: 'film',
    frame: 'browser',
    desc: {
      tr: 'Çok kameralı, kesintisiz canlı yayın prodüksiyonu.',
      en: 'Multi-camera, uninterrupted live-stream production.',
    },
    metrics: [
      { value: '1080p', label: { tr: 'Akış', en: 'Stream' } },
      { value: '0 kes.', label: { tr: 'Kesinti', en: 'Downtime' } },
    ],
  },
  'pr:event': {
    accent: '#f59e0b',
    image: img('fotograf-cekimi'),
    motif: 'camera',
    frame: 'plain',
    desc: {
      tr: 'Etkinliğin enerjisini yakalayan foto ve video ekibi.',
      en: 'Photo & video crew that captures the event’s energy.',
    },
    metrics: [
      { value: 'Multi', label: { tr: 'Ekip', en: 'Crew' } },
      { value: 'Same-day', label: { tr: 'Teslim', en: 'Delivery' } },
    ],
  },
  'pr:drone': {
    accent: '#38bdf8',
    image: img('video-cekimi'),
    motif: 'camera',
    frame: 'plain',
    desc: {
      tr: 'Havadan sinematik çekimlerle ölçek ve derinlik.',
      en: 'Scale and depth from cinematic aerial footage.',
    },
    metrics: [
      { value: '120m', label: { tr: 'İrtifa', en: 'Altitude' } },
      { value: '5.4K', label: { tr: 'Kayıt', en: 'Capture' } },
    ],
  },
  'pr:influencer': {
    accent: '#e11d74',
    image: img('sosyal-medya'),
    motif: 'nodes',
    frame: 'phone',
    desc: {
      tr: 'Doğru yaratıcılarla eşleşen, ölçülebilir influencer PR.',
      en: 'Measurable influencer PR matched with the right creators.',
    },
    metrics: [
      { value: '120+', label: { tr: 'Yaratıcı', en: 'Creators' } },
      { value: '8.7%', label: { tr: 'Etkileşim', en: 'Engagement' } },
    ],
  },
  'pr:brand': {
    accent: '#a78bfa',
    image: img('yapay-zeka'),
    motif: 'nodes',
    frame: 'browser',
    desc: {
      tr: 'Konumlandırmadan sese, uçtan uca marka yönetimi.',
      en: 'End-to-end brand management, positioning to voice.',
    },
    metrics: [
      { value: '360°', label: { tr: 'Strateji', en: 'Strategy' } },
      { value: '+33%', label: { tr: 'Bilinirlik', en: 'Awareness' } },
    ],
  },
  'pr:identity': {
    accent: '#34d399',
    image: img('web-tasarimi'),
    motif: 'nodes',
    frame: 'browser',
    desc: {
      tr: 'Logo, sistem ve kurallarıyla tutarlı kurumsal kimlik.',
      en: 'Consistent corporate identity: logo, system and guidelines.',
    },
    metrics: [
      { value: 'Kit', label: { tr: 'Sistem', en: 'System' } },
      { value: '∞', label: { tr: 'Ölçek', en: 'Scale' } },
    ],
  },
  'pr:graphic': {
    accent: '#f472b6',
    image: img('web-tasarimi'),
    motif: 'nodes',
    frame: 'browser',
    desc: {
      tr: 'Kampanyaları taşıyan çarpıcı grafik tasarım üretimi.',
      en: 'Striking graphic design that carries campaigns.',
    },
    metrics: [
      { value: 'Vector', label: { tr: 'Format', en: 'Format' } },
      { value: 'Print+Web', label: { tr: 'Kullanım', en: 'Usage' } },
    ],
  },
};

/** Order categories appear in — mirrors the page's CATEGORY_MAP. */
export const PREVIEW_FALLBACK: ServicePreview = SERVICE_PREVIEWS['web:design'];
