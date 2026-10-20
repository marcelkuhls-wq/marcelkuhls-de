// JSON-LD für Ratgeberartikel: BlogPosting (bzw. CollectionPage für Bilderseiten) + Brotkrumen
import { photo } from './photos';

export function articleSchema(path: string, headline: string, crumb: string, opts: { image?: string; type?: 'BlogPosting' | 'CollectionPage'; modified?: string } = {}) {
  const url = `https://marcelkuhls.de${path}`;
  const { image, type = 'BlogPosting', modified = '2026-10-21' } = opts;
  const main: Record<string, unknown> = type === 'BlogPosting'
    ? {
        '@context': 'https://schema.org', '@type': 'BlogPosting', headline, dateModified: modified,
        author: { '@id': 'https://marcelkuhls.de/#marcel' },
        publisher: { '@id': 'https://marcelkuhls.de/#business' }, mainEntityOfPage: url, inLanguage: 'de-DE',
      }
    : { '@context': 'https://schema.org', '@type': 'CollectionPage', name: headline, url, inLanguage: 'de-DE', isPartOf: { '@id': 'https://marcelkuhls.de/#website' } };
  if (image) main.image = new URL(photo(image).src, 'https://marcelkuhls.de').href;
  return [
    main,
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: 'https://marcelkuhls.de/' },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: 'https://marcelkuhls.de/journal/' },
      { '@type': 'ListItem', position: 3, name: crumb },
    ] },
  ];
}
