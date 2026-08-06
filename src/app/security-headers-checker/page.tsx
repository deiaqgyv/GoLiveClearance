import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Security Headers Checker — HSTS, CSP, XFO Before Ship",
  description:
    "Free security headers checker for launch day: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy. Get CLEARED / HOLD / DENIED with Next.js header fixes.",
  openGraph: {
    title: "Security Headers Checker",
    description:
      "Paste your URL. See missing HSTS/CSP/XFO and copy next.config headers().",
    type: "website",
  },
};

export default function SecurityHeadersCheckerPage() {
  return (
    <ToolLanding
      eyebrow="Hardening · response headers"
      title="Security Headers Checker"
      lead={
        <>
          Grade tools tell you &quot;B&quot;. We tell you whether missing headers
          are a launch blocker or a post-ship warning — then give{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            next.config
          </code>{" "}
          / platform snippets you can paste.
        </>
      }
      failuresHeading="Headers that matter at go-live"
      failuresLead="We score headers with a merge cap so one missing family does not nuke the whole clearance."
      failures={[
        {
          title: "No Strict-Transport-Security",
          detail:
            "Browsers may keep using HTTP on the next visit. On a paid or login site this is a trust gap.",
        },
        {
          title: "Missing X-Frame-Options / frame-ancestors",
          detail:
            "Clickjacking risk on marketing and auth pages. Cheap to add, expensive to explain after an incident.",
        },
        {
          title: "No X-Content-Type-Options: nosniff",
          detail:
            "MIME sniffing opens odd XSS paths on user-upload or CDN edges.",
        },
        {
          title: "Empty or absent Content-Security-Policy",
          detail:
            "Not always a DENIED blocker on day one — but it is the header security auditors ask for first.",
        },
        {
          title: "Weak Referrer-Policy / Permissions-Policy",
          detail:
            "Leaks URLs to third parties or leaves camera/mic defaults wide open.",
        },
      ]}
      fixHeading="Next.js / Vercel header snippet"
      fixBlocks={[
        {
          title: "next.config.js — headers()",
          code: `/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig`,
        },
        {
          title: "CSP starter (tighten after measuring)",
          code: `Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'`,
        },
      ]}
      checklist={[
        "Re-scan after deploy — Preview and Production can differ",
        "If you use a CDN, set headers at the edge once (avoid duplicates)",
        "Add a real CSP only after you inventory third-party scripts",
      ]}
      related={[
        {
          href: "/ssl-https-checker",
          label: "SSL / HTTPS checker",
          note: "redirect + certificate",
        },
        {
          href: "/robots-txt-checker",
          label: "robots.txt checker",
        },
        {
          href: "/nextjs-production-checklist",
          label: "Next.js production checklist",
        },
        { href: "/methodology", label: "Methodology" },
        { href: "/", label: "Go-Live Clearance home" },
      ]}
    />
  );
}
