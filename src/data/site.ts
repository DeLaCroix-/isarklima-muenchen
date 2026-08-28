import type { Language } from './types';

export const site = {
  name: 'IsarKlima',
  defaultUrl: 'https://isarklima-deutschland.netlify.app',
  serviceArea: {
    de: 'Projekte in ganz Deutschland',
    en: 'Projects across Germany',
  },
  socialImage: '/images/og/isarklima-deutschland.jpg',
};

export const labels = {
  de: {
    skip: 'Zum Inhalt springen', menu: 'Menü', close: 'Schließen', nav: 'Hauptnavigation',
    services: 'Leistungen', apartment: 'Wohnung', house: 'Haus', commercial: 'Gewerbe',
    costs: 'Kosten', area: 'Deutschlandweit', guides: 'Blog', about: 'Über uns', contact: 'Kontakt',
    request: 'Projekt anfragen', home: 'Startseite', language: 'English', preview: 'Projektvorschau',
    previewText: 'Anfragen werden nach fachlicher und betrieblicher Freigabe aktiviert.',
    faq: 'Häufige Fragen', formEyebrow: 'Projektanfrage', formInactive: 'Formular in Vorbereitung',
    formNote: 'Die Online-Anfrage wird derzeit vorbereitet.',
    learnMore: 'Mehr erfahren', backGuides: 'Alle Artikel', published: 'Veröffentlicht', updated: 'Aktualisiert',
    related: 'Passende nächste Schritte', legalDraft: 'Rechtliche Angaben werden vor Veröffentlichung ergänzt.',
  },
  en: {
    skip: 'Skip to content', menu: 'Menu', close: 'Close', nav: 'Main navigation',
    services: 'Services', apartment: 'Apartment', house: 'House', commercial: 'Commercial',
    costs: 'Costs', area: 'Across Germany', guides: 'Blog', about: 'About', contact: 'Contact',
    request: 'Discuss your project', home: 'Home', language: 'Deutsch', preview: 'Project preview',
    previewText: 'Enquiries will be enabled after technical and business approval.',
    faq: 'Frequently asked questions', formEyebrow: 'Project enquiry', formInactive: 'Form in preparation',
    formNote: 'Online enquiries are currently being prepared.',
    learnMore: 'Learn more', backGuides: 'All articles', published: 'Published', updated: 'Updated',
    related: 'Useful next steps', legalDraft: 'Legal details will be completed before publication.',
  },
} satisfies Record<Language, Record<string, string>>;

export const navigation = {
  de: [
    ['/split-klimaanlage-installation/', 'Leistungen'],
    ['/klimaanlage-wohnung/', 'Wohnung'],
    ['/klimaanlage-haus/', 'Haus'],
    ['/klimaanlage-buero-gewerbe/', 'Gewerbe'],
    ['/klimaanlage-kosten/', 'Kosten'],
    ['/ratgeber/', 'Blog'],
  ],
  en: [
    ['/en/split-air-conditioning-installation/', 'Services'],
    ['/en/air-conditioning-apartment/', 'Apartment'],
    ['/en/air-conditioning-house/', 'House'],
    ['/en/air-conditioning-office-commercial/', 'Commercial'],
    ['/en/air-conditioning-installation-costs/', 'Costs'],
    ['/en/guides/', 'Blog'],
  ],
} satisfies Record<Language, [string, string][]>;

export const footerNavigation = {
  de: [
    ['/klimaanlage-nachruesten/', 'Klimaanlage nachrüsten'],
    ['/einsatzgebiet/', 'Deutschlandweit'],
    ['/ueber-uns/', 'Über uns'],
    ['/kontakt/', 'Kontakt'],
    ['/impressum/', 'Impressum'],
    ['/datenschutz/', 'Datenschutz'],
  ],
  en: [
    ['/en/retrofit-air-conditioning/', 'Retrofit air conditioning'],
    ['/en/service-area/', 'Across Germany'],
    ['/en/about/', 'About'],
    ['/en/contact/', 'Contact'],
    ['/en/imprint/', 'Imprint'],
    ['/en/privacy/', 'Privacy'],
  ],
} satisfies Record<Language, [string, string][]>;

export function localizedHome(lang: Language) {
  return lang === 'de' ? '/' : '/en/';
}
