import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = pageMetadata("/h1-tag-checker", {
  title: "H1 Tag Check",
  description:
    "H1 check for missing, empty, image-only, or multiple H1 tags. Paste a URL to inspect the primary heading before the page is indexed.",
  openGraph: {
    title: "H1 Tag Check",
    description:
      "Paste your URL. Run an H1 check for missing or competing headings before launch.",
    type: "website",
  },
});

export default function H1TagCheckerPage() {
  return (
    <ToolLanding
      focus="h1"
      eyebrow="On-page SEO · Heading structure"
      title="H1 Tag Check"
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
        {
          title: "Multiple H1 tags with competing topics",
          detail:
            "Modern HTML permits more than one H1, but repeated page-level headings often signal a template problem. Keep one unambiguous primary topic unless the document structure genuinely requires otherwise.",
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
      decision={{
        heading: "When to inspect H1 before title or canonical",
        lead: "This check answers one question: does the first HTML response contain a readable primary heading? It does not rank titles, Open Graph, or duplicate URLs.",
        items: [
          {
            title: "Use this checker",
            detail:
              "The page is a JS shell, a logo-as-heading template, or a CMS layout that sometimes renders an empty H1. You want evidence from the fetched HTML, not from a hydrated screenshot.",
          },
          {
            title: "Problem → aftermath → next step",
            detail:
              "Problem: crawlers and screen readers lack a topic anchor. Aftermath: the page is harder to interpret and may lose heading-based snippet context. Next step: put one text H1 in the server HTML, then re-scan the live URL.",
          },
          {
            title: "Adjacent checks",
            detail:
              "Title and H1 should describe the same topic in different words — use the title tag checker for the document title. Canonical is for URL variants, not headings. After App Router launch, confirm the heading still exists in production HTML with the Next.js checklist.",
          },
        ],
      }}
      related={[
        {
          href: "/canonical-checker",
          label: "Canonical checker",
          note: "duplicate URLs are a different failure than missing headings",
        },
        {
          href: "/nextjs-production-checklist",
          label: "Next.js production checklist",
          note: "SSR/SSG so the H1 is in the first HTML",
        },
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
