// Lightweight HTML meta tag parser (no external deps)

export interface ParsedMeta {
  title: string;
  description: string;
  robots: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  faviconHref: string;
  h1: string;
  noindex: boolean;
}

function extractMeta(html: string, name: string, attr: string = "name"): string {
  // Match <meta ... attr="name" ... content="value" ...>
  // Also match reversed order: content first, then name
  const patterns = [
    new RegExp(
      `<meta[^>]*${attr}\\s*=\\s*["']${escapeRegex(name)}["'][^>]*content\\s*=\\s*["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content\\s*=\\s*["']([^"']*)["'][^>]*${attr}\\s*=\\s*["']${escapeRegex(name)}["']`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

function extractOgMeta(html: string, property: string): string {
  return extractMeta(html, property, "property");
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : "";
}

function extractCanonical(html: string): string {
  const match = html.match(
    /<link[^>]*rel\s*=\s*["']canonical["'][^>]*href\s*=\s*["']([^"']*)["']/i
  );
  if (match) return match[1].trim();

  // Try reversed order
  const match2 = html.match(
    /<link[^>]*href\s*=\s*["']([^"']*)["'][^>]*rel\s*=\s*["']canonical["']/i
  );
  return match2 ? match2[1].trim() : "";
}

function extractFavicon(html: string): string {
  const patterns = [
    /<link[^>]*rel\s*=\s*["'](?:shortcut )?icon["'][^>]*href\s*=\s*["']([^"']*)["']/i,
    /<link[^>]*href\s*=\s*["']([^"']*)["'][^>]*rel\s*=\s*["'](?:shortcut )?icon["']/i,
    /<link[^>]*rel\s*=\s*["']apple-touch-icon(?:-precomposed)?["'][^>]*href\s*=\s*["']([^"']*)["']/i,
    /<link[^>]*href\s*=\s*["']([^"']*)["'][^>]*rel\s*=\s*["']apple-touch-icon(?:-precomposed)?["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

function extractH1(html: string): string {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return "";
  return match[1]
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Unicode-aware length; CJK brand titles (e.g. 淘宝) are not "too short". */
export function isTitleTooShort(title: string): boolean {
  const chars = [...title.trim()];
  if (chars.length === 0) return true;
  const cjk = chars.filter((c) => /\p{Script=Han}/u.test(c)).length;
  if (cjk > 0 && cjk / chars.length >= 0.4) {
    return chars.length < 2;
  }
  return chars.length < 10;
}

export function isTitleTooLong(title: string): boolean {
  const chars = [...title.trim()];
  const cjk = chars.filter((c) => /\p{Script=Han}/u.test(c)).length;
  if (cjk > 0 && cjk / chars.length >= 0.4) {
    return chars.length > 30;
  }
  return chars.length > 70;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseHtml(html: string): ParsedMeta {
  const title = extractTitle(html);
  const description = extractMeta(html, "description");
  const robots = extractMeta(html, "robots");
  const canonical = extractCanonical(html);
  const ogTitle = extractOgMeta(html, "og:title");
  const ogDescription = extractOgMeta(html, "og:description");
  const ogImage = extractOgMeta(html, "og:image");
  const ogUrl = extractOgMeta(html, "og:url");
  const ogType = extractOgMeta(html, "og:type");
  const faviconHref = extractFavicon(html);
  const h1 = extractH1(html);

  const robotsLower = robots.toLowerCase();
  const noindex = robotsLower.includes("noindex");

  return {
    title,
    description,
    robots,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType,
    faviconHref,
    h1,
    noindex,
  };
}

// Parse robots.txt for sitemap URL and blanket disallow
export function parseRobotsTxt(content: string): {
  hasBlanketDisallow: boolean;
  sitemapUrl: string;
} {
  const lines = content.split("\n").map((l) => l.trim());
  let hasBlanketDisallow = false;
  let sitemapUrl = "";

  // Check for Sitemap: directive
  for (const line of lines) {
    const sitemapMatch = line.match(/^sitemap:\s*(.+)/i);
    if (sitemapMatch) {
      sitemapUrl = sitemapMatch[1].trim();
    }
  }

  // Check for blanket Disallow: / for all user agents
  let inGlobalAgent = false;
  let foundDisallow = false;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.startsWith("user-agent:")) {
      const agent = lower.replace("user-agent:", "").trim();
      inGlobalAgent = agent === "*" || agent === "googlebot";
      foundDisallow = false;
    } else if (lower.startsWith("disallow:") && inGlobalAgent) {
      const path = lower.replace("disallow:", "").trim();
      if (path === "/") {
        foundDisallow = true;
      }
    } else if (lower.startsWith("allow:") && inGlobalAgent) {
      // If there's an Allow after Disallow: /, it's not a blanket block
      const path = lower.replace("allow:", "").trim();
      if (path && path !== "/" && foundDisallow) {
        foundDisallow = false;
      }
    }

    if (foundDisallow && inGlobalAgent) {
      hasBlanketDisallow = true;
    }
  }

  return { hasBlanketDisallow, sitemapUrl };
}
