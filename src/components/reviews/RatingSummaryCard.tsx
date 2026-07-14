import type { RatingSummary } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { roundRating, verifiedPercentage } from "@/lib/rating/engine";
import { formatNumber, pluralize } from "@/lib/format";

/** Shows a big average ONLY when approved reviews exist. Never a fake number. */
export function RatingSummaryCard({ summary, label }: { summary: RatingSummary; label: string }) {
  const vp = verifiedPercentage(summary);
  if (summary.count === 0 || summary.average === null) {
    return (
      <div className="card p-7">
        <p className="text-meta font-bold uppercase tracking-wider text-muted">{label}</p>
        <p className="mt-3 font-display text-h3 font-bold">No rating yet</p>
        <p className="mt-2 text-body text-muted">There are no approved reviews yet, so we don't show a rating. Be the first to review.</p>
      </div>
    );
  }
  return (
    <div className="card p-7">
      <p className="text-meta font-bold uppercase tracking-wider text-muted">{label}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-[3.25rem] font-extrabold leading-none tabular-nums">{roundRating(summary.average).toFixed(1)}</span>
        <span className="text-body-lg text-muted">/ 5</span>
      </div>
      <div className="mt-3"><StarRating value={summary.average} count={summary.count} showNumber={false} /></div>
      <p className="mt-3 text-meta-lg text-muted">
        Based on {pluralize(summary.count, "approved review")}
        {vp !== null && <> · {formatNumber(summary.verifiedCount)} verified ({vp}%)</>}
        {summary.recommendPercent !== null && <> · {summary.recommendPercent}% would recommend</>}
      </p>
    </div>
  );
}
