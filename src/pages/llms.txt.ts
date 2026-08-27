import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const indexSite = import.meta.env.PUBLIC_INDEX_SITE === 'true';
  const publicationState = indexSite
    ? '- This deployment is intended to be indexable.'
    : '- This deployment is a project preview and is not intended for indexing.';

  return new Response(`# IsarKlima\n\n> Bilingual information about planning and installing split air conditioning systems for homes and commercial properties in Munich.\n\n- German is canonical at the root.\n- English content is available under /en/.\n${publicationState}\n- Enquiries remain inactive until the contact endpoint is approved.\n- No unverified qualifications, pricing, warranties or operating history are asserted.\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
