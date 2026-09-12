import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { TOOL_ROUTES } from "@/lib/tool-routes";

const CONTENT_LAST_MODIFIED = new Date("2026-09-11T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  // SITE.domain is normalized to www; never list apex URLs (they 308 → www).
  const base = SITE.domain.replace(/\/$/, "");
  return [
    { url: `${base}/`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 1 },
    ...TOOL_ROUTES.map((t) => ({
      url: `${base}${t.path}`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: t.priority,
    })),
    {
      url: `${base}/methodology`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/about`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...[
      "/seo-checkers",
      "/launch-checklists",
      "/social-preview",
      "/security",
      "/privacy",
      "/terms",
      "/contact",
    ].map((path) => ({
      url: `${base}${path}`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: path === "/privacy" || path === "/terms" ? 0.3 : 0.7,
    })),
  ];
}
