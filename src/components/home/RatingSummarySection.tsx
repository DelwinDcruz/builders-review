import Link from "next/link";
import { getLearnerSummary } from "@/lib/data/repo";
import { getCombinedLearnerScore, getEmployeeScore } from "@/lib/data/sources-repo";
import { Section } from "@/components/ui/Section";
import { RatingSummaryCard } from "@/components/reviews/RatingSummaryCard";
import { RatingBars } from "@/components/charts/RatingBars";
import { CategoryBars } from "@/components/charts/CategoryBars";
import { StarRating } from "@/components/ui/StarRating";
import { pluralize } from "@/lib/format";

export async function RatingSummarySection() {
  const [learner, combined, employee] = await Promise.all([getLearnerSummary(), getCombinedLearnerScore(), getEmployeeScore()]);

  return (
    <Section eyebrow="Rating summary" title="Portfolio Builders rating summary"
      description="Learner scores combine our reviews with verified platform ratings, weighted by review count. Employee reviews are shown separately and never mixed in.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <RatingSummaryCard summary={learner} label="Reviews on builders.review" />
          <div className="card p-7">
            <p className="text-meta font-bold uppercase tracking-wider text-muted">Combined learner score</p>
            {combined.average !== null ? (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <span className="font-display text-h3 font-extrabold tabular-nums">{combined.average.toFixed(1)}</span>
                  <StarRating value={combined.average} showNumber={false} size="sm" />
                </div>
                <p className="mt-2 text-meta-lg text-muted">
                  {pluralize(combined.reviewCount, "review")} across {pluralize(combined.sourceCount, "source")}
                  {combined.hasPlatformSummaries && " · includes platform-level summaries"}
                </p>
              </>
            ) : <p className="mt-3 text-body text-muted">Not enough data to combine sources yet.</p>}
          </div>
          <div className="card p-7">
            <p className="text-meta font-bold uppercase tracking-wider text-muted">Employee experience (separate)</p>
            {employee.average !== null ? (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <span className="font-display text-h3 font-extrabold tabular-nums">{employee.average.toFixed(1)}</span>
                  <StarRating value={employee.average} showNumber={false} size="sm" />
                </div>
                <p className="mt-2 text-meta-lg text-muted">From employee platforms only. Never included in learner scores.</p>
              </>
            ) : <p className="mt-3 text-body text-muted">No employee review platform is connected. Employee ratings would never be merged into learner scores.</p>}
          </div>
        </div>

        <div className="card p-7">
          <h3 className="mb-5 text-card font-bold">Rating distribution</h3>
          {learner.count > 0 ? <RatingBars distribution={learner.distribution} total={learner.count} /> : <p className="text-body text-muted">No approved reviews yet.</p>}
        </div>

        <div className="card p-7">
          <h3 className="mb-5 text-card font-bold">Ratings by category</h3>
          <CategoryBars summary={learner} />
          <Link href="/methodology" className="mt-5 inline-block text-meta-lg font-semibold text-brand hover:underline">How these are calculated →</Link>
        </div>
      </div>
    </Section>
  );
}
