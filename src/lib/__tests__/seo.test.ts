import { describe, expect, it } from "vitest";
import { pageMetadata } from "@/lib/seo";

describe("pageMetadata", () => {
  it("sets self-canonical path", () => {
    const meta = pageMetadata("/title-tag-checker", {
      title: "Title Tag Checker",
    });
    expect(meta.alternates?.canonical).toBe("/title-tag-checker");
    expect(meta.title).toBe("Title Tag Checker");
    expect(meta.openGraph?.url).toBe("/title-tag-checker");
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 }),
    ]);
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("normalizes trailing slash on non-root paths", () => {
    const meta = pageMetadata("/about/", { title: "About" });
    expect(meta.alternates?.canonical).toBe("/about");
  });

  it("keeps page-specific Open Graph copy while applying shared image defaults", () => {
    const meta = pageMetadata("/robots-txt-checker", {
      title: "robots.txt Checker",
      openGraph: { title: "Check robots.txt" },
    });
    expect(meta.openGraph?.title).toBe("Check robots.txt");
    expect(meta.openGraph?.siteName).toBe("Go-Live Clearance");
    expect(meta.openGraph?.images).toBeDefined();
  });
});
