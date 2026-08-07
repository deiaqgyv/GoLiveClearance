import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Open Graph Checker — OG Tags & Social Preview Before Ship",
  description:
    "Free Open Graph checker: paste your URL, verify og:title, og:image, og:description and Twitter cards. Get CLEARED / HOLD / DENIED with Next.js metadata fixes.",
  openGraph: {
    title: "Open Graph Checker",
    description:
      "Paste your URL. Catch missing or broken OG tags so your share card renders — not a blank square.",
    type: "website",
  },
};

export default function OpenGraphCheckerPage() {
  return (
    <ToolLanding
      eyebrow="Social preview · Open Graph"
      title="Open Graph Checker"
      lead={
        <>
          A broken share card is the fastest way to look unfinished on launch
          day. Paste the URL you will share — we check{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            og:title
          </code>
          ,{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            og:image
          </code>
          ,{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            og:description
          </code>{" "}
          and Twitter cards, then stamp CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="OG failures we catch"
      failuresLead="These make your Product Hunt, Twitter, or LinkedIn post look broken — even when the page itself works fine."
      failures={[
        {
          title: "Missing og:title or og:image",
          detail:
            "Social platforms fall back to a plain link or blank card. Your carefully written headline and hero image never appear.",
        },
        {
          title: "og:image returns 404 or wrong host",
          detail:
            "The path points to a staging bucket or *.vercel.app. You see it in your browser, but social crawlers get nothing.",
        },
        {
          title: "og:image too small or wrong aspect ratio",
          detail:
            "Under 200×200 px some platforms drop the card entirely. 1.91:1 (1200×630) is the safe default.",
        },
        {
          title: "No Twitter card meta (twitter:card / twitter:image)",
          detail:
            "Twitter/X falls back to a summary-without-image card. Your launch tweet looks like a bare link.",
        },
        {
          title: "og:url or canonical points at preview domain",
          detail:
            "Shares attach to *.vercel.app instead of your real domain. Future shares and search signals fragment.",
        },
      ]}
      fixHeading="Next.js metadata fixes"
      fixLead="Prefer the App Router metadata API over hand-written <meta> tags."
      fixBlocks={[
        {
          title: "app/layout.tsx — OG + Twitter card",
          code: `import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  openGraph: {
    title: 'Your Product Name',
    description: 'One-line value prop for social cards',
    url: 'https://yourdomain.com',
    siteName: 'Your Product Name',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Product Name',
    description: 'One-line value prop for social cards',
    images: ['/og.png'],
  },
}`,
        },
        {
          title: "Per-page OG override — app/about/page.tsx",
          code: `import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — Your Product',
  openGraph: {
    title: 'About Us — Your Product',
    description: 'What we build and why.',
    images: [{ url: '/og-about.png' }],
  },
}`,
        },
      ]}
      checklist={[
        "Use Twitter Card Validator and Facebook Sharing Debugger after deploy",
        "Make sure og:image is an absolute URL (not /og.png without the host)",
        "Clear social caches if you update OG tags after the first share",
      ]}
      related={[
        {
          href: "/robots-txt-checker",
          label: "robots.txt checker",
        },
        {
          href: "/security-headers-checker",
          label: "Security headers checker",
        },
        {
          href: "/ssl-https-checker",
          label: "SSL / HTTPS checker",
        },
        {
          href: "/og-image-not-showing",
          label: "OG image not showing",
          note: "deep-dive troubleshooting",
        },
        { href: "/methodology", label: "Methodology" },
        { href: "/", label: "Go-Live Clearance home" },
      ]}
    />
  );
}
