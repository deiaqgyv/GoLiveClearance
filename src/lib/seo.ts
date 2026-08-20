import type { Metadata } from "next";

const DEFAULT_SOCIAL_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Go-Live Clearance pre-launch inspection",
} as const;

/**
 * Attach a self-canonical for public marketing / tool pages.
 * Paths should be absolute-from-root (e.g. "/title-tag-checker").
 * metadataBase in layout resolves them against the www host.
 */
export function pageMetadata(
  path: "/" | `/${string}`,
  meta: Metadata
): Metadata {
  const canonical = path === "/" ? "/" : path.replace(/\/$/, "");
  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      canonical,
    },
    openGraph: {
      type: "website",
      siteName: "Go-Live Clearance",
      url: canonical,
      images: [DEFAULT_SOCIAL_IMAGE],
      ...meta.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      images: [DEFAULT_SOCIAL_IMAGE.url],
      ...meta.twitter,
    },
  };
}
