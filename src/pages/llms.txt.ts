import type { APIRoute } from 'astro';

export const GET: APIRoute = () => new Response(`# IsarKlima\n\n> Preview website for split air conditioning installation services in Munich and the Munich district.\n\n- German is canonical at the root.\n- English content is available under /en/.\n- Enquiries are not active in this preview.\n- No unverified qualifications, pricing, warranties or operating history are asserted.\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
