import Link from "next/link";
import type { ExperienceType } from "@/lib/programs";
import { getProgramPerformance, getReviews, getSummaryByExperience } from "@/lib/data/repo";
import { unifyFirstParty } from "@/lib/reviews/unify";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RatingSummaryCard } from "@/components/reviews/RatingSummaryCard";
import { RatingBars } from "@/components/charts/RatingBars";
import { CategoryBars } from "@/components/charts/CategoryBars";
import { ProgramCard } from "@/components/reviews/ProgramCard";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { NoReviewsState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { programHref } from "@/lib/reviews/links";
import { roundRating } from "@/lib/rating/engine";
import { formatNumber } from "@/lib/format";

/** Shared hub for course / internship / program / mentor / career / community reviews. */
export async function HubPage({ type, title, intro, crumb, path, question, showPrograms = true, answerOverride }:
  { type: ExperienceType; title: string; intro: string; crumb: string; path: string; question: string; showPrograms?: boolean; answerOverride?: string }) {
  const [summary, perf, latest] = await Promise.all([
    getSummaryByExperience(type),
    showPrograms ? getProgramPerformance(type) : Promise.resolve([]),
    getReviews({ experienceType: type, sort: "newest", pageSize: 6 })
  ]);
  const updated = new Date().toISOString().slice(0, 10);

  const answer = answerOverride ?? (summary.average !== null
    ? `Across ${formatNumber(summary.count)} approved review${summary.count === 1 ? "" : "s"} on builders.review, ${title.toLowerCase()} average ${roundRating(summary.average).toFixed(1)} out of 5${summary.recommendPercent !== null ? `, and ${summary.recommendPercent}% of reviewers who answered said they would recommend Portfolio Builders` : ""}. Read the individual reviews below rather than relying on the average alone.`
    : `There are no approved ${title.toLowerCase()} yet, so we show no rating rather than a fabricated one. Be the first to write one.`);

  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: crumb, path }]),
        perf.length ? itemListJsonLd(title, perf.map((p) => ({ name: p.program.title, path: programHref(p.program) }))) : undefined
      ]} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: crumb }]} />

      <header className="mb-8 max-w-3xl">
        <h1 className="font-display text-h2 font-extrabold tracking-tight lg:text-h2-lg">{title}</h1>
        <p className="mt-4 text-body-lg text-muted">{intro}</p>
        <p className="mt-3 text-meta text-muted">Last updated {updated}</p>
      </header>

      <div className="mb-12"><AnswerBlock question={question} answer={answer} updated={updated} sourceNote="From approved reviews on builders.review" /></div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RatingSummaryCard summary={summary} label={crumb} />
        <div className="card p-7">
          <h2 className="mb-5 text-card font-bold">Rating distribution</h2>
          {summary.count > 0 ? <RatingBars distribution={summary.distribution} total={summary.count} /> : <p className="text-body text-muted">No approved reviews yet.</p>}
        </div>
        <div className="card p-7">
          <h2 className="mb-5 text-card font-bold">By category</h2>
          <CategoryBars summary={summary} />
        </div>
      </div>

      {showPrograms && perf.length > 0 && (
        <Section title="All options, reviewed separately" description="Every one of these is listed on the official Portfolio Builders website.">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {perf.map((p, i) => <Reveal key={p.program.slug} delay={i * 40} className="h-full"><ProgramCard program={p.program} summary={p.summary} /></Reveal>)}
          </div>
        </Section>
      )}

      <Section title="Latest reviews" moreHref={`/reviews?experience=${type}`} moreLabel="All reviews">
        {latest.reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latest.reviews.map((r) => <ReviewCard key={r.slug} review={unifyFirstParty(r)} showExperience={false} />)}
          </div>
        ) : <NoReviewsState action={<ButtonLink href="/write-review">Write the first review</ButtonLink>} />}
      </Section>

      <p className="mt-10 text-meta-lg text-muted">
        Looking for something else? Browse <Link href="/reviews" className="font-semibold text-brand hover:underline">all reviews</Link>,{" "}
        <Link href="/compare" className="font-semibold text-brand hover:underline">compare programs</Link>, or read the{" "}
        <Link href="/methodology" className="font-semibold text-brand hover:underline">rating methodology</Link>.
      </p>
    </>
  );
}
