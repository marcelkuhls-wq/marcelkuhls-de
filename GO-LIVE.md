# Go-Live marcelkuhls.de

**Live seit 21.10.2026.** Repo github.com/marcelkuhls-wq/marcelkuhls-de, GitHub Pages, DNS bei WordPress.com umgestellt (MX udag unverändert). GA4-Property „marcelkuhls.de Hochzeit“ (G-V3306E4200, p559872415) hinter Opt-in-Banner, Sitemap in der Search Console eingereicht, alte WordPress-Sitemap entfernt.

Offen nach dem Start:
- www-Zertifikat abwarten, dann in GitHub Pages „Enforce HTTPS“ aktivieren
- Nach der ersten echten Anfrage `generate_lead` in GA4 als Schlüsselereignis markieren (Verwaltung → Ereignisse → Stern)
- Web3Forms läuft über das Konto marcel.kuhls@web.de (Anfragen landen dort)
- Altes GA4-Tag G-VMXBV47J77 und Google Ads AW-16714662548 der WordPress-Seite sind nicht mehr eingebunden

---

Ursprünglicher Plan:

## Was schon fertig im Projekt liegt

- **Zwei Modi.** Lokal ist alles Prototyp: noindex, `robots.txt` mit `Disallow: /`, das Formular sendet nichts, gelbe Prüfpunkte sind sichtbar. Mit `PUBLIC_MODE=live` (setzt die GitHub Action) ist die Seite indexierbar und hat Sitemap und Verifizierungs-Tags. Das Formular sendet dann echt, die Prüfpunkte sind ausgeblendet.
- **Search Console bleibt verifiziert.** Beide `google-site-verification`-Tags und der Facebook-Tag von der alten Seite stehen live im `<head>`.
- **Sitemap:** `/sitemap-index.xml`, ohne `/angebot/`, `/clients/` und Weiterleitungen.
- **Alte Adressen bleiben erreichbar.**
  - Mit Inhalt neu gebaut: `/hochzeitsfotos/`, `/heiraten-in-hamburg/`, `/hochzeit-gutshaus-norddeutschland/`, `/kleine-hochzeit-hamburg/`, alle Reportagen unter `/portfolio/…`.
  - `/angebot/` mit deinen Preisen, bleibt noindex.
  - `/clients/` ist ein einfacher Kundenbereich. Das alte Login-Portal läuft auf einer statischen Seite nicht.
- **Weiterleitungen** (in `astro.config.mjs`):

  | Alte Adresse | Neue Adresse |
  |---|---|
  | /about/, /ueber/ | /ueber-mich/ |
  | /contact/, /dankesseite/ | /kontakt/ |
  | /services/ | /leistungen/ |
  | /homepage-2/, /mobile-menu/ | / |
  | /portfolio-archive/ | /portfolio/ |
  | /portfolio/hochzeit-gut-prunstorf/ | /portfolio/hochzeit-gut-pronstorf/ |
  | /ratgeber/, /category/allgemein/ | /journal/ |
  | /cookie-richtlinie/ | /datenschutzerklaerung/ |
  | /clients-2/ | /clients/ |
- **Deploy:** `.github/workflows/deploy.yml` ist genauso aufgebaut wie bei Studio Kuhls. `public/CNAME` ist `marcelkuhls.de`.

## Was Marcel vorher liefern oder entscheiden muss

1. **Web3Forms-Schlüssel für info@marcelkuhls.de.** Auf web3forms.com mit der Adresse anlegen, Schlüssel kommt per Mail. Ohne ihn bricht der Live-Build bewusst ab, damit keine Anfrage verloren geht.
2. **Datenschutzerklärung und Impressum anpassen.** Die gelben Hinweise stehen oben auf beiden Seiten.
   - Anschrift ist geklärt: Mühlenkamp 52, 22303 Hamburg (in beiden Texten eingetragen)
   - Hoster: GitHub Pages statt WordPress
   - Web3Forms für das Formular
   - Google Fonts streichen
   - Google Analytics und AdSense aus dem Impressum streichen
