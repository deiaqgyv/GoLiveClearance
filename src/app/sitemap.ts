import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { TOOL_ROUTES } from "@/lib/tool-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.domain.replace(/\/$/, "");
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...TOOL_ROUTES.map((t) => ({
      url: `${base}${t.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: t.priority,
    })),
    {
      url: `${base}/methodology`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
