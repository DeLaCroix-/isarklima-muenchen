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
  '/': ['home', 'Startseite', 'Klimaanlagen in Deutschland | IsarKlima', 'Planung und Installation von Single- und Multi-Split-Klimaanlagen für Wohnungen, Häuser, Büros und Gewerbeflächen in ganz Deutschland.', 'Deutschlandweit · Planung & Montage', 'hero-installation-detail', 'Montagearbeiten an einem Split-Klimagerät in einem modernen Wohnraum'],
  '/en/': ['home', 'Home', 'Air conditioning across Germany | IsarKlima', 'Single-split and multi-split air conditioning planned and installed for apartments, homes, offices and commercial spaces across Germany.', 'Across Germany · planning & installation', 'hero-installation-detail', 'Split air conditioning installation work in a modern living space'],
  '/split-klimaanlage-installation/': ['split', 'Split-Klimaanlage', 'Split-Klimaanlage installieren lassen | IsarKlima', 'Fachgerechte Planung und Installation von Single- und Multi-Split-Klimaanlagen für Wohnungen, Häuser und Gewerbeflächen in ganz Deutschland.', 'Single- & Multi-Split', 'commissioning-gauges', 'Prüfgeräte bei der Inbetriebnahme einer Split-Klimaanlage'],
  '/en/split-air-conditioning-installation/': ['split', 'Split air conditioning', 'Split air conditioning installation | IsarKlima', 'Professional planning and installation of single-split and multi-split air conditioning systems for properties across Germany.', 'Single- & multi-split', 'commissioning-gauges', 'Test gauges used while commissioning a split air conditioning system'],
  '/klimaanlage-wohnung/': ['apartment', 'Wohnung', 'Klimaanlage für die Wohnung | IsarKlima', 'Split-Klimaanlagen für Miet- und Eigentumswohnungen: Freigaben, Planung und Installation für Projekte in ganz Deutschland.', 'Wohnung · Planung · Freigabe', 'apartment-interior-face-free', 'Heller Wohnraum als Symbolbild für angenehmes Raumklima'],
  '/en/air-conditioning-apartment/': ['apartment', 'Apartment', 'Air conditioning for apartments | IsarKlima', 'Split air conditioning for rental and owner-occupied apartments, including permissions, planning and installation across Germany.', 'Apartment · planning · consent', 'apartment-interior-face-free', 'Bright apartment living space illustrating indoor comfort'],
  '/klimaanlage-haus/': ['house', 'Haus', 'Klimaanlage fürs Haus | Planung & Installation', 'Single- und Multi-Split-Klimaanlagen für Häuser, passend zu Räumen, Leitungswegen und Außenstandort geplant und installiert.', 'Haus · Single- & Multi-Split', 'split-unit-interior', 'Wandgerät einer Split-Klimaanlage in einem Wohnraum'],
  '/en/air-conditioning-house/': ['house', 'House', 'Air conditioning for homes | IsarKlima', 'Single-split and multi-split air conditioning for homes, planned around rooms, routes and the outdoor-unit location.', 'Home · single- & multi-split', 'split-unit-interior', 'Wall-mounted split air conditioning unit in a home interior'],
  '/klimaanlage-buero-gewerbe/': ['commercial', 'Büro und Gewerbe', 'Klimaanlagen für Büro und Gewerbe | IsarKlima', 'Split-Klimaanlagen für Büros und Gewerbeflächen: Projektplanung, Montage und dokumentierte Übergabe in ganz Deutschland.', 'Büro & Gewerbeflächen', 'commercial-installation-detail', 'Geordnete Montage einer Split-Klimaanlage in einem Gewerberaum'],
  '/en/air-conditioning-office-commercial/': ['commercial', 'Office and commercial', 'Air conditioning for offices and commercial spaces', 'Split air conditioning for offices and commercial spaces across Germany, from project planning to documented handover.', 'Offices & commercial spaces', 'commercial-installation-detail', 'Organised split air conditioning installation in a commercial interior'],
  '/klimaanlage-nachruesten/': ['retrofit', 'Nachrüstung', 'Klimaanlage im Bestandsgebäude nachrüsten', 'Split-Klimaanlage im Bestand nachrüsten: Einbausituation, Freigaben, Leitungswege und technische Schnittstellen projektbezogen prüfen.', 'Nachrüstung im Bestand', 'outdoor-unit-installation-neutral', 'Montage eines Klimaanlagen-Außengeräts mit sauber geführten Leitungen'],
  '/en/retrofit-air-conditioning/': ['retrofit', 'Retrofit', 'Retrofit air conditioning in existing properties', 'Split air conditioning retrofits for existing apartments, homes and offices, planned around the property and installation route.', 'Retrofit in existing buildings', 'outdoor-unit-installation-neutral', 'Outdoor air conditioning unit installation with neatly routed lines'],
  '/klimaanlage-kosten/': ['costs', 'Kosten', 'Klimaanlage mit Montage: Kosten | IsarKlima', 'Welche Faktoren den Preis einer Split-Klimaanlage mit Installation beeinflussen und was ein transparentes Angebot enthalten sollte.', 'Kosten transparent einordnen', 'commissioning-gauges', 'Prüfung einer Klimaanlage mit technischen Messgeräten'],
  '/en/air-conditioning-installation-costs/': ['costs', 'Installation costs', 'Air conditioning installation costs | IsarKlima', 'The factors that shape installed air conditioning costs and the information a transparent project quote should include.', 'Understanding project costs', 'commissioning-gauges', 'Technical gauges used to check an air conditioning system'],
  '/einsatzgebiet/': ['area', 'Deutschlandweit', 'Klimaanlagen-Installation deutschlandweit | IsarKlima', 'Projektanfragen aus ganz Deutschland: technische Vorprüfung, standortbezogene Planung, Logistik und Montage transparent koordiniert.', 'Projekte in ganz Deutschland', 'technical-planning-workbench', 'Technische Planung einer Klimaanlagen-Installation mit Grundriss und Messgeräten'],
  '/en/service-area/': ['area', 'Across Germany', 'Air conditioning installation across Germany', 'Air conditioning projects across Germany, with technical assessment, site-specific planning, logistics and installation coordinated clearly.', 'Projects across Germany', 'technical-planning-workbench', 'Technical planning for an air conditioning installation with floor plan and measuring tools'],
  '/ueber-uns/': ['about', 'Über uns', 'Über IsarKlima | Klimaanlagen deutschlandweit', 'IsarKlima plant und koordiniert Split-Klimaanlagen für Wohnungen, Häuser, Büros und Gewerbeflächen in ganz Deutschland.', 'Planung · Montage · Übergabe', 'technical-planning-workbench', 'Technische Projektplanung mit Grundriss, Messgeräten und Montagewerkzeug'],
  '/en/about/': ['about', 'About', 'About IsarKlima | Air conditioning across Germany', 'How IsarKlima plans and coordinates split air conditioning for apartments, homes, offices and commercial spaces across Germany.', 'Planning · installation · handover', 'technical-planning-workbench', 'Technical project planning with a floor plan, measuring instruments and installation tools'],
  '/kontakt/': ['contact', 'Kontakt', 'Klimaanlagen-Projekt anfragen | IsarKlima', 'Adresse, Gebäude, Räume, gewünschtes System und Freigabestatus für die erste Prüfung eines Klimaanlagen-Projekts vorbereiten.', 'Ihre Projektanfrage', 'hero-installation-detail', 'Montagearbeiten an einem Split-Klimagerät in einem modernen Wohnraum'],
  '/en/contact/': ['contact', 'Contact', 'Discuss an air conditioning project | IsarKlima', 'Prepare the address, property, rooms, preferred system and permission status for an initial air conditioning project assessment.', 'Tell us about your project', 'hero-installation-detail', 'Split air conditioning installation work in a modern living space'],
  '/ratgeber/': ['guides', 'Blog', 'Klimaanlagen-Blog | Planung & Installation', 'Ratgeber zu Systemwahl, Freigaben, Schall, Dimensionierung, Installation und Kosten für Klimaanlagen-Projekte in Deutschland.', 'IsarKlima Blog', 'split-unit-interior', 'Split-Klimaanlage in einem modernen Innenraum'],
  '/en/guides/': ['guides', 'Blog', 'Air conditioning blog | IsarKlima', 'Practical articles on permissions, system choice, noise, sizing, installation and costs for air conditioning projects in Germany.', 'IsarKlima Blog', 'split-unit-interior', 'Split air conditioning unit in a modern interior'],
};

