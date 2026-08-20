import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export interface TopicLink {
  href: string;
  title: string;
  description: string;
}

interface TopicHubProps {
  eyebrow: string;
  title: string;
  lead: string;
  links: TopicLink[];
}

export function TopicHub({ eyebrow, title, lead, links }: TopicHubProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 md:pt-14">
      <Breadcrumbs current={title} />
      <p className="field-label text-[var(--hold-amber)]">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-[var(--pass-ink)] md:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--pass-mute)] md:text-base">{lead}</p>
      <ul className="mt-10 grid gap-px border border-[var(--pass-line)] bg-[var(--pass-line)] sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href} className="bg-white">
            <Link href={link.href} className="block h-full p-6 transition-colors hover:bg-[var(--gate-surface)]">
              <h2 className="font-display text-lg font-semibold text-[var(--pass-ink)]">{link.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--pass-mute)]">{link.description}</p>
              <span className="mt-5 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-amber-800">Open tool →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
