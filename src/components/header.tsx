import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[var(--pass-line)] bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center border border-[var(--pass-ink)] bg-[var(--pass-ink)] font-mono text-[10px] font-bold tracking-wider text-white"
            aria-hidden
          >
            GL
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-[var(--pass-ink)] group-hover:opacity-80">
            Go-Live Clearance
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
          <Link
            href="/website-launch-checklist"
            className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--pass-mute)] hover:text-[var(--pass-ink)]"
          >
            Launch
          </Link>
          <Link
            href="/nextjs-production-checklist"
            className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--pass-mute)] hover:text-[var(--pass-ink)]"
          >
            Next.js
          </Link>
          <Link
            href="/methodology"
            className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--pass-mute)] hover:text-[var(--pass-ink)]"
          >
            Method
          </Link>
          <Link
            href="/about"
            className="hidden font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--pass-mute)] hover:text-[var(--pass-ink)] sm:inline"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
