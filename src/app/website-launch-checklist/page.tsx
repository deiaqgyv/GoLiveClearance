import type { Metadata } from "next";
import Link from "next/link";
import { ScanClient } from "@/components/scan-client";

export const metadata: Metadata = {
  title: "Website Launch Checklist — Free Pre-Launch Clearance",
  description:
    "The website launch checklist indie makers actually use: paste your URL, get CLEARED / HOLD / DENIED, and fix the blockers before Product Hunt or ads go live.",
  openGraph: {
    title: "Website Launch Checklist",
    description:
      "Paste your production URL. Get a go-live clearance stamp — not another vanity SEO score.",
    type: "website",
  },
};

const FAILURES = [
  {
    title: "Homepage still has noindex",
    detail:
      "Staging leftovers. You launch, Google never indexes, and Product Hunt traffic finds nothing searchable.",
  },
  {
    title: "robots.txt Disallow: /",
    detail:
      "Copied from a private preview template. Every crawler is told to stay out.",
  },
  {
    title: "Canonical or OG points at *.vercel.app",
    detail:
      "Share cards and Search Console attach to the preview host — not your real domain.",
  },
  {
    title: "Missing Privacy / Terms (or 404)",
    detail:
      "Footer looks finished until someone clicks. Paid users bounce; ad reviewers flag it.",
  },
  {
    title: "No analytics on day one",
    detail:
      "You will not know if the launch email or PH upvote converted. Flying blind.",
  },
];

const MANUAL = [
  "Custom domain attached and HTTPS green in the browser",
  "Primary CTA works on mobile (tap targets, no overlay trap)",
  "404 page exists and links home",
  "Payment / auth smoke-tested on production, not only localhost",
  "Support email / contact path monitored",
];

export default function WebsiteLaunchChecklistPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 md:pt-14">
      <p className="field-label mb-3 text-[var(--hold-amber)]">
        Launch checklist + live scanner
      </p>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--pass-ink)] md:text-4xl">
        Website Launch Checklist
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--pass-mute)] md:text-base">
        Checklists get skimmed. Accidents still ship. Paste your{" "}
        <strong className="font-semibold text-[var(--pass-ink)]">production URL</strong>{" "}
        below — we return a CLEARED / HOLD / DENIED stamp and the three fixes that
        matter before you promote.
      </p>

      <section className="mt-10">
        <ScanClient showSample={false} />
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-xl font-bold text-stone-900">
          Top launch-day failures we catch
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          These are the ones that look fine in a manual checklist and still ruin
          the first 48 hours.
        </p>
        <ul className="mt-6 space-y-4">
          {FAILURES.map((f) => (
            <li
              key={f.title}
              className="border-l-4 border-amber-400 bg-amber-50/50 py-3 pl-4 pr-3"
            >
              <p className="text-sm font-semibold text-stone-900">{f.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                {f.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-xl font-bold text-stone-900">
          Still check by hand
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          Machines miss UX and business paths. Tick these yourself after the
          stamp is clean.
        </p>
        <ul className="mt-4 space-y-2">
          {MANUAL.map((item) => (
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
              href="/nextjs-production-checklist"
              className="font-medium text-amber-800 underline-offset-2 hover:underline"
            >
              Next.js production checklist
            </Link>
            <span className="text-stone-500"> — App Router / Vercel fixes</span>
          </li>
          <li>
            <Link
              href="/methodology"
              className="font-medium text-amber-800 underline-offset-2 hover:underline"
            >
              Methodology
            </Link>
            <span className="text-stone-500"> — what CLEARED / HOLD / DENIED means</span>
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
