import { describe, it, expect, beforeEach } from "vitest";
import {
  acquireScanSlot,
  releaseScanSlot,
  getCachedResult,
  setCachedResult,
  isRateLimitDisabled,
} from "../rate-limit";

// Force rate limiting on for tests
beforeEach(() => {
  process.env.NODE_ENV = "production";
  process.env.RATE_LIMIT_DISABLED = "0";
});

describe("isRateLimitDisabled", () => {
  it("returns true when RATE_LIMIT_DISABLED=1", () => {
    process.env.RATE_LIMIT_DISABLED = "1";
    expect(isRateLimitDisabled()).toBe(true);
  });

  it("returns true in development", () => {
    process.env.NODE_ENV = "development";
    process.env.RATE_LIMIT_DISABLED = "0";
    expect(isRateLimitDisabled()).toBe(true);
  });

  it("returns false in production without override", () => {
    process.env.NODE_ENV = "production";
    process.env.RATE_LIMIT_DISABLED = "0";
    expect(isRateLimitDisabled()).toBe(false);
  });
});

describe("acquireScanSlot + releaseScanSlot", () => {
  it("allows first request", () => {
    const result = acquireScanSlot("1.2.3.4", "example.com");
    expect(result.allowed).toBe(true);
    releaseScanSlot("1.2.3.4");
  });

  it("rejects concurrent requests beyond MAX_CONCURRENT (2)", () => {
    const r1 = acquireScanSlot("5.6.7.8", "example.com");
    expect(r1.allowed).toBe(true);

    const r2 = acquireScanSlot("5.6.7.8", "other.com");
    expect(r2.allowed).toBe(true);

    const r3 = acquireScanSlot("5.6.7.8", "third.com");
    expect(r3.allowed).toBe(false);
    expect(r3.limit).toBe("concurrency");

    // Cleanup
    releaseScanSlot("5.6.7.8");
    releaseScanSlot("5.6.7.8");
  });

  it("allows after release", () => {
    acquireScanSlot("9.9.9.9", "example.com");
    acquireScanSlot("9.9.9.9", "other.com");
    releaseScanSlot("9.9.9.9");

    const r3 = acquireScanSlot("9.9.9.9", "third.com");
    expect(r3.allowed).toBe(true);

    releaseScanSlot("9.9.9.9");
    releaseScanSlot("9.9.9.9");
  });

  it("same host can be re-scanned freely (unique host budget)", () => {
    // First acquire
    acquireScanSlot("10.0.0.1", "same-site.com");
    releaseScanSlot("10.0.0.1");

    // Re-scan same host
    const r = acquireScanSlot("10.0.0.1", "same-site.com");
    expect(r.allowed).toBe(true);
    releaseScanSlot("10.0.0.1");
  });

  it("different IPs have independent limits", () => {
    const r1 = acquireScanSlot("1.1.1.1", "example.com");
    const r2 = acquireScanSlot("2.2.2.2", "example.com");
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);

    releaseScanSlot("1.1.1.1");
    releaseScanSlot("2.2.2.2");
  });
});

describe("cache", () => {
  it("stores and retrieves cached result", () => {
    setCachedResult("https://example.com", "1.2.3.4", { clearance: "go" });
    const cached = getCachedResult("https://example.com", "1.2.3.4");
    expect(cached).toEqual({ clearance: "go" });
  });

  it("returns null for non-existent cache", () => {
    const cached = getCachedResult("https://not-exist.com", "1.2.3.4");
    expect(cached).toBeNull();
  });

  it("returns null for different IP", () => {
    setCachedResult("https://example.com", "1.2.3.4", { clearance: "go" });
    const cached = getCachedResult("https://example.com", "5.6.7.8");
    expect(cached).toBeNull();
  });
});
