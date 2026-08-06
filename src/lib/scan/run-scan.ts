// TECH_SPEC §9: Main scan orchestrator
import type { Finding, ScanResult, Platform } from "./types";
import { fetchTarget, fetchSmallFile } from "./fetch-target";
import { parseHtml, parseRobotsTxt, isTitleTooShort, isTitleTooLong } from "./parse-html";
import { attachFixes } from "./fixes";
import { computeScore, computeClearance, getPriorityFixIds } from "./score";
import {
  parseLaunchSignals,
  collectPreviewLeaks,
  extractSitemapLocs,
  isPreviewHost,
  type TrustLink,
} from "./launch-signals";

interface RunScanInput {
  url: URL;
  urlInput: string;
  signal?: AbortSignal;
}

export async function runScan(input: RunScanInput): Promise<ScanResult> {
  const { url, urlInput } = input;
  const findings: Finding[] = [];
  const startTime = Date.now();
  let platform: Platform = "unknown";
  let urlFinal = url.toString();

  try {
    // ─── Fetch main page ──────────────────────────────────────────────
    const fetchResult = await fetchTarget(url.toString());

    urlFinal = fetchResult.urlFinal;
    platform = fetchResult.platform;

    // Convert Headers to Record
    const headers: Record<string, string> = {};
    fetchResult.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // ─── HTTPS check (use final URL after redirects) ──────────────────
    let finalProtocol = url.protocol;
    try {
      finalProtocol = new URL(urlFinal).protocol;
    } catch {
      /* keep input protocol */
    }
    if (finalProtocol !== "https:") {
      findings.push({
        id: "https_redirect",
        severity: "blocker",
        title: "HTTPS",
        summary: "Site is served over HTTP, not HTTPS",
        impact:
          "Browsers mark HTTP sites as 'Not Secure'. Users lose trust immediately; Google penalizes ranking.",
        evidence: `Final URL scheme is ${finalProtocol}`,
        ...attachFixes("https_redirect", platform),
      });
    }

    // ─── Security headers ─────────────────────────────────────────────
    checkSecurityHeaders(headers, findings, platform);

    // ─── Parse HTML ───────────────────────────────────────────────────
    const meta = parseHtml(fetchResult.html);
    const signals = parseLaunchSignals(fetchResult.html, urlFinal);

    // ─── robots.txt ───────────────────────────────────────────────────
    const robotsInfo = await checkRobotsTxt(url, findings, platform);

    // ─── noindex (meta + X-Robots-Tag header) ─────────────────────────
    const xRobots = (headers["x-robots-tag"] || "").toLowerCase();
    const headerNoindex = xRobots.includes("noindex");
    if (meta.noindex || headerNoindex) {
      findings.push({
        id: "noindex",
        severity: "blocker",
        title: "noindex",
        summary: headerNoindex
          ? "Production response sends X-Robots-Tag: noindex"
          : "Page has <meta name='robots' content='noindex'>",
        impact:
          "Search engines will NOT index this page. Shipping with noindex means you launch invisible to Google.",
        evidence: headerNoindex
          ? `X-Robots-Tag: ${headers["x-robots-tag"]}`
          : meta.robots
            ? `robots meta: "${meta.robots}"`
            : "noindex detected",
        ...attachFixes("noindex", platform),
      });
    }

    // ─── title + description ──────────────────────────────────────────
    if (!meta.title) {
      findings.push({
        id: "title_description.title",
        severity: "warning",
        title: "Title",
        summary: "Missing <title> tag",
        impact:
          "Browser tab shows 'Untitled'. Search results display a generic URL. Users skip it.",
        evidence: "No <title> found in HTML",
        ...attachFixes("title_description.title", platform),
      });
    } else if (isTitleTooShort(meta.title) || isTitleTooLong(meta.title)) {
      const charCount = [...meta.title].length;
      findings.push({
        id: "title_description.title",
        severity: "warning",
        title: "Title",
        summary: isTitleTooLong(meta.title)
          ? `<title> is long (${charCount} chars) — may truncate in SERPs`
          : `<title> is very short (${charCount} chars)`,
        impact:
          "Weak titles reduce clarity in search results and browser tabs.",
        evidence: `Title: "${meta.title}" (${charCount} chars)`,
        ...attachFixes("title_description.title", platform),
      });
    }

    if (!meta.description) {
      findings.push({
        id: "title_description.description",
        severity: "warning",
        title: "Description",
        summary: "Missing meta description",
        impact:
          "Google auto-generates a snippet from page text. It's usually worse than what you'd write.",
        evidence: "No <meta name='description'> found",
        ...attachFixes("title_description.description", platform),
      });
    } else if (meta.description.length < 50 || meta.description.length > 160) {
      findings.push({
        id: "title_description.description",
        severity: "warning",
        title: "Description",
        summary: `Meta description is ${meta.description.length} chars (ideal: 50-160)`,
        impact:
          "Too short: misses SERP real estate. Too long: gets truncated.",
        evidence: `Description: "${meta.description.slice(0, 80)}..." (${meta.description.length} chars)`,
        ...attachFixes("title_description.description", platform),
      });
    }

    // ─── H1 ───────────────────────────────────────────────────────────
    if (!meta.h1) {
      findings.push({
        id: "h1",
        severity: "warning",
        title: "H1",
        summary: "No <h1> found on the homepage",
        impact:
          "Without a clear H1, crawlers and users lack a primary topic anchor — common on JS-heavy shells that forget semantic headings.",
        evidence: "No <h1> element in HTML",
        ...attachFixes("h1", platform),
      });
    }

    // ─── canonical ────────────────────────────────────────────────────
    if (!meta.canonical) {
      findings.push({
        id: "canonical",
        severity: "warning",
        title: "Canonical",
        summary: "Missing <link rel='canonical'>",
        impact:
          "Search engines may index multiple URL variants (www/non-www, with/without trailing slash). SEO value splits between them.",
        evidence: "No canonical link found",
        ...attachFixes("canonical", platform),
      });
    }

    // ─── Open Graph ───────────────────────────────────────────────────
    const ogMissing: string[] = [];
    if (!meta.ogTitle) ogMissing.push("og:title");
    if (!meta.ogDescription) ogMissing.push("og:description");
    if (!meta.ogImage) ogMissing.push("og:image");

    if (ogMissing.length > 0) {
      findings.push({
        id: "open_graph",
        severity: "warning",
        title: "Open Graph",
        summary: `Missing Open Graph tags: ${ogMissing.join(", ")}`,
        impact:
          "When shared on Twitter/Slack/iMessage, the link preview looks broken or generic. Clicks drop.",
        evidence: `Missing: ${ogMissing.join(", ")}`,
        ...attachFixes("open_graph", platform),
      });
    }

    // ─── Favicon (HTML link + /favicon.ico probe) ─────────────────────
    let hasFavicon = Boolean(meta.faviconHref);
    if (!hasFavicon) {
      try {
        const iconUrl = new URL("/favicon.ico", urlFinal).toString();
        const iconResult = await fetchSmallFile(iconUrl);
        if (
          iconResult.ok &&
          iconResult.status === 200 &&
          !/text\/html/i.test(iconResult.contentType)
        ) {
          hasFavicon = true;
        }
      } catch {
        /* ignore */
      }
    }
    if (!hasFavicon) {
      findings.push({
        id: "favicon",
        severity: "warning",
        title: "Favicon",
        summary: "No favicon found",
        impact:
          "Browser tab shows a blank icon. Looks unprofessional. Bookmarks are hard to find.",
        evidence:
          "No <link rel='icon'>, apple-touch-icon, or valid /favicon.ico",
        ...attachFixes("favicon", platform),
      });
    }

    // ─── Preview / staging host leaks ─────────────────────────────────
    checkPreviewLeaks(urlFinal, meta, signals.hrefHosts, findings, platform);

    // ─── Placeholder copy ─────────────────────────────────────────────
    if (signals.placeholders.length > 0) {
      findings.push({
        id: "placeholder_copy",
        severity: "warning",
        title: "Placeholder copy",
        summary: `Homepage still contains placeholder text: ${signals.placeholders.slice(0, 3).join(", ")}`,
        impact:
          "Launch visitors notice unfinished copy instantly. Looks like a staging build shipped by mistake.",
        evidence: `Matched: ${signals.placeholders.join(", ")}`,
        ...attachFixes("placeholder_copy", platform),
      });
    }

    // ─── Analytics ────────────────────────────────────────────────────
    if (!signals.hasAnalytics) {
      findings.push({
        id: "analytics",
        severity: "warning",
        title: "Analytics",
        summary: "No analytics snippet detected on the homepage",
        impact:
          "You will not know if Product Hunt / ads / launch emails converted. Flying blind on day one.",
        evidence: signals.analyticsEvidence,
        ...attachFixes("analytics", platform),
      });
    }

    // ─── Trust pages (privacy / terms / contact) ──────────────────────
    await checkTrustPages(signals.trustLinks, findings, platform);

    // ─── Sitemap (+ dirty URL / soft-404 spot-check) ──────────────────
    await checkSitemap(url, robotsInfo, findings, platform);

    return buildResult({
      urlInput,
      urlFinal,
      findings,
      platform,
      startTime,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      findings.push({
        id: "https_redirect",
        severity: "blocker",
        title: "HTTPS",
        summary: "Scan timed out (8s limit)",
        impact:
          "The site took too long to respond. Users will bounce; search engines will de-rank.",
        evidence: "Timeout after 8000ms",
        ...attachFixes("https_redirect", platform),
      });
      return buildResult({
        urlInput,
        urlFinal,
        findings,
        platform,
        startTime,
      });
    }
    throw err;
  }
}

// ─── Preview leaks ──────────────────────────────────────────────────────
function checkPreviewLeaks(
  urlFinal: string,
  meta: { canonical: string; ogImage: string; ogUrl: string },
  hrefHosts: string[],
  findings: Finding[],
  platform: Platform
): void {
  const leaks = collectPreviewLeaks({
    pageUrl: urlFinal,
    canonical: meta.canonical || undefined,
    ogImage: meta.ogImage || undefined,
    ogUrl: meta.ogUrl || undefined,
    hrefHosts,
  });

  if (leaks.length === 0) return;

  let pageHost = "";
  try {
    pageHost = new URL(urlFinal).hostname;
  } catch {
    /* ignore */
  }

  const pageIsPreview = pageHost ? isPreviewHost(pageHost) : false;
  const metaLeaks = leaks.filter((l) => l.where !== "page URL");
  const severity =
    !pageIsPreview && metaLeaks.some((l) => l.where === "canonical")
      ? ("blocker" as const)
      : ("warning" as const);

  const evidence = leaks
    .slice(0, 5)
    .map((l) => `${l.where} → ${l.host}`)
    .join("\n");

  findings.push({
    id: "preview_leak",
    severity,
    title: "Preview domain",
    summary: pageIsPreview
      ? `You're clearing a preview host (${pageHost}) — not a production domain`
      : `Staging / preview host leaked into ${metaLeaks[0]?.where ?? "page signals"}`,
    impact: pageIsPreview
      ? "Sharing a *.vercel.app / *.netlify.app URL for launch means the wrong host gets indexed, bookmarked, and linked."
      : "Canonical or OG pointing at a preview host sends Google and social crawlers to the wrong deploy. Classic launch-day SEO own-goal.",
    evidence,
    ...attachFixes("preview_leak", platform),
  });
}

// ─── Trust pages ────────────────────────────────────────────────────────
async function checkTrustPages(
  trustLinks: TrustLink[],
  findings: Finding[],
  platform: Platform
): Promise<void> {
  const kinds = new Set(trustLinks.map((t) => t.kind));
  const missing: string[] = [];
  if (!kinds.has("privacy")) missing.push("Privacy");
  if (!kinds.has("terms")) missing.push("Terms");
  if (!kinds.has("contact")) missing.push("Contact");

  if (missing.length >= 2) {
    findings.push({
      id: "trust_pages.missing",
      severity: "warning",
      title: "Trust pages",
      summary: `Homepage is missing trust links: ${missing.join(", ")}`,
      impact:
        "Indie SaaS launches without Privacy / Terms look unfinished. Paid users bounce; App Store / ads reviewers flag it.",
      evidence: `Found links: ${
        trustLinks.length
          ? trustLinks.map((t) => t.kind).join(", ")
          : "none"
      }`,
      ...attachFixes("trust_pages.missing", platform),
    });
  }

  const toCheck = trustLinks.slice(0, 3);
  if (toCheck.length === 0) return;

  const results = await Promise.all(
    toCheck.map(async (link) => {
      const result = await fetchSmallFile(link.href);
      return { link, result };
    })
  );

  const broken = results.filter(
    ({ result }) => !result.ok || result.status >= 400
  );

  if (broken.length > 0) {
    findings.push({
      id: "trust_pages.broken",
      severity: "warning",
      title: "Trust pages",
      summary: `${broken.length} trust link${broken.length === 1 ? "" : "s"} return an error`,
      impact:
        "Footer says Privacy Policy — click gets 404. Worse than missing the link: looks careless on launch day.",
      evidence: broken
        .map(
          ({ link, result }) =>
            `${link.kind}: ${link.href} → HTTP ${result.status || "error"}`
        )
        .join("\n"),
      ...attachFixes("trust_pages.broken", platform),
    });
  }
}

// ─── Security headers check (merged — never floods Top 3) ───────────────
function checkSecurityHeaders(
  headers: Record<string, string>,
  findings: Finding[],
  platform: Platform
): void {
  const missing: string[] = [];

  if (!headers["strict-transport-security"]) {
    missing.push("Strict-Transport-Security");
  }
  if (!headers["content-security-policy"]) {
    missing.push("Content-Security-Policy");
  }
  if (
    !headers["x-frame-options"] ||
    !/^(deny|sameorigin)$/i.test(headers["x-frame-options"])
  ) {
    missing.push("X-Frame-Options");
  }
  if (!headers["x-content-type-options"]) {
    missing.push("X-Content-Type-Options");
  }
  if (!headers["referrer-policy"]) {
    missing.push("Referrer-Policy");
  }
  if (!headers["permissions-policy"]) {
    missing.push("Permissions-Policy");
  }

  if (missing.length === 0) return;

  findings.push({
    id: "security_headers",
    severity: "warning",
    title: "Security headers",
    summary: `Missing ${missing.length} basic security header${missing.length === 1 ? "" : "s"}`,
    impact:
      "Won't block launch by itself, but browsers and security scanners expect these. Fix after indexing / OG / trust blockers.",
    evidence: `Missing: ${missing.join(", ")}`,
    ...attachFixes("security_headers", platform),
  });
}

// ─── robots.txt check ───────────────────────────────────────────────────
async function checkRobotsTxt(
  baseUrl: URL,
  findings: Finding[],
  platform: Platform
): Promise<{ sitemapUrl?: string; hasSitemapDirective: boolean; robotsOk: boolean }> {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl);
    const result = await fetchSmallFile(robotsUrl.toString());

    if (!result.ok && result.status === 404) {
      findings.push({
        id: "robots_txt",
        severity: "warning",
        title: "robots.txt",
        summary: "No robots.txt found (404)",
        impact:
          "Crawlers use default behavior (crawl everything). You can't block sensitive paths or point to your sitemap.",
        evidence: "GET /robots.txt returned 404",
        ...attachFixes("robots_txt.missing", platform),
      });
      return { hasSitemapDirective: false, robotsOk: false };
    }

    if (!result.ok) {
      findings.push({
        id: "robots_txt",
        severity: "warning",
        title: "robots.txt",
        summary: `robots.txt returned HTTP ${result.status}`,
        impact:
          "Crawlers may not be able to read your robots.txt. Sitemap reference may be missed.",
        evidence: `GET /robots.txt returned ${result.status}`,
        ...attachFixes("robots_txt.missing", platform),
      });
      return { hasSitemapDirective: false, robotsOk: false };
    }

    const parsed = parseRobotsTxt(result.body);

    if (parsed.hasBlanketDisallow) {
      findings.push({
        id: "robots_txt",
        severity: "blocker",
        title: "robots.txt",
        summary: "robots.txt blocks all crawlers (Disallow: /)",
        impact:
          "Google, Bing, and all search engines are blocked. Your site will NOT appear in search results.",
        evidence: result.body.slice(0, 300),
        ...attachFixes("robots_txt.blocked", platform),
      });
    }

    return {
      sitemapUrl: parsed.sitemapUrl || undefined,
      hasSitemapDirective: Boolean(parsed.sitemapUrl),
      robotsOk: true,
    };
  } catch {
    findings.push({
      id: "robots_txt",
      severity: "warning",
      title: "robots.txt",
      summary: "Could not fetch robots.txt",
      impact:
        "Unable to verify crawl rules. Search engines may be blocked or misdirected.",
      evidence: "Network error fetching /robots.txt",
      ...attachFixes("robots_txt.missing", platform),
    });
    return { hasSitemapDirective: false, robotsOk: false };
  }
}

