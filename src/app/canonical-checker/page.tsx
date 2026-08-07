import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Canonical Tag Checker — Verify rel=canonical Before Google Indexes",
  description:
    "Free canonical tag checker: paste your URL, verify <link rel=canonical> exists and points to the right production URL. Get CLEARED / HOLD / DENIED with copy-paste fixes.",
  openGraph: {
    title: "Canonical Tag Checker",
    description:
      "Paste your URL. Catch missing or misconfigured canonical tags that split SEO value across URL variants.",
    type: "website",
  },
};

export default function CanonicalCheckerPage() {
  return (
    <ToolLanding
      eyebrow="On-page SEO · Canonical URL"
      title="Canonical Tag Checker"
      lead={
        <>
          Without a{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            &lt;link rel=&quot;canonical&quot;&gt;
          </code>{" "}
          tag, Google may index multiple URL variants of the same page —
          www vs non-www, with/without trailing slash, HTTP vs HTTPS — and
          split your ranking signals across them. Paste your URL and we
          verify canonical exists and points to the right place, then stamp
          CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="Canonical issues we catch"
      failuresLead="These silently dilute SEO value. You won't see an error — just slower ranking and fragmented authority."
      failures={[
        {
          title: "Missing canonical tag entirely",
          detail:
            "Search engines guess which URL variant to index. www and non-www versions both get indexed, splitting link equity and causing duplicate content issues.",
        },
        {
          title: "Canonical points to a preview/staging domain",
          detail:
            "rel=canonical still pointing at *.vercel.app or a staging URL. Google indexes the wrong domain and your production URL never accumulates authority.",
        },
        {
          title: "Canonical is a relative URL",
          detail:
            "Some platforms render relative canonical URLs (/page instead of https://...). Crawlers may resolve them incorrectly, especially across subdomains.",
        },
        {
          title: "Conflicting canonical and og:url",
          detail:
            "When rel=canonical and og:url point to different URLs, social platforms and search engines disagree on the canonical version."
        },
      ]}
      fixHeading="Copy-paste canonical fixes"
      fixLead="Always use absolute HTTPS production URLs in canonical tags."
      fixBlocks={[
        {
          title: "Next.js App Router — metadata API",
          code: `export const metadata = {
  alternates: {
    canonical: 'https://yourdomain.com/',
  },
}`,
        },
        {
          title: "Plain HTML",
          code: `<head>
  <link rel="canonical" href="https://yourdomain.com/" />
</head>
<!-- Must be absolute, HTTPS, production domain -->`,
        },
        {
          title: "Per-page canonical (Next.js)",
          code: `// app/blog/post-1/page.tsx
export const metadata = {
  alternates: {
    canonical: 'https://yourdomain.com/blog/post-1',
  },
}`,
        },
      ]}
      checklist={[
        "Canonical must be an absolute URL (https://yourdomain.com/...)",
        "Ensure it never points at preview or staging hosts",
        "Use one canonical per page — don't chain redirects through canonicals",
        "Verify with URL Inspection in Search Console after deploy",
      ]}
      related={[
        {
          href: "/title-tag-checker",
          label: "Title tag checker",
        },
        {
          href: "/open-graph-checker",
          label: "Open Graph checker",
          note: "og:url should match canonical",
        },
        {
          href: "/noindex-checker",
          label: "Noindex checker",
          note: "noindex overrides canonical",
        },
        {
          href: "/robots-txt-checker",
          label: "robots.txt checker",
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
