import { describe, expect, it } from "vitest";
import { applyScanFocus, isScanFocus } from "../focus";
import type { Finding, ScanResult } from "../types";

function makeResult(findings: Finding[]): ScanResult {
  return {
    id: "r_TEST123",
    clearance: "hold",
    score: 80,
    urlInput: "example.com",
    urlFinal: "https://example.com/",
    scannedAt: "2026-08-19T00:00:00.000Z",
    expiresAt: "2026-08-26T00:00:00.000Z",
    findings,
    priorityFixIds: findings.map((finding) => finding.id),
    meta: { durationMs: 100, checksRun: 17 },
    summary: { blockers: 0, warnings: findings.length },
  };
}

describe("focused scan results", () => {
  it("accepts only registered focus values", () => {
    expect(isScanFocus("canonical")).toBe(true);
    expect(isScanFocus("everything")).toBe(false);
  });

  it("keeps only findings related to the requested check", () => {
    const result = applyScanFocus(makeResult([
      { id: "canonical", severity: "warning", title: "Canonical", summary: "Missing" },
      { id: "analytics", severity: "warning", title: "Analytics", summary: "Missing" },
    ]), "canonical");

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].id).toBe("canonical");
    expect(result.focusLabel).toBe("Canonical URL");
    expect(result.meta.checksRun).toBe(1);
    expect(result.clearance).toBe("hold");
  });

  it("returns an explicit pass when the focused issue is absent", () => {
    const result = applyScanFocus(makeResult([
      { id: "analytics", severity: "warning", title: "Analytics", summary: "Missing" },
    ]), "noindex");

    expect(result.findings).toEqual([
      expect.objectContaining({ id: "noindex", severity: "pass" }),
    ]);
    expect(result.score).toBe(100);
    expect(result.clearance).toBe("go");
    expect(result.priorityFixIds).toEqual([]);
  });

  it("includes preview leaks in canonical and Open Graph reports", () => {
    const source = makeResult([
      { id: "preview_leak", severity: "blocker", title: "Preview", summary: "Leaked" },
    ]);
    expect(applyScanFocus(source, "canonical").findings).toHaveLength(1);
    expect(applyScanFocus(source, "open_graph").findings).toHaveLength(1);
  });
});
