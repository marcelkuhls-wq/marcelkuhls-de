// Lokal: Prototyp (noindex). Live nur mit PUBLIC_MODE=live (GitHub Action beim Veröffentlichen).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { redirects } from './src/data/redirects.mjs';

export default defineConfig({
  site: 'https://marcelkuhls.de',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !/\/(angebot|clients|404)\/?$/.test(page) && !Object.keys(redirects).some((r) => page.endsWith(r)),
    }),
  ],
  server: { port: 4325, host: true }, // im WLAN erreichbar (iPhone-Vorschau), nicht im Internet
  devToolbar: { enabled: false },
  image: { responsiveStyles: false },
});
