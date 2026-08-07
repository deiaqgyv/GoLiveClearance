import { describe, it, expect } from "vitest";
import {
  parseHtml,
  parseRobotsTxt,
  isTitleTooShort,
  isTitleTooLong,
} from "../parse-html";

// ─── parseHtml ──────────────────────────────────────────────────────────
describe("parseHtml", () => {
  it("extracts title", () => {
    const html = `<html><head><title>My Site</title></head><body></body></html>`;
    const meta = parseHtml(html);
    expect(meta.title).toBe("My Site");
  });

  it("extracts meta description", () => {
    const html = `<html><head><meta name="description" content="A cool site"></head></html>`;
    const meta = parseHtml(html);
    expect(meta.description).toBe("A cool site");
  });

  it("extracts description with reversed attribute order", () => {
    const html = `<html><head><meta content="Reversed" name="description"></head></html>`;
    const meta = parseHtml(html);
    expect(meta.description).toBe("Reversed");
  });

  it("extracts robots meta", () => {
    const html = `<html><head><meta name="robots" content="noindex, nofollow"></head></html>`;
    const meta = parseHtml(html);
    expect(meta.robots).toBe("noindex, nofollow");
    expect(meta.noindex).toBe(true);
  });

  it("noindex is false when robots meta is absent", () => {
    const html = `<html><head><title>OK</title></head></html>`;
    const meta = parseHtml(html);
    expect(meta.noindex).toBe(false);
  });

  it("noindex is false for index, follow", () => {
    const html = `<html><head><meta name="robots" content="index, follow"></head></html>`;
    const meta = parseHtml(html);
    expect(meta.noindex).toBe(false);
  });

  it("extracts canonical", () => {
    const html = `<html><head><link rel="canonical" href="https://example.com/"></head></html>`;
    const meta = parseHtml(html);
    expect(meta.canonical).toBe("https://example.com/");
  });

  it("extracts canonical with reversed attribute order", () => {
    const html = `<html><head><link href="https://example.com/" rel="canonical"></head></html>`;
    const meta = parseHtml(html);
    expect(meta.canonical).toBe("https://example.com/");
  });

  it("extracts OG tags", () => {
    const html = `<html><head>
      <meta property="og:title" content="OG Title">
      <meta property="og:description" content="OG Desc">
      <meta property="og:image" content="https://example.com/og.png">
      <meta property="og:url" content="https://example.com/">
      <meta property="og:type" content="website">
    </head></html>`;
    const meta = parseHtml(html);
    expect(meta.ogTitle).toBe("OG Title");
    expect(meta.ogDescription).toBe("OG Desc");
    expect(meta.ogImage).toBe("https://example.com/og.png");
    expect(meta.ogUrl).toBe("https://example.com/");
    expect(meta.ogType).toBe("website");
  });

  it("extracts favicon link", () => {
    const html = `<html><head><link rel="icon" href="/favicon.ico"></head></html>`;
    const meta = parseHtml(html);
    expect(meta.faviconHref).toBe("/favicon.ico");
  });

  it("extracts apple-touch-icon", () => {
    const html = `<html><head><link rel="apple-touch-icon" href="/apple-icon.png"></head></html>`;
    const meta = parseHtml(html);
    expect(meta.faviconHref).toBe("/apple-icon.png");
  });

  it("extracts H1 text (strips inner tags)", () => {
    const html = `<html><body><h1>Welcome <span>to</span> My Site</h1></body></html>`;
    const meta = parseHtml(html);
    expect(meta.h1).toBe("Welcome to My Site");
  });

  it("returns empty strings for missing elements", () => {
    const html = `<html><head></head><body></body></html>`;
    const meta = parseHtml(html);
    expect(meta.title).toBe("");
    expect(meta.description).toBe("");
    expect(meta.canonical).toBe("");
    expect(meta.ogTitle).toBe("");
    expect(meta.h1).toBe("");
  });
});

// ─── parseRobotsTxt ─────────────────────────────────────────────────────
describe("parseRobotsTxt", () => {
  it("detects Disallow: / for User-agent: *", () => {
    const content = `User-agent: *
Disallow: /`;
    const result = parseRobotsTxt(content);
    expect(result.hasBlanketDisallow).toBe(true);
  });

  it("detects Disallow: / for User-agent: Googlebot", () => {
    const content = `User-agent: Googlebot
Disallow: /`;
    const result = parseRobotsTxt(content);
    expect(result.hasBlanketDisallow).toBe(true);
  });

  it("does not flag specific path disallows", () => {
    const content = `User-agent: *
Disallow: /admin/`;
    const result = parseRobotsTxt(content);
    expect(result.hasBlanketDisallow).toBe(false);
  });

  it("Allow after Disallow: / cancels blanket block", () => {
    const content = `User-agent: *
Disallow: /
Allow: /`;
    const result = parseRobotsTxt(content);
    expect(result.hasBlanketDisallow).toBe(false);
  });

  it("extracts Sitemap URL", () => {
    const content = `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`;
    const result = parseRobotsTxt(content);
    expect(result.sitemapUrl).toBe("https://example.com/sitemap.xml");
  });

  it("handles empty robots.txt", () => {
    const result = parseRobotsTxt("");
    expect(result.hasBlanketDisallow).toBe(false);
    expect(result.sitemapUrl).toBe("");
  });

  it("handles multiple user-agent blocks (only global)", () => {
    const content = `User-agent: *
Allow: /

User-agent: BadBot
Disallow: /`;
    const result = parseRobotsTxt(content);
    expect(result.hasBlanketDisallow).toBe(false);
  });

  it("handles case-insensitive directives", () => {
    const content = `USER-AGENT: *
DISALLOW: /`;
    const result = parseRobotsTxt(content);
    expect(result.hasBlanketDisallow).toBe(true);
  });
});

// ─── Title length checks ───────────────────────────────────────────────
describe("isTitleTooShort", () => {
  it("empty title is too short", () => {
    expect(isTitleTooShort("")).toBe(true);
  });

  it("short English title is too short", () => {
    expect(isTitleTooShort("Hi")).toBe(true);
  });

  it("10+ char English title is not too short", () => {
    expect(isTitleTooShort("My Great Website")).toBe(false);
  });

  it("CJK title with 2+ chars is not too short", () => {
    expect(isTitleTooShort("淘宝")).toBe(false);
  });

  it("single CJK char is too short", () => {
    expect(isTitleTooShort("淘")).toBe(true);
  });
});

describe("isTitleTooLong", () => {
  it("normal English title is not too long", () => {
    expect(isTitleTooLong("My Great Website")).toBe(false);
  });

  it("70+ char English title is too long", () => {
    expect(
      isTitleTooLong(
        "This is a very long title that exceeds seventy characters and should be flagged as too long"
      )
    ).toBe(true);
  });

  it("CJK title under 30 chars is not too long", () => {
    expect(isTitleTooLong("这是一个中文标题")).toBe(false);
  });

  it("CJK title over 30 chars is too long", () => {
    expect(
      isTitleTooLong(
        "这是一个非常长的中文标题超过了三十个字符的限制应该被标记为过长"
      )
    ).toBe(true);
  });
});
