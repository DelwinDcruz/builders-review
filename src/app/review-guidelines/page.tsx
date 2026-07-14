import { ContentLayout } from "@/components/content/ContentLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({
  title: "Review guidelines — writing a Portfolio Builders review",
  description: "The rules every review on builders.review must follow: genuine first-hand experience, respectful language, no confidential information, no spam, and no incentivised ratings.",
  path: "/review-guidelines"
});
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Review guidelines", path: "/review-guidelines" }])} />
      <ContentLayout title="Review guidelines" updated="2026-07-09"
        crumbs={[{ label: "Home", href: "/" }, { label: "Review guidelines" }]}
        intro="These rules keep reviews useful and fair. By submitting a review you agree to follow them."
        tldr="Write only about your own genuine, first-hand experience. Be specific and respectful. Don't share confidential or personal data, don't post duplicates or promotional spam, and never accept a reward for a positive rating.">
        <h2>What we welcome</h2>
        <ul>
          <li><strong>Genuine, first-hand experience</strong> of a course, internship, program, mentor, portfolio service, career support, the community or the website.</li>
          <li><strong>Specific detail.</strong> “The FYUGP documentation was checked before submission” helps more than “it was good”.</li>
          <li><strong>Honest criticism.</strong> Negative reviews are published, and are never removed for being negative.</li>
        </ul>

        <h2>What isn't allowed</h2>
        <ul>
          <li><strong>Personal attacks</strong> on mentors, staff or other students.</li>
          <li><strong>Confidential information</strong> — contracts, private messages, or anyone's personal data.</li>
          <li><strong>Duplicate reviews</strong> of the same experience. Edit your existing review instead.</li>
          <li><strong>Promotional spam</strong>, advertising, links or referral codes.</li>
          <li><strong>Fabricated experiences</strong>, or reviews written by someone who did not take part.</li>
          <li><strong>Incentivised ratings.</strong> No payment, discount, certificate or reward may be offered or accepted in return for a positive review.</li>
          <li><strong>Illegal, hateful or discriminatory content.</strong></li>
        </ul>

        <h2>Rejection and removal</h2>
        <p>A review may be rejected during moderation, or removed after publication, if it breaks any rule above, cannot be verified, appears fake or duplicated, or is the subject of a valid dispute. Every decision records a reason.</p>

        <h2>Reporting</h2>
        <p>If you believe a published review breaks these rules, use the <strong>Report</strong> button on that review, or <a href="/contact">contact us</a>. See also our <a href="/moderation-policy">moderation policy</a>.</p>
      </ContentLayout>
    </>
  );
}
