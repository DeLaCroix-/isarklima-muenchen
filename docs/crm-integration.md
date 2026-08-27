# CRM publishing contract

## Architecture

The Astro site does not call the CRM or Supabase at runtime. The existing publishing CRM uses its Supabase Edge Function and GitHub App installation to create Markdown and image files, commit them to `main`, and let Netlify rebuild from Git.

This separation keeps service-role and GitHub App credentials out of the public repository and the browser bundle.

## GitHub target

Configure an `astro_github` target with these values after the GitHub repository and App installation access are confirmed:

| CRM field | Value |
| --- | --- |
| `provider` | `astro_github` |
| `github_owner` | `DeLaCroix-` |
| `github_repo` | `isarklima-muenchen` |
| `branch` | `main` |
| `content_directory` | `src/content/blog` |
| `asset_directory` | `public/images/blog` |
| `public_url_pattern` | `/ratgeber/{slug}/` |
| `translation_url_pattern` | `/{lang}/guides/{slug}/` |
| `preset` | `astro_standard_v1` |

The target also needs the verified CRM profile ID, GitHub installation ID, repository ID, author and default category. Those values must come from the existing CRM/GitHub App configuration; they must not be guessed or placed in this repository.

## File and frontmatter contract

German source entries use `src/content/blog/{slug}.md`. English translations use `src/content/blog/en/{translated-slug}.md`.

The IsarKlima CRM profile uses the full IETF locales `de-DE` and `en-DE`. The publisher keeps those full values in frontmatter and in the `translations` keys, while normalizing only route and directory placeholders to their base language. Consequently, `en-DE` still publishes below `src/content/blog/en/` and `/{lang}/guides/` still resolves to `/en/guides/`.

```yaml
---
title: "Article title"
seoTitle: "Optional concise document title | IsarKlima"
description: "Search description"
publishDate: 2026-08-27
updatedDate: 2026-08-27
author: "IsarKlima Redaktion"
category: "Planning"
image: "/images/blog/example.webp"
imageAlt: "Contextual alternative text"
sourceUrl: "/ratgeber/source-slug/"
language: "de-DE"
sourceLanguage: "de-DE"
translationGroup: "stable-group-id"
translations:
  de-DE: "/ratgeber/source-slug/"
  en-DE: "/en/guides/translated-slug/"
draft: false
natSeoArticleId: "optional-crm-id"
---
```

The collection excludes `draft: true` and publication dates later than the current calendar date in Germany from pages, listings and RSS. Slugs are derived from the Markdown filename, including translated filenames.

`seoTitle` is optional, but when supplied it is the complete browser/search title and must contain 30–65 characters. Use it when the editorial H1 would become too long after adding the brand; the visible article title remains unchanged.

## Acceptance checks

After connecting the target, publish a harmless draft through the CRM and verify all of the following before enabling production articles:

1. The GitHub App can access only the intended repository and writes to `main`.
2. Markdown lands in the correct German or English directory.
3. Images land in `public/images/blog` and use a path matching frontmatter.
4. Netlify receives the commit and completes a Git-triggered build.
5. Draft and future-dated content stays absent from listing, RSS, sitemap and public route.
6. A current non-draft test renders at the URL pattern configured in the CRM.
7. `translations` produces reciprocal hreflang and the language switch points to the translated slug.
