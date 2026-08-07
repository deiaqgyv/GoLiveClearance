import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "OG Image Not Showing — Debug Open Graph Image Issues",
  description:
    "OG image not showing on Twitter, Facebook, or LinkedIn? Paste your URL, find the cause (missing tags, wrong host, cache, size), and get copy-paste Next.js fixes.",
  openGraph: {
    title: "OG Image Not Showing?",
    description:
      "The complete troubleshooting guide for broken Open Graph images. Scan and fix now.",
    type: "website",
  },
};

export default function OgImageNotShowingPage() {
  return (
    <ToolLanding
      eyebrow="Social preview · OG image broken"
      title="OG Image Not Showing"
      lead={
        <>
          You designed the perfect{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            og.png
          </code>
          , shared the link, and got a blank card. The causes are always one
          of a few patterns: wrong host, missing tags, wrong size, or a stale
          social cache. Paste your URL — we check{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            og:image
          </code>
          ,{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            twitter:image
          </code>
          , accessibility, and dimensions, then stamp CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="Why OG images do not show"
      failuresLead="These are the causes we see most often — ranked by frequency."
      failures={[
        {
          title: "og:image URL is relative (not absolute)",
          detail:
            "/og.png without the full host. Social crawlers cannot resolve it. Next.js needs metadataBase to generate absolute URLs.",
        },
        {
          title: "og:image points at *.vercel.app or staging host",
          detail:
            "metadataBase is not set to the production domain. The image URL is technically valid but crawlers may not access it, and the card links to the wrong origin.",
        },
        {
          title: "og:image returns 404 or non-image content",
          detail:
            "The file was not deployed, or the path is wrong. Some platforms silently drop the card; others show a blank thumbnail.",
        },
        {
          title: "og:image is too small (< 200×200 px)",
          detail:
            "Facebook, Twitter, and LinkedIn have minimum dimensions. Under 200px they fall back to a text-only card.",
        },
        {
          title: "Social platform cache is stale",
          detail:
            "You fixed the OG image, but the platform cached the old version. Facebook caches for 30+ days; Twitter caches on first share.",
        },
        {
          title: "Missing twitter:card meta",
          detail:
            "Twitter/X requires twitter:card to render any card. Without it, the tweet shows a bare link — even if og:image is correct.",
        },
      ]}
      fixHeading="Next.js OG image fixes"
      fixLead="Fix the root cause — then clear the social caches."
      fixBlocks={[
        {
          title: "app/layout.tsx — metadataBase + OG image",
          code: `import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  openGraph: {
    title: 'Your Product Name',
    description: 'One-line value prop',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'Your Product Name — tagline',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Product Name',
    description: 'One-line value prop',
    images: ['/og.png'],
  },
}`,
        },
        {
          title: "After fixing: clear social caches",
          code: `# Facebook Sharing Debugger
# https://developers.facebook.com/tools/debug/

# Twitter Card Validator
# https://cards-dev.twitter.com/validator

# LinkedIn Post Inspector
# https://www.linkedin.com/post-inspector/

# Steps:
# 1. Paste your URL in each tool
# 2. Click "Scrape Again" / "Fetch new information"
# 3. Verify the preview card shows your image
# 4. Re-share the link — the old cache is now replaced`,
        },
      ]}
      checklist={[
        "Confirm og:image URL is absolute: https://yourdomain.com/og.png (not /og.png)",
        "Verify the image file actually exists and returns 200 (curl -I the URL)",
        "Use 1200×630 px (1.91:1 ratio) — works on all platforms",
        "Clear social caches AFTER deploying the fix, not before",
      ]}
      related={[
        {
          href: "/open-graph-checker",
          label: "Open Graph checker",
          note: "full OG + Twitter card scan",
        },
        {
          href: "/noindex-checker",
          label: "Noindex checker",
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
