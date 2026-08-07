import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  normalizeUrl,
  assertSafeUrl,
  validateRedirectTarget,
  checkSSRF,
  SSRFError,
} from "../ssrf";

// ─── normalizeUrl ──────────────────────────────────────────────────────
describe("normalizeUrl", () => {
  it("adds https:// when no scheme", () => {
    const url = normalizeUrl("example.com");
    expect(url.href).toBe("https://example.com/");
  });

  it("preserves https://", () => {
    const url = normalizeUrl("https://example.com/path");
    expect(url.protocol).toBe("https:");
    expect(url.pathname).toBe("/path");
  });

  it("preserves http://", () => {
    const url = normalizeUrl("http://example.com");
    expect(url.protocol).toBe("http:");
  });

  it("strips fragment", () => {
    const url = normalizeUrl("https://example.com/page#section");
    expect(url.hash).toBe("");
  });

  it("rejects credentials in URL", () => {
    expect(() => normalizeUrl("https://user:pass@example.com")).toThrow(
      "credentials"
    );
  });

  it("rejects empty host", () => {
    // https:///path parses hostname as 'path' in Node, test with truly empty host
    expect(() => normalizeUrl("https://")).toThrow();
  });

  it("rejects non-http schemes", () => {
    expect(() => normalizeUrl("ftp://example.com")).toThrow("http");
  });

  it("rejects javascript: scheme", () => {
    expect(() => normalizeUrl("javascript:alert(1)")).toThrow();
  });

  it("rejects file: scheme", () => {
    expect(() => normalizeUrl("file:///etc/passwd")).toThrow();
  });

  it("trims whitespace", () => {
    const url = normalizeUrl("  https://example.com  ");
    expect(url.hostname).toBe("example.com");
  });

  it("lowercases host", () => {
    const url = normalizeUrl("https://EXAMPLE.COM");
    expect(url.hostname).toBe("example.com");
  });

  it("preserves path and query", () => {
    const url = normalizeUrl("https://example.com/path?q=1&r=2");
    expect(url.pathname).toBe("/path");
    expect(url.search).toBe("?q=1&r=2");
  });
});

// ─── SSRF hostname checks (no DNS needed) ───────────────────────────────
describe("SSRF hostname blocking", () => {
  const blockedHosts = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "169.254.169.254",
    "metadata.google.internal",
    "metadata.goog",
    "test.local",
    "app.internal",
    "dev.localhost",
    "example.invalid",
    "test.example",
  ];

  for (const host of blockedHosts) {
    it(`blocks ${host}`, async () => {
      // ::1 is an invalid URL hostname for new URL(), use hostname-level check
      if (host === "::1") {
        const url = new URL("http://[::1]");
        await expect(assertSafeUrl(url)).rejects.toThrow(SSRFError);
        return;
      }
      const url = new URL(`http://${host}`);
      await expect(assertSafeUrl(url)).rejects.toThrow(SSRFError);
    });
  }
});

// ─── SSRF private IP checks (via DNS mock) ─────────────────────────────
describe("SSRF private IP blocking", () => {
  it("blocks 10.x.x.x (Class A private)", async () => {
    vi.doMock("dns", () => ({
      promises: { resolve: vi.fn().mockResolvedValue(["10.0.0.1"]) },
    }));
    // We test the underlying isPrivateIP via checkSSRF wrapper
    const { checkSSRF: check } = await import("../ssrf");
    const url = new URL("http://internal.example.com");
    const result = await check(url);
    expect(result.allowed).toBe(false);
    vi.doUnmock("dns");
  });
});

// ─── validateRedirectTarget ─────────────────────────────────────────────
describe("validateRedirectTarget", () => {
  const base = new URL("https://example.com/page");

  it("accepts valid https redirect", () => {
    const target = validateRedirectTarget("https://other.com/path", base);
    expect(target.protocol).toBe("https:");
    expect(target.hostname).toBe("other.com");
  });

  it("accepts relative redirect", () => {
    const target = validateRedirectTarget("/other", base);
    expect(target.pathname).toBe("/other");
  });

  it("rejects file: redirect", () => {
    expect(() => validateRedirectTarget("file:///etc/passwd", base)).toThrow(
      SSRFError
    );
  });

  it("rejects data: redirect", () => {
    expect(() =>
      validateRedirectTarget("data:text/html,<h1>evil</h1>", base)
    ).toThrow(SSRFError);
  });

  it("rejects javascript: redirect", () => {
    expect(() =>
      validateRedirectTarget("javascript:alert(1)", base)
    ).toThrow();
  });
});

// ─── checkSSRF wrapper ──────────────────────────────────────────────────
describe("checkSSRF", () => {
  it("returns allowed: false for localhost", async () => {
    const result = await checkSSRF(new URL("http://localhost"));
    expect(result.allowed).toBe(false);
    expect(result.reason).toBeTruthy();
  });

  it("returns allowed: false for 127.0.0.1", async () => {
    const result = await checkSSRF(new URL("http://127.0.0.1"));
    expect(result.allowed).toBe(false);
  });
});
