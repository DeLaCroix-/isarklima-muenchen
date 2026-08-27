export type Language = 'de' | 'en';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Subsection {
  title: string;
  text: string;
}

export type SectionLayout =
  | 'service-bento'
  | 'comparison'
  | 'media-split'
  | 'process-rail'
  | 'technical-list'
  | 'image-statement';

export interface PageSection {
  eyebrow?: string;
  title: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: Subsection[];
  image?: string;
  imageAlt?: string;
  imagePosition?: 'start' | 'end';
  layout?: SectionLayout;
  tone?: 'paper' | 'ink' | 'isar';
}

export interface PageContent {
  key: string;
  lang: Language;
  path: string;
  alternatePath: string;
  navLabel: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  heroImage: string;
  heroImageAlt: string;
  heroNote?: string;
  sections: PageSection[];
  faqTitle?: string;
  faq?: FaqItem[];
  formTitle?: string;
  formIntro?: string;
  legal?: boolean;
}
