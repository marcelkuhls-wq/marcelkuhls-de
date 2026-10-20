// Listet alle offenen Prüfpunkte (class="todo", f.check in FAQ). Vor dem Livegang: npm run todos
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
let n = 0;
for (const f of walk(root).filter((f) => /\.(astro|ts)$/.test(f))) {
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const m = line.match(/class="todo"[^>]*>([^<]*)/) || line.match(/check: true/);
    if (m) { n++; console.log(`${path.relative(root, f)}:${i + 1}  ${(m[1] ?? 'FAQ-Antwort prüfen').trim().slice(0, 140)}`); }
  });
}
console.log(n ? `\n${n} offene Punkte. Im Live-Modus sind sie unsichtbar.` : 'Keine offenen Punkte.');
