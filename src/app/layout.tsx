import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";

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
  openGraph: {
    title: "Go-Live Site Clearance",
    description:
      "Paste URL → 30s clearance stamp. Ship with confidence or fix before launch.",
    type: "website",
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
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
