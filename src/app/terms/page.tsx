import { ContentLayout } from "@/components/content/ContentLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({ title: "Terms and conditions", description: "The terms governing use of builders.review, including acceptable use, review ownership and liability.", path: "/terms" });
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }])} />
      <ContentLayout title="Terms and conditions" updated="2026-07-09" legalReview
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
        intro="By using builders.review you agree to these terms.">
        <h2>Using the platform</h2>
        <p>You may browse reviews freely and submit a review if you have a genuine, first-hand experience of Portfolio Builders. You must not attempt to manipulate ratings, submit reviews on behalf of others, or breach the <a href="/review-guidelines">review guidelines</a>.</p>
        <h2>Your content</h2>
        <p>You retain ownership of the reviews you write. By submitting one you grant us a licence to publish, display and distribute it on this platform. You confirm the review is truthful, your own, and was not written in exchange for any reward.</p>
        <h2>Moderation and removal</h2>
        <p>We may decline to publish, or may remove, content that breaches our policies, with a recorded reason. We will not remove a genuine review because it is critical. See the <a href="/moderation-policy">moderation policy</a>.</p>
        <h2>No professional advice</h2>
        <p>Reviews are individual opinions about an education provider. They are not professional, career, legal or financial advice, and they are not a guarantee of any outcome.</p>
        <h2>Relationship disclosure</h2>
        <p>builders.review is operated in connection with Portfolio Builders. We do not present ourselves as an independent third-party review organisation.</p>
        <h2>Disclaimers and liability</h2>
        <p>The platform is provided “as is”. To the extent permitted by law, we are not liable for indirect or consequential loss arising from use of the platform or reliance on any review.</p>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws applicable to the operating entity's jurisdiction. This section requires confirmation by a qualified legal professional.</p>
      </ContentLayout>
    </>
  );
}
