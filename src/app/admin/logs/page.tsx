import { prisma } from "@/lib/db";
import { USE_SAMPLE_DATA } from "@/lib/site-config";
import { EmptyState } from "@/components/ui/States";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Audit log + synchronization log. Secrets are never written here. */
export default async function AdminLogs() {
  const demo = USE_SAMPLE_DATA;
  let audit: { action: string; targetId: string | null; detail: string | null; createdAt: Date }[] = [];
  let syncs: { sourceSlug: string; status: string; fetched: number; startedAt: Date; errorSummary: string | null }[] = [];

  if (!demo) {
    [audit, syncs] = await Promise.all([
      prisma.auditLog.findMany({
        select: { action: true, targetId: true, detail: true, createdAt: true },
        orderBy: { createdAt: "desc" }, take: 50,
      }),
      prisma.syncJob.findMany({
        select: { sourceSlug: true, status: true, fetched: true, startedAt: true, errorSummary: true },
        orderBy: { startedAt: "desc" }, take: 50,
      }),
    ]);
  }

  return (
    <div>
      <h1 className="mb-2 font-display text-h3 font-extrabold">Audit &amp; sync logs</h1>
      <p className="mb-8 text-meta-lg text-muted">Every moderation and source change is recorded in MySQL. API keys and OAuth tokens are never logged.</p>

      {demo && (
        <p className="mb-8 rounded-xl border border-warning/30 bg-warning/10 p-4 text-meta-lg text-warning">
          Sample-data mode is on, so logs aren&apos;t read from MySQL here. Set <code>NEXT_PUBLIC_USE_SAMPLE_DATA=false</code> with a live database to view the audit trail.
        </p>
      )}

      <h2 className="mb-3 text-card font-bold">Audit log</h2>
      {audit.length ? (
        <ul className="mb-10 space-y-2">
          {audit.map((a, i) => (
            <li key={i} className="card flex items-center justify-between gap-3 p-3 text-meta-lg">
              <span><span className="font-mono text-meta">{a.action}</span> {a.detail && <span className="text-muted">— {a.detail}</span>}</span>
              <time className="shrink-0 text-meta text-muted">{formatDate(a.createdAt.toISOString())}</time>
            </li>
          ))}
        </ul>
      ) : <div className="mb-10"><EmptyState title="No audit entries" description="Moderation and source changes are recorded here." /></div>}

      <h2 className="mb-3 text-card font-bold">Synchronization log</h2>
      {syncs.length ? (
        <ul className="space-y-2">
          {syncs.map((s, i) => (
            <li key={i} className="card flex items-center justify-between gap-3 p-3 text-meta-lg">
              <span>{s.sourceSlug} · <span className={s.status === "success" ? "text-success" : "text-error"}>{s.status}</span> · {s.fetched} fetched
                {s.errorSummary && <span className="text-muted"> — {s.errorSummary}</span>}</span>
              <time className="shrink-0 text-meta text-muted">{formatDate(s.startedAt.toISOString())}</time>
            </li>
          ))}
        </ul>
      ) : <EmptyState title="No sync jobs yet" description="Sync runs appear here once a source has a working API connector and credentials." />}
    </div>
  );
}
