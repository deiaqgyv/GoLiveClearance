import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Favicon Checker — Verify Browser Tab Icon Before Launch",
  description:
    "Free favicon checker: paste your URL, verify favicon exists and loads correctly. Detect missing favicons, broken icon links, and apple-touch-icon gaps. CLEARED / HOLD / DENIED.",
  openGraph: {
    title: "Favicon Checker",
    description:
      "Paste your URL. Catch missing or broken favicons that make your site look unfinished in browser tabs and bookmarks.",
    type: "website",
  },
};

export default function FaviconCheckerPage() {
  return (
    <ToolLanding
      eyebrow="Visual completeness · Favicon"
      title="Favicon Checker"
      lead={
        <>
          A missing favicon is a small thing that makes a big first
          impression. Browser tabs show a blank icon. Bookmarks lose their
          visual anchor. Pinned tabs are unrecognizable. Paste your URL and
          we check for{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            &lt;link rel=&quot;icon&quot;&gt;
          </code>
          ,{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            /favicon.ico
          </code>
          , and{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            apple-touch-icon
          </code>
          , then stamp CLEARED / HOLD / DENIED.
        </>
      }
      failuresHeading="Favicon problems we catch"
      failuresLead="These are tiny details that make your site look unfinished on launch day."
      failures={[
        {
          title: "No favicon at all",
          detail:
            "Browser tab shows a blank or default globe icon. Bookmarks have no visual identifier. Looks like a dev environment, not a product.",
        },
        {
          title: "<link rel='icon'> present but 404",
          detail:
            "The href points to a path that returns 404 or serves HTML instead of an image. The tag exists but the favicon never loads.",
        },
        {
          title: "Favicon returns HTML instead of an image",
          detail:
            "SPA fallback routing serves index.html for unknown paths, including /favicon.ico. The browser gets an HTML response and can't display it.",
        },
        {
          title: "Missing apple-touch-icon for iOS",
          detail:
            "iPhone and iPad users who 'Add to Home Screen' get a blank or screenshot-based icon. Apple requires a dedicated apple-touch-icon link.",
        },
      ]}
      fixHeading="Copy-paste favicon fixes"
      fixLead="Use Next.js file-based favicons for zero config, or explicit link tags for any stack."
      fixBlocks={[
        {
          title: "Next.js App Router — file-based",
          code: `Place in app/ directory:
- app/favicon.ico      (classic .ico)
- app/icon.png         (modern PNG, 32×32+)
- app/apple-icon.png   (iOS home screen, 180×180)

Next.js wires <link> tags automatically.`,
        },
        {
          title: "Plain HTML",
          code: `<head>
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</head>

# Ensure /favicon.ico returns an image, not HTML.`,
        },
        {
          title: "Server-rendered (Java/Spring)",
          code: `# Put favicon.ico in the static web root
# Spring: src/main/resources/static/favicon.ico
# Also add <link rel="icon" href="/favicon.ico"> in the layout
# Make sure the security config permits GET /favicon.ico anonymously`,
        },
      ]}
      checklist={[
        "Test in an incognito window — browsers cache favicons aggressively",
        "Include both .ico (legacy) and .png/.svg (modern) formats",
        "Add apple-touch-icon (180×180 PNG) for iOS home screen",
        "Verify /favicon.ico returns an image content-type, not text/html",
      ]}
      related={[
        {
          href: "/open-graph-checker",
          label: "Open Graph checker",
          note: "og:image for social shares",
        },
        {
          href: "/title-tag-checker",
          label: "Title tag checker",
        },
        {
          href: "/meta-description-checker",
          label: "Meta description checker",
        },
        {
          href: "/website-launch-checklist",
          label: "Website launch checklist",
        },
        { href: "/methodology", label: "Methodology" },
        { href: "/", label: "Go-Live Clearance home" },
      ]}
    />
  );
}
