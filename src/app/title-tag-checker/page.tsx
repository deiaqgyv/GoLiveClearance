import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Title Tag Checker — Check Length & SERP Truncation Before Launch",
  description:
    "Free title tag checker: paste your URL, verify <title> length, detect missing or truncated titles. Get CLEARED / HOLD / DENIED with copy-paste Next.js and HTML fixes.",
  openGraph: {
    title: "Title Tag Checker",
    description:
      "Paste your URL. Catch missing, too short, or truncated title tags before you promote.",
    type: "website",
  },
};

export default function TitleTagCheckerPage() {
  return (
    <ToolLanding
      eyebrow="On-page SEO · Title tag"
      title="Title Tag Checker"
      lead={
        <>
          The <code className="bg-[var(--secondary)] px-1 font-mono text-xs">&lt;title&gt;</code> tag is
          the single most important on-page SEO element — it&apos;s what
          appears in browser tabs, search results, and social shares. Paste
          your URL and we check length, truncation risk, and whether it
          exists at all, then stamp CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="Title tag problems we catch"
      failuresLead="These look fine in development but hurt click-through rates the moment you launch."
      failures={[
        {
          title: "Missing <title> tag entirely",
          detail:
            "Browser tab shows 'Untitled'. Google displays a raw URL in search results instead of a clickable headline. Users skip it.",
        },
        {
          title: "Title too long (over 70 chars)",
          detail:
            "Google truncates at ~600px (~60-70 Latin characters). The tail becomes an ellipsis (…) and your brand name or key phrase may vanish from SERPs.",
        },
        {
          title: "Title too short (under 10 chars)",
          detail:
            "Wastes prime SERP real estate. A single word like 'Home' tells neither users nor crawlers what the page is about.",
        },
        {
          title: "Placeholder title still in production",
          detail:
            "Staging titles like 'Next.js App' or 'Vite + React' ship to production surprisingly often. Looks unfinished and tanks CTR.",
        },
      ]}
      fixHeading="Copy-paste title fixes"
      fixLead="Use the Next.js metadata API for App Router, or a plain <title> tag in any HTML page."
      fixBlocks={[
        {
          title: "Next.js App Router — metadata API",
          code: `export const metadata = {
  title: 'Go-Live Clearance — Pre-Launch Website Scanner',
}`,
        },
        {
          title: "Plain HTML",
          code: `<head>
  <title>Your Page Title — Brand Name</title>
</head>`,
        },
        {
          title: "Per-page title (Next.js)",
          code: `// app/about/page.tsx
export const metadata = {
  title: 'About Us — Go-Live Clearance',
}`,
        },
      ]}
      checklist={[
        "Keep titles between 30-60 characters for best SERP visibility",
        "Include your primary keyword near the beginning",
        "End with your brand name (— Brand) for recognition",
        "Check how it looks in Google's SERP preview tool",
      ]}
      related={[
        {
          href: "/meta-description-checker",
          label: "Meta description checker",
          note: "companion to title tag",
        },
        {
          href: "/h1-tag-checker",
          label: "H1 tag checker",
        },
        {
          href: "/open-graph-checker",
          label: "Open Graph checker",
          note: "social share preview",
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
