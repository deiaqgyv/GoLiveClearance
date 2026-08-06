// TECH_SPEC §10: Report page — boarding-pass certificate
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getReport } from "@/lib/report-store";
import { SITE } from "@/lib/site";
import { ClearanceBadge } from "@/components/clearance-badge";
import { FindingList } from "@/components/finding-list";
import { PriorityFixes } from "@/components/priority-fixes";
import { ExportActions } from "@/components/export-actions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const report = getReport(id);
  if (!report) return { title: "Report Not Found" };

  const stamp =
    report.result.clearance === "go"
      ? "CLEARED"
      : report.result.clearance === "hold"
        ? "HOLD"
        : "DENIED";

  return {
    title: `${stamp} — ${report.result.urlInput}`,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}

function blurb(
  clearance: "go" | "hold" | "no_go",
  blockers: number,
  warnings: number
): string {
  if (clearance === "no_go") {
    return `${blockers} blocker${blockers === 1 ? "" : "s"} — do not board until fixed.`;
  }
  if (clearance === "hold") {
    return `No blockers. ${warnings} warning${warnings === 1 ? "" : "s"} before you promote.`;
  }
  return "Zero blockers. Zero warnings. Cleared to ship.";
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const report = getReport(id);

  if (!report) {
    notFound();
  }

  const { result, createdAt, expiresAt } = report;
  const restFindings = result.findings.filter(
    (f) => !result.priorityFixIds.includes(f.id)
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <article className="overflow-hidden border border-[var(--pass-line)] bg-white">
        <div className="border-b border-dashed border-[var(--pass-line)] px-5 py-4 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="field-label">Inspection certificate</p>
              <p className="mt-1 font-display text-base font-semibold text-[var(--pass-ink)]">
                {result.urlInput}
              </p>
            </div>
            <div className="text-right font-mono text-[10px] leading-relaxed text-[var(--pass-mute)]">
              <p>DOC {result.id}</p>
              <p>Issued {new Date(createdAt).toLocaleString()}</p>
              <p>Valid until {new Date(expiresAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-5 py-8 sm:px-8">
          <div className="flex justify-center">
            <ClearanceBadge
              clearance={result.clearance}
              score={result.score}
              animated={false}
              size="lg"
            />
          </div>

          <div className="text-center">
            {result.urlFinal !== result.urlInput && (
              <p className="mb-2 font-mono text-xs text-[var(--pass-mute)]">
                Final URL:{" "}
                <span className="text-[var(--pass-ink)]">{result.urlFinal}</span>
              </p>
            )}
            <p className="font-mono text-xs leading-relaxed text-[var(--pass-mute)]">
              {blurb(
                result.clearance,
                result.summary.blockers,
                result.summary.warnings
              )}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <span className="bg-[var(--denied-red-bg)] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[var(--denied-red)]">
                {result.summary.blockers} blocker
                {result.summary.blockers !== 1 ? "s" : ""}
              </span>
              <span className="bg-[var(--hold-amber-bg)] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[var(--hold-amber)]">
                {result.summary.warnings} warning
                {result.summary.warnings !== 1 ? "s" : ""}
              </span>
              {result.platform && result.platform !== "unknown" && (
                <span className="bg-[var(--secondary)] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[var(--pass-mute)]">
                  {result.platform}
                </span>
              )}
            </div>
          </div>

          <PriorityFixes
            findings={result.findings}
            priorityFixIds={result.priorityFixIds}
          />

          {restFindings.length > 0 && (
            <div>
              <h3 className="mb-3 field-label !text-[var(--pass-mute)]">
                Additional findings
              </h3>
              <FindingList findings={restFindings} />
            </div>
          )}

          {result.priorityFixIds.length === 0 && result.findings.length > 0 && (
            <FindingList findings={result.findings} />
          )}

          {result.findings.length === 0 && (
            <div className="border border-[var(--clearance-green-border)] bg-[var(--clearance-green-bg)] p-5 text-center">
              <p className="font-mono text-sm font-medium text-[var(--clearance-green)]">
                All checks passed. Cleared for launch.
              </p>
            </div>
          )}

          <ExportActions
            result={{
              ...result,
              reportUrl: `${SITE.domain.replace(/\/$/, "")}/report/${result.id}`,
            }}
          />
        </div>

        <div className="border-t border-dashed border-[var(--pass-line)] bg-[var(--gate-surface)] px-5 py-6 sm:px-8">
          <div className="flex flex-col items-center gap-3">
            <Link
              href={`/?url=${encodeURIComponent(result.urlInput)}`}
              className="border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white"
            >
              Re-inspect this URL
            </Link>
            <Link
              href="/"
              className="font-mono text-xs text-[var(--pass-mute)] hover:text-[var(--pass-ink)]"
            >
              Inspect another URL
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
