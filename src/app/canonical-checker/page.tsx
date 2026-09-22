import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = pageMetadata("/canonical-checker", {
  title: "SEO Canonical Check",
  description:
    "SEO canonical check for missing canonical tags, preview-host canonicals, and conflicting og:url. Paste a URL and get a CLEARED / HOLD / DENIED result.",
  openGraph: {
    title: "SEO Canonical Check",
    description:
      "Paste your URL. Catch missing canonical tags and canonical issues before Google splits your ranking signals.",
    type: "website",
  },
});

export default function CanonicalCheckerPage() {
  return (
    <ToolLanding
      focus="canonical"
      eyebrow="On-page SEO · Canonical URL"
      title="Check Canonical Tags"
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
      failuresHeading="How to check canonical tags and common canonical issues"
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
        {
          title: "Canonical points through a redirect",
          detail:
            "A declared canonical should resolve directly to the preferred 200 URL. Redirecting canonicals add ambiguity and make audits harder to interpret.",
        },
        {
          title: "Alternative page with a proper canonical tag",
          detail:
            "Search Console may exclude a duplicate URL when it correctly points to another canonical page. Confirm the selected destination is the preferred 200 URL before treating the exclusion as an error.",
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
        "Compare the declared canonical with Google's selected canonical in Search Console",
        "Treat 'alternative page with proper canonical tag' as expected when the destination is intentional",
      ]}
      decision={{
        heading: "When a canonical check is the right first scan",
        lead: "Use this page when ranking signals look split across URL variants. Use a heading or Next.js launch checklist when the problem is markup or production config instead.",
        items: [
          {
            title: "Use this checker",
            detail:
              "www vs non-www, trailing slash, HTTP vs HTTPS, or a preview host still appears in Search Console as a competing page. You need to know whether rel=canonical exists, is absolute, and resolves to the production 200 URL.",
          },
          {
            title: "Problem → aftermath → next step",
            detail:
              "Problem: Google may index more than one URL for the same document. Aftermath: links and impressions split, so neither URL ranks well. Next step: set one absolute HTTPS canonical, then confirm Google's selected canonical matches it.",
          },
          {
            title: "Pick the adjacent tool, not another copy of this page",
            detail:
              "If the page is noindexed, canonical will not recover it — open the noindex checker. If the heading is missing from HTML, open the H1 checker. If robots.ts, metadataBase, or Vercel preview hosts are the launch risk, open the Next.js production checklist.",
          },
        ],
      }}
      related={[
        {
          href: "/h1-tag-checker",
          label: "H1 tag checker",
          note: "heading issues are a different failure than duplicate URLs",
        },
        {
          href: "/nextjs-production-checklist",
          label: "Next.js production checklist",
          note: "metadataBase and preview-host canonicals on App Router",
        },
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
