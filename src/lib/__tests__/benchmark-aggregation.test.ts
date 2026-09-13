import { describe, expect, it } from "vitest";

import { aggregateBenchmarkObservations, benchmarkPrivacyRules, benchmarkPublicationStatus } from "../benchmark-aggregation";

describe("benchmark aggregation privacy gate", () => {
  it("withholds rates below the minimum distinct-domain sample", () => {
    expect(aggregateBenchmarkObservations([{ hostname: "example.com", findingIds: ["noindex"] }])).toEqual(expect.objectContaining({ status: "insufficient_sample", rates: [] }));
  });

  it("deduplicates repeated findings from the same domain", () => {
    const observations = Array.from({ length: 100 }, (_, index) => ({ hostname: `site-${index}.example`, findingIds: index === 0 ? ["noindex", "noindex"] : [] }));
    const aggregate = aggregateBenchmarkObservations(observations);
    expect(aggregate.status).toBe("publishable");
    expect(aggregate.rates).toContainEqual({ findingId: "noindex", affectedDomains: 1, affectedPercent: 1 });
  });

  it("excludes identifying and page-content fields from the publication contract", () => {
    expect(benchmarkPrivacyRules.excludedFields).toContain("hostname");
    expect(benchmarkPrivacyRules.excludedFields).toContain("page content");
  });

  it("publishes an honest machine-readable status before collection is connected", () => {
    expect(benchmarkPublicationStatus.status).toBe("collection_not_connected");
    expect(benchmarkPublicationStatus.currentPublishedSample).toBe(0);
    expect(benchmarkPublicationStatus.publishedRates).toEqual([]);
    expect(benchmarkPublicationStatus.note).toContain("not a measured count");
  });
});
