/**
 * Blog content lives here as long-form Markdown (a small subset: ## / ###
 * headings, blank-line paragraphs and `- ` lists). Each post carries both
 * locales so the blog is fully bilingual for SEO. Newest first.
 */
export type BlogLocaleContent = {
  title: string;
  /** 150–160 char meta description / card excerpt. */
  excerpt: string;
  /** Markdown body. */
  body: string;
};

export type BlogPost = {
  slug: string;
  /** ISO date (published). */
  date: string;
  cover: string;
  /** Category label per locale. */
  category: { tr: string; en: string };
  tr: BlogLocaleContent;
  en: BlogLocaleContent;
};

/** ~200 words/min reading estimate from the active locale's body. */
export function readingMinutes(post: BlogPost, locale: 'tr' | 'en'): number {
  const words = post[locale].body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'google-seo-rehberi-2026',
    date: '2026-07-28',
    cover: '/services/cards/google-seo.webp',
    category: { tr: 'SEO', en: 'SEO' },
    tr: {
      title: "2026'da Google SEO: Markanızı Aramaların Zirvesine Taşıyan Rehber",
      excerpt:
        "Google SEO 2026'da nasıl işliyor? Teknik altyapıdan içerik stratejisine, E-E-A-T'ten yapay zekâ aramalarına kadar markanızı ilk sayfaya taşıyan adımları anlattık.",
      body: `Arama motoru optimizasyonu artık yalnızca anahtar kelime yerleştirmekten ibaret değil. Google 2026'da kullanıcının niyetini, sayfanın deneyim kalitesini ve markanın gerçek uzmanlığını aynı anda ölçüyor. Bu rehberde, bir markanın organik görünürlüğünü sürdürülebilir şekilde büyütmek için bugün atması gereken adımları uçtan uca ele alıyoruz.

## Arama Niyetini Doğru Okumak

Her aramanın arkasında bir amaç vardır: bilgi edinmek, karşılaştırmak veya satın almak. Bir sayfanın sıralanabilmesi için önce bu niyetle eşleşmesi gerekir. "En iyi kahve makinesi" araması bir karşılaştırma listesi beklerken, "kahve makinesi tamiri" pratik bir çözüm arar. İçeriğinizi yazmadan önce hedef aramanın Google'daki mevcut sonuçlarını inceleyin; ilk on sonucun formatı, uzunluğu ve başlık yapısı size beklenen niyeti gösterir.

Niyeti yanlış okumak, teknik olarak kusursuz bir sayfanın bile sıralanamamasının en yaygın nedenidir. Doğru niyetle hizalanmış orta kalite bir içerik, yanlış niyetle yazılmış mükemmel bir içeriği her zaman geçer.

## Teknik SEO: Görünmeyen Temel

İçerik ne kadar iyi olursa olsun, Google onu tarayamıyor veya sayfa yavaş açılıyorsa sıralama şansı düşer. 2026'da teknik SEO'nun belkemiği hâlâ üç unsurdan oluşuyor:

- **Core Web Vitals:** LCP (en büyük içerik boyaması) 2,5 saniyenin altında, INP (etkileşim gecikmesi) 200 ms'nin altında, CLS (görsel kayma) 0,1'in altında olmalı.
- **Taranabilirlik:** Temiz bir URL yapısı, doğru yapılandırılmış bir sitemap ve gereksiz sayfaları engelleyen bir robots dosyası.
- **Mobil öncelik:** Google artık siteleri mobil sürümleriyle indeksliyor; masaüstünde mükemmel görünen ama mobilde bozulan bir site cezalandırılır.

Bu değerleri düzenli ölçmek için Google Search Console ve PageSpeed Insights ücretsiz ve yeterlidir. Sorunları erkenden yakalamak, sonradan büyük yeniden yapımlarla uğraşmaktan çok daha ucuzdur.

## E-E-A-T: Uzmanlık Artık Sıralanıyor

Google'ın kalite değerlendirmesinin merkezinde E-E-A-T yer alıyor: Deneyim, Uzmanlık, Otorite ve Güvenilirlik. Özellikle sağlık, finans ve hukuk gibi "hayatı etkileyen" konularda bu kriterler belirleyici. Peki bunu bir web sitesinde nasıl gösterirsiniz?

- İçeriği gerçekten o konuda deneyimli kişilere yazdırın ve yazar bilgisini sayfada belirtin.
- İddialarınızı güvenilir kaynaklara bağlayın.
- Kurumsal kimliğinizi, iletişim bilgilerinizi ve gerçek referanslarınızı görünür kılın.

Marka güveni yalnızca sıralama için değil, tıklama sonrası dönüşüm için de kritiktir. Kullanıcı, karşısında ciddi bir işletme gördüğünde harekete geçer.

## Yapay Zekâ Aramaları ve GEO

2026'nın en büyük değişimi, aramaların bir kısmının artık yapay zekâ özetleriyle yanıtlanması. Google AI Overviews, ChatGPT ve Perplexity gibi araçlar, kullanıcıya kaynağa tıklamadan cevap sunabiliyor. Bu, markaların yeni bir alanı optimize etmesini gerektiriyor: Üretken Motor Optimizasyonu, yani GEO.

GEO'nun temel mantığı, içeriğinizi yapay zekânın kolayca alıntılayabileceği şekilde yapılandırmaktır:

- Sorulara doğrudan ve net cümlelerle cevap verin; cevabı bir paragrafın ortasına gömmeyin.
- İçeriği başlıklar ve kısa pasajlarla bölün, böylece her bölüm bağımsız olarak alıntılanabilir.
- Markanızı, sektörünüzle ilişkili net ve tekrarlı ifadelerle tanımlayın.

## İçerik Kümeleri ve İç Bağlantılar

Tek bir sayfa nadiren zirveye çıkar. Google, bir markanın bir konudaki toplam otoritesine bakar. Bu yüzden dağınık yazılar yerine "hub ve spoke" mantığında içerik kümeleri kurun: bir ana rehber (hub) ve onu destekleyen alt yazılar (spoke), birbirine anlamlı iç bağlantılarla bağlanır. Bu yapı, hem kullanıcının konuyu derinlemesine keşfetmesini sağlar hem de Google'a alanınızda kapsamlı olduğunuzu gösterir.

## Ölçmeden Yönetemezsiniz

SEO bir kampanya değil, sürekli bir süreçtir. Impressions, tıklama oranı, ortalama pozisyon ve organik dönüşüm gibi metrikleri düzenli takip edin. Hangi sayfaların yükseldiğini, hangilerinin düştüğünü görün ve içeriğinizi buna göre güncelleyin. Google, güncel tutulan ve düzenli iyileştirilen sayfaları ödüllendirir.

## Sonuç

2026'da Google SEO'da kazanmak; doğru niyet, sağlam teknik altyapı, gerçek uzmanlık ve yapay zekâya uygun içerik yapısının bir araya gelmesiyle mümkün. Bunların hiçbiri bir gecede olmaz, ancak sistemli bir yaklaşımla organik trafik, bir markanın en değerli ve en sürdürülebilir kazanç kanalı hâline gelir. Markanızın dijital operasyonunu bütünsel yöneten bir ekiple çalışmak, bu adımların hepsini tek elden ve tutarlı biçimde uygulamanın en hızlı yoludur.`,
    },
    en: {
      title: 'Google SEO in 2026: A Guide to Taking Your Brand to the Top of Search',
      excerpt:
        "How does Google SEO work in 2026? From technical foundations to content strategy, E-E-A-T and AI search, here are the steps that put your brand on page one.",
      body: `Search engine optimisation is no longer about placing keywords. In 2026 Google measures user intent, page experience and a brand's genuine expertise all at once. This guide walks through what a brand needs to do today to grow organic visibility sustainably.

## Reading Search Intent Correctly

Every search has a purpose: to learn, to compare or to buy. A page can only rank when it matches that intent. "Best coffee machine" expects a comparison list, while "coffee machine repair" wants a practical fix. Before writing, study the current top results for your target query — the format, length and headings of the top ten reveal the expected intent.

Misreading intent is the most common reason a technically flawless page fails to rank. Mid-quality content aligned to the right intent will always beat perfect content built for the wrong one.

## Technical SEO: The Invisible Foundation

However good the content, if Google cannot crawl it or the page loads slowly, ranking chances fall. In 2026 the backbone of technical SEO is still three things:

- **Core Web Vitals:** LCP under 2.5s, INP under 200ms, CLS under 0.1.
- **Crawlability:** a clean URL structure, a well-formed sitemap and a robots file that blocks the noise.
- **Mobile-first:** Google indexes the mobile version; a site that is perfect on desktop but breaks on mobile is penalised.

Google Search Console and PageSpeed Insights are free and enough to measure these regularly. Catching issues early is far cheaper than large rebuilds later.

## E-E-A-T: Expertise Now Ranks

At the centre of Google's quality assessment sits E-E-A-T: Experience, Expertise, Authoritativeness and Trust. These matter most for "your money or your life" topics like health, finance and law. How do you show it on a website?

- Have content written by people who genuinely have the experience, and name the author on the page.
- Back your claims with credible sources.
- Make your corporate identity, contact details and real references visible.

Brand trust matters not only for ranking but for post-click conversion. Users act when they see a serious business in front of them.

## AI Search and GEO

The biggest shift of 2026 is that many searches are now answered with AI summaries. Tools like Google AI Overviews, ChatGPT and Perplexity can answer without a click to the source. This forces brands to optimise a new surface: Generative Engine Optimisation, or GEO.

The core logic of GEO is to structure content so AI can easily cite it:

- Answer questions directly and clearly; don't bury the answer mid-paragraph.
- Break content into headings and short passages so each section is independently quotable.
- Describe your brand with clear, repeated statements tied to your sector.

## Content Clusters and Internal Links

A single page rarely reaches the top. Google looks at a brand's total authority on a topic. So instead of scattered posts, build clusters in a hub-and-spoke model: a main guide (hub) and supporting posts (spokes) connected with meaningful internal links. This lets users explore the topic in depth and shows Google you are comprehensive in your field.

## You Can't Manage What You Don't Measure

SEO is not a campaign but a continuous process. Track impressions, click-through rate, average position and organic conversion regularly. See which pages rise, which fall, and update accordingly. Google rewards pages that are kept fresh and regularly improved.

## Conclusion

Winning at Google SEO in 2026 comes from combining the right intent, a solid technical base, real expertise and an AI-friendly content structure. None of it happens overnight, but with a systematic approach organic traffic becomes a brand's most valuable and sustainable channel. Working with a team that manages your entire digital operation is the fastest way to apply all of these steps consistently, from one hand.`,
    },
  },
  {
    slug: 'meta-reklamlarinda-roas',
    date: '2026-07-20',
    cover: '/services/cards/meta-reklamlari.webp',
    category: { tr: 'Reklam', en: 'Advertising' },
    tr: {
      title: "Meta Reklamlarında ROAS'ı Katlamanın Yolları",
      excerpt:
        'Facebook ve Instagram reklamlarında reklam harcamanızın getirisini (ROAS) artırmak için kreatif, hedefleme ve ölçümlemeye dair uygulanabilir stratejiler.',
      body: `Meta reklamlarında başarı, bütçeyi büyütmekle değil, her liranın getirisini artırmakla ölçülür. Bu getiriyi ifade eden metrik ROAS'tır (Reklam Harcamasının Getirisi). İyi yönetilen bir hesapta ROAS'ı katlamak, çoğu zaman daha fazla harcamadan değil, daha akıllı kararlardan gelir. İşte fark yaratan alanlar.

## Kreatif, Artık En Büyük Kaldıraç

Meta'nın algoritması hedeflemeyi büyük ölçüde otomatikleştirdi. Bu yüzden performansın en belirleyici unsuru artık reklamın kendisi: görsel, video ve metin. Zayıf bir kreatif, en iyi hedeflemeyi bile boşa çıkarır.

- İlk üç saniyede dikkat çekin; kullanıcı akışta hızlı ilerler.
- Ürünü değil, çözdüğünüz sorunu gösterin.
- Tek bir reklamla yetinmeyin; aynı anda birden fazla kreatif varyasyonu test edin ve kazananı ölçeklendirin.

Dikey ve sessiz izlemeye uygun videolar, özellikle Reels ve Stories yerleşimlerinde durağan görsellere göre belirgin şekilde daha iyi performans gösterir.

## Hedeflemeyi Algoritmaya Bırakmak

Eskiden ilgi alanı üstüne ilgi alanı yığmak mantıklıydı; artık değil. Geniş hedefleme ve güçlü kreatif kombinasyonu, çoğu hesapta dar ve karmaşık hedeflemeyi geçiyor. Meta'nın öğrenme aşamasına yeterli veri vermek için kitleyi gereksiz yere daraltmayın.

Yine de yeniden pazarlama vazgeçilmez: siteyi ziyaret eden, sepete ürün ekleyen ama satın almayan kullanıcılar en yüksek dönüşüm potansiyeline sahip gruptur. Bu kitleye özel, hatırlatıcı kreatiflerle dönmek ROAS'ı hızla yükseltir.

## Dönüşüm Ölçümünü Doğru Kurmak

ROAS'ı iyileştirmek için önce doğru ölçmelisiniz. Eksik veya yanlış kurulmuş bir dönüşüm takibi, algoritmayı yanlış yönlendirir ve bütçeyi yakar.

- Meta Pixel ve sunucu taraflı Conversions API'yi birlikte kullanın; tarayıcı kısıtlamaları arttıkça sunucu taraflı ölçüm kritik hâle geldi.
- Satın alma dışında sepete ekleme, ödeme başlatma gibi ara olayları da izleyin.
- Katkı modelini ve dönüşüm penceresini işinize uygun seçin.

## Huninin Tamamını Yönetmek

Tek bir kampanyayla herkesi satın almaya ikna edemezsiniz. Sağlıklı bir hesap, huninin üç aşamasını da besler: markayı tanıtan üst huni, ilgi uyandıran orta huni ve satışı kapatan alt huni. Bütçenizi yalnızca alt huniye yığarsanız, zamanla dönüştürülecek yeni kitle kalmaz ve maliyetler yükselir.

## Bütçe ve Ölçeklendirme Disiplini

Kazanan bir kampanyayı ölçeklendirirken bütçeyi bir gecede ikiye katlamak, öğrenme aşamasını sıfırlar ve performansı bozar. Bunun yerine bütçeyi kademeli artırın veya kazanan kreatifi yeni kampanyalarda çoğaltın. Kaybeden reklamları duygusal davranmadan kapatın; bütçeyi çalışanlara aktarın.

## Sonuç

Meta reklamlarında ROAS'ı katlamak; güçlü kreatif, algoritmaya güvenen hedefleme, kusursuz ölçümleme ve huninin tamamını besleyen bir yapıyla mümkün. Bu unsurlar birbirini destekler; biri eksik olduğunda diğerlerinin etkisi de düşer. Reklamı içerik üretimi ve web deneyimiyle birlikte, bütünsel yöneten bir ekip, her aşamada tutarlılık sağlayarak getiriyi en üst düzeye taşır.`,
    },
    en: {
      title: 'How to Multiply Your ROAS on Meta Ads',
      excerpt:
        'Actionable strategies for creative, targeting and measurement to increase the return on ad spend (ROAS) of your Facebook and Instagram campaigns.',
      body: `Success in Meta ads is measured not by growing the budget but by increasing the return on every unit spent. The metric that expresses this is ROAS (Return On Ad Spend). In a well-run account, multiplying ROAS usually comes from smarter decisions, not more spend. Here are the areas that make the difference.

## Creative Is Now the Biggest Lever

Meta's algorithm has largely automated targeting. So the most decisive factor in performance is now the ad itself: the image, video and copy. A weak creative wastes even the best targeting.

- Grab attention in the first three seconds; users scroll fast.
- Show the problem you solve, not just the product.
- Don't settle for one ad; test several creative variations at once and scale the winner.

Vertical, sound-off-friendly videos clearly outperform static images, especially in Reels and Stories placements.

## Trusting the Algorithm With Targeting

Stacking interest on interest used to make sense; not anymore. Broad targeting combined with strong creative beats narrow, complex targeting in most accounts. Don't shrink the audience unnecessarily — give Meta's learning phase enough data.

Retargeting remains essential, though: users who visited the site or added to cart without buying have the highest conversion potential. Returning to them with reminder creatives raises ROAS quickly.

## Setting Up Conversion Tracking Correctly

To improve ROAS you must first measure correctly. Missing or misconfigured conversion tracking misguides the algorithm and burns budget.

- Use the Meta Pixel together with the server-side Conversions API; as browser restrictions grow, server-side measurement has become critical.
- Track intermediate events like add-to-cart and initiate-checkout, not just purchase.
- Choose an attribution model and conversion window that fit your business.

## Managing the Whole Funnel

You can't persuade everyone to buy with a single campaign. A healthy account feeds all three funnel stages: an upper funnel that introduces the brand, a middle funnel that builds interest, and a lower funnel that closes the sale. Pile the budget only on the lower funnel and, over time, there's no new audience left to convert and costs rise.

## Budget and Scaling Discipline

When scaling a winning campaign, doubling the budget overnight resets the learning phase and hurts performance. Increase gradually instead, or duplicate the winning creative into new campaigns. Cut losing ads without sentiment and move the budget to the performers.

## Conclusion

Multiplying ROAS on Meta ads is possible with strong creative, algorithm-trusting targeting, flawless measurement and a structure that feeds the whole funnel. These elements reinforce each other; when one is missing, the others weaken too. A team that manages advertising together with content production and web experience maximises return by keeping every stage consistent.`,
    },
  },
  {
    slug: 'sosyal-medya-icerik-stratejisi',
    date: '2026-07-12',
    cover: '/services/cards/sosyal-medya.webp',
    category: { tr: 'Sosyal Medya', en: 'Social Media' },
    tr: {
      title: 'Markalar İçin Sosyal Medya İçerik Stratejisi Rehberi',
      excerpt:
        'Takipçiyi müşteriye dönüştüren bir sosyal medya stratejisi nasıl kurulur? İçerik sütunları, format seçimi, tutarlılık ve ölçümleme üzerine pratik bir rehber.',
      body: `Sosyal medyada düzenli paylaşım yapmak bir strateji değildir. Gerçek strateji, her içeriğin markanın büyüme hedefine hizmet ettiği, tutarlı ve ölçülebilir bir sistem kurmaktır. Bu rehberde, takipçi sayısının ötesine geçip gerçek iş sonuçları üreten bir sosyal medya yaklaşımını ele alıyoruz.

## Önce Amaç, Sonra İçerik

Her markanın sosyal medyadan beklentisi farklıdır: bilinirlik, topluluk, satış veya müşteri desteği. Amacı netleştirmeden üretilen içerik dağınık ve etkisiz olur. Önce şu soruyu yanıtlayın: Bu hesap bir yıl sonra markaya ne kazandırmalı? Cevap, üreteceğiniz her içeriğin pusulası olur.

## İçerik Sütunları Kurmak

Sürdürülebilir bir hesap, birkaç net "içerik sütunu" üzerine oturur. Bunlar, markanızın düzenli olarak döndüğü ana temalardır. Örneğin bir dijital ajans için sütunlar şöyle olabilir:

- **Eğitici:** Takipçiye gerçek değer katan ipuçları ve rehberler.
- **Kanıt:** Vaka çalışmaları, sonuçlar ve müşteri referansları.
- **Perde arkası:** Ekibi ve süreci gösteren, güven kuran içerikler.
- **Etkileşim:** Soru, anket ve topluluğu konuşturan paylaşımlar.

Bu sütunlar hem üretimi kolaylaştırır hem de hesabın tek düze olmasını önler.

## Formatı Platforma Göre Seçmek

Her platformun kendi dili vardır. Aynı içeriği her yere aynı şekilde koymak en yaygın hatadır.

- **Reels ve kısa video:** Bugün organik erişimin en güçlü kanalı. İlk saniye belirleyici; hikâyeyi hızlı kurun.
- **Carousel:** Bilgiyi adım adım anlatmak ve kaydedilme almak için ideal.
- **Hikâyeler:** Günlük, samimi ve etkileşimli iletişim için.

Video üretimini gerçek çekimlerle desteklemek, stok görsellere kıyasla markayı belirgin şekilde öne çıkarır.

## Tutarlılık, Sıklıktan Önemlidir

Haftada yedi gün paylaşıp sonra bir ay susmaktansa, sürdürülebilir bir tempoyu istikrarla korumak çok daha değerlidir. Algoritma da takipçi de öngörülebilirliği ödüllendirir. Bir içerik takvimi kurun ve içerikleri önceden üretip planlayın; böylece kalite, günlük telaşa kurban gitmez.

## Topluluğu Yönetmek

Sosyal medya tek yönlü bir yayın değil, bir diyalogdur. Yorumlara ve mesajlara hızlı ve markanın sesiyle yanıt vermek, sadık bir topluluk kurmanın temelidir. İnsanlar, kendilerini duyulmuş hissettikleri markalardan alışveriş yapar.

## Ölçümleme: Beğeninin Ötesi

Beğeni ve takipçi sayısı gösteriş metrikleridir; tek başlarına iş değeri taşımaz. Asıl bakılması gerekenler; erişim, etkileşim oranı, kaydetme, paylaşım ve en önemlisi profilden web sitesine yönlenen trafik ve dönüşümlerdir. Hangi sütunun ve formatın sonuç verdiğini görün, üretimi buna göre kaydırın.

## Sonuç

Etkili bir sosyal medya stratejisi; net bir amaç, sağlam içerik sütunları, platforma uygun formatlar, tutarlı bir tempo ve doğru ölçümleme üzerine kurulur. Bu sistem oturduğunda sosyal medya, yalnızca bir vitrin değil, markanın en canlı büyüme motorlarından biri hâline gelir. İçerik üretimini reklam ve web deneyimiyle birlikte yöneten bir ekip, bu motoru en verimli şekilde çalıştırır.`,
    },
    en: {
      title: 'A Social Media Content Strategy Guide for Brands',
      excerpt:
        'How do you build a social strategy that turns followers into customers? A practical guide to content pillars, format choice, consistency and measurement.',
      body: `Posting regularly on social media is not a strategy. Real strategy is building a consistent, measurable system where every piece of content serves the brand's growth goal. This guide covers a social media approach that goes beyond follower counts to produce real business results.

## Purpose First, Content Second

Every brand wants something different from social: awareness, community, sales or support. Content produced without a clear goal becomes scattered and ineffective. First answer this: what should this account have earned the brand a year from now? The answer becomes the compass for every piece you create.

## Building Content Pillars

A sustainable account rests on a few clear "content pillars" — the main themes your brand returns to regularly. For a digital agency, for example, the pillars might be:

- **Educational:** tips and guides that add real value for followers.
- **Proof:** case studies, results and client references.
- **Behind the scenes:** content that shows the team and process and builds trust.
- **Engagement:** questions, polls and posts that get the community talking.

These pillars make production easier and keep the account from feeling monotonous.

## Choosing Format by Platform

Every platform has its own language. Posting the same content everywhere the same way is the most common mistake.

- **Reels and short video:** today's strongest channel for organic reach. The first second decides everything; set up the story fast.
- **Carousel:** ideal for explaining information step by step and earning saves.
- **Stories:** for daily, intimate and interactive communication.

Backing video production with real shoots makes a brand stand out clearly compared to stock imagery.

## Consistency Beats Frequency

Posting seven days a week and then going quiet for a month is far worse than holding a sustainable rhythm steadily. Both the algorithm and the audience reward predictability. Build a content calendar and produce and schedule content ahead of time so quality doesn't fall victim to daily rush.

## Managing the Community

Social media is a dialogue, not a one-way broadcast. Replying to comments and messages quickly and in the brand's voice is the foundation of a loyal community. People buy from brands that make them feel heard.

## Measurement: Beyond the Like

Likes and follower counts are vanity metrics; on their own they carry no business value. What matters is reach, engagement rate, saves, shares and — most importantly — traffic and conversions driven from the profile to the website. See which pillar and format deliver results, and shift production accordingly.

## Conclusion

An effective social media strategy is built on a clear purpose, solid content pillars, platform-appropriate formats, a consistent rhythm and proper measurement. Once this system is in place, social media becomes not just a showcase but one of the brand's most vibrant growth engines. A team that manages content production together with advertising and web experience runs that engine most efficiently.`,
    },
  },
];

export const getPost = (slug: string) =>
  BLOG_POSTS.find((p) => p.slug === slug);