const visualProfiles = {
  home: [
    { layout: 'service-bento', tone: 'paper' },
    { layout: 'process-rail', tone: 'paper', image: 'commercial-installation-detail', imagePosition: 'start' },
    { layout: 'technical-list', tone: 'ink', image: 'installation-material-detail', imagePosition: 'end' },
    { layout: 'image-statement', tone: 'isar', image: 'technical-planning-workbench', imagePosition: 'start' },
    { layout: 'technical-list', tone: 'paper', image: 'airflow-interior-detail', imagePosition: 'end' },
  ],
  split: [
    { layout: 'comparison', tone: 'paper' },
    { layout: 'media-split', tone: 'paper', image: 'airflow-interior-detail', imagePosition: 'end' },
    { layout: 'process-rail', tone: 'ink', image: 'commercial-installation-detail', imagePosition: 'start' },
    { layout: 'technical-list', tone: 'isar', image: 'installation-material-detail', imagePosition: 'end' },
  ],
  apartment: [
    { layout: 'comparison', tone: 'paper' },
    { layout: 'media-split', tone: 'paper', image: 'quiet-bedroom-interior', imagePosition: 'start' },
    { layout: 'technical-list', tone: 'ink', image: 'outdoor-unit-installation-neutral', imagePosition: 'end' },
    { layout: 'process-rail', tone: 'isar' },
  ],
  house: [
    { layout: 'comparison', tone: 'paper' },
    { layout: 'media-split', tone: 'paper', image: 'airflow-interior-detail', imagePosition: 'end' },
    { layout: 'technical-list', tone: 'ink', image: 'installation-material-detail', imagePosition: 'start' },
    { layout: 'process-rail', tone: 'isar' },
  ],
  commercial: [
    { layout: 'service-bento', tone: 'paper' },
    { layout: 'media-split', tone: 'paper', image: 'technical-planning-workbench', imagePosition: 'start' },
    { layout: 'process-rail', tone: 'ink', image: 'installation-material-detail', imagePosition: 'end' },
  ],
  retrofit: [
    { layout: 'technical-list', tone: 'paper' },
    { layout: 'media-split', tone: 'paper', image: 'installation-material-detail', imagePosition: 'end' },
    { layout: 'process-rail', tone: 'ink', image: 'technical-planning-workbench', imagePosition: 'start' },
    { layout: 'service-bento', tone: 'isar' },
  ],
  costs: [
    { layout: 'technical-list', tone: 'paper' },
    { layout: 'media-split', tone: 'paper', image: 'installation-material-detail', imagePosition: 'start' },
    { layout: 'process-rail', tone: 'ink', image: 'technical-planning-workbench', imagePosition: 'end' },
  ],
  area: [
    { layout: 'image-statement', tone: 'paper' },
    { layout: 'media-split', tone: 'paper', image: 'outdoor-unit-installation-neutral', imagePosition: 'start' },
    { layout: 'image-statement', tone: 'ink' },
    { layout: 'technical-list', tone: 'isar' },
  ],
  about: [
    { layout: 'service-bento', tone: 'paper' },
    { layout: 'media-split', tone: 'paper', image: 'installation-material-detail', imagePosition: 'end' },
    { layout: 'process-rail', tone: 'ink', image: 'commercial-installation-detail', imagePosition: 'start' },
  ],
  contact: [
    { layout: 'technical-list', tone: 'paper' },
    { layout: 'process-rail', tone: 'paper', image: 'technical-planning-workbench', imagePosition: 'end' },
  ],
  guides: [
    { layout: 'service-bento', tone: 'paper' },
  ],
};

