import type { ReactNode } from "react";
import { AlertTriangle, User } from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { SITE } from "@/lib/site-config";
import { formatDate } from "@/lib/format";

/** Shell for editorial/legal pages. Shows author/editor + dates (GEO). */
export function ContentLayout({ title, intro, updated, crumbs, legalReview, tldr, children }:
  { title: string; intro: string; updated: string; crumbs: Crumb[]; legalReview?: boolean; tldr?: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl">
      <Breadcrumbs items={crumbs} />
      <header className="mb-8">
        <h1 className="font-display text-h2 font-extrabold tracking-tight lg:text-h2-lg">{title}</h1>
        <p className="mt-4 text-body-lg text-muted">{intro}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-meta text-muted">
          <span className="inline-flex items-center gap-1.5"><User size={13} aria-hidden="true" /> Editorial: {SITE.editor.name}</span>
          <span>Last updated {formatDate(updated)}</span>
        </p>
      </header>

      {tldr && (
        <div className="mb-8 rounded-xl border border-brand/20 bg-[linear-gradient(180deg,rgb(var(--brand)/0.05),transparent)] p-6">
          <p className="text-body-lg"><strong className="text-fg">In short:</strong> {tldr}</p>
        </div>
      )}

      {legalReview && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-5 text-meta-lg text-warning">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span><strong>Editable professional draft.</strong> This must be reviewed and finalised by a qualified legal professional before you rely on it.</span>
        </div>
      )}

      <div className="prose-page">{children}</div>
    </article>
  );
}
