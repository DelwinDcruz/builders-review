import { ContentLayout } from "@/components/content/ContentLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { COMPANY } from "@/lib/site-config";
export const metadata = pageMetadata({ title: "Accessibility statement", description: "Our commitment to WCAG 2.2 AA on builders.review, the measures in place, and how to report a barrier.", path: "/accessibility" });
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Accessibility", path: "/accessibility" }])} />
      <ContentLayout title="Accessibility statement" updated="2026-07-09"
        crumbs={[{ label: "Home", href: "/" }, { label: "Accessibility" }]}
        intro="Everyone should be able to read and write a review. We target WCAG 2.2 AA."
        tldr="Semantic HTML, full keyboard support, visible focus, screen-reader text for every star rating, text-table alternatives for every chart, AA contrast in light and dark modes, reduced-motion support, and 44px+ touch targets.">
        <h2>Measures in place</h2>
        <ul>
          <li>Semantic HTML with a correct heading hierarchy and landmark regions.</li>
          <li>A skip-to-content link and full keyboard navigation with visible focus styles.</li>
          <li>Star ratings are announced as a sentence (value and review count), never by colour or shape alone.</li>
          <li>The star input is a keyboard-operable radiogroup with arrow-key support.</li>
          <li>Every chart has a visually-hidden data table carrying the exact figures.</li>
          <li>Review type and source identity always pair colour with an icon and a text label.</li>
          <li>Colour contrast meets AA in both light and dark modes.</li>
          <li>Form errors are announced with <code>role="alert"</code>; result counts use <code>aria-live</code>.</li>
          <li>The mobile filter panel is a proper dialog with scroll lock and Escape to close.</li>
          <li>The “reduce motion” system setting disables all animation and transforms.</li>
          <li>Touch targets are at least 44px.</li>
        </ul>
        <h2>Known limitations</h2>
        <p>We test continually and improve. If you hit a barrier, tell us so we can fix it.</p>
        <h2>Reporting a problem</h2>
        <p>Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or use our <a href="/contact">contact form</a> and choose “technical issue”. We aim to respond within 3 business days.</p>
      </ContentLayout>
    </>
  );
}
