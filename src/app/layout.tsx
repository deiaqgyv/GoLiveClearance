import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Footer } from "@/components/footer";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: {
    default: "Go-Live Site Clearance — Pre-Launch URL Inspection",
    template: "%s | Go-Live Clearance",
  },
  description:
    "Paste your URL. Get a CLEARED / HOLD / DENIED clearance stamp in 30 seconds — with the three fixes that matter before you ship.",
  keywords: [
    "site checker",
    "pre-launch",
    "go-live",
    "website inspection",
    "SEO check",
    "security headers",
    "site clearance",
    "indie developer",
    "launch checklist",
  ],
  authors: [{ name: "Go-Live Clearance" }],
  // Always www — apex URLs 308 and show as "Page with redirect" in GSC
  metadataBase: new URL(SITE.domain),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Go-Live Site Clearance",
    description:
      "Paste URL → 30s clearance stamp. Ship with confidence or fix before launch.",
    type: "website",
    url: "/",
    siteName: SITE.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Go-Live Clearance pre-launch inspection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Go-Live Site Clearance",
    description: "Paste URL → 30s clearance stamp. Ship with confidence or fix before launch.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-[var(--foreground)]">
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE.domain}/#organization`,
              name: SITE.name,
              url: SITE.domain,
              email: "huhl22550555@163.com",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE.domain}/#website`,
              name: SITE.name,
              url: SITE.domain,
              publisher: { "@id": `${SITE.domain}/#organization` },
            },
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: SITE.name,
              url: SITE.domain,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              description: metadata.description,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
          ]}
        />
        <GoogleAnalytics />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
