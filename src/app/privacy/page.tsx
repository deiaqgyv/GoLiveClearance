import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/privacy", {
  title: "Privacy Policy",
  description: "How Go-Live Clearance processes URLs, scan reports, analytics, and technical logs.",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 pb-20 pt-12 sm:pt-16">
      <p className="field-label">Legal · Updated August 19, 2026</p>
      <h1 className="mt-3 font-display text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-8 space-y-7 text-sm leading-7 text-[var(--pass-mute)]">
        <section><h2 className="font-display text-xl font-semibold text-[var(--pass-ink)]">What we process</h2><p className="mt-2">When you run an inspection, we process the public URL you submit, the public response returned by that site, and technical request data needed to operate and protect the service. Do not submit private, authenticated, or confidential URLs.</p></section>
        <section><h2 className="font-display text-xl font-semibold text-[var(--pass-ink)]">Reports and retention</h2><p className="mt-2">Shareable reports expire after seven days. A report can be opened by anyone who has its direct link, so treat that link as sensitive and avoid sharing it publicly.</p></section>
        <section><h2 className="font-display text-xl font-semibold text-[var(--pass-ink)]">Analytics and infrastructure</h2><p className="mt-2">We may use privacy-conscious traffic analytics and infrastructure logs to understand aggregate usage, diagnose failures, and prevent abuse. Hosting and network providers may process IP addresses and request metadata as part of delivering the service.</p></section>
        <section><h2 className="font-display text-xl font-semibold text-[var(--pass-ink)]">Your choices</h2><p className="mt-2">You can use the public site without creating an account. To ask about data associated with a report, email <a className="underline" href="mailto:huhl22550555@163.com">huhl22550555@163.com</a> and include the report URL.</p></section>
      </div>
    </article>
  );
}
