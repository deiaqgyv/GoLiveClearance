import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Meta Description Checker — Verify Length & SERP Visibility",
  description:
    "Free meta description checker: paste your URL, verify description length (50-160 chars), detect missing or truncated descriptions. Get CLEARED / HOLD / DENIED with copy-paste fixes.",
  openGraph: {
    title: "Meta Description Checker",
    description:
      "Paste your URL. Catch missing, too short, or truncated meta descriptions that hurt SERP click-through.",
    type: "website",
  },
};

export default function MetaDescriptionCheckerPage() {
  return (
    <ToolLanding
      eyebrow="On-page SEO · Meta description"
      title="Meta Description Checker"
      lead={
        <>
          The meta description is the two-line snippet under your title in
          Google search results. It doesn&apos;t directly affect rankings,
          but it massively affects click-through rate. Paste your URL and we
          check length, presence, and quality, then stamp CLEARED / HOLD /
          DENIED.
        </>
      }
      failuresHeading="Meta description problems we catch"
      failuresLead="Google auto-generates a snippet when your description is missing or bad — and it's usually worse than what you'd write."
      failures={[
        {
          title: "Missing meta description entirely",
          detail:
            "Google scrapes page text for a snippet. You lose control of what users see in search results. Often a generic 'Skip to content' or nav text appears instead.",
        },
        {
          title: "Description too short (under 50 chars)",
          detail:
            "Wastes SERP real estate. A 20-character description leaves most of the snippet blank or makes Google fill it with page text you didn't choose.",
        },
        {
          title: "Description too long (over 160 chars)",
          detail:
            "Google truncates at ~160 characters on desktop (~120 on mobile). Your call-to-action or key benefit gets cut off with an ellipsis.",
        },
        {
          title: "Duplicate description across pages",
          detail:
            "When every page has the same description, Google may ignore them all and auto-generate. Each page deserves a unique, relevant description.",
        },
      ]}
      fixHeading="Copy-paste description fixes"
      fixLead="Target 50-160 characters. Write it as a compelling ad, not a summary."
      fixBlocks={[
        {
          title: "Next.js App Router — metadata API",
          code: `export const metadata = {
  description: 'Scan your site before launch. Get a Go/No-Go ' +
    'clearance report in 30 seconds — HTTPS, headers, ' +
    'robots.txt, OG tags, and more.',
}`,
        },
        {
          title: "Plain HTML",
          code: `<head>
  <meta name="description" content="A clear 50-160 character summary of this page that compels users to click." />
</head>`,
        },
        {
          title: "Per-page description (Next.js)",
          code: `// app/blog/post-1/page.tsx
export const metadata = {
  description: 'Learn how to fix missing security headers in ' +
    'Next.js before your production launch.',
}`,
        },
      ]}
      checklist={[
        "Target 120-160 characters (mobile truncates earlier than desktop)",
        "Write it as an ad — include a value prop and implicit CTA",
        "Each page needs a unique description — never copy-paste",
        "Don't just repeat the title — add context and a reason to click",
      ]}
      related={[
        {
          href: "/title-tag-checker",
          label: "Title tag checker",
          note: "title and description work together in SERPs",
        },
        {
          href: "/h1-tag-checker",
          label: "H1 tag checker",
        },
        {
          href: "/open-graph-checker",
          label: "Open Graph checker",
          note: "og:description for social shares",
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
