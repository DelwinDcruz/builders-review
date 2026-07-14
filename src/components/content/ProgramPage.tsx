import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Program } from "@/lib/programs";
import { getReviews, getSummaryByProgram } from "@/lib/data/repo";
import { unifyFirstParty } from "@/lib/reviews/unify";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RatingSummaryCard } from "@/components/reviews/RatingSummaryCard";
import { RatingBars } from "@/components/charts/RatingBars";
import { CategoryBars } from "@/components/charts/CategoryBars";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ExperienceBadge } from "@/components/reviews/ExperienceBadge";
import { Section } from "@/components/ui/Section";
import { NoReviewsState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/jsonld";
import { programHref } from "@/lib/reviews/links";
import { roundRating } from "@/lib/rating/engine";
import { formatNumber } from "@/lib/format";
import { COMPANY } from "@/lib/site-config";

export async function ProgramPage({ program, hub }: { program: Program; hub: { label: string; href: string } }) {
  const [summary, latest] = await Promise.all([
    getSummaryByProgram(program.slug),
    getReviews({ programSlug: program.slug, sort: "newest", pageSize: 9 })
  ]);
  const path = programHref(program);
  const updated = new Date().toISOString().slice(0, 10);

  const answer = summary.average !== null
    ? `${program.title} is rated ${roundRating(summary.average).toFixed(1)} out of 5 from ${formatNumber(summary.count)} approved review${summary.count === 1 ? "" : "s"} on builders.review${summary.recommendPercent !== null ? `, with ${summary.recommendPercent}% of reviewers who answered saying they would recommend it` : ""}. ${program.summary}`
    : `${program.title} has no approved reviews yet, so no rating is shown. ${program.summary} Be the first to review it.`;

  // Course markup only for genuine courses, and only when the rating is visible.
  const course = courseJsonLd(program, summary, path);

  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: hub.label, path: hub.href }, { name: program.title, path }]),
        course
      ]} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: hub.label, href: hub.href }, { label: program.title }]} />

      <header className="mb-8 max-w-3xl">
        <div className="mb-3"><ExperienceBadge type={program.type} /></div>
        <h1 className="font-display text-h2 font-extrabold tracking-tight lg:text-h2-lg">{program.title} reviews</h1>
        <p className="mt-4 text-body-lg text-muted">{program.seoIntro}</p>
        <p className="mt-3 text-body text-fg-secondary">{program.summary}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href={`/write-review?experience=${program.type}&program=${program.slug}`} variant="accent">Review this {program.type === "internship" ? "internship" : program.type === "course" ? "course" : "program"}</ButtonLink>
          {program.officialUrl.startsWith("http") && (
            <a href={program.officialUrl} target="_blank" rel="noopener noreferrer nofollow"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-5 font-semibold hover:border-border-strong">
              Official page on portfoliobuilders.in <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
        </div>
        <p className="mt-4 text-meta text-muted">
          Program details sourced from the{" "}
          <a href={COMPANY.officialUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline underline-offset-4">official website</a>, checked {COMPANY.factsCheckedAt}. Page updated {updated}.
        </p>
      </header>

      <div className="mb-12"><AnswerBlock question={`What do reviewers say about the ${program.title}?`} answer={answer} updated={updated} /></div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RatingSummaryCard summary={summary} label={program.title} />
        <div className="card p-7">
          <h2 className="mb-5 text-card font-bold">Rating distribution</h2>
          {summary.count > 0 ? <RatingBars distribution={summary.distribution} total={summary.count} /> : <p className="text-body text-muted">No approved reviews yet.</p>}
        </div>
        <div className="card p-7">
          <h2 className="mb-5 text-card font-bold">By category</h2>
          <CategoryBars summary={summary} />
        </div>
      </div>

      <Section title="Reviews" moreHref={`/reviews?program=${program.slug}`} moreLabel="All reviews">
        {latest.reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latest.reviews.map((r) => <ReviewCard key={r.slug} review={unifyFirstParty(r)} showExperience={false} />)}
          </div>
        ) : (
          <NoReviewsState action={<ButtonLink href={`/write-review?experience=${program.type}&program=${program.slug}`}>Write the first review</ButtonLink>} />
        )}
      </Section>

      <p className="mt-10 text-meta-lg text-muted">
        Back to <Link href={hub.href} className="font-semibold text-brand hover:underline">{hub.label}</Link> ·{" "}
        <Link href="/compare" className="font-semibold text-brand hover:underline">Compare programs</Link>
      </p>
    </>
  );
}