const layoutLabels = {
  de: {
    'service-bento': 'Leistungsbild',
    comparison: 'Direkter Vergleich',
    'media-split': 'Projektansicht',
    'process-rail': 'Ablauf',
    'technical-list': 'Planungsdetails',
    'image-statement': 'Im Überblick',
  },
  en: {
    'service-bento': 'At a glance',
    comparison: 'Direct comparison',
    'media-split': 'Project view',
    'process-rail': 'Process',
    'technical-list': 'Planning details',
    'image-statement': 'The wider view',
  },
};

const imageAlts = {
  de: {
    'commercial-installation-detail': 'Geordnete Montage einer Split-Klimaanlage in einem Gewerberaum',
    'technical-planning-workbench': 'Technische Projektplanung mit Grundriss, Messgeräten und Montagewerkzeug',
    'outdoor-unit-installation-neutral': 'Montage eines Klimaanlagen-Außengeräts mit sauber geführten Leitungen',
    'installation-material-detail': 'Montagematerialien und Messwerkzeuge für eine Split-Klimaanlage',
    'quiet-bedroom-interior': 'Ruhiges Schlafzimmer mit dezent integriertem Split-Klimagerät',
    'airflow-interior-detail': 'Split-Klimagerät in einem Wohnraum mit sanft bewegtem Vorhang',
  },
  en: {
    'commercial-installation-detail': 'Organised split air conditioning installation in a commercial interior',
    'technical-planning-workbench': 'Technical project planning with a floor plan, measuring instruments and installation tools',
    'outdoor-unit-installation-neutral': 'Outdoor air conditioning unit installation with neatly routed lines',
    'installation-material-detail': 'Installation materials and measuring tools for a split air conditioning system',
    'quiet-bedroom-interior': 'Calm bedroom with a discreetly integrated split air conditioning unit',
    'airflow-interior-detail': 'Split air conditioning unit in a living space with a gently moving curtain',
  },
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
  const profile = visualProfiles[key];
  if (!profile || profile.length !== body.length) throw new Error(`Visual profile mismatch for ${raw.route}`);
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
    sections: body.map((item, index) => {
      const visual = profile[index];
      return {
        title: item.title,
        intro: item.paragraphs[0],
        paragraphs: item.paragraphs.slice(1),
        subsections: item.subsections.map((sub) => ({ title: sub.title, text: sub.paragraphs.join(' ') })),
        eyebrow: layoutLabels[raw.lang][visual.layout],
        layout: visual.layout,
        tone: visual.tone,
        ...(visual.image ? { image: visual.image, imageAlt: imageAlts[raw.lang][visual.image], imagePosition: visual.imagePosition } : {}),
      };
    }),
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
