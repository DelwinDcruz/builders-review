import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Program } from "@/lib/programs";
import type { RatingSummary } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { ExperienceBadge } from "./ExperienceBadge";
import { pluralize } from "@/lib/format";
import { programHref } from "@/lib/reviews/links";

export function ProgramCard({ program, summary }: { program: Program; summary: RatingSummary }) {
  return (
    <article className="card card-lift group flex h-full flex-col p-6">
      <div className="mb-3"><ExperienceBadge type={program.type} size="sm" /></div>
      <h3 className="text-card font-bold leading-snug">
        <Link href={programHref(program)} className="hover:text-brand">{program.title}</Link>
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-body text-fg-secondary">{program.summary}</p>

      <div className="mt-5 border-t border-border pt-4">
        {summary.average !== null
          ? <div className="flex items-center gap-2">
              <StarRating value={summary.average} size="sm" />
              <span className="text-meta text-muted">{pluralize(summary.count, "review")}</span>
            </div>
          : <p className="text-meta-lg text-muted">No reviews yet</p>}

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link href={programHref(program)} className="inline-flex items-center gap-1 text-meta-lg font-semibold text-brand hover:underline">
            Read reviews <ArrowRight size={14} className="transition-transform duration-fast group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          {program.officialUrl.startsWith("http") && (
            <a href={program.officialUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-meta text-muted hover:text-fg">
              Official page <ExternalLink size={11} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
