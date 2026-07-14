import type { CSSProperties } from "react";
import { BadgeCheck } from "lucide-react";
import type { UnifiedReview } from "@/lib/reviews/unify";
import { sourceBrand } from "@/lib/sources/branding";
import { SourceMark } from "@/components/sources/SourceMark";
import { StarRating } from "@/components/ui/StarRating";
import { ExperienceBadge } from "@/components/reviews/ExperienceBadge";
import type { SourceOverview } from "@/lib/data/sources-repo";
import { formatNumber } from "@/lib/format";

/** Floating learner-review cards + a source rating card (only when connected). */
export function HeroCards({ reviews, google }: { reviews: UnifiedReview[]; google?: SourceOverview }) {
  const offsets = ["lg:translate-x-6", "lg:-translate-x-4", "lg:translate-x-10"];
  const floats = ["", "float-slow", ""];

  return (
    <div className="relative space-y-4">
      {google?.connected && google.normalized !== null && (
        <div className="rounded-xl border border-border bg-surface p-5 shadow-lg lg:-translate-x-6">
          <div className="flex items-center gap-3">
            <SourceMark slug="google" size={40} />
            <div>
              <p className="text-meta-lg font-bold leading-tight">Google rating</p>
              <p className="text-meta text-muted">{formatNumber(google.platformCount)} ratings on Google</p>
            </div>
          </div>
          <div className="mt-3"><StarRating value={google.normalized} size="lg" /></div>
        </div>
      )}

      {reviews.slice(0, 3).map((r, i) => {
        const b = sourceBrand(r.sourceSlug);
        const style = { ["--sa" as string]: b.accent, animationDelay: `${i * 900}ms` } as CSSProperties;
        return (
          <div key={r.key} style={style}
            className={`rounded-xl border border-border bg-surface p-5 shadow-lg transition-transform duration-500 ease-premium hover:-translate-y-1 ${offsets[i] ?? ""} ${floats[i] ?? ""}`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <SourceMark slug={r.sourceSlug} size={36} />
                <div className="min-w-0">
                  <p className="truncate text-meta-lg font-bold leading-tight">{r.sourceName}</p>
                  <p className="truncate text-meta text-muted">{r.author}</p>
                </div>
              </div>
              <ExperienceBadge type={r.experience} size="sm" />
            </div>
            {r.rating !== null ? <StarRating value={r.rating} size="sm" /> : <span className="text-meta-lg font-semibold">{r.ratingLabel}</span>}
            <p className="mt-2 line-clamp-2 text-meta-lg text-fg-secondary">{r.excerpt}</p>
            {r.verified && (
              <p className="mt-3 inline-flex items-center gap-1 text-meta font-semibold text-success">
                <BadgeCheck size={12} aria-hidden="true" /> {r.verificationLabel}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
