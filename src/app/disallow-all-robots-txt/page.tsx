import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Disallow: / in robots.txt — The Silent Index Killer",
  description:
    "Disallow: / in robots.txt blocks all search engines. Detect it on your production site, get copy-paste fixes for Next.js robots.ts and static robots.txt.",
  openGraph: {
    title: "Disallow: / in robots.txt?",
    description:
      "Your site is live but Google cannot crawl it. Scan now and fix the most common launch accident.",
    type: "website",
  },
};

export default function DisallowAllRobotsTxtPage() {
  return (
    <ToolLanding
      eyebrow="Launch accident · robots.txt"
      title="Disallow: / in robots.txt"
      lead={
        <>
          The second most common launch accident after noindex:{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            Disallow: /
          </code>{" "}
          in robots.txt tells every crawler to stay away from your entire site.
          It looks harmless in staging and becomes{" "}
          <strong className="font-semibold text-[var(--pass-ink)]">
            permanent SEO invisibility
          </strong>{" "}
          after launch. Paste your URL — we read robots.txt and stamp CLEARED /
          HOLD / DENIED.
        </>
      }
      failuresHeading="How Disallow: / happens"
      failuresLead="These are the real patterns — not hypotheticals."
      failures={[
        {
          title: "Starter template shipped with Disallow: /",
          detail:
            "Many Next.js starters and CMS templates include Disallow: / for development. It gets committed and deployed to production unchanged.",
        },
        {
          title: "app/robots.ts copied from a preview project",
          detail:
            "The App Router robots.ts was written for a staging site. rules: { userAgent: '*', disallow: '/' } ships to production.",
        },
        {
          title: "CMS or plugin override",
          detail:
            "WordPress, Shopify, or a SEO plugin set 'Discourage search engines' during setup. The checkbox is easy to miss in production settings.",
        },
        {
          title: "Manual edit to block AI crawlers gone wrong",
          detail:
            "Adding a Disallow rule for GPTBot or CCbot but accidentally applying it to User-agent: * instead of a specific bot.",
        },
        {
          title: "Conflicting Allow + Disallow rules",
          detail:
            "Allow: / and Disallow: / for the same user-agent. Crawlers interpret conflicts differently — some block, some allow. Unpredictable.",
        },
      ]}
      fixHeading="Fix Disallow: / — two approaches"
      fixLead="Use the Next.js App Router API when possible; static file as fallback."
      fixBlocks={[
        {
          title: "app/robots.ts — App Router (recommended)",
          code: `import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}`,
        },
        {
          title: "public/robots.txt — static file",
          code: `User-agent: *
Allow: /

# Block AI crawlers (optional, specific user-agents only)
User-agent: GPTBot
Disallow: /

Sitemap: https://yourdomain.com/sitemap.xml`,
        },
        {
          title: "Block specific bots without blocking all crawlers",
          code: `// app/robots.ts — multiple rules
export default function robots(): MetadataRoute.Robots {
  return [
    { userAgent: '*', allow: '/' },
    { userAgent: 'GPTBot', disallow: '/' },
    { userAgent: 'CCBot', disallow: '/' },
    {
      userAgent: '*',
      disallow: ['/api/', '/admin/'],
    },
  ]
}`,
        },
      ]}
      checklist={[
        "Open yourdomain.com/robots.txt in an incognito window after deploy",
        "Search site:yourdomain.com in Google a few days after fixing — confirm pages appear",
        "Submit sitemap in Search Console to accelerate re-crawling",
        "If you block AI crawlers, verify that Googlebot is NOT affected",
      ]}
      related={[
        {
          href: "/robots-txt-checker",
          label: "robots.txt checker",
          note: "full robots.txt scan",
        },
        {
          href: "/noindex-checker",
          label: "Noindex checker",
          note: "the other index killer",
        },
        {
          href: "/sitemap-checker",
          label: "Sitemap checker",
        },
        {
          href: "/forgot-noindex-production",
          label: "Forgot noindex in production",
        },
        { href: "/methodology", label: "Methodology" },
        { href: "/", label: "Go-Live Clearance home" },
      ]}
    />
  );
}
