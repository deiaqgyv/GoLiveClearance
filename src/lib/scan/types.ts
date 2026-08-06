// ─── TECH_SPEC §2: Core Types ──────────────────────────────────────

/** go = CLEARED · hold = warnings only · no_go = has blockers */
export type Clearance = "go" | "hold" | "no_go";

export type Severity = "blocker" | "warning" | "pass" | "info";

export type CheckId =
  | "https_redirect"
  | "tls_cert"
  | "security_headers"
  | "robots_txt"
  | "sitemap"
  | "sitemap.dirty"
  | "noindex"
  | "title_description"
  | "canonical"
  | "open_graph"
  | "favicon"
  | "h1"
  | "preview_leak"
  | "trust_pages"
  | "analytics"
  | "placeholder_copy"
  | "platform_fingerprint";

export type StackHint = "nextjs" | "vercel" | "stripe" | "auth" | "generic";

export type Platform = "vercel" | "cloudflare" | "netlify" | "unknown";

export type FixStack = "html" | "nextjs" | "server" | "ai";

export interface FindingFix {
  label: string;
  language: "js" | "ts" | "txt" | "bash" | "html" | "nginx" | "java";
  code: string;
  stack: FixStack;
}

export interface Finding {
  id: CheckId | string; // sub-items use e.g. security_headers.hsts
  severity: Severity;
  title: string;
  summary: string; // accident language / current state
  impact?: string; // what will happen (required for blocker/warning)
  evidence?: string; // excerpt: header value, meta, etc. (truncated)
  /** Primary fix (platform-ordered). Prefer `fixes` in UI when present. */
  fix?: FindingFix;
  /** All stack variants — generic first unless host fingerprint says otherwise */
  fixes?: FindingFix[];
}

export interface ScanRequest {
  url: string;
  stack?: StackHint[];
  focus?: CheckId;
}

export interface ScanResult {
  id: string;
  clearance: Clearance;
  score: number;          // 0-100, subordinate to clearance
  urlInput: string;
  urlFinal: string;       // final URL after redirects
  scannedAt: string;      // ISO
  expiresAt: string;      // ISO, default +7d
  platform?: Platform;
  findings: Finding[];    // sorted: blocker → warning → pass
  priorityFixIds: string[]; // max 3, for "Fix these first"
  meta: {
    durationMs: number;
    checksRun: number;
  };
  summary: {
    blockers: number;
    warnings: number;
  };
}

// API error response shape
export interface ApiError {
  error: {
    code: "invalid_url" | "ssrf_blocked" | "rate_limited" | "fetch_failed" | "scan_timeout";
    message: string;
  };
}

// API success response = ScanResult + reportUrl
export interface ScanResponse extends ScanResult {
  reportUrl: string;
}
