import { promises as dns } from "dns";
import { URL } from "url";
import net from "net";

// TECH_SPEC §5: SSRF Protection
// For every URL (including each redirect hop), validate:
// 1. scheme ∈ {http, https}
// 2. host is not localhost / *.local
// 3. DNS resolve → get A/AAAA records
// 4. Reject if any address is private/link-local/metadata
// 5. Reject redirect to file:/data:/other schemes

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
  "169.254.169.254", // AWS metadata
  "metadata.google.internal",
  "metadata.goog",
]);

const BLOCKED_HOST_SUFFIXES = [
  ".local",
  ".internal",
  ".localhost",
  ".example",
  ".invalid",
];

// Cloud metadata hostnames
const METADATA_HOSTNAMES = new Set([
  "169.254.169.254",
  "metadata.google.internal",
  "metadata.goog",
  "k8s-metadata-server",
]);

export class SSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SSRFError";
  }
}

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return false;
  }
  // 127.0.0.0/8
  if (parts[0] === 127) return true;
  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 169.254.0.0/16 (link-local)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0
  if (parts[0] === 0 && parts[1] === 0 && parts[2] === 0 && parts[3] === 0)
    return true;
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  // ::1 loopback
  if (lower === "::1" || lower === "0000:0000:0000:0000:0000:0000:0000:0001")
    return true;
  // :: unspecified
  if (lower === "::" || lower === "0000:0000:0000:0000:0000:0000:0000:0000")
    return true;
  // fc00::/7 unique local
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  // fe80::/10 link-local
  if (lower.startsWith("fe8") || lower.startsWith("fe9") ||
      lower.startsWith("fea") || lower.startsWith("feb")) return true;
  // IPv4-mapped IPv6
  if (lower.startsWith("::ffff:")) {
    const v4 = lower.slice(7);
    return isPrivateIPv4(v4);
  }
  return false;
}

function isPrivateIP(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  if (net.isIPv6(ip)) return isPrivateIPv6(ip);
  return false;
}

function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(lower)) return true;
  if (METADATA_HOSTNAMES.has(lower)) return true;
  for (const suffix of BLOCKED_HOST_SUFFIXES) {
    if (lower.endsWith(suffix)) return true;
  }
  return false;
}

async function resolveAndCheck(hostname: string): Promise<void> {
  // Check hostname-level blocks first
  if (isBlockedHostname(hostname)) {
    throw new SSRFError("URL is not allowed.");
  }

  // If it's already an IP literal, check directly
  if (net.isIP(hostname)) {
    if (isPrivateIP(hostname)) {
      throw new SSRFError("URL is not allowed.");
    }
    return;
  }

  // DNS resolve
  try {
    const records = await dns.resolve(hostname);
    if (!records || records.length === 0) {
      throw new SSRFError("Could not resolve hostname.");
    }
    for (const addr of records) {
      if (isPrivateIP(addr)) {
        throw new SSRFError("URL is not allowed.");
      }
    }
  } catch (err) {
    if (err instanceof SSRFError) throw err;
    throw new SSRFError("Could not resolve hostname.");
  }
}

// TECH_SPEC §4: URL Normalization
export function normalizeUrl(raw: string): URL {
  let input = raw.trim();

  // Auto-add https:// if no scheme
  if (!input.includes("://")) {
    input = "https://" + input;
  }

  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error("Invalid URL format.");
  }

  // Only http/https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http and https URLs are supported.");
  }

  // Strip fragment
  parsed.hash = "";

  // Reject credentials
  if (parsed.username || parsed.password) {
    throw new Error("URLs with credentials are not allowed.");
  }

  // Reject empty host
  if (!parsed.hostname) {
    throw new Error("URL must have a valid host.");
  }

  // Host lowercase (URL constructor does this already)
  return parsed;
}

// Main SSRF assertion: validate URL + DNS
export async function assertSafeUrl(url: URL): Promise<void> {
  // Scheme check
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new SSRFError("URL is not allowed.");
  }

  // Hostname check
  if (isBlockedHostname(url.hostname)) {
    throw new SSRFError("URL is not allowed.");
  }

  // DNS resolve and IP check
  await resolveAndCheck(url.hostname);
}

// Validate redirect target URL
export function validateRedirectTarget(location: string, baseUrl: URL): URL {
  let target: URL;
  try {
    target = new URL(location, baseUrl);
  } catch {
    throw new SSRFError("Invalid redirect URL.");
  }

  // Reject non-http(s) schemes
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    throw new SSRFError("Redirect to non-HTTP scheme is not allowed.");
  }

  return target;
}

// Wrapper for API route usage
export async function checkSSRF(url: URL): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  try {
    await assertSafeUrl(url);
    return { allowed: true };
  } catch (err) {
    if (err instanceof SSRFError) {
      return { allowed: false, reason: err.message };
    }
    return { allowed: false, reason: "URL blocked by security policy" };
  }
}
