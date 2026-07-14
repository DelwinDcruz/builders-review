import { PROGRAMS } from "@/lib/programs";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { getSummaryByProgram } from "@/lib/data/repo";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPrograms() {
  const rows = await Promise.all(PROGRAMS.map(async (p) => ({ p, s: await getSummaryByProgram(p.slug) })));
  const byType = (t: string) => rows.filter((r) => r.p.type === t);
  const types = ["course", "internship", "program", "portfolio_service", "mentorship", "career_support", "community", "website"];

  return (
    <div>
      <h1 className="mb-2 font-display text-h3 font-extrabold">Programs & categories</h1>
      <p className="mb-8 text-meta-lg text-muted">
        Programs are managed in the <code>programs</code> table (seeded from <code>src/lib/programs.ts</code>) and categories in <code>review_categories</code>.
        Every program below exists on the official Portfolio Builders website — never add one that doesn&apos;t.
      </p>

      {types.map((t) => {
        const items = byType(t);
        if (!items.length) return null;
        return (
          <section key={t} className="mb-8">
            <h2 className="mb-3 text-card font-bold capitalize">{t.replace("_", " ")}</h2>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[600px] text-meta-lg">
                <thead className="bg-surface-2 text-left">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Title</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Slug</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Reviews</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Rating</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map(({ p, s }) => (
                    <tr key={p.slug}>
                      <th scope="row" className="px-4 py-3 text-left font-medium">{p.title}</th>
                      <td className="px-4 py-3 font-mono text-meta text-muted">{p.slug}</td>
                      <td className="px-4 py-3 tabular-nums">{formatNumber(s.count)}</td>
                      <td className="px-4 py-3 tabular-nums">{s.average !== null ? s.average.toFixed(1) : "—"}</td>
                      <td className="px-4 py-3">{p.active ? <Badge tone="success">Active</Badge> : <Badge>Disabled</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <h2 className="mb-3 mt-10 text-card font-bold">Review categories ({DEFAULT_CATEGORIES.length})</h2>
      <p className="mb-3 text-meta-lg text-muted">Administrators can add, rename, disable and reorder these in the <code>review_categories</code> table.</p>
      <ol className="grid gap-2 sm:grid-cols-2">
        {DEFAULT_CATEGORIES.map((c) => (
          <li key={c.key} className="card flex items-center justify-between gap-3 p-3 text-meta-lg">
            <span><span className="mr-2 tabular-nums text-muted">{c.order}.</span>{c.label}</span>
            {c.active ? <Badge tone="success">Active</Badge> : <Badge>Off</Badge>}
          </li>
        ))}
      </ol>
    </div>
  );
}
