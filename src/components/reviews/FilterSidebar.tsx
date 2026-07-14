"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import type { ReviewCategory } from "@/lib/categories";
import { EXPERIENCE_META } from "@/lib/sources/branding";
import { externalSourceDefs } from "@/lib/sources/definitions";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/format";

const EXPERIENCES = ["course","internship","program","mentorship","portfolio_service","career_support","community","website"] as const;

export function FilterSidebar({ categories, programs, activeCount, connectedSources }:
  { categories: ReviewCategory[]; programs: { slug: string; title: string }[]; activeCount: number; connectedSources: string[] }) {
  const router = useRouter(); const pathname = usePathname(); const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const sources = externalSourceDefs().filter((s) => connectedSources.includes(s.slug));

  const get = (k: string) => params.get(k) ?? "";
  const update = useCallback((patch: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) { if (v) next.set(k, v); else next.delete(k); }
    next.delete("page"); track("filter_used", {});
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }, [params, pathname, router]);
  const reset = () => router.push(pathname, { scroll: false });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const panel = (
    <div className="space-y-7">
      <Group label="Origin">
        <Pills value={get("origin")} onChange={(v) => update({ origin: v })}
          options={[{ v: "", l: "All" }, { v: "first", l: "On builders.review" }, { v: "external", l: "External" }]} />
      </Group>

      <Group label="Experience">
        <ul className="space-y-2">
          {EXPERIENCES.map((e) => {
            const on = get("experience") === e;
            return (
              <li key={e}>
                <button onClick={() => update({ experience: on ? "" : e })} aria-pressed={on}
                  className={cx("flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-meta-lg font-medium transition",
                    on ? "border-brand bg-brand/8 text-brand" : "border-border hover:bg-surface-2")}>
                  {EXPERIENCE_META[e].plural}
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: `rgb(${EXPERIENCE_META[e].accent})` }} />
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group label="Course or internship">
        <Select label="Program" value={get("program")} onChange={(v) => update({ program: v })}
          options={[{ v: "", l: "All programs" }, ...programs.map((p) => ({ v: p.slug, l: p.title }))]} />
      </Group>

      {sources.length > 0 && (
        <Group label="Review platform">
          <Select label="Source" value={get("source")} onChange={(v) => update({ source: v, origin: v && v !== "builders-review" ? "external" : get("origin") })}
            options={[{ v: "", l: "All platforms" }, { v: "builders-review", l: "builders.review" }, ...sources.map((s) => ({ v: s.slug, l: s.name }))]} />
        </Group>
      )}

      <Group label="Minimum rating">
        <Pills value={get("rating")} onChange={(v) => update({ rating: v })}
          options={[{ v: "", l: "Any" }, { v: "5", l: "5★" }, { v: "4", l: "4★+" }, { v: "3", l: "3★+" }]} />
      </Group>

      <Group label="Category">
        <Select label="Category" value={get("category")} onChange={(v) => update({ category: v })}
          options={[{ v: "", l: "All categories" }, ...categories.map((c) => ({ v: c.key, l: c.label }))]} />
      </Group>

      <Group label="Filters">
        <div className="space-y-2">
          <Check label="Verified reviews only" checked={!!get("verified")} onChange={(c) => update({ verified: c ? "1" : "" })} />
          <Check label="Would recommend only" checked={!!get("recommend")} onChange={(c) => update({ recommend: c ? "1" : "" })} />
        </div>
      </Group>

      {activeCount > 0 && (
        <button onClick={reset} className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-border font-semibold text-fg-secondary hover:bg-surface-2">
          <RotateCcw size={15} aria-hidden="true" /> Reset all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface font-semibold shadow-sm lg:hidden">
        <SlidersHorizontal size={16} aria-hidden="true" /> Filters
        {activeCount > 0 && <span className="rounded-full bg-brand px-2 py-0.5 text-meta font-bold text-brand-fg">{activeCount}</span>}
      </button>

      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-[92px] max-h-[calc(100dvh-116px)] overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-card font-bold"><SlidersHorizontal size={18} aria-hidden="true" /> Filters</h2>
          {panel}
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button aria-label="Close filters" onClick={() => setOpen(false)} className="absolute inset-0 bg-fg/40 backdrop-blur-sm" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] animate-fade-up overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-6 pb-10 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-card font-bold">Filters</h2>
              <button onClick={() => setOpen(false)} aria-label="Close filters" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-surface-2"><X size={20} /></button>
            </div>
            {panel}
            <button onClick={() => setOpen(false)} className="mt-7 min-h-[48px] w-full rounded-lg bg-brand font-semibold text-brand-fg">Show results</button>
          </div>
        </div>
      )}
    </>
  );
}

const Group = ({ label, children }: { label: string; children: ReactNode }) => (
  <div><h3 className="mb-3 text-meta font-bold uppercase tracking-wider text-muted">{label}</h3>{children}</div>
);
const Pills = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => (
      <button key={o.v} onClick={() => onChange(o.v)} aria-pressed={value === o.v}
        className={cx("min-h-[40px] rounded-lg border px-3.5 text-meta-lg font-semibold transition",
          value === o.v ? "border-brand bg-brand text-brand-fg" : "border-border hover:bg-surface-2")}>{o.l}</button>
    ))}
  </div>
);
const Select = ({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[]; label: string }) => (
  <>
    <label className="sr-only">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-meta-lg outline-none focus-visible:border-brand">
      {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </>
);
const Check = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (c: boolean) => void }) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-meta-lg font-medium hover:bg-surface-2">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-border-strong accent-[rgb(var(--brand))]" />
    {label}
  </label>
);
