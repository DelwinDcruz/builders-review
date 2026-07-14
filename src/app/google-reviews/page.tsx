import Link from "next/link";
import { ExternalLink, Info, Clock3 } from "lucide-react";
import { getSourceOverviews, getExternalReviews } from "@/lib/data/sources-repo";
import { unifyExternal } from "@/lib/reviews/unify";
import { getSourceDef } from "@/lib/sources/definitions";
import { SourceMark } from "@/components/sources/SourceMark";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { SourceNotConnected } from "@/components/ui/States";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata, noindex } from "@/lib/seo/metadata";
import { STATUS_LABELS } from "@/lib/sources/status";
import { formatDate, formatNumber } from "@/lib/format";
import { COMPANY } from "@/lib/site-config";

export const revalidate = 300;

export async function generateMetadata() {
  const google = (await getSourceOverviews()).find((s) => s.def.slug === "google");
  // Thin/empty source page → noindex until a real profile is verified.
  if (!google?.connected) return { ...noindex, title: "Portfolio Builders Google reviews" };
  return pageMetadata({
    title: "Portfolio Builders Google reviews — rating & how to read them",
    description: "The Portfolio Builders Google rating and review count, with a direct link to the Google profile. Google's API returns only a limited selection of reviews — read them all on Google.",
    path: "/google-reviews"
  });
}

export default async function GoogleReviewsPage() {
  const def = getSourceDef("google")!;
  const google = (await getSourceOverviews()).find((s) => s.def.slug === "google");
  const reviews = google?.connected ? await getExternalReviews("google") : [];
  const updated = new Date().toISOString().slice(0, 10);

  const answer = google?.connected && google.normalized !== null
    ? `Portfolio Builders has a verified Google profile rated ${google.normalized.toFixed(1)} out of 5 from ${formatNumber(google.platformCount)} Google ratings${google.lastUpdated ? `, last verified ${formatDate(google.lastUpdated)}` : ""}. Google's API returns only a limited selection of individual reviews, so the ones shown below are not every Google review — open the Google profile to read them all.`
    : "No verified Google profile is connected to builders.review yet, so we show no Google rating and no review count. We never display a rating for a profile we haven't verified.";

  const faqs = [
    { q: "Are these all the Google reviews for Portfolio Builders?", a: "No. The Google Places API returns only a limited selection of reviews (historically up to five) alongside the overall rating and the total rating count. We show that selection with attribution and link to the Google profile so you can read every review at the source." },
    { q: "How does builders.review get Google data?", a: "Through Google's official Places API using a real Place ID and a server-side API key — never by scraping. When credentials aren't configured, the source is disabled and we show nothing rather than guessing." },
    { q: "Does Portfolio Builders control its Google reviews?", a: "No. Google reviews are written and hosted on Google. Portfolio Builders can respond on Google, but cannot delete a genuine review, and neither can builders.review." }
  ];

  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Review platforms", path: "/review-platforms" }, { name: "Google reviews", path: "/google-reviews" }]),
        faqJsonLd(faqs)
      ]} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Review platforms", href: "/review-platforms" }, { label: "Google reviews" }]} />

      <header className="relative mb-10 overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-12">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(40rem 20rem at 10% -20%, rgb(66 133 244 / .12), transparent 65%)" }} />
        <div className="relative flex flex-wrap items-start gap-6">
          <SourceMark slug="google" size={72} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-h2 font-extrabold tracking-tight lg:text-h2-lg">Portfolio Builders Google reviews</h1>
              <Badge tone={google?.connected ? "success" : "warning"}>{STATUS_LABELS[google?.status ?? "disabled"]}</Badge>
            </div>
            <p className="mt-4 max-w-2xl text-body-lg text-fg-secondary">
              Google reviews are written by customers on Google and hosted there. We show the overall rating, the total rating count, and a limited selection of reviews — with attribution and a direct link to the profile.
            </p>
            {google?.connected && google.normalized !== null && (
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <div>
                  <StarRating value={google.normalized} size="xl" />
                  <p className="mt-1 text-meta-lg text-muted">{formatNumber(google.platformCount)} Google ratings</p>
                </div>
                {google.profile?.externalProfileUrl.startsWith("http") && (
                  <a href={google.profile.externalProfileUrl} target="_blank" rel="noopener noreferrer nofollow"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-border bg-surface px-5 font-semibold hover:border-border-strong">
                    Read all reviews on Google <ExternalLink size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
            <p className="mt-5 flex items-center gap-2 text-meta text-muted">
              <Clock3 size={13} aria-hidden="true" />
              {google?.lastUpdated ? `Last verified ${formatDate(google.lastUpdated)}` : "Not yet verified"} · Powered by Google
            </p>
          </div>
        </div>
      </header>

      <div className="mb-12">
        <AnswerBlock question="Where can I read Portfolio Builders Google reviews?" answer={answer} updated={updated}
          sourceNote={`Attribution: ${def.integration.attribution}`} />
      </div>

      {!google?.connected ? (
        <SourceNotConnected platform="Google" />
      ) : (
        <>
          <p className="mb-6 flex items-start gap-2 rounded-lg border border-info/30 bg-info/10 p-4 text-meta-lg text-info">
            <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span><strong>These are not all the Google reviews.</strong> Google's API returns only a limited selection. Open the Google profile to read every review.</span>
          </p>
          {reviews.length > 0 && (
            <Section title="Selected Google reviews" description="Shown with attribution and links to the original.">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {reviews.map((r) => <ReviewCard key={r.id} review={unifyExternal(r)} showExperience={false} />)}
              </div>
            </Section>
          )}
        </>
      )}

      <Section title="Google review FAQs"><div className="max-w-3xl"><Faq items={faqs} /></div></Section>

      <p className="mt-10 text-meta-lg text-muted">
        Prefer to read reviews written here? Browse <Link href="/reviews" className="font-semibold text-brand hover:underline">all builders.review reviews</Link>, or{" "}
        <a href={COMPANY.officialUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">visit Portfolio Builders</a>.
      </p>
    </>
  );
}
