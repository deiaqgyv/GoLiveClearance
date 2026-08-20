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

  it("does not claim a deploy-time lastmod for every page", () => {
    expect(sitemap().every((entry) => entry.lastModified === undefined)).toBe(true);
  });

  it("does not include redirected legacy pages", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(paths).not.toContain("/nextjs-launch-checklist");
  });

  it("only emits absolute URLs", () => {
    expect(sitemap().every((entry) => URL.canParse(entry.url))).toBe(true);
  });
});
