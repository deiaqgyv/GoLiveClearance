import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "SSL / HTTPS Checker — Redirect & Certificate Before Launch",
  description:
    "Free SSL and HTTPS checker: confirm HTTP→HTTPS redirect and certificate health before Product Hunt or ads. CLEARED / HOLD / DENIED with fix guidance.",
  openGraph: {
    title: "SSL / HTTPS Checker",
    description:
      "Paste your URL. Catch missing HTTPS redirects and certificate issues before you promote.",
    type: "website",
  },
};

export default function SslHttpsCheckerPage() {
  return (
    <ToolLanding
      eyebrow="Transport · TLS"
      title="SSL / HTTPS Checker"
      lead={
        <>
          Shipping on HTTP — or a cert that expires mid-launch week — is an
          instant trust failure. Paste the URL you will put on Product Hunt /
          ads. We check redirect enforcement and certificate signals, then stamp
          CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="Transport failures we catch"
      failures={[
        {
          title: "No HTTPS redirect",
          detail:
            "Visitors and crawlers can stay on http://. Mixed content and cookie flags break next.",
        },
        {
          title: "Certificate expiring soon",
          detail:
            "Auto-renewal silent failures are common on DIY DNS. A warning now beats a DENIED launch day.",
        },
        {
          title: "Wrong host / name mismatch",
          detail:
            "www vs apex, or a leftover preview hostname, shows browser interstitial on first click.",
        },
        {
          title: "HTTP-only deep links in OG / emails",
          detail:
            "Share cards and campaigns send people to insecure URLs even when the homepage redirects.",
        },
      ]}
      fixHeading="Platform redirects"
      fixLead="Prefer the platform toggle; fall back to config when you must."
      fixBlocks={[
        {
          title: "Vercel — force HTTPS (Domains)",
          code: `# Vercel Dashboard → Project → Settings → Domains
# Attach apex + www, wait until SSL = Valid
# Redirect www ↔ apex so one canonical HTTPS host wins`,
        },
        {
          title: "Next.js — middleware HTTPS nudge (edge cases)",
          code: `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers.get('x-forwarded-proto') === 'http'
  ) {
    const url = req.nextUrl.clone()
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }
  return NextResponse.next()
}`,
        },
      ]}
      checklist={[
        "Test both apex and www after DNS changes",
        "Open the site in a phone browser on cellular (not only Wi‑Fi)",
        "Confirm Stripe / OAuth callback URLs are https://",
      ]}
      related={[
        {
          href: "/security-headers-checker",
          label: "Security headers checker",
          note: "HSTS pairs with HTTPS",
        },
        {
          href: "/robots-txt-checker",
          label: "robots.txt checker",
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
