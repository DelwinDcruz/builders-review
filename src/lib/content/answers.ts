import "server-only";
import { COMPANY, SITE } from "../site-config";
import { roundRating } from "../rating/engine";
import { getLearnerSummary, getSummaryByExperience, getCategoryScore } from "../data/repo";
import { getCombinedLearnerScore, getEmployeeScore, getConnectedSources, getProfileForSource } from "../data/sources-repo";
import { formatNumber } from "../format";

export interface Answer { q: string; a: string; }

/**
 * AEO direct answers, generated ONLY from genuine approved/verified data.
 * When the data does not exist, we say so plainly — we never invent a rating,
 * a conclusion, or a claim that Portfolio Builders is or isn't "genuine".
 */
export async function buildAnswers(): Promise<Answer[]> {
  const [learner, combined, employee, course, internship, sources, google] = await Promise.all([
    getLearnerSummary(), getCombinedLearnerScore(), getEmployeeScore(),
    getSummaryByExperience("course"), getSummaryByExperience("internship"),
    getConnectedSources("learner"), getProfileForSource("google")
  ]);
  const placement = await getCategoryScore("placement_assistance");
  const out: Answer[] = [];

  out.push({
    q: "What is Portfolio Builders?",
    a: `${COMPANY.description} It is based at ${COMPANY.locations[0]?.locality}, ${COMPANY.locations[0]?.region}, and its official website is ${COMPANY.officialUrl}.`
  });

  out.push({
    q: "Is Portfolio Builders genuine?",
    a: learner.count > 0
      ? `Portfolio Builders is a real, operating company with a verifiable website (${COMPANY.officialUrl}), a listed Kochi address and published contact details. Whether it is right for you is a judgement you should make from the evidence: ${formatNumber(learner.count)} approved learner review${learner.count === 1 ? "" : "s"} on builders.review average ${roundRating(learner.average!).toFixed(1)} out of 5. We do not declare any company "genuine" or "not genuine" — we publish the reviews, the counts and the method, and let you decide.`
      : `Portfolio Builders is a real, operating company with a verifiable website (${COMPANY.officialUrl}), a listed Kochi address and published contact details. There are not yet enough approved reviews on builders.review to summarise what learners think, so we show no rating rather than a fabricated one.`
  });

  out.push({
    q: "What rating does Portfolio Builders have?",
    a: combined.average !== null
      ? `Combining ${formatNumber(combined.reviewCount)} learner review${combined.reviewCount === 1 ? "" : "s"} across ${combined.sourceCount} source${combined.sourceCount === 1 ? "" : "s"}, Portfolio Builders averages ${combined.average.toFixed(1)} out of 5. This is a review-count-weighted figure, not an average of platform averages. Employee reviews are excluded.`
      : "There are not yet enough approved learner reviews to publish a rating, so none is shown."
  });

  out.push({
    q: "Where can I read Portfolio Builders reviews?",
    a: sources.length > 0
      ? `On builders.review, and on the platforms where Portfolio Builders has a verified profile: ${sources.map((s) => s.def.name).join(", ")}. Each external review is attributed to its platform and links back to the original.`
      : "On builders.review. No third-party review profiles have been verified and connected yet, so we do not display ratings from any other platform."
  });

  out.push({
    q: "Where can I find Google reviews for Portfolio Builders?",
    a: google
      ? `A verified Google profile is connected. We show its rating${google.externalOverallRating !== null ? ` (${google.externalOverallRating} out of 5 from ${formatNumber(google.externalReviewCount ?? 0)} ratings)` : ""} and link straight to the Google profile. Google's API returns only a limited selection of reviews, so the reviews shown here are never the complete set — read them all on Google.`
      : "No verified Google profile is connected yet, so builders.review does not display a Google rating or review count. When one is connected we will show the rating, the total count and a direct link to the Google profile."
  });

  out.push({
    q: "What do students say about Portfolio Builders?",
    a: learner.count >= 3
      ? `Across ${formatNumber(learner.count)} approved reviews, the strongest themes are the ones reviewers raise themselves in their pros and improvement notes. ${learner.recommendPercent !== null ? `${learner.recommendPercent}% of reviewers who answered said they would recommend it. ` : ""}Read the reviews in full rather than relying on a summary — we do not editorialise on the reviewers' behalf.`
      : "There are too few approved reviews to summarise what students say. Read the individual reviews below."
  });

  out.push({
    q: "Are Portfolio Builders internships worth it?",
    a: internship.average !== null
      ? `Interns who reviewed the internships on builders.review rated them ${roundRating(internship.average).toFixed(1)} out of 5 across ${formatNumber(internship.count)} approved review${internship.count === 1 ? "" : "s"}. Whether that is "worth it" depends on what you need — credit documentation, project work, or mentorship. Read the internship reviews to judge for yourself.`
      : "There are no approved internship reviews yet, so we show no internship rating."
  });

  out.push({
    q: "How is the mentor support and placement assistance rated?",
    a: [
      placement.average !== null ? `Placement assistance averages ${roundRating(placement.average).toFixed(1)} out of 5 across ${formatNumber(placement.count)} rating${placement.count === 1 ? "" : "s"}.` : "Placement assistance has no approved category ratings yet.",
      course.average !== null ? `Courses average ${roundRating(course.average).toFixed(1)} out of 5.` : ""
    ].filter(Boolean).join(" ")
  });

  out.push({
    q: "Are reviews on builders.review verified?",
    a: `Every review submitted here requires email verification and passes human moderation before publication; ${learner.count > 0 ? `${learner.verifiedCount} of ${learner.count} approved reviews are verified` : "no reviews are approved yet"}. We never display a verified badge that was not earned.`
  });

  out.push({
    q: "How are ratings calculated?",
    a: "Only approved reviews count. Sources are combined using a review-count-weighted mean, never an average of platform averages. Learner, course, internship, mentor, career-support, website and employee scores are computed separately, and recommendation percentages, letter grades and upvotes are never converted into stars. The full method is published on the Methodology page."
  });

  out.push({
    q: "Are employee reviews included in the student rating?",
    a: employee.average !== null
      ? `No. Employee reviews are kept entirely separate and currently average ${employee.average.toFixed(1)} out of 5 across ${formatNumber(employee.reviewCount)} employee review${employee.reviewCount === 1 ? "" : "s"}. They never affect learner scores.`
      : "No. Employee reviews measure what it is like to work at Portfolio Builders, not to learn there, and are never merged into learner scores. No employee platform is connected yet."
  });

  out.push({
    q: "Can Portfolio Builders reply to reviews?",
    a: "Yes — one public response per review, clearly labelled as coming from the company. A response never changes the review's rating, and we do not remove genuine criticism."
  });

  out.push({
    q: "How can I submit a review?",
    a: `Use the Write a Review flow on ${SITE.name}. Choose your experience (course, internship, program, mentorship, portfolio service, career support, community or the website), pick the exact program, rate it, write your review, verify your email, and a moderator will check it against the review guidelines before it is published.`
  });

  return out;
}
