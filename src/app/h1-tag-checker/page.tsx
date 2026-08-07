import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "H1 Tag Checker — Verify Heading Structure Before Launch",
  description:
    "Free H1 tag checker: paste your URL, detect missing or multiple <h1> tags, verify semantic heading structure. Get CLEARED / HOLD / DENIED with copy-paste fixes.",
  openGraph: {
    title: "H1 Tag Checker",
    description:
      "Paste your URL. Catch missing or broken H1 tags that confuse search engines and hurt accessibility.",
    type: "website",
  },
};

export default function H1TagCheckerPage() {
  return (
    <ToolLanding
      eyebrow="On-page SEO · Heading structure"
      title="H1 Tag Checker"
      lead={
        <>
          The <code className="bg-[var(--secondary)] px-1 font-mono text-xs">&lt;h1&gt;</code> tag
          tells search engines and screen readers: this is the primary
          topic of this page. Missing or muddled H1s cost you rankings and
          accessibility score. Paste your URL and we check for missing,
          empty, or problematic H1 tags, then stamp CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="H1 issues we catch"
      failuresLead="These are common on JS-heavy SPA shells, template-based sites, and pages where the logo image replaced the heading."
      failures={[
        {
          title: "No <h1> found on the page",
          detail:
            "Without a clear H1, crawlers and users lack a primary topic anchor. Common on React/Vue shells that render headings client-side, or templates that use a logo image instead of text.",
        },
        {
          title: "Empty <h1></h1> tags",
          detail:
            "The tag exists but has no text content — often a hydration bug or a template variable that resolves to an empty string. Same SEO impact as missing entirely.",
        },
        {
          title: "H1 rendered as an image",
          detail:
            "Some templates use <h1><img src='logo.png'></h1>. Search engines can't read the image text. Use a text H1 and visually style it instead.",
        },
        {
          title: "Client-side rendered H1 not in initial HTML",
          detail:
            "If the H1 only appears after JavaScript hydration, crawlers that don't execute JS see an empty page. SSR or SSG solves this.",
        },
      ]}
      fixHeading="Copy-paste H1 fixes"
      fixLead="One clear, descriptive H1 per page — rendered in the initial HTML, not injected by JS."
      fixBlocks={[
        {
          title: "Next.js page component",
          code: `export default function Page() {
  return (
    <main>
      <h1>Your product does X for Y</h1>
    </main>
  )
}`,
        },
        {
          title: "Plain HTML",
          code: `<main>
  <h1>Your product does X for Y</h1>
  <p>Supporting content goes here.</p>
</main>`,
        },
        {
          title: "Server-rendered template (Thymeleaf)",
          code: `<main>
  <h1 th:text="\${heroHeadline}">Your product does X for Y</h1>
</main>

Provide heroHeadline from the homepage controller.`,
        },
      ]}
      checklist={[
        "Exactly one <h1> per page — not zero, not multiple",
        "H1 must contain visible text (not just an image)",
        "H1 should appear in the initial server-rendered HTML",
        "Use H2-H6 for sub-sections, don't skip heading levels",
      ]}
      related={[
        {
          href: "/title-tag-checker",
          label: "Title tag checker",
          note: "title and H1 should differ slightly",
        },
        {
          href: "/meta-description-checker",
          label: "Meta description checker",
        },
        {
          href: "/open-graph-checker",
          label: "Open Graph checker",
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
