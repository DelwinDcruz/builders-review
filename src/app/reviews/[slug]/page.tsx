import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquareReply, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { getReviewBySlug, getRelatedReviews, getIndexableReviewSlugs } from "@/lib/data/repo";
import { getProgram } from "@/lib/programs";
import { CATEGORY_MAP } from "@/lib/categories";
import { unifyFirstParty } from "@/lib/reviews/unify";
import { programHref } from "@/lib/reviews/links";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ExperienceBadge } from "@/components/reviews/ExperienceBadge";
import { HelpfulReport } from "@/components/reviews/HelpfulReport";
import { SampleTag } from "@/components/ui/SampleBadge";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, reviewJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/format";
import { COMPANY } from "@/lib/site-config";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getIndexableReviewSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const r = await getReviewBySlug(params.slug);
  if (!r) return {};
  return pageMetadata({
    title: `${r.title} — Portfolio Builders review`,
    description: `${r.overallRating}-star Portfolio Builders review: ${r.body.slice(0, 150)}`,
    path: `/reviews/${r.slug}`
  });
}

export default async function ReviewDetail({ params }: { params: { slug: string } }) {
  const review = await getReviewBySlug(params.slug);
  if (!review) notFound();
  const related = await getRelatedReviews(review, 3);
  const program = review.programSlug ? getProgram(review.programSlug) : undefined;
  const path = `/reviews/${review.slug}`;

  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "All reviews", path: "/reviews" }, { name: review.title, path }]),
        reviewJsonLd(review, path)   // approved review only
      ]} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All reviews", href: "/reviews" }, { label: review.title }]} />

      <article className="mx-auto max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StarRating value={review.overallRating} size="lg" />
          <ExperienceBadge type={review.experienceType} />
          {review.verified ? <Badge tone="success">Verified reviewer</Badge> : <Badge>Unverified</Badge>}
          {review.isSample && <SampleTag />}
        </div>

        <h1 className="mt-3 font-display text-h2 font-extrabold leading-tight tracking-tight">{review.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-meta-lg text-muted">
          <span>By <strong className="text-fg">{review.reviewerDisplayName}</strong></span>
          <Badge>{review.relationship.replace("_", " ")}</Badge>
          {review.batch && <><span aria-hidden="true">·</span><span>{review.batch}</span></>}
          {program && <><span aria-hidden="true">·</span><span>Reviewed <Link href={programHref(program)} className="font-medium text-brand hover:underline">{program.title}</Link></span></>}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 text-meta text-muted">
          <span>Experience: {formatDate(review.experienceDate)}</span>
          <time dateTime={review.publishedAt ?? review.submittedAt}>Published {formatDate(review.publishedAt ?? review.submittedAt)}</time>
          {review.lastEditedAt && <span className="italic">Edited {formatDate(review.lastEditedAt)}</span>}
          <span>Submitted on builders.review</span>
        </div>

        <div className="prose-page mt-8"><p className="whitespace-pre-line !text-fg">{review.body}</p></div>

        {review.wouldRecommend !== null && (
          <p className={`mt-6 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-meta-lg font-semibold ${review.wouldRecommend ? "border-success/30 bg-success/10 text-success" : "border-warning/30 bg-warning/10 text-warning"}`}>
            {review.wouldRecommend ? <ThumbsUp size={15} aria-hidden="true" /> : <ThumbsDown size={15} aria-hidden="true" />}
            {review.wouldRecommend ? "Would recommend Portfolio Builders" : "Would not recommend Portfolio Builders"}
          </p>
        )}

        {review.outcome && (
          <p className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-surface-2 p-5 text-body">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <span><strong className="text-fg">Outcome:</strong> {review.outcome}</span>
          </p>
        )}

        {review.categoryRatings.length > 0 && (
          <div className="card mt-8 p-7">
            <h2 className="mb-4 text-meta font-bold uppercase tracking-wider text-muted">Category ratings</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {review.categoryRatings.map((c) => (
                <li key={c.categoryKey} className="flex items-center justify-between gap-3">
                  <span className="text-meta-lg">{CATEGORY_MAP[c.categoryKey]?.label ?? c.categoryKey}</span>
                  <StarRating value={c.value} size="sm" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {(review.pros.length > 0 || review.improvements.length > 0) && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {review.pros.length > 0 && (
              <div className="card p-6"><h2 className="mb-2 font-semibold text-success">Pros</h2>
                <ul className="space-y-1.5 text-body text-fg-secondary">{review.pros.map((p, i) => <li key={i} className="flex gap-2"><span aria-hidden="true" className="text-success">+</span>{p}</li>)}</ul></div>
            )}
            {review.improvements.length > 0 && (
              <div className="card p-6"><h2 className="mb-2 font-semibold text-warning">Areas for improvement</h2>
                <ul className="space-y-1.5 text-body text-fg-secondary">{review.improvements.map((p, i) => <li key={i} className="flex gap-2"><span aria-hidden="true" className="text-warning">△</span>{p}</li>)}</ul></div>
            )}
          </div>
        )}

        {review.companyResponse && (
          <div className="card mt-8 border-l-4 border-l-brand p-7">
            <h2 className="flex items-center gap-2 font-semibold"><MessageSquareReply size={18} className="text-brand" aria-hidden="true" /> Response from {review.companyResponse.authorName}</h2>
            <p className="mt-2 text-body text-fg-secondary">{review.companyResponse.body}</p>
            <p className="mt-2 text-meta text-muted">{formatDate(review.companyResponse.respondedAt)} · A company response never changes the review's rating.</p>
          </div>
        )}

        <div className="mt-10 border-t border-border pt-6">
          <HelpfulReport slug={review.slug} initialHelpful={review.helpfulCount} />
          <p className="mt-4 text-meta text-muted">
            This review was submitted on builders.review, verified by email where indicated, and moderated before publication.{" "}
            <a href={COMPANY.officialUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">Visit Portfolio Builders</a>
          </p>
        </div>
      </article>

      {related.length > 0 && (
        <Section title="More reviews like this">
          <div className="grid gap-6 md:grid-cols-3">{related.map((r) => <ReviewCard key={r.slug} review={unifyFirstParty(r)} />)}</div>
        </Section>
      )}
    </>
  );
}
