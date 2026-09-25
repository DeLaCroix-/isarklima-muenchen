// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL ?? 'https://isarklima-deutschland.netlify.app';

export default defineConfig({
  site,
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
