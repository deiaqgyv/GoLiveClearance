export const publicCheckDefinitions = [
  { id: "https_redirect", signal: "HTTP requests reach an HTTPS final URL", evidence: "Redirect chain and final URL", failure: "Plain HTTP remains the final URL", limitation: "Does not test every subdomain or mixed content", severity: "blocker" },
  { id: "tls_cert", signal: "The fetched HTTPS endpoint presents a currently usable certificate", evidence: "TLS connection and certificate timing available to the scanner", failure: "Certificate is expired or close to expiry", limitation: "Not a complete TLS configuration or cipher audit", severity: "warning" },
  { id: "robots_txt", signal: "robots.txt is reachable and does not contain a blanket Disallow: /", evidence: "GET /robots.txt response and parsed wildcard group", failure: "A complete crawl block is detected", limitation: "Does not prove indexing and does not evaluate every named bot policy", severity: "blocker" },
  { id: "noindex", signal: "The fetched page has no detected meta or X-Robots-Tag noindex", evidence: "HTML robots meta and response headers", failure: "A noindex directive is present", limitation: "Only the fetched page and response are evaluated", severity: "blocker" },
  { id: "canonical", signal: "A canonical URL is present without a detected preview-host leak", evidence: "HTML link rel=canonical", failure: "Canonical is missing or points to a preview host", limitation: "Does not prove search engines will select that canonical", severity: "warning" },
  { id: "title_description", signal: "A descriptive title and meta description are present", evidence: "Fetched server HTML", failure: "A field is missing or outside the launch-check range", limitation: "Length ranges are heuristics, not ranking guarantees", severity: "warning" },
  { id: "h1", signal: "A primary H1 is present in fetched HTML", evidence: "Server-returned HTML heading", failure: "No H1 is detected", limitation: "Does not score writing quality or rendered visual hierarchy", severity: "warning" },
  { id: "sitemap", signal: "A reachable XML sitemap with usable URL entries is found", evidence: "robots Sitemap directive and common sitemap paths", failure: "No usable sitemap is found", limitation: "Sampling does not prove every listed URL is indexable", severity: "warning" },
  { id: "open_graph", signal: "Core Open Graph fields are present", evidence: "og:title, og:description and og:image in HTML", failure: "A core field is missing", limitation: "Does not render every social platform preview", severity: "warning" },
  { id: "security_headers", signal: "Configured defensive response headers are present", evidence: "Public response headers", failure: "One or more configured headers are absent", limitation: "Header presence is not a penetration test or security certification", severity: "warning" },
] as const;

export const publicCheckDataset = {
  name: "GoLiveClearance public check definitions",
  version: "2026-09-13",
  scope: "One bounded scan of publicly accessible responses",
  definitions: publicCheckDefinitions,
};
