import type { Metadata } from "next";
import Link from "next/link";

import { benchmarkPrivacyRules, benchmarkPublicationStatus } from "@/lib/benchmark-aggregation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/benchmark-policy", { title: "Anonymous benchmark publication policy", description: "How GoLiveClearance would aggregate finding rates, protect scanned domains, and withhold statistics until the minimum sample is reached." });

export default function BenchmarkPolicyPage() {
  return <main className="mx-auto max-w-2xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
    <p className="field-label">Policy version · {benchmarkPublicationStatus.version}</p>
    <h1 className="mb-3 mt-3 text-3xl font-extrabold tracking-tight">Anonymous benchmark publication policy</h1>
    <p className="mb-10 text-lg text-[var(--muted-foreground)]">The site does not currently publish finding-rate benchmarks because no production observation source is connected.</p>
    <section className="mb-10"><h2 className="mb-4 text-xl font-bold">Current status: collection not connected</h2><p className="text-sm leading-relaxed text-[var(--foreground)]/80">The published sample is zero and no rates are exposed. This describes the public dataset, not a claim that zero scans or users exist. GoLiveClearance will not invent a sample size or derive rates from test fixtures.</p></section>
    <section className="mb-10"><h2 className="mb-4 text-xl font-bold">Publication gate</h2><p className="text-sm leading-relaxed text-[var(--foreground)]/80">A finding rate can be published only after at least <strong>{benchmarkPrivacyRules.minimumDistinctDomains} distinct domains</strong> are present in a real observation source. One domain contributes at most once to each finding ID. Below that threshold, the aggregation function returns no rates.</p></section>
    <section className="mb-10"><h2 className="mb-4 text-xl font-bold">Fields included and excluded</h2><p className="mb-3 text-sm leading-relaxed text-[var(--foreground)]/80">Permitted aggregate fields: {benchmarkPrivacyRules.publishedFields.join(", ")}.</p><p className="text-sm leading-relaxed text-[var(--foreground)]/80">Excluded from publication: {benchmarkPrivacyRules.excludedFields.join(", ")}.</p></section>
    <section className="mb-10"><h2 className="mb-4 text-xl font-bold">What a future benchmark would not prove</h2><p className="text-sm leading-relaxed text-[var(--foreground)]/80">An observed rate would describe the submitted domain sample and scanner version, not the whole web. It would not establish causation, ranking impact, security compliance or issue prevalence in a country or industry unless the sample and method supported that claim.</p></section>
    <p className="text-sm"><a className="underline" href="/data/benchmark-policy.json">Download the machine-readable policy and current status</a> or read the <Link className="underline" href="/methodology">scanner methodology</Link>.</p>
  </main>;
}
