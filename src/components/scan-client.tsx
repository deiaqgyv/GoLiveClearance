"use client";

import { useState, useCallback } from "react";
import type { ScanResponse, Finding } from "@/lib/types";
import { ClearanceBadge } from "./clearance-badge";
import { FindingList } from "./finding-list";
import { PriorityFixes } from "./priority-fixes";
import { ExportActions } from "./export-actions";

function clearanceBlurb(
  clearance: ScanResponse["clearance"],
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

interface ScanClientProps {
  showSample?: boolean;
}

export function ScanClient({ showSample = true }: ScanClientProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleScan = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim()) return;

      setLoading(true);
      setError(null);
      setResult(null);
      setShowAll(false);

      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error?.message || "Scan failed");
          setLoading(false);
          return;
        }

        setResult(data);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  const restFindings: Finding[] =
    result?.findings.filter((f) => !result.priorityFixIds.includes(f.id)) ?? [];

  const statusLabel = result
    ? result.clearance === "go"
      ? "CLEARED"
      : result.clearance === "hold"
        ? "HOLD"
        : "DENIED"
    : loading
      ? "SCANNING"
      : "AWAITING";

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Boarding pass */}
      <form
        onSubmit={handleScan}
        className="relative overflow-hidden border border-[var(--pass-line)] bg-white shadow-[0_1px_0_rgba(15,18,24,0.04)]"
      >
        <div className="grid md:grid-cols-[minmax(0,1.05fr)_14px_minmax(0,1.2fr)]">
          {/* Brand stub */}
          <div className="flex flex-col justify-between gap-8 bg-[var(--gate-surface)] px-6 py-8 sm:px-8 sm:py-10">
            <div>
              <p className="field-label mb-4">Boarding · Pre-launch</p>
              <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-[var(--pass-ink)] sm:text-5xl md:text-[3.25rem]">
                Go-Live
                <br />
                Clearance
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--pass-mute)]">
                Paste your production URL. Get a{" "}
                <span className="font-medium text-[var(--pass-ink)]">
                  CLEARED / HOLD / DENIED
                </span>{" "}
                stamp — then fix the three things that matter.
              </p>
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-dashed border-[var(--pass-line)] pt-5">
              <div>
                <p className="field-label">Carrier</p>
                <p className="mt-1 font-display text-sm font-semibold text-[var(--pass-ink)]">
                  Indie / Next.js
                </p>
              </div>
              <div className="text-right">
                <p className="field-label">Class</p>
                <p className="mt-1 font-mono text-xs font-bold tracking-wider text-[var(--pass-ink)]">
                  GATE CHECK
                </p>
              </div>
            </div>
          </div>

          {/* Perforation */}
          <div
            className="relative hidden bg-white md:block"
            aria-hidden
          >
            <div className="pass-perforation absolute inset-y-3 left-1/2 w-3 -translate-x-1/2" />
            {loading && (
              <div className="absolute inset-y-6 left-1/2 flex -translate-x-1/2 flex-col justify-evenly">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="punch-light block h-1.5 w-1.5 rounded-full bg-[var(--clearance-green)]"
                  />
                ))}
              </div>
            )}
          </div>
          <div
            className="pass-perforation-x h-3 border-y border-[var(--pass-line)] bg-white md:hidden"
            aria-hidden
          />

          {/* Fields */}
          <div className="flex flex-col px-6 py-8 sm:px-8 sm:py-10">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="field-label">Gate</p>
                <p className="mt-1 font-display text-2xl font-bold tracking-tight text-[var(--pass-ink)]">
                  INSPECT
                </p>
              </div>
              <div className="text-right">
                <p className="field-label">Status</p>
                <p
                  className={`mt-1 font-mono text-sm font-bold tracking-[0.14em] ${
                    statusLabel === "CLEARED"
                      ? "text-[var(--clearance-green)]"
                      : statusLabel === "HOLD"
                        ? "text-[var(--hold-amber)]"
                        : statusLabel === "DENIED"
                          ? "text-[var(--denied-red)]"
                          : "text-[var(--pass-mute)]"
                  }`}
                >
                  {statusLabel}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="dest-url" className="field-label">
                Destination
              </label>
              <div className="mt-2 flex items-center border-b-2 border-[var(--pass-ink)] pb-2">
                <span className="mr-2 shrink-0 font-mono text-xs text-[var(--pass-mute)]">
                  https://
                </span>
                <input
                  id="dest-url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="yourdomain.com"
                  className="w-full bg-transparent font-display text-lg font-medium tracking-tight text-[var(--pass-ink)] outline-none placeholder:text-[var(--pass-line)]"
                  disabled={loading}
                  autoComplete="url"
                />
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[10px] leading-relaxed tracking-wide text-[var(--pass-mute)]">
                Public URLs only · ~30s · No signup
              </p>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="inline-flex items-center justify-center border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Inspecting…" : "Inspect →"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 border border-[var(--denied-red-border)] bg-[var(--denied-red-bg)] px-4 py-3">
          <p className="font-mono text-sm text-[var(--denied-red)]">{error}</p>
        </div>
      )}

      {loading && !result && (
        <p className="mt-6 text-center font-mono text-xs tracking-[0.14em] text-[var(--pass-mute)]">
          Running gate inspection…
        </p>
      )}

      {result && (
        <article className="mt-8 overflow-hidden border border-[var(--pass-line)] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[var(--pass-line)] px-5 py-3 sm:px-6">
            <p className="field-label">Inspection certificate</p>
            <p className="font-mono text-[10px] text-[var(--pass-mute)]">
              DOC {result.id}
            </p>
          </div>

          <div className="space-y-6 px-5 py-8 sm:px-8">
            <div className="flex justify-center">
              <ClearanceBadge
                clearance={result.clearance}
                score={result.score}
                size="lg"
              />
            </div>

            <div className="text-center">
              <p className="font-display text-base font-medium text-[var(--pass-ink)]">
                {result.urlFinal}
              </p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-[var(--pass-mute)]">
                {clearanceBlurb(
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
                {result.platform !== "unknown" && (
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

            {result.findings.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="flex w-full items-center justify-between border border-[var(--pass-line)] bg-[var(--gate-surface)] px-4 py-3 text-left transition-colors hover:bg-[var(--secondary)]"
                >
                  <span className="field-label !text-[var(--pass-ink)]">
                    Full inspection log
                  </span>
                  <span className="font-mono text-[11px] text-[var(--pass-mute)]">
                    {showAll
                      ? "Hide"
                      : `Show ${result.findings.length} findings`}
                  </span>
                </button>
                {showAll && (
                  <div className="mt-3 space-y-3">
                    {result.priorityFixIds.length > 0 &&
                    restFindings.length > 0 ? (
                      <>
                        <p className="font-mono text-[11px] text-[var(--pass-mute)]">
                          Remaining after priority fixes
                        </p>
                        <FindingList findings={restFindings} />
                      </>
                    ) : (
                      <FindingList findings={result.findings} />
                    )}
                  </div>
                )}
              </div>
            )}

            <ExportActions result={result} />

            {result.reportUrl && (
              <div className="border-t border-dashed border-[var(--pass-line)] pt-5">
                <p className="field-label">Share this pass</p>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={result.reportUrl}
                    className="flex-1 border border-[var(--pass-line)] bg-[var(--gate-surface)] px-3 py-2 font-mono text-xs text-[var(--pass-ink)]"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(result.reportUrl!)
                    }
                    className="border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-3 py-2 font-mono text-xs font-bold text-white"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setError(null);
                  setShowAll(false);
                }}
                className="font-mono text-xs text-[var(--pass-mute)] underline-offset-2 hover:text-[var(--pass-ink)] hover:underline"
              >
                Inspect another URL
              </button>
            </div>
          </div>
        </article>
      )}

      {showSample && !result && !loading && !error && (
        <div className="mt-10">
          <SamplePass />
        </div>
      )}
    </div>
  );
}

