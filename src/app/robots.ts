import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = SITE.domain.replace(/\/$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/report/", "/api/"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/report/", "/api/"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/report/", "/api/"] },
      { userAgent: "GPTBot", allow: "/", disallow: ["/report/", "/api/"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/report/", "/api/"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/report/", "/api/"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
