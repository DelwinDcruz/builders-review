import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
/** Crawlable pagination using real links. */
export function Pagination({ page, totalPages, makeHref }: { page: number; totalPages: number; makeHref: (p: number) => string }) {
  if (totalPages <= 1) return null;
  const start = Math.max(1, page - 2), end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1
        ? <Link href={makeHref(page - 1)} rel="prev" className="inline-flex h-11 items-center gap-1 rounded-lg border border-border px-4 text-meta-lg font-medium hover:bg-surface-2"><ChevronLeft size={15} aria-hidden="true" /> Prev</Link>
        : <span className="inline-flex h-11 items-center gap-1 rounded-lg border border-border px-4 text-meta-lg text-muted opacity-50"><ChevronLeft size={15} aria-hidden="true" /> Prev</span>}
      {pages.map((p) => (
        <Link key={p} href={makeHref(p)} aria-current={p === page ? "page" : undefined}
          className={`inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border px-3 text-meta-lg font-medium ${p === page ? "border-brand bg-brand text-brand-fg" : "border-border hover:bg-surface-2"}`}>{p}</Link>
      ))}
      {page < totalPages
        ? <Link href={makeHref(page + 1)} rel="next" className="inline-flex h-11 items-center gap-1 rounded-lg border border-border px-4 text-meta-lg font-medium hover:bg-surface-2">Next <ChevronRight size={15} aria-hidden="true" /></Link>
        : <span className="inline-flex h-11 items-center gap-1 rounded-lg border border-border px-4 text-meta-lg text-muted opacity-50">Next <ChevronRight size={15} aria-hidden="true" /></span>}
    </nav>
  );
}
