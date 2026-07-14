import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, BookOpen, Briefcase, Route, Users, LayoutGrid, Compass, MessagesSquare, Monitor, Star } from "lucide-react";
import { EXPERIENCE_META, type ExpKey } from "@/lib/sources/branding";
import { StarRating } from "@/components/ui/StarRating";
import type { RatingSummary } from "@/lib/types";
import { formatDate, pluralize } from "@/lib/format";

const ICONS = { book: BookOpen, briefcase: Briefcase, route: Route, users: Users, layout: LayoutGrid, compass: Compass, messages: MessagesSquare, monitor: Monitor, star: Star };

/** "Browse reviews by experience" card. */
export function ExperienceCard({ type, href, summary, latestDate, label }:
  { type: ExpKey; href: string; summary: RatingSummary; latestDate?: string; label?: string }) {
  const meta = EXPERIENCE_META[type];
  const Icon = ICONS[meta.icon];
  const style = { ["--ea" as string]: meta.accent } as CSSProperties;
  return (
    <Link href={href} style={style}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition duration-300 ease-premium hover:-translate-y-1 hover:border-[rgb(var(--ea)/0.35)] hover:shadow-lg">
      <span aria-hidden="true" className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--ea)/0.10)] text-[rgb(var(--ea))]"><Icon size={22} /></span>
      <h3 className="text-card font-bold">{label ?? meta.plural}</h3>
      <p className="mt-1.5 flex-1 text-meta-lg text-muted">{meta.blurb}</p>

      <div className="mt-5 border-t border-border pt-4">
        {summary.average !== null ? (
          <>
            <div className="flex items-center gap-2">
              <span className="font-display text-h3 font-extrabold tabular-nums">{summary.average.toFixed(1)}</span>
              <StarRating value={summary.average} showNumber={false} size="sm" />
            </div>
            <p className="mt-1 text-meta text-muted">
              {pluralize(summary.count, "review")}{latestDate ? ` · latest ${formatDate(latestDate)}` : ""}
            </p>
          </>
        ) : <p className="text-meta-lg text-muted">No reviews yet</p>}
        <span className="mt-3 inline-flex items-center gap-1 text-meta-lg font-semibold text-[rgb(var(--ea))]">
          Explore <ArrowRight size={14} className="transition-transform duration-fast group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
