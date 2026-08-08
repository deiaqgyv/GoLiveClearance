"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ScanFormProps {
  /** boarding = homepage hero pass; compact = embed on other pages */
  variant?: "boarding" | "compact";
  /** Prefill destination (overrides ?url= when set) */
  defaultUrl?: string;
  className?: string;
}

type AnalyticsParams = Record<string, string | number | boolean>;

function trackEvent(name: string, params: AnalyticsParams = {}) {
  const analyticsWindow = window as typeof window & {
    gtag?: (command: "event", eventName: string, eventParams?: AnalyticsParams) => void;
  };

  analyticsWindow.gtag?.("event", name, params);
}

export function ScanForm({
  variant = "boarding",
  defaultUrl,
  className = "",
}: ScanFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFocusedRef = useRef(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (defaultUrl) return;
    const q = searchParams.get("url");
    if (q) setUrl(q);
  }, [searchParams, defaultUrl]);

  const handleScan = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim() || loading) return;

      setLoading(true);
      setError(null);
      const startedAt = Date.now();
      trackEvent("scan_submit", { form_variant: variant });

      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });

        const data = await res.json();

        if (!res.ok) {
          trackEvent("scan_error", {
            form_variant: variant,
            error_code: data.error?.code || "unknown_error",
            duration_ms: Date.now() - startedAt,
          });
          setError(data.error?.message || "Scan failed");
          setLoading(false);
          return;
        }

        const id = data.id as string;
        const token = data.reportToken as string | undefined;
        trackEvent("scan_success", {
          form_variant: variant,
          duration_ms: Date.now() - startedAt,
        });
        const href = token
          ? `/report/${id}?t=${encodeURIComponent(token)}`
          : `/report/${id}`;
        router.push(href);
      } catch {
        trackEvent("scan_error", {
          form_variant: variant,
          error_code: "network_error",
          duration_ms: Date.now() - startedAt,
        });
        setError("Network error. Please try again.");
        setLoading(false);
      }
    },
    [url, loading, router, variant]
  );

  const handleFocus = useCallback(() => {
    if (hasFocusedRef.current) return;
    hasFocusedRef.current = true;
    trackEvent("scan_input_focus", { form_variant: variant });
  }, [variant]);

  const handleUrlChange = useCallback(
    (value: string) => {
      setUrl(value);
      if (!value.trim() || hasStartedRef.current) return;
      hasStartedRef.current = true;
      trackEvent("scan_input_started", { form_variant: variant });
    },
    [variant]
  );

  if (variant === "compact") {
    return (
      <div className={className}>
        <form
          onSubmit={handleScan}
          className="border border-[var(--pass-line)] bg-white p-5 sm:p-6"
        >
          <label htmlFor="scan-url-compact" className="field-label">
            Destination
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex min-w-0 flex-1 items-center border-b-2 border-[var(--pass-ink)] pb-2">
              <span className="mr-2 shrink-0 font-mono text-xs text-[var(--pass-mute)]">
                https://
              </span>
              <input
                id="scan-url-compact"
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onFocus={handleFocus}
                placeholder="yourdomain.com"
                className="w-full bg-transparent font-display text-base font-medium tracking-tight text-[var(--pass-ink)] outline-none placeholder:text-[var(--pass-mute)]"
                disabled={loading}
                autoComplete="url"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Inspecting…" : "Inspect →"}
            </button>
          </div>
          <p className="mt-3 font-mono text-[10px] text-[var(--pass-mute)]">
            Public URLs only · Usually under 10s · Opens full report
          </p>
        </form>
        {error && (
          <div className="mt-3 border border-[var(--denied-red-border)] bg-[var(--denied-red-bg)] px-4 py-3">
            <p className="font-mono text-sm text-[var(--denied-red)]">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleScan}
        className="relative overflow-hidden border border-[var(--pass-line)] bg-white shadow-[0_1px_0_rgba(15,18,24,0.04)]"
      >
        <div className="grid md:grid-cols-[minmax(0,1.05fr)_14px_minmax(0,1.2fr)]">
          <div className="flex flex-col justify-between gap-8 bg-[var(--gate-surface)] px-6 py-8 sm:px-8 sm:py-10">
            <div>
              <p className="field-label mb-4">Boarding · Pre-launch</p>
              <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-[var(--pass-ink)] sm:text-5xl md:text-[3.25rem]">
                Check your site
                <br />
                before you ship
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--pass-mute)]">
                Catch noindex, robots.txt, HTTPS, metadata, and launch mistakes.
                Get a{" "}
                <span className="font-medium text-[var(--pass-ink)]">
                  CLEARED / HOLD / DENIED
                </span>{" "}
                decision with the three fixes that matter most.
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

          <div className="relative hidden bg-white md:block" aria-hidden>
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
                    loading
                      ? "text-[var(--clearance-green)]"
                      : "text-[var(--pass-mute)]"
                  }`}
                >
                  {loading ? "SCANNING" : "AWAITING"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="dest-url" className="field-label">
                Destination
              </label>
              <div className="mt-2 flex min-h-12 items-center border-2 border-[var(--pass-ink)] bg-white px-3 transition-shadow focus-within:shadow-[0_0_0_3px_rgba(15,18,24,0.14)]">
                <span className="mr-2 shrink-0 font-mono text-xs text-[var(--pass-mute)]">
                  https://
                </span>
                <input
                  id="dest-url"
                  type="text"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onFocus={handleFocus}
                  placeholder="yourdomain.com"
                  className="min-w-0 flex-1 bg-transparent font-display text-lg font-medium tracking-tight text-[var(--pass-ink)] outline-none placeholder:text-[var(--pass-mute)]"
                  disabled={loading}
                  autoComplete="url"
                  required
                />
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[10px] leading-relaxed tracking-wide text-[var(--pass-mute)]">
                17 launch checks · Usually under 10s · No signup
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--pass-ink)] bg-[var(--pass-ink)] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Inspecting…" : "Get clearance →"}
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

      {loading && (
        <p className="mt-6 text-center font-mono text-xs tracking-[0.14em] text-[var(--pass-mute)]">
          Running gate inspection — opening your report…
        </p>
      )}
    </div>
  );
}
