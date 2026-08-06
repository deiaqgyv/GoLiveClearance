import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Go-Live Site Clearance — the pre-launch URL inspection tool for indie developers.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
      <h1 className="mb-3 text-3xl font-extrabold tracking-tight">
        About
      </h1>
      <p className="mb-10 text-lg text-[var(--muted-foreground)]">
        Why this tool exists.
      </p>

      <div className="prose-sm space-y-6 leading-relaxed text-[var(--foreground)]/80">
        <p>
          <strong>Go-Live Clearance</strong> is a pre-launch inspection tool for indie developers
          who are about to ship a site and want to make sure nothing critical is broken.
        </p>

        <p>
          It&apos;s not another SEO suite with 200 metrics. It&apos;s not a performance audit.
          It&apos;s a <strong>go/no-go checkpoint</strong> — the last gate before you open the
          doors to the public.
        </p>

        <h2 className="pt-2 text-xl font-bold text-[var(--foreground)]">
          The problem
        </h2>
        <p>
          You&apos;ve spent weeks building your site. You&apos;re ready to launch. But did you:
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Accidentally leave a <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-xs">noindex</code> tag from development?</li>
          <li>Forget to set up HTTPS?</li>
          <li>Block all crawlers in robots.txt and forget to remove it?</li>
          <li>Miss critical security headers?</li>
        </ul>
        <p>
          These mistakes are invisible during development but devastating after launch.
          Go-Live Clearance catches them in 30 seconds.
        </p>

        <h2 className="pt-2 text-xl font-bold text-[var(--foreground)]">
          How it works
        </h2>
        <p>
          Paste your URL. We run a focused set of P0 checks — the things that will genuinely
          hurt your launch if they&apos;re wrong. Each finding comes with a consequence
          (what happens if you ignore it) and a fix (what to do about it).
        </p>
        <p>
          The verdict is a stamp: <strong>CLEARED</strong>, <strong>HOLD</strong>, or{" "}
          <strong>DENIED</strong> — not a vanity score. CLEARED means ship.
          HOLD means fix the top warnings before you promote. DENIED means
          blockers will make the launch fail; don&apos;t go live yet.
        </p>

        <h2 className="pt-2 text-xl font-bold text-[var(--foreground)]">
          Privacy
        </h2>
        <p>
          We only fetch publicly accessible pages. We don&apos;t store your scan data
          beyond the 7-day report retention period. Reports are accessible only via
          the direct link — no directory, no search engine indexing.
        </p>

        <h2 className="pt-2 text-xl font-bold text-[var(--foreground)]">
          Built for indie devs
        </h2>
        <p>
          This tool is built by and for indie developers who ship fast but don&apos;t
          want to ship broken. It&apos;s free, no account required, no email gate.
          Just paste and inspect.
        </p>
      </div>

      <div className="mt-12 border-t border-[var(--border)] pt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary)]/90"
        >
          Run an inspection
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
