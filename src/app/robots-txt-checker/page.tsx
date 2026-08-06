import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "robots.txt Checker — Catch Disallow:/ Before You Launch",
  description:
    "Free robots.txt checker for go-live: paste your URL, detect Disallow:/ and missing sitemap lines, get a CLEARED / HOLD / DENIED stamp with copy-paste fixes.",
  openGraph: {
    title: "robots.txt Checker",
    description:
      "Staging leftovers like Disallow:/ kill indexing. Scan before you promote.",
    type: "website",
  },
};

export default function RobotsTxtCheckerPage() {
  return (
    <ToolLanding
      eyebrow="Indexability · robots.txt"
      title="robots.txt Checker"
      lead={
        <>
          The #1 silent launch killer: a preview template that ships{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            Disallow: /
          </code>
          . Paste your production URL — we read{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            /robots.txt
          </code>{" "}
          and stamp CLEARED / HOLD / DENIED with a fix you can paste.
        </>
      }
      failuresHeading="Accidents we flag"
      failuresLead="These look harmless in staging and become permanent SEO debt after launch day."
      failures={[
        {
          title: "Disallow: / on production",
          detail:
            "Every crawler is told to stay out. Product Hunt and ads send traffic that never becomes indexed pages.",
        },
        {
          title: "Missing robots.txt (404)",
          detail:
            "Crawlers fall back to defaults. You cannot point to a sitemap or block private paths on purpose.",
        },
        {
          title: "No Sitemap: line",
          detail:
            "Search engines may find pages slowly. A one-line Sitemap: URL speeds discovery after launch.",
        },
        {
          title: "Allow rules that contradict Disallow",
          detail:
            "Conflicting patterns confuse crawlers and waste crawl budget on the wrong paths.",
        },
      ]}
      fixHeading="Copy-paste robots fixes"
      fixLead="Prefer app/robots.ts on Next.js App Router; plain robots.txt works everywhere."
      fixBlocks={[
        {
          title: "Next.js App Router — app/robots.ts",
          code: `import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}`,
        },
        {
          title: "Static public/robots.txt",
          code: `User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`,
        },
      ]}
      checklist={[
        "Confirm you are scanning the apex / www you will promote",
        "Open /robots.txt in an incognito window after deploy",
        "Submit sitemap in Search Console once the domain is live",
      ]}
      related={[
        {
          href: "/security-headers-checker",
          label: "Security headers checker",
        },
        {
          href: "/ssl-https-checker",
          label: "SSL / HTTPS checker",
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
