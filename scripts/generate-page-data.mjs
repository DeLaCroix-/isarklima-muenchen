import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sources = [
  { lang: 'de', file: new URL('../content-source/de-pages.md', import.meta.url) },
  { lang: 'en', file: new URL('../content-source/en-pages.md', import.meta.url) },
];

const routePairs = [
  ['/', '/en/'],
  ['/split-klimaanlage-installation/', '/en/split-air-conditioning-installation/'],
  ['/klimaanlage-wohnung/', '/en/air-conditioning-apartment/'],
  ['/klimaanlage-haus/', '/en/air-conditioning-house/'],
  ['/klimaanlage-buero-gewerbe/', '/en/air-conditioning-office-commercial/'],
  ['/klimaanlage-nachruesten/', '/en/retrofit-air-conditioning/'],
  ['/klimaanlage-kosten/', '/en/air-conditioning-installation-costs/'],
  ['/einsatzgebiet/', '/en/service-area/'],
  ['/ueber-uns/', '/en/about/'],
  ['/kontakt/', '/en/contact/'],
  ['/ratgeber/', '/en/guides/'],
];
const alternates = new Map(routePairs.flatMap(([de, en]) => [[de, en], [en, de]]));

const meta = {
  '/': ['home', 'Startseite', 'Klimaanlagen in München | Planung und Montage – IsarKlima', 'Single- und Multi-Split-Klimaanlagen für Wohnungen, Häuser und kleinere Gewerbeflächen in München.', 'Planung und Montage', 'hero-technician', 'Techniker prüft das Innengerät einer Split-Klimaanlage'],
  '/en/': ['home', 'Home', 'Air conditioning installation in Munich | IsarKlima', 'Single-split and multi-split air conditioning installation for apartments, homes and small commercial spaces in Munich.', 'Single-split & multi-split systems', 'hero-technician', 'Technician checking an indoor split air conditioning unit'],
  '/split-klimaanlage-installation/': ['split', 'Split-Klimaanlage', 'Split-Klimaanlagen in München | Planung und Montage', 'Planung und Montage von Single- und Multi-Split-Klimaanlagen in München.', 'Single- & Multi-Split', 'commissioning-gauges', 'Prüfgeräte bei der Inbetriebnahme einer Split-Klimaanlage'],
  '/en/split-air-conditioning-installation/': ['split', 'Split air conditioning', 'Split air conditioning installation in Munich | IsarKlima', 'Planning and installation of single-split and multi-split air conditioning systems in Munich.', 'Single- & multi-split', 'commissioning-gauges', 'Test gauges used while commissioning a split air conditioning system'],
  '/klimaanlage-wohnung/': ['apartment', 'Wohnung', 'Klimaanlage für die Wohnung in München | IsarKlima', 'Split-Klimaanlage in Miet- oder Eigentumswohnungen: Freigabe, Planung und Montage in München.', 'Wohnung · Planung · Freigabe', 'apartment-comfort', 'Heller Wohnraum als Symbolbild für angenehmes Raumklima'],
  '/en/air-conditioning-apartment/': ['apartment', 'Apartment', 'Air conditioning for apartments in Munich | IsarKlima', 'Split air conditioning for rental or owner-occupied apartments: permissions, planning and installation in Munich.', 'Apartment · planning · consent', 'apartment-comfort', 'Bright apartment living space illustrating indoor comfort'],
  '/klimaanlage-haus/': ['house', 'Haus', 'Klimaanlage fürs Haus in München | IsarKlima', 'Single- oder Multi-Split-Klimaanlagen für Häuser in München: bedarfsgerechte Planung und Montage.', 'Haus · Single- & Multi-Split', 'split-unit-interior', 'Wandgerät einer Split-Klimaanlage in einem Wohnraum'],
  '/en/air-conditioning-house/': ['house', 'House', 'Home air conditioning installation in Munich | IsarKlima', 'Single-split or multi-split air conditioning for homes in Munich, planned around rooms, routes and outdoor location.', 'Home · single- & multi-split', 'split-unit-interior', 'Wall-mounted split air conditioning unit in a home interior'],
  '/klimaanlage-buero-gewerbe/': ['commercial', 'Büro und Gewerbe', 'Klimaanlage für Büro und Gewerbe in München | IsarKlima', 'Split-Klimaanlagen für Büros und kleinere Gewerbeflächen in München: Projektplanung, Montage und Übergabe.', 'Büro & kleinere Gewerbeflächen', 'installation-team', 'Techniker bei der Montage einer Klimaanlage als Symbolbild'],
  '/en/air-conditioning-office-commercial/': ['commercial', 'Office and commercial', 'Air conditioning for offices in Munich | IsarKlima', 'Split air conditioning for offices and small commercial spaces in Munich, from project planning to handover.', 'Offices & small commercial spaces', 'installation-team', 'Technicians installing air conditioning as an illustrative stock image'],
  '/klimaanlage-nachruesten/': ['retrofit', 'Nachrüstung', 'Klimaanlage nachrüsten in München | IsarKlima', 'Split-Klimaanlage im Bestand nachrüsten: Einbausituation, Freigaben und Montagewege in München prüfen.', 'Nachrüstung im Bestand', 'outdoor-unit-site', 'Außengerät einer Split-Klimaanlage an einem Gebäude'],
  '/en/retrofit-air-conditioning/': ['retrofit', 'Retrofit', 'Retrofit air conditioning in Munich | IsarKlima', 'Assessing and installing retrofit split air conditioning in existing apartments, homes and offices in Munich.', 'Retrofit in existing buildings', 'outdoor-unit-site', 'Outdoor split air conditioning unit installed at a building'],
  '/klimaanlage-kosten/': ['costs', 'Kosten', 'Klimaanlage mit Montage: Kosten in München | IsarKlima', 'Welche Faktoren den Preis einer Split-Klimaanlage mit Installation in München beeinflussen und was ins Angebot gehört.', 'Kosten transparent einordnen', 'commissioning-gauges', 'Prüfung einer Klimaanlage mit technischen Messgeräten'],
  '/en/air-conditioning-installation-costs/': ['costs', 'Installation costs', 'Air conditioning installation costs in Munich | IsarKlima', 'Factors that shape the cost of installed split air conditioning in Munich and what a transparent quote should cover.', 'Understanding project costs', 'commissioning-gauges', 'Technical gauges used to check an air conditioning system'],
  '/einsatzgebiet/': ['area', 'Einsatzgebiet', 'Klimaanlagen in München | Unser Einsatzgebiet', 'Planung und Montage von Split-Klimaanlagen in Stadt und Landkreis München; andere Standorte werden anhand des Projekts geprüft.', 'Unser Einsatzgebiet', 'munich-city', 'Blick über München mit Frauenkirche und Alpen'],
  '/en/service-area/': ['area', 'Service area', 'Air conditioning projects in Munich | IsarKlima', 'Planning and installation of split air conditioning in Munich and the Munich district; other locations are reviewed from the project details.', 'Where we work', 'munich-city', 'View over Munich with the Frauenkirche and Alps'],
  '/ueber-uns/': ['about', 'Über uns', 'Über IsarKlima | Klimaanlagen in München', 'So plant IsarKlima Split-Klimaanlagen für Wohnungen, Häuser und kleinere Gewerbeflächen in München.', 'Planung · Montage · Übergabe', 'technician-outdoor-portrait', 'Symbolbild eines Klimatechnikers neben einem Außengerät'],
  '/en/about/': ['about', 'About', 'About IsarKlima | Air conditioning installation in Munich', 'How IsarKlima plans split air conditioning for apartments, homes and small commercial spaces in Munich.', 'Planning · installation · handover', 'technician-outdoor-portrait', 'Illustrative image of an air conditioning technician beside an outdoor unit'],
  '/kontakt/': ['contact', 'Kontakt', 'Angebot für eine Klimaanlage in München | IsarKlima', 'Projektangaben für eine Split-Klimaanlage in München vorbereiten und nach Freigabe sicher übermitteln.', 'Ihre Projektanfrage', 'hero-technician', 'Techniker bei der Prüfung eines Klimaanlagen-Innengeräts'],
  '/en/contact/': ['contact', 'Contact', 'Request an air conditioning quote in Munich | IsarKlima', 'Prepare the details for a split air conditioning project in Munich and submit them once enquiries are enabled.', 'Tell us about your project', 'hero-technician', 'Technician checking an indoor air conditioning unit'],
  '/ratgeber/': ['guides', 'Ratgeber', 'Klimaanlagen-Ratgeber für München | IsarKlima', 'Praxisnahe Grundlagen zu Freigaben, Systemwahl, Schall, Dimensionierung, Montage und Kosten in München.', 'Wissen rund um Klimaanlagen', 'split-unit-interior', 'Split-Klimaanlage in einem modernen Innenraum'],
  '/en/guides/': ['guides', 'Guides', 'Air conditioning installation guides for Munich | IsarKlima', 'Practical guidance on permissions, system choice, noise, sizing, installation and costs for Munich projects.', 'Air conditioning guidance', 'split-unit-interior', 'Split air conditioning unit in a modern interior'],
};

