const MIN_DISTINCT_DOMAINS = 100;

export type BenchmarkObservation = {
  hostname: string;
  findingIds: string[];
};

export type BenchmarkAggregate = {
  status: "publishable" | "insufficient_sample";
  distinctDomains: number;
  minimumDistinctDomains: number;
  rates: Array<{ findingId: string; affectedDomains: number; affectedPercent: number }>;
};

export function aggregateBenchmarkObservations(observations: BenchmarkObservation[]): BenchmarkAggregate {
  const byDomain = new Map<string, Set<string>>();
  for (const observation of observations) {
    const hostname = observation.hostname.trim().toLowerCase();
    if (!hostname) continue;
    const findings = byDomain.get(hostname) ?? new Set<string>();
    observation.findingIds.forEach((findingId) => findings.add(findingId));
    byDomain.set(hostname, findings);
  }

  const distinctDomains = byDomain.size;
  if (distinctDomains < MIN_DISTINCT_DOMAINS) {
    return { status: "insufficient_sample", distinctDomains, minimumDistinctDomains: MIN_DISTINCT_DOMAINS, rates: [] };
  }

  const counts = new Map<string, number>();
  for (const findings of byDomain.values()) {
    for (const findingId of findings) counts.set(findingId, (counts.get(findingId) ?? 0) + 1);
  }
  const rates = [...counts.entries()].map(([findingId, affectedDomains]) => ({ findingId, affectedDomains, affectedPercent: Number((affectedDomains / distinctDomains * 100).toFixed(1)) })).sort((a, b) => b.affectedDomains - a.affectedDomains || a.findingId.localeCompare(b.findingId));
  return { status: "publishable", distinctDomains, minimumDistinctDomains: MIN_DISTINCT_DOMAINS, rates };
}

export const benchmarkPrivacyRules = {
  minimumDistinctDomains: MIN_DISTINCT_DOMAINS,
  publishedFields: ["findingId", "affectedDomains", "affectedPercent"],
  excludedFields: ["hostname", "full URL", "query string", "report token", "IP address", "page content"],
  deduplication: "One domain contributes at most once to each finding ID.",
} as const;

export const benchmarkPublicationStatus = {
  name: "GoLiveClearance anonymous benchmark publication policy",
  version: "2026-09-13",
  status: "collection_not_connected",
  currentPublishedSample: 0,
  publicationThresholdDistinctDomains: MIN_DISTINCT_DOMAINS,
  publishedRates: [],
  privacyRules: benchmarkPrivacyRules,
  note: "No production observation source is connected. Zero describes the published dataset, not a measured count of scans or users.",
} as const;
