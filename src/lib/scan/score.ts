// TECH_SPEC §9.3: Scoring + clearance + priority ranking
import type { Finding, Clearance } from "./types";

/** Lower = fix sooner. Security headers intentionally last. */
const PRIORITY_RANK: Record<string, number> = {
  https_redirect: 0,
  noindex: 1,
  robots_txt: 2,
  preview_leak: 3,
  "trust_pages.broken": 10,
  canonical: 11,
  open_graph: 12,
  "trust_pages.missing": 13,
  "sitemap.dirty": 14,
  sitemap: 15,
  h1: 16,
  "title_description.title": 20,
  "title_description.description": 21,
  placeholder_copy: 22,
  favicon: 30,
  analytics: 35,
  security_headers: 90,
};

function priorityRank(id: string): number {
  if (id.startsWith("security_headers")) return 90;
  return PRIORITY_RANK[id] ?? 50;
}

export function computeScore(findings: Finding[]): number {
  let score = 100;
  let securityDeduction = 0;

  for (const f of findings) {
    if (f.severity === "blocker") {
      score -= 25;
    } else if (f.severity === "warning") {
      if (f.id === "security_headers" || f.id.startsWith("security_headers.")) {
        // Merged security headers: flat -10 max (don't dominate the score)
        securityDeduction = Math.max(securityDeduction, 10);
      } else {
        score -= 5;
      }
    }
  }

  score -= securityDeduction;
  return Math.max(0, score);
}

/**
 * Three-state clearance:
 * - no_go (DENIED): any blocker → don't ship
 * - hold (HOLD): no blockers but warnings → shipable after priority fixes
 * - go (CLEARED): clean
 */
export function computeClearance(findings: Finding[]): Clearance {
  if (findings.some((f) => f.severity === "blocker")) return "no_go";
  if (findings.some((f) => f.severity === "warning")) return "hold";
  return "go";
}

/** Top 3: blockers first, then launch-accident warnings — never lead with CSP. */
export function getPriorityFixIds(findings: Finding[]): string[] {
  return findings
    .filter((f) => f.severity === "blocker" || f.severity === "warning")
    .sort((a, b) => {
      const sev =
        (a.severity === "blocker" ? 0 : 1) - (b.severity === "blocker" ? 0 : 1);
      if (sev !== 0) return sev;
      return priorityRank(a.id) - priorityRank(b.id);
    })
    .slice(0, 3)
    .map((f) => f.id);
}