function parsePages(markdown, lang) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const pages = [];
  let page = null;
  let section = null;
  let subsection = null;
  let paragraph = [];

  const flushParagraph = () => {
    const text = paragraph.join(' ').trim();
    paragraph = [];
    if (!text || !page) return;
    if (subsection) subsection.paragraphs.push(text);
    else if (section) section.paragraphs.push(text);
    else if (page.h1) page.intro.push(text);
  };
  const flushPage = () => {
    flushParagraph();
    if (page?.route && page.h1) pages.push(page);
    page = null; section = null; subsection = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    const routeMatch = line.match(/^\*\*Route:\*\*\s+`([^`]+)`/) ?? line.match(/^<!-- Seite: ([^ ]+) -->$/);
    if (routeMatch) { flushPage(); page = { route: routeMatch[1], lang, h1: '', intro: [], sections: [] }; continue; }
    if (!page || line === '---') continue;
    if (line.startsWith('### ')) { flushParagraph(); subsection = { title: line.slice(4), paragraphs: [] }; section?.subsections.push(subsection); continue; }
    if (line.startsWith('## ')) { flushParagraph(); section = { title: line.slice(3), paragraphs: [], subsections: [] }; page.sections.push(section); subsection = null; continue; }
    if (line.startsWith('# ')) { flushParagraph(); page.h1 = line.slice(2); section = null; subsection = null; continue; }
    if (!line) flushParagraph();
    else paragraph.push(line);
  }
  flushPage();
  return pages;
}

function toPageContent(raw) {
  const settings = meta[raw.route];
  if (!settings) throw new Error(`Missing metadata for ${raw.route}`);
  const [key, navLabel, title, description, eyebrow, heroImage, heroImageAlt] = settings;
  const body = raw.sections.slice(0, -2);
  const faq = raw.sections.at(-2);
  const form = raw.sections.at(-1);
  const imageCycle = ['split-unit-interior', 'outdoor-unit-site', 'commissioning-gauges', 'munich-city'];
  return {
    key,
    lang: raw.lang,
    path: raw.route,
    alternatePath: alternates.get(raw.route),
    navLabel,
    title,
    description,
    eyebrow,
    h1: raw.h1,
    intro: raw.intro.join(' '),
    heroImage,
    heroImageAlt,
    heroNote: raw.lang === 'de' ? 'Planung & Montage' : 'Planning & installation',
    sections: body.map((item, index) => ({
      title: item.title,
      intro: item.paragraphs[0],
      paragraphs: item.paragraphs.slice(1),
      subsections: item.subsections.map((sub) => ({ title: sub.title, text: sub.paragraphs.join(' ') })),
      ...(index === 1 ? { image: imageCycle[(routePairs.flat().indexOf(raw.route) + index) % imageCycle.length], imageAlt: raw.lang === 'de' ? 'Lizenziertes Symbolbild zur Planung einer Split-Klimaanlage' : 'Licensed illustrative image for split air conditioning planning' } : {}),
      tone: index % 4 === 2 ? 'ink' : index % 5 === 3 ? 'isar' : 'paper',
    })),
    faqTitle: faq.title,
    faq: faq.subsections.map((item) => ({ question: item.title, answer: item.paragraphs.join(' ') })),
    formTitle: form.title,
    formIntro: form.paragraphs.join(' '),
  };
}

const all = [];
for (const source of sources) {
  const markdown = await readFile(source.file, 'utf8');
  all.push(...parsePages(markdown, source.lang).map(toPageContent));
}

const outputPath = `${root}src/data/pages.generated.json`;
const serialized = `${JSON.stringify(all, null, 2)}\n`;

if (process.argv.includes('--check')) {
  const current = await readFile(outputPath, 'utf8');
  if (current !== serialized) {
    console.error('Generated page data is stale. Run npm run generate:pages and commit the result.');
    process.exit(1);
  }
  console.log(`Generated page data is current: ${all.length} bilingual page records.`);
} else {
  await writeFile(outputPath, serialized, 'utf8');
  console.log(`Generated ${all.length} bilingual page records.`);
}
