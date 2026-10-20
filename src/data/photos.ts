import type { ImageMetadata } from 'astro';
import names from './photo-names.json';

// Fotos liegen unter src/assets/photos/<ordner>/<seo-name>-<nummer>.jpg.
// Im Code bleibt der kurze Schlüssel "<ordner>/<nummer>", der SEO-Name steckt nur im Dateinamen
// und landet so in den ausgelieferten Bild-URLs (z. B. hochzeit-gut-bardenhagen-joana-dennis-016.webp).
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*/*.jpg', { eager: true });
const miscByFile: Record<string, string> = Object.fromEntries(Object.entries(names.misc).map(([key, file]) => [file, key]));

export const photos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => {
    const [, dir, file] = path.match(/photos\/([^/]+)\/([^/]+)\.jpg$/)!;
    if (dir === 'misc') return [`misc/${miscByFile[file] ?? file}`, mod.default];
    const num = file.match(/(\d+)$/)?.[1] ?? file;
    return [`${dir}/${num}`, mod.default];
  }),
);

export function photo(key: string): ImageMetadata {
  const p = photos[key];
  if (!p) throw new Error(`Foto nicht gefunden: ${key}`);
  return p;
}

export function series(slug: string): string[] {
  return Object.keys(photos).filter((k) => k.startsWith(`${slug}/`)).sort();
}

// Porträt von Marcel vor der Elbphilharmonie (Fotos/Über mich)
export const PORTRAIT = 'ueber-mich/001';
// Frontal, Gesicht mittig: Startseite und kleine Autorenbilder
export const PORTRAIT_FRONT = 'ueber-mich/003';
