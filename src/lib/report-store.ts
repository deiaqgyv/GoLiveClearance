// TECH_SPEC §7: Report storage — signed compressed token (no KV required)
// Payload lives in the shareable URL so serverless instances don't need shared memory.
import { createHmac, timingSafeEqual } from "node:crypto";
import { deflateSync, inflateSync } from "node:zlib";
import { attachFixes } from "./scan/fixes";
import type { Finding, ScanResult } from "./scan/types";

const REPORT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
/** Optional override; baked-in default so prod works without external credentials. */
const HMAC_SECRET =
  process.env.REPORT_HMAC_SECRET ||
  "go-live-clearance-report-hmac-v1-unguessable-links";

interface StoredReport {
  result: ScanResult;
  createdAt: string;
  expiresAt: string;
}

type CompactFinding = Omit<Finding, "fix" | "fixes">;

type CompactResult = Omit<ScanResult, "findings"> & {
  findings: CompactFinding[];
};

type GlobalStore = {
  map: Map<string, StoredReport>;
  cleanupStarted?: boolean;
};

function getStore(): GlobalStore {
  const g = globalThis as typeof globalThis & {
    __goLiveReportStore?: GlobalStore;
  };
  if (!g.__goLiveReportStore) {
    g.__goLiveReportStore = { map: new Map() };
  }
  return g.__goLiveReportStore;
}

function ensureCleanup(): void {
  const store = getStore();
  if (store.cleanupStarted) return;
  store.cleanupStarted = true;
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [id, report] of store.map) {
      if (new Date(report.expiresAt).getTime() < now) {
        store.map.delete(id);
      }
    }
  }, CLEANUP_INTERVAL_MS);
  timer.unref?.();
}

function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous chars (0/O, 1/I)
  let id = "r_";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function compactResult(result: ScanResult): CompactResult {
  return {
    ...result,
    findings: result.findings.map(({ fix: _f, fixes: _fs, ...rest }) => rest),
  };
}

function expandResult(compact: CompactResult): ScanResult {
  return {
    ...compact,
    findings: compact.findings.map((f) => ({
      ...f,
      ...attachFixes(f.id, compact.platform),
    })),
  };
}

function sign(data: Buffer): Buffer {
  return createHmac("sha256", HMAC_SECRET).update(data).digest();
}

/** Encode a shareable report token: v1.<deflate-b64url>.<hmac-b64url> */
export function encodeReportToken(result: ScanResult): string {
  const json = Buffer.from(JSON.stringify(compactResult(result)), "utf8");
  const compressed = deflateSync(json, { level: 9 });
  const sig = sign(compressed);
  return `v1.${compressed.toString("base64url")}.${sig.toString("base64url")}`;
}

/** Decode + verify token; returns null if forged, corrupt, or expired. */
export function decodeReportToken(token: string): ScanResult | null {
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;

  try {
    const compressed = Buffer.from(parts[1], "base64url");
    const sig = Buffer.from(parts[2], "base64url");
    const expected = sign(compressed);
    if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) {
      return null;
    }

    const compact = JSON.parse(
      inflateSync(compressed).toString("utf8")
    ) as CompactResult;

    if (
      !compact?.id ||
      !compact.expiresAt ||
      !Array.isArray(compact.findings)
    ) {
      return null;
    }

    if (new Date(compact.expiresAt).getTime() < Date.now()) {
      return null;
    }

    return expandResult(compact);
  } catch {
    return null;
  }
}

export function saveReport(
  result: ScanResult
): { id: string; expiresAt: string; token: string } {
  ensureCleanup();
  const store = getStore();
  const id = generateId();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + REPORT_TTL_MS).toISOString();

  const withMeta: ScanResult = {
    ...result,
    id,
    expiresAt,
  };

  store.map.set(id, {
    result: withMeta,
    createdAt: now.toISOString(),
    expiresAt,
  });

  return { id, expiresAt, token: encodeReportToken(withMeta) };
}

export function getReport(
  id: string,
  token?: string | null
): { result: ScanResult; createdAt: string; expiresAt: string } | null {
  ensureCleanup();

  // Prefer signed token — works across serverless instances.
  // If a token is present but invalid, do not silently fall back to memory
  // (avoids inconsistent share links that sometimes work on one instance).
  if (token) {
    const decoded = decodeReportToken(token);
    if (!decoded || decoded.id !== id) return null;

    const store = getStore();
    if (!store.map.has(id)) {
      store.map.set(id, {
        result: decoded,
        createdAt: decoded.scannedAt,
        expiresAt: decoded.expiresAt,
      });
    }
    return {
      result: decoded,
      createdAt: decoded.scannedAt,
      expiresAt: decoded.expiresAt,
    };
  }

  // Same-process memory fallback (dev / sticky instance, no ?t=)
  const store = getStore();
  const report = store.map.get(id);
  if (!report) return null;

  if (new Date(report.expiresAt).getTime() < Date.now()) {
    store.map.delete(id);
    return null;
  }

  return report;
}

export function getStoreSize(): number {
  return getStore().map.size;
}
