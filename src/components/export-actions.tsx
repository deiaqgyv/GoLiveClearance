"use client";

import { useState } from "react";
import type { ScanResult } from "@/lib/types";
import {
  formatClearanceMarkdown,
  formatCursorPrompt,
} from "@/lib/export-report";

type ExportableResult = ScanResult & { reportUrl?: string };

interface ExportActionsProps {
  result: ExportableResult;
  /** header = compact toolbar; footer = labeled export block */
  variant?: "header" | "footer";
}

type CopyKind = "md" | "cursor" | "link";

function useCopy() {
  const [copied, setCopied] = useState<CopyKind | null>(null);

  const copy = async (kind: CopyKind, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  };

  return { copied, copy };
}

export function ExportActions({
  result,
  variant = "footer",
}: ExportActionsProps) {
  const { copied, copy } = useCopy();
  const reportUrl =
    result.reportUrl ||
    (typeof window !== "undefined" ? window.location.href.split("#")[0] : "");
  const hasFixes =
    result.priorityFixIds.length > 0 ||
    result.findings.some(
      (f) => f.severity === "blocker" || f.severity === "warning"
    );
  const cursorDisabled = !hasFixes && result.clearance === "go";

  if (variant === "header") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => reportUrl && copy("link", reportUrl)}
          disabled={!reportUrl}
          className="border border-[var(--pass-line)] bg-white px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--pass-ink)] transition-colors hover:bg-[var(--gate-surface)] disabled:opacity-40"
        >
          {copied === "link" ? "Link Copied" : "Copy Link"}
        </button>
        <button
          type="button"
          onClick={() => copy("md", formatClearanceMarkdown(result))}
          className="border border-[var(--pass-line)] bg-white px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--pass-ink)] transition-colors hover:bg-[var(--gate-surface)]"
        >
          {copied === "md" ? "Copied" : "Copy Markdown"}
        </button>
        <button
          type="button"
          onClick={() => copy("cursor", formatCursorPrompt(result))}
          disabled={cursorDisabled}
          title="Copy a ready-to-paste prompt for Cursor, Claude Code, Copilot, or other AI coding agents"
          className="border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied === "cursor" ? "Copied" : "Paste into AI"}
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-dashed border-[var(--pass-line)] pt-5">
      <p className="field-label">Take it with you</p>
      <p className="mt-1 font-mono text-[11px] text-[var(--pass-mute)]">
        Share the certificate link, drop Markdown into Issues / Linear / Notion,
        or paste an AI prompt into your coding agent.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => reportUrl && copy("link", reportUrl)}
          disabled={!reportUrl}
          className="border border-[var(--pass-line)] bg-white px-3 py-2 font-mono text-xs font-bold text-[var(--pass-ink)] transition-colors hover:bg-[var(--gate-surface)] disabled:opacity-40"
        >
          {copied === "link" ? "Link Copied" : "Copy Share Link"}
        </button>
        <button
          type="button"
          onClick={() => copy("md", formatClearanceMarkdown(result))}
          className="border border-[var(--pass-line)] bg-white px-3 py-2 font-mono text-xs font-bold text-[var(--pass-ink)] transition-colors hover:bg-[var(--gate-surface)]"
        >
          {copied === "md" ? "Copied Markdown" : "Copy Markdown"}
        </button>
        <button
          type="button"
          onClick={() => copy("cursor", formatCursorPrompt(result))}
          disabled={cursorDisabled}
          className="border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-3 py-2 font-mono text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied === "cursor" ? "Copied Prompt" : "Paste into AI"}
        </button>
      </div>
    </div>
  );
}
