import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Methodology',
  description: 'How Go-Live Clearance evaluates your site. The inspection criteria and severity definitions.',
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
      <h1 className="mb-3 text-3xl font-extrabold tracking-tight">
        Methodology
      </h1>
      <p className="mb-10 text-lg text-[var(--muted-foreground)]">
        How we decide CLEARED, HOLD, or DENIED.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold">Inspection Criteria</h2>
        <p className="mb-6 text-sm leading-relaxed text-[var(--foreground)]/80">
          Every scan runs the following checks against your URL. Each finding is classified
          as a <strong>Blocker</strong>, <strong>Warning</strong>, or <strong>Pass</strong> based on its impact
          on your site going live.
        </p>

        <div className="space-y-6">
          <CheckItem
            title="HTTPS Encryption"
            id="https"
            severity="blocker"
            description="Your site must serve over HTTPS. Plain HTTP exposes all visitor data to interception."
          />
          <CheckItem
            title="Strict-Transport-Security (HSTS)"
            id="hsts"
            severity="warning"
            description="HSTS tells browsers to always use HTTPS, preventing first-visit downgrade attacks."
          />
          <CheckItem
            title="X-Content-Type-Options"
            id="x-content-type-options"
            severity="warning"
            description="Prevents MIME-type sniffing that can lead to XSS via drive-by downloads."
          />
          <CheckItem
            title="Clickjacking Protection"
            id="clickjacking"
            severity="warning"
            description="X-Frame-Options or CSP frame-ancestors prevents your site from being embedded in malicious iframes."
          />
          <CheckItem
            title="Referrer-Policy"
            id="referrer-policy"
            severity="warning"
            description="Controls how much URL information leaks to third-party sites via the Referer header."
          />
          <CheckItem
            title="robots.txt — Full Block"
            id="robots-txt"
            severity="blocker"
            description="A blanket Disallow: / in robots.txt makes your entire site invisible to search engines."
          />
          <CheckItem
            title="XML Sitemap"
            id="sitemap"
            severity="warning"
            description="A sitemap helps search engines discover all your pages. Missing sitemaps may cause incomplete indexing."
          />
          <CheckItem
            title="Noindex Meta Tag"
            id="noindex"
            severity="blocker"
            description="A noindex tag explicitly tells search engines to remove your page from results. The silent killer of launched sites."
          />
          <CheckItem
            title="Page Title"
            id="title"
            severity="warning"
            description="Every page needs a descriptive title. Latin titles ideally 10–70 chars; short CJK brand names (e.g. 淘宝) are accepted."
          />
          <CheckItem
            title="H1 Heading"
            id="h1"
            severity="warning"
            description="A visible H1 anchors the page topic for users and crawlers. Missing H1 is common on JS shells that forget semantic headings."
          />
          <CheckItem
            title="Meta Description"
            id="description"
            severity="warning"
            description="A meta description (50-160 chars) controls your search result snippet. Without it, engines auto-generate often irrelevant text."
          />
          <CheckItem
            title="Canonical URL"
            id="canonical"
            severity="warning"
            description="A canonical tag prevents duplicate content issues from URL variants (www/non-www, trailing slashes)."
          />
          <CheckItem
            title="Open Graph Tags"
            id="og-tags"
            severity="warning"
            description="og:title, og:description, and og:image control how your site appears when shared on social media."
          />
          <CheckItem
            title="Favicon"
            id="favicon"
            severity="warning"
            description="Recognizes rel=icon, apple-touch-icon(-precomposed), and a valid /favicon.ico (including CDN redirects)."
          />
          <CheckItem
            title="Security Headers (merged)"
            id="security-headers"
            severity="warning"
            description="HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy are reported as one finding and ranked below launch accidents."
          />
          <CheckItem
            title="Preview / Staging Domain Leak"
            id="preview-leak"
            severity="blocker"
            description="Canonical, Open Graph, or sitemap pointing at *.vercel.app / *.netlify.app (or clearing a preview host as if it were production) sends crawlers and share cards to the wrong deploy."
          />
          <CheckItem
            title="Trust Pages"
            id="trust-pages"
            severity="warning"
            description="Privacy, Terms, and Contact links should exist on the homepage and resolve (not 404). Broken legal links kill trust on launch day."
          />
          <CheckItem
            title="Analytics"
            id="analytics"
            severity="warning"
            description="Detects GA4, Plausible, Vercel Analytics, Alibaba mmstat, Baidu Tongji, and other common snippets."
          />
          <CheckItem
            title="Placeholder Copy"
            id="placeholder-copy"
            severity="warning"
            description="Leftover lorem ipsum, TODO, yourdomain.com, or coming soon copy that makes the site look like a staging build."
          />
          <CheckItem
            title="Sitemap Quality"
            id="sitemap-dirty"
            severity="warning"
            description="Detects missing sitemaps, soft-404 HTML error pages that return 200, empty &lt;loc&gt; lists, preview hosts inside sitemaps, and missing robots Sitemap: directives."
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold">Severity Definitions</h2>
        <div className="space-y-4">
          <div className="rounded-r-lg border-l-4 border-l-[var(--denied-red)] bg-[var(--card)] p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-[var(--denied-red)] px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
                BLOCKER
              </span>
            </div>
            <p className="text-sm text-[var(--foreground)]/80">
              Will cause immediate, visible damage if you ship. Your site won&apos;t be found,
              won&apos;t be secure, or won&apos;t work as intended. <strong>Must fix before launch.</strong>
            </p>
          </div>
          <div className="rounded-r-lg border-l-4 border-l-[var(--warning-amber)] bg-[var(--card)] p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-[var(--warning-amber)] px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
                WARNING
              </span>
            </div>
            <p className="text-sm text-[var(--foreground)]/80">
              Won&apos;t break your launch, but will hurt SEO, security posture, or user experience.
              <strong> Should fix soon after launch.</strong>
            </p>
          </div>
          <div className="rounded-r-lg border-l-4 border-l-[var(--clearance-green)] bg-[var(--card)] p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-[var(--clearance-green)] px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
                PASS
              </span>
            </div>
            <p className="text-sm text-[var(--foreground)]/80">
              Check passed. No action needed.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Clearance Decision</h2>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="mb-3 text-sm leading-relaxed text-[var(--foreground)]/80">
            The clearance verdict has three stamps:
          </p>
          <ul className="ml-4 space-y-2 text-sm text-[var(--foreground)]/80">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-[var(--clearance-green)]">&#10003;</span>
              <span><strong>CLEARED (Ship It)</strong> — Zero blockers and zero warnings. Safe to launch.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-[var(--warning-amber)]">!</span>
              <span><strong>HOLD (Fix Then Ship)</strong> — No blockers, but warnings remain. Fix the top priorities before you promote the launch.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-[var(--denied-red)]">&#10007;</span>
              <span><strong>DENIED (Don&apos;t Ship)</strong> — One or more blockers found. Do not go live until they are cleared.</span>
            </li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]/80">
            The score (0-100) is calculated as: <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-xs">100 - (blockers &times; 25) - (warnings &times; 5)</code>
          </p>
        </div>
      </section>
    </div>
  );
}

function CheckItem({
  title,
  id,
  severity,
  description,
}: {
  title: string;
  id: string;
  severity: 'blocker' | 'warning' | 'pass';
  description: string;
}) {
  const borderColor =
    severity === 'blocker'
      ? 'border-l-[var(--denied-red)]'
      : severity === 'warning'
        ? 'border-l-[var(--warning-amber)]'
        : 'border-l-[var(--clearance-green)]';

  const badgeColor =
    severity === 'blocker'
      ? 'bg-[var(--denied-red)] text-white'
      : severity === 'warning'
        ? 'bg-[var(--warning-amber)] text-white'
        : 'bg-[var(--clearance-green)] text-white';

  return (
    <div className={`rounded-r-lg border-l-4 ${borderColor} bg-[var(--card)] p-4`}>
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${badgeColor}`}>
          {severity.toUpperCase()}
        </span>
        <span className="font-mono text-xs text-[var(--muted-foreground)]">{id}</span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-[var(--foreground)]/70">{description}</p>
    </div>
  );
}