3. **Offene Prüfpunkte:** `npm run todos` listet alle (zurzeit 22). Die wichtigsten:
   - Link zum Google-Profil auf `/bewertungen/`
   - Prüfen, ob die FAQ-Antworten mit Markierung stimmen
   - Amt auf der Standesamt-Seite
4. **Porträt:** erledigt (`Fotos/Über mich`).
5. **Kundenportal:** Nutzt du das alte Login-Portal noch aktiv? Wenn ja, brauchen wir dafür eine andere Lösung, z. B. Dokumente nur noch per Mail oder über Scrappbook.

## Ablauf bei „go“ (nur mit Marcels Freigabe je Schritt)

1. **Sicherung:** WordPress-Export (Werkzeuge → Daten exportieren) und eine Mediathek-Sicherung lokal ablegen.
2. **GitHub:** neues privates Repo `marcelkuhls-wq/marcelkuhls-de` anlegen. Dann die Secret `WEB3FORMS_KEY` setzen, pushen, unter Settings → Pages „GitHub Actions“ wählen und als Custom Domain `marcelkuhls.de` eintragen.
3. **Erst prüfen, dann umstellen:** Der erste Build läuft unter `marcelkuhls-wq.github.io/marcelkuhls-de`. Dort alle Seiten, das Formular (eine Testanfrage) und die Weiterleitungen ansehen.
4. **DNS bei WordPress.com** (Domains → marcelkuhls.de → DNS). Die Nameserver zeigen auf WordPress.com. Bevor du dort kündigst, klären, wo die Domain registriert ist: bei WordPress.com oder bei united-domains, wo auch die Mail liegt (udag).
   - A-Records `@` ersetzen durch: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - AAAA `@`: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
   - CNAME `www` → `marcelkuhls-wq.github.io`
   - **MX bleibt unverändert** (mx00.udag.de, mx01.udag.de), sonst kommt keine Mail mehr an.
   - SPF-TXT später an den echten Mailversand anpassen. `_spf.wpcloud.com` wird dann nicht mehr gebraucht. Vorher klären, über welchen Server du Mails verschickst.
5. **HTTPS:** In GitHub Pages „Enforce HTTPS“ aktivieren, sobald das Zertifikat da ist (Minuten bis wenige Stunden).
6. **Search Console:**
   - Prüfen, dass die Property verifiziert bleibt.
   - `https://marcelkuhls.de/sitemap-index.xml` einreichen.
   - Für die wichtigsten Seiten eine URL-Prüfung starten: Start, Standesamt, Kosten, Gut Pronstorf, Hochzeitsfotos.
7. **Achtung DNS beim Kündigen:** marcelkuhls.de ist bei WordPress.com nur verbunden (registriert vermutlich bei united-domains), der DNS läuft aber über die WordPress.com-Nameserver. Vor der Kündigung die Nameserver beim Registrar wieder auf dessen eigene DNS stellen und dort dieselben Einträge anlegen: GitHub-A/AAAA, www-CNAME, MX udag, SPF, DMARC. Sonst sind Website und Mail weg.
8. **WordPress-Tarif:** erst kündigen, wenn die neue Seite eine Woche stabil läuft. Wenn die Domain dort registriert ist, muss sie vorher umziehen (z. B. zu united-domains) oder als reine Domain weiterlaufen. Sonst fallen Website und Mail aus.

## Nach dem Start (Woche 1 bis 4)

- In der Search Console unter „Seiten“ auf 404-Fehler achten. Fehlende alte Adressen in `astro.config.mjs` unter `redirects` nachtragen.
- Rankings vergleichen für „gut pronstorf hochzeit“, „hochzeitsfotograf hamburg preise“, „fotograf standesamt hamburg“, „hochzeitsfotos“.
- Jede Anfrage über das Formular kurz gegenprüfen, ob sie ankommt.
