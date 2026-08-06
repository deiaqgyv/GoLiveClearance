// TECH_SPEC §6: Target Fetch
import { assertSafeUrl, validateRedirectTarget, SSRFError } from "./ssrf";
import type { Platform } from "./types";

const OVERALL_DEADLINE_MS = 8000;
const SINGLE_REQUEST_TIMEOUT_MS = 5000;
const MAX_REDIRECTS = 5;
const MAX_HTML_SIZE = 512 * 1024; // 512KB
const MAX_SMALL_FILE_SIZE = 256 * 1024; // 256KB for robots/sitemap

const UA = "GoLiveClearanceBot/1.0 (+https://golive-clearance.app/methodology)";

export interface FetchResult {
  urlInput: string;
  urlFinal: string;
  status: number;
  headers: Headers;
  html: string;
  truncated: boolean;
  platform: Platform;
  redirectChain: string[];
}

export interface SmallFileResult {
  ok: boolean;
  status: number;
  body: string;
  truncated: boolean;
  urlFinal: string;
  contentType: string;
}

function detectPlatform(headers: Headers): Platform {
  if (headers.get("x-vercel-id") || headers.get("x-vercel-cache")) return "vercel";
  if (headers.get("cf-ray")) return "cloudflare";
  if (headers.get("x-nf-request-id")) return "netlify";
  return "unknown";
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = SINGLE_REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: "manual",
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,*/*",
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function readBodyWithLimit(
  res: Response,
  maxSize: number
): Promise<{ body: string; truncated: boolean }> {
  const reader = res.body?.getReader();
  if (!reader) return { body: "", truncated: false };

  const decoder = new TextDecoder();
  let body = "";
  let truncated = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      body += decoder.decode(value, { stream: true });
      if (body.length > maxSize) {
        body = body.slice(0, maxSize);
        truncated = true;
        reader.cancel();
        break;
      }
    }
  } catch {
    truncated = true;
  }

  return { body, truncated };
}

// Main fetch: follows redirects with SSRF check on each hop
export async function fetchTarget(inputUrl: string): Promise<FetchResult> {
  const overallStart = Date.now();
  const redirectChain: string[] = [];
  let currentUrl = inputUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    // Check overall deadline
    if (Date.now() - overallStart > OVERALL_DEADLINE_MS) {
      throw new Error("Scan timed out.");
    }

    // SSRF check
    const parsed = new URL(currentUrl);
    await assertSafeUrl(parsed);

    const remainingMs = Math.max(
      1000,
      OVERALL_DEADLINE_MS - (Date.now() - overallStart)
    );
    const timeoutMs = Math.min(SINGLE_REQUEST_TIMEOUT_MS, remainingMs);

    const res = await fetchWithTimeout(currentUrl, {}, timeoutMs);

    // Handle redirects
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) {
        return buildResult(inputUrl, currentUrl, res, "", false, redirectChain);
      }

      const target = validateRedirectTarget(location, new URL(currentUrl));
      redirectChain.push(currentUrl);
      currentUrl = target.toString();

      if (hop === MAX_REDIRECTS) {
        throw new Error("Too many redirects.");
      }
      continue;
    }

    // Read body with size limit
    const { body, truncated } = await readBodyWithLimit(res, MAX_HTML_SIZE);
    return buildResult(inputUrl, currentUrl, res, body, truncated, redirectChain);
  }

  throw new Error("Too many redirects.");
}

function buildResult(
  urlInput: string,
  urlFinal: string,
  res: Response,
  html: string,
  truncated: boolean,
  redirectChain: string[]
): FetchResult {
  return {
    urlInput,
    urlFinal,
    status: res.status,
    headers: res.headers,
    html,
    truncated,
    platform: detectPlatform(res.headers),
    redirectChain,
  };
}

// Fetch small files (robots.txt, sitemap, favicon probe) — follows redirects with SSRF checks
export async function fetchSmallFile(
  url: string,
  maxSize: number = MAX_SMALL_FILE_SIZE
): Promise<SmallFileResult> {
  let currentUrl = url;

  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const parsed = new URL(currentUrl);
      await assertSafeUrl(parsed);

      const res = await fetchWithTimeout(currentUrl, {}, SINGLE_REQUEST_TIMEOUT_MS);

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) {
          return {
            ok: false,
            status: res.status,
            body: "",
            truncated: false,
            urlFinal: currentUrl,
            contentType: "",
          };
        }
        currentUrl = validateRedirectTarget(location, new URL(currentUrl)).toString();
        if (hop === MAX_REDIRECTS) {
          return {
            ok: false,
            status: res.status,
            body: "",
            truncated: false,
            urlFinal: currentUrl,
            contentType: "",
          };
        }
        continue;
      }

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        return {
          ok: false,
          status: res.status,
          body: "",
          truncated: false,
          urlFinal: currentUrl,
          contentType,
        };
      }

      const { body, truncated } = await readBodyWithLimit(res, maxSize);
      return {
        ok: true,
        status: res.status,
        body,
        truncated,
        urlFinal: currentUrl,
        contentType,
      };
    }

    return {
      ok: false,
      status: 0,
      body: "",
      truncated: false,
      urlFinal: currentUrl,
      contentType: "",
    };
  } catch {
    return {
      ok: false,
      status: 0,
      body: "",
      truncated: false,
      urlFinal: currentUrl,
      contentType: "",
    };
  }
}

