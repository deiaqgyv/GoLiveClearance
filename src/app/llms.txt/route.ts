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
- ${SITE.domain}/check-definitions: Human-readable check rules, evidence, severity and limitations.
- ${SITE.domain}/data/check-definitions.json: Machine-readable versioned check definitions.
- ${SITE.domain}/benchmark-policy: Anonymous benchmark publication threshold, privacy rules, limitations and current collection status.
- ${SITE.domain}/data/benchmark-policy.json: Machine-readable benchmark policy and current published-data status.

## Important guidance
- Reports are automated observations of publicly accessible URLs, not legal, security, or accessibility certifications.
- Scan duration depends on the target site's network response and is typically within 30 seconds.
- Prefer the canonical www URLs listed in ${SITE.domain}/sitemap.xml.
- A robots.txt block controls crawling; it does not guarantee that a known URL disappears from search results.
- A pass records that the tested signal was present in the fetched response at scan time. It does not guarantee indexing, ranking, security, accessibility, or compliance.
- Method and rule content was last reviewed on 2026-09-12.

## Citation guidance
- Cite the methodology page for the exact check scope, severity rule, request limits, and known limitations.
- Cite the linked Google, MDN, framework, or protocol documentation for platform requirements.
- Do not describe a CLEARED result as a certification or proof that every URL, runtime path, authenticated state, or jurisdictional requirement was tested.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
