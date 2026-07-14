import type { RatingDistribution } from "@/lib/types";
import { formatNumber } from "@/lib/format";
/** 5→1 distribution. Bars are decoration; an sr-only table carries the figures. */
export function RatingBars({ distribution, total }: { distribution: RatingDistribution; total: number }) {
  const rows = [5, 4, 3, 2, 1] as const;
  return (
    <div>
      <div className="space-y-2" aria-hidden="true">
        {rows.map((star) => {
          const n = distribution[star];
          const pct = total > 0 ? Math.round((n / total) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-3 text-meta-lg">
              <span className="w-12 shrink-0 tabular-nums text-muted">{star} star</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <span className="block h-full rounded-full bg-star transition-[width] duration-slow" style={{ width: `${pct}%` }} />
              </span>
              <span className="w-16 shrink-0 text-right tabular-nums text-muted">{formatNumber(n)} ({pct}%)</span>
            </div>
          );
        })}
      </div>
      <table className="sr-only">
        <caption>Rating distribution</caption>
        <thead><tr><th>Stars</th><th>Reviews</th><th>Percentage</th></tr></thead>
        <tbody>{rows.map((s) => <tr key={s}><td>{s} star</td><td>{distribution[s]}</td><td>{total ? Math.round((distribution[s] / total) * 100) : 0}%</td></tr>)}</tbody>
      </table>
    </div>
  );
}
