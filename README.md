# marcelkuhls.de · Design-Prototyp

Isolierter Entwurf. Kein Deployment, keine Verbindung zur produktiven WordPress-Seite, von Suchmaschinen gesperrt (noindex + robots.txt).

```bash
npm install
npx astro dev --port 4325
```

Dann http://localhost:4325 öffnen.

- `research/` Audit, Referenzanalyse, Search Console, Designrichtung
- `src/data/reportages.ts` alle Reportagen, nur belegte Fakten
- `src/components/Gallery.astro` automatische Bildkompositionen
- `src/scripts/motion.js` Animationen (GSAP, Lenis), respektiert reduced motion
- Gelbe Markierungen auf den Seiten = Inhalte, die Marcel ergänzen oder freigeben muss
