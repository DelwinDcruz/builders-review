import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, BadgeCheck, MessageSquareReply, Quote, ShieldQuestion, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import type { UnifiedReview } from "@/lib/reviews/unify";
import { sourceBrand, EXPERIENCE_META } from "@/lib/sources/branding";
import { SourceMark } from "@/components/sources/SourceMark";
import { ExperienceBadge } from "./ExperienceBadge";
import { StarRating } from "@/components/ui/StarRating";
import { SampleTag } from "@/components/ui/SampleBadge";
import { formatDate, formatNumber } from "@/lib/format";

/**
 * The platform's signature card. Source identity + origin label are always
 * explicit ("Submitted on builders.review" vs "Originally published on Google").
 */
export function ReviewCard({ review, showExperience = true }: { review: UnifiedReview; showExperience?: boolean }) {
  const b = sourceBrand(review.sourceSlug);
  const style = { ["--sa" as string]: b.accent } as CSSProperties;
  const meta = EXPERIENCE_META[review.experience] ?? EXPERIENCE_META.other;

  return (
    <article style={style}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition duration-300 ease-premium hover:-translate-y-1 hover:border-[rgb(var(--sa)/0.35)] hover:shadow-lg">
      <span aria-hidden="true" className="block h-1 w-full"
        style={{ background: b.accent2 ? `linear-gradient(90deg, rgb(${b.accent}), rgb(${b.accent2}))` : `rgb(${b.accent})` }} />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <SourceMark slug={review.sourceSlug} size={40} />
            <div className="min-w-0">
              <p className="truncate font-semibold leading-tight">{review.sourceName}</p>
              <p className="truncate text-meta text-muted">{review.author}</p>
            </div>
          </div>
          {showExperience && <ExperienceBadge type={review.experience} size="sm" />}
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          {review.rating !== null
            ? <><StarRating value={review.rating} size="md" /><span className="text-meta text-muted">{review.ratingLabel}</span></>
            : <span className="rounded-md bg-surface-2 px-2 py-1 text-meta-lg font-semibold">{review.ratingLabel}</span>}
        </div>

        {review.programTitle && (
          <p className="mb-2 text-meta-lg font-medium text-muted">
            {review.programSlug
              ? <Link href={`/programs/${review.programSlug}`} className="hover:text-brand">{review.programTitle}</Link>
              : review.programTitle}
          </p>
        )}

        <Quote size={20} className="mb-1 text-[rgb(var(--sa)/0.35)]" aria-hidden="true" />
        {review.title && (
          <h3 className="mb-1.5 text-card font-semibold leading-snug">
            {review.internalHref ? <Link href={review.internalHref} className="hover:text-brand">{review.title}</Link> : review.title}
          </h3>
        )}
        <p className="mb-4 line-clamp-4 flex-1 text-body text-fg-secondary">
          {review.excerpt}
          {review.isExcerpt && review.externalHref && (
            <> <a href={review.externalHref} target="_blank" rel="noopener noreferrer nofollow" className="whitespace-nowrap font-semibold text-[rgb(var(--sa))] hover:underline">Continue reading on {review.sourceName} →</a></>
          )}
        </p>

        {(review.pros.length > 0 || review.improvements.length > 0) && (
          <dl className="mb-4 grid gap-2 text-meta-lg">
            {review.pros.length > 0 && (
              <div><dt className="font-semibold text-success">Pros</dt>
                <dd className="text-muted">{review.pros.slice(0, 2).join(" · ")}</dd></div>
            )}
            {review.improvements.length > 0 && (
              <div><dt className="font-semibold text-warning">Areas for improvement</dt>
                <dd className="text-muted">{review.improvements.slice(0, 2).join(" · ")}</dd></div>
            )}
          </dl>
        )}

        {review.outcome && (
          <p className="mb-4 flex items-start gap-2 rounded-lg bg-surface-2 p-3 text-meta-lg text-fg-secondary">
            <Sparkles size={14} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <span><span className="font-semibold text-fg">Outcome:</span> {review.outcome}</span>
          </p>
        )}

        <div className="mt-auto space-y-3 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta text-muted">
            {review.experienceDate && <span>Experience: {formatDate(review.experienceDate)}</span>}
            {review.publishedDate && <><span aria-hidden="true">·</span><time dateTime={review.publishedDate}>Published {formatDate(review.publishedDate)}</time></>}
            {typeof review.helpfulCount === "number" && review.helpfulCount > 0 && (
              <><span aria-hidden="true">·</span><span className="inline-flex items-center gap-1"><ThumbsUp size={12} aria-hidden="true" />{formatNumber(review.helpfulCount)}</span></>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {review.verified
              ? <span className="inline-flex items-center gap-1 text-meta font-semibold text-success"><BadgeCheck size={13} aria-hidden="true" />{review.verificationLabel}</span>
              : <span className="inline-flex items-center gap-1 text-meta font-medium text-muted"><ShieldQuestion size={13} aria-hidden="true" />{review.verificationLabel}</span>}
            {review.wouldRecommend === true && <span className="inline-flex items-center gap-1 text-meta font-semibold text-success"><ThumbsUp size={12} aria-hidden="true" /> Recommends</span>}
            {review.wouldRecommend === false && <span className="inline-flex items-center gap-1 text-meta font-semibold text-warning"><ThumbsDown size={12} aria-hidden="true" /> Does not recommend</span>}
            {review.companyResponse && <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-meta text-fg-secondary"><MessageSquareReply size={12} aria-hidden="true" /> Company responded</span>}
            {review.isSample && <SampleTag />}
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-meta text-muted">
              {review.originLabel}
              {review.partialSelection && <span className="block">Google shows only a limited selection of reviews.</span>}
            </p>
            {review.origin === "external" && review.externalHref ? (
              <a href={review.externalHref} target="_blank" rel="noopener noreferrer nofollow"
                className="inline-flex shrink-0 items-center gap-1 text-meta-lg font-semibold text-[rgb(var(--sa))] hover:underline">
                Read original <ArrowUpRight size={14} className="transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
            ) : review.internalHref ? (
              <Link href={review.internalHref} className="inline-flex items-center gap-1 text-meta-lg font-semibold text-brand hover:underline">
                Read review <ArrowUpRight size={14} className="transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          <span className="sr-only">{meta.blurb}</span>
        </div>
      </div>
    </article>
  );
}
