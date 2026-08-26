import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { blogSlug, getPublishedPosts } from '../lib/blog';

export const GET: APIRoute = async ({ site }) => rss({
  title: 'IsarKlima Ratgeber',
  description: 'Ratgeber zur Planung neuer Split-Klimaanlagen in München.',
  site: site!,
  items: (await getPublishedPosts('de-DE')).map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.publishDate, link: `/ratgeber/${blogSlug(post)}/` })),
  customData: '<language>de-DE</language>',
});

