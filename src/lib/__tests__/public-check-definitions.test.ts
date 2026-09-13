import { describe, expect, it } from "vitest";

import { publicCheckDataset } from "../public-check-definitions";

describe("public check definitions", () => {
  it("uses unique stable IDs", () => {
    const ids = publicCheckDataset.definitions.map((definition) => definition.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("publishes evidence, failure and limitation for every check", () => {
    expect(publicCheckDataset.definitions.every((definition) => definition.evidence && definition.failure && definition.limitation)).toBe(true);
  });

  it("does not describe robots.txt as an indexing removal mechanism", () => {
    const robots = publicCheckDataset.definitions.find((definition) => definition.id === "robots_txt");
    expect(robots?.limitation).toContain("Does not prove indexing");
  });
});
