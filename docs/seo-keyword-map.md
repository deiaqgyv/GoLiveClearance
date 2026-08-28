# SEO Keyword Map

Last updated: 2026-08-28

This file is the source of truth for the site's target queries. Keep one primary intent per page. Evaluate changes with Google Search Console impressions, average position, and clicks after 14–28 days; a phrase listed here is a target, not a traffic guarantee.

| Page | Primary long-tail keyword | Search intent |
| --- | --- | --- |
| `/robots-txt-checker` | check if robots.txt blocks Google | Diagnose production crawling before launch |
| `/security-headers-checker` | Next.js security headers checker HSTS CSP XFO | Find missing production response headers |
| `/open-graph-checker` | check OG image and social preview before launch | Debug social sharing metadata |
| `/canonical-checker` | canonical tag checker for missing or wrong canonical URLs | Diagnose declared canonical problems |
| `/noindex-checker` | meta noindex and X-Robots-Tag checker | Find accidental indexing blocks |
| `/sitemap-checker` | check if sitemap.xml is live before website launch | Verify sitemap availability |
| `/title-tag-checker` | meta title length checker | Validate title length and presence |
| `/meta-description-checker` | meta description length checker for Google snippets | Validate description length and presence |
| `/h1-tag-checker` | H1 tag checker for missing, empty, or multiple H1s | Diagnose heading problems |

## Search Console evidence — 2026-08-28

- `/canonical-checker`: 271 impressions; observed queries include `track canonical tags`, `seo canonical check`, `canonical missing`, and `canonical issues`.
- `/h1-tag-checker`: 149 impressions; observed queries include `h1 check`, `h1 checker`, `check h1 h2 tags`, and `h1 tag checker`.
- `/noindex-checker`: 57 impressions; observed queries include `meta noindex checker`, `check for noindex`, and `noindex check`.
- `/title-tag-checker`: 16 impressions and the site's first recorded click.

## Guardrails

- Do not retarget the scenario pages at these same primary queries.
- Keep the current URLs; update title, description, H1, and copy together when search intent changes.
- Expand pages only from queries that earn impressions, not from assumed keyword volume.
