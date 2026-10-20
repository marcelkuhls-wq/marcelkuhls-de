// Bild-Sitemap (sitemap-images.xml) nach dem Build: pro indexierbarer Seite alle Fotos in größter Auflösung.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default function imageSitemap({ site }) {
  return {
    name: 'image-sitemap',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        const pages = [];
        const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
          const p = path.join(d, e.name);
          if (e.isDirectory() && e.name !== '_astro') walk(p);
          else if (e.name === 'index.html') pages.push(p);
        });
        walk(root);
        const urls = [];
        for (const file of pages) {
          const html = fs.readFileSync(file, 'utf8');
          if (/name="robots" content="noindex/.test(html) || /http-equiv="refresh"/.test(html)) continue;
          const loc = new URL(path.relative(root, path.dirname(file)).split(path.sep).join('/') + '/', site).href.replace(/([^:])\/\/$/, '$1/');
          const seen = new Set();
          const imgs = [];
          for (const m of html.matchAll(/<picture>([\s\S]*?)<\/picture>/g)) {
            const block = m[1];
            const set = (block.match(/<source(?![^>]*media=)[^>]*srcset="([^"]+)"/) || [])[1];
            const alt = (block.match(/<img[^>]*alt="([^"]*)"/) || [])[1] || '';
            if (!set) continue;
            const biggest = set.split(',').map((x) => x.trim().split(' ')).sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0][0];
            const abs = new URL(biggest, site).href;
            if (seen.has(abs)) continue;
            seen.add(abs);
            imgs.push(`<image:image><image:loc>${esc(abs)}</image:loc>${alt ? `<image:caption>${esc(alt.replace(/&amp;/g, '&'))}</image:caption>` : ''}</image:image>`);
          }
          if (imgs.length) urls.push(`<url><loc>${esc(loc)}</loc>${imgs.join('')}</url>`);
        }
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`;
        fs.writeFileSync(path.join(root, 'sitemap-images.xml'), xml);
      },
    },
  };
}
