import type { Clearance } from "@/lib/types";
import { AFFILIATE } from "@/lib/affiliate";

interface AffiliateOfferProps {
  clearance: Clearance;
}

/** Contextual, disclosed affiliate slot — one partner for V1. */
export function AffiliateOffer({ clearance }: AffiliateOfferProps) {
  if (clearance === "go") return null;

  const offer = AFFILIATE.monitor;
  const hasLink = Boolean(offer.href);

  return (
    <aside
      className="border border-dashed border-[var(--pass-line)] bg-[var(--gate-surface)] px-4 py-4 sm:px-5"
      aria-label="Recommended next step"
    >
      <p className="field-label text-[var(--pass-mute)]">After you fix blockers</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--pass-ink)]">
        {offer.blurb}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {hasLink ? (
          <a
            href={offer.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-3 py-2 font-mono text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            {offer.cta} →
          </a>
        ) : (
          <span className="font-mono text-xs font-semibold text-[var(--pass-ink)]">
            {offer.name}
          </span>
        )}
        <span className="font-mono text-[10px] text-[var(--pass-mute)]">
          Affiliate disclosure — we may earn a commission
        </span>
      </div>
    </aside>
  );
}
