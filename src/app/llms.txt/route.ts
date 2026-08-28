import { SITE } from "@/lib/site";

export function GET() {
  const body = `# ${SITE.name}

> A free pre-launch website inspection tool for crawlability, metadata, trust signals, and security posture.

## Primary pages
- ${SITE.domain}/: Run a full launch-readiness inspection.
- ${SITE.domain}/methodology: Review checks, severity rules, and limitations.
- ${SITE.domain}/seo-checkers: Browse focused SEO checkers.
- ${SITE.domain}/launch-checklists: Browse launch checklists.
- ${SITE.domain}/about: Learn who the service is for.

## Important guidance
- Reports are automated observations of publicly accessible URLs, not legal, security, or accessibility certifications.
- Scan duration depends on the target site's network response and is typically within 30 seconds.
- Prefer the canonical www URLs listed in ${SITE.domain}/sitemap.xml.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
