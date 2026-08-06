// TECH_SPEC §3: API contract
import { NextRequest, NextResponse } from "next/server";
import { runScan } from "@/lib/scan/run-scan";
import { checkSSRF } from "@/lib/scan/ssrf";
import { saveReport } from "@/lib/report-store";
import {
  acquireScanSlot,
  releaseScanSlot,
  getCachedResult,
  setCachedResult,
} from "@/lib/rate-limit";
import type { ScanResult } from "@/lib/scan/types";

// ─── URL normalization (TECH_SPEC §4) ───────────────────────────────────
function normalizeUrl(raw: string): {
  url: URL;
  error?: { code: string; message: string };
} {
  let input = raw.trim();

  // Auto-add https:// if no scheme
  if (!/^https?:\/\//i.test(input)) {
    input = `https://${input}`;
  }

  // Strip fragment
  const hashIndex = input.indexOf("#");
  if (hashIndex !== -1) {
    input = input.slice(0, hashIndex);
  }

  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    return {
      url: new URL("https://invalid"),
      error: {
        code: "invalid_url",
        message: `Invalid URL: "${raw}"`,
      },
    };
  }

  // Reject credentials in URL
  if (parsed.username || parsed.password) {
    return {
      url: parsed,
      error: {
        code: "invalid_url",
        message: "URLs with credentials are not allowed",
      },
    };
  }

  // Only allow http/https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      url: parsed,
      error: {
        code: "invalid_url",
        message: "Only http:// and https:// URLs are supported",
      },
    };
  }

  // Must have a hostname with a dot
  if (!parsed.hostname || !parsed.hostname.includes(".")) {
    return {
      url: parsed,
      error: {
        code: "invalid_url",
        message: "URL must contain a valid domain name",
      },
    };
  }

  return { url: parsed };
}

// ─── Error response helper ──────────────────────────────────────────────
function errorResponse(
  code: string,
  message: string,
  status: number
): NextResponse {
  return NextResponse.json(
    { error: { code, message } },
    { status }
  );
}

// ─── POST /api/scan ─────────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Parse body
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse("invalid_url", "Invalid JSON body", 400);
  }

  const rawUrl = body.url;
  if (!rawUrl || typeof rawUrl !== "string") {
    return errorResponse("invalid_url", "Missing or invalid 'url' field", 400);
  }

  // Normalize URL
  const { url, error } = normalizeUrl(rawUrl);
  if (error) {
    return errorResponse(error.code, error.message, 400);
  }

  // SSRF check
  const ssrfResult = await checkSSRF(url);
  if (!ssrfResult.allowed) {
    return errorResponse(
      "ssrf_blocked",
      ssrfResult.reason || "URL blocked by security policy",
      400
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Cache hit: reuse result, do not consume rate-limit quota
  const cached = getCachedResult(url.toString(), ip) as ScanResult | null;
  if (cached) {
    const { id, expiresAt, token } = saveReport(cached);
    const domain = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const reportUrl = `${protocol}://${domain}/report/${id}?t=${encodeURIComponent(token)}`;

    return NextResponse.json({
      ...cached,
      id,
      reportId: id,
      reportUrl,
      reportToken: token,
      expiresAt,
    });
  }

  // Layered rate limit (concurrency + burst + unique-host budget)
  const rateLimitResult = acquireScanSlot(ip, url.hostname);
  if (!rateLimitResult.allowed) {
    return new NextResponse(
      JSON.stringify({
        error: {
          code: "rate_limited",
          message:
            rateLimitResult.message ||
            "Rate limit exceeded. Please try again later.",
        },
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimitResult.retryAfterSeconds || 60),
        },
      }
    );
  }

  // Run scan with 8s timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const result = await runScan({
      url,
      urlInput: rawUrl,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    setCachedResult(url.toString(), ip, result);

    const { id, expiresAt, token } = saveReport(result);
    const domain = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const reportUrl = `${protocol}://${domain}/report/${id}?t=${encodeURIComponent(token)}`;

    return NextResponse.json({
      ...result,
      id,
      reportId: id,
      reportUrl,
      reportToken: token,
      expiresAt,
    });
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      return errorResponse(
        "scan_timeout",
        "Scan timed out after 8 seconds",
        504
      );
    }

    if (err instanceof Error && err.message.includes("fetch")) {
      return errorResponse(
        "fetch_failed",
        `Could not reach the target URL: ${err.message}`,
        502
      );
    }

    return errorResponse(
      "scan_timeout",
      "An unexpected error occurred during scan",
      504
    );
  } finally {
    releaseScanSlot(ip);
  }
}
