import Link from "next/link";
import { getAllReviewsAdmin } from "@/lib/data/admin";
import { getProgram } from "@/lib/programs";
import type { ReviewStatus } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { ModerationActions } from "@/components/admin/ModerationActions";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
const STATUSES: ReviewStatus[] = ["pending_moderation", "pending_verification", "flagged", "approved", "rejected", "removed"];

export default async function ModerationQueue({ searchParams }: { searchParams: { status?: string } }) {
  const active = STATUSES.includes(searchParams.status as ReviewStatus) ? (searchParams.status as ReviewStatus) : undefined;
  const reviews = await getAllReviewsAdmin(active);

  return (
    <div>
      <h1 className="mb-4 font-display text-h3 font-extrabold">Moderation</h1>
      <p className="mb-5 text-meta-lg text-muted">Nothing is auto-published. Approve only genuine, first-hand reviews. Never reject a review because it is critical.</p>

      <nav aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/moderation" className={`rounded-full border px-3 py-1.5 text-meta-lg ${!active ? "border-brand bg-brand text-brand-fg" : "border-border hover:bg-surface-2"}`}>All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/moderation?status=${s}`} className={`rounded-full border px-3 py-1.5 text-meta-lg capitalize ${active === s ? "border-brand bg-brand text-brand-fg" : "border-border hover:bg-surface-2"}`}>{s.replace(/_/g, " ")}</Link>
        ))}
      </nav>

      {reviews.length === 0 ? (
        <p className="card p-8 text-center text-body text-muted">No reviews with this status.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating value={r.overallRating} size="sm" />
                    <span className="rounded-full border border-border px-2 py-0.5 text-meta capitalize text-muted">{r.status.replace(/_/g, " ")}</span>
                    {r.verified && <span className="rounded-full bg-success/10 px-2 py-0.5 text-meta text-success">Email verified</span>}
                    {r.reportCount > 0 && <span className="rounded-full bg-error/10 px-2 py-0.5 text-meta text-error">{r.reportCount} report(s)</span>}
                  </div>
                  <h2 className="mt-1.5 text-card font-semibold">{r.title}</h2>
                  <p className="text-meta text-muted">
                    {r.reviewerDisplayName} · {r.relationship.replace("_", " ")} · {formatDate(r.submittedAt)}
                    {r.programSlug && ` · ${getProgram(r.programSlug)?.title ?? r.programSlug}`}
                  </p>
                  <p className="mt-2 line-clamp-3 text-body text-fg-secondary">{r.body}</p>
                  {r.status === "approved" && <Link href={`/reviews/${r.slug}`} className="mt-2 inline-block text-meta-lg font-semibold text-brand hover:underline">View public page →</Link>}
                </div>
              </div>
              <ModerationActions reviewId={r.id} status={r.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
