import { ContentLayout } from "@/components/content/ContentLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({ title: "Cookie policy", description: "How builders.review uses cookies and local storage — kept to the minimum needed to run the site.", path: "/cookie-policy" });
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Cookie policy", path: "/cookie-policy" }])} />
      <ContentLayout title="Cookie policy" updated="2026-07-09" legalReview
        crumbs={[{ label: "Home", href: "/" }, { label: "Cookie policy" }]}
        intro="We keep cookies and local storage to the minimum needed to run the platform."
        tldr="No advertising or cross-site tracking cookies. Local storage remembers your theme, your review draft and whether you already marked a review helpful. Signing in uses a secure session cookie.">
        <h2>What we use</h2>
        <ul>
          <li><strong>Theme preference</strong> — local storage, to remember light or dark mode.</li>
          <li><strong>Review draft</strong> — local storage, so you don't lose a half-written review.</li>
          <li><strong>Helpful votes</strong> — a small local flag so we don't ask you to vote twice on the same device.</li>
          <li><strong>Authentication</strong> — a secure session cookie when a reviewer, moderator or administrator signs in.</li>
        </ul>
        <h2>What we don't use</h2>
        <p>No advertising cookies, no cross-site trackers, no third-party marketing pixels. Our analytics are cookieless and collect no personal data.</p>
        <h2>Managing storage</h2>
        <p>Clear local storage and cookies through your browser settings at any time. Doing so resets your theme preference and any saved draft.</p>
      </ContentLayout>
    </>
  );
}
