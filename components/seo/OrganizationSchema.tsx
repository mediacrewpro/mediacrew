import { SITE_URL } from '@/lib/metadata';

/**
 * Organization structured data. Kept deliberately minimal: only facts that are
 * actually true right now. Phone, address and social profiles are omitted until
 * the client supplies real values — inventing them would be worse than absent.
 */
export function OrganizationSchema({ description }: { description: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MediaCrew',
    url: SITE_URL,
    description,
    // logo intentionally omitted until a real asset exists — a 404'd logo
    // url in structured data is worse than none.
  };

  return (
    <script
      type="application/ld+json"
      // Server-rendered static JSON; not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
