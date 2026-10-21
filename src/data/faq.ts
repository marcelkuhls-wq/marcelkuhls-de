// FAQ-Sammlung. Themen nach Häufigkeit bei den Tier-A-Wettbewerbern (research/05, Abschnitt 9.1),
// Antworten nur aus Fakten, die Marcel auf marcelkuhls.de veröffentlicht hat.
// `check: true` = Antwort vor Livegang von Marcel prüfen lassen.
export type Faq = { q: string; a: string; cat: 'Kosten' | 'Ablauf' | 'Bilder' | 'Standesamt' | 'Buchung'; check?: boolean };

export const faqs: Faq[] = [
  { cat: 'Kosten', q: 'Was kostet ein Hochzeitsfotograf in Hamburg?', a: 'Eine ganztägige Reportage kostet in Hamburg meist zwischen 2.000 und 3.500 €, ein Standesamt meist zwischen 650 und 1.400 €. Mein Angebot richtet sich nach Dauer und Ablauf eures Tages. Ihr bekommt es innerhalb von 24 Stunden.' },
  { cat: 'Buchung', q: 'Wie weit im Voraus sollten wir buchen?', a: 'Je früher, desto sicherer, besonders für Samstage im Sommer. Aktuell vergebe ich Termine für 2026 und 2027.' },
  { cat: 'Ablauf', q: 'Wie viele Stunden sind sinnvoll?', a: 'Für Standesamt und kleine Hochzeiten meist drei bis fünf Stunden. Für eine ganze Reportage vom Getting Ready bis zum ersten Tanz acht bis zehn Stunden. Wer bis zur Party bleiben möchte, plant zwölf Stunden ein.' },
  { cat: 'Bilder', q: 'Wann bekommen wir die Bilder?', a: 'Nach etwa zwei Wochen in einer privaten Online-Galerie. Bei längeren Reportagen gibt es vorher eine kleine Vorschau.' },
  { cat: 'Bilder', q: 'Wie viele Bilder bekommen wir?', a: 'Bei einer ganztägigen Reportage mehrere hundert bearbeitete Bilder. Eine feste Obergrenze gibt es nicht. Ihr bekommt alle gelungenen Aufnahmen.' },
  { cat: 'Standesamt', q: 'Begleitest du auch nur das Standesamt oder eine kleine Hochzeit?', a: 'Ja, sehr gern. Oft sind es nur zwanzig Minuten im Trauzimmer, aber genau die will man später wiedersehen. Dazu kommen die Gratulationen vor der Tür und ein paar ruhige Minuten zu zweit.' },
  { cat: 'Buchung', q: 'Was passiert, wenn du krank wirst?', a: 'Dann springt ein Kollege oder eine Kollegin aus meinem Netzwerk ein. Ihr bleibt nicht ohne Fotograf.' },
  { cat: 'Kosten', q: 'Kommen Anfahrtskosten dazu?', a: 'Im Raum Hamburg ist die Anfahrt enthalten. Für Hochzeiten weiter weg nenne ich die Reisekosten vorher im Angebot.' },
  { cat: 'Bilder', q: 'Bearbeitest du alle Bilder?', a: 'Ja. Jedes Bild, das in eure Galerie kommt, ist von mir bearbeitet. Der größte Teil entsteht in Farbe, Schwarzweiß nehme ich, wenn eine Szene dadurch klarer wird.' },
  { cat: 'Bilder', q: 'Dürfen wir die Bilder in sozialen Medien zeigen?', a: 'Ja, für private Zwecke, also auch auf Instagram oder Facebook. Über eine Erwähnung freue ich mich.', check: true },
  { cat: 'Buchung', q: 'Wie läuft die Buchung ab?', a: 'Ihr schreibt mir Datum und Location. Innerhalb von 24 Stunden bekommt ihr Antwort und Angebot. Danach sprechen wir kurz per Video oder Telefon. Mit Vertrag und Anzahlung ist euer Datum fest.' },
  { cat: 'Buchung', q: 'Können wir uns vorher kennenlernen?', a: 'Ja, das Kennenlerngespräch ist kostenlos und unverbindlich, per Video oder Telefon. Danach wisst ihr, ob es passt.' },
  { cat: 'Ablauf', q: 'Was machen wir bei Regen?', a: 'Hamburg eben. Wir überlegen vorher gemeinsam, wo es überdacht schöne Ecken gibt. Regen sieht auf Bildern oft besser aus, als man denkt.' },
  { cat: 'Ablauf', q: 'Wir stehen nicht gern vor der Kamera. Geht das trotzdem?', a: 'Genau dafür fotografiere ich so, wie ich fotografiere. Ich laufe mit, ich inszeniere nicht. Bei den Paarbildern gibt es so viel Anleitung, wie ihr braucht, und so wenig wie möglich.' },
  { cat: 'Standesamt', q: 'Darf man im Standesamt fotografieren?', a: 'In der Regel ja, aber jedes Standesamt legt eigene Regeln fest, etwa zum Standplatz oder zum Blitz. Ich kläre das vorher mit euch, damit am Tag niemand überrascht wird.' },
  { cat: 'Ablauf', q: 'Fotografierst du auch außerhalb von Hamburg?', a: 'Ja. In Schleswig-Holstein und Niedersachsen genauso wie auf Mallorca. Zuhause bin ich in Hamburg, unterwegs bin ich überall, wo ihr feiert.' },
];

export const faqSchema = (list: Faq[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const pick = (...qs: string[]) => faqs.filter((f) => qs.some((q) => f.q.startsWith(q)));
