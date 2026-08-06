import { ClearanceBadge } from "./clearance-badge";

/** Static sample certificate for the marketing homepage */
export function SamplePass() {
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
          Submit above — your full report opens on the next page.
        </p>
      </div>
    </aside>
  );
}
