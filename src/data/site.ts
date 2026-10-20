// Zentrale Inhalte und Navigation des Prototyps.
export const site = {
  name: 'Marcel Kuhls',
  claim: 'Hochzeitsfotografie Hamburg',
  url: 'https://marcelkuhls.de',
  email: 'info@marcelkuhls.de', // laut Impressum
  instagram: 'https://www.instagram.com/marcelkuhls.photography/',
  // Google-Unternehmensprofil (Maps, CID). Stand 21.10.2026: 5,0 Sterne, 18 Bewertungen
  google: 'https://maps.google.com/?cid=2829761485552863488',
  // Google Analytics 4, Property „marcelkuhls.de Hochzeit“ (Konto a331012768), und Google Ads 481-159-1837
  // mit der Conversion „Kontakt“. Leer = kein Banner, kein Tracking.
  analytics: { ga4: 'G-V3306E4200', ads: 'AW-16714662548', adsLead: 'jbwQCJ-JxtcZEJSFlqI-' },
};

export const nav = [
  { href: '/portfolio/', label: 'Reportagen', n: '01' },
  { href: '/standesamt-fotograf-hamburg/', label: 'Standesamt', n: '02' },
  { href: '/leistungen/', label: 'Leistungen', n: '03' },
  { href: '/hochzeitslocations-hamburg/', label: 'Locations', n: '04' },
  { href: '/journal/', label: 'Journal', n: '05' },
  { href: '/ueber-mich/', label: 'Über mich', n: '06' },
];

export const more = [
  { href: '/verlobungsshooting-hamburg/', label: 'Verlobungsshooting' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/bewertungen/', label: 'Bewertungen' },
  { href: '/was-kostet-ein-hochzeitsfotograf-hamburg/', label: 'Kosten' },
  { href: '/kontakt/', label: 'Kontakt' },
];

export const legal = [
  { href: '/impressum/', label: 'Impressum' },
  { href: '/datenschutzerklaerung/', label: 'Datenschutz' },
];
