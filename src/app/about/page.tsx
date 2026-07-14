import Link from "next/link";
import { ContentLayout } from "@/components/content/ContentLayout";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { COMPANY, SITE } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "About builders.review — and our relationship to Portfolio Builders",
  description: "What builders.review is, what Portfolio Builders is, and the ownership and conflict-of-interest disclosure between them. We do not claim to be an independent third-party review organisation.",
  path: "/about"
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <ContentLayout title="About builders.review" updated="2026-07-09"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        intro="A dedicated place to read and write Portfolio Builders reviews — with the relationship between the two stated openly."
        tldr="builders.review is a review platform for one company: Portfolio Builders. It is operated in connection with that company, so it is not an independent third-party review organisation. We disclose that, publish our methodology, and never suppress genuine criticism.">

        <div className="not-prose mb-10">
          <AnswerBlock question="What is builders.review, and is it independent of Portfolio Builders?"
            answer="builders.review is a dedicated review platform for Portfolio Builders — a Kochi-based career learning ecosystem offering UI/UX courses, FYUGP and AICTE internships, portfolio programs and mentorship. builders.review is operated in connection with Portfolio Builders and is therefore not an independent third-party review organisation. We state this plainly, publish how every rating is calculated, never reward positive reviews, and never remove a genuine review for being critical."
            updated="2026-07-09" sourceNote="Company facts sourced from portfoliobuilders.in" />
        </div>

        <h2>What Portfolio Builders is</h2>
        <p>{COMPANY.description} Its founder and CEO is {COMPANY.founder.name}. The official website is <a href={COMPANY.officialUrl} target="_blank" rel="noopener noreferrer">portfoliobuilders.in</a>, and its India office is in {COMPANY.locations[0]?.locality}, {COMPANY.locations[0]?.region}.</p>
        <p>Every program reviewed on this site — the UI/UX Design Course, Web Development, Flutter Development, the free courses, the portfolio-building and career-switching programs, and the FYUGP, AICTE, KTU, CUSAT and MBA internships — is listed on that official website. We do not invent programs, locations, statistics, awards or placement figures.</p>

        <h2>What builders.review is</h2>
        <p>It is a review platform covering exactly one company. Students, interns, alumni, parents, career switchers and mentors can read reviews and submit their own. We also display ratings from third-party review platforms — but only where Portfolio Builders has a genuine profile that an administrator has verified.</p>

        <h2>Ownership and conflict-of-interest disclosure</h2>
        <p><strong>{SITE.ownership}</strong></p>
        <p>A review site operated by the company it reviews has an obvious conflict of interest. Hiding it would be worse than having it. So we manage it with rules you can check:</p>
        <ul>
          <li>Ratings come <strong>only</strong> from approved reviews, using the published <Link href="/methodology">methodology</Link>.</li>
          <li>We <strong>never</strong> show a rating when there are no approved reviews, and never fabricate a number, a reviewer or a review count.</li>
          <li>We <strong>never</strong> offer or permit rewards conditional on a positive review.</li>
          <li>We <strong>never</strong> reject or remove a review because it is critical. Rejections record a reason and are audit-logged.</li>
          <li>Company responses are labelled as such and cannot change a review's rating.</li>
          <li>Employee reviews are never blended into student ratings.</li>
        </ul>
        <p>Treat these ratings as an honest, transparently-operated first-party record — not as an independent audit. We publish the method, the counts and the distributions so you can reach your own conclusions.</p>

        <h2>Editorial responsibility</h2>
        <p>Editorial content, moderation decisions and methodology on this site are maintained by the {SITE.editor.name}. Reviews are the opinions of the people who wrote them, and are clearly separated from any editorial summary. Where data is insufficient, we say so rather than drawing a conclusion.</p>

        <h2>Where our facts come from</h2>
        <p>Company details, programs, locations and contact information are taken from the official Portfolio Builders website and were last checked on {COMPANY.factsCheckedAt}. Marketing claims made by the company (such as placement rates or learner counts) are deliberately <strong>not</strong> republished here — they are company statements, not review data.</p>
      </ContentLayout>
    </>
  );
}
