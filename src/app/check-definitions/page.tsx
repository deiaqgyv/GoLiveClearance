import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { publicCheckDataset } from "@/lib/public-check-definitions";

export const metadata: Metadata = pageMetadata("/check-definitions", {
  title: "Website Launch Check Definitions",
  description: "Versioned definitions for GoLiveClearance checks, including evidence, failure conditions, severity and detection limitations.",
});

export default function CheckDefinitionsPage() {
  const pageUrl = `${SITE.domain}/check-definitions`;
  const dataUrl = `${SITE.domain}/data/check-definitions.json`;
  const structuredData = { "@context": "https://schema.org", "@type": "Dataset", "@id": `${pageUrl}#dataset`, name: publicCheckDataset.name, description: metadata.description, url: pageUrl, dateModified: publicCheckDataset.version, measurementTechnique: publicCheckDataset.scope, distribution: { "@type": "DataDownload", contentUrl: dataUrl, encodingFormat: "application/json" } };
  return <main className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <p className="field-label">Reference dataset · Version {publicCheckDataset.version}</p>
    <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Website launch check definitions</h1>
    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--foreground)]/80"><strong>Direct answer:</strong> Each GoLiveClearance check observes a defined signal in one bounded public scan. The definitions below state what evidence is examined, what triggers failure, how severity is assigned, and what the result cannot prove. Passing a check is not a ranking, security, accessibility or compliance guarantee.</p>
    <div className="mt-10 overflow-x-auto border border-[var(--border)]"><table className="w-full min-w-[900px] border-collapse text-left text-sm"><thead className="bg-[var(--card)]"><tr><th className="p-3">Check</th><th className="p-3">Observed signal</th><th className="p-3">Failure</th><th className="p-3">Limitation</th><th className="p-3">Severity</th></tr></thead><tbody>{publicCheckDataset.definitions.map((check) => <tr key={check.id} className="border-t border-[var(--border)] align-top"><td className="p-3 font-mono text-xs">{check.id}</td><td className="p-3">{check.signal}<div className="mt-2 text-xs text-[var(--muted-foreground)]">Evidence: {check.evidence}</div></td><td className="p-3">{check.failure}</td><td className="p-3">{check.limitation}</td><td className="p-3 font-semibold uppercase">{check.severity}</td></tr>)}</tbody></table></div>
    <p className="mt-8 text-sm"><a className="underline underline-offset-2" href={dataUrl}>Download the JSON definitions</a> or <a className="ml-2 underline underline-offset-2" href="/methodology">read the complete methodology</a>.</p>
  </main>;
}
