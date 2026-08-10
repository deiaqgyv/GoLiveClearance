import { describe, expect, it } from "vitest";
import { pageMetadata } from "@/lib/seo";

describe("pageMetadata", () => {
  it("sets self-canonical path", () => {
    const meta = pageMetadata("/title-tag-checker", {
      title: "Title Tag Checker",
    });
    expect(meta.alternates?.canonical).toBe("/title-tag-checker");
    expect(meta.title).toBe("Title Tag Checker");
  });

  it("normalizes trailing slash on non-root paths", () => {
    const meta = pageMetadata("/about/", { title: "About" });
    expect(meta.alternates?.canonical).toBe("/about");
  });
});
