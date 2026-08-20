import type { Finding, ScanFocus, ScanResult } from "./types";

interface FocusDefinition {
  label: string;
  matches: (finding: Finding) => boolean;
  passSummary: string;
}

export const FOCUS_DEFINITIONS: Record<ScanFocus, FocusDefinition> = {
  title: { label: "Title tag", matches: (f) => f.id === "title_description.title", passSummary: "A descriptive title tag is present and within the launch-check range." },
  description: { label: "Meta description", matches: (f) => f.id === "title_description.description", passSummary: "A meta description is present and within the launch-check range." },
  h1: { label: "H1 heading", matches: (f) => f.id === "h1", passSummary: "The page has a primary H1 heading." },
  canonical: { label: "Canonical URL", matches: (f) => f.id === "canonical" || f.id === "preview_leak", passSummary: "A canonical URL is present with no detected preview-host leak." },
  noindex: { label: "Indexability", matches: (f) => f.id === "noindex", passSummary: "No meta robots or X-Robots-Tag noindex directive was detected." },
  robots_txt: { label: "robots.txt", matches: (f) => f.id === "robots_txt", passSummary: "robots.txt is reachable and does not block the complete site." },
  sitemap: { label: "XML sitemap", matches: (f) => f.id === "sitemap" || f.id === "sitemap.dirty", passSummary: "A reachable sitemap was detected with no sampled launch issue." },
  favicon: { label: "Favicon", matches: (f) => f.id === "favicon", passSummary: "A favicon link or valid /favicon.ico was detected." },
  open_graph: { label: "Open Graph", matches: (f) => f.id === "open_graph" || f.id === "preview_leak", passSummary: "Core Open Graph tags are present with no detected preview-host leak." },
  https_redirect: { label: "SSL / HTTPS", matches: (f) => f.id === "https_redirect" || f.id === "tls_cert", passSummary: "The final page URL is served over HTTPS." },
  security_headers: { label: "Security headers", matches: (f) => f.id === "security_headers" || f.id.startsWith("security_headers."), passSummary: "All launch-check security headers were detected." },
};

export function isScanFocus(value: unknown): value is ScanFocus {
  return typeof value === "string" && value in FOCUS_DEFINITIONS;
}

export function applyScanFocus(result: ScanResult, focus: ScanFocus): ScanResult {
  const definition = FOCUS_DEFINITIONS[focus];
  const matchingFindings = result.findings.filter(definition.matches);
  const findings: Finding[] = matchingFindings.length
    ? matchingFindings
    : [{ id: focus, severity: "pass", title: definition.label, summary: definition.passSummary, evidence: `Focused ${definition.label} check passed` }];
  const blockers = findings.filter((finding) => finding.severity === "blocker").length;
  const warnings = findings.filter((finding) => finding.severity === "warning").length;

  return {
    ...result,
    focus,
    focusLabel: definition.label,
    clearance: blockers > 0 ? "no_go" : warnings > 0 ? "hold" : "go",
    score: Math.max(0, 100 - blockers * 25 - warnings * 5),
    findings,
    priorityFixIds: findings
      .filter((finding) => finding.severity === "blocker" || finding.severity === "warning")
      .slice(0, 3)
      .map((finding) => finding.id),
    meta: { ...result.meta, checksRun: 1 },
    summary: { blockers, warnings },
  };
}
