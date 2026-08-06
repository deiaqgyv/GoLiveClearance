import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { ScanForm } from "@/components/scan-form";

export interface ToolFailure {
  title: string;
  detail: string;
}

export interface ToolRelated {
  href: string;
  label: string;
  note?: string;
}

interface ToolLandingProps {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  failuresHeading?: string;
  failuresLead?: string;
  failures: ToolFailure[];
  fixHeading?: string;
  fixLead?: string;
  fixBlocks?: { title: string; code: string }[];
  checklistHeading?: string;
  checklist?: string[];
  related: ToolRelated[];
}

export function ToolLanding({
  eyebrow,
  title,
  lead,
  failuresHeading = "What this scan catches",
  failuresLead,
  failures,
  fixHeading,
  fixLead,
  fixBlocks,
  checklistHeading,
  checklist,
  related,
}: ToolLandingProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 md:pt-14">
      <p className="field-label mb-3 text-[var(--hold-amber)]">{eyebrow}</p>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--pass-ink)] md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--pass-mute)] md:text-base">
        {lead}
      </p>

      <section className="mt-10">
        <Suspense
          fallback={
            <div className="h-28 border border-[var(--pass-line)] bg-white" />
          }
        >
          <ScanForm variant="compact" />
        </Suspense>
      </section>

      <section className="mt-14">
        <h2 className="font-mono text-xl font-bold text-stone-900">
          {failuresHeading}
        </h2>
        {failuresLead ? (
          <p className="mt-2 text-sm text-stone-500">{failuresLead}</p>
        ) : null}
        <ul className="mt-6 space-y-4">
          {failures.map((f) => (
            <li
              key={f.title}
              className="border-l-4 border-amber-400 bg-amber-50/50 py-3 pl-4 pr-3"
            >
              <p className="text-sm font-semibold text-stone-900">{f.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                {f.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {fixBlocks && fixBlocks.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-mono text-xl font-bold text-stone-900">
            {fixHeading ?? "Copy-paste fixes"}
          </h2>
          {fixLead ? (
            <p className="mt-2 text-sm text-stone-500">{fixLead}</p>
          ) : null}
          <div className="mt-6 space-y-5">
            {fixBlocks.map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-semibold text-stone-900">
                  {item.title}
                </h3>
                <pre className="mt-2 overflow-x-auto rounded-md bg-stone-900 px-4 py-3 font-mono text-[11px] leading-relaxed text-stone-200">
                  <code>{item.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {checklist && checklist.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-mono text-xl font-bold text-stone-900">
            {checklistHeading ?? "Still check by hand"}
          </h2>
          <ul className="mt-4 space-y-2">
            {checklist.map((item) => (
              <li
                key={item}
                className="flex gap-2 font-mono text-sm text-stone-700"
              >
                <span className="text-stone-400">□</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-14 rounded-md border border-stone-200 bg-stone-50 p-5">
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-stone-700">
          Related
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {related.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="font-medium text-amber-800 underline-offset-2 hover:underline"
              >
                {r.label}
              </Link>
              {r.note ? (
                <span className="text-stone-500"> — {r.note}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
