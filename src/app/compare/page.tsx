import Link from "next/link";
import { getProgramPerformance } from "@/lib/data/repo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StarRating } from "@/components/ui/StarRating";
import { CategoryBars } from "@/components/charts/CategoryBars";
import { EmptyState } from "@/components/ui/States";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { programHref } from "@/lib/reviews/links";
import { formatNumber } from "@/lib/format";

export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Compare Portfolio Builders programs — courses vs internships",
  description: "Compare Portfolio Builders courses, internships and portfolio programs side by side: average rating, review count, would-recommend rate and category strengths. We never declare a winner on thin data.",
  path: "/compare"
});

const MIN = 3;

export default async function ComparePage() {
  const all = [
    ...(await getProgramPerformance("course")),
    ...(await getProgramPerformance("internship")),
    ...(await getProgramPerformance("program"))
  ].filter((p) => p.summary.count > 0).sort((a, b) => (b.summary.average ?? 0) - (a.summary.average ?? 0));

  const comparable = all.filter((p) => p.summary.count >= MIN);
  const updated = new Date().toISOString().slice(0, 10);

  const answer = comparable.length >= 2
    ? `${comparable.length} Portfolio Builders programs have at least ${MIN} approved reviews each, which is the minimum we require before treating their ratings as comparable. Programs with fewer reviews are shown for transparency but are not ranked.`
    : `Not enough programs have ${MIN} or more approved reviews yet, so we do not rank them. The figures below are shown for transparency only — treat small review counts with caution.`;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Compare", path: "/compare" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare programs" }]} />

      <header className="mb-8 max-w-3xl">
        <h1 className="font-display text-h2 font-extrabold tracking-tight lg:text-h2-lg">Compare Portfolio Builders programs</h1>
        <p className="mt-4 text-body-lg text-muted">
          Courses, internships and portfolio programs side by side. A rating means little without a review count — so we always show both, and we say when there isn't enough data to compare.
        </p>
        <p className="mt-3 text-meta text-muted">Last updated {updated}</p>
      </header>

      <div className="mb-12"><AnswerBlock question="Which Portfolio Builders program is rated highest?" answer={answer} updated={updated} /></div>

      {all.length === 0 ? (
        <EmptyState title="Nothing to compare yet" description="Once two or more programs have approved reviews, they can be compared here." />
      ) : (
        <>
          {comparable.length < 2 && (
            <p className="mb-6 rounded-xl border border-warning/30 bg-warning/10 p-4 text-meta-lg text-warning">
              Fewer than two programs have {MIN}+ approved reviews. Figures below are informational, not a ranking.
            </p>
          )}

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm md:block">
            <table className="w-full min-w-[760px]">
              <caption className="sr-only">Portfolio Builders programs compared by rating, review count and recommendation rate</caption>
              <thead>
                <tr className="border-b border-border bg-surface-2 text-left">
                  <th scope="col" className="px-6 py-4 text-meta font-bold uppercase tracking-wider text-muted">Program</th>
                  <th scope="col" className="px-6 py-4 text-meta font-bold uppercase tracking-wider text-muted">Type</th>
                  <th scope="col" className="px-6 py-4 text-meta font-bold uppercase tracking-wider text-muted">Rating</th>
                  <th scope="col" className="px-6 py-4 text-meta font-bold uppercase tracking-wider text-muted">Reviews</th>
                  <th scope="col" className="px-6 py-4 text-meta font-bold uppercase tracking-wider text-muted">Would recommend</th>
                  <th scope="col" className="px-6 py-4 text-meta font-bold uppercase tracking-wider text-muted">Comparable?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {all.map((p) => (
                  <tr key={p.program.slug} className="transition-colors hover:bg-surface-2/60">
                    <th scope="row" className="px-6 py-5 text-left">
                      <Link href={programHref(p.program)} className="text-body font-semibold hover:text-brand">{p.program.title}</Link>
                    </th>
                    <td className="px-6 py-5 text-meta-lg capitalize text-muted">{p.program.type}</td>
                    <td className="px-6 py-5"><StarRating value={p.summary.average} size="sm" /></td>
                    <td className="px-6 py-5 text-body tabular-nums">{formatNumber(p.summary.count)}</td>
                    <td className="px-6 py-5 text-body tabular-nums">{p.summary.recommendPercent !== null ? `${p.summary.recommendPercent}%` : "—"}</td>
                    <td className="px-6 py-5 text-meta-lg">{p.summary.count >= MIN ? <span className="text-success">Yes</span> : <span className="text-warning">Too few reviews</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked */}
          <div className="grid gap-4 md:hidden">
            {all.map((p) => (
              <div key={p.program.slug} className="card p-6">
                <h2 className="text-card font-bold"><Link href={programHref(p.program)} className="hover:text-brand">{p.program.title}</Link></h2>
                <dl className="mt-4 space-y-3 text-meta-lg">
                  <div className="flex items-center justify-between gap-3"><dt className="text-muted">Rating</dt><dd><StarRating value={p.summary.average} size="sm" /></dd></div>
                  <div className="flex items-center justify-between gap-3"><dt className="text-muted">Reviews</dt><dd className="font-semibold tabular-nums">{formatNumber(p.summary.count)}</dd></div>
                  <div className="flex items-center justify-between gap-3"><dt className="text-muted">Would recommend</dt><dd className="font-semibold tabular-nums">{p.summary.recommendPercent !== null ? `${p.summary.recommendPercent}%` : "—"}</dd></div>
                  <div className="flex items-center justify-between gap-3"><dt className="text-muted">Comparable</dt><dd className={p.summary.count >= MIN ? "text-success" : "text-warning"}>{p.summary.count >= MIN ? "Yes" : "Too few reviews"}</dd></div>
                </dl>
              </div>
            ))}
          </div>

          <section className="mt-14">
            <h2 className="mb-6 font-display text-h3 font-bold tracking-tight">Category strengths, program by program</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {all.filter((p) => p.summary.categoryAverages.length > 0).map((p) => (
                <div key={p.program.slug} className="card p-6">
                  <h3 className="mb-4 text-card font-semibold">{p.program.title}</h3>
                  <CategoryBars summary={p.summary} />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <p className="mt-12 text-meta-lg text-muted">
        How these numbers are produced: read the <Link href="/methodology" className="font-semibold text-brand hover:underline">review methodology</Link>.
      </p>
    </>
  );
}
