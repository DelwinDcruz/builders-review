import Link from "next/link";
import { getAdminMetrics, getAllReviewsAdmin } from "@/lib/data/admin";
import { getLearnerSummary } from "@/lib/data/repo";
import { getCombinedLearnerScore, getEmployeeScore, getSourceOverviews } from "@/lib/data/sources-repo";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [m, recent, learner, combined, employee, sources] = await Promise.all([
    getAdminMetrics(), getAllReviewsAdmin(), getLearnerSummary(),
    getCombinedLearnerScore(), getEmployeeScore(), getSourceOverviews()
  ]);
  const latest = [...recent].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 6);

  const cards = [
    { label: "Pending", value: m.pending, href: "/admin/moderation?status=pending_moderation" },
    { label: "Approved", value: m.approved, href: "/admin/moderation?status=approved" },
    { label: "Rejected", value: m.rejected, href: "/admin/moderation?status=rejected" },
    { label: "Flagged", value: m.flagged, href: "/admin/moderation?status=flagged" },
    { label: "Reports", value: m.reports, href: "/admin/moderation" }
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-h3 font-extrabold">Overview</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-5 hover:shadow-lg">
            <p className="text-meta text-muted">{c.label}</p>
            <p className="mt-1 font-display text-h3 font-extrabold tabular-nums">{formatNumber(c.value)}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-card font-bold">Scores (kept separate)</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Score label="builders.review reviews" value={learner.average} count={learner.count} />
        <Score label="Combined learner score" value={combined.average} count={combined.reviewCount} note={`${combined.sourceCount} sources, count-weighted`} />
        <Score label="Employee score (separate)" value={employee.average} count={employee.reviewCount} note="Never merged into learner scores" />
      </div>

      <h2 className="mb-3 mt-10 text-card font-bold">Source status</h2>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[560px] text-meta-lg">
          <thead className="bg-surface-2 text-left">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Source</th>
              <th scope="col" className="px-4 py-3 font-semibold">Group</th>
              <th scope="col" className="px-4 py-3 font-semibold">Connected</th>
              <th scope="col" className="px-4 py-3 font-semibold">Rating</th>
              <th scope="col" className="px-4 py-3 font-semibold">Last verified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sources.map((s) => (
              <tr key={s.def.slug}>
                <th scope="row" className="px-4 py-3 text-left font-medium">{s.def.name}</th>
                <td className="px-4 py-3 capitalize text-muted">{s.def.group}</td>
                <td className="px-4 py-3">{s.connected ? <Badge tone="success">Yes</Badge> : <Badge>No</Badge>}</td>
                <td className="px-4 py-3">{s.normalized !== null ? <StarRating value={s.normalized} size="sm" /> : <span className="text-muted">—</span>}</td>
                <td className="px-4 py-3 text-muted">{s.lastUpdated ? formatDate(s.lastUpdated) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 mt-10 text-card font-bold">Recent submissions</h2>
      <ul className="space-y-2">
        {latest.map((r) => (
          <li key={r.id} className="card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{r.title}</p>
              <p className="text-meta text-muted">{r.experienceType} · {formatDate(r.submittedAt)}</p>
            </div>
            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-meta capitalize text-muted">{r.status.replace(/_/g, " ")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Score({ label, value, count, note }: { label: string; value: number | null; count: number; note?: string }) {
  return (
    <div className="card p-5">
      <p className="text-meta text-muted">{label}</p>
      {value !== null ? (
        <>
          <p className="mt-1 font-display text-h3 font-extrabold tabular-nums">{value.toFixed(1)}</p>
          <p className="text-meta text-muted">{formatNumber(count)} reviews</p>
        </>
      ) : <p className="mt-1 text-body text-muted">No data</p>}
      {note && <p className="mt-1 text-meta text-muted">{note}</p>}
    </div>
  );
}
