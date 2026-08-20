import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TopicHub } from "@/components/topic-hub";

export const metadata: Metadata = pageMetadata("/seo-checkers", {
  title: "Free Technical SEO Checkers for Launch Day",
  description: "Check title tags, meta descriptions, H1s, canonical URLs, noindex directives, robots.txt, and sitemaps before launch.",
});

export default function SeoCheckersPage() {
  return <TopicHub eyebrow="Topic hub · crawl and index" title="Technical SEO Checkers" lead="Run a focused check when one search signal looks wrong, or use the full clearance scan to inspect the complete launch path." links={[
    { href: "/title-tag-checker", title: "Title Tag Checker", description: "Inspect the rendered title and catch missing, duplicate, or unhelpfully long titles." },
    { href: "/meta-description-checker", title: "Meta Description Checker", description: "Verify that a useful page description is present in the public HTML." },
    { href: "/h1-tag-checker", title: "H1 Tag Checker", description: "Find missing or competing primary headings before a page is indexed." },
    { href: "/canonical-checker", title: "Canonical Tag Checker", description: "Catch preview-host, HTTP, or conflicting canonical signals." },
    { href: "/noindex-checker", title: "Noindex Checker", description: "Inspect meta robots and X-Robots-Tag headers for accidental noindex." },
    { href: "/robots-txt-checker", title: "robots.txt Checker", description: "Detect blanket crawler blocks and launch configuration mistakes." },
    { href: "/sitemap-checker", title: "Sitemap Checker", description: "Verify discovery, canonical hosts, and sitemap availability." },
    { href: "/favicon-checker", title: "Favicon Checker", description: "Confirm the small but visible browser and search-result brand asset." },
  ]} />;
}
