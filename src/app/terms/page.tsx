import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/terms", {
  title: "Terms of Use",
  description: "Terms for using the Go-Live Clearance public website inspection service.",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 pb-20 pt-12 sm:pt-16">
      <p className="field-label">Legal · Updated August 19, 2026</p>
      <h1 className="mt-3 font-display text-3xl font-bold">Terms of Use</h1>
      <div className="mt-8 space-y-7 text-sm leading-7 text-[var(--pass-mute)]">
        <section><h2 className="font-display text-xl font-semibold text-[var(--pass-ink)]">Permitted use</h2><p className="mt-2">Use Go-Live Clearance only for public websites you own, manage, or are authorized to inspect. Do not use it to probe private networks, bypass access controls, overload third-party services, or perform unlawful activity.</p></section>
        <section><h2 className="font-display text-xl font-semibold text-[var(--pass-ink)]">Inspection scope</h2><p className="mt-2">Results are automated point-in-time observations, not a complete security audit, legal review, accessibility certification, or guarantee of search ranking. Verify important findings before acting on them.</p></section>
        <section><h2 className="font-display text-xl font-semibold text-[var(--pass-ink)]">Availability</h2><p className="mt-2">The service is provided as available and may change, throttle requests, or stop supporting a feature without notice. You remain responsible for your website, deployment, and launch decisions.</p></section>
        <section><h2 className="font-display text-xl font-semibold text-[var(--pass-ink)]">Contact</h2><p className="mt-2">Questions or abuse reports can be sent to <a className="underline" href="mailto:huhl22550555@163.com">huhl22550555@163.com</a>.</p></section>
      </div>
    </article>
  );
}