function isSoft404Sitemap(
  body: string,
  urlFinal: string,
  contentType: string,
  baseHost: string
): boolean {
  const locs = extractSitemapLocs(body, 5);
  if (locs.length > 0) return false;

  const lower = body.slice(0, 4000).toLowerCase();
  if (/text\/html/i.test(contentType)) return true;
  if (lower.includes("<!doctype html") || lower.includes("<html")) return true;

  try {
    const finalHost = new URL(urlFinal).hostname;
    if (finalHost !== baseHost && /error|404|notfound/i.test(urlFinal + lower)) {
      return true;
    }
  } catch {
    /* ignore */
  }

  const looksXml =
    lower.includes("<urlset") ||
    lower.includes("<sitemapindex") ||
    lower.includes("<?xml");
  return !looksXml;
}

// ─── Sitemap check ──────────────────────────────────────────────────────
async function checkSitemap(
  baseUrl: URL,
  robotsInfo: { sitemapUrl?: string; hasSitemapDirective: boolean; robotsOk: boolean },
  findings: Finding[],
  platform: Platform
): Promise<void> {
  const candidates = [
    robotsInfo.sitemapUrl,
    new URL("/sitemap.xml", baseUrl).toString(),
    new URL("/sitemap-index.xml", baseUrl).toString(),
    new URL("/sitemap/0.xml", baseUrl).toString(),
  ].filter((u): u is string => Boolean(u));

  let body = "";
  let foundUrl = "";
  let urlFinal = "";
  let contentType = "";

  for (const candidate of candidates) {
    try {
      const result = await fetchSmallFile(candidate);
      if (result.ok && result.body) {
        body = result.body;
        foundUrl = candidate;
        urlFinal = result.urlFinal || candidate;
        contentType = result.contentType || "";
        break;
      }
    } catch {
      // continue
    }
  }

  if (!foundUrl) {
    const robotsNote = robotsInfo.robotsOk && !robotsInfo.hasSitemapDirective
      ? "robots.txt has no Sitemap: directive. "
      : "";
    findings.push({
      id: "sitemap",
      severity: "warning",
      title: "Sitemap",
      summary: "No usable sitemap.xml found",
      impact:
        "Search engines may miss pages that aren't linked from the homepage. Sitemaps help crawlers discover your full site structure.",
      evidence: `${robotsNote}Checked robots Sitemap directive + /sitemap.xml, /sitemap-index.xml, /sitemap/0.xml — all missing or unreachable`,
      ...attachFixes("sitemap", platform),
    });
    return;
  }

  if (isSoft404Sitemap(body, urlFinal, contentType, baseUrl.hostname)) {
    findings.push({
      id: "sitemap",
      severity: "warning",
      title: "Sitemap",
      summary: "sitemap.xml looks like an empty or soft-404 page",
      impact:
        "A 200 response that isn't a real sitemap wastes crawl budget and confuses Search Console — common when CDNs rewrite missing paths to HTML error pages.",
      evidence: `Requested: ${foundUrl}\nFinal: ${urlFinal}\nContent-Type: ${contentType || "unknown"}\nNo <loc> entries; body does not look like a sitemap.`,
      ...attachFixes("sitemap", platform),
    });
    return;
  }

  if (robotsInfo.robotsOk && !robotsInfo.hasSitemapDirective) {
    findings.push({
      id: "sitemap",
      severity: "warning",
      title: "Sitemap",
      summary: "robots.txt does not declare a Sitemap:",
      impact:
        "Crawlers may still find /sitemap.xml eventually, but discovery is slower without an explicit robots Sitemap directive.",
      evidence: `Sitemap file reachable at ${urlFinal || foundUrl}, but robots.txt has no Sitemap: line`,
      ...attachFixes("sitemap", platform),
    });
  }

  const locs = extractSitemapLocs(body, 25);
  if (locs.length === 0) {
    findings.push({
      id: "sitemap.dirty",
      severity: "warning",
      title: "Sitemap",
      summary: "Sitemap has no URL entries",
      impact:
        "An empty sitemap does not help crawlers discover launch pages.",
      evidence: `Sitemap: ${urlFinal || foundUrl}\nNo <loc> URLs found`,
      ...attachFixes("sitemap.dirty", platform),
    });
    return;
  }

  const dirtyPreview: string[] = [];
  for (const loc of locs) {
    try {
      const host = new URL(loc).hostname;
      if (isPreviewHost(host)) dirtyPreview.push(loc);
    } catch {
      /* ignore */
    }
  }

  const spotTargets = locs
    .filter((loc) => {
      try {
        return !isPreviewHost(new URL(loc).hostname);
      } catch {
        return false;
      }
    })
    .slice(0, 2);

  const noindexHits: string[] = [];
  await Promise.all(
    spotTargets.map(async (loc) => {
      const result = await fetchSmallFile(loc);
      if (!result.ok || !result.body) return;
      const pageMeta = parseHtml(result.body);
      if (pageMeta.noindex) {
        noindexHits.push(loc);
      }
    })
  );

  if (dirtyPreview.length === 0 && noindexHits.length === 0) return;

  const evidenceParts: string[] = [];
  if (dirtyPreview.length) {
    evidenceParts.push(
      `Preview hosts in sitemap (${dirtyPreview.length}):\n${dirtyPreview
        .slice(0, 5)
        .join("\n")}`
    );
  }
  if (noindexHits.length) {
    evidenceParts.push(
      `Sitemap URLs with noindex:\n${noindexHits.join("\n")}`
    );
  }

  findings.push({
    id: "sitemap.dirty",
    severity: "warning",
    title: "Sitemap",
    summary: dirtyPreview.length
      ? "Sitemap lists preview / staging URLs"
      : "Sitemap lists pages that send noindex",
    impact:
      "Search Console gets polluted with the wrong host or pages you told crawlers to ignore. Wastes crawl budget on launch week.",
    evidence: `Sitemap: ${urlFinal || foundUrl}\n${evidenceParts.join("\n\n")}`,
    ...attachFixes("sitemap.dirty", platform),
  });
}

