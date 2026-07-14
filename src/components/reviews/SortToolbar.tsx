"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState } from "react";

const SORTS = [
  { v: "newest", l: "Newest" }, { v: "oldest", l: "Oldest" },
  { v: "highest", l: "Highest rated" }, { v: "lowest", l: "Lowest rated" }, { v: "helpful", l: "Most helpful" }
];

export function SortToolbar({ total, chips }: { total: number; chips: { key: string; label: string }[] }) {
  const router = useRouter(); const pathname = usePathname(); const params = useSearchParams();
  const [q, setQ] = useState(params.get("search") ?? "");
  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params.toString());
    if (v) next.set(k, v); else next.delete(k);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={(e) => { e.preventDefault(); setParam("search", q.trim()); }} role="search" className="relative flex-1">
          <label htmlFor="rv-search" className="sr-only">Search reviews</label>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input id="rv-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search review text, e.g. “FYUGP documentation”"
            className="h-12 w-full rounded-lg border border-border bg-surface pl-12 pr-4 text-body outline-none focus-visible:border-brand" />
        </form>
        <div className="flex items-center gap-2">
          <label htmlFor="rv-sort" className="shrink-0 text-meta-lg text-muted">Sort</label>
          <select id="rv-sort" value={params.get("sort") ?? "newest"} onChange={(e) => setParam("sort", e.target.value)}
            className="h-12 rounded-lg border border-border bg-surface px-3 text-meta-lg font-medium outline-none focus-visible:border-brand">
            {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <p aria-live="polite" className="text-meta-lg font-semibold text-fg-secondary">{total === 0 ? "No reviews" : `${total} review${total === 1 ? "" : "s"}`}</p>
        {chips.length > 0 && <span aria-hidden="true" className="text-muted">·</span>}
        {chips.map((c) => (
          <button key={c.key} onClick={() => setParam(c.key, "")}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/8 px-3 py-1 text-meta font-semibold text-brand hover:bg-brand/15">
            {c.label} <X size={12} aria-hidden="true" /><span className="sr-only">Remove filter</span>
          </button>
        ))}
      </div>
    </div>
  );
}
