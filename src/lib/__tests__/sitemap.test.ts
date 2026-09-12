import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("contains public topic and trust pages", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(paths).toEqual(expect.arrayContaining([
      "/seo-checkers",
      "/launch-checklists",
      "/social-preview",
      "/security",
      "/privacy",
      "/terms",
      "/contact",
    ]));
  });

  it("uses the verified content update date instead of the deploy time", () => {
    expect(sitemap().every((entry) => entry.lastModified instanceof Date)).toBe(true);
    expect(new Set(sitemap().map((entry) =>
      entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified
    ))).toEqual(
      new Set(["2026-09-11T00:00:00.000Z"])
    );
  });

  it("does not include redirected legacy pages", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(paths).not.toContain("/nextjs-launch-checklist");
  });

  it("only emits absolute URLs", () => {
    expect(sitemap().every((entry) => URL.canParse(entry.url))).toBe(true);
  });
});
