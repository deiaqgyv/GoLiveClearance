import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Noindex Checker — Catch noindex Tags Before You Launch",
  description:
    "Free noindex checker: paste your URL, detect meta robots noindex and X-Robots-Tag headers. Get CLEARED / HOLD / DENIED with copy-paste Next.js fixes.",
  openGraph: {
    title: "Noindex Checker",
    description:
      "Staging noindex is the #1 silent launch killer. Scan your production URL and catch it before Google does.",
    type: "website",
  },
};

export default function NoindexCheckerPage() {
  return (
    <ToolLanding
      eyebrow="Indexability · noindex"
      title="Noindex Checker"
      lead={
        <>
          The single most common launch accident:{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            &lt;meta name=&quot;robots&quot; content=&quot;noindex&quot;&gt;
          </code>{" "}
          left over from staging. Your site is live, but Google never indexes
          it. Paste the production URL — we detect meta noindex and{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            X-Robots-Tag
          </code>{" "}
          headers, then stamp CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="Noindex accidents we catch"
      failuresLead="These hide your site from search engines — and the damage accumulates silently until someone checks."
      failures={[
        {
          title: "meta robots noindex on homepage",
          detail:
            "Staging templates often inject noindex. It gets committed, deployed, and your production homepage is invisible to Google.",
        },
        {
          title: "X-Robots-Tag: noindex in response headers",
          detail:
            "Server middleware or CDN rules add noindex at the edge. It is invisible in HTML but equally effective at blocking indexing.",
        },
        {
          title: "noindex on subpages only",
          detail:
            "Landing pages or blog posts built from a staging template may carry noindex while the homepage is clean.",
        },
        {
          title: "Conditional noindex (env-based) leaking to production",
          detail:
            "A NODE_ENV check that flips noindex sometimes fails when the build and runtime environments differ.",
        },
      ]}
      fixHeading="Remove noindex — Next.js fixes"
      fixLead="The most common Next.js pattern that leaks noindex to production."
      fixBlocks={[
        {
          title: "app/layout.tsx — remove staging noindex",
          code: `// ❌ Common staging pattern that ships to production
export const metadata = {
  robots: { index: false, follow: false },
}

// ✅ Remove the property entirely (default is indexable)
export const metadata = {
  // robots is omitted — Next.js defaults to index, follow
}`,
        },
        {
          title: "Conditional noindex via environment (safer)",
          code: `// app/layout.tsx
export const metadata: Metadata = {
  ...(process.env.NODE_ENV === 'production'
    ? {} // no robots directive = indexable
    : { robots: { index: false, follow: true } }),
}`,
        },
        {
          title: "Remove X-Robots-Tag from middleware",
          code: `// middleware.ts
// ❌ Don't do this
export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  res.headers.set('X-Robots-Tag', 'noindex')
  return res
}

// ✅ Remove the header entirely for production`,
        },
      ]}
      checklist={[
        "Search site:yourdomain.com in Google after launch to confirm indexing",
        "Check Search Console Coverage report for 'Indexed, though blocked by robots.txt'",
        "Re-scan after removing noindex — it can take days for Google to re-crawl",
      ]}
      related={[
        {
          href: "/robots-txt-checker",
          label: "robots.txt checker",
          note: "Disallow:/ is the other index killer",
        },
        {
          href: "/forgot-noindex-production",
          label: "Forgot noindex in production",
          note: "full troubleshooting guide",
        },
        {
          href: "/sitemap-checker",
          label: "Sitemap checker",
        },
        {
          href: "/website-launch-checklist",
          label: "Website launch checklist",
        },
        { href: "/methodology", label: "Methodology" },
        { href: "/", label: "Go-Live Clearance home" },
      ]}
    />
  );
}
