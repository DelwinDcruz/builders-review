import { ContentLayout } from "@/components/content/ContentLayout";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Review methodology — how Portfolio Builders ratings are calculated",
  description: "Exactly how builders.review calculates Portfolio Builders ratings: approved reviews only, review-count weighting, and separate learner, course, internship, mentor, career-support, website and employee scores.",
  path: "/methodology"
});

const faqs = [
  { q: "How is the overall learner score calculated?", a: "It is the review-count-weighted mean of every star-compatible learner source: reviews approved on builders.review plus the rating from any verified external platform. Each source is weighted by how many reviews sit behind its figure — we never average platform averages." },
  { q: "Are employee reviews included?", a: "No. Employee reviews from Glassdoor, AmbitionBox and Indeed measure what it is like to work at Portfolio Builders, not learn there. They are scored separately and never merged into learner scores." },
  { q: "What happens when there are no approved reviews?", a: "We show no rating at all — never a placeholder, never a zero, never a fabricated number." },
  { q: "Are Facebook recommendations or BBB grades converted into stars?", a: "Never. A recommendation percentage and a letter grade are not star ratings. They are shown in their original form, or not at all." }
];

export default function Page() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Methodology", path: "/methodology" }]), faqJsonLd(faqs)]} />
      <ContentLayout title="Review methodology" updated="2026-07-09"
        crumbs={[{ label: "Home", href: "/" }, { label: "Methodology" }]}
        intro="A rating is only useful if you can check the arithmetic. Here is every rule we apply."
        tldr="Only approved reviews count. Sources are combined with a review-count-weighted mean, never an average of platform averages. Learner, course, internship, mentor, career-support, website and employee scores are all calculated separately, and no rating is shown when there are no approved reviews.">

        <div className="not-prose mb-10">
          <AnswerBlock question="How are Portfolio Builders ratings calculated on builders.review?"
            answer="Only approved reviews count. When we combine reviews written here with a verified external platform's rating, we weight each source by the number of reviews behind it. Learner, course, internship, mentor, career-support, website and employee scores are calculated separately, and employee reviews never affect learner ratings."
            updated="2026-07-09" />
        </div>

        <h2>What counts toward a rating</h2>
        <p>Only reviews with an <strong>approved</strong> status contribute to any public figure. Draft, pending-verification, pending-moderation, rejected, flagged, spam and removed reviews are excluded from every calculation.</p>

        <h2>Review-count weighting</h2>
        <p>When we combine our own reviews with an external platform's rating, we use a <strong>review-count-weighted mean</strong>. Concretely: multiply each source's rating by its review count, add those together, and divide by the total number of reviews.</p>
        <p>This is deliberately <em>not</em> an average of platform averages. If builders.review holds 100 reviews averaging 4.0 and a platform shows 5.0 from 2 reviews, the average of averages would be 4.5 — but the correct weighted figure is (4.0×100 + 5.0×2) ÷ 102 = <strong>4.0</strong>. We publish the weighted number.</p>

        <h2>Separate scores, never blended</h2>
        <p>We publish these independently, because they measure different things:</p>
        <ul>
          <li><strong>Overall learner score</strong> — every learner-facing experience, excluding website-experience reviews.</li>
          <li><strong>Course score</strong> — course reviews only.</li>
          <li><strong>Internship score</strong> — internship reviews only.</li>
          <li><strong>Mentor score</strong> — mentorship reviews only.</li>
          <li><strong>Career-support score</strong> — career guidance; <strong>placement assistance</strong> is tracked as its own category so it can't hide behind a strong course score.</li>
          <li><strong>Website score</strong> — reviews of portfoliobuilders.in itself.</li>
          <li><strong>Employee score</strong> — from employee platforms only, shown apart and never merged into any learner figure.</li>
        </ul>

        <h2>What never becomes a star rating</h2>
        <p>Facebook records recommendations, not stars. The Better Business Bureau issues letter grades, not stars. We never convert either into a star value, and they never enter a combined score. They are displayed in their original form or omitted.</p>

        <h2>External sources and their limits</h2>
        <p>A platform appears only when Portfolio Builders has a genuine profile there that an administrator has verified. Where a platform's API returns only a subset of its reviews — Google's Places API historically returns up to five — we say so plainly and link to the source. We never claim a limited selection is the complete set, and we never scrape.</p>
        <p>Every external figure carries a “last synchronized” or “last verified” date. We do not describe data as live or real-time unless it actually is.</p>

        <h2>Rounding and display</h2>
        <p>Averages are rounded to one decimal place, consistently, everywhere. The calculation uses full precision; only the display is rounded. Every average is shown next to its review count so you can judge how much weight it deserves.</p>

        <h2>Recalculation</h2>
        <p>Ratings are recalculated whenever a review is approved, edited or removed. Removing or rejecting a review immediately excludes it from every figure.</p>

        <h2>What “verified” means</h2>
        <p>A verified review is one where the reviewer confirmed their email address. Verification does not change a review's score — it only tells you the reviewer's identity was checked. We never display a badge that wasn't earned. See the <a href="/verification-policy">verification policy</a>.</p>

        <h2>Conflict of interest</h2>
        <p>builders.review is operated in connection with Portfolio Builders. We disclose that openly rather than posing as an independent third party. We never offer rewards in exchange for positive reviews, and we never remove a genuine review because it is critical. Read the full disclosure on our <a href="/about">About</a> page.</p>
      </ContentLayout>
    </>
  );
}
