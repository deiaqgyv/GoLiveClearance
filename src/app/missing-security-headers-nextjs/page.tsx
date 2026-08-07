import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Missing Security Headers in Next.js — Fix Before Launch",
  description:
    "Missing security headers in Next.js? HSTS, CSP, X-Frame-Options, X-Content-Type-Options — scan your deployed URL and get copy-paste next.config fixes.",
  openGraph: {
    title: "Missing Security Headers in Next.js",
    description:
      "Vercel does not add security headers by default. Scan now and fix with one next.config.js snippet.",
    type: "website",
  },
};

export default function MissingSecurityHeadersNextjsPage() {
  return (
    <ToolLanding
      eyebrow="Next.js · security headers · hardening"
      title="Missing Security Headers in Next.js"
      lead={
        <>
          Vercel and Next.js do not add security headers by default. Your app
          ships with an{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            F
          </code>{" "}
          on securityheaders.com and you only find out when a security audit or
          a paying customer asks. Paste your URL — we check{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            HSTS
          </code>
          ,{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            CSP
          </code>
          ,{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            X-Frame-Options
          </code>
          , and three more, then stamp CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="Headers Next.js apps typically miss"
      failuresLead="These are absent from a default Next.js + Vercel deployment."
      failures={[
        {
          title: "No Strict-Transport-Security (HSTS)",
          detail:
            "Browsers may still use HTTP on revisits. Critical for apps with login or payment — session cookies leak on the HTTP hop.",
        },
        {
          title: "No X-Frame-Options / frame-ancestors",
          detail:
            "Your app can be embedded in an iframe on a malicious site. Clickjacking targets auth flows and payment buttons.",
        },
        {
          title: "No X-Content-Type-Options: nosniff",
          detail:
            "Browsers guess MIME types on user-uploaded files. A mismatch opens XSS vectors on CDN edges.",
        },
        {
          title: "No Content-Security-Policy",
          detail:
            "Third-party scripts (analytics, chat widgets) can load anything. CSP is the header auditors ask for first.",
        },
        {
          title: "No Referrer-Policy / Permissions-Policy",
          detail:
            "Full URLs leak to third-party origins. Camera, microphone, and geolocation defaults stay wide open.",
        },
      ]}
      fixHeading="next.config.js — all headers at once"
      fixLead="One config block covers every header we check. Copy and adjust."
      fixBlocks={[
        {
          title: "next.config.js — complete headers",
          code: `/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig`,
        },
        {
          title: "CSP starter — tighten after measuring",
          code: `// Add to the headers array above:
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'",
}

// ⚠️ CSP breaks things if too strict.
// 1. Deploy with Content-Security-Policy-Report-Only first
// 2. Check browser console for violation reports
// 3. Tighten, then switch to the real header`,
        },
      ]}
      checklist={[
        "Deploy and re-scan — headers appear only in production, not in next dev",
        "If using a CDN (Cloudflare, etc.), set headers at the edge to avoid duplicates",
        "Start with Content-Security-Policy-Report-Only before enforcing a real CSP",
        "Test iframe embedding after adding X-Frame-Options: DENY — break intentional embeds?",
      ]}
      related={[
        {
          href: "/security-headers-checker",
          label: "Security headers checker",
          note: "scan your site now",
        },
        {
          href: "/nextjs-production-checklist",
          label: "Next.js production checklist",
        },
        {
          href: "/ssl-https-checker",
          label: "SSL / HTTPS checker",
          note: "HSTS pairs with HTTPS",
        },
        { href: "/methodology", label: "Methodology" },
        { href: "/", label: "Go-Live Clearance home" },
      ]}
    />
  );
}
