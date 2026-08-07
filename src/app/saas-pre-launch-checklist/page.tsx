import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "SaaS Pre-Launch Checklist — Go-Live Clearance for Indie SaaS",
  description:
    "SaaS pre-launch checklist: security headers, noindex, OG cards, payment pages, trust pages. Scan your deployed app and get CLEARED / HOLD / DENIED with fixes.",
  openGraph: {
    title: "SaaS Pre-Launch Checklist",
    description:
      "Indie SaaS launch accidents that lose signups. Scan your URL before the launch email goes out.",
    type: "website",
  },
};

export default function SaasPreLaunchChecklistPage() {
  return (
    <ToolLanding
      eyebrow="SaaS · pre-launch · indie teams"
      title="SaaS Pre-Launch Checklist"
      lead={
        <>
          Launch day for a SaaS is not just about the product — it is about
          whether the landing page, signup flow, and payment pages survive
          first contact with real visitors. Paste your production URL — we
          check the things that lose signups, then stamp CLEARED / HOLD /
          DENIED.
        </>
      }
      failuresHeading="SaaS launch failures we catch"
      failuresLead="These are the ones that do not break the app — they just lose the traffic you paid or posted for."
      failures={[
        {
          title: "Landing page still has noindex",
          detail:
            "Your Product Hunt or Hacker News link sends thousands of visitors, but Google never indexes the page. Future organic traffic = zero.",
        },
        {
          title: "OG image missing or broken",
          detail:
            "Your launch tweet shows a blank card instead of your carefully designed hero. First impression: unpolished.",
        },
        {
          title: "Privacy / Terms pages 404",
          detail:
            "Footer links to /privacy and /terms that return 404. Ad reviewers flag it. Paid users bounce. Trust damage on day one.",
        },
        {
          title: "No HTTPS on payment or auth pages",
          detail:
            "Stripe or OAuth callbacks on HTTP. Browsers show mixed-content warnings. Some users abandon signup.",
        },
        {
          title: "Missing analytics on day one",
          detail:
            "You launch and have no idea if the PH upvote converted. Days of blind optimization follow.",
        },
      ]}
      fixHeading="SaaS go-live fixes"
      fixLead="Fix the blockers before the launch email goes out."
      fixBlocks={[
        {
          title: "Remove noindex from landing page",
          code: `// app/layout.tsx
// Remove or conditionalize the robots directive
export const metadata = {
  // robots: { index: false }, ← DELETE THIS
  // Default is indexable — just omit it
}`,
        },
        {
          title: "Add trust pages (Privacy + Terms)",
          code: `// app/privacy/page.tsx
export const metadata = {
  title: 'Privacy Policy — Your SaaS',
  description: 'How we handle your data.',
}
export default function PrivacyPage() {
  return <article className="prose">{'/* Your privacy policy */'}</article>
}

// app/terms/page.tsx — same pattern`,
        },
        {
          title: "OG image + metadata for launch",
          code: `// app/layout.tsx
export const metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  openGraph: {
    title: 'Your SaaS — One-Line Value Prop',
    description: 'What it does, who it is for.',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}`,
        },
      ]}
      checklist={[
        "Smoke-test signup and payment flow on production (not localhost)",
        "Verify email notifications deliver (check spam folder)",
        "Confirm Stripe/OAuth redirect URLs are https://yourdomain.com",
        "Set up error tracking (Sentry free tier) before launch traffic arrives",
      ]}
      related={[
        {
          href: "/website-launch-checklist",
          label: "Website launch checklist",
          note: "general launch accidents",
        },
        {
          href: "/security-headers-checker",
          label: "Security headers checker",
          note: "HSTS matters on payment pages",
        },
        {
          href: "/noindex-checker",
          label: "Noindex checker",
        },
        {
          href: "/open-graph-checker",
          label: "Open Graph checker",
        },
        { href: "/methodology", label: "Methodology" },
        { href: "/", label: "Go-Live Clearance home" },
      ]}
    />
  );
}
