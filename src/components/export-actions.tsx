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
}

function useCopy() {
  const [copied, setCopied] = useState<"md" | "cursor" | null>(null);

  const copy = async (kind: "md" | "cursor", text: string) => {
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

export function ExportActions({ result }: ExportActionsProps) {
  const { copied, copy } = useCopy();
  const hasFixes =
    result.priorityFixIds.length > 0 ||
    result.findings.some(
      (f) => f.severity === "blocker" || f.severity === "warning"
    );

  return (
    <div className="border-t border-dashed border-[var(--pass-line)] pt-5">
      <p className="field-label">Take it with you</p>
      <p className="mt-1 font-mono text-[11px] text-[var(--pass-mute)]">
        Paste into GitHub Issues, Linear, Notion — or drop the prompt into Cursor.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
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
          disabled={!hasFixes && result.clearance === "go"}
          className="border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-3 py-2 font-mono text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied === "cursor" ? "Copied Prompt" : "Paste into Cursor"}
        </button>
      </div>
    </div>
  );
}
