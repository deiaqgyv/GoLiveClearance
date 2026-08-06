// TECH_SPEC §9.5: Four-channel fixes — HTML · Next.js · Server · AI
import type { FindingFix, FixStack, Platform } from "./types";

type FixBundle = Partial<Record<FixStack, FindingFix>> & {
  /** Always provide at least html or server + ai */
  ai: FindingFix;
};

function ai(issue: string, steps: string): FindingFix {
  return {
    label: "AI prompt",
    language: "txt",
    stack: "ai",
    code: `Fix this go-live clearance failure in my production codebase.

Issue: ${issue}

Required work:
${steps}

Constraints:
- Smallest change that fixes production
- Do not refactor unrelated code
- Match my existing stack (detect from the repo; do not assume Next.js)
- List every file you change
- I will re-scan the public URL after you finish`,
  };
}

const bundles: Record<string, FixBundle> = {
  "robots_txt.blocked": {
    html: {
      label: "robots.txt",
      language: "txt",
      stack: "html",
      code: `# /robots.txt — allow crawlers on production
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml

# Remove any "Disallow: /" under User-agent: * before launch.`,
    },
    nextjs: {
      label: "Next.js app/robots.ts",
      language: "ts",
      stack: "nextjs",
      code: `// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}`,
    },
    server: {
      label: "Server static file",
      language: "txt",
      stack: "server",
      code: `# Serve /robots.txt as a static file from your web root
# (nginx root, Spring static/, Tomcat webapp, S3+CDN, …)

User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml

# nginx example: ensure try_files /robots.txt does not rewrite to SPA index.html`,
    },
    ai: ai(
      "robots.txt blocks all crawlers (Disallow: /)",
      `1. Find where robots.txt is generated or served
2. Remove blanket Disallow: / for production
3. Allow / and declare Sitemap: https://yourdomain.com/sitemap.xml
4. Confirm https://yourdomain.com/robots.txt no longer blocks *`
    ),
  },

  "robots_txt.missing": {
    html: {
      label: "robots.txt",
      language: "txt",
      stack: "html",
      code: `# Create https://yourdomain.com/robots.txt
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`,
    },
    nextjs: {
      label: "Next.js app/robots.ts",
      language: "ts",
      stack: "nextjs",
      code: `// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}`,
    },
    server: {
      label: "Server static file",
      language: "txt",
      stack: "server",
      code: `# Add a real file at the site root: /robots.txt
# Java/Spring: src/main/resources/static/robots.txt
# Or map a controller GET /robots.txt → text/plain

User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`,
    },
    ai: ai(
      "Missing robots.txt",
      `1. Add a production /robots.txt that Allows / and points to sitemap.xml
2. Ensure SPA fallbacks do not swallow /robots.txt into HTML
3. Verify Content-Type is text/plain`
    ),
  },

  noindex: {
    html: {
      label: "HTML / headers",
      language: "html",
      stack: "html",
      code: `<!-- Remove production noindex -->
<!-- Delete: -->
<meta name="robots" content="noindex, nofollow" />

<!-- Prefer indexable: -->
<meta name="robots" content="index, follow" />
<!-- or omit robots meta entirely -->

# Also remove response header if present:
# X-Robots-Tag: noindex`,
    },
    nextjs: {
      label: "Next.js metadata",
      language: "ts",
      stack: "nextjs",
      code: `// app/layout.tsx or app/page.tsx
export const metadata = {
  robots: { index: true, follow: true }, // or omit robots entirely
}

// Search repo for: robots: { index: false }`,
    },
    server: {
      label: "Java / server headers",
      language: "java",
      stack: "server",
      code: `// Remove noindex from templates (Thymeleaf/JSP/FreeMarker)
// AND clear X-Robots-Tag on production responses.

// Spring example — do NOT send noindex in prod:
// response.setHeader("X-Robots-Tag", "noindex");  ← delete this

// Or force indexable:
response.setHeader("X-Robots-Tag", "index, follow");`,
    },
    ai: ai(
      "Production page sends noindex",
      `1. Find meta robots noindex and X-Robots-Tag: noindex
2. Remove them on the production build/profile
3. Keep noindex only for staging if needed via env flags
4. Verify the live homepage HTML + headers no longer contain noindex`
    ),
  },

  https_redirect: {
    html: {
      label: "Host HTTPS",
      language: "txt",
      stack: "html",
      code: `Use your host's HTTPS:
- Attach custom domain
- Enable "Always HTTPS" / redirect HTTP→HTTPS
- Wait until the certificate is Valid

Do not promote http:// URLs.`,
    },
    nextjs: {
      label: "Vercel / Netlify",
      language: "txt",
      stack: "nextjs",
      code: `Vercel/Netlify issue certificates automatically.
Project → Domains → add yourdomain.com → wait for Valid SSL.
HTTP redirects to HTTPS by default.`,
    },
    server: {
      label: "nginx / Java reverse proxy",
      language: "nginx",
      stack: "server",
      code: `# nginx
server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$host$request_uri;
}

# TLS (Certbot)
# sudo certbot --nginx -d yourdomain.com

# If TLS terminates at a Java app server / gateway,
# configure the SSL connector or put nginx/Caddy in front.`,
    },
    ai: ai(
      "Site is not served over HTTPS",
      `1. Enable TLS for the production domain
2. Redirect all HTTP traffic to HTTPS
3. Confirm the final URL after redirects is https://`
    ),
  },

  security_headers: {
    html: {
      label: "CDN / host headers",
      language: "txt",
      stack: "html",
      code: `Add the missing headers from Evidence via your CDN/host UI
(Cloudflare Transform Rules, Netlify headers, AWS CloudFront, …):

Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
# CSP: add carefully (report-only first if unsure)`,
    },
    nextjs: {
      label: "Next.js next.config",
      language: "js",
      stack: "nextjs",
      code: `// next.config.js
module.exports = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }]
  },
}`,
    },
    server: {
      label: "nginx / Java Filter",
      language: "java",
      stack: "server",
      code: `# nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# Java / Spring Filter (sketch)
// @Component
public class SecurityHeadersFilter implements Filter {
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
      throws IOException, ServletException {
    HttpServletResponse r = (HttpServletResponse) res;
    r.setHeader("X-Content-Type-Options", "nosniff");
    r.setHeader("X-Frame-Options", "DENY");
    r.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    r.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    r.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    chain.doFilter(req, res);
  }
}`,
    },
    ai: ai(
      "Missing basic security headers",
      `1. Read which headers are missing from the clearance Evidence
2. Add them at the edge (CDN) or origin (nginx / app Filter)
3. Avoid breaking the app with an overly strict CSP on the first pass
4. Re-scan to confirm headers appear on the homepage response`
    ),
  },

  sitemap: {
    html: {
      label: "sitemap.xml",
      language: "html",
      stack: "html",
      code: `<!-- Real XML at /sitemap.xml (not an HTML error page) -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>

# robots.txt:
# Sitemap: https://yourdomain.com/sitemap.xml`,
    },
    nextjs: {
      label: "Next.js app/sitemap.ts",
      language: "ts",
      stack: "nextjs",
      code: `// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: 'https://yourdomain.com',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  }]
}`,
    },
    server: {
      label: "Server / Java static",
      language: "txt",
      stack: "server",
      code: `# Place sitemap.xml in the web root or generate it in CI.
# Spring: src/main/resources/static/sitemap.xml
# Or expose GET /sitemap.xml that returns application/xml

# Do not rewrite /sitemap.xml to your SPA index.html
# Add: Sitemap: https://yourdomain.com/sitemap.xml in robots.txt`,
    },
    ai: ai(
      "No usable sitemap.xml",
      `1. Publish a real XML sitemap at /sitemap.xml with production <loc> URLs
2. Stop soft-404 HTML error pages from answering that path
3. Reference it from robots.txt via Sitemap:`
    ),
  },

  "sitemap.dirty": {
    html: {
      label: "Clean sitemap.xml",
      language: "txt",
      stack: "html",
      code: `Edit sitemap.xml so every <loc> is:
- production domain only (not preview/staging hosts)
- indexable (no noindex pages)

Re-submit in Google Search Console after deploy.`,
    },
    nextjs: {
      label: "Next.js sitemap.ts",
      language: "ts",
      stack: "nextjs",
      code: `const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'

export default function sitemap() {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  ]
}`,
    },
    server: {
      label: "Fix generator / static file",
      language: "txt",
      stack: "server",
      code: `Update the job/controller that builds sitemap.xml.
Filter out preview hosts and noindex URLs before writing <loc> entries.`,
    },
    ai: ai(
      "Sitemap lists bad URLs (preview hosts or noindex pages)",
      `1. Open Evidence and remove those locs from the sitemap generator
2. Only emit production absolute URLs
3. Redeploy and re-scan`
    ),
  },

  "title_description.title": {
    html: {
      label: "HTML <title>",
      language: "html",
      stack: "html",
      code: `<head>
  <title>Your Page Title — Brand Name</title>
</head>`,
    },
    nextjs: {
      label: "Next.js metadata",
      language: "ts",
      stack: "nextjs",
      code: `export const metadata = {
  title: 'Your Page Title — Brand Name',
}`,
    },
    server: {
      label: "Template (Java/SSR)",
      language: "html",
      stack: "server",
      code: `<!-- Thymeleaf -->
<title th:text="\${pageTitle}">Your Page Title — Brand Name</title>

<!-- JSP -->
<title><%= pageTitle %></title>

Set pageTitle in the controller for the homepage.`,
    },
    ai: ai(
      "Missing or weak <title>",
      `1. Set a clear homepage <title> in the layout/template
2. Avoid empty/placeholder titles in production
3. Keep it descriptive for search snippets`
    ),
  },

  "title_description.description": {
    html: {
      label: "HTML meta description",
      language: "html",
      stack: "html",
      code: `<head>
  <meta name="description" content="A clear 50–160 character summary of this page." />
</head>`,
    },
    nextjs: {
      label: "Next.js metadata",
      language: "ts",
      stack: "nextjs",
      code: `export const metadata = {
  description: 'A clear 50–160 character summary of this page.',
}`,
    },
    server: {
      label: "Template (Java/SSR)",
      language: "html",
      stack: "server",
      code: `<meta name="description" th:content="\${metaDescription}" content="A clear 50–160 character summary of this page." />

Pass metaDescription from the controller.`,
    },
    ai: ai(
      "Missing or weak meta description",
      `1. Add a unique meta description on the homepage template
2. Target roughly 50–160 characters
3. Avoid duplicating the raw title alone`
    ),
  },

  canonical: {
    html: {
      label: "HTML canonical",
      language: "html",
      stack: "html",
      code: `<head>
  <link rel="canonical" href="https://yourdomain.com/" />
</head>
<!-- Absolute production URL required -->`,
    },
    nextjs: {
      label: "Next.js metadata",
      language: "ts",
      stack: "nextjs",
      code: `export const metadata = {
  alternates: { canonical: 'https://yourdomain.com/' },
}`,
    },
    server: {
      label: "Template (Java/SSR)",
      language: "html",
      stack: "server",
      code: `<link rel="canonical" th:href="\${canonicalUrl}" href="https://yourdomain.com/" />

Build canonicalUrl as an absolute https://yourdomain.com/... string in the controller.`,
    },
    ai: ai(
      "Missing canonical URL",
      `1. Add <link rel="canonical"> with the absolute production URL
2. Ensure it never points at preview/staging hosts`
    ),
  },

  open_graph: {
    html: {
      label: "HTML Open Graph",
      language: "html",
      stack: "html",
      code: `<head>
  <meta property="og:title" content="Your Page Title" />
  <meta property="og:description" content="A compelling description for social shares." />
  <meta property="og:image" content="https://yourdomain.com/og-image.png" />
  <meta property="og:type" content="website" />
</head>`,
    },
    nextjs: {
      label: "Next.js openGraph",
      language: "ts",
      stack: "nextjs",
      code: `export const metadata = {
  openGraph: {
    title: 'Your Page Title',
    description: 'A compelling description for social shares.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
}`,
    },
    server: {
      label: "Template (Java/SSR)",
      language: "html",
      stack: "server",
      code: `<meta property="og:title" th:content="\${ogTitle}" />
<meta property="og:description" th:content="\${ogDescription}" />
<meta property="og:image" th:content="\${ogImage}" />
<meta property="og:type" content="website" />

ogImage must be an absolute HTTPS URL (~1200×630).`,
    },
    ai: ai(
      "Missing Open Graph tags",
      `1. Add og:title, og:description, og:image on the homepage
2. Use absolute HTTPS URLs for og:image
3. Verify with a social debugger after deploy`
    ),
  },

  favicon: {
    html: {
      label: "HTML / static files",
      language: "html",
      stack: "html",
      code: `<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

# Ensure /favicon.ico returns an image, not HTML.`,
    },
    nextjs: {
      label: "Next.js app/icon",
      language: "txt",
      stack: "nextjs",
      code: `Place in app/:
- app/favicon.ico
- app/icon.png
- app/apple-icon.png

Next.js wires <link> tags automatically.`,
    },
    server: {
      label: "Static web root",
      language: "txt",
      stack: "server",
      code: `# Put favicon.ico in the static web root
# Spring: src/main/resources/static/favicon.ico
# Also add <link rel="icon" href="/favicon.ico"> in the layout
# Make sure the security config permits GET /favicon.ico anonymously`,
    },
    ai: ai(
      "No favicon detected",
      `1. Add /favicon.ico or a proper rel=icon link
2. Ensure the URL returns an image (follow redirects if needed)
3. Optionally add apple-touch-icon`
    ),
  },

  tls_cert: {
    html: {
      label: "Host certificate",
      language: "txt",
      stack: "html",
      code: `Check your DNS host / CDN SSL status.
Managed platforms auto-renew — look for Valid/Active on the custom domain.`,
    },
    server: {
      label: "Certbot / JVM keystore",
      language: "bash",
      stack: "server",
      code: `sudo certbot renew
# Then reload nginx/caddy
# Or renew the certificate in your Java keystore / load balancer`,
    },
    ai: ai(
      "TLS certificate problem",
      `1. Inspect certificate expiry and chain for the production domain
2. Renew or replace the cert
3. Confirm browsers show a valid padlock`
    ),
  },

  preview_leak: {
    html: {
      label: "Production URLs only",
      language: "txt",
      stack: "html",
      code: `1. Set canonical + og:url + og:image to https://yourdomain.com/...
2. Attach the custom domain
3. Share that domain — not *.vercel.app / preview hosts
4. Rebuild sitemap with production hosts only`,
    },
    nextjs: {
      label: "Next.js metadataBase",
      language: "ts",
      stack: "nextjs",
      code: `const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'

export const metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: { url: siteUrl, images: [{ url: '/og-image.png' }] },
}`,
    },
    server: {
      label: "Config / templates",
      language: "txt",
      stack: "server",
      code: `# application-prod.yml / env:
# app.public-base-url: https://yourdomain.com

# Build every absolute URL (canonical, OG, emails) from that base.
# Never bake preview hostnames into production templates.`,
    },
    ai: ai(
      "Preview/staging host leaked into production signals",
      `1. Find canonical/OG/links pointing at preview hosts
2. Point them at the production domain via config/env
3. Stop promoting preview URLs for launch`
    ),
  },

  "trust_pages.missing": {
    html: {
      label: "Footer links",
      language: "html",
      stack: "html",
      code: `<footer>
  <a href="/privacy">Privacy Policy</a>
  <a href="/terms">Terms of Service</a>
  <a href="/contact">Contact</a>
</footer>

Create real pages at those paths (not 404).`,
    },
    nextjs: {
      label: "Next.js routes",
      language: "txt",
      stack: "nextjs",
      code: `Add:
- app/privacy/page.tsx
- app/terms/page.tsx
- app/contact/page.tsx

Link them from the footer.`,
    },
    server: {
      label: "Spring / MVC routes",
      language: "java",
      stack: "server",
      code: `@Controller
public class LegalController {
  @GetMapping("/privacy")
  public String privacy() { return "privacy"; }

  @GetMapping("/terms")
  public String terms() { return "terms"; }

  @GetMapping("/contact")
  public String contact() { return "contact"; }
}

// Add footer links in the layout template.`,
    },
    ai: ai(
      "Missing Privacy / Terms / Contact links",
      `1. Add real pages for privacy, terms, and contact
2. Link them from the homepage footer
3. Confirm they return 200`
    ),
  },

  "trust_pages.broken": {
    html: {
      label: "Fix the URL",
      language: "txt",
      stack: "html",
      code: `1. Open the href from Evidence
2. Fix the page or update the footer link
3. Redeploy and re-scan`,
    },
    server: {
      label: "Fix route / security",
      language: "txt",
      stack: "server",
      code: `Check:
- Controller mapping exists
- Spring Security permits anonymous GET
- No incorrect context-path / trailing-slash mismatch`,
    },
    ai: ai(
      "Trust page link returns an error",
      `1. Reproduce the URL from Evidence
2. Fix routing or authorization so it returns 200 with real content
3. Keep the footer href in sync`
    ),
  },

  analytics: {
    html: {
      label: "HTML snippet",
      language: "html",
      stack: "html",
      code: `<!-- GA4 example — or Plausible / Umami / Cloudflare Web Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>`,
    },
    nextjs: {
      label: "Next.js / Vercel Analytics",
      language: "ts",
      stack: "nextjs",
      code: `import { Analytics } from '@vercel/analytics/react'
// Render <Analytics /> in app/layout.tsx

// Or GA4 via next/script with strategy="afterInteractive"`,
    },
    server: {
      label: "Layout template",
      language: "html",
      stack: "server",
      code: `<!-- Add your analytics snippet once in the global layout
     (Thymeleaf layout.html / JSP header include) for production only. -->
<th:block th:if="\${@environment.acceptsProfiles('prod')}">
  <!-- paste vendor snippet -->
</th:block>`,
    },
    ai: ai(
      "No analytics snippet detected",
      `1. Add a production analytics snippet to the global layout
2. Gate it so staging can stay clean if desired
3. Confirm the homepage HTML includes the vendor script`
    ),
  },

  placeholder_copy: {
    html: {
      label: "Replace copy",
      language: "txt",
      stack: "html",
      code: `Search for phrases in Evidence (lorem ipsum, TODO, yourdomain.com, coming soon).
Replace in hero, title/description, OG alt, and footer.`,
    },
    nextjs: {
      label: "Search the app/ tree",
      language: "txt",
      stack: "nextjs",
      code: `rg -n "lorem ipsum|TODO|yourdomain|coming soon" app/ components/
Replace hits with real product copy before launch.`,
    },
    server: {
      label: "Templates / i18n bundles",
      language: "txt",
      stack: "server",
      code: `Search templates and messages*.properties / i18n JSON for placeholder strings.
Replace production locale files; keep lorem only in test fixtures.`,
    },
    ai: ai(
      "Homepage still contains placeholder copy",
      `1. Search the repo for the matched placeholder phrases
2. Replace with real marketing copy
3. Ensure production builds do not include fixture/demo text`
    ),
  },

  h1: {
    html: {
      label: "HTML H1",
      language: "html",
      stack: "html",
      code: `<main>
  <h1>Your product does X for Y</h1>
</main>`,
    },
    nextjs: {
      label: "Next.js page",
      language: "ts",
      stack: "nextjs",
      code: `export default function Page() {
  return (
    <main>
      <h1>Your product does X for Y</h1>
    </main>
  )
}`,
    },
    server: {
      label: "Template (Java/SSR)",
      language: "html",
      stack: "server",
      code: `<main>
  <h1 th:text="\${heroHeadline}">Your product does X for Y</h1>
</main>

Provide heroHeadline from the homepage controller.`,
    },
    ai: ai(
      "No <h1> on the homepage",
      `1. Add one clear H1 in the homepage template
2. Do not rely on a logo image alone for the main heading
3. Keep a single primary H1 per page`
    ),
  },
};

