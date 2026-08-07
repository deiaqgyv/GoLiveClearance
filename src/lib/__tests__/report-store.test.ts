import { describe, it, expect } from "vitest";
import {
  encodeReportToken,
  decodeReportToken,
  saveReport,
  getReport,
} from "../report-store";
import type { ScanResult } from "../scan/types";

function makeScanResult(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    id: "",
    clearance: "go",
    score: 100,
    urlInput: "https://example.com",
    urlFinal: "https://example.com",
    scannedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    platform: "unknown",
    findings: [],
    priorityFixIds: [],
    meta: { durationMs: 500, checksRun: 10 },
    summary: { blockers: 0, warnings: 0 },
    ...overrides,
  };
}

// ─── Token roundtrip ────────────────────────────────────────────────────
describe("encodeReportToken / decodeReportToken", () => {
  it("round-trips a basic ScanResult", () => {
    const result = makeScanResult({ id: "r_ABCD1234" });
    const token = encodeReportToken(result);
    expect(token).toMatch(/^v1\./);

    const decoded = decodeReportToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded!.id).toBe("r_ABCD1234");
    expect(decoded!.clearance).toBe("go");
    expect(decoded!.score).toBe(100);
  });

  it("round-trips with findings", () => {
    const result = makeScanResult({
      id: "r_FINDINGS1",
      clearance: "no_go",
      score: 45,
      findings: [
        {
          id: "noindex",
          severity: "blocker",
          title: "noindex",
          summary: "Page has noindex",
        },
        {
          id: "sitemap",
          severity: "warning",
          title: "Sitemap",
          summary: "Missing sitemap",
        },
      ],
    });

    const token = encodeReportToken(result);
    const decoded = decodeReportToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded!.clearance).toBe("no_go");
    expect(decoded!.findings.length).toBe(2);
    expect(decoded!.findings[0].id).toBe("noindex");
  });

  it("rejects tampered token", () => {
    const result = makeScanResult({ id: "r_TAMPER" });
    const token = encodeReportToken(result);
    const parts = token.split(".");

    // Corrupt the payload
    const tampered = `${parts[0]}.${parts[1].slice(0, -2)}XX.${parts[2]}`;
    const decoded = decodeReportToken(tampered);
    expect(decoded).toBeNull();
  });

  it("rejects token with wrong version", () => {
    const decoded = decodeReportToken("v2.something.else");
    expect(decoded).toBeNull();
  });

  it("rejects malformed token", () => {
    expect(decodeReportToken("not-a-token")).toBeNull();
    expect(decodeReportToken("")).toBeNull();
    expect(decodeReportToken("v1...")).toBeNull();
  });

  it("attaches fixes when decoding", () => {
    const result = makeScanResult({
      id: "r_FIXTEST",
      findings: [
        {
          id: "noindex",
          severity: "blocker",
          title: "noindex",
          summary: "Has noindex",
        },
      ],
    });

    const token = encodeReportToken(result);
    const decoded = decodeReportToken(token);
    expect(decoded).not.toBeNull();
    // Fixes should be re-attached from the fixes library
    expect(decoded!.findings[0].fixes).toBeDefined();
    expect(decoded!.findings[0].fixes!.length).toBeGreaterThan(0);
  });
});

// ─── Memory store ────────────────────────────────────────────────────────
describe("saveReport / getReport", () => {
  it("saves and retrieves by ID", () => {
    const result = makeScanResult();
    const { id, token } = saveReport(result);

    const report = getReport(id, token);
    expect(report).not.toBeNull();
    expect(report!.result.id).toBe(id);
  });

  it("retrieves by token only", () => {
    const result = makeScanResult();
    const { id, token } = saveReport(result);

    const report = getReport(id, token);
    expect(report).not.toBeNull();
  });

  it("returns null for non-existent ID without token", () => {
    const report = getReport("r_NONEXISTENT");
    expect(report).toBeNull();
  });

  it("returns null for mismatched token+id", () => {
    const result = makeScanResult();
    const { id: id1, token } = saveReport(result);
    const result2 = makeScanResult();
    const { id: id2 } = saveReport(result2);

    // Token for id1 should not match id2
    const report = getReport(id2, token);
    expect(report).toBeNull();
  });
});
