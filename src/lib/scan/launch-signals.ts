// Launch-accident signal parsers (trust links, analytics, placeholders, preview hosts)

export type TrustKind = "privacy" | "terms" | "contact";

export interface TrustLink {
  kind: TrustKind;
  href: string;
  text: string;
}

export interface LaunchSignals {
  trustLinks: TrustLink[];
  hasAnalytics: boolean;
  analyticsEvidence: string;
  placeholders: string[];
  hrefHosts: string[];
}

const PREVIEW_HOST_SUFFIXES = [
  ".vercel.app",
  ".netlify.app",
  ".netlify.com",
  ".pages.dev",
  ".herokuapp.com",
  ".railway.app",
  ".onrender.com",
  ".fly.dev",
  ".web.app",
  ".firebaseapp.com",
  ".ngrok-free.app",
  ".ngrok.io",
  ".loca.lt",
  ".github.io",
];

const PREVIEW_HOST_EXACT = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
]);

const PLACEHOLDER_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /lorem\s+ipsum/i, label: "lorem ipsum" },
  { re: /\bTODO\b/, label: "TODO" },
  { re: /\bFIXME\b/, label: "FIXME" },
  { re: /your[\s-]?domain\.com/i, label: "yourdomain.com" },
  { re: /your[\s-]?company/i, label: "your company" },
  { re: /\[insert[^\]]*\]/i, label: "[insert …]" },
  { re: /coming\s+soon/i, label: "coming soon" },
  { re: /replace\s+this/i, label: "replace this" },
  { re: /placeholder\s+(text|copy|content)/i, label: "placeholder copy" },
  { re: /\bxxx\b/i, label: "xxx" },
];

const ANALYTICS_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /googletagmanager\.com/i, label: "Google Tag Manager" },
  { re: /google-analytics\.com|gtag\s*\(/i, label: "Google Analytics" },
  { re: /plausible\.io/i, label: "Plausible" },
  { re: /umami\.is|data-website-id/i, label: "Umami" },
  { re: /cdn\.usefathom\.com|fathom/i, label: "Fathom" },
  { re: /posthog\.com|posthog\.init/i, label: "PostHog" },
  { re: /mixpanel\.com/i, label: "Mixpanel" },
  { re: /segment\.(com|io)|analytics\.load/i, label: "Segment" },
  { re: /clarity\.ms/i, label: "Microsoft Clarity" },
  { re: /hotjar\.com/i, label: "Hotjar" },
  { re: /_vercel\/insights|va\.vercel-scripts/i, label: "Vercel Analytics" },
  { re: /static\.cloudflareinsights\.com/i, label: "Cloudflare Web Analytics" },
  { re: /goatcounter\.com/i, label: "GoatCounter" },
  { re: /simpleanalytics\.com/i, label: "Simple Analytics" },
  { re: /mmstat\.com|log\.mmstat|gm\.mmstat/i, label: "Alibaba mmstat" },
  { re: /hm\.baidu\.com|baidu\.com\/hm\.js/i, label: "Baidu Tongji" },
  { re: /cnzz\.com|zhugeio|growingio|sensorsdata/i, label: "CN analytics" },
  { re: /analytics\.tiktok\.com|facebook\.net\/.*fbevents/i, label: "Ad pixel" },
];

const TRUST_PATTERNS: Array<{ kind: TrustKind; re: RegExp }> = [
  { kind: "privacy", re: /privacy|数据保护|隐私/i },
  { kind: "terms", re: /terms|tos|legal|条件|条款|impressum/i },
  { kind: "contact", re: /contact|support|about|联系/i },
];

export function isPreviewHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (PREVIEW_HOST_EXACT.has(host)) return true;
  return PREVIEW_HOST_SUFFIXES.some(
    (suffix) => host === suffix.slice(1) || host.endsWith(suffix)
  );
}

export function previewHostReason(hostname: string): string | null {
  if (!isPreviewHost(hostname)) return null;
  return hostname.toLowerCase();
}

function resolveHref(href: string, baseUrl: string): string | null {
  const trimmed = href.trim();
  if (
    !trimmed ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("javascript:")
  ) {
    return null;
  }
  try {
    return new URL(trimmed, baseUrl).toString();
  } catch {
    return null;
  }
}

function stripNoise(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

export function parseLaunchSignals(html: string, baseUrl: string): LaunchSignals {
  const trustLinks: TrustLink[] = [];
  const seenTrust = new Set<string>();
  const hrefHosts = new Set<string>();

  const anchorRe =
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = anchorRe.exec(html)) !== null) {
    const rawHref = match[1];
    const text = match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const absolute = resolveHref(rawHref, baseUrl);
    if (!absolute) continue;

    try {
      hrefHosts.add(new URL(absolute).hostname);
    } catch {
      /* ignore */
    }

    const haystack = `${rawHref} ${text}`;
    for (const { kind, re } of TRUST_PATTERNS) {
      if (!re.test(haystack)) continue;
      const key = `${kind}:${absolute}`;
      if (seenTrust.has(key)) break;
      // Prefer one link per kind
      if (trustLinks.some((t) => t.kind === kind)) break;
      seenTrust.add(key);
      trustLinks.push({ kind, href: absolute, text: text || kind });
      break;
    }
  }

  const analyticsHits: string[] = [];
  for (const { re, label } of ANALYTICS_PATTERNS) {
    if (re.test(html)) analyticsHits.push(label);
  }

  const textSample = stripNoise(html);
  const placeholders: string[] = [];
  for (const { re, label } of PLACEHOLDER_PATTERNS) {
    if (re.test(html) || re.test(textSample)) {
      placeholders.push(label);
    }
  }

  return {
    trustLinks,
    hasAnalytics: analyticsHits.length > 0,
    analyticsEvidence:
      analyticsHits.length > 0
        ? `Detected: ${analyticsHits.slice(0, 3).join(", ")}`
        : "No common analytics snippet found in HTML",
    placeholders: [...new Set(placeholders)],
    hrefHosts: [...hrefHosts],
  };
}

/** Extract up to `limit` <loc> URLs from a sitemap or sitemap index. */
export function extractSitemapLocs(xml: string, limit = 20): string[] {
  const locs: string[] = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const loc = m[1].trim();
    if (!loc) continue;
    locs.push(loc);
    if (locs.length >= limit) break;
  }
  return locs;
}

export function collectPreviewLeaks(input: {
  pageUrl: string;
  canonical?: string;
  ogImage?: string;
  ogUrl?: string;
  hrefHosts?: string[];
}): Array<{ where: string; host: string }> {
  const leaks: Array<{ where: string; host: string }> = [];
  const seen = new Set<string>();

  const check = (where: string, raw?: string) => {
    if (!raw) return;
    try {
      const host = new URL(raw, input.pageUrl).hostname;
      const reason = previewHostReason(host);
      if (!reason) return;
      const key = `${where}:${reason}`;
      if (seen.has(key)) return;
      seen.add(key);
      leaks.push({ where, host: reason });
    } catch {
      /* ignore */
    }
  };

  check("page URL", input.pageUrl);
  check("canonical", input.canonical);
  check("og:image", input.ogImage);
  check("og:url", input.ogUrl);

  for (const host of input.hrefHosts ?? []) {
    const reason = previewHostReason(host);
    if (!reason) continue;
    const key = `link:${reason}`;
    if (seen.has(key)) continue;
    seen.add(key);
    leaks.push({ where: "internal link", host: reason });
  }

  return leaks;
}
