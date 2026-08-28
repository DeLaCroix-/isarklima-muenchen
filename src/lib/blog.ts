import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

export function blogSlug(entry: BlogEntry) {
  return entry.id.replace(/\.(md|mdx)$/i, '').split('/').at(-1) ?? entry.id;
}

export async function getPublishedPosts(language: 'de-DE' | 'en-DE') {
  const localToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const entries = await getCollection('blog', ({ data }) => !data.draft && data.language === language && data.publishDate.toISOString().slice(0, 10) <= localToday);
  return entries.sort((a, b) => {
    const byDate = b.data.publishDate.valueOf() - a.data.publishDate.valueOf();
    if (byDate !== 0) return byDate;
    return (a.data.sourceUrl ?? a.id).localeCompare(b.data.sourceUrl ?? b.id, 'de');
  });
}
