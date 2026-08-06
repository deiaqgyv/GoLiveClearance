// TECH_SPEC §7: Report storage with r_ prefix IDs and 7-day TTL
// Use globalThis so Next.js API route + RSC share one Map in dev/prod single-process.
import type { ScanResult } from "./scan/types";

const REPORT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

interface StoredReport {
  result: ScanResult;
  createdAt: string;
  expiresAt: string;
}

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

export function saveReport(result: ScanResult): { id: string; expiresAt: string } {
  ensureCleanup();
  const store = getStore();
  const id = generateId();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + REPORT_TTL_MS);

  store.map.set(id, {
    result,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });

  return { id, expiresAt: expiresAt.toISOString() };
}

export function getReport(
  id: string
): { result: ScanResult; createdAt: string; expiresAt: string } | null {
  ensureCleanup();
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
