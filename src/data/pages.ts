import generatedPages from './pages.generated.json';
import { legalPages } from './legal';
import type { PageContent } from './types';

export const pages = [...generatedPages as PageContent[], ...legalPages];

export function getPage(path: string) {
  const page = pages.find((item) => item.path === path);
  if (!page) throw new Error(`Missing page data for ${path}`);
  return page;
}
