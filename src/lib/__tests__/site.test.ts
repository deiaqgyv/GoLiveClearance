import { describe, expect, it } from "vitest";
import { CANONICAL_ORIGIN, normalizeSiteDomain } from "@/lib/site";

describe("normalizeSiteDomain", () => {
  it("keeps www production host", () => {
    expect(normalizeSiteDomain("https://www.goliveclearance.com")).toBe(
      "https://www.goliveclearance.com"
    );
  });

  it("upgrades apex to www so sitemap never lists 308 URLs", () => {
    expect(normalizeSiteDomain("https://goliveclearance.com")).toBe(
      "https://www.goliveclearance.com"
    );
    expect(normalizeSiteDomain("https://goliveclearance.com/")).toBe(
      "https://www.goliveclearance.com"
    );
  });

  it("picks the last URL when env values are concatenated", () => {
    expect(
      normalizeSiteDomain(
        "https://go-live-clearance.vercel.apphttps://www.goliveclearance.com"
      )
    ).toBe("https://www.goliveclearance.com");
  });

  it("keeps the production origin as the single source of truth", () => {
    expect(CANONICAL_ORIGIN).toBe("https://www.goliveclearance.com");
    expect(normalizeSiteDomain(CANONICAL_ORIGIN)).toBe(CANONICAL_ORIGIN);
  });
});
