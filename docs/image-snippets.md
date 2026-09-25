# Image descriptions and Google snippets

Every Astro build protects nonempty image alt text with a supported
`div`, `span` or `section` carrying `data-nosnippet`. Image-only containers
are reused; otherwise a span with `display:contents` wraps the image or
the complete picture element. Alt attributes remain available for
accessibility. Headings, body copy, metadata and structured data are unchanged.

The build checks every generated HTML file, including Markdown articles.
Hydrated components must include the exclusion in their source markup;
the build fails if it detects an unprotected image inside an Astro island.
Keep CSS independent of direct image parentage when adding new layouts.

Run `npm run test:snippets` and the normal production build before publishing.
Google must recrawl affected URLs before search results can change. This does
not force Google to use the meta description or change ranking/indexing rules.

Reference: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#data-nosnippet-attr
