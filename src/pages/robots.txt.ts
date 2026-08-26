import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const indexSite = import.meta.env.PUBLIC_INDEX_SITE === 'true';
  const body = indexSite
    ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', site).toString()}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

