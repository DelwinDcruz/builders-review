import Link from "next/link";
import { getCategoryScore, getReviews } from "@/lib/data/repo";
import { unifyFirstParty } from "@/lib/reviews/unify";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { NoReviewsState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { roundRating } from "@/lib/rating/engine";
import { formatNumber, pluralize } from "@/lib/format";

export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Portfolio Builders placement support reviews",
  description: "What students say about Portfolio Builders placement assistance — how much help they received finding roles, and how expectations compared with reality.",
  path: "/placement-support"
});

/** Placement is a CATEGORY, not an experience type — scored from category ratings. */
export default async function Page() {
  const score = await getCategoryScore("placement_assistance");
  const { reviews } = await getReviews({ category: "placement_assistance", sort: "newest", pageSize: 9 });
  const updated = new Date().toISOString().slice(0, 10);

  const answer = score.average !== null
    ? `Reviewers who rated placement assistance gave it ${roundRating(score.average).toFixed(1)} out of 5 across ${pluralize(score.count, "rating")}. Placement assistance is scored separately from career guidance — they are not the same thing. Read the reviews below for what reviewers actually experienced.`
    : "No reviewer has rated placement assistance yet, so we show no score. Placement assistance is tracked separately from career guidance.";

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Placement support reviews", path: "/placement-support" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Placement support reviews" }]} />

      <header className="mb-8 max-w-3xl">
        <h1 className="font-display text-h2 font-extrabold tracking-tight lg:text-h2-lg">Portfolio Builders placement support reviews</h1>
        <p className="mt-4 text-body-lg text-muted">
          Placement assistance is rated as its own category, so it can't be hidden behind a strong course score. These are the reviews from people who rated it.
        </p>
        <p className="mt-3 text-meta text-muted">Last updated {updated}</p>
      </header>

      <div className="mb-12"><AnswerBlock question="How useful is the Portfolio Builders placement support?" answer={answer} updated={updated} /></div>

      <div className="card mb-12 max-w-md p-7">
        <p className="text-meta font-bold uppercase tracking-wider text-muted">Placement assistance</p>
        {score.average !== null ? (
          <>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-[3rem] font-extrabold leading-none tabular-nums">{roundRating(score.average).toFixed(1)}</span>
              <span className="text-body-lg text-muted">/ 5</span>
            </div>
            <div className="mt-3"><StarRating value={score.average} showNumber={false} /></div>
            <p className="mt-3 text-meta-lg text-muted">From {formatNumber(score.count)} category ratings</p>
          </>
        ) : <p className="mt-3 text-body text-muted">No ratings yet — we show no score rather than a fabricated one.</p>}
      </div>

      <Section title="Reviews mentioning placement support">
        {reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => <ReviewCard key={r.slug} review={unifyFirstParty(r)} />)}
          </div>
        ) : <NoReviewsState action={<ButtonLink href="/write-review">Write a review</ButtonLink>} />}
      </Section>

      <p className="mt-10 text-meta-lg text-muted">
        See also <Link href="/career-support" className="font-semibold text-brand hover:underline">career support reviews</Link> and the{" "}
        <Link href="/methodology" className="font-semibold text-brand hover:underline">rating methodology</Link>.
      </p>
    </>
  );
}
