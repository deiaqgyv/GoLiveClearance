import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TopicHub } from "@/components/topic-hub";

export const metadata: Metadata = pageMetadata("/social-preview", {
  title: "Open Graph and Social Preview Tools",
  description: "Verify Open Graph tags, Twitter cards, OG images, canonical URLs, and favicons before sharing a launch.",
});

export default function SocialPreviewPage() {
  return <TopicHub eyebrow="Topic hub · social sharing" title="Social Preview Tools" lead="A public page can work perfectly and still look broken when shared. Inspect the tags and assets used by social crawlers." links={[
    { href: "/open-graph-checker", title: "Open Graph Checker", description: "Inspect og:title, og:description, og:url, image metadata, and Twitter card signals." },
    { href: "/og-image-not-showing", title: "OG Image Not Showing", description: "Diagnose absolute URL, response format, cache, size, and preview-host problems." },
    { href: "/canonical-checker", title: "Canonical Tag Checker", description: "Keep canonical and og:url aligned on the final production host." },
    { href: "/favicon-checker", title: "Favicon Checker", description: "Verify a consistent browser and search-result identity." },
  ]} />;
}
