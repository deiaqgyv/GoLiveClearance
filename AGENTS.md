# Go-Live Site Clearance — Project Context

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS 4
- **Fonts**: Inter (UI) + JetBrains Mono (technical/monospace)

## Directory Structure

```
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── api/scan/route.ts   # POST /api/scan — main scan endpoint
│   │   ├── report/[id]/page.tsx # Shareable report page (noindex)
│   │   ├── methodology/page.tsx # Methodology explanation
│   │   ├── about/page.tsx       # About page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage (scan UI)
│   │   └── globals.css          # Design tokens + animations
│   ├── components/
│   │   ├── scan-client.tsx      # Homepage client component (URL input + results)
│   │   ├── clearance-badge.tsx  # Clearance stamp (CLEARED/DENIED)
│   │   ├── finding-list.tsx     # Finding cards with CopyFixButton
│   │   ├── header.tsx           # Site header with nav
│   │   └── ui/                  # shadcn/ui components
│   └── lib/
│       ├── types.ts             # Re-exports scan types
│       ├── report-store.ts      # In-memory report store (r_ prefix IDs, 7-day TTL)
│       ├── rate-limit.ts        # Layered limiter (concurrency + burst + unique-host; 3m cache; dev bypass)
│       └── scan/
│           ├── types.ts         # Core types (Severity, CheckId, Finding, ScanResult)
│           ├── ssrf.ts          # SSRF protection with DNS resolution
│           ├── fetch-target.ts  # Target fetch with limits (512KB HTML, 256KB small files)
│           ├── parse-html.ts    # HTML meta tag parser
│           ├── fixes.ts         # Copy fix library with Next.js code examples
│           ├── score.ts         # Scoring logic (security headers merge cap)
│           ├── run-scan.ts      # Main scan orchestrator
│           └── index.ts         # Barrel export
├── DESIGN.md                    # Design system documentation
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Key Features

### Scan API (`POST /api/scan`)
- **URL normalization**: Auto-adds `https://`, strips fragments, rejects credentials
- **SSRF Protection**: DNS resolution check, blocks localhost/private IPs/metadata endpoints
- **Timeout**: 8s overall, 5s per-request
- **Redirect Limit**: Max 5 redirects, SSRF check on each hop
- **Rate Limiting**: Dev bypass; prod = 2 concurrent + 10 uncached/min + 20 unique hosts/hour; 3m URL+IP cache (hits free)
- **Body Limits**: 512KB for HTML, 256KB for robots/sitemap
- **Platform Detection**: Vercel, Cloudflare, Netlify fingerprinting

### Checks (TECH_SPEC §9.2)
- `https_redirect` — HTTPS enforcement (blocker if HTTP)
- `tls_cert` — Certificate expiry (info/warning)
- `security_headers.*` — HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (sub-findings)
- `robots_txt` — Blanket Disallow:/ = blocker
- `noindex` — Blocker if present
- `title_description.*` — Title + description length checks
- `canonical` — Missing canonical link
- `open_graph` — Missing OG tags
- `favicon` — Missing favicon
- `sitemap` — Missing sitemap.xml

### Scoring (TECH_SPEC §9.3)
- Any blocker → `clearance: "no_go"` (DENIED)
- Zero blockers → `clearance: "go"` (CLEARED)
- Score: `100 - (blockers × 25) - (warnings × 5)`, min 0
- Security headers merge cap: max -20 total
- Findings sorted: blocker → warning → info
- `priorityFixIds`: top 3 non-pass findings

### Fix Library (TECH_SPEC §9.5)
- Each finding includes `fix: { label, language, code }`
- Next.js-specific code examples (next.config.js headers(), app/robots.ts, metadata)
- Copy-to-clipboard button on code blocks

### Report Storage
- In-memory Map with `r_` prefix IDs (8 chars, no ambiguous chars)
- 7-day TTL with periodic cleanup
- Reports accessible via `/report/[id]` (noindex, nofollow)
- Response includes `reportUrl` and `expiresAt`

## API Contract

### Success Response
```json
{
  "id": "r_ABCD1234",
  "urlInput": "example.com",
  "urlFinal": "https://example.com/",
  "clearance": "go",
  "score": 85,
  "findings": [...],
  "priorityFixIds": ["security_headers.hsts"],
  "platform": "vercel",
  "meta": { "durationMs": 1234, "checksRun": 12 },
  "summary": { "blockers": 0, "warnings": 3 },
  "reportUrl": "https://domain/report/r_ABCD1234",
  "expiresAt": "2024-01-14T00:00:00.000Z"
}
```

### Error Response
```json
{ "error": { "code": "ssrf_blocked", "message": "..." } }
```
Codes: `invalid_url`, `ssrf_blocked`, `rate_limited`, `fetch_failed`, `scan_timeout`

## Development Commands
- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm start` — Start production server
- `pnpm lint` — ESLint check
- `pnpm ts-check` — TypeScript type check
