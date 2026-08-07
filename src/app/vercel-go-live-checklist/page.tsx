import type { Metadata } from "next";
import { ToolLanding } from "@/components/tool-landing";

export const metadata: Metadata = {
  title: "Vercel Go-Live Checklist — Deploy, Domain & Launch Fixes",
  description:
    "Vercel go-live checklist: custom domain, HTTPS, NEXT_PUBLIC_SITE_URL, preview vs production, and a live CLEARED / HOLD / DENIED scan.",
  openGraph: {
    title: "Vercel Go-Live Checklist",
    description:
      "Everything to check before you share a Vercel-deployed site on launch day.",
    type: "website",
  },
};

export default function VercelGoLiveChecklistPage() {
  return (
    <ToolLanding
      eyebrow="Vercel · deployment · go-live"
      title="Vercel Go-Live Checklist"
      lead={
        <>
          Vercel makes deploys easy — and that is exactly how{" "}
          <code className="bg-[var(--secondary)] px-1 font-mono text-xs">
            *.vercel.app
          </code>{" "}
          URLs end up on Product Hunt. Paste your production URL — we check
          domain binding, HTTPS, canonical, OG, and stamp CLEARED / HOLD /
          DENIED.
        </>
      }
      failuresHeading="Vercel-specific launch failures"
      failuresLead="These happen because the Vercel defaults are safe for development but wrong for launch day."
      failures={[
        {
          title: "Custom domain not attached (still *.vercel.app)",
          detail:
            "You share the preview URL. Canonical, OG, and Search Console all attach to the Vercel subdomain — not your brand.",
        },
        {
          title: "Apex and www both resolve without redirect",
          detail:
            "Two valid hosts with the same content. Google picks one — you cannot control which. Search signals split.",
        },
        {
          title: "NEXT_PUBLIC_SITE_URL still points at *.vercel.app",
          detail:
            "OG images and canonical URLs are generated relative to the preview host. Social cards break on the real domain.",
        },
        {
          title: "Preview deployment promoted instead of Production",
          detail:
            "Vercel keeps the latest successful build as Production. If you manually promote a Preview deploy, you may skip env checks.",
        },
        {
          title: "Environment variable missing in Production (only set in Preview)",
          detail:
            "Env vars are per-environment in Vercel. A key set in Preview does not automatically exist in Production.",
        },
      ]}
      fixHeading="Vercel go-live fixes"
      fixLead="Do these in the Vercel Dashboard before you share any URL publicly."
      fixBlocks={[
        {
          title: "Vercel Dashboard → Domains",
          code: `# 1. Add your domain (apex + www)
# 2. Wait until SSL status = "Valid"
# 3. Choose canonical host:
#    - Either apex → www redirect, or www → apex
#    - Vercel shows a redirect toggle next to each domain

# 4. Update env var:
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com

# 5. Redeploy (required after NEXT_PUBLIC_* change)`,
        },
        {
          title: "vercel.json — region + build (if needed)",
          code: `{
  "regions": ["iad1"],
  "buildCommand": "pnpm next build",
  "installCommand": "pnpm install"
}`,
        },
      ]}
      checklist={[
        "Confirm both apex and www resolve; one should 308 redirect to the other",
        "Set all NEXT_PUBLIC_* variables in Production AND Preview environments",
        "Verify GA4 and Search Console are on the production domain, not *.vercel.app",
        "Re-scan after every domain or env change",
      ]}
      related={[
        {
          href: "/nextjs-launch-checklist",
          label: "Next.js launch checklist",
        },
        {
          href: "/nextjs-production-checklist",
          label: "Next.js production checklist",
        },
        {
          href: "/ssl-https-checker",
          label: "SSL / HTTPS checker",
        },
        {
          href: "/open-graph-checker",
          label: "Open Graph checker",
        },
        { href: "/methodology", label: "Methodology" },
        { href: "/", label: "Go-Live Clearance home" },
      ]}
    />
  );
}
