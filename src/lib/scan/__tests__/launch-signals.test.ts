import { describe, it, expect } from "vitest";
import {
  parseLaunchSignals,
  isPreviewHost,
  collectPreviewLeaks,
  extractSitemapLocs,
} from "../launch-signals";

// ─── isPreviewHost ──────────────────────────────────────────────────────
describe("isPreviewHost", () => {
  const previewHosts = [
    "something.vercel.app",
    "my-site.netlify.app",
    "project.pages.dev",
    "app.herokuapp.com",
    "site.railway.app",
    "app.onrender.com",
    "app.fly.dev",
    "project.web.app",
    "project.firebaseapp.com",
    "tunnel.ngrok-free.app",
    "abc.ngrok.io",
    "site.loca.lt",
    "user.github.io",
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
  ];

  for (const host of previewHosts) {
    it(`flags ${host} as preview`, () => {
      expect(isPreviewHost(host)).toBe(true);
    });
  }

  const productionHosts = [
    "example.com",
    "www.example.com",
    "goliveclearance.com",
    "my-saas.io",
    "docs.example.org",
  ];

  for (const host of productionHosts) {
    it(`does not flag ${host} as preview`, () => {
      expect(isPreviewHost(host)).toBe(false);
    });
  }
});

// ─── parseLaunchSignals ─────────────────────────────────────────────────
describe("parseLaunchSignals", () => {
  const baseUrl = "https://example.com";

  it("detects trust links (privacy, terms, contact)", () => {
    const html = `<html><body>
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
      <a href="/contact">Contact Us</a>
    </body></html>`;
    const signals = parseLaunchSignals(html, baseUrl);
    const kinds = signals.trustLinks.map((t) => t.kind);
    expect(kinds).toContain("privacy");
    expect(kinds).toContain("terms");
    expect(kinds).toContain("contact");
  });

  it("detects Google Analytics", () => {
    const html = `<html><head>
      <script src="https://www.googletagmanager.com/gtag/js?id=G-TEST"></script>
    </head></html>`;
    const signals = parseLaunchSignals(html, baseUrl);
    expect(signals.hasAnalytics).toBe(true);
    expect(signals.analyticsEvidence).toContain("Google");
  });

  it("detects Plausible analytics", () => {
    const html = `<html><head>
      <script defer data-domain="example.com" src="https://plausible.io/js/script.js"></script>
    </head></html>`;
    const signals = parseLaunchSignals(html, baseUrl);
    expect(signals.hasAnalytics).toBe(true);
    expect(signals.analyticsEvidence).toContain("Plausible");
  });

  it("detects no analytics", () => {
    const html = `<html><body><p>Hello</p></body></html>`;
    const signals = parseLaunchSignals(html, baseUrl);
    expect(signals.hasAnalytics).toBe(false);
  });

  it("detects placeholder text: lorem ipsum", () => {
    const html = `<html><body><p>Lorem ipsum dolor sit amet</p></body></html>`;
    const signals = parseLaunchSignals(html, baseUrl);
    expect(signals.placeholders).toContain("lorem ipsum");
  });

  it("detects placeholder text: TODO", () => {
    const html = `<html><body><p>TODO: write real copy</p></body></html>`;
    const signals = parseLaunchSignals(html, baseUrl);
    expect(signals.placeholders).toContain("TODO");
  });

  it("detects placeholder text: yourdomain.com", () => {
    const html = `<html><body><p>Visit your-domain.com for more</p></body></html>`;
    const signals = parseLaunchSignals(html, baseUrl);
    expect(signals.placeholders).toContain("yourdomain.com");
  });

  it("no false positives on normal text", () => {
    const html = `<html><body>
      <h1>Welcome to My Product</h1>
      <p>We help you ship faster.</p>
    </body></html>`;
    const signals = parseLaunchSignals(html, baseUrl);
    expect(signals.placeholders).toEqual([]);
  });

  it("extracts href hosts", () => {
    const html = `<html><body>
      <a href="https://cdn.example.com/script.js">CDN</a>
      <a href="https://api.example.com/docs">API</a>
    </body></html>`;
    const signals = parseLaunchSignals(html, baseUrl);
    expect(signals.hrefHosts).toContain("cdn.example.com");
    expect(signals.hrefHosts).toContain("api.example.com");
  });

  it("ignores mailto: and tel: links", () => {
    const html = `<html><body>
      <a href="mailto:info@example.com">Email</a>
      <a href="tel:+1234">Call</a>
    </body></html>`;
    const signals = parseLaunchSignals(html, baseUrl);
    expect(signals.hrefHosts).not.toContain("mailto");
  });
});

// ─── extractSitemapLocs ─────────────────────────────────────────────────
describe("extractSitemapLocs", () => {
  it("extracts loc URLs from sitemap", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/</loc></url>
  <url><loc>https://example.com/about</loc></url>
  <url><loc>https://example.com/contact</loc></url>
</urlset>`;
    const locs = extractSitemapLocs(xml);
    expect(locs).toEqual([
      "https://example.com/",
      "https://example.com/about",
      "https://example.com/contact",
    ]);
  });

  it("respects limit", () => {
    const xml = Array(30)
      .fill(null)
      .map(
        (_, i) =>
          `<url><loc>https://example.com/page${i}</loc></url>`
      )
      .join("\n");
    const locs = extractSitemapLocs(xml, 5);
    expect(locs.length).toBe(5);
  });

  it("returns empty for non-XML content", () => {
    const locs = extractSitemapLocs("<html>Not a sitemap</html>");
    expect(locs).toEqual([]);
  });
});

// ─── collectPreviewLeaks ────────────────────────────────────────────────
describe("collectPreviewLeaks", () => {
  it("detects preview domain in canonical", () => {
    const leaks = collectPreviewLeaks({
      pageUrl: "https://example.com",
      canonical: "https://my-site.vercel.app",
    });
    expect(leaks.length).toBeGreaterThan(0);
    expect(leaks[0].where).toBe("canonical");
  });

  it("detects preview domain in og:image", () => {
    const leaks = collectPreviewLeaks({
      pageUrl: "https://example.com",
      ogImage: "https://my-site.vercel.app/og.png",
    });
    expect(leaks.length).toBeGreaterThan(0);
    expect(leaks[0].where).toBe("og:image");
  });

  it("no leaks for clean production URLs", () => {
    const leaks = collectPreviewLeaks({
      pageUrl: "https://example.com",
      canonical: "https://example.com",
      ogImage: "https://example.com/og.png",
      ogUrl: "https://example.com",
    });
    expect(leaks).toEqual([]);
  });

  it("detects preview page URL itself", () => {
    const leaks = collectPreviewLeaks({
      pageUrl: "https://my-site.vercel.app",
    });
    expect(leaks.length).toBeGreaterThan(0);
    expect(leaks[0].where).toBe("page URL");
  });
});
