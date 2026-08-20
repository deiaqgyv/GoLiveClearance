/** Central site strings */

/** Production canonical host (apex 308 → www on Vercel). */
export const CANONICAL_ORIGIN = "https://www.goliveclearance.com";

/** Normalize env / pasted site URL for sitemap, robots, metadataBase. */
export function normalizeSiteDomain(rawInput: string): string {
  const raw = rawInput.trim();
  // Guard against accidental concat like oldURL+newURL in env UIs
  const starts: number[] = [];
  const re = /https?:\/\//gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) starts.push(m.index);

  let url =
    starts.length > 1
      ? raw.slice(starts[starts.length - 1]).trim()
      : raw;
  url = url.replace(/\/$/, "");

  if (!url) url = "http://localhost:3000";

  // Never emit apex in sitemap/canonical — those URLs 308 to www and
  // Google Search Console reports them as "Page with redirect".
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "goliveclearance.com") {
      parsed.hostname = "www.goliveclearance.com";
    }
    return parsed.origin;
  } catch {
    return url;
  }
}

function resolveSiteDomain(): string {
  const fallback =
    process.env.NODE_ENV === "production"
      ? CANONICAL_ORIGIN
      : "http://localhost:3000";
  return normalizeSiteDomain(
    process.env.NEXT_PUBLIC_SITE_URL || fallback
  );
}

export const SITE = {
  name: "Go-Live Clearance",
  tagline: "Paste your URL. Get a CLEARED / HOLD / DENIED stamp.",
  domain: resolveSiteDomain(),
  botUa:
    "GoLiveClearanceBot/1.0 (+https://www.goliveclearance.com/methodology)",
} as const;
