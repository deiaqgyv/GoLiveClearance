import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="field-label">404 · Route not cleared</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--pass-mute)]">
        The requested page does not exist. Return to the inspector or browse the available SEO checks.
      </p>
      <div className="mt-8 flex justify-center gap-4 text-sm font-medium">
        <Link href="/" className="underline underline-offset-4">Run an inspection</Link>
        <Link href="/seo-checkers" className="underline underline-offset-4">Browse SEO checkers</Link>
      </div>
    </div>
  );
}
