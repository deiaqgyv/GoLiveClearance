import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Forgot noindex in Production — Fix Staging Leftovers Before Google Does",
  description:
    "Forgot noindex in production? Detect meta robots noindex and X-Robots-Tag headers on your live site. Scan now and get CLEARED / HOLD / DENIED with exact fixes.",
  openGraph: {
    title: "Forgot noindex in Production?",
    description:
      "The #1 silent launch killer. Your site is live but Google cannot index it. Scan and fix now.",
    type: "website",
  },
};

export default function ForgotNoindexProductionPage() {
  return (
    <ToolLanding
      eyebrow="Launch accident · noindex leak"
      title="Forgot noindex in Production?"
      lead={
        <>
          It happens to every team:{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            &lt;meta name=&quot;robots&quot; content=&quot;noindex&quot;&gt;
          </code>{" "}
          from staging survives into production. The site looks fine, but
          Google never indexes it. Weeks later you realize organic traffic is
          zero. Paste your URL — we catch it instantly and give you the exact
          fix.
        </>
      }
      failuresHeading="How noindex leaks to production"
      failuresLead="These are the real-world patterns we see from indie teams."
      failures={[
        {
          title: "Hardcoded noindex in layout.tsx",
          detail:
            "The most common: robots: { index: false } committed during early development and never removed. It affects every page on the site.",
        },
        {
          title: "Environment-conditional noindex that never flipped",
          detail:
            "A NODE_ENV === 'production' check that fails because the build runs in production but runtime returns development. Or vice versa.",
        },
        {
          title: "X-Robots-Tag: noindex added by middleware",
          detail:
            "A middleware.ts that sets noindex for all non-production hosts — but the host detection logic is wrong or the middleware runs on production too.",
        },
        {
          title: "CDN or platform adds noindex globally",
          detail:
            "Cloudflare or Vercel edge rules that inject noindex for all responses. Invisible in source code, detectable only in response headers.",
        },
        {
          title: "Per-page noindex from a staging template",
          detail:
            "A blog or landing page template includes noindex. New pages inherit it automatically. Homepage is clean but subpages are invisible.",
        },
      ]}
      fixHeading="Fix the noindex leak"
      fixLead="Each pattern has a specific fix. Start with the scan to identify which one you have."
      fixBlocks={[
        {
          title: "1. Remove hardcoded noindex from metadata",
          code: `// app/layout.tsx
// ❌ Find and delete this:
export const metadata = {
  robots: { index: false, follow: false },
}

// ✅ Replace with (or just omit):
export const metadata = {
  // Default is indexable — no robots directive needed
}`,
        },
        {
          title: "2. Fix conditional noindex (safe pattern)",
          code: `// app/layout.tsx
export const metadata: Metadata = {
  ...(process.env.NODE_ENV === 'production'
    ? {} // indexable
    : { robots: { index: false, follow: true } }),
}

// ⚠️ Verify: after deploy, view page source and
//    search for "noindex" — it should be absent.`,
        },
        {
          title: "3. Remove X-Robots-Tag from middleware",
          code: `// middleware.ts — search for and remove any line like:
// res.headers.set('X-Robots-Tag', 'noindex')

// If you need noindex only for preview deploys:
export function middleware(req: NextRequest) {
  const isPreview = req.headers.get('host')?.includes('vercel.app')
  const res = NextResponse.next()
  if (isPreview) {
    res.headers.set('X-Robots-Tag', 'noindex')
  }
  return res
}`,
        },
      ]}
      checklist={[
        "After fixing: view page source in production and Ctrl+F for 'noindex'",
        "Check HTTP response headers for X-Robots-Tag: noindex (use curl -I or browser devtools)",
        "Submit the fixed URL in Search Console → URL Inspection → Request Indexing",
        "Monitor Search Console Coverage report for 'Discovered — currently not indexed' for the next 2 weeks",
      ]}
      related={[
        {
          href: "/noindex-checker",
          label: "Noindex checker",
          note: "scan your site now",
        },
        {
          href: "/robots-txt-checker",
          label: "robots.txt checker",
          note: "Disallow:/ is the other index killer",
        },
        {
          href: "/website-launch-checklist",
          label: "Website launch checklist",
        },
        {
          href: "/nextjs-launch-checklist",
          label: "Next.js launch checklist",
        },
        { href: "/methodology", label: "Methodology" },
        { href: "/", label: "Go-Live Clearance home" },
      ]}
    />
  );
}
