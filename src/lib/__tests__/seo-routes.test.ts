import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TOOL_ROUTES } from "@/lib/tool-routes";

function pageSource(route: string): string {
  return readFileSync(join(process.cwd(), "src/app", route.slice(1), "page.tsx"), "utf8");
}

describe("indexable SEO routes", () => {
  it("has one source page and a self-canonical for every sitemap tool route", () => {
    for (const route of TOOL_ROUTES) {
      expect(pageSource(route.path)).toContain(`pageMetadata("${route.path}"`);
    }
  });

  it("uses unique metadata titles and useful descriptions", () => {
    const titles = new Set<string>();
    for (const route of TOOL_ROUTES) {
      const source = pageSource(route.path);
      const title = source.match(/title:\s*"([^"]+)"/)?.[1];
      const description = source.match(/description:\s*\n?\s*"([^"]+)"/)?.[1];
      expect(title, `${route.path} metadata title`).toBeTruthy();
      expect(titles.has(title!), `duplicate metadata title: ${title}`).toBe(false);
      titles.add(title!);
      expect(description?.length, `${route.path} metadata description`).toBeGreaterThanOrEqual(50);
      expect(description?.length, `${route.path} metadata description`).toBeLessThanOrEqual(180);
    }
  });

  it("keeps the overlapping legacy Next.js checklist out of the indexable route set", () => {
    expect(TOOL_ROUTES.some((route) => String(route.path) === "/nextjs-launch-checklist")).toBe(false);
    expect(TOOL_ROUTES.some((route) => route.path === "/nextjs-production-checklist")).toBe(true);
  });
});
