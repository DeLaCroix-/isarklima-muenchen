# IsarKlima

Bilingual Astro website and editorial hub for a planned split air conditioning installation service across Germany. German is canonical at the root; English lives under `/en/`.

The repository is deliberately deployed as a non-indexable project preview. It does not claim unverified qualifications, years of experience, pricing, warranties, business address, local staffing or active availability. Enquiries stay disabled until the business, regulatory and privacy launch gates are complete.

## Local development

Requirements: Node.js 22.19 or newer and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Quality gate:

```bash
npm run check:all
```

That command runs Astro type/content checks, a production build and a rendered-output audit covering routes, exact H1/H2/H3 contracts, metadata, reciprocal hreflang, image dimensions and alt text, internal links, article publication dates and inactive forms.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | `https://isarklima-deutschland.netlify.app` | Absolute canonical and sitemap origin. |
| `PUBLIC_INDEX_SITE` | `false` | Global indexing switch. Keep `false` until the launch checklist is signed off. |
| `PUBLIC_FORMSPREE_ENDPOINT` | empty | Enables all project forms only when it matches `https://formspree.io/f/{id}`. |

No CRM, Supabase or GitHub App secret belongs in this site or in a public Netlify variable. The publishing CRM writes content to GitHub; Astro only reads committed Markdown.

## Information architecture

- 11 commercial/information pages in German and 11 matching English pages.
- Four draft legal/privacy pages.
- Six German guides and six English translations.
- Self-referencing canonicals, reciprocal `de-DE` / `en-DE` / `x-default` hreflang.
- RSS feeds at `/rss.xml` and `/en/rss.xml`.
- Sitemap, preview-aware `robots.txt`, `llms.txt`, JSON-LD and custom 404.

The exact SEO heading architecture is preserved in the source drafts and in the generated page data. See `docs/seo-heading-architecture.md` for the complete route, intent and heading contract.

## Content workflow

Commercial page source lives in `content-source/de-pages.md` and `content-source/en-pages.md`. Generate the typed page payload with:

```bash
node scripts/generate-page-data.mjs
```

The CRM-compatible editorial source lives in `content-source/blog-bilingual.md`. Split it into collection entries and generate article images with:

```bash
node scripts/split-blog-source.mjs
```

New CRM articles go directly into:

- German: `src/content/blog/{slug}.md`
- English: `src/content/blog/en/{slug}.md`
- Images: `public/images/blog/{filename}`

See [docs/crm-integration.md](docs/crm-integration.md) for the publishing contract.

## Launch controls

The preview banner, disabled forms, legal placeholders and global `noindex, nofollow` are intentional. Do not remove them simply because the build succeeds. The remaining evidence and operating decisions are tracked in [docs/launch-checklist.md](docs/launch-checklist.md).

## Image provenance

The site combines licensed illustrative stock with project-specific, face-free generated imagery. None is described as IsarKlima staff or completed work. Source records and exact generation prompts are in [docs/image-sources.md](docs/image-sources.md) and [docs/generated-image-prompts.md](docs/generated-image-prompts.md).
