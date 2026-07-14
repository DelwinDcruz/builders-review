/** Dependency-free assertions. Run: npm run test:rating */
import { summarise, weightedCombine, roundRating, verifiedPercentage, type Contribution } from "./engine";
import type { Review } from "../types";

let pass = 0, fail = 0;
const A = (n: string, c: boolean) => { c ? (pass++, console.log("  ok  -", n)) : (fail++, console.error("FAIL  -", n)); };

const mk = (status: Review["status"], overall: number, verified = false, rec: boolean | null = null): Review => ({
  id: "x", slug: "s", experienceType: "course", programSlug: "ui-ux-course", title: "t", body: "b",
  overallRating: overall, categoryRatings: [], pros: [], improvements: [], wouldRecommend: rec,
  reviewerDisplayName: "n", relationship: "student", experienceDate: "2026-01-01",
  verified, status, helpfulCount: 0, reportCount: 0, isSample: true, submittedAt: "2026-01-01"
});

A("null average when no approved reviews", summarise([mk("pending_moderation", 5), mk("rejected", 1)]).average === null);
const s = summarise([mk("approved", 4), mk("approved", 2), mk("rejected", 1)]);
A("average ignores non-approved", s.average === 3 && s.count === 2);
A("distribution", summarise([mk("approved", 5), mk("approved", 5), mk("approved", 3)]).distribution[5] === 2);
A("verified %", verifiedPercentage(summarise([mk("approved", 5, true), mk("approved", 4, false)])) === 50);
A("recommend %", summarise([mk("approved", 5, true, true), mk("approved", 4, true, false)]).recommendPercent === 50);
A("recommend null when unknown", summarise([mk("approved", 5)]).recommendPercent === null);

// Count-weighted, NOT average-of-averages.
// builders.review: 4.0 across 100 reviews. Google: 5.0 across 2 reviews.
// avg-of-avgs = 4.5 (wrong). weighted = (4*100 + 5*2)/102 = 4.02 -> 4.0
const c: Contribution[] = [
  { sourceSlug: "builders-review", normalized: 4.0, reviewCount: 100, isPlatformSummary: false },
  { sourceSlug: "google", normalized: 5.0, reviewCount: 2, isPlatformSummary: true }
];
const w = weightedCombine(c);
A("count-weighted (4.0), not avg-of-avgs (4.5)", w.average === 4.0 && roundRating((4 + 5) / 2) === 4.5);
A("weighted totals", w.reviewCount === 102 && w.sourceCount === 2 && w.hasPlatformSummaries);
A("non-star sources excluded", weightedCombine([{ sourceSlug: "bbb", normalized: null, reviewCount: 9, isPlatformSummary: true }]).average === null);
A("rounding", roundRating(3.666) === 3.7 && roundRating(4.24) === 4.2);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
