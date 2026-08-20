import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/contact", {
  title: "Contact",
  description: "Contact Go-Live Clearance about scan reports, corrections, privacy, or partnerships.",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-12 sm:pt-16">
      <p className="field-label">Support · Corrections · Partnerships</p>
      <h1 className="mt-3 font-display text-3xl font-bold">Contact</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--pass-mute)]">For report questions, correction requests, privacy inquiries, or abuse reports, email us. Include the inspected public URL or report link when relevant, but never send passwords or private access tokens.</p>
      <a href="mailto:huhl22550555@163.com" className="mt-8 inline-flex border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white">huhl22550555@163.com</a>
    </div>
  );
}
