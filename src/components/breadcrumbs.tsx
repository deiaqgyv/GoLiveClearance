import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";

interface BreadcrumbsProps {
  current: string;
  parent?: { label: string; href: string };
}

export function Breadcrumbs({ current, parent }: BreadcrumbsProps) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE.domain },
    ...(parent
      ? [{ "@type": "ListItem", position: 2, name: parent.label, item: `${SITE.domain}${parent.href}` }]
      : []),
    { "@type": "ListItem", position: parent ? 3 : 2, name: current },
  ];

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items }} />
      <nav aria-label="Breadcrumb" className="mb-5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--pass-mute)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-[var(--pass-ink)]">Home</Link></li>
          {parent ? <><li aria-hidden>/</li><li><Link href={parent.href} className="hover:text-[var(--pass-ink)]">{parent.label}</Link></li></> : null}
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-[var(--pass-ink)]">{current}</li>
        </ol>
      </nav>
    </>
  );
}
