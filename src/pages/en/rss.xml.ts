import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { blogSlug, getPublishedPosts } from '../../lib/blog';

export const GET: APIRoute = async ({ site }) => rss({
  title: 'IsarKlima guides',
  description: 'Guidance on planning split air conditioning installations in Munich.',
  site: site!,
  items: (await getPublishedPosts('en-DE')).map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.publishDate, link: `/en/guides/${blogSlug(post)}/` })),
  customData: '<language>en-DE</language>',
});
