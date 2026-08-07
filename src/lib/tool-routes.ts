/** High-intent SEO tool routes (PRD appendix A full set). */
export const TOOL_ROUTES = [
  // Priority 8 (original set)
  {
    path: "/robots-txt-checker",
    title: "robots.txt Checker",
    priority: 0.9,
  },
  {
    path: "/security-headers-checker",
    title: "Security Headers Checker",
    priority: 0.9,
  },
  {
    path: "/ssl-https-checker",
    title: "SSL / HTTPS Checker",
    priority: 0.9,
  },
  {
    path: "/open-graph-checker",
    title: "Open Graph Checker",
    priority: 0.9,
  },
  {
    path: "/noindex-checker",
    title: "Noindex Checker",
    priority: 0.9,
  },
  {
    path: "/sitemap-checker",
    title: "Sitemap Checker",
    priority: 0.9,
  },
  {
    path: "/website-launch-checklist",
    title: "Website Launch Checklist",
    priority: 0.9,
  },
  {
    path: "/nextjs-production-checklist",
    title: "Next.js Production Checklist",
    priority: 0.9,
  },
  // Extended 7 (scenario / narrative pages)
  {
    path: "/nextjs-launch-checklist",
    title: "Next.js Launch Checklist",
    priority: 0.8,
  },
  {
    path: "/vercel-go-live-checklist",
    title: "Vercel Go-Live Checklist",
    priority: 0.8,
  },
  {
    path: "/saas-pre-launch-checklist",
    title: "SaaS Pre-Launch Checklist",
    priority: 0.8,
  },
  {
    path: "/forgot-noindex-production",
    title: "Forgot noindex in Production?",
    priority: 0.8,
  },
  {
    path: "/missing-security-headers-nextjs",
    title: "Missing Security Headers in Next.js",
    priority: 0.8,
  },
  {
    path: "/disallow-all-robots-txt",
    title: "Disallow: / in robots.txt",
    priority: 0.8,
  },
  {
    path: "/og-image-not-showing",
    title: "OG Image Not Showing",
    priority: 0.8,
  },
  // Phase 1-A: new single-check tool pages (matrix expansion)
  {
    path: "/title-tag-checker",
    title: "Title Tag Checker",
    priority: 0.9,
  },
  {
    path: "/canonical-checker",
    title: "Canonical Tag Checker",
    priority: 0.9,
  },
  {
    path: "/h1-tag-checker",
    title: "H1 Tag Checker",
    priority: 0.9,
  },
  {
    path: "/meta-description-checker",
    title: "Meta Description Checker",
    priority: 0.9,
  },
  {
    path: "/favicon-checker",
    title: "Favicon Checker",
    priority: 0.9,
  },
] as const;
