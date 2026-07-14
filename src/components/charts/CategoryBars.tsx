import { CATEGORY_MAP } from "@/lib/categories";
import { roundRating } from "@/lib/rating/engine";
import type { RatingSummary } from "@/lib/types";
export function CategoryBars({ summary }: { summary: RatingSummary }) {
  if (!summary.categoryAverages.length) return <p className="text-meta-lg text-muted">No category ratings from approved reviews yet.</p>;
  return (
    <div>
      <ul className="space-y-3" aria-hidden="true">
        {summary.categoryAverages.map((c) => (
          <li key={c.categoryKey} className="text-meta-lg">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span>{CATEGORY_MAP[c.categoryKey]?.label ?? c.categoryKey}</span>
              <span className="font-semibold tabular-nums">{roundRating(c.average).toFixed(1)}<span className="font-normal text-muted"> / 5 · {c.count}</span></span>
            </div>
            <span className="block h-2 overflow-hidden rounded-full bg-surface-2">
              <span className="block h-full rounded-full bg-brand" style={{ width: `${(c.average / 5) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
      <table className="sr-only">
        <caption>Average rating by category</caption>
        <thead><tr><th>Category</th><th>Average out of 5</th><th>Ratings</th></tr></thead>
        <tbody>{summary.categoryAverages.map((c) => (
          <tr key={c.categoryKey}><td>{CATEGORY_MAP[c.categoryKey]?.label ?? c.categoryKey}</td><td>{roundRating(c.average).toFixed(1)}</td><td>{c.count}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
