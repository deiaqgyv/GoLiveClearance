"use client";

import { useState } from "react";
import type { Finding, FindingFix } from "@/lib/types";

function CopyFixButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-2 top-2 bg-[var(--pass-ink)] px-2 py-1 font-mono text-xs text-white opacity-0 transition-opacity hover:opacity-90 group-hover:opacity-100"
      aria-label="Copy fix code"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function FixPanel({ fixes, fallback }: { fixes?: FindingFix[]; fallback?: FindingFix }) {
  const list =
    fixes && fixes.length > 0 ? fixes : fallback ? [fallback] : [];
  const [active, setActive] = useState(0);

  if (list.length === 0) return null;

  const current = list[Math.min(active, list.length - 1)];

  const stackLabel = (stack?: FindingFix["stack"]) => {
    if (stack === "nextjs") return "Next.js";
    if (stack === "server") return "Server";
    if (stack === "ai") return "AI prompt";
    return "HTML";
  };

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium text-[var(--pass-mute)]">
          Fix
        </span>
        {list.length > 1 ? (
          <div className="flex flex-wrap gap-1">
            {list.map((f, i) => (
              <button
                key={`${f.stack}-${f.label}`}
                type="button"
                onClick={() => setActive(i)}
                className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  i === active
                    ? "bg-[var(--pass-ink)] text-white"
                    : "bg-[var(--secondary)] text-[var(--pass-mute)] hover:text-[var(--pass-ink)]"
                }`}
              >
                {stackLabel(f.stack)}
              </button>
            ))}
          </div>
        ) : (
          <span className="font-mono text-xs text-[var(--pass-mute)]">
            {stackLabel(current.stack)}
          </span>
        )}
      </div>
      <p className="mt-1.5 font-mono text-[10px] text-[var(--pass-mute)]">
        {current.label}
        {current.stack === "ai"
          ? " — paste into Cursor / Claude / Copilot"
          : current.stack === "server"
            ? " — Java / nginx / SSR templates"
            : null}
      </p>
      {current.code && (
        <div className="group/code relative mt-1">
          <pre className="overflow-x-auto bg-[var(--pass-ink)] px-4 py-3 font-mono text-xs leading-relaxed text-white/90">
            <code>{current.code}</code>
          </pre>
          <CopyFixButton code={current.code} />
        </div>
      )}
    </div>
  );
}

const severityConfig: Record<
  string,
  {
    label: string;
    borderColor: string;
    badgeColor: string;
    icon: string;
  }
> = {
  blocker: {
    label: "BLOCKER",
    borderColor: "border-l-[var(--denied-red)]",
    badgeColor: "bg-[var(--denied-red-bg)] text-[var(--denied-red)]",
    icon: "X",
  },
  warning: {
    label: "WARNING",
    borderColor: "border-l-[var(--hold-amber)]",
    badgeColor: "bg-[var(--hold-amber-bg)] text-[var(--hold-amber)]",
    icon: "!",
  },
  info: {
    label: "INFO",
    borderColor: "border-l-[var(--pass-mute)]",
    badgeColor: "bg-[var(--secondary)] text-[var(--pass-mute)]",
    icon: "i",
  },
};

interface FindingCardProps {
  finding: Finding;
  index: number;
}

export function FindingCard({ finding, index }: FindingCardProps) {
  const config = severityConfig[finding.severity] ?? severityConfig.info;

  return (
    <div
      className={`group animate-fade-in-up border border-[var(--pass-line)] border-l-4 ${config.borderColor} bg-white p-4`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-5 w-5 items-center justify-center font-mono text-xs font-bold ${config.badgeColor}`}
          >
            {config.icon}
          </span>
          <span className="font-mono text-xs font-medium text-[var(--pass-mute)]">
            {finding.id}
          </span>
        </div>
        <span
          className={`font-mono text-[10px] font-bold uppercase tracking-wider ${config.badgeColor} px-2 py-0.5`}
        >
          {config.label}
        </span>
      </div>

      <h3 className="mt-2 font-display text-sm font-semibold text-[var(--pass-ink)]">
        {finding.summary}
      </h3>

      <p className="mt-1 text-sm text-[var(--pass-mute)]">{finding.impact}</p>

      {finding.evidence && (
        <div className="mt-2 bg-[var(--gate-surface)] px-3 py-2">
          <span className="font-mono text-xs font-medium text-[var(--pass-mute)]">
            Evidence:{" "}
          </span>
          <pre className="mt-0.5 whitespace-pre-wrap font-mono text-xs text-[var(--pass-ink)]">
            {finding.evidence}
          </pre>
        </div>
      )}

      <FixPanel fixes={finding.fixes} fallback={finding.fix} />
    </div>
  );
}

interface FindingListProps {
  findings: Finding[];
}

export function FindingList({ findings }: FindingListProps) {
  if (findings.length === 0) {
    return (
      <div className="border border-[var(--clearance-green-border)] bg-[var(--clearance-green-bg)] p-6 text-center">
        <p className="font-mono text-sm font-medium text-[var(--clearance-green)]">
          All checks passed. Cleared for launch.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {findings.map((finding, index) => (
        <FindingCard key={finding.id} finding={finding} index={index} />
      ))}
    </div>
  );
}