// ─── Build result ───────────────────────────────────────────────────────
interface BuildResultInput {
  urlInput: string;
  urlFinal: string;
  findings: Finding[];
  platform: Platform;
  startTime: number;
}

function buildResult(input: BuildResultInput): ScanResult {
  const { urlInput, urlFinal, findings, platform, startTime } = input;

  const severityOrder: Record<string, number> = {
    blocker: 0,
    warning: 1,
    info: 2,
    pass: 3,
  };

  // Match priority ranking so the full log also leads with launch accidents
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

  const rank = (id: string) =>
    id.startsWith("security_headers")
      ? 90
      : (PRIORITY_RANK[id] ?? 50);

  findings.sort((a, b) => {
    const sev =
      (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9);
    if (sev !== 0) return sev;
    return rank(a.id) - rank(b.id);
  });

  const clearance = computeClearance(findings);
  const score = computeScore(findings);
  const priorityFixIds = getPriorityFixIds(findings);

  const blockers = findings.filter((f) => f.severity === "blocker").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;

  return {
    id: "",
    urlInput,
    urlFinal,
    clearance,
    score,
    findings,
    priorityFixIds,
    platform,
    scannedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    meta: {
      durationMs: Date.now() - startTime,
      checksRun: findings.length,
    },
    summary: { blockers, warnings },
  };
}
