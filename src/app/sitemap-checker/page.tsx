import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Sitemap Checker — Verify XML Sitemap Before Launch",
  description:
    "Free sitemap checker: paste your URL, verify sitemap.xml exists, is reachable, and lists valid URLs. Get CLEARED / HOLD / DENIED with Next.js sitemap fixes.",
  openGraph: {
    title: "Sitemap Checker",
    description:
      "Missing or broken sitemap slows indexing on launch day. Scan your URL and catch it early.",
    type: "website",
  },
};

export default function SitemapCheckerPage() {
  return (
    <ToolLanding
      eyebrow="Discovery · sitemap.xml"
      title="Sitemap Checker"
      lead={
        <>
          No sitemap means Google finds your pages by crawling links — slowly.
          A broken sitemap means Google ignores it entirely. Paste your URL —
          we check{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            /sitemap.xml
          </code>{" "}
          and the{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            Sitemap:
          </code>{" "}
          line in robots.txt, then stamp CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="Sitemap problems we catch"
      failuresLead="These look fine until you wonder why Google still has not indexed your pages weeks after launch."
      failures={[
        {
          title: "No sitemap found (404 on common paths)",
          detail:
            "/sitemap.xml, /sitemap_index.xml, and robots.txt Sitemap: line all return nothing. Discovery is crawl-dependent only.",
        },
        {
          title: "Sitemap returns soft 404 or empty XML",
          detail:
            "The URL exists but serves an HTML error page or an empty <urlset>. Google drops it silently.",
        },
        {
          title: "Sitemap URLs point at preview / wrong domain",
          detail:
            "Every <loc> contains *.vercel.app or a staging host. Google indexes the wrong origin.",
        },
        {
          title: "Sitemap has noindex pages",
          detail:
            "URLs in the sitemap are blocked by noindex meta or X-Robots-Tag. Contradictory signals waste crawl budget.",
        },
        {
          title: "Sitemap not declared in robots.txt",
          detail:
            "Crawlers can find it by convention (/sitemap.xml), but the official Sitemap: line in robots.txt is missing.",
        },
      ]}
      fixHeading="Next.js sitemap fixes"
      fixLead="Use App Router sitemap generation — never hand-write XML."
      fixBlocks={[
        {
          title: "app/sitemap.ts — auto-generated sitemap",
          code: `import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://yourdomain.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}`,
        },
        {
          title: "app/robots.ts — declare sitemap location",
          code: `import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}`,
        },
      ]}
      checklist={[
        "Submit sitemap URL in Google Search Console after domain verification",
        "Confirm <loc> URLs use the production domain, not preview hosts",
        "Re-submit sitemap whenever you add significant new pages",
      ]}
      related={[
        {
          href: "/robots-txt-checker",
          label: "robots.txt checker",
          note: "Sitemap: line lives in robots.txt",
        },
        {
          href: "/noindex-checker",
          label: "Noindex checker",
          note: "noindex pages in sitemap contradict discovery",
        },
        {
          href: "/security-headers-checker",
          label: "Security headers checker",
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
