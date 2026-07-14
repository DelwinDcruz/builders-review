import Link from "next/link";
import { ChevronRight } from "lucide-react";
export interface Crumb { label: string; href?: string; }
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-meta-lg text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {c.href && !last ? <Link href={c.href} className="transition-colors hover:text-brand">{c.label}</Link>
                : <span aria-current={last ? "page" : undefined} className={last ? "font-medium text-fg" : ""}>{c.label}</span>}
              {!last && <ChevronRight size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
