import type { Metadata } from "next";

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
  };
}
