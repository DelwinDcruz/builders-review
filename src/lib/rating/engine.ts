/**
 * Rating engine for builders.review.
 *
 * Public rules (documented on /methodology):
 *  - Only APPROVED reviews count toward any public figure.
 *  - Averages are `null` (never 0) when there are no approved reviews.
 *  - Combining sources uses a REVIEW-COUNT-WEIGHTED mean. We never average
 *    platform averages without weighting by their review counts.
 *  - Learner, course, internship, mentor, career-support, website and EMPLOYEE
 *    scores are computed separately. Employee reviews are never merged into
 *    learner scores.
 *  - Displayed values are rounded to 1 decimal place, consistently.
 */
import type { PublicReview, RatingDistribution, RatingSummary, Review } from "../types";

export const isApproved = (r: Pick<Review, "status">) => r.status === "approved";
export const roundRating = (v: number) => Math.round(v * 10) / 10;
export const emptyDistribution = (): RatingDistribution => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

const clampStar = (n: number) => Math.min(5, Math.max(1, Math.round(n))) as 1 | 2 | 3 | 4 | 5;

/** Summarise reviews. Callers must pass only what should be counted. */
export function summarise(reviews: (PublicReview | Review)[]): RatingSummary {
  const approved = reviews.filter(isApproved);
  const count = approved.length;
  if (count === 0) {
    return { average: null, count: 0, distribution: emptyDistribution(), categoryAverages: [], verifiedCount: 0, recommendPercent: null };
  }

  const distribution = emptyDistribution();
  let sum = 0, verifiedCount = 0, recommendYes = 0, recommendKnown = 0;
  const cats = new Map<string, { sum: number; n: number }>();

  for (const r of approved) {
    sum += r.overallRating;
    distribution[clampStar(r.overallRating)] += 1;
    if (r.verified) verifiedCount += 1;
    if (r.wouldRecommend !== null && r.wouldRecommend !== undefined) {
      recommendKnown += 1;
      if (r.wouldRecommend) recommendYes += 1;
    }
    for (const c of r.categoryRatings) {
      const cur = cats.get(c.categoryKey) ?? { sum: 0, n: 0 };
      cur.sum += c.value; cur.n += 1;
      cats.set(c.categoryKey, cur);
    }
  }

  return {
    average: sum / count,
    count,
    distribution,
    categoryAverages: [...cats.entries()]
      .map(([categoryKey, { sum: s, n }]) => ({ categoryKey, average: s / n, count: n }))
      .sort((a, b) => b.count - a.count),
    verifiedCount,
    recommendPercent: recommendKnown ? Math.round((recommendYes / recommendKnown) * 100) : null
  };
}

export function verifiedPercentage(s: RatingSummary): number | null {
  return s.count === 0 ? null : Math.round((s.verifiedCount / s.count) * 100);
}

/** Screen-reader sentence for a star value. */
export function starLabel(value: number | null, count: number): string {
  if (value === null || count === 0) return "No approved reviews yet";
  return `${roundRating(value)} out of 5 stars from ${count} approved review${count === 1 ? "" : "s"}`;
}

// ---------------------------------------------------------------------------
// Count-weighted combination across sources (first-party + external summaries)
// ---------------------------------------------------------------------------
export interface Contribution {
  sourceSlug: string;
  /** normalized 0..5, or null when the source isn't star-compatible */
  normalized: number | null;
  reviewCount: number;
  /** true when only a platform aggregate is known (no per-review data) */
  isPlatformSummary: boolean;
}

export interface WeightedScore {
  average: number | null;
  reviewCount: number;
  sourceCount: number;
  hasPlatformSummaries: boolean;
}

export function weightedCombine(contributions: Contribution[]): WeightedScore {
  const valid = contributions.filter((c) => c.normalized !== null && c.reviewCount > 0);
  if (valid.length === 0) return { average: null, reviewCount: 0, sourceCount: 0, hasPlatformSummaries: false };
  let weighted = 0, weight = 0;
  for (const c of valid) { weighted += (c.normalized as number) * c.reviewCount; weight += c.reviewCount; }
  return {
    average: roundRating(weighted / weight),
    reviewCount: weight,
    sourceCount: new Set(valid.map((c) => c.sourceSlug)).size,
    hasPlatformSummaries: valid.some((c) => c.isPlatformSummary)
  };
}
