import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Next.js Launch Checklist — App Router Go-Live Fixes",
  description:
    "Next.js launch checklist for indie teams: metadata, robots.ts, sitemap.ts, security headers, OG images. Scan your deployed URL and get CLEARED / HOLD / DENIED with copy-paste fixes.",
  openGraph: {
    title: "Next.js Launch Checklist",
    description:
      "Local works, preview works, production still breaks. Scan the live URL and paste the fixes.",
    type: "website",
  },
};

export default function NextjsLaunchChecklistPage() {
  return (
    <ToolLanding
      eyebrow="Next.js · App Router · launch day"
      title="Next.js Launch Checklist"
      lead={
        <>
          The classic Next.js trap: everything works locally and on preview, but
          production ships with{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            noindex
          </code>
          , missing{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            metadataBase
          </code>
          , or OG images pointing at{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            *.vercel.app
          </code>
          . Paste your deployed URL — we scan and stamp CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="Top Next.js launch failures"
      failuresLead="These are the ones that survive local and preview but break in production."
      failures={[
        {
          title: "metadataBase not set — OG images 404",
          detail:
            "Without metadataBase, Next.js cannot resolve relative OG image paths to absolute URLs. Social crawlers get a 404 on /og.png.",
        },
        {
          title: "app/robots.ts still has Disallow: /",
          detail:
            "Copied from the starter template. Google respects it immediately — your new site is invisible from day one.",
        },
        {
          title: "Staging noindex leaked to production build",
          detail:
            "A conditional robots: { index: false } that does not flip when NODE_ENV changes between build and runtime.",
        },
        {
          title: "next.config.js missing security headers",
          detail:
            "Vercel does not add HSTS or X-Frame-Options by default. Your launch gets a security score of F.",
        },
        {
          title: "Canonical / OG URLs still point at *.vercel.app",
          detail:
            "NEXT_PUBLIC_SITE_URL not updated after domain binding. Every share and search signal goes to the wrong host.",
        },
      ]}
      fixHeading="Next.js go-live fixes"
      fixLead="Copy these into your project before you promote."
      fixBlocks={[
        {
          title: "app/layout.tsx — metadataBase + OG",
          code: `import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: 'Your Product',
  description: 'One-line description',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Your Product',
    description: 'One-line description',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
}`,
        },
        {
          title: "app/robots.ts — allow + sitemap",
          code: `import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}`,
        },
        {
          title: "next.config.js — security headers",
          code: `/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }]
  },
}

module.exports = nextConfig`,
        },
      ]}
      checklist={[
        "Set NEXT_PUBLIC_SITE_URL=https://yourdomain.com in Vercel environment variables",
        "Re-scan after every domain or env change — Redeploy if you change NEXT_PUBLIC_*",
        "Submit sitemap.xml in Search Console once the domain is verified",
      ]}
      related={[
        {
          href: "/nextjs-production-checklist",
          label: "Next.js production checklist",
          note: "the original checklist",
        },
        {
          href: "/vercel-go-live-checklist",
          label: "Vercel go-live checklist",
        },
        {
          href: "/noindex-checker",
          label: "Noindex checker",
        },
        {
          href: "/robots-txt-checker",
          label: "robots.txt checker",
        },
        { href: "/methodology", label: "Methodology" },
        { href: "/", label: "Go-Live Clearance home" },
      ]}
    />
  );
}
