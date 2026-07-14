"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { track } from "@/lib/analytics";

/** Search + program selector + platform selector. Usable on 320px. */
export function HeroSearch({ programs, platforms }:
  { programs: { slug: string; title: string; type: string }[]; platforms: { slug: string; name: string }[] }) {
  const router = useRouter();
  const [q, setQ] = useState(""); const [program, setProgram] = useState(""); const [source, setSource] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("search", q.trim());
    if (program) sp.set("program", program);
    if (source) sp.set("source", source);
    track("filter_used", { from: "hero" });
    router.push(`/reviews${sp.toString() ? `?${sp}` : ""}`);
  }

  return (
    <form onSubmit={submit} role="search" aria-label="Search Portfolio Builders reviews"
      className="rounded-2xl border border-border bg-surface p-2.5 shadow-lg">
      <div className="grid gap-2.5 md:grid-cols-[1.5fr_1fr_1fr_auto]">
        <div className="relative">
          <label htmlFor="hero-q" className="sr-only">Search reviews</label>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input id="hero-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reviews…"
            className="h-12 w-full rounded-lg border border-transparent bg-surface-2 pl-11 pr-3 text-body outline-none focus-visible:border-brand focus-visible:bg-surface" />
        </div>
        <div>
          <label htmlFor="hero-program" className="sr-only">Course or internship</label>
          <select id="hero-program" value={program} onChange={(e) => setProgram(e.target.value)}
            className="h-12 w-full rounded-lg border border-transparent bg-surface-2 px-3 text-body outline-none focus-visible:border-brand focus-visible:bg-surface">
            <option value="">All courses & internships</option>
            {programs.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="hero-source" className="sr-only">Review platform</label>
          <select id="hero-source" value={source} onChange={(e) => setSource(e.target.value)}
            className="h-12 w-full rounded-lg border border-transparent bg-surface-2 px-3 text-body outline-none focus-visible:border-brand focus-visible:bg-surface">
            <option value="">All review platforms</option>
            <option value="builders-review">builders.review</option>
            {platforms.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </div>
        <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-body font-semibold text-brand-fg transition hover:bg-brand-hover">
          <Search size={17} aria-hidden="true" /> <span className="md:hidden lg:inline">Explore Reviews</span><span className="hidden md:inline lg:hidden">Search</span>
        </button>
      </div>
    </form>
  );
}
