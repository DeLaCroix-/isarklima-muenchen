import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { blogSlug, getPublishedPosts } from '../lib/blog';

export const GET: APIRoute = async ({ site }) => rss({
  title: 'IsarKlima Blog',
  description: 'Klimaanlagen-Blog zu Planung und Installation von Split-Systemen in Deutschland.',
  site: site!,
  items: (await getPublishedPosts('de-DE')).map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.publishDate, link: `/ratgeber/${blogSlug(post)}/` })),
  customData: '<language>de-DE</language>',
});