function SamplePass() {
  return (
    <aside
      className="overflow-hidden border border-[var(--pass-line)] bg-white"
      aria-label="Sample clearance pass"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[var(--pass-line)] px-5 py-3">
        <p className="field-label">Sample pass · Not a live scan</p>
        <p className="font-mono text-[10px] text-[var(--pass-mute)]">
          DOC r_SAMPLE01
        </p>
      </div>
      <div className="grid gap-6 px-5 py-8 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8">
        <div>
          <p className="field-label">Destination</p>
          <p className="mt-1 font-display text-lg font-semibold text-[var(--pass-ink)]">
            staging.example.com
          </p>
          <p className="mt-4 field-label">Fix these first</p>
          <ol className="mt-2 space-y-2.5">
            <li className="flex gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--denied-red-bg)] font-mono text-[10px] font-bold text-[var(--denied-red)]">
                1
              </span>
              <span>
                <span className="font-medium text-[var(--pass-ink)]">
                  Homepage still ships noindex
                </span>
                <span className="mt-0.5 block text-xs text-[var(--pass-mute)]">
                  You launch invisible — search finds nothing.
                </span>
              </span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--hold-amber-bg)] font-mono text-[10px] font-bold text-[var(--hold-amber)]">
                2
              </span>
              <span>
                <span className="font-medium text-[var(--pass-ink)]">
                  Missing og:image
                </span>
                <span className="mt-0.5 block text-xs text-[var(--pass-mute)]">
                  Social shares look broken on launch day.
                </span>
              </span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--hold-amber-bg)] font-mono text-[10px] font-bold text-[var(--hold-amber)]">
                3
              </span>
              <span>
                <span className="font-medium text-[var(--pass-ink)]">
                  Canonical points at preview host
                </span>
                <span className="mt-0.5 block text-xs text-[var(--pass-mute)]">
                  Google indexes the wrong deploy.
                </span>
              </span>
            </li>
          </ol>
        </div>
        <div className="flex justify-center">
          <ClearanceBadge
            clearance="no_go"
            score={65}
            animated={false}
            size="default"
          />
        </div>
      </div>
      <div className="border-t border-[var(--pass-line)] bg-[var(--gate-surface)] px-5 py-3 text-center">
        <p className="font-mono text-[11px] text-[var(--pass-mute)]">
          Fill DEST above — get your own stamp in ~30 seconds.
        </p>
      </div>
    </aside>
  );
}
