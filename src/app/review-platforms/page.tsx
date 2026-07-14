import Link from "next/link";
import type { CSSProperties } from "react";
import { ExternalLink } from "lucide-react";
import { getSourceOverviews } from "@/lib/data/sources-repo";
import { sourceBrand } from "@/lib/sources/branding";
import { GROUP_LABELS, SOURCE_LABEL } from "@/lib/sources/definitions";
import { SourceMark } from "@/components/sources/SourceMark";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { STATUS_LABELS } from "@/lib/sources/status";
import { formatDate, formatNumber } from "@/lib/format";

export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Portfolio Builders reviews by platform — Google, Trustpilot, Justdial & more",
  description: "Which review platforms have Portfolio Builders reviews, how each one is connected, and what it measures. Student platforms and employee platforms are kept strictly separate.",
  path: "/review-platforms"
});

export default async function ReviewPlatformsPage() {
  const sources = await getSourceOverviews();
  const learner = sources.filter((s) => s.def.group === "learner");
  const employer = sources.filter((s) => s.def.group === "employer");
  const connected = sources.filter((s) => s.connected);
  const updated = new Date().toISOString().slice(0, 10);

  const answer = connected.length > 0
    ? `Portfolio Builders currently has verified profiles on ${connected.map((s) => s.def.name).join(", ")}. Every other platform below is listed transparently with no rating, because no verified profile exists. Employee platforms are shown separately and never affect student ratings.`
    : "No third-party review profile has been verified yet, so builders.review shows no external ratings. Reviews written on builders.review are still published, verified and moderated.";

  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Review platforms", path: "/review-platforms" }]),
        itemListJsonLd("Review platforms", sources.map((s) => ({ name: s.def.name, path: s.def.slug === "google" ? "/google-reviews" : "/review-platforms" })))
      ]} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Review platforms" }]} />

      <header className="mb-8 max-w-3xl">
        <h1 className="font-display text-h2 font-extrabold tracking-tight lg:text-h2-lg">Review platforms</h1>
        <p className="mt-4 text-body-lg text-muted">
          builders.review collects reviews from platforms where Portfolio Builders has a genuine, administrator-verified profile — using each platform's official API, widget, authorized export or simply a link. We never scrape, and we never show a rating for a profile that doesn't exist.
        </p>
        <p className="mt-3 text-meta text-muted">Last updated {updated}</p>
      </header>

      <div className="mb-12"><AnswerBlock question="Which platforms contain Portfolio Builders reviews?" answer={answer} updated={updated} /></div>

      <Group title={GROUP_LABELS.learner} blurb="These measure what customers and students experienced. Star-compatible ones feed the combined learner score, weighted by review count." items={learner} />
      <Group title={GROUP_LABELS.employer} blurb="These measure what it is like to WORK at Portfolio Builders. They are never merged into student or learner ratings." items={employer} />
    </>
  );
}

function Group({ title, blurb, items }: { title: string; blurb: string; items: Awaited<ReturnType<typeof getSourceOverviews>> }) {
  if (!items.length) return null;
  return (
    <section className="mb-14">
      <h2 className="font-display text-h3 font-bold tracking-tight">{title}</h2>
      <p className="mb-6 mt-2 max-w-2xl text-body text-muted">{blurb}</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => {
          const b = sourceBrand(s.def.slug);
          const style = { ["--sa" as string]: b.accent } as CSSProperties;
          return (
            <Reveal key={s.def.slug} delay={i * 40} className="h-full">
              <div style={style} className="card card-lift flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <SourceMark slug={s.def.slug} size={48} />
                  <Badge tone={s.connected ? "success" : s.status === "disabled" ? "neutral" : "warning"}>{STATUS_LABELS[s.status]}</Badge>
                </div>
                <h3 className="mt-4 text-card font-bold">{s.def.name}</h3>
                <p className="mt-1 text-meta text-muted">Integration: {SOURCE_LABEL[s.profile?.integrationMode ?? s.def.defaultMode]}</p>

                <div className="mt-4 flex-1">
                  {s.connected && s.normalized !== null ? (
                    <>
                      <StarRating value={s.normalized} size="sm" />
                      <p className="mt-1 text-meta text-muted">{formatNumber(s.platformCount)} ratings</p>
                    </>
                  ) : s.connected && s.def.ratingType !== "five_star" ? (
                    <p className="text-meta-lg text-muted">
                      {s.def.ratingType === "recommendation_pct" ? "Recommendations, not stars — never converted into a star rating." : "Letter grade, not stars — never converted into a star rating."}
                    </p>
                  ) : (
                    <p className="text-meta-lg text-muted">No verified profile connected — no rating shown.</p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4 text-meta">
                  <span className="text-muted">{s.lastUpdated ? `Verified ${formatDate(s.lastUpdated)}` : "Not verified"}</span>
                  {s.def.slug === "google"
                    ? <Link href="/google-reviews" className="font-semibold text-[rgb(var(--sa))] hover:underline">Google reviews →</Link>
                    : s.profile?.externalProfileUrl.startsWith("http")
                      ? <a href={s.profile.externalProfileUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 font-semibold text-[rgb(var(--sa))] hover:underline">Open profile <ExternalLink size={11} aria-hidden="true" /></a>
                      : <span className="text-muted">—</span>}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
