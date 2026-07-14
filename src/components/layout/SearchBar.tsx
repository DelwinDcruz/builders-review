"use client";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
export function SearchBar({ autoFocus = false, id = "search-main" }: { autoFocus?: boolean; id?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); const t = q.trim(); router.push(t ? `/reviews?search=${encodeURIComponent(t)}` : "/reviews"); }} className="relative w-full">
      <label htmlFor={id} className="sr-only">Search Portfolio Builders reviews</label>
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus={autoFocus}
        placeholder="Search reviews, courses or internships…"
        className="h-12 w-full rounded-lg border border-border bg-surface pl-12 pr-24 text-body outline-none transition-colors placeholder:text-muted focus-visible:border-brand" />
      <button type="submit" className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-md bg-brand px-4 text-meta-lg font-semibold text-brand-fg hover:bg-brand-hover">Search</button>
    </form>
  );
}
