import { SITE_URL } from '@/lib/metadata';
import { CONTACT } from '@/lib/contact';

/**
 * Organization structured data. Only facts that are actually true: real email,
 * phones and social profile now that the client has supplied them. Address and
 * logo stay omitted until real values exist.
 */
export function OrganizationSchema({ description }: { description: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MediaCrew',
    url: SITE_URL,
    description,
    email: CONTACT.email,
    telephone: CONTACT.phones.map((p) => p.e164),
    sameAs: [CONTACT.instagram.url],
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
