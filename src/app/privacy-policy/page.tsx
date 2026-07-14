import { ContentLayout } from "@/components/content/ContentLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { COMPANY } from "@/lib/site-config";
export const metadata = pageMetadata({ title: "Privacy policy", description: "How builders.review collects, uses and protects personal data, including review submissions and email verification.", path: "/privacy-policy" });
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacy policy", path: "/privacy-policy" }])} />
      <ContentLayout title="Privacy policy" updated="2026-07-09" legalReview
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy policy" }]}
        intro="What personal data we collect, why, and your rights over it.">
        <h2>What we collect</h2>
        <ul>
          <li><strong>Review submissions:</strong> display name, review content, ratings, relationship, batch, date of experience, and your email address (for verification only).</li>
          <li><strong>Contact messages:</strong> name, email and message.</li>
          <li><strong>Technical data:</strong> minimal, cookieless analytics events with no advertising identifiers.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To verify, moderate and publish your review.</li>
          <li>To detect spam, duplicates and abuse.</li>
          <li>To respond to enquiries and disputes.</li>
        </ul>
        <p><strong>Your email address is never displayed publicly</strong> and is never shown alongside your review. It is stored as a one-way hash for duplicate detection wherever the raw address is not required.</p>

        <h2>Legal bases</h2>
        <p>We process data to perform the service you request (publishing your review), for our legitimate interest in maintaining a trustworthy platform, and to comply with legal obligations.</p>

        <h2>Retention</h2>
        <p>Approved reviews are retained while published. Rejected or removed reviews and moderation records are retained for audit purposes for a limited period, then deleted or anonymised.</p>

        <h2>Your rights</h2>
        <p>Subject to applicable law you may request access to, correction of, or deletion of your personal data, and you may withdraw a review in line with our policies. Contact <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>

        <h2>Sharing</h2>
        <p>We use service providers (hosting, database) that process data on our behalf under appropriate safeguards. We do not sell personal data.</p>

        <h2>Third-party platforms</h2>
        <p>Where we display reviews collected from Google or another platform, that content is governed by the platform's own terms and privacy policy. Following an outbound link takes you to that platform.</p>
      </ContentLayout>
    </>
  );
}
