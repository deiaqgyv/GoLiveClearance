/** Central site strings — replace when domain/brand is finalized */
export const SITE = {
  name: "Go-Live Clearance",
  tagline: "Paste your URL. Get a CLEARED / HOLD / DENIED stamp.",
  domain: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  botUa: "GoLiveClearanceBot/1.0 (+https://goliveclearance.dev/methodology)",
} as const;
