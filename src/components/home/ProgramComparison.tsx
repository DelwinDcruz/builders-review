import Link from "next/link";
import { getProgramPerformance } from "@/lib/data/repo";
import { Section } from "@/components/ui/Section";
import { StarRating } from "@/components/ui/StarRating";
import { EmptyState } from "@/components/ui/States";
import { programHref } from "@/lib/reviews/links";
import { formatNumber } from "@/lib/format";

/** Compact program comparison. Never declares a "winner" on thin data. */
export async function ProgramComparison() {
  const all = [...(await getProgramPerformance("course")), ...(await getProgramPerformance("internship"))]
    .filter((p) => p.summary.count > 0)
    .sort((a, b) => (b.summary.average ?? 0) - (a.summary.average ?? 0))
    .slice(0, 6);

  const enough = all.filter((p) => p.summary.count >= 3).length >= 2;

  return (
    <Section eyebrow="Compare" title="Compare programs side by side"
      description="Ratings are only comparable when each program has enough reviews. We say so rather than implying a ranking."
      moreHref="/compare" moreLabel="Full comparison">
      {all.length === 0 ? (
        <EmptyState title="Nothing to compare yet" description="Once two or more programs have approved reviews, they can be compared here." />
      ) : (
        <>
          {!enough && (
            <p className="mb-5 rounded-xl border border-warning/30 bg-warning/10 p-4 text-meta-lg text-warning">
              Some programs below have fewer than three approved reviews. The figures are shown for transparency, not as a ranking.
            </p>
          )}
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
            <table className="w-full min-w-[640px]">
              <caption className="sr-only">Average rating and review count per program</caption>
              <thead>
                <tr className="border-b border-border bg-surface-2 text-left">
                  <th scope="col" className="px-6 py-4 text-meta font-bold uppercase tracking-wider text-muted">Program</th>
                  <th scope="col" className="px-6 py-4 text-meta font-bold uppercase tracking-wider text-muted">Rating</th>
                  <th scope="col" className="px-6 py-4 text-meta font-bold uppercase tracking-wider text-muted">Reviews</th>
                  <th scope="col" className="px-6 py-4 text-meta font-bold uppercase tracking-wider text-muted">Would recommend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {all.map((p) => (
                  <tr key={p.program.slug} className="transition-colors hover:bg-surface-2/60">
                    <th scope="row" className="px-6 py-5 text-left">
                      <Link href={programHref(p.program)} className="text-body font-semibold hover:text-brand">{p.program.title}</Link>
                    </th>
                    <td className="px-6 py-5"><StarRating value={p.summary.average} size="sm" /></td>
                    <td className="px-6 py-5 text-body tabular-nums">{formatNumber(p.summary.count)}</td>
                    <td className="px-6 py-5 text-body tabular-nums">{p.summary.recommendPercent !== null ? `${p.summary.recommendPercent}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Section>
  );
}
