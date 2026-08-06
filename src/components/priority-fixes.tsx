"use client";

import type { Finding } from "@/lib/types";
import { FindingCard } from "./finding-list";

interface PriorityFixesProps {
  findings: Finding[];
  priorityFixIds: string[];
}

export function PriorityFixes({ findings, priorityFixIds }: PriorityFixesProps) {
  const priority = priorityFixIds
    .map((id) => findings.find((f) => f.id === id))
    .filter((f): f is Finding => Boolean(f));

  if (priority.length === 0) return null;

  return (
    <section className="border border-[var(--hold-amber-border)] bg-[var(--hold-amber-bg)] p-5">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--hold-amber)]">
          Fix these first
        </h3>
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--hold-amber)]/70">
          Top {priority.length}
        </span>
      </div>
      <p className="mb-4 font-mono text-xs text-[var(--pass-mute)]">
        Clearance hinges on these. Everything else can wait until after launch day.
      </p>
      <div className="space-y-3">
        {priority.map((finding, index) => (
          <FindingCard key={finding.id} finding={finding} index={index} />
        ))}
      </div>
    </section>
  );
}
