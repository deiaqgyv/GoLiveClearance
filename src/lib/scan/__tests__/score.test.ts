import { describe, it, expect } from "vitest";
import {
  computeScore,
  computeClearance,
  getPriorityFixIds,
} from "../score";
import type { Finding } from "../types";

function makeFinding(overrides: Partial<Finding> = {}): Finding {
  return {
    id: "test",
    severity: "warning",
    title: "Test",
    summary: "Test finding",
    ...overrides,
  };
}

// ─── computeClearance ───────────────────────────────────────────────────
describe("computeClearance", () => {
  it("returns 'go' when no findings", () => {
    expect(computeClearance([])).toBe("go");
  });

  it("returns 'go' when all pass", () => {
    const findings: Finding[] = [
      makeFinding({ id: "a", severity: "pass" }),
      makeFinding({ id: "b", severity: "pass" }),
    ];
    expect(computeClearance(findings)).toBe("go");
  });

  it("returns 'hold' when only warnings", () => {
    const findings: Finding[] = [
      makeFinding({ id: "a", severity: "warning" }),
      makeFinding({ id: "b", severity: "pass" }),
    ];
    expect(computeClearance(findings)).toBe("hold");
  });

  it("returns 'no_go' when any blocker exists", () => {
    const findings: Finding[] = [
      makeFinding({ id: "a", severity: "warning" }),
      makeFinding({ id: "b", severity: "blocker" }),
      makeFinding({ id: "c", severity: "pass" }),
    ];
    expect(computeClearance(findings)).toBe("no_go");
  });

  it("returns 'no_go' with multiple blockers", () => {
    const findings: Finding[] = [
      makeFinding({ id: "a", severity: "blocker" }),
      makeFinding({ id: "b", severity: "blocker" }),
    ];
    expect(computeClearance(findings)).toBe("no_go");
  });
});

// ─── computeScore ───────────────────────────────────────────────────────
describe("computeScore", () => {
  it("starts at 100 with no findings", () => {
    expect(computeScore([])).toBe(100);
  });

  it("deducts 25 per blocker", () => {
    const findings: Finding[] = [
      makeFinding({ id: "a", severity: "blocker" }),
    ];
    expect(computeScore(findings)).toBe(75);
  });

  it("deducts 5 per non-security warning", () => {
    const findings: Finding[] = [
      makeFinding({ id: "sitemap", severity: "warning" }),
    ];
    expect(computeScore(findings)).toBe(95);
  });

  it("caps security header deduction at -10", () => {
    const findings: Finding[] = [
      makeFinding({ id: "security_headers", severity: "warning" }),
    ];
    // Security headers: flat -10, not -5
    expect(computeScore(findings)).toBe(90);
  });

  it("security_headers.hsts also gets capped deduction", () => {
    const findings: Finding[] = [
      makeFinding({ id: "security_headers.hsts", severity: "warning" }),
    ];
    expect(computeScore(findings)).toBe(90);
  });

  it("multiple security header sub-items still only deduct 10 total", () => {
    const findings: Finding[] = [
      makeFinding({ id: "security_headers", severity: "warning" }),
      makeFinding({ id: "security_headers.csp", severity: "warning" }),
    ];
    // Two security warnings should still be -10 total, not -20
    expect(computeScore(findings)).toBe(90);
  });

  it("mixed blockers and warnings", () => {
    const findings: Finding[] = [
      makeFinding({ id: "noindex", severity: "blocker" }),
      makeFinding({ id: "robots_txt", severity: "blocker" }),
      makeFinding({ id: "sitemap", severity: "warning" }),
    ];
    // 2 blockers: -50, 1 warning: -5 → 45
    expect(computeScore(findings)).toBe(45);
  });

  it("score never goes below 0", () => {
    const findings: Finding[] = Array(5)
      .fill(null)
      .map((_, i) => makeFinding({ id: `b${i}`, severity: "blocker" }));
    // 5 × -25 = -125, but clamped to 0
    expect(computeScore(findings)).toBe(0);
  });

  it("full pass = 100", () => {
    const findings: Finding[] = [
      makeFinding({ id: "a", severity: "pass" }),
      makeFinding({ id: "b", severity: "info" }),
    ];
    expect(computeScore(findings)).toBe(100);
  });
});

// ─── getPriorityFixIds ──────────────────────────────────────────────────
describe("getPriorityFixIds", () => {
  it("returns max 3 ids", () => {
    const findings: Finding[] = Array(6)
      .fill(null)
      .map((_, i) => makeFinding({ id: `w${i}`, severity: "warning" }));
    const ids = getPriorityFixIds(findings);
    expect(ids.length).toBeLessThanOrEqual(3);
  });

  it("blockers come before warnings", () => {
    const findings: Finding[] = [
      makeFinding({ id: "warning1", severity: "warning" }),
      makeFinding({ id: "blocker1", severity: "blocker" }),
      makeFinding({ id: "warning2", severity: "warning" }),
    ];
    const ids = getPriorityFixIds(findings);
    expect(ids[0]).toBe("blocker1");
  });

  it("launch-accident warnings rank before security headers", () => {
    const findings: Finding[] = [
      makeFinding({ id: "security_headers", severity: "warning" }),
      makeFinding({ id: "noindex", severity: "warning" }),
      makeFinding({ id: "robots_txt", severity: "warning" }),
    ];
    const ids = getPriorityFixIds(findings);
    // noindex (rank 1) and robots_txt (rank 2) before security_headers (rank 90)
    expect(ids).toEqual(["noindex", "robots_txt", "security_headers"]);
  });

  it("returns empty when all pass", () => {
    const findings: Finding[] = [
      makeFinding({ id: "a", severity: "pass" }),
    ];
    expect(getPriorityFixIds(findings)).toEqual([]);
  });
});
