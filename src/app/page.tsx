import { Suspense } from "react";
import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SamplePass } from "@/components/sample-pass";

function ScanFormFallback() {
  return (
    <div className="min-h-[280px] border border-[var(--pass-line)] bg-white" />
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 md:pt-12">
      {/* Hero — boarding pass form */}
      <Suspense fallback={<ScanFormFallback />}>
        <ScanForm variant="boarding" />
      </Suspense>

      <p className="mt-6 text-center font-mono text-[10px] leading-relaxed tracking-[0.08em] text-[var(--pass-mute)]">
        Free · No signup · Public URLs only · Results open as a shareable report
      </p>

      {/* Sample report */}
      <section className="mt-14" aria-labelledby="sample-heading">
        <div className="mb-5 text-center">
          <p className="field-label">What you get</p>
          <h2
            id="sample-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--pass-ink)] sm:text-3xl"
          >
            A clearance stamp, not a vanity score
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--pass-mute)]">
            CLEARED, HOLD, or DENIED — plus the three fixes that unblock launch.
            Copy HTML, Next.js, server, or AI prompts straight from the report.
          </p>
        </div>
        <SamplePass />
      </section>

      {/* What we check */}
      <section className="mt-16" aria-labelledby="checks-heading">
        <div className="mb-8 max-w-xl">
          <p className="field-label">Scope</p>
          <h2
            id="checks-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--pass-ink)] sm:text-3xl"
          >
            Launch readiness — not another vague SEO score
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--pass-mute)]">
            Focused gate checks for indie and Next.js launches. Not a
            vulnerability scanner, legal review, or Lighthouse replacement.
          </p>
        </div>

        <ul className="grid gap-px border border-[var(--pass-line)] bg-[var(--pass-line)] sm:grid-cols-2">
          {[
            {
              title: "Crawl & index",
              body: "HTTPS redirect, robots.txt, noindex, sitemap, soft-404 traps",
            },
            {
              title: "Share & SEO basics",
              body: "Title, description, H1, canonical, Open Graph, favicon",
            },
            {
              title: "Launch accidents",
              body: "Preview-host leaks, placeholder copy, missing trust pages, analytics",
            },
            {
              title: "Security posture",
              body: "TLS expiry and core security headers — merged so they don’t drown Top 3",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="bg-white px-5 py-5 sm:px-6 sm:py-6"
            >
              <h3 className="font-display text-base font-semibold text-[var(--pass-ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--pass-mute)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="mt-16" aria-labelledby="how-heading">
        <div className="mb-8">
          <p className="field-label">Process</p>
          <h2
            id="how-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--pass-ink)] sm:text-3xl"
          >
            Three steps to a gate decision
          </h2>
        </div>
        <ol className="grid gap-6 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Paste a public URL",
              body: "Your production homepage — or a launch page you own.",
            },
            {
              n: "02",
              title: "We run the gate",
              body: "Crawlability, meta, trust signals, and launch accidents in ~30s.",
            },
            {
              n: "03",
              title: "Fix by priority",
              body: "Full report page with stamp, Top 3 fixes, and stack-aware copy.",
            },
          ].map((step) => (
            <li key={step.n}>
              <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-[var(--pass-mute)]">
                {step.n}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-[var(--pass-ink)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--pass-mute)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Who */}
      <section className="mt-16 border border-[var(--pass-line)] bg-[var(--gate-surface)] px-6 py-10 sm:px-10">
        <p className="field-label">Audience</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--pass-ink)]">
          Built for teams that ship this week
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Indie makers",
              body: "Catch noindex, broken OG, and preview leaks before Product Hunt day.",
            },
            {
              title: "Next.js builders",
              body: "Fixes in Next metadata, headers(), robots.ts — or paste into AI.",
            },
            {
              title: "Freelancers",
              body: "Export Markdown for GitHub Issues, Linear, or the client handoff.",
            },
          ].map((who) => (
            <li key={who.title}>
              <h3 className="font-display text-base font-semibold text-[var(--pass-ink)]">
                {who.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--pass-mute)]">
                {who.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Guides + CTA */}
      <section className="mt-16 text-center">
        <p className="field-label">Guides</p>
        <p className="mt-3 font-mono text-xs text-[var(--pass-mute)]">
          <Link
            href="/website-launch-checklist"
            className="text-[var(--pass-ink)] underline-offset-2 hover:underline"
          >
            Website launch checklist
          </Link>
          {" · "}
          <Link
            href="/nextjs-production-checklist"
            className="text-[var(--pass-ink)] underline-offset-2 hover:underline"
          >
            Next.js production checklist
          </Link>
          {" · "}
          <Link
            href="/methodology"
            className="text-[var(--pass-ink)] underline-offset-2 hover:underline"
          >
            Methodology
          </Link>
        </p>
        <a
          href="#dest-url"
          className="mt-8 inline-flex border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white"
        >
          Inspect a URL ↑
        </a>
      </section>
    </div>
  );
}
