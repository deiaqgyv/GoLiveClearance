/**
 * Affiliate placements — set env URLs when partner links are ready.
 * Leave empty to hide the CTA (copy still explains the recommendation).
 */
export const AFFILIATE = {
  /** Uptime / incident monitoring — shown when clearance is not clean */
  monitor: {
    name: "Better Stack",
    href: process.env.NEXT_PUBLIC_AFFILIATE_MONITOR_URL || "",
    blurb:
      "After clearance: put uptime monitors on / and /api so the next outage is not a tweet from a user.",
    cta: "Try Better Stack",
  },
} as const;
