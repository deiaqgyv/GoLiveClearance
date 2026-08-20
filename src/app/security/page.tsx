import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TopicHub } from "@/components/topic-hub";

export const metadata: Metadata = pageMetadata("/security", {
  title: "Website Launch Security Checks",
  description: "Check HTTPS redirects, TLS certificates, HSTS, CSP, X-Frame-Options, and other response headers before launch.",
});

export default function SecurityPage() {
  return <TopicHub eyebrow="Topic hub · launch hardening" title="Website Security Checks" lead="These checks cover visible launch posture, not penetration testing. Use them to catch inexpensive configuration mistakes before promotion." links={[
    { href: "/ssl-https-checker", title: "SSL / HTTPS Checker", description: "Verify redirects, certificate availability, and a single canonical HTTPS host." },
    { href: "/security-headers-checker", title: "Security Headers Checker", description: "Inspect HSTS, CSP, frame protection, MIME sniffing, referrer, and permissions policies." },
    { href: "/missing-security-headers-nextjs", title: "Missing Headers in Next.js", description: "Apply framework-specific header configuration and avoid common deployment gaps." },
  ]} />;
}
