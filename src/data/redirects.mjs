// Alte WordPress-Adressen → neue Seiten. GitHub Pages kann keine 301-Weiterleitungen,
// deshalb erzeugt src/pages/[...alt].astro für jede alte Adresse eine Weiterleitungsseite
// (Meta-Refresh 0 s + Canonical, von Google wie eine dauerhafte Weiterleitung behandelt).
export const redirects = {
  '/about/': '/ueber-mich/',
  '/ueber/': '/ueber-mich/',
  '/contact/': '/kontakt/',
  '/dankesseite/': '/kontakt/',
  '/services/': '/leistungen/',
  '/homepage-2/': '/',
  '/mobile-menu/': '/',
  '/portfolio-archive/': '/portfolio/',
  '/portfolio/hochzeit-gut-prunstorf/': '/portfolio/hochzeit-gut-pronstorf/',
  '/ratgeber/': '/journal/',
  '/category/allgemein/': '/journal/',
  '/cookie-richtlinie/': '/datenschutzerklaerung/',
  '/standesamtliche-hochzeit-hamburg/': '/standesamt-fotograf-hamburg/',
  '/clients-2/': '/clients/',
  '/author/marcelkuhls/': '/ueber-mich/',
};
