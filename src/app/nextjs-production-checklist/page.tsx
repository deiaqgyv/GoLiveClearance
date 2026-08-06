import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ScanForm } from "@/components/scan-form";

export const metadata: Metadata = {
  title: "Next.js Production Checklist — App Router Go-Live Clearance",
  description:
    "Next.js production checklist for indie teams on Vercel: metadata, robots.ts, sitemap.ts, security headers, and a live CLEARED / HOLD / DENIED scan.",
  openGraph: {
    title: "Next.js Production Checklist",
    description:
      "Paste your deployed URL. Get Next.js-ready fixes for robots, metadata, headers, and launch blockers.",
    type: "website",
  },
};

const NEXT_FIXES = [
  {
    title: "app/robots.ts still blocking everything",
    code: `// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}`,
  },
  {
    title: "metadata.robots left on noindex from staging",
    code: `// app/layout.tsx
export const metadata = {
  robots: { index: true, follow: true }, // or omit — default is indexable
}`,
  },
  {
    title: "Security headers via next.config",
    code: `// next.config.js
module.exports = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    }]
  },
}`,
  },
  {
    title: "metadataBase so OG / canonical use production",
    code: `// app/layout.tsx
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  alternates: { canonical: '/' },
  openGraph: { images: [{ url: '/og.png', width: 1200, height: 630 }] },
}`,
  },
];

const VERCEL = [
  "Attach the custom domain and wait for SSL to show Valid",
  "Set NEXT_PUBLIC_SITE_URL to https://yourdomain.com (not *.vercel.app)",
  "Promote the production deployment — don't share Preview URLs on launch posts",
  "Optional: enable Vercel Analytics before you send traffic",
];

export default function NextjsProductionChecklistPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 md:pt-14">
      <p className="field-label mb-3 text-[var(--hold-amber)]">
        Next.js · App Router · Vercel
      </p>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--pass-ink)] md:text-4xl">
        Next.js Production Checklist
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--pass-mute)] md:text-base">
        Local looks fine. Preview looks fine. Production still ships with{" "}
        <code className="bg-[var(--secondary)] px-1 font-mono text-xs">noindex</code>,
        missing headers, or OG images on the wrong host. Scan the live URL, then
        paste the AI prompt into your editor.
      </p>

      <section className="mt-10">
        <Suspense
          fallback={
            <div className="h-28 border border-[var(--pass-line)] bg-white" />
          }
        >
          <ScanForm variant="compact" />
        </Suspense>
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-xl font-bold text-stone-900">
          Copy-paste Next.js fixes
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          These cover the failures we see most on App Router + Vercel launches.
        </p>
        <div className="mt-6 space-y-5">
          {NEXT_FIXES.map((item) => (
            <div key={item.title}>
              <h3 className="text-sm font-semibold text-stone-900">{item.title}</h3>
              <pre className="mt-2 overflow-x-auto rounded-md bg-stone-900 px-4 py-3 font-mono text-[11px] leading-relaxed text-stone-200">
                <code>{item.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-xl font-bold text-stone-900">
          Vercel go-live ticks
        </h2>
        <ul className="mt-4 space-y-2">
          {VERCEL.map((item) => (
            <li
              key={item}
              className="flex gap-2 font-mono text-sm text-stone-700"
            >
              <span className="text-stone-400">□</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-md border border-stone-200 bg-stone-50 p-5">
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-stone-700">
          Related
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link
              href="/robots-txt-checker"
              className="font-medium text-amber-800 underline-offset-2 hover:underline"
            >
              robots.txt checker
            </Link>
          </li>
          <li>
            <Link
              href="/security-headers-checker"
              className="font-medium text-amber-800 underline-offset-2 hover:underline"
            >
              Security headers checker
            </Link>
          </li>
          <li>
            <Link
              href="/website-launch-checklist"
              className="font-medium text-amber-800 underline-offset-2 hover:underline"
            >
              Website launch checklist
            </Link>
            <span className="text-stone-500"> — stack-agnostic launch accidents</span>
          </li>
          <li>
            <Link
              href="/methodology"
              className="font-medium text-amber-800 underline-offset-2 hover:underline"
            >
              Methodology
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="font-medium text-amber-800 underline-offset-2 hover:underline"
            >
              Go-Live Clearance home
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
