import { describe, it, expect } from "vitest";
import { getFixes, getFix, attachFixes, FIX_STACK_LABEL } from "../fixes";

// ─── getFixes ───────────────────────────────────────────────────────────
describe("getFixes", () => {
  it("returns fixes for known finding IDs", () => {
    const knownIds = [
      "robots_txt.blocked",
      "robots_txt.missing",
      "noindex",
      "https_redirect",
      "security_headers",
      "sitemap",
      "sitemap.dirty",
      "title_description.title",
      "title_description.description",
      "canonical",
      "open_graph",
      "favicon",
      "preview_leak",
      "trust_pages.missing",
      "trust_pages.broken",
      "analytics",
      "placeholder_copy",
      "h1",
    ];

    for (const id of knownIds) {
      const fixes = getFixes(id);
      expect(fixes.length, `No fixes for ${id}`).toBeGreaterThan(0);
    }
  });

  it("falls back to security_headers bundle for security_headers.* IDs", () => {
    const fixes = getFixes("security_headers.hsts");
    expect(fixes.length).toBeGreaterThan(0);
    // Should contain the same fixes as "security_headers"
    const base = getFixes("security_headers");
    expect(fixes.map((f) => f.stack)).toEqual(base.map((f) => f.stack));
  });

  it("returns empty for unknown IDs", () => {
    const fixes = getFixes("nonexistent_check");
    expect(fixes).toEqual([]);
  });

  it("always includes AI prompt as last fix", () => {
    const ids = [
      "robots_txt.blocked",
      "noindex",
      "https_redirect",
      "open_graph",
    ];
    for (const id of ids) {
      const fixes = getFixes(id);
      const last = fixes[fixes.length - 1];
      expect(last.stack, `${id} should end with AI fix`).toBe("ai");
      expect(last.label).toBe("AI prompt");
    }
  });

  it("Vercel platform puts Next.js fix first", () => {
    const fixes = getFixes("robots_txt.blocked", "vercel");
    expect(fixes[0].stack).toBe("nextjs");
  });

  it("default platform puts HTML fix first", () => {
    const fixes = getFixes("robots_txt.blocked");
    expect(fixes[0].stack).toBe("html");
  });

  it("Cloudflare platform puts HTML before Next.js", () => {
    const fixes = getFixes("robots_txt.blocked", "cloudflare");
    const stacks = fixes.map((f) => f.stack);
    const htmlIdx = stacks.indexOf("html");
    const nextjsIdx = stacks.indexOf("nextjs");
    if (htmlIdx >= 0 && nextjsIdx >= 0) {
      expect(htmlIdx).toBeLessThan(nextjsIdx);
    }
  });
});

// ─── getFix ─────────────────────────────────────────────────────────────
describe("getFix", () => {
  it("returns first fix", () => {
    const fix = getFix("noindex");
    expect(fix).toBeDefined();
    expect(fix!.stack).toBe("html");
  });

  it("returns undefined for unknown IDs", () => {
    expect(getFix("nonexistent")).toBeUndefined();
  });
});

// ─── attachFixes ────────────────────────────────────────────────────────
describe("attachFixes", () => {
  it("returns fix + fixes array", () => {
    const result = attachFixes("noindex");
    expect(result.fix).toBeDefined();
    expect(result.fixes.length).toBeGreaterThan(0);
    expect(result.fix).toBe(result.fixes[0]);
  });
});

// ─── FIX_STACK_LABEL ────────────────────────────────────────────────────
describe("FIX_STACK_LABEL", () => {
  it("has labels for all stacks", () => {
    expect(FIX_STACK_LABEL.html).toBe("HTML");
    expect(FIX_STACK_LABEL.nextjs).toBe("Next.js");
    expect(FIX_STACK_LABEL.server).toBe("Server");
    expect(FIX_STACK_LABEL.ai).toBe("AI prompt");
  });
});
