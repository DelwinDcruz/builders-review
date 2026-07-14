import { ContentLayout } from "@/components/content/ContentLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({
  title: "Verification policy — what a verified Portfolio Builders review means",
  description: "What “verified” means on builders.review, how email verification works, and why we never display a verification badge that was not earned.",
  path: "/verification-policy"
});
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Verification policy", path: "/verification-policy" }])} />
      <ContentLayout title="Verification policy" updated="2026-07-09"
        crumbs={[{ label: "Home", href: "/" }, { label: "Verification policy" }]}
        intro="Verification tells you a reviewer's identity was checked. Here is exactly what it does — and does not — mean."
        tldr="A verified review means the reviewer confirmed their email address. Verification never changes a rating, and we never show a verified badge unless the check actually completed.">
        <h2>What “verified” means</h2>
        <p>When you submit a review we email you a confirmation link. Only once you click it does your review carry the <strong>Verified reviewer</strong> label. Nothing else grants that label.</p>

        <h2>What verification does not mean</h2>
        <ul>
          <li>It does <strong>not</strong> change your star rating or how prominently your review appears.</li>
          <li>It does <strong>not</strong> mean builders.review endorses the opinion expressed.</li>
          <li>It does <strong>not</strong> prove enrolment. It proves control of the email address used.</li>
        </ul>

        <h2>Verified versus unverified reviews</h2>
        <p>Both may be published if they pass moderation, and both are clearly labelled. You can filter to verified reviews only. Every rating is shown alongside the share of reviews behind it that are verified, so you can weigh it yourself.</p>

        <h2>External reviews</h2>
        <p>A review collected from Google or another platform is labelled <em>Verified on [platform]</em> only when that platform confirms it. Where we reproduce a permitted excerpt ourselves, it is labelled <em>Manually verified summary</em> or <em>Authorized import</em> — never as if it were verified by us.</p>

        <h2>Our commitment</h2>
        <p>We do not use fake shields, invented trust badges or purchased seals. A badge appears only when the underlying check happened.</p>
      </ContentLayout>
    </>
  );
}
