// Lokal: Prototyp (noindex). Live nur mit PUBLIC_MODE=live (GitHub Action beim Veröffentlichen).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Alte WordPress-Adressen → neue Seiten. GitHub Pages kann keine Server-Redirects,
// Astro schreibt dafür kleine HTML-Seiten mit Sofort-Weiterleitung und Canonical.
const redirects = {
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

export default defineConfig({
  site: 'https://marcelkuhls.de',
  trailingSlash: 'always',
  redirects,
  integrations: [
    sitemap({
      filter: (page) => !/\/(angebot|clients|404)\/?$/.test(page) && !Object.keys(redirects).some((r) => page.endsWith(r)),
    }),
  ],
  server: { port: 4325, host: true }, // im WLAN erreichbar (iPhone-Vorschau), nicht im Internet
  devToolbar: { enabled: false },
  image: { responsiveStyles: false },
});
