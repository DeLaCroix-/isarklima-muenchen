import type { Language } from './types';

export const site = {
  name: 'IsarKlima',
  defaultUrl: 'https://isarklima-muenchen.netlify.app',
  email: 'projekt@isarklima.example',
  serviceArea: 'München und Landkreis München',
  socialImage: '/images/og/isarklima-muenchen.jpg',
};

export const labels = {
  de: {
    skip: 'Zum Inhalt springen', menu: 'Menü', close: 'Schließen', nav: 'Hauptnavigation',
    services: 'Leistungen', apartment: 'Wohnung', house: 'Haus', commercial: 'Gewerbe',
    costs: 'Kosten', area: 'Einsatzgebiet', guides: 'Ratgeber', about: 'Über uns', contact: 'Kontakt',
    request: 'Projekt anfragen', home: 'Startseite', language: 'English', preview: 'Projektvorschau',
    previewText: 'Anfragen werden nach fachlicher und betrieblicher Freigabe aktiviert.',
    faq: 'Häufige Fragen', formEyebrow: 'Projektanfrage', formInactive: 'Formular in Vorbereitung',
    formNote: 'Die Anfragefunktion wird nach Hinterlegung des Formspree-Endpunkts aktiviert.',
    learnMore: 'Mehr erfahren', backGuides: 'Alle Ratgeber', published: 'Veröffentlicht', updated: 'Aktualisiert',
    related: 'Passende nächste Schritte', legalDraft: 'Rechtliche Angaben werden vor Veröffentlichung ergänzt.',
  },
  en: {
    skip: 'Skip to content', menu: 'Menu', close: 'Close', nav: 'Main navigation',
    services: 'Services', apartment: 'Apartment', house: 'House', commercial: 'Commercial',
    costs: 'Costs', area: 'Service area', guides: 'Guides', about: 'About', contact: 'Contact',
    request: 'Discuss your project', home: 'Home', language: 'Deutsch', preview: 'Project preview',
    previewText: 'Enquiries will be enabled after technical and business approval.',
    faq: 'Frequently asked questions', formEyebrow: 'Project enquiry', formInactive: 'Form in preparation',
    formNote: 'Enquiries will be enabled once the Formspree endpoint has been supplied.',
    learnMore: 'Learn more', backGuides: 'All guides', published: 'Published', updated: 'Updated',
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
    ['/ratgeber/', 'Ratgeber'],
  ],
  en: [
    ['/en/split-air-conditioning-installation/', 'Services'],
    ['/en/air-conditioning-apartment/', 'Apartment'],
    ['/en/air-conditioning-house/', 'House'],
    ['/en/air-conditioning-office-commercial/', 'Commercial'],
    ['/en/air-conditioning-installation-costs/', 'Costs'],
    ['/en/guides/', 'Guides'],
  ],
} satisfies Record<Language, [string, string][]>;

export const footerNavigation = {
  de: [
    ['/klimaanlage-nachruesten/', 'Klimaanlage nachrüsten'],
    ['/einsatzgebiet/', 'Einsatzgebiet'],
    ['/ueber-uns/', 'Über uns'],
    ['/kontakt/', 'Kontakt'],
    ['/impressum/', 'Impressum'],
    ['/datenschutz/', 'Datenschutz'],
  ],
  en: [
    ['/en/retrofit-air-conditioning/', 'Retrofit air conditioning'],
    ['/en/service-area/', 'Service area'],
    ['/en/about/', 'About'],
    ['/en/contact/', 'Contact'],
    ['/en/imprint/', 'Imprint'],
    ['/en/privacy/', 'Privacy'],
  ],
} satisfies Record<Language, [string, string][]>;

export function localizedHome(lang: Language) {
  return lang === 'de' ? '/' : '/en/';
}
