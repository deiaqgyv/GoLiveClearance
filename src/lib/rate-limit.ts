// Layered rate limiting: concurrency + burst + unique-host budget
// Cache hits and early rejects (invalid_url / ssrf) do not consume quota.

const MAX_CONCURRENT = 2;
const BURST_LIMIT = 10;
const BURST_WINDOW_MS = 60 * 1000;
const UNIQUE_HOST_LIMIT = 20;
const UNIQUE_HOST_WINDOW_MS = 60 * 60 * 1000;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

interface BurstEntry {
  count: number;
  resetAt: number;
}

interface HostBudgetEntry {
  hosts: Set<string>;
  resetAt: number;
}

const concurrentStore = new Map<string, number>();
const burstStore = new Map<string, BurstEntry>();
const hostBudgetStore = new Map<string, HostBudgetEntry>();
const cacheStore = new Map<string, { result: unknown; cachedAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of burstStore) {
    if (entry.resetAt < now) burstStore.delete(key);
  }
  for (const [key, entry] of hostBudgetStore) {
    if (entry.resetAt < now) hostBudgetStore.delete(key);
  }
  for (const [key, entry] of cacheStore) {
    if (entry.cachedAt + CACHE_TTL_MS < now) cacheStore.delete(key);
  }
}, 60 * 1000).unref?.();

export type RateLimitKind = "concurrency" | "burst" | "unique_host";

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  limit?: RateLimitKind;
  message?: string;
}

export function isRateLimitDisabled(): boolean {
  const flag = process.env.RATE_LIMIT_DISABLED;
  if (flag === "1" || flag === "true") return true;
  return process.env.NODE_ENV !== "production";
}

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.$/, "");
}

function formatRetryMinutes(seconds: number): string {
  const mins = Math.max(1, Math.ceil(seconds / 60));
  return `~${mins}m`;
}

/**
 * Reserve a scan slot for an uncached request.
 * Call releaseScanSlot() in a finally block after the scan finishes.
 */
export function acquireScanSlot(
  ip: string,
  hostname: string
): RateLimitResult {
  if (isRateLimitDisabled()) {
    return { allowed: true };
  }

  const now = Date.now();
  const host = normalizeHostname(hostname);

  // A. Concurrency
  const inFlight = concurrentStore.get(ip) || 0;
  if (inFlight >= MAX_CONCURRENT) {
    return {
      allowed: false,
      retryAfterSeconds: 8,
      limit: "concurrency",
      message:
        "A scan is already running for your connection. Wait for it to finish, then try again.",
    };
  }

  // B. Burst (uncached requests / minute)
  const burst = burstStore.get(ip);
  if (burst && burst.resetAt > now && burst.count >= BURST_LIMIT) {
    const retryAfterSeconds = Math.ceil((burst.resetAt - now) / 1000);
    return {
      allowed: false,
      retryAfterSeconds,
      limit: "burst",
      message: `Too many scans in a short time. Try again in ${formatRetryMinutes(retryAfterSeconds)}.`,
    };
  }

  // C. Unique-host budget (same host can be re-scanned freely)
  let budget = hostBudgetStore.get(ip);
  if (!budget || budget.resetAt <= now) {
    budget = { hosts: new Set(), resetAt: now + UNIQUE_HOST_WINDOW_MS };
    hostBudgetStore.set(ip, budget);
  }

  const knownHost = budget.hosts.has(host);
  if (!knownHost && budget.hosts.size >= UNIQUE_HOST_LIMIT) {
    const retryAfterSeconds = Math.ceil((budget.resetAt - now) / 1000);
    return {
      allowed: false,
      retryAfterSeconds,
      limit: "unique_host",
      message: `You've scanned ${UNIQUE_HOST_LIMIT} different sites this hour. Re-scan a URL you already checked, or try again in ${formatRetryMinutes(retryAfterSeconds)}.`,
    };
  }

  // Reserve slot
  concurrentStore.set(ip, inFlight + 1);

  if (burst && burst.resetAt > now) {
    burst.count += 1;
  } else {
    burstStore.set(ip, { count: 1, resetAt: now + BURST_WINDOW_MS });
  }

  if (!knownHost) {
    budget.hosts.add(host);
  }

  return { allowed: true };
}

export function releaseScanSlot(ip: string): void {
  if (isRateLimitDisabled()) return;

  const inFlight = concurrentStore.get(ip) || 0;
  if (inFlight <= 1) {
    concurrentStore.delete(ip);
  } else {
    concurrentStore.set(ip, inFlight - 1);
  }
}

export function getCachedResult(url: string, ip: string): unknown | null {
  const key = `${ip}:${url}`;
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (entry.cachedAt + CACHE_TTL_MS < Date.now()) {
    cacheStore.delete(key);
    return null;
  }
  return entry.result;
}

export function setCachedResult(
  url: string,
  ip: string,
  result: unknown
): void {
  const key = `${ip}:${url}`;
  cacheStore.set(key, { result, cachedAt: Date.now() });
}
