import Link from "next/link";

const GROUPS = [
  {
    label: "Tools",
    links: [
      ["SEO checkers", "/seo-checkers"],
      ["Launch checklists", "/launch-checklists"],
      ["Social preview", "/social-preview"],
      ["Security", "/security"],
    ],
  },
  {
    label: "Company",
    links: [
      ["About", "/about"],
      ["Methodology", "/methodology"],
      ["Contact", "/contact"],
    ],
  },
  {
    label: "Legal",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Sitemap", "/sitemap.xml"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[var(--pass-line)] bg-[var(--gate-surface)]">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-[1.4fr_2fr]">
        <div>
          <Link href="/" className="font-display text-sm font-semibold text-[var(--pass-ink)]">
            Go-Live Clearance
          </Link>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-[var(--pass-mute)]">
            A focused pre-launch inspection for crawlability, metadata, security posture,
            and the mistakes that quietly break a launch.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {GROUPS.map((group) => (
            <nav key={group.label} aria-label={`${group.label} links`}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--pass-ink)]">
                {group.label}
              </p>
              <ul className="mt-3 space-y-2">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-xs text-[var(--pass-mute)] hover:text-[var(--pass-ink)]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </footer>
  );
}
