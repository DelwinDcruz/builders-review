import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import { SITE, COMPANY } from "@/lib/site-config";
import { getLearnerSummary, getPrograms } from "@/lib/data/repo";
import { getExternalProfiles } from "@/lib/data/sources-repo";
import { buildAnswers } from "@/lib/content/answers";
import { PLATFORM_FAQS } from "@/lib/content/faqs";

import { Hero } from "@/components/home/Hero";
import { BrowseExperience } from "@/components/home/BrowseExperience";
import { WebReviews } from "@/components/home/WebReviews";
import { PopularPrograms } from "@/components/home/PopularPrograms";
import { RatingSummarySection } from "@/components/home/RatingSummarySection";
import { StudentCategories } from "@/components/home/StudentCategories";
import { ProgramComparison } from "@/components/home/ProgramComparison";
import { LatestVerified } from "@/components/home/LatestVerified";
import { SourceExplorer } from "@/components/home/SourceExplorer";
import { HowVerification } from "@/components/home/HowVerification";
import { MethodologyTeaser } from "@/components/home/MethodologyTeaser";

import { Section } from "@/components/ui/Section";
import { Faq } from "@/components/ui/Faq";
import { AnswerList } from "@/components/seo/AnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { companyJsonLd, faqJsonLd, itemListJsonLd, localBusinessJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { programHref } from "@/lib/reviews/links";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Portfolio Builders Reviews — real student, intern & alumni reviews",
  description:
    "Read genuine Portfolio Builders reviews: UI/UX course reviews, FYUGP and AICTE internship reviews, mentor support, career guidance and placement assistance — plus ratings from Google and other verified platforms. Submit your own review.",
  path: "/"
});

export default async function HomePage() {
  const [learner, answers, programs, profiles] = await Promise.all([
    getLearnerSummary(), buildAnswers(), getPrograms(), getExternalProfiles()
  ]);
  const updated = new Date().toISOString().slice(0, 10);
  const externalSameAs = profiles.map((p) => p.externalProfileUrl);

  return (
    <>
      <JsonLd data={[
        companyJsonLd(learner, externalSameAs),   // learner-only aggregate, visible below
        localBusinessJsonLd(),                    // verified address only
        itemListJsonLd("Portfolio Builders programs", programs.map((p) => ({ name: p.title, path: programHref(p) }))),
        faqJsonLd([...answers.slice(0, 8), ...PLATFORM_FAQS.map((f) => ({ q: f.q, a: f.a }))])
      ]} />

      {/* 1. Hero + review search */}
      <div className="-mt-10 md:-mt-14"><Hero /></div>

      {/* 2. Browse reviews by experience */}
      <BrowseExperience />

      {/* 3. Reviews from across the web */}
      <WebReviews />

      {/* 4. Popular courses and internships */}
      <PopularPrograms />

      {/* 5. Portfolio Builders rating summary */}
      <RatingSummarySection />

      {/* 6. Student experience categories */}
      <StudentCategories />

      {/* 7. Program comparison */}
      <ProgramComparison />

      {/* 8. Latest verified reviews */}
      <LatestVerified />

      {/* 9. Review-source explorer */}
      <SourceExplorer />

      {/* 10. How verification works */}
      <HowVerification />

      {/* 11. Review methodology */}
      <MethodologyTeaser />

      {/* 12. FAQ + AEO direct answers */}
      <Section eyebrow="Answers" title="Frequently asked questions"
        description="Answered only from data we actually hold. Where the data doesn't exist, we say so.">
        <AnswerList items={answers.slice(0, 4)} updated={updated} />
        <div className="mt-6"><Faq items={PLATFORM_FAQS} /></div>
      </Section>

      {/* 13. Write a Review CTA */}
      <section className="bleed relative overflow-hidden border-y border-border">
        <div aria-hidden="true" className="absolute inset-0 bg-brand" />
        <div aria-hidden="true" className="absolute inset-0 dot-grid opacity-20" />
        <div className="bleed-inner relative py-20 text-center text-brand-fg">
          <h2 className="mx-auto max-w-3xl font-display text-h2 font-extrabold tracking-tight lg:text-hero">Studied or interned at Portfolio Builders?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg opacity-90">
            Your honest experience — good or bad — helps the next student, intern, parent or career switcher decide. Verified by email, moderated before publication.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/write-review" className="inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-accent px-7 text-body font-bold text-accent-fg shadow-lg transition hover:-translate-y-0.5">
              <PenLine size={17} aria-hidden="true" /> Write a Review
            </Link>
            <Link href="/review-guidelines" className="inline-flex min-h-[52px] items-center gap-2 rounded-lg border border-brand-fg/35 px-7 text-body font-semibold transition hover:bg-brand-fg/10">
              Read the guidelines <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-meta opacity-80">{SITE.ownership}</p>
          <p className="mt-2 text-meta opacity-70">
            Company facts sourced from{" "}
            <a href={COMPANY.officialUrl} target="_blank" rel="noopener noreferrer" className="underline">portfoliobuilders.in</a>, checked {COMPANY.factsCheckedAt}.
          </p>
        </div>
      </section>
    </>
  );
}
