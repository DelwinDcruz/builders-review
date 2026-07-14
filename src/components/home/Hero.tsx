import Link from "next/link";
import { ArrowRight, PenLine, ShieldCheck, GraduationCap } from "lucide-react";
import { COMPANY } from "@/lib/site-config";
import { getHeroTotals, getUnifiedRecentReviews, getConnectedSources, getSourceOverviews } from "@/lib/data/sources-repo";
import { getPrograms } from "@/lib/data/repo";
import { HeroSearch } from "./HeroSearch";
import { HeroCards } from "./HeroCards";
import { CountUp } from "@/components/ui/CountUp";
import { SourceMark } from "@/components/sources/SourceMark";
import { formatNumber } from "@/lib/format";

/** Split hero. Statistics show real data only, or an honest empty state. */
export async function Hero() {
  const [totals, feed, connected, overviews, programs] = await Promise.all([
    getHeroTotals(), getUnifiedRecentReviews(3), getConnectedSources("learner"), getSourceOverviews(), getPrograms()
  ]);
  const google = overviews.find((s) => s.def.slug === "google");
  const selectable = programs.filter((p) => p.type === "course" || p.type === "internship" || p.type === "program");

  return (
    <section className="bleed relative overflow-hidden border-b border-border">
      <div aria-hidden="true" className="absolute inset-0 mesh" />
      <div aria-hidden="true" className="absolute inset-0 dot-grid opacity-60" />

      <div className="bleed-inner relative py-16 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-meta font-semibold text-fg-secondary backdrop-blur">
              <ShieldCheck size={14} className="text-success" aria-hidden="true" />
              Verified reviews · moderated before publication
            </p>

            <h1 className="mt-6 font-display text-hero font-extrabold leading-[1.03] tracking-tight lg:text-hero-lg">
              Real <span className="grad-text">Portfolio Builders</span> reviews — from students, interns and trusted platforms.
            </h1>

            <p className="mt-6 max-w-2xl text-body-lg text-fg-secondary">
              Read genuine experiences of the UI/UX courses, FYUGP and AICTE internships, portfolio programs, mentorship and career support — collected here and from review platforms where Portfolio Builders has a verified profile. Then share your own.
            </p>

            <div className="mt-8">
              <HeroSearch
                programs={selectable.map((p) => ({ slug: p.slug, title: p.title, type: p.type }))}
                platforms={connected.map((s) => ({ slug: s.def.slug, name: s.def.name }))} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/reviews" className="inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-brand px-7 text-body font-semibold text-brand-fg shadow-glow transition hover:bg-brand-hover">
                Explore Reviews <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/write-review" className="inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-accent px-6 text-body font-semibold text-accent-fg transition hover:brightness-105">
                <PenLine size={16} aria-hidden="true" /> Write a Review
              </Link>
            </div>

            {connected.length > 0 && (
              <div className="mt-10">
                <p className="mb-3 text-meta font-semibold uppercase tracking-wider text-muted">Also collected from</p>
                <ul className="flex flex-wrap items-center gap-2.5">
                  {connected.map((s) => (
                    <li key={s.def.slug}>
                      <Link href={s.def.slug === "google" ? "/google-reviews" : "/review-platforms"}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/90 py-1.5 pl-1.5 pr-3 text-meta-lg font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
                        <SourceMark slug={s.def.slug} size={28} /> {s.def.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hero statistics — real data only */}
            {totals.hasAnyData ? (
              <dl className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat label="Approved reviews" value={totals.approvedReviews} />
                <Stat label="Connected sources" value={totals.connectedSources} />
                <Stat label="Reviewed programs" value={totals.reviewedPrograms} />
                <Stat label="Verified reviews" value={totals.verifiedReviews} />
                {totals.lastUpdatedLabel && (
                  <div className="col-span-2 sm:col-span-4">
                    <p className="text-meta text-muted">Last updated {totals.lastUpdatedLabel}</p>
                  </div>
                )}
              </dl>
            ) : (
              <p className="mt-10 flex max-w-xl items-start gap-2 rounded-xl border border-border bg-surface p-4 text-meta-lg text-muted">
                <GraduationCap size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                No approved reviews yet. We won't show a rating or a review count until real reviews exist — be the first to write one.
              </p>
            )}
          </div>

          <div className="relative">
            <div aria-hidden="true" className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(60%_50%_at_50%_40%,rgb(var(--brand)/0.10),transparent_70%)]" />
            <HeroCards reviews={feed} google={google} />
            <p className="mt-6 text-center text-meta text-muted">
              Official company site:{" "}
              <a href={COMPANY.officialUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">portfoliobuilders.in</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dd className="font-display text-h3 font-extrabold tracking-tight"><CountUp value={value} formatted={formatNumber(value)} /></dd>
      <dt className="mt-0.5 text-meta text-muted">{label}</dt>
    </div>
  );
}
