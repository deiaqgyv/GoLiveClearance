import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock dns before importing fetch-target
vi.mock("dns", () => ({
  promises: {
    resolve: vi.fn().mockResolvedValue(["93.184.216.34"]),
  },
}));

// We must import after vi.mock is set up
let fetchTarget: typeof import("../fetch-target").fetchTarget;
let fetchSmallFile: typeof import("../fetch-target").fetchSmallFile;

const mockFetch = vi.fn();
const originalFetch = globalThis.fetch;

beforeEach(async () => {
  // Dynamically re-import to get fresh module with mocks
  const mod = await import("../fetch-target");
  fetchTarget = mod.fetchTarget;
  fetchSmallFile = mod.fetchSmallFile;
  globalThis.fetch = mockFetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

// ─── fetchTarget ─────────────────────────────────────────────────────
describe("fetchTarget", () => {
  it("fetches a successful page", async () => {
    const html = "<html><head><title>OK</title></head><body>Hello</body></html>";
    mockFetch.mockResolvedValueOnce(
      new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      })
    );

    const result = await fetchTarget("https://example.com");
    expect(result.status).toBe(200);
    expect(result.html).toBe(html);
    expect(result.truncated).toBe(false);
    expect(result.urlFinal).toBe("https://example.com");
  });

  it("follows a redirect", async () => {
    // First response: 301 redirect
    mockFetch.mockResolvedValueOnce(
      new Response(null, {
        status: 301,
        headers: { Location: "https://example.org/final" },
      })
    );
    // Second response: 200 OK
    const html = "<html><head><title>Final</title></head></html>";
    mockFetch.mockResolvedValueOnce(
      new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      })
    );

    const result = await fetchTarget("https://example.com");
    expect(result.status).toBe(200);
    expect(result.html).toBe(html);
    expect(result.redirectChain).toEqual(["https://example.com"]);
  });

  it("throws on SSRF target (localhost)", async () => {
    await expect(fetchTarget("https://localhost")).rejects.toThrow();
  });

  it("detects Vercel platform from headers", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("<html></html>", {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "x-vercel-id": "abc123",
        },
      })
    );

    const result = await fetchTarget("https://example.com");
    expect(result.platform).toBe("vercel");
  });

  it("detects Cloudflare platform from headers", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("<html></html>", {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "cf-ray": "abc123",
        },
      })
    );

    const result = await fetchTarget("https://example.com");
    expect(result.platform).toBe("cloudflare");
  });

  it("detects Netlify platform from headers", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("<html></html>", {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "x-nf-request-id": "abc123",
        },
      })
    );

    const result = await fetchTarget("https://example.com");
    expect(result.platform).toBe("netlify");
  });

  it("returns unknown platform for generic headers", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("<html></html>", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      })
    );

    const result = await fetchTarget("https://example.com");
    expect(result.platform).toBe("unknown");
  });

  it("handles non-2xx status codes", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/html" },
      })
    );

    const result = await fetchTarget("https://example.com");
    expect(result.status).toBe(404);
  });
});

// ─── fetchSmallFile ─────────────────────────────────────────────────
describe("fetchSmallFile", () => {
  it("fetches a small file successfully", async () => {
    const content = "User-agent: *\nAllow: /";
    mockFetch.mockResolvedValueOnce(
      new Response(content, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      })
    );

    const result = await fetchSmallFile("https://example.com/robots.txt");
    expect(result.ok).toBe(true);
    expect(result.body).toBe(content);
    expect(result.contentType).toBe("text/plain");
  });

  it("handles 404 for small files", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      })
    );

    const result = await fetchSmallFile("https://example.com/robots.txt");
    expect(result.ok).toBe(false);
    expect(result.status).toBe(404);
  });

  it("follows redirects for small files", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(null, {
        status: 301,
        headers: { Location: "https://example.org/robots.txt" },
      })
    );
    mockFetch.mockResolvedValueOnce(
      new Response("User-agent: *\nAllow: /", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      })
    );

    const result = await fetchSmallFile("https://example.com/robots.txt");
    expect(result.ok).toBe(true);
    expect(result.urlFinal).toBe("https://example.org/robots.txt");
  });

  it("returns error for SSRF targets", async () => {
    const result = await fetchSmallFile("https://localhost/robots.txt");
    expect(result.ok).toBe(false);
  });

  it("handles network errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchSmallFile("https://example.com/robots.txt");
    expect(result.ok).toBe(false);
  });
});
