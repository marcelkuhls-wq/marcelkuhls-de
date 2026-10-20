// Fotos-Import: zieht Bilder aus ./Fotos/<ordner>/ in src/assets/photos/<ordner>/
// Aufruf:  npm run fotos          (einmal importieren)
//          npm run fotos:watch    (läuft weiter und importiert neue Bilder sofort)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const INBOX = path.join(ROOT, 'Fotos');
const OUT = path.join(ROOT, 'src/assets/photos');
const LOG = path.join(INBOX, '.import.json'); // merkt sich, was schon importiert ist
const NAMES = path.join(ROOT, 'src/data/photo-names.json'); // SEO-Dateinamen je Ordner
const EXT = /\.(jpe?g|png|webp|tiff?|avif)$/i;
const slug = (s) => s.normalize('NFC').toLowerCase() // macOS liefert Ü zerlegt (U + Trema)
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/&/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const readLog = () => { try { return JSON.parse(fs.readFileSync(LOG, 'utf8')); } catch { return {}; } };

async function run() {
  if (!fs.existsSync(INBOX)) fs.mkdirSync(INBOX, { recursive: true });
  const log = readLog();
  const names = JSON.parse(fs.readFileSync(NAMES, 'utf8'));
  let total = 0;
  for (const dir of fs.readdirSync(INBOX, { withFileTypes: true })) {
    if (!dir.isDirectory() || dir.name.startsWith('.') || dir.name.startsWith('_')) continue;
    const key = slug(dir.name);
    const src = path.join(INBOX, dir.name);
    const dst = path.join(OUT, key);
    const files = fs.readdirSync(src).filter((f) => EXT.test(f)).sort((a, b) => a.localeCompare(b, 'de', { numeric: true }));
    if (!files.length) continue;
    fs.mkdirSync(dst, { recursive: true });
    log[key] ??= {};
    // SEO-Prefix: aus photo-names.json, sonst „hochzeit-<ordnername>“ (z. B. hochzeit-lynn-ersin-standesamt-altona)
    const prefix = names.prefix[key] ?? (/^(hochzeit|standesamt|verlobung)/.test(key) ? key : `hochzeit-${key}`);
    if (!names.prefix[key]) { names.prefix[key] = prefix; fs.writeFileSync(NAMES, JSON.stringify(names, null, 2) + '\n'); }
    const added = [];
    for (const f of files) {
      const full = path.join(src, f);
      const hash = crypto.createHash('md5').update(fs.readFileSync(full)).digest('hex');
      if (log[key][hash]) continue; // schon importiert
      const n = String(Object.keys(log[key]).length + 1).padStart(3, '0');
      await sharp(full).rotate()
        .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .toColorspace('srgb').jpeg({ quality: 86, mozjpeg: true })
        .toFile(path.join(dst, `${prefix}-${n}.jpg`));
      log[key][hash] = { n, original: f };
      added.push(`${key}/${n}  ←  ${f}  (${prefix}-${n}.jpg)`);
    }
    if (added.length) {
      console.log(`\n${dir.name}: ${added.length} neue Bilder`);
      added.forEach((a) => console.log('  ' + a));
      total += added.length;
    }
  }
  fs.writeFileSync(LOG, JSON.stringify(log, null, 1));
  console.log(total ? `\nFertig: ${total} Bilder importiert. In der Website als "<ordner>/<nummer>" verwenden.` : 'Keine neuen Bilder.');
}

await run();
if (process.argv.includes('--watch')) {
  console.log(`\nBeobachte ${INBOX} … (Strg+C zum Beenden)`);
  let t;
  fs.watch(INBOX, { recursive: true }, (_, file) => {
    if (!file || file.endsWith('.import.json') || !EXT.test(file)) return;
    clearTimeout(t);
    t = setTimeout(() => run().catch((e) => console.error(e.message)), 1500); // warten, bis das Kopieren fertig ist
  });
}