const CHANNEL_ORDER: FixStack[] = ["html", "nextjs", "server", "ai"];

function orderForPlatform(platform?: Platform): FixStack[] {
  if (platform === "vercel") {
    return ["nextjs", "html", "server", "ai"];
  }
  if (platform === "netlify") {
    return ["nextjs", "html", "server", "ai"];
  }
  if (platform === "cloudflare") {
    return ["html", "server", "nextjs", "ai"];
  }
  return ["html", "nextjs", "server", "ai"];
}

export function getFixes(
  findingId: string,
  platform?: Platform
): FindingFix[] {
  const key = bundles[findingId]
    ? findingId
    : findingId.startsWith("security_headers")
      ? "security_headers"
      : findingId;

  const bundle = bundles[key];
  if (!bundle) return [];

  const order = orderForPlatform(platform);
  const list: FindingFix[] = [];
  for (const stack of order) {
    const fix = bundle[stack];
    if (fix) list.push(fix);
  }
  // Ensure AI is always last if somehow missing from order
  for (const stack of CHANNEL_ORDER) {
    const fix = bundle[stack];
    if (fix && !list.some((f) => f.stack === stack)) list.push(fix);
  }
  return list;
}

export function getFix(
  findingId: string,
  platform?: Platform
): FindingFix | undefined {
  return getFixes(findingId, platform)[0];
}

export function attachFixes(
  findingId: string,
  platform?: Platform
): { fix?: FindingFix; fixes: FindingFix[] } {
  const fixes = getFixes(findingId, platform);
  return { fix: fixes[0], fixes };
}

export const FIX_STACK_LABEL: Record<FixStack, string> = {
  html: "HTML",
  nextjs: "Next.js",
  server: "Server",
  ai: "AI prompt",
};
