import { ScanClient } from "@/components/scan-client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 md:pt-12">
      <ScanClient />

      <p className="mt-10 text-center font-mono text-[10px] leading-relaxed tracking-[0.08em] text-[var(--pass-mute)]">
        HTTPS · headers · robots · noindex · sitemap · meta · OG · favicon ·
        preview · trust · analytics · placeholder · H1
      </p>
      <p className="mt-3 text-center font-mono text-[11px] text-[var(--pass-mute)]">
        Guides:{" "}
        <Link
          href="/website-launch-checklist"
          className="text-[var(--pass-ink)] underline-offset-2 hover:underline"
        >
          Launch checklist
        </Link>
        {" · "}
        <Link
          href="/nextjs-production-checklist"
          className="text-[var(--pass-ink)] underline-offset-2 hover:underline"
        >
          Next.js checklist
        </Link>
      </p>
    </div>
  );
}
