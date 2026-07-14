import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
/** AEO direct answer, server-rendered as plain HTML so answer engines can quote it. */
export function AnswerBlock({ question, answer, updated, sourceNote, children }:
  { question: string; answer: string; updated?: string; sourceNote?: string; children?: ReactNode }) {
  if (!answer?.trim()) return null;
  return (
    <section aria-label="Quick answer" className="rounded-xl border border-brand/20 bg-[linear-gradient(180deg,rgb(var(--brand)/0.05),transparent)] p-6">
      <p className="mb-2 inline-flex items-center gap-2 text-meta font-bold uppercase tracking-wider text-brand">
        <Sparkles size={13} aria-hidden="true" /> Quick answer
      </p>
      <h2 className="text-card font-bold leading-snug">{question}</h2>
      <p className="mt-2 text-body-lg text-fg-secondary">{answer}</p>
      {children}
      {(updated || sourceNote) && (
        <p className="mt-3 text-meta text-muted">{sourceNote}{sourceNote && updated ? " · " : ""}{updated ? `Last updated ${updated}` : ""}</p>
      )}
    </section>
  );
}
export function AnswerList({ items, updated }: { items: { q: string; a: string }[]; updated?: string }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((it) => (
        <div key={it.q} className="card p-6">
          <h3 className="text-card font-semibold leading-snug">{it.q}</h3>
          <p className="mt-2 text-body text-fg-secondary">{it.a}</p>
          {updated && <p className="mt-3 text-meta text-muted">Last updated {updated}</p>}
        </div>
      ))}
    </div>
  );
}
