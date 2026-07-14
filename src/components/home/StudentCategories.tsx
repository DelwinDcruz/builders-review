import { getLearnerSummary } from "@/lib/data/repo";
import { CATEGORY_MAP } from "@/lib/categories";
import { Section } from "@/components/ui/Section";
import { StarRating } from "@/components/ui/StarRating";
import { EmptyState } from "@/components/ui/States";
import { roundRating } from "@/lib/rating/engine";
import { pluralize } from "@/lib/format";

/** Student experience categories — what reviewers actually rated. */
export async function StudentCategories() {
  const s = await getLearnerSummary();
  const cats = s.categoryAverages.slice(0, 9);

  return (
    <Section eyebrow="Student experience" title="What students rate, category by category"
      description="Each category average is shown with the number of ratings behind it — so you can see how much weight to give it.">
      {cats.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <div key={c.categoryKey} className="card p-6">
              <h3 className="text-card font-semibold">{CATEGORY_MAP[c.categoryKey]?.label ?? c.categoryKey}</h3>
              <p className="mt-1 text-meta text-muted">{CATEGORY_MAP[c.categoryKey]?.description}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <StarRating value={c.average} size="sm" />
                <span className="text-meta text-muted">{pluralize(c.count, "rating")}</span>
              </div>
              <span className="sr-only">{roundRating(c.average).toFixed(1)} out of 5</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No category ratings yet" description="Category ratings appear once reviewers start rating individual aspects of their experience." />
      )}
    </Section>
  );
}
