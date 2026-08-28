import type { PageContent } from './types';

export const legalPages: PageContent[] = [
  {
    key: 'imprint', lang: 'de', path: '/impressum/', alternatePath: '/en/imprint/', navLabel: 'Impressum',
    title: 'Impressum | IsarKlima', description: 'Vorläufige Anbieterinformationen der IsarKlima-Projektvorschau.',
    eyebrow: 'Rechtliche Angaben · Entwurf', h1: 'Impressum',
    intro: 'Diese Seite ist als strukturelle Vorschau angelegt. Die gesetzlich erforderlichen Angaben werden erst nach Prüfung der verantwortlichen Rechtsperson und des tatsächlichen Geschäftsbetriebs veröffentlicht.',
    heroImage: 'technical-planning-workbench', heroImageAlt: 'Technische Unterlagen und Messwerkzeuge zur Projektplanung', heroNote: 'Noch nicht freigegeben', legal: true,
    sections: [
      { title: 'Angaben zum Diensteanbieter', intro: 'Name beziehungsweise Firma, Rechtsform, ladungsfähige Anschrift, vertretungsberechtigte Person und verlässliche Kontaktwege sind vor dem Marktstart einzutragen.', tone: 'paper' },
      { title: 'Register, Aufsicht und berufliche Angaben', intro: 'Register- und Umsatzsteuerangaben sowie erforderliche berufsrechtliche Informationen werden nur ergänzt, soweit sie auf die tatsächlich verantwortliche Einheit zutreffen und geprüft sind.', tone: 'ink' },
      { title: 'Verantwortung für Inhalte', intro: 'Eine inhaltlich verantwortliche Person und ein belastbarer Kontakt werden vor Aktivierung des Angebots benannt. Diese Projektvorschau nimmt noch keine Aufträge an.', tone: 'isar' },
    ],
  },
  {
    key: 'imprint', lang: 'en', path: '/en/imprint/', alternatePath: '/impressum/', navLabel: 'Imprint',
    title: 'Imprint | IsarKlima', description: 'Provisional provider information for the IsarKlima project preview.',
    eyebrow: 'Legal information · Draft', h1: 'Imprint',
    intro: 'This page is a structural preview. The legally required provider details will be published only after the responsible legal entity and actual business operation have been verified.',
    heroImage: 'technical-planning-workbench', heroImageAlt: 'Technical documents and measuring tools for project planning', heroNote: 'Not yet approved', legal: true,
    sections: [
      { title: 'Service provider details', intro: 'The legal name, form, service address, authorised representative and reliable contact channels must be entered before market launch.', tone: 'paper' },
      { title: 'Registers, supervision and professional information', intro: 'Register, VAT and professional details will be added only where they apply to the verified responsible entity.', tone: 'ink' },
      { title: 'Responsibility for content', intro: 'A responsible person and verified contact will be named before the service is activated. This project preview does not yet accept orders.', tone: 'isar' },
    ],
  },
  {
    key: 'privacy', lang: 'de', path: '/datenschutz/', alternatePath: '/en/privacy/', navLabel: 'Datenschutz',
    title: 'Datenschutz | IsarKlima', description: 'Datenschutzhinweise für die IsarKlima-Projektvorschau.',
    eyebrow: 'Datenschutz · Entwurf', h1: 'Datenschutzhinweise',
    intro: 'Die Vorschau setzt keine Analyse-, Karten-, Video- oder Marketingdienste ein. Das Anfrageformular bleibt deaktiviert, bis Verantwortlicher, Auftragsverarbeitung, Speicherdauer und Betroffenenrechte vollständig dokumentiert sind.',
    heroImage: 'split-unit-interior', heroImageAlt: 'Split-Klimaanlage in einem Innenraum', heroNote: 'Datensparsame Vorschau', legal: true,
    sections: [
      { title: 'Verantwortlicher und Kontakt', intro: 'Die Identität und Kontaktdaten des datenschutzrechtlich Verantwortlichen werden vor der öffentlichen Aktivierung verbindlich ergänzt.', tone: 'paper' },
      { title: 'Technische Bereitstellung dieser Website', intro: 'Beim Aufruf kann der Hosting-Anbieter technisch notwendige Verbindungsdaten verarbeiten. Die konkrete Hosting-Konfiguration, Rechtsgrundlage, Speicherdauer und Auftragsverarbeitung werden vor dem Marktstart dokumentiert.', tone: 'ink' },
      { title: 'Projektanfragen über Formspree', intro: 'Formspree ist noch nicht verbunden. Vor Aktivierung werden Zweck, Rechtsgrundlage, Empfänger, Übermittlungen, Löschfristen und eine passende Vereinbarung zur Auftragsverarbeitung geprüft und transparent beschrieben.', tone: 'paper' },
      { title: 'Cookies und externe Inhalte', intro: 'In der aktuellen Vorschau werden keine optionalen Cookies, Analyse-Skripte, eingebetteten Karten oder Videos geladen. Bei späteren Änderungen werden Hinweise und Einwilligungsmechanismen nur eingesetzt, wenn sie tatsächlich erforderlich sind.', tone: 'isar' },
      { title: 'Rechte betroffener Personen', intro: 'Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch und Beschwerdemöglichkeiten werden zusammen mit dem zuständigen Kontakt vor Aktivierung des Anfragekanals vollständig erläutert.', tone: 'paper' },
    ],
  },
  {
    key: 'privacy', lang: 'en', path: '/en/privacy/', alternatePath: '/datenschutz/', navLabel: 'Privacy',
    title: 'Privacy | IsarKlima', description: 'Privacy information for the IsarKlima project preview.',
    eyebrow: 'Privacy · Draft', h1: 'Privacy information',
    intro: 'This preview uses no analytics, maps, videos or marketing services. The enquiry form remains disabled until the controller, processing arrangements, retention and data-subject rights are fully documented.',
    heroImage: 'split-unit-interior', heroImageAlt: 'Split air conditioning unit in an interior', heroNote: 'Data-minimal preview', legal: true,
    sections: [
      { title: 'Controller and contact', intro: 'The identity and contact details of the data controller will be added and verified before public activation.', tone: 'paper' },
      { title: 'Technical delivery of this website', intro: 'The hosting provider may process connection data required to deliver the site. The hosting setup, legal basis, retention and processing agreement will be documented before market launch.', tone: 'ink' },
      { title: 'Project enquiries through Formspree', intro: 'Formspree is not connected. Before activation, the purpose, legal basis, recipients, transfers, deletion periods and appropriate processing terms will be assessed and described transparently.', tone: 'paper' },
      { title: 'Cookies and external content', intro: 'The current preview loads no optional cookies, analytics scripts, embedded maps or videos. Any later consent mechanism will reflect services that are actually in use.', tone: 'isar' },
      { title: 'Data-subject rights', intro: 'Access, correction, deletion, restriction, portability, objection and complaint options will be explained fully with the responsible contact before the enquiry channel is enabled.', tone: 'paper' },
    ],
  },
];
