/** Central site strings */
function resolveSiteDomain(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").trim();
  // Guard against accidental concat like oldURL+newURL in env UIs
  const matches = raw.match(/https?:\/\/[^\s/]+(?:\/[^\s]*)?/gi);
  if (matches && matches.length > 1) {
    return matches[matches.length - 1]!.replace(/\/$/, "");
  }
  return raw.replace(/\/$/, "") || "http://localhost:3000";
}

export const SITE = {
  name: "Go-Live Clearance",
  tagline: "Paste your URL. Get a CLEARED / HOLD / DENIED stamp.",
  domain: resolveSiteDomain(),
  botUa:
    "GoLiveClearanceBot/1.0 (+https://www.goliveclearance.com/methodology)",
} as const;
