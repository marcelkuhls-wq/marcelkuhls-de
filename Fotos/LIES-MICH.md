# Fotos für die Website

1. Pro Hochzeit einen Ordner anlegen, z. B. `Hochzeit Gut Pronstorf` oder `Lynn & Ersin`.
2. Bilder einfach hineinziehen (JPG, PNG, WebP, TIFF). Dateinamen sind egal, die Reihenfolge folgt dem Dateinamen.
3. Im Terminal im Projektordner: `npm run fotos`
   oder dauerhaft im Hintergrund: `npm run fotos:watch` (importiert neue Bilder sofort).

Die Bilder landen verkleinert (2000 px, sRGB) unter `src/assets/photos/<ordnername>/` mit SEO-Dateinamen, z. B. `hochzeit-gut-bardenhagen-joana-dennis-001.jpg`.
Tipp: Schreibt Ort und Paar in den Ordnernamen, dann wird der Dateiname automatisch gut. Den Namen pro Ordner kann man in `src/data/photo-names.json` anpassen.
Aus `Lynn & Ersin` wird dabei `lynn-ersin`. In der Website heißt ein Bild dann `lynn-ersin/001`.

- Schon importierte Bilder werden nicht doppelt übernommen, neue werden hinten angehängt.
- Ordner, die mit `_` beginnen, werden ignoriert (z. B. `_Archiv`).
- Originale bleiben hier liegen und werden nicht verändert.
