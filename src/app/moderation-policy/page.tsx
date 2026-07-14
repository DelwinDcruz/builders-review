import { ContentLayout } from "@/components/content/ContentLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({
  title: "Moderation policy — how Portfolio Builders reviews are checked",
  description: "How every review on builders.review is moderated before publication, what gets rejected, how reports are handled, and why genuine criticism is never removed.",
  path: "/moderation-policy"
});
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Moderation policy", path: "/moderation-policy" }])} />
      <ContentLayout title="Moderation policy" updated="2026-07-09"
        crumbs={[{ label: "Home", href: "/" }, { label: "Moderation policy" }]}
        intro="Every review is read before it appears. This page explains how, and what you can expect."
        tldr="Reviews are never auto-published. After email verification, a moderator checks each review against the guidelines. We record a reason for every rejection, and we never remove a genuine review just because it is negative.">
        <h2>The flow</h2>
        <p>Submitted → pending verification (email) → pending moderation → approved or rejected. A review is counted and displayed only once it reaches <strong>approved</strong>. There is no auto-publish path.</p>

        <h2>Checks we run</h2>
        <ul>
          <li><strong>Email verification</strong> to confirm the reviewer.</li>
          <li><strong>Duplicate detection</strong> — one review per person per program.</li>
          <li><strong>Spam and abuse signals</strong> (banned terms, embedded links, excessive capitalisation, profanity).</li>
          <li><strong>Rate limiting</strong> on submissions to deter automated abuse.</li>
          <li><strong>Human judgement</strong> against the review guidelines.</li>
        </ul>

        <h2>What we will not do</h2>
        <p>We will <strong>not</strong> reject or remove a review because it is critical of Portfolio Builders. Negative reviews that describe a genuine first-hand experience are published exactly like positive ones. We will not offer, and reviewers must not accept, any reward conditional on a positive rating.</p>
        <p>Because builders.review is operated in connection with Portfolio Builders, this rule matters more here than it would on an independent site. It is enforced in our moderation process and recorded in an internal audit log.</p>

        <h2>Rejection reasons</h2>
        <p>Every rejection or removal records a transparent reason: not first-hand, contains personal data, promotional, duplicate, abusive, or failed verification. Where the issue is fixable, reviewers may edit and resubmit.</p>

        <h2>Reports</h2>
        <p>Anyone can report a published review. Reports queue for a moderator, who assesses them against the guidelines. Removed reviews retain an internal audit record.</p>

        <h2>Company responses</h2>
        <p>Portfolio Builders may post one public response per review. Responses are clearly attributed, moderated to the same standard, and never change the review's rating.</p>
      </ContentLayout>
    </>
  );
}
