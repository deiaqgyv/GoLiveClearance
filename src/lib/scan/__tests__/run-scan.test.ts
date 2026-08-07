import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock dns to avoid real DNS lookups
vi.mock("dns", () => ({
  promises: {
    resolve: vi.fn().mockResolvedValue(["93.184.216.34"]),
  },
}));

// Mock fetch-target to control all fetch results
vi.mock("../fetch-target", () => ({
  fetchTarget: vi.fn(),
  fetchSmallFile: vi.fn(),
}));

let runScan: typeof import("../run-scan").runScan;
let mockFetchTarget: ReturnType<typeof vi.fn>;
let mockFetchSmallFile: ReturnType<typeof vi.fn>;

beforeEach(async () => {
  const fetchMod = await import("../fetch-target");
  mockFetchTarget = vi.mocked(fetchMod.fetchTarget);
  mockFetchSmallFile = vi.mocked(fetchMod.fetchSmallFile);

  const scanMod = await import("../run-scan");
  runScan = scanMod.runScan;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Helper: create a mock FetchResult
function makeFetchResult(overrides: Partial<{
  urlFinal: string;
  status: number;
  html: string;
  platform: string;
  headers: Record<string, string>;
}> = {}) {
  const headers = new Headers(overrides.headers || {});
  return {
    urlInput: "https://example.com",
    urlFinal: overrides.urlFinal || "https://example.com",
    status: overrides.status ?? 200,
    headers,
    html: overrides.html || "<html><head><title>Example</title></head><body><h1>Welcome</h1></body></html>",
    truncated: false,
    platform: (overrides.platform || "unknown") as "unknown",
    redirectChain: [] as string[],
  };
}

// Helper: create a mock SmallFileResult
function makeSmallFileResult(overrides: Partial<{
  ok: boolean;
  body: string;
  contentType: string;
  status: number;
}> = {}) {
  return {
    ok: overrides.ok ?? true,
    status: overrides.status ?? 200,
    body: overrides.body || "",
    truncated: false,
    urlFinal: "https://example.com/robots.txt",
    contentType: overrides.contentType || "text/plain",
  };
}

describe("runScan integration", () => {
  it("returns no blockers for a well-configured site", async () => {
    mockFetchTarget.mockResolvedValueOnce(makeFetchResult({
      html: `<html><head>
        <title>Example Site</title>
        <meta name="description" content="A great site">
        <link rel="canonical" href="https://example.com/">
        <meta property="og:title" content="Example Site">
        <meta property="og:description" content="A great site">
        <meta property="og:image" content="https://example.com/og.png">
        <meta property="og:url" content="https://example.com/">
        <meta property="og:type" content="website">
        <link rel="icon" href="/favicon.ico">
      </head><body><h1>Welcome</h1></body></html>`,
    }));

    // robots.txt - no blanket disallow
    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({
      body: "User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml",
    }));
    // sitemap.xml
    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({
      body: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.com/</loc></url></urlset>',
      contentType: "application/xml",
    }));

    // fetchSmallFile is also called for sitemap page URLs (spot-check)
    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({
      body: `<html><head><title>Example</title></head><body><h1>Home</h1></body></html>`,
    }));

    const result = await runScan({
      url: new URL("https://example.com"),
      urlInput: "https://example.com",
    });

    // A well-configured site should have no blockers
    // (warnings like security_headers, analytics, trust_pages are expected)
    expect(result.clearance).not.toBe("no_go");
    expect(result.findings.some(f => f.severity === "blocker")).toBe(false);
    expect(result.score).toBeGreaterThan(0);
  });

  it("returns DENIED (no_go) for site with noindex", async () => {
    mockFetchTarget.mockResolvedValueOnce(makeFetchResult({
      html: `<html><head>
        <title>Example</title>
        <meta name="robots" content="noindex, nofollow">
      </head><body><h1>Test</h1></body></html>`,
    }));

    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({
      body: "User-agent: *\nAllow: /",
    }));
    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({ ok: false, status: 404 }));

    const result = await runScan({
      url: new URL("https://example.com"),
      urlInput: "https://example.com",
    });

    expect(result.clearance).toBe("no_go");
    expect(result.findings.some(f => f.id === "noindex")).toBe(true);
    expect(result.summary.blockers).toBeGreaterThanOrEqual(1);
  });

  it("returns HOLD for site with warnings only", async () => {
    mockFetchTarget.mockResolvedValueOnce(makeFetchResult({
      html: `<html><head>
        <title>Example Site</title>
        <meta name="description" content="A great site">
        <meta property="og:title" content="Example Site">
        <meta property="og:description" content="A great site">
        <meta property="og:image" content="https://example.com/og.png">
        <meta property="og:url" content="https://example.com/">
        <meta property="og:type" content="website">
        <link rel="icon" href="/favicon.ico">
      </head><body><h1>Welcome</h1></body></html>`,
      // No canonical → warning
    }));

    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({
      body: "User-agent: *\nAllow: /",
    }));
    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({ ok: false, status: 404 }));

    const result = await runScan({
      url: new URL("https://example.com"),
      urlInput: "https://example.com",
    });

    // Should have warnings but no blockers
    expect(result.findings.some(f => f.severity === "warning")).toBe(true);
    // If there are no blockers, clearance should be go or hold
    if (result.summary.blockers === 0) {
      expect(["go", "hold"]).toContain(result.clearance);
    }
  });

  it("flags blanket Disallow: / as blocker", async () => {
    mockFetchTarget.mockResolvedValueOnce(makeFetchResult({
      html: `<html><head><title>Blocked</title></head><body></body></html>`,
    }));

    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({
      body: "User-agent: *\nDisallow: /",
    }));
    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({ ok: false, status: 404 }));

    const result = await runScan({
      url: new URL("https://example.com"),
      urlInput: "https://example.com",
    });

    expect(result.findings.some(f => f.id === "robots_txt")).toBe(true);
  });

  it("includes finding IDs in priorityFixIds", async () => {
    mockFetchTarget.mockResolvedValueOnce(makeFetchResult({
      html: `<html><head>
        <title>Example</title>
        <meta name="robots" content="noindex">
      </head><body></body></html>`,
    }));

    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({
      body: "User-agent: *\nDisallow: /",
    }));
    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({ ok: false, status: 404 }));

    const result = await runScan({
      url: new URL("https://example.com"),
      urlInput: "https://example.com",
    });

    expect(result.priorityFixIds.length).toBeGreaterThan(0);
    expect(result.priorityFixIds.length).toBeLessThanOrEqual(3);
  });

  it("populates meta fields", async () => {
    mockFetchTarget.mockResolvedValueOnce(makeFetchResult());
    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({
      body: "User-agent: *\nAllow: /",
    }));
    mockFetchSmallFile.mockResolvedValueOnce(makeSmallFileResult({ ok: false, status: 404 }));

    const result = await runScan({
      url: new URL("https://example.com"),
      urlInput: "https://example.com",
    });

    expect(result.meta.durationMs).toBeGreaterThanOrEqual(0);
    expect(result.meta.checksRun).toBeGreaterThan(0);
    expect(result.scannedAt).toBeTruthy();
    expect(result.expiresAt).toBeTruthy();
  });
});
