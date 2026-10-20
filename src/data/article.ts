// JSON-LD für Ratgeberartikel: BlogPosting + Brotkrumen
export function articleSchema(path: string, headline: string, crumb: string, modified = '2026-10-20') {
  const url = `https://marcelkuhls.de${path}`;
  return [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline, dateModified: modified,
      author: { '@type': 'Person', name: 'Marcel Kuhls', url: 'https://marcelkuhls.de/ueber-mich/' },
      publisher: { '@id': 'https://marcelkuhls.de/#business' }, mainEntityOfPage: url, inLanguage: 'de-DE',
    },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: 'https://marcelkuhls.de/' },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: 'https://marcelkuhls.de/journal/' },
      { '@type': 'ListItem', position: 3, name: crumb },
    ] },
  ];
}
