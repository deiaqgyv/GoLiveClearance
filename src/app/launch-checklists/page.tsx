import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TopicHub } from "@/components/topic-hub";

export const metadata: Metadata = pageMetadata("/launch-checklists", {
  title: "Website and App Launch Checklists",
  description: "Practical launch checklists for websites, Next.js, Vercel, and SaaS products, backed by a live URL inspection.",
});

export default function LaunchChecklistsPage() {
  return <TopicHub eyebrow="Topic hub · go-live readiness" title="Launch Checklists" lead="Choose the checklist that matches your deployment. Each guide pairs manual release checks with a live inspection of the public URL." links={[
    { href: "/website-launch-checklist", title: "Website Launch Checklist", description: "A platform-neutral gate for crawlability, trust pages, analytics, and production smoke tests." },
    { href: "/nextjs-production-checklist", title: "Next.js Production Checklist", description: "Review App Router metadata, environment variables, redirects, headers, and production behavior." },
    { href: "/vercel-go-live-checklist", title: "Vercel Go-Live Checklist", description: "Check domain binding, preview-host leaks, HTTPS, and production environment settings." },
    { href: "/saas-pre-launch-checklist", title: "SaaS Pre-Launch Checklist", description: "Cover trust pages, auth, payments, analytics, metadata, and launch communications." },
  ]} />;
}
